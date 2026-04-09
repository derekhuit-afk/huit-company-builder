"use client";
import { useState } from "react";

export default function AdminPage() {
  const [secret,setSecret]=useState("");
  const [authed,setAuthed]=useState(false);
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [tab,setTab]=useState<"leads"|"proposals"|"clients">("leads");

  async function load() {
    setLoading(true);
    const res=await fetch(`/api/admin?secret=${secret}`);
    if(!res.ok){alert("Invalid secret.");setLoading(false);return;}
    setData(await res.json()); setAuthed(true); setLoading(false);
  }

  async function createClient(leadId: string) {
    const weeks = prompt("Target launch in how many weeks?", "8");
    if (!weeks) return;
    const res = await fetch("/api/admin", { method:"POST", headers:{"Content-Type":"application/json","x-admin-secret":secret}, body: JSON.stringify({ leadId, targetLaunchWeeks: parseInt(weeks) }) });
    const d = await res.json();
    if (d.ok) { alert(`Client created! Portal: ${d.portalUrl}`); load(); }
    else alert("Error: " + d.error);
  }

  async function updatePhase(clientId: string, phaseNum: number, status: string) {
    await fetch("/api/phase", { method:"POST", headers:{"Content-Type":"application/json","x-admin-secret":secret}, body: JSON.stringify({ clientId, phaseNumber: phaseNum, status }) });
    load();
  }

  const fmt=(s:string)=>s?new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric"}):"—";
  const statusColor: Record<string,string>={new:"#F5A623",proposal_sent:"#3B82F6",won:"#10B981",lost:"#EF4444"};

  if (!authed) return (
    <main style={{minHeight:"100vh",background:"var(--obsidian)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{maxWidth:380,width:"100%",background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:20,padding:32}}>
        <div style={{fontSize:36,textAlign:"center",marginBottom:14}}>⬡</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"var(--text-primary)",marginBottom:20,textAlign:"center"}}>CB Admin</h2>
        <input type="password" placeholder="Admin secret" value={secret} onChange={e=>setSecret(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()} style={{width:"100%",background:"var(--slate)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 14px",color:"var(--text-primary)",fontSize:14,outline:"none",marginBottom:14,boxSizing:"border-box"}} />
        <button onClick={load} disabled={loading} style={{width:"100%",background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}>{loading?"Loading...":"Enter →"}</button>
      </div>
    </main>
  );

  return (
    <main style={{minHeight:"100vh",background:"var(--obsidian)",padding:"32px 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:900,color:"var(--text-primary)"}}>⬡ Company Builder Admin</h1>
          <button onClick={load} style={{background:"var(--slate)",border:"1px solid var(--border)",color:"var(--text-muted)",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer"}}>Refresh</button>
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {[["Total Leads",data?.stats?.totalLeads||0],["Proposals Sent",data?.stats?.proposalsSent||0],["Proposals Viewed",data?.stats?.proposalsViewed||0],["Active Clients",data?.stats?.activeClients||0]].map(([l,v])=>(
            <div key={String(l)} style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:900,color:"var(--honey)"}}>{v}</div>
              <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {(["leads","proposals","clients"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:100,border:`1px solid ${tab===t?"var(--honey)":"var(--border)"}`,background:tab===t?"rgba(245,166,35,0.1)":"transparent",color:tab===t?"var(--honey)":"var(--text-muted)",fontSize:13,fontWeight:tab===t?700:400,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>
          ))}
        </div>
        {/* Leads table */}
        {tab==="leads"&&<div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Name","Company","Product","Status","Date","Actions"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{(data?.leads||[]).map((l:any,i:number)=>(
              <tr key={l.id} style={{borderBottom:"1px solid var(--border)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                <td style={{padding:"11px 14px"}}><div style={{fontSize:14,fontWeight:600,color:"var(--text-primary)"}}>{l.name}</div><a href={`mailto:${l.email}`} style={{fontSize:12,color:"var(--honey)",textDecoration:"none"}}>{l.email}</a></td>
                <td style={{padding:"11px 14px",fontSize:13,color:"var(--text-primary)"}}>{l.company_name}</td>
                <td style={{padding:"11px 14px",fontSize:12,color:"var(--text-secondary)",maxWidth:160}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.product_type}</div></td>
                <td style={{padding:"11px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:100,background:`${statusColor[l.status]||"#64748B"}15`,color:statusColor[l.status]||"#64748B",border:`1px solid ${statusColor[l.status]||"#64748B"}30`}}>{l.status}</span></td>
                <td style={{padding:"11px 14px",fontSize:12,color:"var(--text-muted)"}}>{fmt(l.created_at)}</td>
                <td style={{padding:"11px 14px"}}>
                  {l.proposal_id&&<a href={`/proposal/${l.proposal_id}`} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"var(--blue)",textDecoration:"none",marginRight:10}}>View Proposal</a>}
                  {l.status!=="won"&&<button onClick={()=>createClient(l.id)} style={{fontSize:11,color:"#10B981",background:"none",border:"1px solid rgba(16,185,129,0.3)",borderRadius:6,padding:"3px 9px",cursor:"pointer"}}>→ Create Client</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>}
        {/* Clients table */}
        {tab==="clients"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          {(data?.clients||[]).map((c:any)=>(
            <div key={c.id} style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:14,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div><div style={{fontSize:16,fontWeight:700,color:"var(--text-primary)"}}>{c.company_name}</div><div style={{fontSize:13,color:"var(--text-secondary)"}}>{c.name} · {c.email}</div></div>
                <div style={{display:"flex",gap:8}}>
                  <a href={`/portal/${c.portal_token}`} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"var(--honey)",textDecoration:"none",border:"1px solid rgba(245,166,35,0.3)",padding:"5px 12px",borderRadius:6}}>View Portal</a>
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {(c.cb_phases||[]).map((p:any)=>(
                  <div key={p.phase_number} onClick={()=>{const ns=p.status==="upcoming"?"active":p.status==="active"?"complete":"upcoming";updatePhase(c.id,p.phase_number,ns);}}
                    style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:100,cursor:"pointer",background:p.status==="complete"?"rgba(16,185,129,0.15)":p.status==="active"?"rgba(245,166,35,0.15)":"rgba(255,255,255,0.04)",color:p.status==="complete"?"#10B981":p.status==="active"?"#F5A623":"#64748B",border:`1px solid ${p.status==="complete"?"rgba(16,185,129,0.3)":p.status==="active"?"rgba(245,166,35,0.3)":"var(--border)"}`}}>
                    {p.phase_number}
                  </div>
                ))}
              </div>
              <p style={{fontSize:11,color:"var(--text-muted)",marginTop:8}}>Click a phase number to cycle its status: upcoming → active → complete</p>
            </div>
          ))}
        </div>}
        {/* Proposals */}
        {tab==="proposals"&&<div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Company","Status","Sent","Viewed","Booked","Link"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{(data?.proposals||[]).map((p:any,i:number)=>(
              <tr key={p.id} style={{borderBottom:"1px solid var(--border)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                <td style={{padding:"11px 14px",fontSize:14,fontWeight:600,color:"var(--text-primary)"}}>{p.company_name}</td>
                <td style={{padding:"11px 14px"}}><span style={{fontSize:11,padding:"3px 9px",borderRadius:100,background:"rgba(245,166,35,0.1)",color:"var(--honey)",border:"1px solid rgba(245,166,35,0.2)"}}>{p.status}</span></td>
                <td style={{padding:"11px 14px",fontSize:12,color:"var(--text-muted)"}}>{fmt(p.created_at)}</td>
                <td style={{padding:"11px 14px",fontSize:12,color:p.viewed_at?"#10B981":"var(--text-muted)"}}>{p.viewed_at?fmt(p.viewed_at):"Not yet"}</td>
                <td style={{padding:"11px 14px",fontSize:12,color:p.booked_at?"#10B981":"var(--text-muted)"}}>{p.booked_at?fmt(p.booked_at):"Not yet"}</td>
                <td style={{padding:"11px 14px"}}><a href={`/proposal/${p.id}`} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"var(--blue)",textDecoration:"none"}}>View →</a></td>
              </tr>
            ))}</tbody>
          </table>
        </div>}
      </div>
    </main>
  );
}
