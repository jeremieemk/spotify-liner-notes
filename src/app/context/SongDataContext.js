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
import { useSpotifyData } from "../hooks/useSpotifyData";
import { useElevenLabs } from "../hooks/useElevenLabs";
import { useAuth } from "./AuthContext";


const SongDataContext = createContext();

export const useSongData = () => {
  const context = useContext(SongDataContext);
  if (!context) {
    throw new Error("useSongData must be used within a SongDataProvider");
  }
  return context;
};

export function SongDataProvider({ children }) {
  const { token } = useAuth();

  const { spotifyData, artist, song, album } = useSpotifyData(token);

  // get lyrics from the Musixmatch API
  const {
    lyrics,
    isLoading: lyricsLoading,
    error: lyricsError,
  } = useLyricsApi(artist, song);

  // get discogs data
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

  // get artist bio from LastFM API
  const {
    artistBio,
    isLoading: lastFmLoading,
    error: lastFmError,
  } = useLastFmApi(artist);

  // get musicBrainz data
  const {
    musicBrainzData,
    loading: musicBrainzLoading,
    error: musicBrainzError,
  } = useMusicBrainzData({ artist, song, album });

  // generate perplexity comment
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
  
  // create audio commentary script using ChatGPT
  const {
    chatGPTResponse,
    isLoading: chatGPTLoading,
    error: chatGPTError,
  } = useChatGPTData(perplexityResponse);

  // audio commentary generation using ElevenLabs API
  const {
    audioUrl,
    isLoading: eleveLabsIsLoading,
    error: elevenLabsError,
  } = useElevenLabs(chatGPTResponse);

  // generate mistral alternative comment
  const {
    mistralResponse,
    isLoading: mistralLoading,
    error: mistralError,
  } = useMistralData(artist, song, album);

  const value = {
    // spotify data
    spotifyData,
    artist,
    song,
    album,

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

    // audio commentary data
    audioUrl,
    eleveLabsIsLoading,
    elevenLabsError,
  };

  return (
    <SongDataContext.Provider value={value}>
      {children}
    </SongDataContext.Provider>
  );
}
