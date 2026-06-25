import { useState } from 'react';

export function ActivityPhoto({ photoId }: { photoId: number }) {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 shadow-sm border border-slate-200/60">
      <img
        src={`/api/photos/${photoId}/thumbnail`}
        alt={`Photo ${photoId}`}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
}