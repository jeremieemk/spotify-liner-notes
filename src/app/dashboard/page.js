"use client";

import { useEffect, useState } from "react";
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

import { useChatGPTData } from "../hooks/useChatGPTData";
import { useDiscogsData } from "../hooks/useDiscogsData";
import { useLastFmData } from "../hooks/useLastFmData";
import { useLyrics } from "../hooks/useLyrics";
import { useMistralData } from "../hooks/useMistralData";
import { useMusicBrainzData } from "../hooks/useMusicBrainzData";
import { usePerplexityData } from "../hooks/usePerplexityData";
import { useSpotifyData } from "../hooks/useSpotifyData";

import { getCleanTrackDetails, getMaxCredits } from "../utils/trackUtils";

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] = useState(false);
  const [lastTrackData, setLastTrackData] = useState(null);
  // No need to track Spotify state at Dashboard level anymore

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      window.location.href = "/";
    }
  }, []);

  const { spotifyData, trackProgress, isPlaying } = useSpotifyData(token);
  
  // Keep track of the last valid track data
  useEffect(() => {
    if (spotifyData) {
      setLastTrackData(spotifyData);
    }
  }, [spotifyData]);
  
  // Handle audio commentary state changes
  const handleAudioCommentaryChange = (isPlaying) => {
    setIsAudioCommentaryPlaying(isPlaying);
  };
  
  // Use either current or last track data
  const activeData = spotifyData || (isAudioCommentaryPlaying ? lastTrackData : null);
  
  const { artist, song, album } = activeData
    ? getCleanTrackDetails(activeData)
    : { artist: "", song: "", album: "" };
    
  const { lyrics, lyricsLoading, error: lyricsError } = useLyrics(artist, song);
  const { mostWantedRelease, oldestRelease } = useDiscogsData(activeData);
  const maxCreditsData = getMaxCredits(
    { mostWantedRelease, oldestRelease },
    song
  );
  const { artistBio } = useLastFmData({ artist, song });
  const { musicBrainzData } = useMusicBrainzData({ artist, song, album });
  const {
    perplexityResponse,
    isLoading: perplexityLoading,
    error: perplexityError,
  } = usePerplexityData(artist, song, album, lyrics, lyricsLoading);

  const { chatGPTResponse, isLoading: chatGPTLoading } =
    useChatGPTData(perplexityResponse);

  const {
    mistralResponse,
    isLoading: mistralLoading,
    error: mistralError,
  } = useMistralData(artist, song, album);

  if (!token) return <LoadingSpinner />;

  // Only show NoTrackPlaying if no active data
  if (!activeData) return <NoTrackPlaying />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <ProgressBar
            maxValue={activeData?.duration_ms}
            currentValue={trackProgress || 0}
          />

          <SpotifyControls token={token} isPlaying={isPlaying} />

          <TrackAudioContent
            llmData={chatGPTResponse}
            isLoading={chatGPTLoading}
            onAudioPlayingChange={handleAudioCommentaryChange}
            token={token}
            isSpotifyPlaying={isPlaying}
          />

          <TrackInfo spotifyData={activeData} song={song} artist={artist} />

          <TrackLLMInfo
            perplexityData={perplexityResponse}
            perplexityLoading={perplexityLoading}
            perplexityError={perplexityError}
            mistralData={mistralResponse}
            mistralLoading={mistralLoading}
            mistralError={mistralError}
          />

          <TrackDiscogsCredits
            releaseData={maxCreditsData.release}
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