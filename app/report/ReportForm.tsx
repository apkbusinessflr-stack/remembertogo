// app/report/ReportForm.tsx
"use client";
import { useState } from "react";

export default function ReportForm() {
  const [id, setId] = useState("");
  const [type, setType] = useState<"place" | "tip" | "photo" | "list">("tip");
  const [reason, setReason] = useState("");
  const [ok, setOk] = useState(false);

  async function submit() {
    setOk(false);
    const res = await fetch("/api/mod/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_type: type, target_id: Number(id) || 0, reason }),
    });
    setOk(res.ok);
  }

  return (
    <div className="space-y-2 max-w-md">
      <select className="input" value={type} onChange={e => setType(e.target.value as any)}>
        <option value="tip">Tip</option>
        <option value="photo">Photo</option>
        <option value="place">Place</option>
        <option value="list">List</option>
      </select>
      <input className="input" placeholder="Target ID (number)" value={id} onChange={e => setId(e.target.value)} />
      <textarea className="input h-24" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />
      <button className="btn" onClick={submit}>Submit</button>
      {ok && <div className="text-sm opacity-70">Thanks — we’ll review.</div>}
    </div>
  );
}
