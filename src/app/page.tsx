"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import AddApartmentFormCABA from "./components/AddApartmentFormCABA";
import ApartmentCard from "./components/ApartmentCard";
import {
   Apartment,
   formatUSD,
   formatARS,
   CABA_NEIGHBORHOODS,
} from "@/utils/apartments";

// Importar MapViewCABA dinámicamente para evitar problemas de SSR con Leaflet
const MapViewCABA = dynamic(() => import("./components/MapViewCABA"), {
   ssr: false,
   loading: () => (
      <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
         Cargando mapa...
      </div>
   ),
});

export default function HomePage() {
   const { data: session } = useSession();
   const [apartments, setApartments] = useState<Apartment[]>([]);
   const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(
      []
   );
   const [isLoading, setIsLoading] = useState(true);
   const [showForm, setShowForm] = useState(false);
   const [filters, setFilters] = useState({
      zone: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      currency: "USD",
      rooms: "",
   });

   useEffect(() => {
      fetchApartments();
   }, []);

   useEffect(() => {
      applyFilters();
   }, [apartments, filters]);

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

   const applyFilters = () => {
      let filtered = [...apartments];

      if (filters.zone) {
         filtered = filtered.filter((apt) => apt.zone === filters.zone);
      }

      if (filters.status) {
         filtered = filtered.filter((apt) => apt.status === filters.status);
      }

      if (filters.rooms) {
         filtered = filtered.filter(
            (apt) => apt.rooms === parseInt(filters.rooms)
         );
      }

      if (filters.minPrice) {
         const minPrice = parseFloat(filters.minPrice);
         filtered = filtered.filter((apt) => {
            const price =
               filters.currency === "USD"
                  ? apt.priceUSD
                  : apt.priceARS || apt.priceUSD * 1500;
            return price >= minPrice;
         });
      }

      if (filters.maxPrice) {
         const maxPrice = parseFloat(filters.maxPrice);
         filtered = filtered.filter((apt) => {
            const price =
               filters.currency === "USD"
                  ? apt.priceUSD
                  : apt.priceARS || apt.priceUSD * 1500;
            return price <= maxPrice;
         });
      }

      setFilteredApartments(filtered);
   };

   const handleAddApartment = async (apartmentData: any) => {
      try {
         const response = await fetch("/api/apartments", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(apartmentData),
         });

         if (!response.ok) {
            throw new Error("Error al agregar apartamento");
         }

         const newApartment = await response.json();
         setApartments([newApartment, ...apartments]);
         setShowForm(false);
      } catch (error) {
         console.error("Error adding apartment:", error);
         alert("Error al agregar el apartamento");
      }
   };

   const handleDeleteApartment = async (id: string) => {
      try {
         const response = await fetch(`/api/apartments/${id}`, {
            method: "DELETE",
         });

         if (!response.ok) {
            throw new Error("Error al eliminar apartamento");
         }

         setApartments(apartments.filter((apt) => apt.id !== id));
      } catch (error) {
         console.error("Error deleting apartment:", error);
         alert("Error al eliminar el apartamento");
      }
   };

   const stats = {
      total: apartments.length,
      available: apartments.filter((apt) => apt.status === "available").length,
      rented: apartments.filter((apt) => apt.status === "rented").length,
      reserved: apartments.filter((apt) => apt.status === "reserved").length,
      avgPriceUSD:
         apartments.length > 0
            ? apartments.reduce((sum, apt) => sum + apt.priceUSD, 0) /
              apartments.length
            : 0,
   };

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         {/* Header */}
         <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🏠 Alquileres CABA
                     </h1>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Sistema de gestión de alquileres en Ciudad Autónoma de
                        Buenos Aires
                     </p>
                  </div>
                  <div className="text-right">
                     {session ? (
                        <div>
                           <p className="text-sm text-gray-600 dark:text-gray-400">
                              Bienvenido,{" "}
                              <span className="font-medium">
                                 {session.user?.name || session.user?.email}
                              </span>
                           </p>
                           <button
                              onClick={() =>
                                 (window.location.href = "/api/auth/signout")
                              }
                              className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                           >
                              🚪 Cerrar sesión
                           </button>
                        </div>
                     ) : (
                        <button
                           onClick={() =>
                              (window.location.href = "/auth/signin")
                           }
                           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                        >
                           🔑 Iniciar Sesión
                        </button>
                     )}
                  </div>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                     <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total
                     </p>
                     <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.total}
                     </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                     <p className="text-xs text-gray-600 dark:text-gray-400">
                        Disponibles
                     </p>
                     <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.available}
                     </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                     <p className="text-xs text-gray-600 dark:text-gray-400">
                        Reservados
                     </p>
                     <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.reserved}
                     </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                     <p className="text-xs text-gray-600 dark:text-gray-400">
                        Alquilados
                     </p>
                     <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.rented}
                     </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                     <p className="text-xs text-gray-600 dark:text-gray-400">
                        Precio Promedio
                     </p>
                     <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {formatUSD(stats.avgPriceUSD)}
                     </p>
                  </div>
               </div>
            </div>
         </header>

         <main className="max-w-7xl mx-auto px-4 py-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filtros
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Barrio
                     </label>
                     <select
                        value={filters.zone}
                        onChange={(e) =>
                           setFilters({ ...filters, zone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                     >
                        <option value="">Todos</option>
                        {CABA_NEIGHBORHOODS.map((neighborhood) => (
                           <option key={neighborhood} value={neighborhood}>
                              {neighborhood}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estado
                     </label>
                     <select
                        value={filters.status}
                        onChange={(e) =>
                           setFilters({ ...filters, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                     >
                        <option value="">Todos</option>
                        <option value="available">Disponible</option>
                        <option value="reserved">Reservado</option>
                        <option value="rented">Alquilado</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ambientes
                     </label>
                     <select
                        value={filters.rooms}
                        onChange={(e) =>
                           setFilters({ ...filters, rooms: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                     >
                        <option value="">Todos</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                           <option key={num} value={num}>
                              {num} ambiente{num > 1 ? "s" : ""}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Moneda
                     </label>
                     <select
                        value={filters.currency}
                        onChange={(e) =>
                           setFilters({
                              ...filters,
                              currency: e.target.value,
                              minPrice: "",
                              maxPrice: "",
                           })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                     >
                        <option value="USD">USD</option>
                        <option value="ARS">ARS</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Precio Mín. ({filters.currency})
                     </label>
                     <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                           setFilters({ ...filters, minPrice: e.target.value })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Precio Máx. ({filters.currency})
                     </label>
                     <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                           setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        placeholder="999999"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                     />
                  </div>
               </div>

               <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     Mostrando {filteredApartments.length} de{" "}
                     {apartments.length} apartamentos
                  </p>
                  <button
                     onClick={() =>
                        setFilters({
                           zone: "",
                           status: "",
                           minPrice: "",
                           maxPrice: "",
                           currency: "USD",
                           rooms: "",
                        })
                     }
                     className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                     Limpiar filtros
                  </button>
               </div>
            </div>

            {/* Add Button */}
            <div className="mb-6 flex gap-4 flex-wrap">
               {session && (
                  <>
                     <button
                        onClick={() => (window.location.href = "/agregar")}
                        className="flex-1 md:flex-initial bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                     >
                        🗺️ Agregar con Mapa Interactivo
                     </button>
                     <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex-1 md:flex-initial bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-md"
                     >
                        {showForm ? "❌ Cancelar" : "📝 Agregar con Formulario"}
                     </button>
                  </>
               )}
               <button
                  onClick={() => (window.location.href = "/mapa-completo")}
                  className="flex-1 md:flex-initial bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
               >
                  🗺️ Ver Mapa Completo
               </button>
            </div>

            {/* Form */}
            {showForm && session && (
               <div className="mb-6">
                  <AddApartmentFormCABA
                     onAdd={handleAddApartment}
                     onCancel={() => setShowForm(false)}
                  />
               </div>
            )}

            {/* Map */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Mapa de Apartamentos
               </h2>
               <div className="h-[500px] rounded-lg overflow-hidden">
                  <MapViewCABA apartments={filteredApartments} />
               </div>
            </div>

            {/* List */}
            <div>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Lista de Apartamentos
               </h2>
               {isLoading ? (
                  <div className="text-center py-12">
                     <p className="text-gray-600 dark:text-gray-400">
                        Cargando apartamentos...
                     </p>
                  </div>
               ) : filteredApartments.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                     <p className="text-gray-600 dark:text-gray-400">
                        {apartments.length === 0
                           ? "No hay apartamentos registrados"
                           : "No se encontraron apartamentos con los filtros aplicados"}
                     </p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredApartments.map((apartment) => (
                        <ApartmentCard
                           key={apartment.id}
                           apartment={apartment}
                           onDelete={
                              session ? handleDeleteApartment : undefined
                           }
                        />
                     ))}
                  </div>
               )}
            </div>
         </main>

         {/* Footer */}
         <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-6">
               <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Sistema de Alquileres CABA - Conversión: 1 USD = 1500 ARS
               </p>
               <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
                  <a
                     href="/old"
                     className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                     Ver versión anterior
                  </a>
               </p>
            </div>
         </footer>
      </div>
   );
}
