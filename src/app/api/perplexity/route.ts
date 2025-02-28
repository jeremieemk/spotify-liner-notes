import { NextResponse } from "next/server";
import { getPrompt } from "../getPrompt";

export const maxDuration = 20; 

export async function POST(request: Request) {
  const { artist, song, album, lyrics } = await request.json();

  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    console.error("Missing PERPLEXITY_API_KEY environment variable");
    return NextResponse.json(
      { error: "API key configuration error" },
      { status: 500 }
    );
  }

  console.log("Received request for:", { artist, song, album, lyrics });

  const prompt = getPrompt(artist, song, album, lyrics);

  try {
    // Log the authentication header (without exposing the full API key)
    const authHeader = `Bearer ${apiKey}`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable music expert. Provide concise but detailed information about songs and artists.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        top_p: 0.9,
      }),
    });

    // Log response headers for debugging
    // console.log("Response status:", response.status);
    // console.log("Response headers:", Object.fromEntries([...response.headers]));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Detailed Perplexity API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Perplexity data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
