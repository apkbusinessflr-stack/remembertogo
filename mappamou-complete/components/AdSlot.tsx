"use client";
import { useEffect, useRef } from "react";
export default function AdSlot({ id }:{ id:string }){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ if(ref.current){ ref.current.style.minHeight="180px"; ref.current.style.display="block"; }},[]);
  return (
    <div ref={ref}>
      <div className="card text-center text-xs opacity-70">
        <div>Ad Slot: <code>{id}</code></div>
        <div>(replace with official AdSense code when approved)</div>
      </div>
    </div>
  );
}
