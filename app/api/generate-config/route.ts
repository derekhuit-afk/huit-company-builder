import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.SETUP_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId } = await req.json();

  const { data: cbClient } = await supabaseAdmin
    .from("cb_clients").select("*, cb_leads(*)").eq("id", clientId).single();
  if (!cbClient) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const lead = (cbClient as any).cb_leads;

  const prompt = `You are a senior SaaS architect and content strategist. Generate a complete platform configuration for a new company built on the Huit.AI blueprint.

CLIENT CONCEPT:
- Company Name: ${cbClient.company_name}
- Product Type: ${lead?.product_type}
- Target Audience: ${lead?.target_audience}
- Primary CTA/Business Goal: ${lead?.primary_cta}
- Credential/Outcome: ${lead?.credential || "Platform graduation certificate"}
- Authority Signal: ${lead?.authority_signal}
- Compliance Domain: ${lead?.compliance_domain || "General professional education"}

Generate a JSON configuration object with ALL of the following fields. Be highly specific to their concept — not generic.

{
  "platform": {
    "name": "Platform name (the brand, e.g. 'Real Estate Agent Academy')",
    "tagline": "Short punchy tagline",
    "emoji": "Single emoji representing the industry",
    "slug": "kebab-case-url-slug",
    "tablePrefix": "3-4 letter prefix for DB tables (e.g. 'rea')"
  },
  "instructor": {
    "name": "Extract from authority signal",
    "title": "Professional title",
    "authoritySignal": "The $X+ / N years signal",
    "nmls": null,
    "licenses": ["Any licenses mentioned"],
    "company": "Company/employer name if mentioned",
    "bio": "2-3 sentence instructor bio in first person, confident tone"
  },
  "modules": [
    {
      "id": 1,
      "title": "Module title specific to their concept",
      "subtitle": "What this module covers — 1 sentence",
      "tier": "free",
      "lessons": [
        {"title": "Lesson title", "duration": "12 min"},
        {"title": "Lesson title", "duration": "15 min"},
        {"title": "Lesson title", "duration": "18 min"},
        {"title": "Lesson title", "duration": "10 min"}
      ],
      "quiz": [
        {"q": "Question?", "options": ["A","B","C","D"], "answer": 0},
        {"q": "Question?", "options": ["A","B","C","D"], "answer": 1},
        {"q": "Question?", "options": ["A","B","C","D"], "answer": 2},
        {"q": "Question?", "options": ["A","B","C","D"], "answer": 0},
        {"q": "Question?", "options": ["A","B","C","D"], "answer": 3}
      ]
    }
  ],
  "tools": [
    {
      "name": "ToolName™",
      "emoji": "🎯",
      "slug": "tool-slug",
      "description": "One sentence on what this tool does for their specific audience",
      "category": "generative|pipeline|status|document|hub"
    }
  ],
  "tiers": {
    "free": 6,
    "foundation": 9,
    "accelerator": 11,
    "elite": 12
  },
  "pricing": {
    "foundation": 97,
    "accelerator": 297,
    "elite": 697
  },
  "aiCoach": {
    "systemPrompt": "Full system prompt for the AI Coach — write as the instructor persona, 150-200 words, direct voice, specific to their industry and experience",
    "starterQuestions": ["Q1?", "Q2?", "Q3?", "Q4?", "Q5?", "Q6?"]
  },
  "compliance": {
    "barText": "For educational purposes only — not affiliated with or required by any employer. Individual results vary.",
    "instructorLine": "Instructor: [Name] · [License/credential] · [Company if applicable] · Equal Housing Opportunity (if applicable)",
    "tier3": "Full 3-paragraph Tier 3 legal disclosure specific to their industry",
    "industrySpecific": "Any additional compliance requirements for this specific industry"
  },
  "landing": {
    "heroNew": {
      "headline": "3-line hero headline for new/returning professionals (use line breaks with \\n)",
      "body": "2-sentence hook explaining the pain point for new entrants",
      "bullets": ["✓ Benefit 1", "✓ Benefit 2", "✓ Benefit 3"]
    },
    "heroExperienced": {
      "headline": "3-line hero headline for experienced professionals who've plateaued",
      "body": "2-sentence hook on systems/plateaus for experienced pros",
      "bullets": ["✓ Benefit 1", "✓ Benefit 2", "✓ Benefit 3"]
    },
    "stats": [
      ["$X+", "Career Production or relevant metric"],
      ["N+", "Years in industry"],
      ["12", "Modules"],
      ["11", "Platform Tools"],
      ["24/7", "AI Coach Access"]
    ],
    "whoNewTitle": "Card title for new professionals",
    "whoNewDesc": "2-sentence description of what new professionals get",
    "whoNewFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    "whoExperiencedTitle": "Card title for experienced professionals",
    "whoExperiencedDesc": "2-sentence description of what experienced professionals get",
    "whoExperiencedFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]
  },
  "recruiting": {
    "enabled": true,
    "gateModule": 6,
    "unlockHeadline": "Short headline for the Module 6 unlock moment",
    "unlockBody": "2-paragraph unlock message — acknowledges achievement, introduces team path naturally, no pressure",
    "applyFormFields": ["name", "email", "phone", "credential", "market", "production", "experience", "why"],
    "teamName": "Team/company name from primary CTA",
    "teamDescription": "1-2 sentences describing the team opportunity"
  },
  "emails": {
    "welcomeSubject": "Welcome to [Platform Name]",
    "welcomeBody": "2-3 sentence welcome email body — warm, specific to their platform",
    "quizPassedBody": "1-2 sentences congratulating on quiz completion",
    "moduleCompleteBody": "1-2 sentences on completing a module",
    "nudgeBody": "1-2 sentences for a 7-day inactive nudge email"
  }
}

Generate ALL 12 modules with full lesson titles and 5 quiz questions each.
Generate ALL 11 tools with names, emojis, slugs, and descriptions specific to their audience's daily workflow.
Be highly specific — not generic. Write like you understand their industry deeply.

Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    await supabaseAdmin.from("cb_platform_configs").upsert({
      client_id: clientId, status: "generating", config: {}
    }, { onConflict: "client_id" });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
    let config: any = {};
    try {
      config = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "Config generation failed — AI returned invalid JSON" }, { status: 500 });
    }

    await supabaseAdmin.from("cb_platform_configs").upsert({
      client_id: clientId, status: "ready", config
    }, { onConflict: "client_id" });

    await supabaseAdmin.from("cb_clients").update({ build_status: "config_ready" }).eq("id", clientId);

    return NextResponse.json({ ok: true, config });
  } catch (err: any) {
    console.error("Config generation error:", err);
    await supabaseAdmin.from("cb_platform_configs").upsert({
      client_id: clientId, status: "failed"
    }, { onConflict: "client_id" });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
