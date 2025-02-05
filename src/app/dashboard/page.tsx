"use client";

import { useEffect, useState } from "react";
import { useSpotifyData } from "../hooks/useSpotifyData";
import { getCleanTrackDetails } from "../utils/trackUtils";

function Dashboard() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // get token from localStorage on component mount
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      // redirect to login if no token found
      window.location.href = "/";
    }
  }, []);

  const {spotifyData, error} = useSpotifyData(token);
  console.log('spotifyData', spotifyData);
  console.log('error', error);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!spotifyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">No track playing</h1>
          <p className="text-gray-600">
            Play a song on Spotify to see its details
          </p>
        </div>
      </div>
    );
  }

  const { artist, song } = getCleanTrackDetails(spotifyData);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {spotifyData.album?.images?.[0]?.url && (
              <img
                src={spotifyData.album.images[0].url}
                alt={`${song} album art`}
                className="w-64 h-64 rounded-lg shadow-2xl"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{song}</h1>
              <h2 className="text-2xl text-gray-300 mb-4">{artist}</h2>

              <div className="space-y-2 text-gray-400">
                <p>Album: {spotifyData.album?.name}</p>
                <p>Release Date: {spotifyData.album?.release_date}</p>
                <p>
                  Duration: {Math.floor(spotifyData.duration_ms / 1000 / 60)}:
                  {String(
                    Math.floor((spotifyData.duration_ms / 1000) % 60)
                  ).padStart(2, "0")}
                </p>
              </div>

              {spotifyData.preview_url && (
                <div className="mt-6">
                  <audio
                    controls
                    src={spotifyData.preview_url}
                    className="w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
