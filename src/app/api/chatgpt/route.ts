import { NextResponse } from "next/server";

export const maxDuration = 20; 

export async function POST(request: Request) {
  try {
    // First try-catch block just for parsing the request
    let songData;
    try {
      const body = await request.json();
      songData = body.songData;
      
      if (!songData) {
        console.error("Missing songData in request body");
        return NextResponse.json(
          { error: "Missing songData in request" },
          { status: 400 }
        );
      }
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error 
        ? parseError.message 
        : 'Unknown parsing error';
        
      console.error("Failed to parse request JSON:", errorMessage);
      return NextResponse.json(
        { error: "Invalid request format", details: errorMessage },
        { status: 400 }
      );
    }

    // const prompt = `This some data about a song that I am currently streaming on my music app. 
    // When the song ends, I would like to know more about what I just heard.
    // Use the data to create a radio-dj type speech about the song.
    // Focus on fun facts and narratives about the song and artist.
    // The size of the speech should be adapted to the format - a radio DJ speech to give some context about the song.
    // Use common radio-dj type phrases like 'the song you just heard was', 'stay tuned', etc...
    // Try and not exceed 150 words while prioritizing catchy content and fun facts over stereotypical DJ filler phrases.
    //  ${songData}
    // `;
    const prompt = `This some data about a song that I am currently streaming on my music app. 
    Use the data to create a very short radio-dj type speech about the song.
    Keep it as short and compact as possible, just say the name and the artist
    Keep ot under 50 words
     ${songData}
    `;

    // Verify OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // API request
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

    // Get raw response text for detailed logging
    const responseText = await response.text();
    
    // Log status code for debugging
    console.log(`OpenAI API Status: ${response.status}`);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error 
        ? parseError.message 
        : 'Unknown JSON parsing error';
        
      console.error("Failed to parse OpenAI response as JSON:", {
        error: errorMessage,
        responseExcerpt: responseText.substring(0, 100) // Show beginning of response
      });
      
      return NextResponse.json(
        { 
          error: "Invalid response format from OpenAI", 
          details: responseText.substring(0, 500), // Limit length for security
          parseError: errorMessage
        }, 
        { status: 500 }
      );
    }

    // Handle API errors with more detail
    if (!response.ok) {
      console.error("OpenAI API error:", {
        status: response.status,
        errorData: data.error || data
      });
      
      return NextResponse.json(
        { 
          error: "Failed to fetch from OpenAI API", 
          code: response.status,
          message: data.error?.message || "Unknown API error",
          type: data.error?.type
        }, 
        { status: response.status }
      );
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    // Catch-all error handler with detailed logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorCause = error instanceof Error && error.cause ? error.cause : undefined;
    
    console.error("Detailed ChatGPT API error:", {
      message: errorMessage,
      stack: errorStack,
      cause: errorCause
    });
    
    return NextResponse.json(
      { 
        error: "Failed to fetch ChatGPT data",
        message: errorMessage,
        // Include more details in development, less in production
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}