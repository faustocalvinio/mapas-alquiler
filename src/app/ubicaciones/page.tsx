"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import AddLocationForm from "../components/AddLocationForm";
import LocationList from "../components/LocationList";

interface Location {
   id: string;
   name: string;
   address: string;
   type: string;
   description?: string;
   lat: number;
   lng: number;
   iconColor: string;
   createdAt: string;
}

export default function UbicacionesPage() {
   const [locations, setLocations] = useState<Location[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      fetchLocations();
   }, []);

   const fetchLocations = async () => {
      try {
         const response = await fetch("/api/locations");
         if (response.ok) {
            const data = await response.json();
            setLocations(data);
         }
      } catch (error) {
         console.error("Error al cargar ubicaciones:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleLocationAdded = (newLocation: Location) => {
      setLocations((prev) => [newLocation, ...prev]);
   };

   const handleLocationDeleted = (locationId: string) => {
      setLocations((prev) =>
         prev.filter((location) => location.id !== locationId)
      );
   };

   return (
      <AuthGuard>
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4 py-8">
               {/* Header */}
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                     <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                     >
                        ← Volver al mapa
                     </Link>
                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Mis Ubicaciones
                     </h1>
                  </div>
               </div>

               {/* Descripción */}
               <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="text-blue-800 dark:text-blue-200">
                     <strong>💡 Tip:</strong> Agrega ubicaciones importantes
                     como tu trabajo, estaciones de metro frecuentes, o puntos
                     de interés. Aparecerán en el mapa principal con iconos
                     distintivos para ayudarte a evaluar la proximidad de los
                     apartamentos.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Formulario */}
                  <div>
                     <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Agregar Nueva Ubicación
                     </h2>
                     <AddLocationForm onLocationAdded={handleLocationAdded} />
                  </div>

                  {/* Lista */}
                  <div>
                     <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Ubicaciones Guardadas
                     </h2>
                     {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                           <span className="ml-2 text-gray-600 dark:text-gray-400">
                              Cargando...
                           </span>
                        </div>
                     ) : (
                        <LocationList
                           locations={locations}
                           onLocationDeleted={handleLocationDeleted}
                        />
                     )}
                  </div>
               </div>
            </div>
         </div>
      </AuthGuard>
   );
}
