import { useState, useEffect } from "react";

export const useElevenLabs = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAudio = async (text) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl); // Clean up previous URL
      setAudioUrl(null);
    }

    setIsLoading(true);
    setError(null);

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
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return { generateAudio, audioUrl, isLoading, error };
};
