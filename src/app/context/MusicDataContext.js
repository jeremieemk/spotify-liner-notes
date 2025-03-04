"use client";

import { createContext, useContext } from "react";
import { useSpotify } from "./SpotifyContext";
import { useChatGPTData } from "../hooks/useChatGPTData";
import { useMistralData } from "../hooks/useMistralData";
import { usePerplexityData } from "../hooks/usePerplexityData";
import { getMaxCredits } from "../utils/trackUtils";
import { useLyricsApi } from "../hooks/useLyricsApi";
import { useDiscogsApi } from "../hooks/useDiscogsApi";
import { useMusicBrainzApi } from "../hooks/useMusicBrainzApi";
import { useLastFmApi } from "../hooks/useLastFmApi";

const MusicDataContext = createContext();

export const useMusicData = () => {
  const context = useContext(MusicDataContext);
  if (!context) {
    throw new Error('useMusicData must be used within a MusicDataProvider');
  }
  return context;
};

export function MusicDataProvider({ children }) {
  const { spotifyData, artist, song, album } = useSpotify();
  
  // Use the individual API-based hooks
  const { lyrics, isLoading: lyricsLoading, error: lyricsError } = 
    useLyricsApi(artist, song);
  
  const { 
    mostWantedRelease, 
    oldestRelease, 
    isLoading: discogsLoading, 
    error: discogsError 
  } = useDiscogsApi(spotifyData);
  
  const maxCreditsData = getMaxCredits(
    { mostWantedRelease, oldestRelease },
    song
  );
  
  const { 
    artistBio, 
    isLoading: lastFmLoading, 
    error: lastFmError 
  } = useLastFmApi(artist);
  
  const { 
    musicBrainzData, 
    isLoading: musicBrainzLoading, 
    error: musicBrainzError 
  } = useMusicBrainzApi(artist, song, album);
  
  // Keep existing LLM hooks
  const {
    perplexityResponse,
    isLoading: perplexityLoading,
    error: perplexityError,
  } = usePerplexityData(artist, song, album, lyrics, lyricsLoading);

  const { 
    chatGPTResponse, 
    isLoading: chatGPTLoading,
    error: chatGPTError 
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
    mistralError
  };

  return (
    <MusicDataContext.Provider value={value}>
      {children}
    </MusicDataContext.Provider>
  );
}
