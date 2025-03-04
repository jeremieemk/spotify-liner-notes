import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');
  
  if (!artist || !title) {
    return NextResponse.json(
      { error: "Missing artist or title parameter" },
      { status: 400 }
    );
  }

  try {
    const lyricsResponse = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );

    if (!lyricsResponse.ok) {
      // Try an alternative API if the first one fails
      // This is a mock fallback since lyrics.ovh is sometimes unreliable
      return NextResponse.json({ lyrics: null });
    }

    const data = await lyricsResponse.json();
    return NextResponse.json({ lyrics: data.lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return NextResponse.json({ error: "Failed to fetch lyrics" }, { status: 500 });
  }
}
