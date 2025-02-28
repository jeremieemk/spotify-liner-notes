import { NextResponse } from "next/server";

export const maxDuration = 20; 

export async function POST(request: Request) {
  const { songData } = await request.json();

  const prompt = `This some data about a song that I am currently streaming on my music app. 
  When the song ends, I would like to know more about what I just heard.
  Use the data to create a radio-dj type speech about the song.
  Focus on fun facts and narratives about the song and artist.
  The size of the speech should be adapted to the format - a radio DJ speech to give some context about the song.
  Use common radio-dj type phrases like 'the song you just heard was', 'stay tuned', etc...
  Try and not exceed 150 words while prioritizing catchy content and fun facts over stereotypical DJ filler phrases.
   ${songData}
  `;

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
              "You are a knowledgeable music expert and an entertaining radio host.",
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
