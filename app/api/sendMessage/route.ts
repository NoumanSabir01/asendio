import { NextRequest, NextResponse } from "next/server";

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OPENAI_API_KEY = process.env.OAI_KEY


if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable.");
}

// Define the message type for consistent chat history
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// In-memory message log for simplicity (consider a database for production)
let messageLog: ChatMessage[] = [
  { role: "system", content: "You are an assistant for Substance Use Disorder (SUD) and Opioid Use Disorder (OUD) applications. You should help answer any questions and give guidance along these lines, citing best practices." },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Add the user's message to the log
    messageLog.push({ role: "user", content: body.message });

    // Send the full chat history to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messageLog,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const data = await response.json();

    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    // Add the assistant's message to the log
    messageLog.push({ role: "assistant", content: assistantMessage });

    return NextResponse.json({ reply: assistantMessage });
  } catch (error: unknown) {
    console.error("Error in /api/sendMessage:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
