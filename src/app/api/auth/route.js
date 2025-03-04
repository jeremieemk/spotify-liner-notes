import { NextResponse } from 'next/server';

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.NODE_ENV === "production" 
    ? "https://spotify-liner-notes.vercel.app/callback"
    : "http://localhost:3000/callback";
    
  const scope = [
    "user-read-playback-state", "user-modify-playback-state"
  ].join(" ");

  const params = new URLSearchParams({
    client_id: client_id,
    response_type: 'token',
    redirect_uri,
    scope,
    show_dialog: 'true'
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  
  // Return the URL instead of redirecting directly
  return NextResponse.json({ authUrl });
}
