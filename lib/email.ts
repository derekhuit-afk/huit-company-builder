import { Resend } from "resend";
export const FROM_EMAIL = "Derek Huit <derek@huit.ai>";
export const ADMIN_EMAIL = "derekhuit@gmail.com";
export const REPLY_TO = "derek@huit.build";
const resend = new Resend(process.env.RESEND_API_KEY);

const footer = `<hr style="border:none;border-top:1px solid #1E1E24;margin:24px 0">
<p style="color:#374151;font-size:11px;line-height:1.6;margin:0">
Huit.AI, Inc. · Derek Huit, Founder &amp; CEO · derekhuit@gmail.com · huit.ai · Built from Alaska<br>
This communication is for informational purposes only and does not constitute a binding contract until a signed agreement is executed.
</p>`;

const wrap = (body: string) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0A0B;border-radius:12px;border:1px solid #1E1E24">
  <div style="background:linear-gradient(135deg,#111114,#1A1A20);padding:24px 32px;border-radius:12px 12px 0 0;border-bottom:1px solid #1E1E24;display:flex;align-items:center;gap:12px">
    <span style="font-size:28px">⬡</span>
    <div>
      <div style="font-size:16px;font-weight:700;color:#F5A623;font-family:Georgia,serif">Huit.AI</div>
      <div style="font-size:11px;color:#64748B;letter-spacing:0.1em;text-transform:uppercase">Company Builder</div>
    </div>
  </div>
  <div style="padding:28px 32px">${body}${footer}</div>
</div>`;

export async function sendProposalEmail({ to, name, proposalId, companyName }: { to: string; name: string; proposalId: string; companyName: string }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://build.huit.ai"}/proposal/${proposalId}`;
  await resend.emails.send({
    from: FROM_EMAIL, to, cc: ADMIN_EMAIL, replyTo: REPLY_TO,
    subject: `Your ${companyName} build proposal is ready`,
    html: wrap(`
      <h2 style="color:white;font-family:Georgia,serif;font-size:22px;margin:0 0 12px">Hey ${name.split(" ")[0]} — your proposal is ready.</h2>
      <p style="color:#CBD5E1;font-size:15px;line-height:1.7;margin:0 0 20px">I've put together a complete build proposal for <strong style="color:#F5A623">${companyName}</strong> — scoped to your concept, with a full 13-phase timeline, everything that gets built, and next steps.</p>
      <div style="text-align:center;margin:28px 0">
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#D4881A);color:#0A0A0B;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none">View Your Proposal →</a>
      </div>
      <p style="color:#94A3B8;font-size:13px;line-height:1.7">If you have questions before we talk, reply to this email or use the AI assistant on the proposal page — it knows the full build spec. Or grab a time directly on the proposal page.</p>`)
  });
}

export async function sendNewLeadEmail({ name, email, companyName, productType, audience }: any) {
  await resend.emails.send({
    from: FROM_EMAIL, to: ADMIN_EMAIL, replyTo: REPLY_TO,
    subject: `🔔 New build inquiry: ${companyName}`,
    html: wrap(`
      <h2 style="color:#F5A623;font-family:Georgia,serif;font-size:20px;margin:0 0 16px">New Company Builder Inquiry</h2>
      <table style="width:100%;border-collapse:collapse">
        ${[["Name",name],["Email",email],["Company",companyName],["Product Type",productType],["Audience",audience]].map(([l,v])=>`
        <tr><td style="padding:8px 12px;color:#64748B;font-size:13px;width:140px">${l}</td><td style="padding:8px 12px;color:white;font-size:13px">${v}</td></tr>`).join("")}
      </table>`)
  });
}

export async function sendPhaseUpdateEmail({ to, name, companyName, phase, phaseName, nextPhase }: any) {
  await resend.emails.send({
    from: FROM_EMAIL, to, cc: ADMIN_EMAIL, replyTo: REPLY_TO,
    subject: `✅ Phase ${phase} complete — ${companyName}`,
    html: wrap(`
      <h2 style="color:white;font-family:Georgia,serif;font-size:20px;margin:0 0 12px">Phase ${phase} is complete.</h2>
      <p style="color:#CBD5E1;font-size:15px;line-height:1.7;margin:0 0 16px"><strong style="color:#10B981">${phaseName}</strong> has been completed for <strong style="color:#F5A623">${companyName}</strong>.</p>
      ${nextPhase ? `<p style="color:#94A3B8;font-size:14px;line-height:1.7">Up next: <strong style="color:white">${nextPhase}</strong>. Check your build portal for the full timeline.</p>` : `<p style="color:#10B981;font-size:14px;font-weight:700">All phases are complete. Your platform is live. 🚀</p>`}
      <div style="text-align:center;margin-top:24px">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://build.huit.ai"}/portal/{{clientId}}" style="display:inline-block;background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.3);color:#F5A623;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none">View Build Portal →</a>
      </div>`)
  });
}

export async function sendNurtureEmail({ to, name, sequence }: { to: string; name: string; sequence: number }) {
  const sequences: Record<number, { subject: string; body: string }> = {
    1: { subject: "The $180K build you could have for $X", body: `<p style="color:#CBD5E1;font-size:15px;line-height:1.7">Hey ${name.split(" ")[0]} — a quick note on what the Huit.AI Company Builder actually saves you.</p><p style="color:#CBD5E1;font-size:15px;line-height:1.7">A dev agency to build what we build would run you $180,000–$280,000 and 6 months. A two-engineer team in-house is $300K/year in salary before you've shipped a single line. We've done it in 45 hours and proven it live at <a href="https://hivemortgageacademy.com" style="color:#F5A623">hivemortgageacademy.com</a>.</p><p style="color:#CBD5E1;font-size:15px;line-height:1.7">If you're still thinking through the concept — happy to talk through it. Reply here or <a href="https://build.huit.ai/build" style="color:#F5A623">grab your instant proposal</a>.</p>` },
    2: { subject: "The three things that change per company (and the 30 that don't)", body: `<p style="color:#CBD5E1;font-size:15px;line-height:1.7">Hey ${name.split(" ")[0]} — the blueprint behind the Company Builder comes down to one insight: 30 systems are constant across every SaaS platform. Only 3 change per company.</p><p style="color:#CBD5E1;font-size:15px;line-height:1.7">The concept, the curriculum, and the tools. Everything else — auth, payments, email lifecycle, compliance, admin, referral system, mobile nav — is already built and battle-tested. We swap those three things and ship.</p><p style="color:#CBD5E1;font-size:15px;line-height:1.7">If you know your concept, <a href="https://build.huit.ai/build" style="color:#F5A623">your proposal takes 90 seconds to generate</a>.</p>` },
    3: { subject: "Real talk on what gets companies stuck", body: `<p style="color:#CBD5E1;font-size:15px;line-height:1.7">Hey ${name.split(" ")[0]} — the number one reason professional service companies don't build their platform isn't money or time. It's not knowing what to build first.</p><p style="color:#CBD5E1;font-size:15px;line-height:1.7">They spend 6 months on a landing page and never get to the payment system. Or they build the tools but not the email lifecycle that makes students come back. The blueprint eliminates all of that — 13 phases, in order, nothing skipped.</p><p style="color:#CBD5E1;font-size:15px;line-height:1.7"><a href="https://build.huit.ai/build" style="color:#F5A623">See what your build would look like →</a></p>` },
  };
  const s = sequences[sequence];
  if (!s) return;
  await resend.emails.send({ from: FROM_EMAIL, to, cc: ADMIN_EMAIL, replyTo: REPLY_TO, subject: s.subject, html: wrap(s.body) });
}
