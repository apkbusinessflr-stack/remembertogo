// components/TipList.tsx
type Tip = { user: string; body: string; date: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export default function TipList({ tips }: { tips: Tip[] }) {
  if (!tips?.length) {
    return <div className="opacity-70 text-sm">No tips yet. Be the first!</div>;
  }

  return (
    <ul className="space-y-3">
      {tips.map((t, i) => (
        <li key={i} className="card">
          <div className="text-sm opacity-80">{t.body}</div>
          <div className="text-xs opacity-50 mt-1">
            by @{t.user} • {formatDate(t.date)}
          </div>
        </li>
      ))}
    </ul>
  );
}
