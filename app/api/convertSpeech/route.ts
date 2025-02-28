import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OAI_KEY

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No file uploaded or file is invalid." },
        { status: 400 }
      );
    }

    // If 'file' is a File, we can access 'file.name'
    // Otherwise, we can provide a fallback extension, e.g. "audio.mp3"
    const fileName =
      file instanceof File && file.name ? file.name : "audio.mp3";

    // Create a new FormData to send to OpenAI
    const openaiFormData = new FormData();
    // Pass the original filename so that the extension is recognized
    openaiFormData.append("file", file, fileName);
    openaiFormData.append("model", "whisper-1");

    const openaiResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      return NextResponse.json(
        { error: "OpenAI Whisper transcription failed", details: errorBody },
        { status: openaiResponse.status }
      );
    }

    const result = await openaiResponse.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
