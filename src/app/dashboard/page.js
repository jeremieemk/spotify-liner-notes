"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import NoTrackPlaying from "./components/NoTrackPlaying";
import TrackInfo from "./components/TrackInfos";
import TrackDiscogsCredits from "./components/TrackDiscogsCredits";
import TrackOpenAiInfo from "./components/TrackOpenAiInfo";
import ArtistBio from "./components/ArtistBio";
import TrackMusicBrainzCredits from "./components/TrackMusicBrainzCredits";
import ProgressBar from "./components/ProgressBar";
import TrackPerplexityInfo from "./components/TrackPerplexityInfo.tsx";
import TrackMistralInfo from "./components/TrackMistralInfo";
import SpotifyControls from "./components/SpotifyControls";
import TrackLyrics from "./components/TrackLyrics";
import TrackAudioContent from "./components/TrackAudioContent";

import { useSpotifyData } from "../hooks/useSpotifyData";
import { useDiscogsData } from "../hooks/useDiscogsData";
import { useLastFmData } from "../hooks/useLastFmData";
import { useMusicBrainzData } from "../hooks/useMusicBrainzData";
import { useChatGPTData } from "../hooks/useChatGPTData";
import { usePerplexityData } from "../hooks/usePerplexityData";
import { useMistralData } from "../hooks/useMistralData";
import { useLyrics } from "../hooks/useLyrics";

import { getCleanTrackDetails, getMaxCredits } from "../utils/trackUtils";

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

  const { spotifyData, trackProgress, isPlaying } = useSpotifyData(token);
  const { artist, song, album } = spotifyData
    ? getCleanTrackDetails(spotifyData)
    : { artist: "", song: "", album: "" };
  const { lyrics, lyricsLoading, error } = useLyrics(artist, song);
  const { mostWantedRelease, oldestRelease } = useDiscogsData(spotifyData);
  const maxCreditsData = getMaxCredits(
    { mostWantedRelease, oldestRelease },
    song
  );
  const { artistBio } = useLastFmData({ artist, song });
  const { musicBrainzData } = useMusicBrainzData({ artist, song, album });
  // const { chatGPTResponse, isLoading, error } = useChatGPTData(
  //   artist,
  //   song,
  //   album
  // );
  const {
    perplexityResponse,
    isLoading: perplexityLoading,
    error: perplexityError,
  } = usePerplexityData(artist, song, album, lyrics, lyricsLoading);
  // const {
  //   mistralResponse,
  //   isLoading: mistralLoading,
  //   error: mistralError,
  // } = useMistralData(artist, song, album);

  if (!token) return <LoadingSpinner />;

  if (!spotifyData) return <NoTrackPlaying />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <ProgressBar
            maxValue={spotifyData?.duration_ms}
            currentValue={trackProgress}
          />
          <SpotifyControls token={token} isPlaying={isPlaying} />
          <TrackAudioContent 
            perplexityData={perplexityResponse}
            isLoading={perplexityLoading}
          />
          <TrackInfo spotifyData={spotifyData} song={song} artist={artist} />
          {/* <TrackMistralInfo
            data={mistralResponse}
            isLoading={mistralLoading}
            error={mistralError}
          /> */}
          <TrackPerplexityInfo
            data={perplexityResponse}
            isLoading={perplexityLoading}
            error={perplexityError}
          />
          {/* <TrackOpenAiInfo
            data={chatGPTResponse}
            isLoading={isLoading}
            error={error}
          /> */}
          <TrackDiscogsCredits
            releaseData={maxCreditsData.release}
            songName={song}
          />
          {musicBrainzData?.recording && (
            <TrackMusicBrainzCredits data={musicBrainzData.recording} />
          )}
          <ArtistBio bio={artistBio} />
          <TrackLyrics lyrics={lyrics} isLoading={lyricsLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
