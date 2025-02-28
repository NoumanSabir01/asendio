import { NextRequest, NextResponse } from "next/server";

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OPENAI_API_KEY = process.env.OAI_KEY

if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }
  
  interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
  }
  
  // A new system prompt specifically for SMART goals, if desired
  const systemPrompt: ChatMessage = {
    role: "system",
    content:
      "You are an assistant for Substance Use Disorder (SUD) and Opioid Use Disorder (OUD) applications. " +
      "You generate SMART goals based on the provided client problem. Generate one SMART goal and at least 2 action steps in bullet point form.",
  };
  
  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      if (!body.text) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
      }
  
      // Build a fresh message log for this request.
      // (If you want to keep longer conversations, you can store them in-memory or a DB.)
      const messageLog: ChatMessage[] = [
        systemPrompt,
        { role: "user", content: body.text },
      ];
  
      // Make the call to OpenAI
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
      const assistantMessage = data.choices?.[0]?.message?.content;
  
      if (!assistantMessage) {
        return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
      }
  
      // Return the result to the client
      return NextResponse.json({ data: { gpt_response: data } });
    } catch (error) {
      console.error("Error in /api/getSmartGoals:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }