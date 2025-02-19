"use client";

import { useState, useEffect } from "react";

import LoadingSpinner from "./components/loadingSpinner";
import NoTrackPlaying from "./components/NoTrackPlaying";
import TrackInfo from "./components/TrackInfos";
import TrackDiscogsCredits from "./components/TrackDiscogsCredits";
import ArtistBio from "./components/ArtistBio";
import TrackMusicBrainzCredits from "./components/TrackMusicBrainzCredits";

import { useSpotifyData } from "../hooks/useSpotifyData";
import { useDiscogsData } from "../hooks/useDiscogsData";
import { useLastFmData } from "../hooks/useLastFmData";
import { useMusicBrainzData } from "../hooks/useMusicBrainzData";

import { getCleanTrackDetails, getMaxCredits } from "../utils/trackUtils";

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [chatGPTResponse, setChatGPTResponse] = useState<string>("");
  const [isLoadingGPT, setIsLoadingGPT] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      window.location.href = "/";
    }
  }, []);

  const { spotifyData } = useSpotifyData(token);
  const { mostWantedRelease, oldestRelease } = useDiscogsData(spotifyData);
  const { artist, song, album } = spotifyData
    ? getCleanTrackDetails(spotifyData)
    : { artist: "", song: "", album: "" };
  const { artistBio } = useLastFmData({ artist, song });
  const { musicBrainzData } = useMusicBrainzData({ artist, song, album });

  useEffect(() => {
    async function fetchChatGPTData() {
      if (!artist || !song) return;

      setIsLoadingGPT(true);
      try {
        const response = await getChatGPTData(artist, song, album);
        // Extract just the response content, not the whole prompt
        const content = response?.data?.choices?.[0]?.message?.content || "";
        console.log("ChatGPT response:", content);
        setChatGPTResponse(content);
      } catch (error) {
        console.error("Error fetching ChatGPT data:", error);
        setChatGPTResponse("Failed to load track information.");
      } finally {
        setIsLoadingGPT(false);
      }
    }

    if (artist && song) {
      fetchChatGPTData();
    }
  }, [artist, song]);

  if (!token) return <LoadingSpinner />;
  if (!spotifyData) return <NoTrackPlaying />;
  const maxCreditsData = getMaxCredits(
    { mostWantedRelease, oldestRelease },
    song
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <TrackInfo spotifyData={spotifyData} song={song} artist={artist} />
          <div className="p-8">
            <h1 className="text-2xl font-bold">Track Details via ChatGPT</h1>
            <div className="mt-4 p-4 bg-gray-800 rounded">
              {isLoadingGPT ? (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : chatGPTResponse ? (
                <div className="whitespace-pre-wrap">{chatGPTResponse}</div>
              ) : (
                <p>No information available</p>
              )}
            </div>
          </div>
          <TrackDiscogsCredits
            releaseData={maxCreditsData.release}
            songName={song}
            year={
              oldestRelease?.year || maxCreditsData.release?.year || "Unknown"
            }
            country={
              oldestRelease?.country ||
              maxCreditsData.release?.country ||
              "Unknown"
            }
          />
          {musicBrainzData?.recording && (
            <TrackMusicBrainzCredits data={musicBrainzData.recording} />
          )}
          <ArtistBio bio={artistBio} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

async function getChatGPTData(artist: string, track: string, album: string) {
  const res = await fetch("http://localhost:3000/api/chatgpt", {
    // Adjust URL as needed
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artist, track, album }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch ChatGPT data");
  }
  return res.json();
}
