
export function useSpotifyControls(token)  {
    const handlePlayback = async (action) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/${action}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to ${action}`);
        }
      } catch (error) {
        console.error(`Spotify control error:`, error);
      }
    };
  
    const handleSkip = async (direction) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/${direction}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to skip ${direction}`);
        }
      } catch (error) {
        console.error(`Spotify control error:`, error);
      }
    };
  
    return {
      play: () => handlePlayback("play"),
      pause: () => handlePlayback("pause"),
      next: () => handleSkip("next"),
      previous: () => handleSkip("previous"),
    };
  };