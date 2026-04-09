import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPhaseUpdateEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.SETUP_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId, phaseNumber, status, notes } = await req.json();
  const now = new Date().toISOString();

  await supabaseAdmin.from("cb_phases").update({
    status, notes,
    started_at: status === "active" ? now : undefined,
    completed_at: status === "complete" ? now : undefined,
  }).eq("client_id", clientId).eq("phase_number", phaseNumber);

  if (status === "complete") {
    // Advance client to next phase
    await supabaseAdmin.from("cb_clients").update({ current_phase: phaseNumber + 1 }).eq("id", clientId);

    const { data: client } = await supabaseAdmin.from("cb_clients").select("*").eq("id", clientId).single();
    const phases = ["Foundation","Database","Authentication","Curriculum","AI Integration","Payment System","Email Lifecycle","Production Tools","Landing Page","Recruiting Funnel","Admin + Invite","Compliance","QA + Launch"];
    if (client) {
      sendPhaseUpdateEmail({
        to: client.email, name: client.name, companyName: client.company_name,
        phase: phaseNumber, phaseName: phases[phaseNumber - 1],
        nextPhase: phases[phaseNumber] || null,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ ok: true });
}
