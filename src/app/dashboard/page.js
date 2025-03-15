"use client";

import CommentarySettings from "./components/CommentarySettings";
import LoadingSpinner from "./components/LoadingSpinner";
import NoTrackPlaying from "./components/NoTrackPlaying";
import ProgressBar from "./components/ProgressBar";
import SpotifyControls from "./components/SpotifyControls";
import TrackDiscogsCredits from "./components/TrackDiscogsCredits";
import TrackInfo from "./components/TrackInfos";
import TrackLLMInfo from "./components/TrackLLMInfo";

import { useAuth } from "../context/AuthContext";
import { useSongData } from "../context/SongDataContext";

const Dashboard = () => {
  const { token, isLoading: authLoading } = useAuth();
  const { spotifyData } = useSongData();

  if (authLoading) return <LoadingSpinner />;

  if (!token) return <LoadingSpinner />;

  if (!spotifyData) return <NoTrackPlaying />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <ProgressBar />
          <CommentarySettings/>
          <SpotifyControls />
          <TrackInfo />
          <TrackLLMInfo />
          <TrackDiscogsCredits />
          {/* {musicBrainzData?.recording && (
            <TrackMusicBrainzCredits data={musicBrainzData.recording} />
          )}
          {artistBio && <ArtistBio bio={artistBio} />}
          {lyrics && (
            <TrackLyrics
              lyrics={lyrics}
              isLoading={lyricsLoading}
              error={lyricsError}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
