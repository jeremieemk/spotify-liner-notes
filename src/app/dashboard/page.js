"use client";

import ArtistBio from "./components/ArtistBio";
import LoadingSpinner from "./components/LoadingSpinner";
import NoTrackPlaying from "./components/NoTrackPlaying";
import ProgressBar from "./components/ProgressBar";
import SpotifyControls from "./components/SpotifyControls";
import TrackAudioContent from "./components/TrackAudioContent";
import TrackDiscogsCredits from "./components/TrackDiscogsCredits";
import TrackInfo from "./components/TrackInfos";
import TrackLLMInfo from "./components/TrackLLMInfo";
import TrackLyrics from "./components/TrackLyrics";
import TrackMusicBrainzCredits from "./components/TrackMusicBrainzCredits";

import { useAuth } from "../context/AuthContext";
import { useSpotify } from "../context/SpotifyContext";
import { usePlayback } from "../context/PlaybackContext";
import { useSongData } from "../context/SongDataContext";

const Dashboard = () => {
  const { token, isLoading: authLoading } = useAuth();
  const { spotifyData, artist, song } = useSpotify();

  const {
    trackProgress,
    isPlaying,
    isAudioCommentaryPlaying,
    handleAudioCommentaryChange,
  } = usePlayback();

  const {
    lyrics,
    lyricsLoading,
    lyricsError,
    discogsCredits,
    artistBio,
    musicBrainzData,
    perplexityResponse,
    perplexityLoading,
    perplexityError,
    chatGPTResponse,
    chatGPTLoading,
    mistralResponse,
    mistralLoading,
    mistralError
  } = useSongData();

  if (authLoading) return <LoadingSpinner />;
  
  if (!token) return <LoadingSpinner />;

  if (!spotifyData) return <NoTrackPlaying />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <ProgressBar
            maxValue={spotifyData?.duration_ms}
            currentValue={trackProgress || 0}
          />

          <SpotifyControls
            token={token}
            isPlaying={isPlaying}
            isAudioCommentaryPlaying={isAudioCommentaryPlaying}
          />

          <TrackAudioContent
            llmData={chatGPTResponse}
            isLoading={chatGPTLoading}
            onAudioPlayingChange={handleAudioCommentaryChange}
            token={token}
            isSpotifyPlaying={isPlaying}
          />

          <TrackInfo spotifyData={spotifyData} song={song} artist={artist} />

          <TrackLLMInfo
            perplexityData={perplexityResponse}
            perplexityLoading={perplexityLoading}
            perplexityError={perplexityError}
            mistralData={mistralResponse}
            mistralLoading={mistralLoading}
            mistralError={mistralError}
          />

          <TrackDiscogsCredits
            releaseData={discogsCredits.release}
            songName={song}
          />

          {musicBrainzData?.recording && (
            <TrackMusicBrainzCredits data={musicBrainzData.recording} />
          )}

          {artistBio && <ArtistBio bio={artistBio} />}

          <TrackLyrics
            lyrics={lyrics}
            isLoading={lyricsLoading}
            error={lyricsError}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
