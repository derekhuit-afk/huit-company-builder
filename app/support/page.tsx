"use client";
import { useState, useRef, useEffect } from "react";

const STARTERS=["What does a full build include?","How long does the build take?","What industries work best with this blueprint?","What's the difference between the tech stack and concept layer?","How does the recruiting funnel work?","Can I see a live example?"];

export default function SupportPage() {
  const [msgs,setMsgs]=useState<{role:string;content:string}[]>([{role:"assistant",content:"Hey — I'm the Huit.AI Company Builder assistant. I know the full blueprint: every phase, every table, every API route, every design decision.\n\nWhat would you like to know about your build?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [sessionId]=useState(()=>Math.random().toString(36).substring(2,12));
  const bottomRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  async function send(text?: string) {
    const message = text || input.trim();
    if (!message || loading) return;
    setInput("");
    const newMsgs=[...msgs,{role:"user",content:message}];
    setMsgs(newMsgs); setLoading(true);
    const apiMsgs=newMsgs.slice(-10).map(m=>({role:m.role,content:m.content}));
    const res=await fetch("/api/support",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:apiMsgs,sessionId})});
    const data=await res.json();
    setMsgs(m=>[...m,{role:"assistant",content:data.reply||"Something went wrong. Please try again."}]);
    setLoading(false);
  }

  return (
    <main style={{minHeight:"100vh",background:"var(--obsidian)",display:"flex",flexDirection:"column"}}>
      {/* Nav */}
      <div style={{background:"var(--charcoal)",borderBottom:"1px solid var(--border)",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,#F5A623,#D4881A)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#0A0A0B"}}>⬡</div>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)"}}>Company Builder AI</div>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#10B981"}} />
          <div style={{fontSize:11,color:"#10B981"}}>Online · 24/7</div>
        </div>
        <a href="/" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>← Back</a>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"24px 24px 0"}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",flexDirection:"column",gap:14}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"82%",background:m.role==="user"?"linear-gradient(135deg,#F5A623,#D4881A)":"var(--charcoal)",color:m.role==="user"?"#0A0A0B":"var(--text-primary)",padding:"12px 16px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",fontSize:14,lineHeight:1.65,border:m.role==="assistant"?"1px solid var(--border)":"none",whiteSpace:"pre-line"}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:"16px 16px 16px 4px",padding:"12px 16px",fontSize:14,color:"var(--text-muted)"}}>Thinking...</div></div>}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Starters */}
      {msgs.length===1&&<div style={{padding:"16px 24px 0",maxWidth:700,margin:"0 auto",width:"100%"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {STARTERS.map(q=>(
            <button key={q} onClick={()=>send(q)} style={{fontSize:12,padding:"6px 12px",borderRadius:100,background:"rgba(245,166,35,0.07)",border:"1px solid rgba(245,166,35,0.2)",color:"var(--honey)",cursor:"pointer"}}>{q}</button>
          ))}
        </div>
      </div>}

      {/* Input */}
      <div style={{padding:"16px 24px 24px",flexShrink:0}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",gap:10}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask anything about the build..." style={{flex:1,background:"var(--charcoal)",border:"1px solid var(--border)",borderRadius:12,padding:"13px 16px",color:"var(--text-primary)",fontSize:14,outline:"none"}} />
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:"linear-gradient(135deg,#F5A623,#D4881A)",color:"#0A0A0B",border:"none",borderRadius:12,padding:"13px 20px",fontSize:14,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Send →</button>
        </div>
        <p style={{fontSize:11,color:"var(--text-muted)",textAlign:"center",marginTop:10}}>Or <a href="/build" style={{color:"var(--honey)",textDecoration:"none"}}>get your instant proposal →</a></p>
      </div>
    </main>
  );
}
