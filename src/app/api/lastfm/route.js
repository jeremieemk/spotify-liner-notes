import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const apiKey = process.env.LASTFM_API_KEY;
  
  if (!artist) {
    return NextResponse.json(
      { error: "Missing artist parameter" },
      { status: 400 }
    );
  }
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "LastFM API key not configured" },
      { status: 500 }
    );
  }

  try {
    const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;
    
    const response = await fetch(infoUrl);
    
    if (!response.ok) {
      throw new Error(`LastFM API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const artistBio = data.artist?.bio?.content || null;
    
    return NextResponse.json({
      artistBio
    });
  } catch (error) {
    console.error('Error fetching from LastFM:', error);
    return NextResponse.json(
      { error: "Failed to fetch data from LastFM" },
      { status: 500 }
    );
  }
}
