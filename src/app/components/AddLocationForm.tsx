"use client";

import { useState } from "react";

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

interface AddLocationFormProps {
   onLocationAdded: (location: Location) => void;
}

const LOCATION_TYPES = [
   { value: "work", label: "Trabajo", icon: "💼", color: "#059669" },
   { value: "metro", label: "Metro/Transporte", icon: "🚇", color: "#DC2626" },
   { value: "poi", label: "Punto de Interés", icon: "📍", color: "#7C3AED" },
   { value: "other", label: "Otro", icon: "📌", color: "#6B7280" },
];

export default function AddLocationForm({
   onLocationAdded,
}: AddLocationFormProps) {
   const [formData, setFormData] = useState({
      name: "",
      address: "",
      type: "work",
      description: "",
      iconColor: "#059669",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         // Geocodificar la dirección
         const geocodeResponse = await fetch(
            `/api/validate-address?address=${encodeURIComponent(
               formData.address
            )}`
         );

         if (!geocodeResponse.ok) {
            throw new Error("No se pudo encontrar la dirección");
         }

         const { lat, lng, formattedAddress } = await geocodeResponse.json();

         // Crear la ubicación
         const response = await fetch("/api/locations", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               ...formData,
               address: formattedAddress || formData.address,
               lat,
               lng,
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear la ubicación");
         }

         const newLocation = await response.json();
         onLocationAdded(newLocation);

         // Limpiar formulario
         setFormData({
            name: "",
            address: "",
            type: "work",
            description: "",
            iconColor: "#059669",
         });
      } catch (error) {
         console.error("Error:", error);
         setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
         setIsLoading(false);
      }
   };

   const handleTypeChange = (type: string) => {
      const selectedType = LOCATION_TYPES.find((t) => t.value === type);
      setFormData((prev) => ({
         ...prev,
         type,
         iconColor: selectedType?.color || "#6B7280",
      }));
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
               >
                  Nombre de la ubicación *
               </label>
               <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                     setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Mi oficina, Estación Sol..."
                  required
               />
            </div>

            <div>
               <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
               >
                  Tipo *
               </label>
               <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
               >
                  {LOCATION_TYPES.map((type) => (
                     <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div>
            <label
               htmlFor="address"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
               Dirección *
            </label>
            <input
               type="text"
               id="address"
               value={formData.address}
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
               }
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="Calle, número, ciudad..."
               required
            />
         </div>

         <div>
            <label
               htmlFor="description"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
               Descripción (opcional)
            </label>
            <textarea
               id="description"
               value={formData.description}
               onChange={(e) =>
                  setFormData((prev) => ({
                     ...prev,
                     description: e.target.value,
                  }))
               }
               rows={3}
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="Información adicional sobre esta ubicación..."
            />
         </div>

         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color del marcador:
               </label>
               <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: formData.iconColor }}
               />
               <span className="text-sm text-gray-600 dark:text-gray-400">
                  {LOCATION_TYPES.find((t) => t.value === formData.type)?.icon}{" "}
                  {LOCATION_TYPES.find((t) => t.value === formData.type)?.label}
               </span>
            </div>
         </div>

         {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded-md">
               {error}
            </div>
         )}

         <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
         >
            {isLoading ? "Agregando ubicación..." : "Agregar Ubicación"}
         </button>
      </form>
   );
}
