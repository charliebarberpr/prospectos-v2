// app/page.tsx
'use client';

import { useState } from 'react';

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
    <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: -1  }}>BUSCAR PROSPECTOS</h1>
      <p style={{ marginBottom: '1rem', color: '#333' }}>
        Escribe el nombre completo o número de teléfono del prospecto:
      </p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ej: Carlos ó 7871234567"
        style={{
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '1rem',
          fontSize: '1rem',
        }}
      />
      <br />
      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          background: '#000',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {result && (
        <p style={{ marginTop: '2rem', fontWeight: 500 }}>{result}</p>
      )}
    </main>
  );
}
