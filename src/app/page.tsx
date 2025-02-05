// app/page.tsx
import { redirect } from 'next/navigation';

async function initiateSpotifyAuth() {
  'use server'
  
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.NODE_ENV === "production" 
    ? "https://spotify-liner-notes.netlify.app/callback"
    : "http://localhost:3000/callback";
    
  const scope = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-read-playback-state",
    "user-modify-playback-state"
  ].join(" ");

  const params = new URLSearchParams({
    client_id: client_id!,
    response_type: 'token',
    redirect_uri,
    scope,
    show_dialog: 'true'
  });

  redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form action={initiateSpotifyAuth}>
        <button type="submit" 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Log in to Spotify!
        </button>
      </form>
    </div>
  );
}