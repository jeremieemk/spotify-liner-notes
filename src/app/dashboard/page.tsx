"use client";

import { useState, useEffect } from "react";

import LoadingSpinner from "./components/loadingSpinner";
import NoTrackPlaying from "./components/NoTrackPlaying";
import TrackInfo from "./components/TrackInfos";
import TrackCredits from "./components/TrackCredits";
import ArtistBio from "./components/ArtistBio";
import TrackMusicBrainzData from "./components/TrackMusicBrainzData";

import { useSpotifyData } from "../hooks/useSpotifyData";
import { useDiscogsData } from "../hooks/useDiscogsData";
import { useLastFmData } from "../hooks/useLastFmData";
import { useMusicBrainzData } from "../hooks/useMusicBrainzData";

import { getCleanTrackDetails } from "../utils/trackUtils";
import { getMaxCredits } from "../utils/trackUtils";

const Dashboard = () => {
  const [token, setToken] = useState("");

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
  const { artist, song } = spotifyData
    ? getCleanTrackDetails(spotifyData)
    : { artist: "", song: "" };
  const { artistBio } = useLastFmData({ artist, song });
  const { musicBrainzData } = useMusicBrainzData({ artist, song });
  console.log('musicBrainzData', musicBrainzData);

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
          <TrackMusicBrainzData data={musicBrainzData} />
          <TrackCredits
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
          <ArtistBio bio={artistBio} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
