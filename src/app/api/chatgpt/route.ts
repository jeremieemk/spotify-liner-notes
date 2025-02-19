// app/api/chatgpt/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { artist, track, album } = await request.json();

  // Simplified prompt that directly asks for information
  const prompt = `Tell me about the song "${track}" by ${artist} on the album .${album} Include details about:
- Release year and label
- Known credits (musicians, studios, engineers)
- Notable aspects of the recording
- Critical reception and reviews
- Background about the artist/band
- Song meaning and lyrics analysis`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from OpenAI API");
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("ChatGPT API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ChatGPT data" },
      { status: 500 }
    );
  }
}
