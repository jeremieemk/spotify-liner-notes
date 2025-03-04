"use client";

import { createContext, useContext } from "react";
import { useSpotify } from "./SpotifyContext";
import { useChatGPTData } from "../hooks/useChatGPTData";
import { useDiscogsData } from "../hooks/useDiscogsData";
import { useLastFmData } from "../hooks/useLastFmData";
import { useLyrics } from "../hooks/useLyrics";
import { useMistralData } from "../hooks/useMistralData";
import { useMusicBrainzData } from "../hooks/useMusicBrainzData";
import { usePerplexityData } from "../hooks/usePerplexityData";
import { getMaxCredits } from "../utils/trackUtils";

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
  
  // fetch lyrics
  const { lyrics, lyricsLoading, error: lyricsError } = useLyrics(artist, song);
  
  // fetch Discogs data
  const { 
    mostWantedRelease, 
    oldestRelease, 
    isLoading: discogsLoading, 
    error: discogsError 
  } = useDiscogsData(spotifyData);
  
  const maxCreditsData = getMaxCredits(
    { mostWantedRelease, oldestRelease },
    song
  );
  
  // fetch LastFM data
  const { 
    artistBio, 
    isLoading: lastFmLoading, 
    error: lastFmError 
  } = useLastFmData({ artist, song });
  
  // fetch MusicBrainz data
  const { 
    musicBrainzData, 
    isLoading: musicBrainzLoading, 
    error: musicBrainzError 
  } = useMusicBrainzData({ artist, song, album });
  
  // Fetch LLM data
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
