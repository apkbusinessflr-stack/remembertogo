// components/TipComposer.tsx
"use client";
import { useCallback, useMemo, useState } from "react";

type Props = { placeId: number };

const MIN_LEN = 3;
const MAX_LEN = 240;
const SUGGEST_MIN = 60;   // UX hint only
const SUGGEST_MAX = 120;  // UX hint only

export default function TipComposer({ placeId }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const len = text.trim().length;
  const tooShort = len > 0 && len < MIN_LEN;
  const tooLong = len > MAX_LEN;
  const withinSuggest = len >= SUGGEST_MIN && len <= SUGGEST_MAX;

  const canSubmit = useMemo(
    () => !loading && len >= MIN_LEN && len <= MAX_LEN,
    [loading, len]
  );

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setOk(false);
    setErr(null);

    try {
      const res = await fetch("/api/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_id: placeId,
          body: text.trim(),
          lang: "en",
        }),
      });

      if (!res.ok) {
        let msg = "Failed to submit tip.";
        try {
          const j = await res.json();
          if (j?.error) {
            if (typeof j.error === "string") msg = j.error;
            // zod flatten format
            const flat = j.error?.fieldErrors || j.error?.formErrors;
            if (flat) msg = "Invalid tip. Please check the content.";
          }
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      setOk(true);
      setText("");
    } catch (e: any) {
      setErr(e?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }, [canSubmit, placeId, text]);

  return (
    <div className="space-y-2">
      <label htmlFor="tip-body" className="visually-hidden">
        Add a short tip
      </label>

      <textarea
        id="tip-body"
        className="input h-24"
        placeholder="Add a short tip (suggested 60–120 chars)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_LEN + 10} // allow a bit over then show error
        aria-invalid={tooShort || tooLong ? "true" : "false"}
      />

      <div className="flex items-center justify-between text-xs">
        <div className={withinSuggest ? "opacity-70" : "opacity-50"}>
          {len}/{MAX_LEN} {withinSuggest ? "✓ good length" : ""}
        </div>
        {(tooShort || tooLong) && (
          <div className="field-error">
            {tooShort && `Tip is too short (min ${MIN_LEN} chars).`}
            {tooLong && `Tip is too long (max ${MAX_LEN} chars).`}
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <button className="btn" disabled={!canSubmit} onClick={submit}>
          {loading ? "Posting…" : "Post tip"}
        </button>
        {ok && <span className="text-xs opacity-70">Submitted ✔</span>}
        {err && <span className="field-error">{err}</span>}
      </div>
    </div>
  );
}
