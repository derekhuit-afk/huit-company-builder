"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BUDGETS=["Under $5,000","$5,000–$10,000","$10,000–$20,000","$20,000–$40,000","$40,000+","Not sure yet"];
const TIMELINES=["ASAP (under 4 weeks)","4–8 weeks","8–12 weeks","Flexible"];

export default function BuildPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name:"", email:"", phone:"",
    companyName:"", productType:"", targetAudience:"",
    primaryCta:"", credential:"", authoritySignal:"",
    complianceDomain:"", budgetRange:"", timeline:"", notes:""
  });

  const up = (k: string, v: string) => setForm(f => ({...f, [k]: v}));

  async function submit() {
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/intake", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
      router.push(`/proposal/${data.proposalId}?new=1`);
    } catch { setError("Server error. Please try again."); setLoading(false); }
  }

  const field = (label: string, key: string, opts: any = {}) => (
    <div style={{marginBottom:18}}>
      <label style={{fontSize:11,fontWeight:700,color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,display:"block"}}>{label}{opts.required?" *":""}</label>
      {opts.textarea ? (
        <textarea rows={3} placeholder={opts.ph||""} value={(form as any)[key]} onChange={e=>up(key,e.target.value)} style={{width:"100%",background:"var(--slate)",border:"1px solid var(--border)",borderRadius:8,padding:"11px 14px",color:"var(--text-primary)",fontSize:14,outline:"none",resize:"vertical",fontFamily:"Arial,sans-serif",boxSizing:"border-box"}} />
      ) : opts.select ? (
        <select value={(form as any)[key]} onChange={e=>up(key,e.target.value)} style={{width:"100%",background:"var(--slate)",border:"1px solid var(--border)",borderRadius:8,padding:"11px 14px",color:(form as any)[key]?"var(--text-primary)":"var(--text-muted)",fontSize:14,outline:"none",boxSizing:"border-box"}}>
          <option value="">{opts.ph||"Select..."}</option>
          {opts.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={opts.type||"text"} placeholder={opts.ph||""} value={(form as any)[key]} onChange={e=>up(key,e.target.value)} style={{width:"100%",background:"var(--slate)",border:"1px solid var(--border)",borderRadius:8,padding:"11px 14px",color:"var(--text-primary)",fontSize:14,outline:"none",boxSizing:"border-box"}} />
      )}
      {opts.hint && <p style={{fontSize:11,color:"var(--text-muted)",marginTop:5}}>{opts.hint}</p>}
    </div>
  );

  const steps = [
    { title:"The Concept", subtitle:"What are we building?" },
    { title:"The Business Model", subtitle:"How does it create value?" },
    { title:"About You", subtitle:"Your authority and contact info" },
  ];

  return (
    <main style={{minHeight:"100vh",background:"var(--obsidian)",padding:"60px 24px"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <a href="/" style={{display:"inline-flex",alignItems:"center",gap:6,color:"var(--text-muted)",fontSize:13,textDecoration:"none",marginBottom:32}}>← Huit.AI Company Builder</a>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:52,height:52,background:"linear-gradient(135deg,#F5A623,#D4881A)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#0A0A0B",margin:"0 auto 16px"}}>⬡</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:900,color:"var(--text-primary)",marginBottom:8}}>Get Your Custom Proposal</h1>
          <p style={{fontSize:14,color:"var(--text-secondary)"}}>90 seconds. AI-generated. Specific to your concept.</p>
        </div>
        {/* Progress */}
        <div style={{display:"flex",gap:8,marginBottom:32,justifyContent:"center"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,opacity:i+1<=step?1:0.4}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:i+1<step?"#10B981":i+1===step?"linear-gradient(135deg,#F5A623,#D4881A)":"var(--slate)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i+1<=step?"#0A0A0B":"var(--text-muted)"}}>{i+1<step?"✓":i+1}</div>
              <span style={{fontSize:12,color:i+1===step?"var(--honey)":"var(--text-muted)",fontWeight:i+1===step?700:400}} className="hide-mobile">{s.title}</span>
              {i<2&&<div style={{width:24,height:1,background:"var(--border)"}} />}
            </div>
          ))}
        </div>

        <div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:20,padding:32}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"var(--text-primary)",marginBottom:4}}>{steps[step-1].title}</h2>
          <p style={{fontSize:13,color:"var(--text-secondary)",marginBottom:24}}>{steps[step-1].subtitle}</p>

          {step===1&&<>
            {field("Company or Platform Name","companyName",{required:true,ph:"e.g. Real Estate Agent Academy"})}
            {field("Product Type","productType",{required:true,ph:"e.g. Real estate agent education + 10 production tools",hint:"What does the platform teach, sell, or enable?"})}
            {field("Target Audience","targetAudience",{required:true,ph:"e.g. New real estate agents (0-2 years) who just got licensed",textarea:true,hint:"Be specific — who pays, and what's their exact pain?"})}
          </>}
          {step===2&&<>
            {field("Primary CTA / Business Goal","primaryCta",{required:true,ph:"e.g. Recruit agents to my brokerage OR sell subscriptions at $97/mo",hint:"What's the main business outcome you want the platform to drive?"})}
            {field("Graduation Credential","credential",{ph:"e.g. Agent Launchpad Certificate, PrescribedPath™ Badge",hint:"What does a student earn or prove by completing the platform?"})}
            {field("Budget Range","budgetRange",{select:true,ph:"Select a range",options:BUDGETS})}
            {field("Timeline","timeline",{select:true,ph:"Select timeline",options:TIMELINES})}
            {field("Additional Notes","notes",{textarea:true,ph:"Anything else we should know about your concept, market, or goals?"})}
          </>}
          {step===3&&<>
            {field("Your Name","name",{required:true,ph:"Derek Huit"})}
            {field("Email Address","email",{required:true,type:"email",ph:"derek@huit.ai"})}
            {field("Phone (optional)","phone",{ph:"(907) 555-0100"})}
            {field("Your Authority Signal","authoritySignal",{required:true,ph:"e.g. 12 years as a real estate broker, $200M in closed transactions, led 40+ agent team",textarea:true,hint:"What makes YOU the right person to build this? Production, years, results."})}
            {field("Industry Compliance","complianceDomain",{ph:"e.g. Real estate licensing, NAR Code of Ethics, state RE commission rules",hint:"What regulatory context applies to your industry?"})}
          </>}

          {error&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"10px 14px",color:"#EF4444",fontSize:13,marginBottom:16}}>{error}</div>}

          <div style={{display:"flex",gap:10,justifyContent:"space-between"}}>
            {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"1px solid var(--border)",color:"var(--text-muted)",borderRadius:10,padding:"12px 20px",fontSize:14,cursor:"pointer"}}>← Back</button>}
            {step<3
              ? <button onClick={()=>setStep(s=>s+1)} disabled={step===1&&(!form.companyName||!form.productType||!form.targetAudience)||step===2&&!form.primaryCta} style={{marginLeft:"auto",background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Continue →</button>
              : <button onClick={submit} disabled={loading||!form.name||!form.email||!form.authoritySignal} style={{marginLeft:"auto",background:loading?"var(--muted)":"linear-gradient(135deg,#F5A623,#D4881A)",color:loading?"var(--text-muted)":"#0A0A0B",border:"none",borderRadius:10,padding:"12px 32px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer"}}>{loading?"Generating your proposal...":"Generate My Proposal →"}</button>
            }
          </div>
        </div>
        <p style={{fontSize:11,color:"var(--text-muted)",textAlign:"center",marginTop:16}}>Your proposal will be ready in under 60 seconds and sent to your email.</p>
      </div>
    </main>
  );
}
