"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import AddApartmentForm from "./components/AddApartmentForm";
import Filters from "./components/Filters";
import ApartmentList from "./components/ApartmentList";
import AuthGuard from "./components/AuthGuard";
import AuthButton from "./components/AuthButton";

// Importar MapView dinámicamente para evitar problemas de SSR con Leaflet
const MapView = dynamic(() => import("./components/MapView"), {
   ssr: false,
   loading: () => (
      <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
         Cargando mapa...
      </div>
   ),
});

interface Apartment {
   id: string;
   title?: string;
   address: string;
   price: number;
   zone?: string;
   notes?: string;
   lat: number;
   lng: number;
   createdBy?: string;
   userId?: string;
   user?: {
      name?: string;
      email?: string;
   };
   createdAt: string;
}

export default function Home() {
   const [apartments, setApartments] = useState<Apartment[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [currentFilters, setCurrentFilters] = useState<{
      minPrice?: number;
      maxPrice?: number;
      zone?: string;
   }>({});

   const fetchApartments = async (
      filters: { minPrice?: number; maxPrice?: number; zone?: string } = {}
   ) => {
      try {
         const params = new URLSearchParams();
         if (filters.minPrice)
            params.append("minPrice", filters.minPrice.toString());
         if (filters.maxPrice)
            params.append("maxPrice", filters.maxPrice.toString());
         if (filters.zone) params.append("zone", filters.zone);

         const response = await fetch(`/api/apartments?${params}`);
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

   const handleFiltersChange = (filters: {
      minPrice?: number;
      maxPrice?: number;
      zone?: string;
   }) => {
      setCurrentFilters(filters);
      fetchApartments(filters);
   };

   const handleApartmentAdded = () => {
      fetchApartments(currentFilters);
   };

   const handleApartmentDeleted = () => {
      fetchApartments(currentFilters);
   };

   const handleApartmentUpdated = () => {
      fetchApartments(currentFilters);
   };

   return (
      <AuthGuard>
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4 py-8">
               <header className="text-center mb-8">
                  <div className="flex justify-between items-center mb-4">
                     <div></div>
                     <AuthButton />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                     Mapa de Apartamentos en Madrid
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                     Encuentra y añade apartamentos en alquiler en Madrid
                  </p>
               </header>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Columna izquierda: Formulario y filtros */}
                  <div className="lg:col-span-1 space-y-6">
                     <AddApartmentForm
                        onApartmentAdded={handleApartmentAdded}
                     />
                     <Filters onFiltersChange={handleFiltersChange} />
                  </div>

                  {/* Columna derecha: Mapa */}
                  <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                              Apartamentos ({apartments.length})
                           </h2>
                           {isLoading && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                 Cargando...
                              </span>
                           )}
                        </div>

                        <MapView apartments={apartments} />

                        {apartments.length === 0 && !isLoading && (
                           <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              No se encontraron apartamentos con los filtros
                              actuales.
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Lista de apartamentos en ancho completo */}
               <div className="mt-8">
                  <ApartmentList
                     apartments={apartments}
                     onApartmentDeleted={handleApartmentDeleted}
                     onApartmentUpdated={handleApartmentUpdated}
                  />
               </div>
            </div>
         </div>
      </AuthGuard>
   );
}
