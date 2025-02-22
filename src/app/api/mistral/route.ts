import { NextResponse } from "next/server";
import { Mistral } from '@mistralai/mistralai';

export async function POST(request: Request) {
  const { artist, song, album } = await request.json();

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    console.error("Missing MISTRAL_API_KEY environment variable");
    return NextResponse.json(
      { error: "API key configuration error" },
      { status: 500 }
    );
  }

  const client = new Mistral({ apiKey });

  const prompt = `Tell me about the song "${song}" by ${artist} on the album ${album}. Include details about:
- Release year and label
- Known credits (musicians, studios, engineers)
- Notable aspects of the recording
- Critical reception and reviews
- Background about the artist/band
- Song meaning and lyrics analysis
Please provide detailed information in a structured manner with section titles and md formatting.
Please avoid writing the sections you don't have enough information about. Just skip those`;

  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    if (!chatResponse?.choices?.[0]) {
      throw new Error('No response received from Mistral API');
    }
    const data = chatResponse.choices[0].message.content;
    console.log("Mistral API response:", chatResponse);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Detailed Mistral API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Mistral data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
