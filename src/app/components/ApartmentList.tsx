"use client";

import { useState } from "react";
import EditApartmentModal from "./EditApartmentModal";

interface Apartment {
   id: string;
   title?: string;
   address: string;
   price: number;
   zone?: string;
   notes?: string;
   lat: number;
   lng: number;
   createdAt: string;
}

interface ApartmentListProps {
   apartments: Apartment[];
   onApartmentDeleted: () => void;
}

export default function ApartmentList({
   apartments,
   onApartmentDeleted,
}: ApartmentListProps) {
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [editingApartment, setEditingApartment] = useState<Apartment | null>(
      null
   );
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   const handleDelete = async (id: string) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este apartamento?")) {
         return;
      }

      setDeletingId(id);
      try {
         const response = await fetch(`/api/apartments?id=${id}`, {
            method: "DELETE",
         });

         if (!response.ok) {
            throw new Error("Error al eliminar el apartamento");
         }

         onApartmentDeleted();
      } catch (error) {
         console.error("Error:", error);
         alert("Error al eliminar el apartamento");
      } finally {
         setDeletingId(null);
      }
   };

   const handleEdit = (apartment: Apartment) => {
      setEditingApartment(apartment);
      setIsEditModalOpen(true);
   };

   const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setEditingApartment(null);
   };

   const handleApartmentUpdated = () => {
      onApartmentDeleted(); // Reutilizamos esta función para refrescar la lista
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("es-ES", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   if (apartments.length === 0) {
      return (
         <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
               Lista de Apartamentos
            </h2>
            <div className="text-center py-8 text-gray-500">
               No hay apartamentos registrados
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg shadow-md p-6">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Lista de Apartamentos ({apartments.length})
         </h2>

         <div className="space-y-4">
            {apartments.map((apartment) => (
               <div
                  key={apartment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
               >
                  <div className="flex justify-between items-start">
                     <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                           <h3 className="text-lg font-semibold text-gray-900">
                              {apartment.title || "Apartamento"}
                           </h3>
                           <span className="text-xl font-bold text-blue-600">
                              {apartment.price}€/mes
                           </span>
                           {apartment.zone && (
                              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                                 {apartment.zone}
                              </span>
                           )}
                        </div>

                        <p className="text-gray-600 mb-2">
                           📍 {apartment.address}
                        </p>

                        {apartment.notes && (
                           <div className="mb-2">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                 Notas:
                              </p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                 {apartment.notes}
                              </p>
                           </div>
                        )}

                        <p className="text-xs text-gray-500">
                           Agregado: {formatDate(apartment.createdAt)}
                        </p>
                     </div>

                     <div className="ml-4 flex gap-2">
                        <button
                           onClick={() => handleEdit(apartment)}
                           className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                           title="Editar apartamento"
                        >
                           <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                           </svg>
                           Editar
                        </button>

                        <button
                           onClick={() => handleDelete(apartment.id)}
                           disabled={deletingId === apartment.id}
                           className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                           title="Eliminar apartamento"
                        >
                           {deletingId === apartment.id ? (
                              <>
                                 <svg
                                    className="animate-spin h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                 >
                                    <circle
                                       className="opacity-25"
                                       cx="12"
                                       cy="12"
                                       r="10"
                                       stroke="currentColor"
                                       strokeWidth="4"
                                    ></circle>
                                    <path
                                       className="opacity-75"
                                       fill="currentColor"
                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                 </svg>
                                 Eliminando...
                              </>
                           ) : (
                              <>
                                 <svg
                                    className="w-4 h-4"
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
                                 Eliminar
                              </>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <EditApartmentModal
            apartment={editingApartment}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onApartmentUpdated={handleApartmentUpdated}
         />
      </div>
   );
}
