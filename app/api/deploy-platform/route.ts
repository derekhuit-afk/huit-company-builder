import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

export const maxDuration = 300;

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const VERCEL_TEAM  = process.env.VERCEL_TEAM_ID!;
const GITHUB_ORG   = process.env.GITHUB_ORG || "derekhuit-afk";
const TEMPLATE_REPO = "hive-mortgage-academy"; // source template

async function gh(path: string, method = "GET", body?: any) {
  const res = await fetch(`https://api.github.com${path}`, {
    method, headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Content-Type": "application/json", "Accept": "application/vnd.github.v3+json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function vc(path: string, method = "GET", body?: any) {
  const res = await fetch(`https://api.vercel.com${path}?teamId=${VERCEL_TEAM}`, {
    method, headers: { "Authorization": `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.SETUP_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId } = await req.json();

  // Load client + config
  const { data: cbClient } = await supabaseAdmin.from("cb_clients").select("*").eq("id", clientId).single();
  const { data: configRow } = await supabaseAdmin.from("cb_platform_configs").select("*").eq("client_id", clientId).single();
  if (!cbClient || !configRow || configRow.status !== "ready")
    return NextResponse.json({ error: "Client or config not ready" }, { status: 400 });

  const config: any = configRow.config;
  const slug = config.platform?.slug || cbClient.company_name.toLowerCase().replace(/\s+/g, "-");
  const repoName = `${slug}-platform`;
  const prefix = config.platform?.tablePrefix || slug.substring(0, 3);

  await supabaseAdmin.from("cb_clients").update({ build_status: "deploying" }).eq("id", clientId);
  await supabaseAdmin.from("cb_platform_configs").update({ status: "deploying" }).eq("client_id", clientId);

  try {
    // ── Step 1: Create GitHub repo from template ──────────────────────────
    const repoResult = await gh(`/repos/${GITHUB_ORG}/${TEMPLATE_REPO}/generate`, "POST", {
      owner: GITHUB_ORG, name: repoName,
      description: `${config.platform?.name} — Built by Huit.AI Company Builder`,
      private: false,
    });
    const repoUrl = repoResult.html_url;
    await new Promise(r => setTimeout(r, 4000)); // Wait for repo to initialize

    // ── Step 2: Generate platform.config.ts and push it ──────────────────
    const platformConfig = generateConfigFile(config, prefix, cbClient);
    const encoded = Buffer.from(platformConfig).toString("base64");
    await gh(`/repos/${GITHUB_ORG}/${repoName}/contents/lib/platform.config.ts`, "PUT", {
      message: "feat: inject platform config from Huit.AI Company Builder",
      content: encoded,
    });

    // ── Step 3: Create Vercel project ─────────────────────────────────────
    const project = await vc("/v10/projects", "POST", {
      name: repoName, framework: "nextjs",
      gitRepository: { type: "github", repo: `${GITHUB_ORG}/${repoName}` },
    });
    const projectId = project.id;

    // ── Step 4: Set environment variables ─────────────────────────────────
    // Inherit from the CB project's env vars
    const { data: existingEnvs } = await supabaseAdmin.rpc("query", {}).catch(() => ({ data: null }));
    await vc(`/v10/projects/${projectId}/env`, "POST", buildEnvVars(cbClient, config, prefix));

    // ── Step 5: Trigger deploy ─────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 3000));
    const deploy = await vc("/v13/deployments", "POST", {
      name: repoName, gitSource: { type: "github", org: GITHUB_ORG, repo: repoName, ref: "main" },
      projectId, target: "production",
    });

    const liveUrl = `https://${repoName}.vercel.app`;

    // ── Step 6: Create Supabase tables ────────────────────────────────────
    await createClientTables(prefix);

    // ── Step 7: Update records ─────────────────────────────────────────────
    await supabaseAdmin.from("cb_platform_configs").update({
      status: "deployed", github_repo: repoUrl, vercel_project_id: projectId, vercel_url: liveUrl, deployed_at: new Date().toISOString()
    }).eq("client_id", clientId);

    await supabaseAdmin.from("cb_clients").update({
      build_status: "live", live_url: liveUrl, github_repo: repoUrl
    }).eq("id", clientId);

    // Mark all phases complete
    await supabaseAdmin.from("cb_phases").update({ status: "complete", completed_at: new Date().toISOString() }).eq("client_id", clientId);

    // ── Step 8: Send delivery email ───────────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Derek Huit <derek@huit.ai>", to: cbClient.email, cc: "derekhuit@gmail.com",
      replyTo: "derek@huit.build",
      subject: `🚀 ${config.platform?.name} is live`,
      html: deliveryEmail(cbClient.name, config.platform?.name, liveUrl, repoUrl, cbClient.portal_token),
    });

    return NextResponse.json({ ok: true, liveUrl, repoUrl, projectId });

  } catch (err: any) {
    console.error("Deploy error:", err);
    await supabaseAdmin.from("cb_clients").update({ build_status: "failed" }).eq("id", clientId);
    await supabaseAdmin.from("cb_platform_configs").update({ status: "failed" }).eq("client_id", clientId);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function generateConfigFile(config: any, prefix: string, client: any): string {
  return `// ═══════════════════════════════════════════════════════════════
// PLATFORM CONFIG — Generated by Huit.AI Company Builder
// Client: ${client.company_name}
// Generated: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY — regenerate via huit.build
// ═══════════════════════════════════════════════════════════════

export const PLATFORM = ${JSON.stringify(config.platform, null, 2)};
export const INSTRUCTOR = ${JSON.stringify(config.instructor, null, 2)};
export const MODULES = ${JSON.stringify(config.modules, null, 2)};
export const TOOLS = ${JSON.stringify(config.tools, null, 2)};
export const TIERS = ${JSON.stringify(config.tiers || { free:6, foundation:9, accelerator:11, elite:12 }, null, 2)};
export const PRICING = ${JSON.stringify(config.pricing || { foundation:97, accelerator:297, elite:697 }, null, 2)};
export const AI_COACH = ${JSON.stringify(config.aiCoach, null, 2)};
export const COMPLIANCE = ${JSON.stringify(config.compliance, null, 2)};
export const LANDING = ${JSON.stringify(config.landing, null, 2)};
export const RECRUITING = ${JSON.stringify(config.recruiting, null, 2)};
export const EMAILS_COPY = ${JSON.stringify(config.emails, null, 2)};
export const DB_PREFIX = "${prefix}";

// Convenience exports matching HMA's existing imports
export const TIER_LIMITS: Record<string, number> = TIERS;
export const canAccessModule = (moduleId: number, tier: string): boolean =>
  moduleId <= (TIERS[tier] || 6);
`;
}

function buildEnvVars(client: any, config: any, prefix: string) {
  return [
    { key: "NEXT_PUBLIC_SUPABASE_URL",          value: process.env.NEXT_PUBLIC_SUPABASE_URL!,           type: "plain",     target: ["production","preview","development"] },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,      type: "plain",     target: ["production","preview","development"] },
    { key: "SUPABASE_SERVICE_ROLE_KEY",          value: process.env.SUPABASE_SERVICE_ROLE_KEY!,          type: "encrypted", target: ["production","preview","development"] },
    { key: "ANTHROPIC_API_KEY",                  value: process.env.ANTHROPIC_API_KEY!,                  type: "encrypted", target: ["production","preview","development"] },
    { key: "RESEND_API_KEY",                     value: process.env.RESEND_API_KEY!,                     type: "encrypted", target: ["production","preview","development"] },
    { key: "STRIPE_SECRET_KEY",                  value: process.env.STRIPE_SECRET_KEY!,                  type: "encrypted", target: ["production","preview","development"] },
    { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, type: "plain",     target: ["production","preview","development"] },
    { key: "SETUP_SECRET",                       value: process.env.SETUP_SECRET!,                       type: "encrypted", target: ["production","preview","development"] },
    { key: "CRON_SECRET",                        value: process.env.SETUP_SECRET!,                       type: "encrypted", target: ["production","preview","development"] },
    { key: "PASSWORD_SALT",                      value: process.env.PASSWORD_SALT || "hma_salt_2026",    type: "encrypted", target: ["production","preview","development"] },
    { key: "DB_PREFIX",                          value: prefix,                                          type: "plain",     target: ["production","preview","development"] },
    { key: "CLIENT_ID",                          value: client.id,                                       type: "plain",     target: ["production","preview","development"] },
  ];
}

async function createClientTables(prefix: string) {
  const PAT  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const tables = [
    `CREATE TABLE IF NOT EXISTS ${prefix}_students (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL, password_hash text NOT NULL, plan text NOT NULL DEFAULT 'free', billing_cycle text DEFAULT 'monthly', session_token text, stripe_customer_id text, stripe_subscription_id text, last_nudged_at timestamptz, reset_token text, reset_token_expires timestamptz, created_at timestamptz DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS ${prefix}_module_progress (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, student_id uuid, module_number int NOT NULL, completed bool DEFAULT false, completed_at timestamptz, score int, UNIQUE(student_id, module_number))`,
    `CREATE TABLE IF NOT EXISTS ${prefix}_quiz_attempts (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, student_id uuid, module_number int NOT NULL, score int, answers jsonb, passed bool DEFAULT false, created_at timestamptz DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS ${prefix}_applications (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, name text, email text, phone text, data jsonb DEFAULT '{}', created_at timestamptz DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS ${prefix}_lesson_cache (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, module_number int NOT NULL, lesson_index int NOT NULL, content text NOT NULL, created_at timestamptz DEFAULT now(), UNIQUE(module_number, lesson_index))`,
    `CREATE TABLE IF NOT EXISTS ${prefix}_tool_data (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, student_id uuid, tool_name text NOT NULL, data jsonb DEFAULT '{}', updated_at timestamptz DEFAULT now(), UNIQUE(student_id, tool_name))`,
  ];

  for (const sql of tables) {
    await fetch(`${URL}/rest/v1/rpc/query`, {
      method: "POST",
      headers: { "apikey": PAT, "Authorization": `Bearer ${PAT}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql }),
    }).catch(() => {});
  }
}

function deliveryEmail(name: string, platformName: string, liveUrl: string, repoUrl: string, portalToken: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://huit.build";
  return `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#0A0A0B;border-radius:12px;border:1px solid #1E1E24">
    <div style="background:linear-gradient(135deg,#111114,#1A1A20);padding:24px 32px;border-radius:12px 12px 0 0;border-bottom:1px solid #1E1E24">
      <div style="font-size:28px;margin-bottom:8px">🚀</div>
      <div style="font-size:20px;font-weight:700;color:#F5A623;font-family:Georgia,serif">${platformName} is live.</div>
    </div>
    <div style="padding:28px 32px">
      <p style="color:#CBD5E1;font-size:15px;line-height:1.7;margin:0 0 20px">Hey ${name.split(" ")[0]} — your platform is built, deployed, and ready for students.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[["Live URL", `<a href="${liveUrl}" style="color:#F5A623">${liveUrl}</a>`],["GitHub Repo", `<a href="${repoUrl}" style="color:#F5A623">${repoUrl}</a>`],["Build Portal", `<a href="${base}/portal/${portalToken}" style="color:#F5A623">View your build portal</a>`]].map(([l,v])=>`<tr><td style="padding:8px 12px;color:#64748B;font-size:13px;width:120px;vertical-align:top">${l}</td><td style="padding:8px 12px;color:white;font-size:13px">${v}</td></tr>`).join("")}
      </table>
      <p style="color:#94A3B8;font-size:13px;line-height:1.7;margin:0 0 20px">Your next steps: add your domain in Vercel, connect your own Stripe account, and start sending your first students. Reply to this email with any questions.</p>
      <hr style="border:none;border-top:1px solid #1E1E24;margin:20px 0">
      <p style="color:#374151;font-size:11px;line-height:1.6;margin:0">Huit.AI, Inc. · Derek Huit · derekhuit@gmail.com · huit.build · Built from Alaska</p>
    </div>
  </div>`;
}
