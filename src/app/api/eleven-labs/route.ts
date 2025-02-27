import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY environment variable" },
      { status: 500 }
    );
  }

  try {
    const client = new ElevenLabsClient({
      apiKey: apiKey,
    });

    const audioStream = await client.generate({
      voice: "Rachel",
      model_id: "eleven_turbo_v2_5",
      text,
    });

    // Convert the stream to a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return the audio buffer with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Eleven Labs API error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}

