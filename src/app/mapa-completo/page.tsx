"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Apartment } from "@/utils/apartments";

// Importar MapViewCABA dinámicamente para evitar problemas de SSR con Leaflet
const MapViewCABA = dynamic(() => import("../components/MapViewCABA"), {
   ssr: false,
   loading: () => (
      <div className="h-screen w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
         Cargando mapa...
      </div>
   ),
});

export default function MapaCompletoPage() {
   const router = useRouter();
   const [apartments, setApartments] = useState<Apartment[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      fetchApartments();
   }, []);

   const fetchApartments = async () => {
      try {
         setIsLoading(true);
         const response = await fetch("/api/apartments");
         const data = await response.json();
         setApartments(data);
      } catch (error) {
         console.error("Error fetching apartments:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="relative h-screen w-full">
         {/* Botón de regreso */}
         <button
            onClick={() => router.push("/")}
            className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
         >
            <span>←</span>
            <span>Volver</span>
         </button>

         {/* Contador de propiedades */}
         <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg">
            <span className="font-semibold">
               {apartments.length}{" "}
               {apartments.length === 1 ? "propiedad" : "propiedades"}
            </span>
         </div>

         {/* Mapa */}
         {isLoading ? (
            <div className="h-screen w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Cargando propiedades...</p>
               </div>
            </div>
         ) : (
            <div className="h-screen w-full">
               <MapViewCABA apartments={apartments} />
            </div>
         )}
      </div>
   );
}
