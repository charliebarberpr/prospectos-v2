// app/page.tsx
'use client';

import { useState } from 'react';
import './searchInput.css'; // Asegúrate de tener este archivo

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/check-client?name=${encodeURIComponent(input)}`);
      const data = await res.json();

      if (data.found) {
        setResult(`✅ Ya existe un contacto con esta información.`);
      } else {
        setResult('❌ No se encontró ningún contacto con esa información.');
      }
    } catch {
      setResult('⚠️ Hubo un error al buscar.');
    }

    setLoading(false);
  };

  return (
    <main className="main-container">
      <h1 className="title">BUSCA PROSPECTO</h1>
      <p className="subtitle">
        Verifica si el contacto está en el sistema:
      </p>
      <input
        type="text"
        className="input-search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ej: Carlos ó 7871234567"
      />
      <br />
      <button
        className="search-button"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {result && <p className="result">{result}</p>}
    </main>
  );
}
