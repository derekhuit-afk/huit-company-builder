"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const STATUS_COLOR: Record<string,string> = { upcoming:"#374151", active:"#F5A623", complete:"#10B981" };
const STATUS_LABEL: Record<string,string> = { upcoming:"Upcoming", active:"In Progress", complete:"Complete" };

export default function PortalPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/portal?token=${params?.clientId}`).then(r=>r.json())
      .then(d => { if (d.error) setNotFound(true); else setData(d); })
      .catch(() => setNotFound(true));
  }, [params?.clientId]);

  if (notFound) return <main style={{minHeight:"100vh",background:"var(--obsidian)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>🏗️</div><h1 style={{color:"var(--text-primary)",fontFamily:"'Playfair Display',serif"}}>Portal not found</h1><p style={{color:"var(--text-secondary)",fontSize:14}}>Check your link or contact Derek.</p></div></main>;
  if (!data) return <main style={{minHeight:"100vh",background:"var(--obsidian)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"var(--honey)"}}>Loading your build portal...</div></main>;

  const { client, phases } = data;
  const completedCount = phases.filter((p:any) => p.status === "complete").length;
  const pct = Math.round((completedCount / 13) * 100);
  const daysLeft = client.target_launch ? Math.max(0, Math.ceil((new Date(client.target_launch).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <main className="cb-main" style={{minHeight:"100vh",background:"var(--obsidian)",padding:"48px 24px"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        {/* Header */}
        <div style={{background:"var(--charcoal)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:18,padding:"28px 32px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>⬡ Huit.AI Company Builder</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:900,color:"var(--text-primary)",marginBottom:6}}>{client.company_name}</h1>
          <p style={{fontSize:14,color:"var(--text-secondary)",marginBottom:20}}>Build Portal · {client.name}</p>
          <div className="cb-portal-stats" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {[
              [String(completedCount)+"/13","Phases Complete"],
              [pct+"%","Build Progress"],
              [daysLeft!==null?daysLeft+" days":"In Progress","To Target Launch"],
            ].map(([v,l])=>(
              <div key={l} style={{textAlign:"center",background:"rgba(245,166,35,0.05)",border:"1px solid rgba(245,166,35,0.1)",borderRadius:10,padding:"12px 8px"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"var(--honey)"}}>{v}</div>
                <div style={{fontSize:11,color:"var(--text-muted)",marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{marginTop:20}}>
            <div style={{height:6,background:"var(--border)",borderRadius:100,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,#10B981,#F5A623)",borderRadius:100,transition:"width 0.5s ease"}} />
            </div>
          </div>
        </div>

        {/* Phases */}
        <div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:18,padding:"24px 28px",marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--honey)",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20}}>Build Phases</div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {phases.map((p:any, i:number) => {
              const color = STATUS_COLOR[p.status] || "#374151";
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:i<phases.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:`${color}15`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,color}}>
                    {p.status==="complete"?"✓":p.status==="active"?"●":p.phase_number}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:p.status==="active"?700:500,color:p.status==="complete"?"#10B981":p.status==="active"?"var(--honey)":"var(--text-secondary)"}}>{p.phase_name}</div>
                    {p.completed_at&&<div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>Completed {new Date(p.completed_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>}
                    {p.status==="active"&&<div style={{fontSize:11,color:"var(--honey)",marginTop:2}}>Currently in progress</div>}
                    {p.notes&&<div style={{fontSize:12,color:"var(--text-muted)",marginTop:4,fontStyle:"italic"}}>{p.notes}</div>}
                  </div>
                  <div style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:`${color}15`,color,border:`1px solid ${color}30`,whiteSpace:"nowrap"}}>{STATUS_LABEL[p.status]||p.status}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Support */}
        <div style={{background:"rgba(139,92,246,0.06)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:14,padding:"18px 22px",textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)",marginBottom:6}}>💬 Questions about your build?</div>
          <p style={{fontSize:13,color:"var(--text-secondary)",marginBottom:14}}>The AI assistant knows every technical detail of your platform. Available 24/7.</p>
          <a href="/support" style={{display:"inline-block",background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.35)",color:"#8B5CF6",padding:"10px 22px",borderRadius:8,fontSize:13,fontWeight:700,textDecoration:"none"}}>Open AI Assistant →</a>
        </div>

        <p style={{textAlign:"center",fontSize:12,color:"var(--text-muted)"}}>Questions not covered here? Reply to any email from Derek or write to <a href="mailto:derekhuit@gmail.com" style={{color:"var(--honey)",textDecoration:"none"}}>derekhuit@gmail.com</a></p>
      </div>
    </main>
  );
}
