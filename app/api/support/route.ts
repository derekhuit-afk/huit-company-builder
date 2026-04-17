import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are the Huit.AI Company Builder assistant — an AI that knows the complete Company Builder blueprint inside and out.

You help prospects understand what gets built, answer technical questions, and help active clients navigate their build.

You know:
- The 13-phase build process (Foundation through QA + Launch)
- The tech stack (Next.js 16, Supabase, Stripe, Resend, Anthropic, Vercel)
- The 10 database tables and their purpose
- The authentication system (bcrypt, session tokens, password reset)
- The payment architecture (Stripe Payment Element, no pre-created products)
- The 8-trigger email lifecycle and daily cron system
- The 5 tool patterns (generative, pipeline, status tracker, document, intelligence hub)
- The landing page architecture (12 sections in order)
- The recruiting funnel gate structure
- The compliance tier system
- Build timelines (~45 hours solo, 4-6 weeks with a team)
- Pricing philosophy and valuation framework

Derek Huit built this. 18 years, $1B+ in production, Built from Alaska. The first platform built on this blueprint — Hive Mortgage Academy — is live at hivemortgageacademy.com.

Be direct, specific, and confident. If someone asks what they'd get for their specific concept, make it concrete. Never be vague.

If someone is ready to get a proposal, direct them to https://huit.build/build.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId, clientToken } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 800,
      system: SYSTEM, messages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";

    // Store conversation
    const lastMsg = messages[messages.length - 1];
    await supabaseAdmin.from("cb_messages").insert([
      { session_id: sessionId, client_id: clientToken || null, role: "user", content: lastMsg.content },
      { session_id: sessionId, client_id: clientToken || null, role: "assistant", content: reply },
    ]);

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Support error:", err);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
