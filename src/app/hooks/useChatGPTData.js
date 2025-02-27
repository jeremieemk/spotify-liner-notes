import { useState, useEffect } from "react";

export function useChatGPTData(songData) {
  const [chatGPTResponse, setChatGPTResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChatGPTData() {
      if (!songData) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/perplexity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songData }),
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
  }, [songData]);

  return { chatGPTResponse, isLoading, error };
}
