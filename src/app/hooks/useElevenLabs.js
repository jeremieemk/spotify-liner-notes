import { useState, useEffect, useRef, useCallback } from "react";

export const useElevenLabs = (text, autoPlayCommentary) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevTextRef = useRef(null);

  const generateAudio = useCallback(async (text) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl); // Clean up previous URL
      setAudioUrl(null);
    }

    setIsLoading(true);
    setError(null);
    prevTextRef.current = text; // Update the reference to current text

    try {
      const response = await fetch("/api/eleven-labs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Audio generation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [audioUrl]);

  useEffect(() => {
    if(!autoPlayCommentary) {
      return;
    }

    if (text && text !== prevTextRef.current) {
      generateAudio(text);
    }
  }, [text, autoPlayCommentary, generateAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return { audioUrl, isLoading, error };
};
