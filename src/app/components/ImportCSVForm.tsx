'use client';

import { useState } from 'react';

interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
  total: number;
}

export default function ImportCSVForm() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Por favor selecciona un archivo CSV válido');
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo CSV');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/apartments/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.results);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error durante la importación:', error);
      alert('Error durante la importación');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Importar Apartamentos desde CSV</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar archivo CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Archivo seleccionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {importing ? 'Importando...' : 'Importar Apartamentos'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Resultado de la importación:</h3>
          <div className="space-y-1 text-sm">
            <div>Total de registros procesados: {result.total}</div>
            <div className="text-green-600">Apartamentos creados: {result.created}</div>
            <div className="text-blue-600">Apartamentos actualizados: {result.updated}</div>
            {result.errors.length > 0 && (
              <div className="text-red-600">
                Errores: {result.errors.length}
                <details className="mt-2">
                  <summary className="cursor-pointer">Ver errores</summary>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>El archivo CSV debe tener las siguientes columnas:</p>
        <ul className="list-disc list-inside mt-1">
          <li><strong>Requeridas:</strong> address, lat, lng, price</li>
          <li><strong>Opcionales:</strong> id, title, zone, notes, createdBy, userId, iconColor, status, link, createdAt</li>
        </ul>
      </div>
    </div>
  );
}