import { Metadata } from "next";
import ApiKeyGenerator from "../components/ApiKeyGenerator";
import AuthGuard from "../components/AuthGuard";
import Link from "next/link";

export const metadata: Metadata = {
   title: "API Key - Extensión Chrome | Mapas Alquiler",
   description: "Obtén tu API Key para usar la extensión de Chrome",
};

export default function ApiKeyPage() {
   return (
      <AuthGuard>
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
               <div className="mb-6 flex items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Extensión de Chrome para Idealista
                     </h1>
                     <p className="text-gray-600">
                        Agrega apartamentos desde Idealista con un solo click
                     </p>
                  </div>
                  <Link
                     href="/"
                     className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                     ← Volver al mapa
                  </Link>
               </div>

               <ApiKeyGenerator />

               <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                     📚 Documentación Completa
                  </h2>
                  <div className="space-y-3 text-gray-700">
                     <p>
                        Para instrucciones detalladas de instalación y uso,
                        consulta:
                     </p>
                     <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                           <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              EXTENSION-SETUP.md
                           </code>{" "}
                           - Guía rápida de configuración
                        </li>
                        <li>
                           <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              chrome-extension/README.md
                           </code>{" "}
                           - Documentación completa de la extensión
                        </li>
                     </ul>
                  </div>
               </div>

               <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
                  <h2 className="text-xl font-bold mb-3">🚀 ¿Cómo funciona?</h2>
                  <div className="space-y-3">
                     <div className="flex items-start gap-3">
                        <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                           1
                        </div>
                        <div>
                           <strong>Navega a Idealista</strong>
                           <p className="text-blue-100 text-sm">
                              Abre cualquier anuncio de apartamento en
                              Idealista.com
                           </p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                           2
                        </div>
                        <div>
                           <strong>Click en la extensión</strong>
                           <p className="text-blue-100 text-sm">
                              Haz click en el ícono 🏠 de la extensión en tu
                              navegador
                           </p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                           3
                        </div>
                        <div>
                           <strong>Extrae y guarda</strong>
                           <p className="text-blue-100 text-sm">
                              La extensión extrae automáticamente todos los
                              datos y los guarda en tu aplicación
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthGuard>
   );
}
