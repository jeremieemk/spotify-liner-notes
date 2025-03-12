import { Discojs } from "discojs";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trackName = searchParams.get("track");
  const artistName = searchParams.get("artist");
  
  if (!trackName || !artistName) {
    return NextResponse.json({ error: "Missing track or artist parameter" }, { status: 400 });
  }

  const userToken = process.env.DISCOGS_API_KEY?.trim();
  if (!userToken) {
    return NextResponse.json({ error: "Invalid Discogs API token" }, { status: 500 });
  }

  const discogsApi = new Discojs({ userToken });

  try {
    const searchResults = await discogsApi.searchDatabase({
      artist: artistName,
      track: trackName,
      type: "release",
    });

    if (searchResults.results.length > 0) {
      // Sort by community want count
      const sortedByWants = [...searchResults.results].sort(
        (a, b) => (b.community?.want || 0) - (a.community?.want || 0)
      );

      // Sort by year (oldest first)
      const sortedByYear = [...searchResults.results]
        .filter((release) => release.year)
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));

      // Fetch details in parallel
      let mostWantedRelease = null;
      let oldestRelease = null;
      
      if (sortedByWants[0] && sortedByYear[0]) {
        [mostWantedRelease, oldestRelease] = await Promise.all([
          discogsApi.getRelease(sortedByWants[0].id),
          discogsApi.getRelease(sortedByYear[0].id)
        ]);
      }

      return NextResponse.json({
        discogsData: searchResults.results,
        mostWantedRelease,
        oldestRelease,
      });
    } else {
      return NextResponse.json({ error: "No matching releases found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Discogs API Error:", error);
    return NextResponse.json({ 
      error: error.message.includes("authentication")
        ? "Authentication failed. Check your Discogs API token."
        : `API Error: ${error.message}`
    }, { status: 500 });
  }
}
