import { useState, useEffect } from "react";

export function useChatGPTData(artist, song, album) {
  const [chatGPTResponse, setChatGPTResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChatGPTData() {
      if (!artist || !song) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:3000/api/chatgpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artist, track: song, album }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch ChatGPT data");
        }

        const data = await res.json();
        // Extract the content from the response
        const content = data?.data?.choices?.[0]?.message?.content || "";
        setChatGPTResponse(content);
      } catch (err) {
        console.error("Error fetching ChatGPT data:", err);
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatGPTData();
  }, [artist, song, album]);

  return { chatGPTResponse, isLoading, error };
}
