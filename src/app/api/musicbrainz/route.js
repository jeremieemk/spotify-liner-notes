import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');
  const album = searchParams.get('album');
  
  if (!artist || !title) {
    return NextResponse.json(
      { error: "Missing artist or title parameter" },
      { status: 400 }
    );
  }

  try {
    // Set a custom user agent as required by MusicBrainz API
    const appName = 'SpotifyLinerNotes';
    const appVersion = '1.0';
    const contactInfo = process.env.CONTACT_EMAIL || 'contact@example.com';
    const userAgent = `${appName}/${appVersion} (${contactInfo})`;
    
    // Search for the recording
    const searchUrl = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(`artist:${artist} AND recording:${title}`)}&fmt=json`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': userAgent
      }
    });
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Find the most relevant recording
    const recordings = data.recordings || [];
    const recording = recordings.length > 0 ? recordings[0] : null;
    
    return NextResponse.json({
      recording,
      count: recordings.length
    });
  } catch (error) {
    console.error('Error fetching from MusicBrainz:', error);
    return NextResponse.json(
      { error: "Failed to fetch data from MusicBrainz" },
      { status: 500 }
    );
  }
}
