"use client";
import { useState } from "react";
const PHASES=["Foundation","Database","Authentication","Curriculum","AI Integration","Payment System","Email Lifecycle","Production Tools","Landing Page","Recruiting Funnel","Admin + Invite","Compliance","QA + Launch"];
export default function Home() {
  const [openPhase,setOpenPhase]=useState<number|null>(null);
  return (
    <main style={{background:"var(--obsidian)",minHeight:"100vh"}}>
      {/* Compliance */}
      <div style={{background:"#0D0D10",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"7px 24px",textAlign:"center"}}>
        <p style={{fontSize:11,color:"#4B5563",margin:0}}>For informational purposes only — not affiliated with or required by any employer. Individual results vary. &nbsp;<a href="#legal" style={{color:"#64748B",textDecoration:"underline"}}>Full disclaimer ↓</a></p>
      </div>
      {/* Nav */}
      <nav style={{position:"sticky",top:0,background:"rgba(10,10,11,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--border)",zIndex:100}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:"linear-gradient(135deg,#F5A623,#D4881A)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#0A0A0B"}}>⬡</div>
            <div><div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"var(--text-primary)",lineHeight:1.1}}>Huit.AI</div><div style={{fontSize:9,color:"var(--honey)",letterSpacing:"0.2em",textTransform:"uppercase"}}>Company Builder</div></div>
          </div>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            <a href="#how" style={{color:"var(--text-secondary)",fontSize:14,textDecoration:"none"}} className="hide-mobile">How It Works</a>
            <a href="#phases" style={{color:"var(--text-secondary)",fontSize:14,textDecoration:"none"}} className="hide-mobile">The Build</a>
            <a href="/support" style={{color:"var(--text-secondary)",fontSize:14,textDecoration:"none"}} className="hide-mobile">AI Assistant</a>
            <a href="/build" style={{background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",padding:"9px 20px",borderRadius:8,fontSize:14,fontWeight:700,textDecoration:"none"}}>Get Your Proposal →</a>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section style={{padding:"100px 24px 80px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:0.25,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v31l26 15z' fill='%23F5A62315'/%3E%3C/svg%3E")`}} />
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:100,padding:"6px 16px",marginBottom:24}}>
            <span style={{fontSize:12,color:"#10B981",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>🔒 Proven Blueprint — Live Reference Build</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(40px,6vw,72px)",fontWeight:900,lineHeight:1.05,color:"var(--text-primary)",marginBottom:24}}>
            Your Next Company.<br/><span style={{background:"linear-gradient(135deg,#F5A623,#FFC85C,#D4881A)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Built from Alaska.</span>
          </h1>
          <p style={{fontSize:18,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:16,maxWidth:580,margin:"0 auto 16px"}}>A full SaaS platform — 31 pages, 35 API routes, 10 database tables, payment system, email lifecycle, compliance layer, and production tools — deployed and live in 13 phases.</p>
          <p style={{fontSize:16,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:40,maxWidth:560,margin:"0 auto 40px"}}>You provide the concept. We build the machine. The same architecture that powers <a href="https://hivemortgageacademy.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--honey)",textDecoration:"none"}}>Hive Mortgage Academy</a> — live today, built in 45 hours.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
            <a href="/build" style={{background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",padding:"16px 36px",borderRadius:10,fontSize:16,fontWeight:700,textDecoration:"none"}}>Get Your Custom Proposal in 60 Seconds →</a>
            <a href="#phases" style={{border:"1px solid var(--border)",color:"var(--text-primary)",padding:"16px 28px",borderRadius:10,fontSize:16,fontWeight:600,textDecoration:"none"}}>See What Gets Built</a>
          </div>
          <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
            {[["✓","Instant AI-generated proposal"],["✓","13-phase build, zero guessing"],["✓","Replace concept. Keep the machine."]].map(([i,t],k)=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#10B981",fontWeight:700,fontSize:13}}>{i}</span><span style={{fontSize:13,color:"var(--text-secondary)"}}>{t}</span></div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats */}
      <section style={{background:"var(--charcoal)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"32px 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:24,textAlign:"center"}}>
          {[["$1B+*","Career Production"],["18+","Years in Mortgage"],["13","Build Phases"],["45 hrs","Solo Build Time"],["$180K+","Replacement Cost"]].map(([n,l],i)=>(
            <div key={i}><div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:900,background:"linear-gradient(135deg,#F5A623,#FFC85C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div><div style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>{l}</div></div>
          ))}
        </div>
      </section>
      {/* How it works */}
      <section id="how" style={{padding:"80px 24px",background:"var(--obsidian)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>The Process</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:900,color:"var(--text-primary)",marginBottom:14}}>From Concept to Live Platform</h2>
            <p style={{color:"var(--text-secondary)",fontSize:16,maxWidth:520,margin:"0 auto"}}>Four automated systems handle everything from your first inquiry to your 90-day check-in.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}} className="how-grid">
            {[
              {n:"1",emoji:"🤖",title:"AI Intake + Instant Proposal",desc:"Fill in 6 concept fields. Claude generates a fully scoped, customized proposal in under 60 seconds — tailored modules, tools, timeline, and pricing. Delivered to your inbox before you leave the page.",color:"var(--green)"},
              {n:"2",emoji:"📋",title:"Build Portal",desc:"Once you're a client, you get a unique portal URL that shows all 13 phases in real time — which is active, what was delivered, what's next, and your target launch date. No 'what's the status?' emails ever.",color:"var(--blue)"},
              {n:"3",emoji:"💬",title:"AI Support Agent",desc:"A Claude-powered assistant trained on the complete blueprint answers any technical or scoping question 24/7 — without Derek. Escalates to Derek only when the AI can't resolve it.",color:"var(--purple)"},
              {n:"4",emoji:"📧",title:"Automated Email Lifecycle",desc:"13 automated email triggers: lead nurture (3 emails, 7-day cadence), phase completion notifications, 30/60/90-day check-ins, testimonial requests, and a next-company prompt at month 3.",color:"var(--honey)"},
            ].map(s=>(
              <div key={s.n} style={{background:"var(--charcoal)",border:`1px solid ${s.color}25`,borderRadius:18,padding:28}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <div style={{width:42,height:42,background:`${s.color}12`,border:`1px solid ${s.color}30`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.emoji}</div>
                  <div style={{fontSize:11,color:s.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>System {s.n}</div>
                </div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,color:"var(--text-primary)",marginBottom:10}}>{s.title}</h3>
                <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.65,margin:0}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <style>{`.how-grid{@media(max-width:640px){grid-template-columns:1fr!important}}`}</style>
        </div>
      </section>
      {/* Phases */}
      <section id="phases" style={{padding:"80px 24px",background:"var(--charcoal)"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>The Build</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:900,color:"var(--text-primary)",marginBottom:14}}>13 Phases. Nothing Skipped.</h2>
            <p style={{color:"var(--text-secondary)",fontSize:16,maxWidth:480,margin:"0 auto"}}>Every phase builds on the last. The order is non-negotiable — it's why the build stays on track.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PHASES.map((p,i)=>(
              <div key={i} onClick={()=>setOpenPhase(openPhase===i?null:i)} style={{background:"var(--obsidian)",border:"1px solid var(--border)",borderRadius:12,padding:"14px 20px",cursor:"pointer",transition:"border-color 0.2s"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(245,166,35,0.3)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border)")}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:28,height:28,background:"rgba(245,166,35,0.1)",border:"1px solid rgba(245,166,35,0.25)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"var(--honey)",flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--text-primary)",flex:1}}>{p}</div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{openPhase===i?"▲":"▼"}</div>
                </div>
                {openPhase===i&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)",fontSize:13,color:"var(--text-secondary)",lineHeight:1.65}}>
                    {[
                      "Create all accounts (GitHub, Vercel, Supabase, Resend, Stripe, Anthropic). Set all 12 environment variables in Vercel for Production + Preview + Development.",
                      "Write and run migration SQL for all 10 database tables. Verify every table live via REST API. Disable Row Level Security — auth is handled server-side.",
                      "Build lib/auth.ts with bcrypt (10 rounds), rotating session tokens, and validateRequest(). Wire login, enroll, and password reset pages end-to-end.",
                      "Build lib/curriculum.ts with all modules and quiz questions. Wire dashboard, lesson viewer with AI content, per-lesson progress tracking, and quiz engine with AI feedback.",
                      "Build /api/coach (live AI coaching), /api/ai-lesson (generated content with Supabase cache), and /api/quiz-feedback. Unlimited on all tiers.",
                      "Build lib/stripe.ts with PLANS config. Wire /api/create-subscription (inline price_data), /api/confirm-payment, and /checkout with embedded Stripe Payment Element.",
                      "Build lib/email.ts with all 8 triggers, compliance footers, and CC logic. Wire to API routes. Configure vercel.json cron for daily 10am automated emails.",
                      "Build all production tools with saveAndSync() persistence to Supabase. Wire public share pages (document tools). Test cross-device data sync.",
                      "Build full dual-audience landing page: compliance bar, audience toggle, tools section, module grid, AI Coach demo, pricing, recruiting CTA, Tier 3 legal footer.",
                      "Gate primary CTA behind module completion milestone. Build /apply page, /graduation credential page, and HivePass public share link.",
                      "Build /admin dashboard (student management, MRR), /invite referral system, and MobileNav component. Integrate mobile nav into all authenticated pages.",
                      "Audit all tool descriptions and outcome language. Add instructor credentials and industry-specific disclosures to all pages and emails.",
                      "Test every payment flow end-to-end. Verify webhook fires on cancellation. Test all 8 email triggers. Run on mobile. Confirm zero errors in Vercel logs. Deploy.",
                    ][i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section style={{padding:"80px 24px",background:"linear-gradient(135deg,rgba(245,166,35,0.07),rgba(245,166,35,0.02))",borderTop:"1px solid rgba(245,166,35,0.15)"}}>
        <div style={{maxWidth:680,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:16}}>🏔️</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,42px)",fontWeight:900,color:"var(--text-primary)",marginBottom:16,lineHeight:1.15}}>What would you build<br />if the architecture was already done?</h2>
          <p style={{fontSize:16,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:32,maxWidth:500,margin:"0 auto 32px"}}>You know your industry. You have the authority. The blueprint is proven. Fill in 6 fields and get your full build proposal in 60 seconds.</p>
          <a href="/build" style={{display:"inline-block",background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",padding:"16px 40px",borderRadius:12,fontSize:16,fontWeight:700,textDecoration:"none",marginBottom:16}}>Generate My Proposal →</a>
          <p style={{fontSize:12,color:"var(--text-muted)",margin:"12px 0 0"}}>Or <a href="/support" style={{color:"var(--honey)",textDecoration:"none"}}>talk to the AI assistant first</a> if you have questions</p>
        </div>
      </section>
      {/* Footer */}
      <footer style={{background:"var(--charcoal)",borderTop:"1px solid var(--border)",padding:"40px 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,marginBottom:32}} className="footer-grid">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{width:28,height:28,background:"linear-gradient(135deg,#F5A623,#D4881A)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#0A0A0B"}}>⬡</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:"var(--text-primary)"}}>Huit.AI Company Builder</div>
              </div>
              <p style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.7,maxWidth:300,marginBottom:12}}>A full SaaS company architecture built on the proven Hive Mortgage Academy blueprint. Replace the concept. Keep the machine.</p>
              <p style={{fontSize:11,color:"#374151",lineHeight:1.6}}>Derek Huit · Founder & CEO, Huit.AI, Inc. · NMLS #203980 · derekhuit@gmail.com</p>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"var(--honey)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Product</div>
              {[["Get a Proposal","/build"],["AI Assistant","/support"],["Reference Build","https://hivemortgageacademy.com"],["huit.ai","https://huit.ai"]].map(([l,h])=>(
                <a key={l} href={h} style={{display:"block",fontSize:12,color:"var(--text-muted)",textDecoration:"none",marginBottom:8}}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"var(--honey)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Contact</div>
              <a href="mailto:derekhuit@gmail.com" style={{display:"block",fontSize:12,color:"var(--text-muted)",textDecoration:"none",marginBottom:8}}>derekhuit@gmail.com</a>
              <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:8}}>Anchorage, Alaska</div>
              <a href="https://huit.ai" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"var(--honey)",textDecoration:"none"}}>huit.ai →</a>
            </div>
          </div>
          <div id="legal" style={{borderTop:"1px solid var(--border)",paddingTop:24}}>
            <div style={{fontSize:10,fontWeight:700,color:"#374151",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Legal & Compliance</div>
            <p style={{fontSize:11,color:"#374151",lineHeight:1.7,marginBottom:8}}>Huit.AI Company Builder is an independent consulting and software development service operated by Huit.AI, Inc. All project timelines and outcome ranges referenced are estimates based on historical builds and individual results will vary. This website and its content do not constitute legal, financial, or compliance advice. All deliverables are subject to a signed project agreement.</p>
            <p style={{fontSize:11,color:"#374151",lineHeight:1.6}}>© 2026 Huit.AI, Inc. All rights reserved. Built from Alaska 🏔️</p>
          </div>
        </div>
        <style>{`@media(max-width:640px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
      </footer>
    </main>
  );
}
