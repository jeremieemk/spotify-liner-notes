import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const song = searchParams.get('song');
  const album = searchParams.get('album');

  if (!artist || !song) {
    return NextResponse.json(
      { error: "Artist and song are required parameters" }, 
      { status: 400 }
    );
  }

  try {
    // 1) Try a refined query: look for official recordings on the specified album
    let searchQuery = encodeURIComponent(
      `recording:"${song}" AND artist:"${artist}" AND release:"${album}" AND status:official`
    );

    let recordingSearchResponse = await fetch(
      `https://musicbrainz.org/ws/2/recording/?query=${searchQuery}&fmt=json`,
      {
        headers: {
          "User-Agent": "my-app/1.0.0 (myemail@example.com)",
        },
      }
    );
    let recordingSearchData = await recordingSearchResponse.json();

    // 2) If we didn't find anything, fall back to a simpler query
    if (!recordingSearchData.recordings?.length) {
      searchQuery = encodeURIComponent(
        `recording:"${song}" AND artist:"${artist}"`
      );
      recordingSearchResponse = await fetch(
        `https://musicbrainz.org/ws/2/recording/?query=${searchQuery}&fmt=json`,
        {
          headers: {
            "User-Agent": "my-app/1.0.0 (myemail@example.com)",
          },
        }
      );
      recordingSearchData = await recordingSearchResponse.json();
    }

    // 3) Pick the best match from the array of recordings
    let detailedRecordingData = null;
    if (recordingSearchData?.recordings?.length) {
      // Try to find a non-live, official match if possible
      let chosenRecording = recordingSearchData.recordings.find((rec) => {
        const isLive = (rec.disambiguation || "").toLowerCase().includes("live");
        const hasOfficialRelease = rec.releases?.some(
          (r) => r.status && r.status.toLowerCase() === "official"
        );
        return !isLive && hasOfficialRelease;
      });

      // Fallback to the first if no "best match"
      if (!chosenRecording) {
        chosenRecording = recordingSearchData.recordings[0];
      }

      // Now fetch detailed info for that chosen recording
      const detailedResponse = await fetch(
        `https://musicbrainz.org/ws/2/recording/${chosenRecording.id}?inc=artists+artist-credits+work-rels+work-level-rels+artist-rels+label-rels+instrument-rels+url-rels+releases&fmt=json`,
        {
          headers: {
            "User-Agent": "my-app/1.0.0 (myemail@example.com)",
          },
        }
      );
      detailedRecordingData = await detailedResponse.json();
    }

    // 4) Optionally fetch release-level data
    let detailedReleaseData = null;
    if (album) {
      const releaseSearchQuery = encodeURIComponent(
        `release:"${album}" AND artist:"${artist}"`
      );
      const releaseSearchResponse = await fetch(
        `https://musicbrainz.org/ws/2/release/?query=${releaseSearchQuery}&fmt=json`,
        {
          headers: {
            "User-Agent": "my-app/1.0.0 (myemail@example.com)",
          },
        }
      );
      const releaseSearchData = await releaseSearchResponse.json();

      if (releaseSearchData?.releases?.length) {
        // Pick an official release if possible
        let chosenRelease = releaseSearchData.releases.find(
          (r) => r.status && r.status.toLowerCase() === "official"
        );
        if (!chosenRelease) {
          chosenRelease = releaseSearchData.releases[0];
        }

        const detailedResponse = await fetch(
          `https://musicbrainz.org/ws/2/release/${chosenRelease.id}?inc=artists+artist-credits+work-rels+recording-level-rels+work-level-rels+artist-rels+label-rels+instrument-rels+url-rels&fmt=json`,
          {
            headers: {
              "User-Agent": "my-app/1.0.0 (myemail@example.com)",
            },
          }
        );
        detailedReleaseData = await detailedResponse.json();
      }
    }

    // 5) If we have neither a detailed release nor a recording, show error
    if (!detailedReleaseData && !detailedRecordingData) {
      return NextResponse.json(
        { error: "No matching recording found" }, 
        { status: 404 }
      );
    } else {
      return NextResponse.json({
        musicBrainzData: {
          recording: detailedRecordingData,
          release: detailedReleaseData,
        }
      });
    }
  } catch (err) {
    console.error("MusicBrainz API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch data from MusicBrainz" }, 
      { status: 500 }
    );
  }
}
