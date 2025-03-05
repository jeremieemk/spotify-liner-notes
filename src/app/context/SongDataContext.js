"use client";


import { createContext, useContext } from "react";
import { useChatGPTData } from "../hooks/useChatGPTData";
import { useDiscogsData } from "../hooks/useDiscogsData";
import { useLastFmApi } from "../hooks/useLastFmApi";
import { useLyricsApi } from "../hooks/useLyricsApi";
import { useMistralData } from "../hooks/useMistralData";
import { useMusicBrainzData } from "../hooks/useMusicBrainzData";
import { usePerplexityData } from "../hooks/usePerplexityData";
import { getMaxCredits } from "../utils/trackUtils";
import { useSpotify } from "./SpotifyContext";

const SongDataContext = createContext();

export const useSongData = () => {
  const context = useContext(SongDataContext);
  if (!context) {
    throw new Error("useSongData must be used within a SongDataProvider");
  }
  return context;
};

export function SongDataProvider({ children }) {
  const { spotifyData, artist, song, album } = useSpotify();

  // Use the lyrics API hook
  const {
    lyrics,
    isLoading: lyricsLoading,
    error: lyricsError,
  } = useLyricsApi(artist, song);

  // Use the original Discogs hook
  const {
    mostWantedRelease,
    oldestRelease,
    isLoading: discogsLoading,
    error: discogsError,
  } = useDiscogsData(spotifyData);

  const maxCreditsData = getMaxCredits(
    { mostWantedRelease, oldestRelease },
    song
  );

  // Use the LastFM API hook
  const {
    artistBio,
    isLoading: lastFmLoading,
    error: lastFmError,
  } = useLastFmApi(artist);

  // Use the original MusicBrainz hook
  const {
    musicBrainzData,
    loading: musicBrainzLoading,
    error: musicBrainzError,
  } = useMusicBrainzData({ artist, song, album });

  // Keep existing LLM hooks
  const {
    perplexityResponse,
    isLoading: perplexityLoading,
    error: perplexityError,
  } = usePerplexityData(
    artist,
    song,
    album,
    lyrics,
    lyricsLoading,
    maxCreditsData.credits,
    discogsLoading
  );

  const {
    chatGPTResponse,
    isLoading: chatGPTLoading,
    error: chatGPTError,
  } = useChatGPTData(perplexityResponse);

  const {
    mistralResponse,
    isLoading: mistralLoading,
    error: mistralError,
  } = useMistralData(artist, song, album);

  const value = {
    // lyrics data
    lyrics,
    lyricsLoading,
    lyricsError,

    // discogs data
    discogsCredits: maxCreditsData,
    discogsLoading,
    discogsError,

    // lastFM data
    artistBio,
    lastFmLoading,
    lastFmError,

    // musicBrainz data
    musicBrainzData,
    musicBrainzLoading,
    musicBrainzError,

    // LLM data
    perplexityResponse,
    perplexityLoading,
    perplexityError,

    chatGPTResponse,
    chatGPTLoading,
    chatGPTError,

    mistralResponse,
    mistralLoading,
    mistralError,
  };

  return (
    <SongDataContext.Provider value={value}>
      {children}
    </SongDataContext.Provider>
  );
}
