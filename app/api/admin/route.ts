import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("secret") !== process.env.SETUP_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [leads, clients, proposals] = await Promise.all([
    supabaseAdmin.from("cb_leads").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("cb_clients").select("*, cb_phases(phase_number, status)").order("created_at", { ascending: false }),
    supabaseAdmin.from("cb_proposals").select("id, company_name, status, created_at, viewed_at, booked_at").order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    leads: leads.data || [], clients: clients.data || [], proposals: proposals.data || [],
    stats: {
      totalLeads: leads.data?.length || 0,
      proposalsSent: proposals.data?.length || 0,
      proposalsViewed: proposals.data?.filter(p => p.viewed_at).length || 0,
      activeClients: clients.data?.filter(c => (c as any).status === "active").length || 0,
    }
  });
}

// Create client from won lead
export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.SETUP_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { leadId, targetLaunchWeeks } = await req.json();
  const { data: lead } = await supabaseAdmin.from("cb_leads").select("*").eq("id", leadId).single();
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const portalToken = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const targetLaunch = new Date(Date.now() + (targetLaunchWeeks || 8) * 7 * 24 * 60 * 60 * 1000);

  const { data: newClient } = await supabaseAdmin.from("cb_clients").insert({
    lead_id: leadId, name: lead.name, email: lead.email,
    company_name: lead.company_name, status: "active",
    target_launch: targetLaunch.toISOString(), portal_token: portalToken,
  }).select().single();

  // Create all 13 phases
  const phases = [
    "Foundation", "Database", "Authentication", "Curriculum", "AI Integration",
    "Payment System", "Email Lifecycle", "Production Tools", "Landing Page",
    "Recruiting Funnel", "Admin + Invite", "Compliance", "QA + Launch"
  ];
  await supabaseAdmin.from("cb_phases").insert(
    phases.map((name, i) => ({ client_id: (newClient as any).id, phase_number: i + 1, phase_name: name, status: i === 0 ? "active" : "upcoming" }))
  );

  await supabaseAdmin.from("cb_leads").update({ status: "won", nurture_active: false }).eq("id", leadId);
  await supabaseAdmin.from("cb_nurture").update({ paused: true }).eq("lead_id", leadId);

  return NextResponse.json({ ok: true, client: newClient, portalUrl: `/portal/${portalToken}` });
}
