'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/types/question';

interface LoginFormProps {
    question: Question;
}

export default function LoginForm({ question }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      console.log(question);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
          required
        />

        <h3>{question.question}</h3>
        <input
          type="text"
          placeholder="Réponse"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border rounded p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black text-white p-2"
        >
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}