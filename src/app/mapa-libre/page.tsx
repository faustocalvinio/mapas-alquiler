"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Importar el componente del mapa dinámicamente para evitar problemas de SSR
const SelectableMapView = dynamic(
   () => import("./components/SelectableMapView"),
   {
      ssr: false,
      loading: () => (
         <div className="h-screen w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
            <div className="text-center">
               <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p>Cargando mapa interactivo...</p>
            </div>
         </div>
      ),
   }
);

interface Apartment {
   id: string;
   title?: string;
   address: string;
   price: number;
   zone?: string;
   notes?: string;
   lat: number;
   lng: number;
   status: string;
   iconColor: string;
   createdBy?: string;
   userId?: string;
   user?: {
      name?: string;
      email?: string;
   };
   createdAt: string;
}

export default function MapaLibre() {
   const [apartments, setApartments] = useState<Apartment[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isDrawingMode, setIsDrawingMode] = useState(false);
   const [showApartments, setShowApartments] = useState(true);

   const fetchApartments = async () => {
      try {
         const response = await fetch("/api/apartments");
         if (!response.ok) throw new Error("Error al cargar apartamentos");

         const data = await response.json();
         setApartments(data);
      } catch (error) {
         console.error("Error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchApartments();
   }, []);

   return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900">
         {/* Barra superior con controles */}
         <div className="absolute top-0 left-0 right-0 z-[1000] bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
               {/* Lado izquierdo - Navegación */}
               <div className="flex items-center space-x-4">
                  <Link
                     href="/"
                     className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                     ← Volver al inicio
                  </Link>

                  <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                     Mapa Interactivo
                  </h1>

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                     Selecciona zonas y descarga capturas
                  </span>
               </div>

               {/* Centro - Controles del mapa */}
               <div className="flex items-center space-x-3">
                  <button
                     onClick={() => setIsDrawingMode(!isDrawingMode)}
                     className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isDrawingMode
                           ? "bg-blue-600 hover:bg-blue-700 text-white"
                           : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                     }`}
                  >
                     {isDrawingMode ? "🎯 Modo Selección" : "✏️ Activar Selección"}
                  </button>

                  <button
                     onClick={() => setShowApartments(!showApartments)}
                     className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        showApartments
                           ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                           : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                     }`}
                  >
                     {showApartments ? "🏠 Ocultar Apartamentos" : "🏠 Mostrar Apartamentos"}
                  </button>
               </div>

               {/* Lado derecho - Información */}
               <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                     <span className="font-medium">
                        {apartments.length} apartamentos cargados
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Mapa que ocupa toda la pantalla */}
         <div className="absolute inset-0 pt-16">
            <SelectableMapView
               apartments={showApartments ? apartments : []}
               isDrawingMode={isDrawingMode}
               onDrawingModeChange={setIsDrawingMode}
            />
         </div>

         {/* Indicador de carga */}
         {isLoading && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1001] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
               <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                     Cargando apartamentos...
                  </span>
               </div>
            </div>
         )}

         {/* Instrucciones de uso */}
         {isDrawingMode && (
            <div className="absolute bottom-4 left-4 z-[1001] bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 max-w-sm">
               <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Modo Selección Activo
               </h3>
               <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Dibuja un rectángulo para seleccionar una zona</li>
                  <li>• Haz clic en "Descargar Selección" cuando termines</li>
                  <li>• Usa las herramientas del mapa para dibujar formas</li>
                  <li>• Presiona ESC para cancelar el dibujo</li>
               </ul>
            </div>
         )}
      </div>
   );
}
