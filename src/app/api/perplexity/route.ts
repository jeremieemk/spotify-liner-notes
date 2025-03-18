import { NextRequest, NextResponse } from "next/server";
import { getPrompt } from "../getPrompt";

// Define types for the request body
interface RequestBody {
  artist: string;
  song: string;
  album?: string | null;
  lyrics?: string | null;
  discogsCredits?: DiscogsCredits | null;
  musicbrainzCredits?: MusicBrainzCredits | null;
}

// Define types for the credits object
interface DiscogsCredits {
  albumCredits?: CreditItem[];
  trackCredits?: CreditItem[];
  [key: string]: unknown; // Changed from any to unknown
}

interface CreditItem {
  name: string;
  anv?: string;
  join?: string;
  role: string;
  tracks?: string;
  id?: number;
  resource_url?: string;
}

interface ArtistCredit {
  name?: string;
  artist?: { name: string };
  joinphrase?: string;
}

interface Recording {
  title?: string;
  'first-release-date'?: string;
  'artist-credit'?: ArtistCredit[];
}

interface Label {
  name?: string;
}

interface LabelInfo {
  label?: Label;
  catalog_number?: string;
}

interface Release {
  title?: string;
  date?: string;
  country?: string;
  'label-info'?: LabelInfo[];
}

interface Artist {
  name: string;
}

interface RelationshipTarget {
  name?: string;
  title?: string;
}

interface Relationship {
  artist?: Artist;
  target?: RelationshipTarget;
  type?: string;
}

interface MusicBrainzCredits {
  recording?: Recording;
  release?: Release;
  artist?: Artist;
  relationships?: Record<string, Relationship[]>;
  [key: string]: unknown; // Changed from any to unknown
}

// Define types for the Perplexity API response
interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();
    const { artist, song, album, lyrics, discogsCredits, musicbrainzCredits } = body;

    // Validate required fields
    if (!artist || !song) {
      return NextResponse.json(
        { error: "Artist and song are required" },
        { status: 400 }
      );
    }

    const prompt: string = getPrompt(
      artist,
      song,
      album || undefined,
      lyrics,
      formatDiscogsCredits(discogsCredits),
      formatMusicBrainzCredits(musicbrainzCredits)
    );

    // Call the Perplexity API
    const perplexityResponse = await fetch(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are a knowledgeable music expert. Provide concise but detailed information about songs and artists.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          top_p: 0.9,
        }),
      }
    );

    if (!perplexityResponse.ok) {
      let errorData: string;
      try {
        const contentType = perplexityResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = JSON.stringify(await perplexityResponse.json());
        } else {
          errorData = await perplexityResponse.text();
        }
      } catch {
        errorData = "Unable to parse error response";
      }
      throw new Error(
        `Perplexity API error [${perplexityResponse.status}]: ${errorData}`
      );
    }


    const data: PerplexityResponse = await perplexityResponse.json();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Updated helper function to format the credits object into readable text
function formatDiscogsCredits(credits: DiscogsCredits | null | undefined): string {
  if (!credits || Object.keys(credits).length === 0) {
    return "No Discogs credits information available";
  }

  let result = "Discogs credits information:\n";

  // Handle the specific structure with albumCredits and trackCredits arrays
  if (credits.albumCredits || credits.trackCredits) {
    // Process album credits
    if (
      Array.isArray(credits.albumCredits) &&
      credits.albumCredits.length > 0
    ) {
      // Group credits by role for better organization
      const roleGroups: Record<string, string[]> = {};

      credits.albumCredits.forEach((credit: CreditItem) => {
        const role = credit.role || "Other";
        const name = credit.name || "";

        if (!roleGroups[role]) {
          roleGroups[role] = [];
        }

        if (name) {
          roleGroups[role].push(name);
        }
      });

      result += "\nAlbum Credits:\n";
      Object.entries(roleGroups).forEach(([role, names]) => {
        result += `  ${role}: ${names.join(", ")}\n`;
      });
    }

    // Process track credits
    if (
      Array.isArray(credits.trackCredits) &&
      credits.trackCredits.length > 0
    ) {
      // Group credits by role similarly to album credits
      const roleGroups: Record<string, string[]> = {};

      credits.trackCredits.forEach((credit: CreditItem) => {
        const role = credit.role || "Other";
        const name = credit.name || "";

        if (!roleGroups[role]) {
          roleGroups[role] = [];
        }

        if (name) {
          roleGroups[role].push(name);
        }
      });

      result += "\nTrack Credits:\n";
      Object.entries(roleGroups).forEach(([role, names]) => {
        result += `  ${role}: ${names.join(", ")}\n`;
      });
    }
  } else {
    // Fallback to the original implementation for other credit structures
    Object.entries(credits).forEach(([role, people]) => {
      if (Array.isArray(people) && people.length > 0) {
        result += `${role}: ${people.join(", ")}\n`;
      } else if (typeof people === "string") {
        result += `${role}: ${people}\n`;
      } else if (typeof people === "object" && people !== null) {
        result += `${role}:\n`;
        Object.entries(people).forEach(([subRole, subPeople]) => {
          if (Array.isArray(subPeople)) {
            result += `  ${subRole}: ${subPeople.join(", ")}\n`;
          } else if (typeof subPeople === "string") {
            result += `  ${subRole}: ${subPeople}\n`;
          }
        });
      }
    });
  }

  return result;
}

// Helper function to format the MusicBrainz data into readable text
function formatMusicBrainzCredits(credits: MusicBrainzCredits | null | undefined): string {
  if (!credits || Object.keys(credits).length === 0) {
    return "No MusicBrainz credits information available";
  }

  let result = "MusicBrainz credits information:\n";

  // Format recording information
  if (credits.recording) {
    result += "\nRecording Information:\n";
    result += `Title: ${credits.recording.title || "Unknown"}\n`;
    result += `First release date: ${credits.recording["first-release-date"] || "Unknown"}\n`;
    
    // Add artist credits if available
    if (credits.recording["artist-credit"] && credits.recording["artist-credit"].length > 0) {
      result += "Artist Credits:\n";
      credits.recording["artist-credit"].forEach((credit: ArtistCredit) => {
        result += `- ${credit.name || "Unknown"}\n`;
      });
    }
  }

  // Format release information
  if (credits.release) {
    result += "\nRelease Information:\n";
    result += `Title: ${credits.release.title || "Unknown"}\n`;
    result += `Date: ${credits.release.date || "Unknown"}\n`;
    result += `Country: ${credits.release.country || "Unknown"}\n`;
    
    // Add label information if available
    if (credits.release["label-info"] && credits.release["label-info"].length > 0) {
      result += "Labels:\n";
      credits.release["label-info"].forEach((label: LabelInfo) => {
        if (label.label) {
          result += `- ${label.label.name || "Unknown"}\n`;
        }
      });
    }
  }

  // Format relationships
  if (credits.relationships) {
    result += "\nRelationships:\n";
    for (const type in credits.relationships) {
      result += `${type}:\n`;
      credits.relationships[type].forEach((rel: Relationship) => {
        if (rel.artist) {
          result += `- ${rel.artist.name} (${rel.type || "Unknown"})\n`;
        } else if (rel.target) {
          result += `- ${rel.target.name || rel.target.title || "Unknown"} (${rel.type || "Unknown"})\n`;
        }
      });
    }
  }

  return result;
}
