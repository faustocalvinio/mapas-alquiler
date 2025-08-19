"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import AuthButton from "../components/AuthButton";

// Importar FullScreenMapView dinámicamente para evitar problemas de SSR con Leaflet
const FullScreenMapView = dynamic(
   () => import("../components/FullScreenMapView"),
   {
      ssr: false,
      loading: () => (
         <div className="h-screen w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
            Cargando mapa...
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

export default function FullscreenMap() {
   const [apartments, setApartments] = useState<Apartment[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [showFilters, setShowFilters] = useState(false);
   const [currentFilters, setCurrentFilters] = useState<{
      minPrice?: number;
      maxPrice?: number;
      zone?: string;
      status?: string;
   }>({});

   const fetchApartments = async (
      filters: {
         minPrice?: number;
         maxPrice?: number;
         zone?: string;
         status?: string;
      } = {}
   ) => {
      try {
         const params = new URLSearchParams();
         if (filters.minPrice)
            params.append("minPrice", filters.minPrice.toString());
         if (filters.maxPrice)
            params.append("maxPrice", filters.maxPrice.toString());
         if (filters.zone) params.append("zone", filters.zone);
         if (filters.status) params.append("status", filters.status);

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

   const handleFiltersChange = (newFilters: {
      minPrice?: number;
      maxPrice?: number;
      zone?: string;
      status?: string;
   }) => {
      setCurrentFilters(newFilters);
      fetchApartments(newFilters);
   };

   const clearFilters = () => {
      setCurrentFilters({});
      fetchApartments({});
   };

   return (
      <AuthGuard>
         <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900">
            {/* Barra superior con controles */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center justify-between px-4 py-3">
                  {/* Lado izquierdo - Título y controles */}
                  <div className="flex items-center space-x-4">
                     <Link
                        href="/"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                     >
                        ← Volver
                     </Link>

                     <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Mapa Completo
                     </h1>

                     <span className="text-sm text-gray-600 dark:text-gray-400">
                        {apartments.length} apartamento
                        {apartments.length !== 1 ? "s" : ""}
                     </span>
                  </div>

                  {/* Centro - Filtros rápidos */}
                  <div className="flex items-center space-x-3">
                     <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                           showFilters
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                     >
                        🔍 Filtros
                     </button>

                     {(currentFilters.minPrice ||
                        currentFilters.maxPrice ||
                        currentFilters.zone) && (
                        <button
                           onClick={clearFilters}
                           className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 rounded-md transition-colors"
                        >
                           ✕ Limpiar
                        </button>
                     )}
                  </div>

                  {/* Lado derecho - Auth */}
                  <div>
                     <AuthButton />
                  </div>
               </div>

               {/* Panel de filtros desplegable */}
               {showFilters && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-4">
                     <div className="flex items-center space-x-4 max-w-4xl">
                        <div className="flex items-center space-x-2">
                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Precio mín:
                           </label>
                           <input
                              type="number"
                              placeholder="€"
                              value={currentFilters.minPrice || ""}
                              onChange={(e) => {
                                 const value = e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined;
                                 handleFiltersChange({
                                    ...currentFilters,
                                    minPrice: value,
                                 });
                              }}
                              className="w-20 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                           />
                        </div>

                        <div className="flex items-center space-x-2">
                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Precio máx:
                           </label>
                           <input
                              type="number"
                              placeholder="€"
                              value={currentFilters.maxPrice || ""}
                              onChange={(e) => {
                                 const value = e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined;
                                 handleFiltersChange({
                                    ...currentFilters,
                                    maxPrice: value,
                                 });
                              }}
                              className="w-20 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                           />
                        </div>

                        <div className="flex items-center space-x-2">
                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Barrio:
                           </label>
                           <input
                              type="text"
                              placeholder="Buscar zona..."
                              value={currentFilters.zone || ""}
                              onChange={(e) => {
                                 const value = e.target.value || undefined;
                                 handleFiltersChange({
                                    ...currentFilters,
                                    zone: value,
                                 });
                              }}
                              className="w-40 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                           />
                        </div>

                        <div className="flex items-center space-x-2">
                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Estado:
                           </label>
                           <select
                              value={currentFilters.status || ""}
                              onChange={(e) => {
                                 const value = e.target.value || undefined;
                                 handleFiltersChange({
                                    ...currentFilters,
                                    status: value,
                                 });
                              }}
                              className="w-28 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                           >
                              <option value="">Todos</option>
                              <option value="available">🟢 Disponible</option>
                              <option value="rented">🔴 Alquilado</option>
                           </select>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Mapa que ocupa toda la pantalla */}
            <div className="absolute inset-0 pt-16">
               {showFilters ? (
                  <div className="pt-20 h-full">
                     <FullScreenMapView apartments={apartments} />
                  </div>
               ) : (
                  <FullScreenMapView apartments={apartments} />
               )}
            </div>

            {/* Indicador de carga */}
            {isLoading && (
               <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                     Cargando apartamentos...
                  </span>
               </div>
            )}
         </div>
      </AuthGuard>
   );
}
