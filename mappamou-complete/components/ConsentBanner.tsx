"use client";
import { useEffect, useState } from "react";
export default function ConsentBanner(){
  const [v,setV]=useState(false);
  useEffect(()=>{ if(!localStorage.getItem("consent_accepted")) setV(true); },[]);
  if(!v) return null;
  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-50">
      <div className="container">
        <div className="card flex items-center justify-between gap-4">
          <div className="text-sm">We use cookies for analytics and ads. You can continue with non-personalized ads.</div>
          <div className="flex gap-2">
            <button className="btn" onClick={()=>{localStorage.setItem("consent_accepted","1");location.reload();}}>Accept</button>
            <button className="btn" onClick={()=>localStorage.setItem("consent_accepted","1")}>Continue (NPA)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
