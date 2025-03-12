import { NextRequest, NextResponse } from "next/server";
import { getPrompt } from "../getPrompt";

// Define types for the request body
interface RequestBody {
  artist: string;
  song: string;
  album?: string | null;
  lyrics?: string | null;
  credits?: DiscogsCredits | null;
  musicbrainzData?: MusicBrainzData | null;
}

// Define types for the credits object
interface DiscogsCredits {
  albumCredits?: CreditItem[];
  trackCredits?: CreditItem[];
  [key: string]: any; // For fallback handling of other credit structures
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

interface MusicBrainzData {
  recording?: any;
  release?: any;
  artist?: any;
  relationships?: any;
  [key: string]: any; // For fallback handling of other structures
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
    const { artist, song, album, lyrics, credits, musicbrainzData } = body;

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
      formatCredits(credits),
      formatMusicBrainzData(musicbrainzData)
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
      const errorData = await perplexityResponse.json();
      throw new Error(`Perplexity API error: ${JSON.stringify(errorData)}`);
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
function formatCredits(credits: DiscogsCredits | null | undefined): string {
  if (!credits || Object.keys(credits).length === 0) {
    return "No credits information available";
  }

  let result = "Credits information:\n";

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
function formatMusicBrainzData(data: MusicBrainzData | null | undefined): string {
  if (!data || Object.keys(data).length === 0) {
    return "No MusicBrainz information available";
  }

  let result = "MusicBrainz information:\n";

  // Format recording information
  if (data.recording) {
    result += "\nRecording Information:\n";
    result += `Title: ${data.recording.title || "Unknown"}\n`;
    result += `First release date: ${data.recording["first-release-date"] || "Unknown"}\n`;
    
    // Add artist credits if available
    if (data.recording["artist-credit"] && data.recording["artist-credit"].length > 0) {
      result += "Artist Credits:\n";
      data.recording["artist-credit"].forEach((credit: any) => {
        result += `- ${credit.name || "Unknown"}\n`;
      });
    }
  }

  // Format release information
  if (data.release) {
    result += "\nRelease Information:\n";
    result += `Title: ${data.release.title || "Unknown"}\n`;
    result += `Date: ${data.release.date || "Unknown"}\n`;
    result += `Country: ${data.release.country || "Unknown"}\n`;
    
    // Add label information if available
    if (data.release["label-info"] && data.release["label-info"].length > 0) {
      result += "Labels:\n";
      data.release["label-info"].forEach((label: any) => {
        if (label.label) {
          result += `- ${label.label.name || "Unknown"}\n`;
        }
      });
    }
  }

  // Format relationships
  if (data.relationships) {
    result += "\nRelationships:\n";
    // Process relationships based on your MusicBrainz data structure
    // This will depend on what relationships you're getting from the API
    for (const type in data.relationships) {
      result += `${type}:\n`;
      data.relationships[type].forEach((rel: any) => {
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
