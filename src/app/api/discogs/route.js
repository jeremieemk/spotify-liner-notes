import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const album = searchParams.get('album');
  const title = searchParams.get('title');
  
  if (!artist || (!album && !title)) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Use environment variables for authentication
  const key = process.env.DISCOGS_CONSUMER_KEY;
  const secret = process.env.DISCOGS_CONSUMER_SECRET;
  
  if (!key || !secret) {
    return NextResponse.json(
      { error: "Discogs API credentials not configured" },
      { status: 500 }
    );
  }

  try {
    // Try to find by release first
    const searchTerm = `${artist} ${album || title}`;
    const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(searchTerm)}&type=release&key=${key}&secret=${secret}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Discogs API error: ${data.message}`);
    }
    
    // Process the results to find most relevant releases
    const releases = data.results || [];
    const mostWantedRelease = releases.length > 0 ? releases[0] : null;
    
    // Find the oldest release if there are multiple
    let oldestRelease = null;
    if (releases.length > 1) {
      oldestRelease = releases.reduce((oldest, current) => {
        const currentYear = current.year ? parseInt(current.year) : 9999;
        const oldestYear = oldest.year ? parseInt(oldest.year) : 9999;
        return currentYear < oldestYear ? current : oldest;
      }, releases[0]);
    }
    
    // If mostWanted and oldest are the same, set oldest to null
    if (mostWantedRelease && oldestRelease && mostWantedRelease.id === oldestRelease.id) {
      oldestRelease = null;
    }

    return NextResponse.json({
      mostWantedRelease,
      oldestRelease
    });
  } catch (error) {
    console.error('Error fetching from Discogs:', error);
    return NextResponse.json(
      { error: "Failed to fetch data from Discogs" },
      { status: 500 }
    );
  }
}
