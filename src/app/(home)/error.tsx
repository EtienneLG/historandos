'use client';

import { useEffect } from 'react';

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-parchment font-sans text-ink">
      <h2 className="text-xl font-display text-pine">Impossible de charger les randos</h2>
      <p className="text-ink/60 text-sm">Une erreur est survenue lors du chargement des données.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blaze hover:bg-blaze-dark text-parchment-light text-sm font-semibold rounded-lg shadow-sm shadow-blaze/30 transition-all active:scale-[0.98]"
      >
        Réessayer
      </button>
    </main>
  );
}
