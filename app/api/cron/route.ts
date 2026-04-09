import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendNurtureEmail } from "@/lib/email";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const isValidSecret = req.headers.get("authorization") === `Bearer ${process.env.SETUP_SECRET}`;
  if (!isVercelCron && !isValidSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date().toISOString();
  const results = { nurture: 0, checkins: 0, errors: 0 };

  // Nurture sequence — send to leads whose next_send_at has passed
  const { data: nurtures } = await supabaseAdmin.from("cb_nurture")
    .select("*, cb_leads(status, nurture_active)")
    .eq("paused", false)
    .lte("next_send_at", now)
    .lte("sequence_number", 3)
    .limit(20);

  for (const n of nurtures || []) {
    try {
      // Stop nurture if lead converted to client
      if (n.cb_leads?.status === "won" || !n.cb_leads?.nurture_active) {
        await supabaseAdmin.from("cb_nurture").update({ paused: true }).eq("id", n.id);
        continue;
      }
      await sendNurtureEmail({ to: n.email, name: n.name, sequence: n.sequence_number });
      const nextSend = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days between nurtures
      await supabaseAdmin.from("cb_nurture").update({
        sequence_number: n.sequence_number + 1,
        next_send_at: n.sequence_number < 3 ? nextSend.toISOString() : null,
        paused: n.sequence_number >= 3,
      }).eq("id", n.id);
      results.nurture++;
    } catch { results.errors++; }
  }

  // 30/60/90-day check-ins for active clients
  const { data: clients } = await supabaseAdmin.from("cb_clients")
    .select("*").eq("status", "active");

  const resend = new Resend(process.env.RESEND_API_KEY);
  for (const c of clients || []) {
    try {
      const daysSinceStart = Math.floor((Date.now() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24));
      if ([30, 60, 90].includes(daysSinceStart)) {
        await resend.emails.send({
          from: "derek@huit.ai", to: c.email, cc: "derekhuit@gmail.com",
          subject: `${daysSinceStart}-day check-in — ${c.company_name}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:560px;background:#0A0A0B;padding:32px;border-radius:12px;border:1px solid #1E1E24">
            <p style="color:#F5A623;font-weight:700;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px">Day ${daysSinceStart} Check-In</p>
            <p style="color:#F1F5F9;font-size:16px;font-weight:700;margin:0 0 12px">${c.company_name} — how's it going?</p>
            <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:0 0 16px">Hey ${c.name.split(" ")[0]} — ${daysSinceStart} days in. I want to make sure the platform is performing the way it should and you have everything you need.</p>
            <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:0 0 20px">Reply here with any questions, things you want to add, or if you're already thinking about your next company.</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://build.huit.ai"}/portal/${c.portal_token}" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#D4881A);color:#0A0A0B;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none">View Build Portal →</a>
          </div>`
        });
        results.checkins++;
      }
    } catch { results.errors++; }
  }

  return NextResponse.json({ ok: true, ...results, ran: now });
}
