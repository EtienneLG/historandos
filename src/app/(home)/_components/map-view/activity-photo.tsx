export function ActivityPhoto({ photoId }: { photoId: number }) {
  return (
    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone shadow-sm border border-stone">
      <img
        src={`/api/photos/${photoId}/thumbnail`}
        alt={`Photo ${photoId}`}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
}