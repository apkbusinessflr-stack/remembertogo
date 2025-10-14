// app/report/ReportForm.tsx
"use client";
import { useCallback, useMemo, useState } from "react";

type TargetType = "place" | "tip" | "photo" | "list";

export default function ReportForm() {
  const [id, setId] = useState("");
  const [type, setType] = useState<TargetType>("tip");
  const [reason, setReason] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const idNum = useMemo(() => Number(id), [id]);
  const valid = useMemo(() => {
    const hasId = Number.isFinite(idNum) && idNum > 0;
    const hasReason = reason.trim().length >= 3;
    return hasId && hasReason;
  }, [idNum, reason]);

  const submit = useCallback(async () => {
    setOk(false);
    setErr(null);

    if (!valid) {
      setErr("Please provide a numeric target ID and a reason (min 3 chars).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mod/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: type,
          target_id: idNum,
          reason: reason.trim(),
        }),
      });

      if (!res.ok) {
        let msg = "Unexpected error";
        try {
          const j = await res.json();
          msg =
            (j?.error?.formErrors && j.error.formErrors.join(", ")) ||
            (typeof j?.error === "string" ? j.error : msg);
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      setOk(true);
      setId("");
      setReason("");
    } catch (e: any) {
      setErr(e?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  }, [type, idNum, reason, valid]);

  return (
    <div className="space-y-2 max-w-md">
      <label className="visually-hidden" htmlFor="report-type">Type</label>
      <select
        id="report-type"
        className="input"
        value={type}
        onChange={(e) => setType(e.target.value as TargetType)}
      >
        <option value="tip">Tip</option>
        <option value="photo">Photo</option>
        <option value="place">Place</option>
        <option value="list">List</option>
      </select>

      <label className="visually-hidden" htmlFor="report-id">Target ID</label>
      <input
        id="report-id"
        className="input"
        placeholder="Target ID (number)"
        inputMode="numeric"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <label className="visually-hidden" htmlFor="report-reason">Reason</label>
      <textarea
        id="report-reason"
        className="input h-24"
        placeholder="Reason (min 3 characters)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button className="btn" onClick={submit} disabled={!valid || loading}>
        {loading ? "Submitting…" : "Submit"}
      </button>

      <div aria-live="polite">
        {ok && <div className="text-sm opacity-70">Thanks — we’ll review.</div>}
        {err && <div className="field-error mt-1">{err}</div>}
      </div>
    </div>
  );
}
