export default function TipList({ tips }:{ tips:{user:string; body:string; date:string;}[] }){
  if(!tips.length) return <div className="opacity-70 text-sm">No tips yet. Be the first!</div>;
  return (<ul className="space-y-3">{tips.map((t,i)=>(<li key={i} className="card"><div className="text-sm opacity-80">{t.body}</div><div className="text-xs opacity-50 mt-1">by @{t.user} • {t.date}</div></li>))}</ul>);
}
