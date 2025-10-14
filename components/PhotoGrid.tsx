export default function PhotoGrid({ photos }:{ photos:{url:string; w:number; h:number;}[] }){ if(!photos.length) return null;
  return <div className="grid grid-cols-3 gap-2">{photos.map((p,i)=>(<img key={i} src={p.url} alt="" className="w-full h-24 object-cover rounded-xl border border-white/10" />))}</div>;
}
