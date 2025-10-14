"use client";
export default function ShareCardButton({ listName, visited, total }:{ listName:string; visited:number; total:number }){
  async function generate(){ const url=`/og/list?name=${encodeURIComponent(listName)}&v=${visited}&t=${total}`; await navigator.clipboard.writeText(location.origin+url); alert("Share image URL copied!"); }
  return <button className="btn" onClick={generate}>Generate Share Card</button>;
}
