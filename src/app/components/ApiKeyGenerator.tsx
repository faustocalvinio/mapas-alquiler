"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ApiKeyGenerator() {
   const { data: session } = useSession();
   const [copied, setCopied] = useState(false);

   if (!session?.user?.email) {
      return (
         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
               Debes iniciar sesión para ver tu API Key
            </p>
         </div>
      );
   }

   const apiKey = Buffer.from(session.user.email).toString("base64");

   const copyToClipboard = () => {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
               🔑 Tu API Key para la Extensión de Chrome
            </h2>
            <p className="text-gray-600 text-sm">
               Usa esta clave en la extensión de Chrome para agregar
               apartamentos desde Idealista
            </p>
         </div>

         <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
               API Key:
            </label>
            <div className="flex gap-2">
               <code className="flex-1 bg-white px-4 py-3 rounded border border-gray-300 text-sm font-mono break-all">
                  {apiKey}
               </code>
               <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded font-semibold transition-colors ${
                     copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
               >
                  {copied ? "✓ Copiado" : "Copiar"}
               </button>
            </div>
         </div>

         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
               📋 Instrucciones:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
               <li>
                  Instala la extensión de Chrome desde la carpeta{" "}
                  <code className="bg-blue-100 px-1 rounded">
                     chrome-extension
                  </code>
               </li>
               <li>
                  Abre la extensión y ve a la pestaña{" "}
                  <strong>Configuración</strong>
               </li>
               <li>Pega esta API Key en el campo correspondiente</li>
               <li>Guarda la configuración y prueba la conexión</li>
               <li>
                  ¡Listo! Ahora puedes agregar apartamentos desde Idealista
               </li>
            </ol>
         </div>

         <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">
               🌐 Endpoint API:
            </h3>
            <div className="space-y-2 text-sm">
               <div>
                  <span className="font-semibold text-purple-800">URL:</span>
                  <code className="ml-2 bg-purple-100 px-2 py-1 rounded">
                     {typeof window !== "undefined"
                        ? window.location.origin
                        : ""}
                     /api/apartments/from-extension
                  </code>
               </div>
               <div>
                  <span className="font-semibold text-purple-800">Método:</span>
                  <code className="ml-2 bg-purple-100 px-2 py-1 rounded">
                     POST
                  </code>
               </div>
               <div>
                  <span className="font-semibold text-purple-800">Header:</span>
                  <code className="ml-2 bg-purple-100 px-2 py-1 rounded">
                     x-api-key: {apiKey}
                  </code>
               </div>
            </div>
         </div>

         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
               🧪 Probar con cURL:
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
               {`curl -X POST ${
                  typeof window !== "undefined"
                     ? window.location.origin
                     : "http://localhost:3000"
               }/api/apartments/from-extension \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "address": "Calle Mayor 1, Madrid",
    "price": 1000,
    "title": "Piso de prueba"
  }'`}
            </pre>
         </div>

         <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Seguridad:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
               <li>No compartas tu API Key públicamente</li>
               <li>
                  Esta key está vinculada a tu email:{" "}
                  <strong>{session.user.email}</strong>
               </li>
               <li>Solo usuarios autorizados pueden usar el endpoint</li>
               <li>La key se guarda de forma segura en Chrome</li>
            </ul>
         </div>
      </div>
   );
}
