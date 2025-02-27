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
  const { lyrics, lyricsLoading, error: lyricsError } = useLyrics(artist, song);
  const { mostWantedRelease, oldestRelease } = useDiscogsData(spotifyData);
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
            llmData={chatGPTResponse}
            isLoading={chatGPTLoading}
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
