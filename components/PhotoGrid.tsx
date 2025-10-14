// components/PhotoGrid.tsx
import Image from "next/image";

type Photo = { url: string; w: number; h: number; alt?: string };

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (!photos?.length) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p, i) => (
        <div key={i} className="relative w-full overflow-hidden rounded-xl border border-white/10">
          <Image
            src={p.url}
            alt={p.alt || ""}
            width={p.w}
            height={p.h}
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
