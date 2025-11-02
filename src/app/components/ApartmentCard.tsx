"use client";

import { useState } from "react";
import {
   Apartment,
   CABA_NEIGHBORHOODS,
   formatUSD,
   formatARS,
} from "@/utils/apartments";

interface ApartmentCardProps {
   apartment: Apartment;
   onEdit?: (apartment: Apartment) => void;
   onDelete?: (id: string) => void;
}

export default function ApartmentCard({
   apartment,
   onEdit,
   onDelete,
}: ApartmentCardProps) {
   const [showDetails, setShowDetails] = useState(false);

   const statusColors = {
      available:
         "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rented: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      reserved:
         "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
   };

   const statusLabels = {
      available: "Disponible",
      rented: "Alquilado",
      reserved: "Reservado",
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
         <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
               {apartment.title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                     {apartment.title}
                  </h3>
               )}
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  {apartment.address}
               </p>
               {apartment.zone && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                     📍 {apartment.zone}
                     {apartment.neighborhood && ` - ${apartment.neighborhood}`}
                  </p>
               )}
            </div>
            <span
               className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[apartment.status as keyof typeof statusColors] ||
                  statusColors.available
               }`}
            >
               {statusLabels[apartment.status as keyof typeof statusLabels] ||
                  apartment.status}
            </span>
         </div>

         <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
               <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatUSD(apartment.priceUSD)}
               </span>
               <span className="text-sm text-gray-600 dark:text-gray-400">
                  {apartment.priceARS
                     ? formatARS(apartment.priceARS)
                     : formatARS(apartment.priceUSD * 1500)}
               </span>
            </div>

            {showDetails && (
               <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300 border-t pt-2">
                  {apartment.rooms && (
                     <p>
                        🛏️ {apartment.rooms} ambiente
                        {apartment.rooms > 1 ? "s" : ""}
                     </p>
                  )}
                  {apartment.bathrooms && (
                     <p>
                        🚿 {apartment.bathrooms} baño
                        {apartment.bathrooms > 1 ? "s" : ""}
                     </p>
                  )}
                  {apartment.squareMeters && (
                     <p>📏 {apartment.squareMeters} m²</p>
                  )}
                  {apartment.expenses && (
                     <p>💰 Expensas: {formatARS(apartment.expenses)}</p>
                  )}
                  {apartment.notes && (
                     <p className="text-xs italic border-t mt-2 pt-2">
                        📝 {apartment.notes}
                     </p>
                  )}
                  {apartment.createdBy && (
                     <p className="text-xs text-gray-500">
                        👤 Agregado por: {apartment.createdBy}
                     </p>
                  )}
               </div>
            )}
         </div>

         <div className="flex gap-2">
            <button
               onClick={() => setShowDetails(!showDetails)}
               className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
               {showDetails ? "Ver menos" : "Ver más"}
            </button>
            {apartment.link && (
               <a
                  href={apartment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
               >
                  🔗 Link
               </a>
            )}
            {onEdit && (
               <button
                  onClick={() => onEdit(apartment)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
               >
                  ✏️
               </button>
            )}
            {onDelete && (
               <button
                  onClick={() => {
                     if (
                        confirm("¿Estás seguro de eliminar este apartamento?")
                     ) {
                        onDelete(apartment.id);
                     }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
               >
                  🗑️
               </button>
            )}
         </div>
      </div>
   );
}
