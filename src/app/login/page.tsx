'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/types/question';

export default function LoginPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [password, setPassword] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(true);
  const router = useRouter();

  const fetchQuestion = async () => {
    setQuestionLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login/qa/question');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load question');
      }

      setQuestion(data.question ?? null);
      setAnswer('');
    } catch {
      setError('Impossible de charger la question');
    } finally {
      setQuestionLoading(false);
    }
  };

  useEffect(() => {
    void fetchQuestion();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      if (!question) {
        setError('Question indisponible');
        return;
      }
      
      const response = await fetch('/api/login/qa/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: question.id,
          answer,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur serveur');
        return;
      }

      router.push(data.redirect);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      {/* Misty forest sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100 via-tarn/40 to-pine-dark" />

      {/* Soft diffuse light, top-left, standing in for filtered morning sun */}
      <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-emerald-50/40 blur-3xl" />

      {/* Mountain layers — back to front, with mist bands between */}
      <svg className="absolute bottom-0 left-0 w-full h-[60%]" viewBox="0 0 1440 500" preserveAspectRatio="none">
        <path d="M0,260 L240,120 L480,240 L720,80 L960,220 L1200,110 L1440,230 L1440,500 L0,500 Z" fill="#4a7c8c" opacity="0.5" />
        <rect x="0" y="230" width="1440" height="40" fill="url(#mist1)" />
        <path d="M0,330 L200,190 L420,300 L680,160 L900,290 L1160,180 L1440,310 L1440,500 L0,500 Z" fill="#3a6650" opacity="0.75" />
        <rect x="0" y="300" width="1440" height="40" fill="url(#mist2)" />
        <path d="M0,420 L260,290 L520,390 L780,260 L1040,380 L1440,300 L1440,500 L0,500 Z" fill="#1e3329" />
        <defs>
          <linearGradient id="mist1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3eee1" stopOpacity="0" />
            <stop offset="50%" stopColor="#f3eee1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f3eee1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mist2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3eee1" stopOpacity="0" />
            <stop offset="50%" stopColor="#f3eee1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f3eee1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Foreground texture */}
      <div className="absolute inset-0 topo-texture pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-xl">

        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-parchment-light shadow-xl border border-stone">
            <svg className="w-8 h-8 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="font-display text-2xl tracking-wide text-parchment-light uppercase drop-shadow-md">
            Histo'<span className="text-blaze">Rando</span>
          </span>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-parchment-light/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-parchment-light/30 overflow-hidden"
        >
          {/* Colored header band */}
          <div className="bg-gradient-to-r from-pine to-pine-dark px-12 py-5 text-center">
            <h2 className="font-display text-xl text-parchment-light tracking-wide">Bienvenue</h2>
            <p className="text-parchment-light/60 text-sm mt-1">Connecte-toi pour continuer</p>
          </div>

          <div className="flex flex-col gap-5 p-12">

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold uppercase tracking-wide text-pine/70">Mot de passe</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pine/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-pine/40 focus:border-pine transition-all placeholder:text-ink/30 text-ink"
                  required
                />
              </div>
            </div>

            {/* Security question */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-base font-bold tracking-wide text-blaze">
                  {questionLoading ? 'Chargement de la question…' : question?.question || 'Question indisponible'}
                </label>
                <button
                  type="button"
                  onClick={() => void fetchQuestion()}
                  disabled={questionLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-tarn/20 bg-parchment-light text-tarn transition hover:bg-tarn/10 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Changer la question de sécurité"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.008M20 20v-5h-.008M5.6 9a8 8 0 0112.8-2.8M18.4 15a8 8 0 01-12.8 2.8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l1 2M20 20l-1-2" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tarn/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <input
                  type={questionLoading ? "text" : question?.type}
                  placeholder="Réponse"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-tarn/40 focus:border-tarn transition-all placeholder:text-ink/30 text-ink"
                  required
                  disabled={questionLoading || !question}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || questionLoading || !question}
              className="flex items-center justify-center gap-2 mt-1 px-5 py-3 text-sm font-semibold bg-blaze hover:bg-blaze-dark text-parchment-light rounded-xl shadow-lg shadow-blaze/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Chargement...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}