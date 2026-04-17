"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

const PHASES=["Foundation","Database","Authentication","Curriculum","AI Integration","Payment System","Email Lifecycle","Production Tools","Landing Page","Recruiting Funnel","Admin + Invite","Compliance","QA + Launch"];
const PHASE_COLORS=["#10B981","#10B981","#10B981","#3B82F6","#3B82F6","#8B5CF6","#8B5CF6","#F5A623","#F5A623","#F5A623","#EF4444","#EF4444","#EF4444"];

export default function ProposalPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isNew = searchParams?.get("new") === "1";
  const [proposal, setProposal] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/proposal?id=${params?.id}`).then(r=>r.json()).then(d=>{ if(d.error) setNotFound(true); else setProposal(d); }).catch(()=>setNotFound(true));
  }, [params?.id]);

  if (notFound) return <main style={{minHeight:"100vh",background:"var(--obsidian)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"white"}}><div style={{fontSize:48,marginBottom:16}}>📄</div><h1 style={{fontFamily:"'Playfair Display',serif",color:"var(--text-primary)"}}>Proposal not found</h1><a href="/build" style={{color:"var(--honey)",textDecoration:"none"}}>Generate a new proposal →</a></div></main>;
  if (!proposal) return <main style={{minHeight:"100vh",background:"var(--obsidian)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"var(--honey)",fontSize:16}}>Building your proposal...</div></main>;

  const c = proposal.content;
  const lead = proposal.cb_leads;

  return (
    <main className="cb-main" style={{minHeight:"100vh",background:"var(--obsidian)",padding:"60px 24px"}}>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        {/* New proposal banner */}
        {isNew&&<div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:12,padding:"14px 20px",marginBottom:28,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>✅</span>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#10B981",marginBottom:2}}>Your proposal is ready — and it's been sent to your email.</div>
            <div style={{fontSize:13,color:"var(--text-secondary)"}}>Bookmark this page to reference it later. It'll always be here.</div>
          </div>
        </div>}

        {/* Header */}
        <div style={{background:"var(--charcoal)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:20,padding:"36px 40px",marginBottom:24,boxShadow:"0 0 60px rgba(245,166,35,0.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>⬡ Huit.AI Company Builder</div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",fontWeight:900,color:"var(--text-primary)",marginBottom:6}}>{proposal.company_name}</h1>
              <div style={{fontSize:14,color:"var(--text-secondary)"}}>Build Proposal · {new Date(proposal.created_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:4}}>Prepared for</div>
              <div style={{fontSize:15,fontWeight:700,color:"var(--text-primary)"}}>{lead?.name}</div>
              <div style={{fontSize:13,color:"var(--honey)"}}>{lead?.email}</div>
            </div>
          </div>
          {c.executiveSummary&&<p style={{fontSize:16,color:"var(--text-secondary)",lineHeight:1.75,margin:0,borderTop:"1px solid var(--border)",paddingTop:20}}>{c.executiveSummary}</p>}
        </div>

        {/* What we're building */}
        {c.whatWeAreBuilding&&<div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 32px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>What We're Building</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,3vw,30px)",fontWeight:900,color:"var(--text-primary)",marginBottom:12}}>{c.whatWeAreBuildingTitle||proposal.company_name}</h2>
          <p style={{fontSize:15,color:"var(--text-secondary)",lineHeight:1.75,marginBottom:20}}>{c.whatWeAreBuilding}</p>
          {c.audiencePaths?.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="paths-grid">
            {c.audiencePaths.map((p:string,i:number)=>(
              <div key={i} style={{background:"rgba(245,166,35,0.05)",border:"1px solid rgba(245,166,35,0.15)",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,marginBottom:6}}>Audience Path {i+1}</div>
                <div style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.6}}>{p}</div>
              </div>
            ))}
          </div>}
        </div>}

        {/* Tools */}
        {c.tools?.length>0&&<div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 32px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20}}>Production Tools Included</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}} className="tools-grid">
            {c.tools.map((t:any,i:number)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px"}}>
                <span style={{fontSize:18,flexShrink:0}}>⚡</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)",marginBottom:3}}>{t.name}</div><div style={{fontSize:12,color:"var(--text-secondary)",lineHeight:1.5}}>{t.description}</div></div>
              </div>
            ))}
          </div>
        </div>}

        {/* Modules */}
        {c.modules?.length>0&&<div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 32px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20}}>The Curriculum — {c.modules.length} Modules</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="mod-grid">
            {c.modules.map((m:any,i:number)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:"rgba(245,166,35,0.12)",lineHeight:1,marginBottom:8}}>{String(m.number||i+1).padStart(2,"0")}</div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)",marginBottom:4}}>{m.title}</div>
                <div style={{fontSize:11,color:"var(--text-muted)",lineHeight:1.5}}>{m.subtitle}</div>
              </div>
            ))}
          </div>
        </div>}

        {/* The Build — 13 phases */}
        <div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 32px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20}}>The 13-Phase Build</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {PHASES.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<12?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{width:26,height:26,borderRadius:6,background:`${PHASE_COLORS[i]}15`,border:`1px solid ${PHASE_COLORS[i]}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:PHASE_COLORS[i],flexShrink:0}}>{i+1}</div>
                <div style={{fontSize:13,color:"var(--text-primary)",fontWeight:500}}>{p}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:"12px 16px",background:"rgba(245,166,35,0.06)",border:"1px solid rgba(245,166,35,0.15)",borderRadius:10}}>
            <div style={{fontSize:13,color:"var(--honey)",fontWeight:700}}>Estimated timeline: {c.timeline||"6–8 weeks from contract to live platform"}</div>
          </div>
        </div>

        {/* Recruiting + Compliance */}
        {(c.recruitingAngle||c.complianceNote)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}} className="rc-grid">
          {c.recruitingAngle&&<div style={{background:"var(--charcoal)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:14,padding:"20px 22px"}}>
            <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Business Outcome</div>
            <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.65,margin:0}}>{c.recruitingAngle}</p>
          </div>}
          {c.complianceNote&&<div style={{background:"var(--charcoal)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:14,padding:"20px 22px"}}>
            <div style={{fontSize:11,color:"#10B981",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Compliance</div>
            <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.65,margin:0}}>{c.complianceNote}</p>
          </div>}
        </div>}


        {/* Pricing */}
        <div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 32px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Investment</div>
          <p style={{fontSize:14,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:24}}>A dev agency builds what's in this proposal for $180,000–$280,000 over 4–6 months. The blueprint is proven and live at <a href="https://hivemortgageacademy.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--honey)",textDecoration:"none"}}>hivemortgageacademy.com</a>. Here's what it costs to build yours.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}} className="price-grid">
            {[
              {
                label:"Standard Build",
                price:"$8,500",
                timeline:"6–8 weeks",
                color:"#3B82F6",
                popular:false,
                features:[
                  "Complete 13-phase build",
                  "31 pages + 35 API routes",
                  "10 database tables",
                  "Payment system (Stripe)",
                  "8-trigger email lifecycle",
                  "All production tools",
                  "Compliance layer",
                  "Mobile-responsive",
                  "Live at your domain",
                ]
              },
              {
                label:"Build + 90-Day Support",
                price:"$12,500",
                timeline:"6–8 weeks + 3 months",
                color:"#F5A623",
                popular:true,
                features:[
                  "Everything in Standard",
                  "Phase update notifications",
                  "Email optimization",
                  "Tool additions",
                  "Direct access to Derek",
                  "30/60/90-day check-ins",
                  "Priority response",
                  "One revision round",
                  "Launch strategy session",
                ]
              },
              {
                label:"Build + Annual Retainer",
                price:"$24,000",
                timeline:"Year 1 — all inclusive",
                color:"#8B5CF6",
                popular:false,
                features:[
                  "Everything in 90-Day",
                  "Unlimited platform updates",
                  "New tool additions",
                  "New module additions",
                  "Annual retainer (12 mo)",
                  "Priority support",
                  "Quarterly strategy call",
                  "Second company discount",
                  "Blueprint access",
                ]
              },
            ].map(p=>(
              <div key={p.label} style={{background:"var(--obsidian)",border:`1px solid ${p.popular?p.color+"60":"var(--border)"}`,borderRadius:16,padding:24,position:"relative",boxShadow:p.popular?`0 0 32px ${p.color}12`:"none"}}>
                {p.popular&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${p.color},${p.color}cc)`,color:"white",fontSize:10,fontWeight:800,padding:"3px 14px",borderRadius:100,whiteSpace:"nowrap"}}>Most Popular</div>}
                <div style={{fontSize:10,fontWeight:700,color:p.color,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>{p.label}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:"var(--text-primary)",marginBottom:4}}>{p.price}</div>
                <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:18}}>{p.timeline}</div>
                <div style={{borderTop:"1px solid var(--border)",paddingTop:16,marginBottom:20}}>
                  {p.features.map(f=>(
                    <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                      <span style={{color:"#10B981",fontSize:12,flexShrink:0,marginTop:1}}>✓</span>
                      <span style={{fontSize:12,color:"var(--text-secondary)",lineHeight:1.4}}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="https://calendly.com/derekhuit" target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",background:p.popular?`linear-gradient(135deg,${p.color},${p.color}cc)`:"var(--slate)",color:p.popular?"white":"var(--text-primary)",border:`1px solid ${p.popular?"transparent":"var(--border)"}`,padding:"11px 16px",borderRadius:10,fontSize:13,fontWeight:700,textDecoration:"none"}}>Book a Call →</a>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:20,flexShrink:0}}>🏔️</span>
            <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.6,margin:0}}>Every build runs on the same architecture as <a href="https://hivemortgageacademy.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--honey)",textDecoration:"none"}}>hivemortgageacademy.com</a> — live, tested, and generating students today. You're not paying for something being figured out. You're paying for the blueprint to be applied to your concept.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{background:"linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.03))",border:"1px solid rgba(245,166,35,0.35)",borderRadius:18,padding:"32px 36px",textAlign:"center"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,3vw,28px)",fontWeight:900,color:"var(--text-primary)",marginBottom:12}}>Ready to start the build?</h2>
          <p style={{fontSize:14,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:24,maxWidth:480,margin:"0 auto 24px"}}>{c.nextStep||"Book a 30-minute strategy call. We'll review the proposal, confirm the scope, and map out your launch date."}</p>
          <a href="https://calendly.com/derekhuit" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",padding:"14px 36px",borderRadius:10,fontSize:15,fontWeight:700,textDecoration:"none",marginBottom:12}}>Book Your Strategy Call →</a>
          <p style={{fontSize:12,color:"var(--text-muted)",marginTop:10}}>Questions first? <a href="/support" style={{color:"var(--honey)",textDecoration:"none"}}>Ask the AI assistant</a> — it knows this proposal inside out.</p>
        </div>

        <style>{`@media(max-width:640px){.paths-grid,.tools-grid,.mod-grid,.rc-grid,.price-grid{grid-template-columns:1fr!important}}@media(max-width:900px){.price-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </main>
  );
}
