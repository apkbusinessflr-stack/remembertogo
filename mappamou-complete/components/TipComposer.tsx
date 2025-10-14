"use client"; import { useState } from "react";
export default function TipComposer({ placeId }:{placeId:number}){
  const [text,setText]=useState(""); const [loading,setLoading]=useState(false); const [ok,setOk]=useState(false);
  async function submit(){ if(!text.trim()) return; setLoading(true);
    const res=await fetch("/api/tip",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({ place_id: placeId, body: text, lang:'en' })});
    setLoading(false); setOk(res.ok); if(res.ok) setText(""); }
  return (<div className="space-y-2"><textarea className="input h-20" placeholder="Add a short tip (60–120 chars)" value={text} onChange={e=>setText(e.target.value)} />
    <div className="flex gap-2 items-center"><button className="btn" disabled={loading || !text.trim()} onClick={submit}>Post tip</button>{ok && <span className="text-xs opacity-70">Submitted ✔</span>}</div></div>);
}
