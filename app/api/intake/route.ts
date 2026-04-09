import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";
import { sendProposalEmail, sendNewLeadEmail } from "@/lib/email";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PHASES = [
  "Foundation — Accounts, env vars, GitHub, Vercel",
  "Database — 10-table schema, migration, verified live",
  "Authentication — bcrypt, session tokens, login + enroll pages",
  "Curriculum — Modules, lessons, dashboard, quiz engine",
  "AI Integration — Coach, lesson generation, quiz feedback, caching",
  "Payment System — Stripe subscriptions, webhook, checkout page",
  "Email Lifecycle — 8 triggers, cron, compliance footers",
  "Production Tools — All tools with Supabase persistence",
  "Landing Page — Dual audience, tools section, pricing, legal",
  "Recruiting Funnel — CTA gate, apply page, graduation page",
  "Admin + Invite — Admin dashboard, referral system, mobile nav",
  "Compliance — Outcome language audit, credentials, Tier 3 legal",
  "QA + Launch — Full flow test, webhook verify, zero-error deploy",
];

function generateId() {
  return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, companyName, productType, targetAudience, primaryCta, credential, authoritySignal, complianceDomain, budgetRange, timeline, notes } = body;

    if (!name || !email || !companyName || !productType || !targetAudience || !primaryCta || !authoritySignal)
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

    // Insert lead
    const { data: lead, error: leadErr } = await supabaseAdmin.from("cb_leads").insert({
      name, email, phone, company_name: companyName, product_type: productType,
      target_audience: targetAudience, primary_cta: primaryCta, credential,
      authority_signal: authoritySignal, compliance_domain: complianceDomain,
      budget_range: budgetRange, timeline, notes,
    }).select().single();

    if (leadErr) throw new Error(leadErr.message);

    // Generate proposal with Claude
    const prompt = `You are Derek Huit — founder of Huit.AI, 18+ years in mortgage, $1B+ in production, Built from Alaska. You've been building full-stack SaaS platforms using your proven Company Builder blueprint.

A prospect has submitted a build inquiry. Generate a comprehensive, professional build proposal for their company.

PROSPECT DETAILS:
- Company Name: ${companyName}
- Product Type: ${productType}
- Target Audience: ${targetAudience}
- Primary CTA / Business Goal: ${primaryCta}
- Their Credential/Authority: ${credential || "Not specified"}
- Authority Signal: ${authoritySignal}
- Industry/Compliance: ${complianceDomain || "General"}
- Budget Range: ${budgetRange || "Not specified"}
- Timeline: ${timeline || "Standard"}
- Notes: ${notes || "None"}

Generate a JSON proposal with these exact fields:
{
  "executiveSummary": "3-4 sentence personalized summary of what we're building and why it's the right move for them",
  "whatWeAreBuildingTitle": "Short punchy title for their platform (2-5 words)",
  "whatWeAreBuilding": "2-3 sentences describing their specific platform — what it does, who it serves, what the outcome is",
  "audiencePaths": ["Path 1 description", "Path 2 description"],
  "tools": [
    {"name": "Tool Name", "description": "One sentence on what this tool does for their specific audience"}
  ],
  "modules": [
    {"number": 1, "title": "Module Title", "subtitle": "What this module covers for their audience"},
  ],
  "recruitingAngle": "2 sentences on how the platform feeds their primary CTA goal",
  "complianceNote": "1-2 sentences on compliance considerations specific to their industry",
  "timeline": "X weeks from contract to live platform",
  "investmentNote": "Brief framing of the investment relative to alternatives",
  "whyNow": "2 sentences on timing / market opportunity for this specific concept",
  "nextStep": "One clear sentence on what happens after they book the strategy call"
}

Generate 8-12 tools specific to their audience's daily workflow. Generate 12 modules with titles and subtitles tailored to their concept. Be specific — not generic. Write like you understand their industry.

Return ONLY valid JSON, no other text.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "{}";
    let proposalContent: any = {};
    try {
      proposalContent = JSON.parse(rawText.replace(/```json\n?|\n?```/g, "").trim());
    } catch {
      proposalContent = { executiveSummary: "Custom platform build tailored to your concept.", whatWeAreBuilding: rawText.substring(0, 500) };
    }

    // Add phases to content
    proposalContent.phases = PHASES;

    // Store proposal
    const proposalId = generateId();
    await supabaseAdmin.from("cb_proposals").insert({
      id: proposalId, lead_id: lead.id, company_name: companyName, content: proposalContent,
    });

    // Update lead with proposal ID
    await supabaseAdmin.from("cb_leads").update({ proposal_id: proposalId, status: "proposal_sent" }).eq("id", lead.id);

    // Start nurture sequence
    const firstNudge = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
    await supabaseAdmin.from("cb_nurture").insert({
      lead_id: lead.id, email, name, sequence_number: 1, next_send_at: firstNudge.toISOString()
    });

    // Send emails (non-blocking)
    sendProposalEmail({ to: email, name, proposalId, companyName }).catch(console.error);
    sendNewLeadEmail({ name, email, companyName, productType, audience: targetAudience }).catch(console.error);

    return NextResponse.json({ ok: true, proposalId });
  } catch (err: any) {
    console.error("Intake error:", err);
    return NextResponse.json({ error: err.message || "Server error." }, { status: 500 });
  }
}
