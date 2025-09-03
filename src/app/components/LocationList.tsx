"use client";

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

interface LocationListProps {
   locations: Location[];
   onLocationDeleted: (locationId: string) => void;
}

const LOCATION_TYPES = [
   { value: "work", label: "Trabajo", icon: "💼" },
   { value: "metro", label: "Metro/Transporte", icon: "🚇" },
   { value: "poi", label: "Punto de Interés", icon: "📍" },
   { value: "other", label: "Otro", icon: "📌" },
];

export default function LocationList({
   locations,
   onLocationDeleted,
}: LocationListProps) {
   const handleDelete = async (locationId: string) => {
      if (!confirm("¿Estás seguro de que quieres eliminar esta ubicación?")) {
         return;
      }

      try {
         const response = await fetch(`/api/locations/${locationId}`, {
            method: "DELETE",
         });

         if (!response.ok) {
            throw new Error("Error al eliminar la ubicación");
         }

         onLocationDeleted(locationId);
      } catch (error) {
         console.error("Error:", error);
         alert("Error al eliminar la ubicación");
      }
   };

   const getTypeInfo = (type: string) => {
      return LOCATION_TYPES.find((t) => t.value === type) || LOCATION_TYPES[3];
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("es-ES", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   if (locations.length === 0) {
      return (
         <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-lg">No hay ubicaciones guardadas</p>
            <p className="text-sm">
               Agrega tu primera ubicación usando el formulario de arriba
            </p>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mis Ubicaciones ({locations.length})
         </h3>

         <div className="grid gap-4">
            {locations.map((location) => {
               const typeInfo = getTypeInfo(location.type);
               return (
                  <div
                     key={location.id}
                     className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                     <div className="flex items-start justify-between">
                        <div className="flex-1">
                           <div className="flex items-center space-x-2 mb-2">
                              <div
                                 className="w-4 h-4 rounded-full"
                                 style={{ backgroundColor: location.iconColor }}
                              />
                              <span className="text-lg">{typeInfo.icon}</span>
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                 {location.name}
                              </h4>
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                 {typeInfo.label}
                              </span>
                           </div>

                           <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                              📍 {location.address}
                           </p>

                           {location.description && (
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                                 {location.description}
                              </p>
                           )}

                           <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>📅 {formatDate(location.createdAt)}</span>
                              <span>
                                 🌍 {location.lat.toFixed(4)},{" "}
                                 {location.lng.toFixed(4)}
                              </span>
                           </div>
                        </div>

                        <button
                           onClick={() => handleDelete(location.id)}
                           className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                           title="Eliminar ubicación"
                        >
                           <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                           </svg>
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
