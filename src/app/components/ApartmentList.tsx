"use client";

import { useState, useEffect } from "react";

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

interface ApartmentListProps {
   apartments: Apartment[];
   onApartmentDeleted: () => void;
   onApartmentUpdated: () => void;
}

export default function ApartmentList({
   apartments,
   onApartmentDeleted,
   onApartmentUpdated,
}: ApartmentListProps) {
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [formData, setFormData] = useState({
      title: "",
      address: "",
      price: "",
      zone: "",
      notes: "",
      status: "",
      iconColor: "",
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [addressValidation, setAddressValidation] = useState<{
      isValidating: boolean;
      isValid: boolean | null;
      message: string;
   }>({
      isValidating: false,
      isValid: null,
      message: "",
   });

   // Debounce para validación de dirección
   useEffect(() => {
      if (!formData.address || !editingId) {
         setAddressValidation({
            isValidating: false,
            isValid: null,
            message: "",
         });
         return;
      }

      const editingApartment = apartments.find((apt) => apt.id === editingId);
      if (formData.address === editingApartment?.address) {
         setAddressValidation({
            isValidating: false,
            isValid: null,
            message: "",
         });
         return;
      }

      const timeoutId = setTimeout(async () => {
         setAddressValidation({
            isValidating: true,
            isValid: null,
            message: "",
         });

         try {
            const response = await fetch(
               `/api/validate-address?address=${encodeURIComponent(
                  formData.address
               )}`
            );
            const data = await response.json();

            setAddressValidation({
               isValidating: false,
               isValid: data.isValid,
               message: data.message,
            });
         } catch (error) {
            setAddressValidation({
               isValidating: false,
               isValid: false,
               message: "Error al validar la dirección",
            });
         }
      }, 3000);

      return () => clearTimeout(timeoutId);
   }, [formData.address, editingId, apartments]);

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
      setEditingId(apartment.id);
      setFormData({
         title: apartment.title || "",
         address: apartment.address,
         price: apartment.price.toString(),
         zone: apartment.zone || "",
         notes: apartment.notes || "",
         status: apartment.status || "available",
         iconColor: apartment.iconColor || "#3B82F6",
      });
      setErrors({});
      setAddressValidation({
         isValidating: false,
         isValid: null,
         message: "",
      });
   };

   const handleCancelEdit = () => {
      setEditingId(null);
      setFormData({
         title: "",
         address: "",
         price: "",
         zone: "",
         notes: "",
         status: "",
         iconColor: "",
      });
      setErrors({});
      setAddressValidation({
         isValidating: false,
         isValid: null,
         message: "",
      });
   };

   const handleInputChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Limpiar error específico cuando el usuario empiece a escribir
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: "" }));
      }
   };

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.address.trim()) {
         newErrors.address = "La dirección es requerida";
      }

      if (!formData.price.trim()) {
         newErrors.price = "El precio es requerido";
      } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
         newErrors.price = "El precio debe ser un número mayor a 0";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmitEdit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;
      if (!editingId) return;

      const editingApartment = apartments.find((apt) => apt.id === editingId);
      if (!editingApartment) return;

      // Si la dirección cambió, verificar que sea válida
      if (
         formData.address !== editingApartment.address &&
         addressValidation.isValid === false
      ) {
         setErrors({
            address: "Por favor, ingresa una dirección válida",
         });
         return;
      }

      setIsSubmitting(true);

      try {
         const response = await fetch(`/api/apartments?id=${editingId}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: formData.title.trim() || null,
               address: formData.address.trim(),
               price: parseInt(formData.price),
               zone: formData.zone.trim() || null,
               notes: formData.notes.trim() || null,
               status: formData.status || "available",
               iconColor: formData.iconColor || "#3B82F6",
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
               errorData.error || "Error al actualizar el apartamento"
            );
         }

         onApartmentUpdated();
         handleCancelEdit();
      } catch (error) {
         console.error("Error:", error);
         setErrors({
            submit:
               error instanceof Error ? error.message : "Error desconocido",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleApartmentUpdated = () => {
      onApartmentUpdated(); // Usamos la función específica para actualizar
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
         <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
               Lista de Apartamentos
            </h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
               No hay apartamentos registrados
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Lista de Apartamentos ({apartments.length})
         </h2>

         <div className="space-y-4">
            {apartments.map((apartment) => (
               <div key={apartment.id}>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
                                 {apartment.title || "Apartamento"}
                              </h3>
                              <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                 {apartment.price}€/mes
                              </span>
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    apartment.status === "rented"
                                       ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                       : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                 }`}
                              >
                                 {apartment.status === "rented"
                                    ? "🔴 Alquilado"
                                    : "🟢 Disponible"}
                              </span>
                              <div className="flex items-center gap-1">
                                 <div
                                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                    style={{
                                       backgroundColor: apartment.iconColor,
                                    }}
                                    title={`Color: ${apartment.iconColor}`}
                                 ></div>
                                 <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                                    {apartment.iconColor}
                                 </span>
                              </div>
                              {apartment.zone && (
                                 <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm px-2 py-1 rounded-full whitespace-nowrap">
                                    {apartment.zone}
                                 </span>
                              )}
                           </div>

                           <p className="text-gray-600 dark:text-gray-300 mb-2 break-words">
                              📍 {apartment.address}
                           </p>

                           {apartment.notes && (
                              <div className="mb-2">
                                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Notas:
                                 </p>
                                 <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                    {apartment.notes}
                                 </p>
                              </div>
                           )}

                           <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                              <p>Agregado: {formatDate(apartment.createdAt)}</p>
                              {apartment.createdBy && (
                                 <p>
                                    Por:{" "}
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                       {apartment.createdBy}
                                    </span>
                                 </p>
                              )}
                           </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-row lg:flex-col gap-2 lg:ml-4 lg:flex-shrink-0">
                           <button
                              onClick={() => handleEdit(apartment)}
                              disabled={editingId === apartment.id}
                              className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-300 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                              title="Editar apartamento"
                           >
                              <svg
                                 className="w-4 h-4 flex-shrink-0"
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
                              <span className="hidden sm:inline">
                                 {editingId === apartment.id
                                    ? "Editando..."
                                    : "Editar"}
                              </span>
                           </button>

                           <button
                              onClick={() => handleDelete(apartment.id)}
                              disabled={
                                 deletingId === apartment.id ||
                                 editingId === apartment.id
                              }
                              className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-300 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                              title="Eliminar apartamento"
                           >
                              {deletingId === apartment.id ? (
                                 <>
                                    <svg
                                       className="animate-spin h-4 w-4 flex-shrink-0"
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
                                    <span className="hidden sm:inline">
                                       Eliminando...
                                    </span>
                                 </>
                              ) : (
                                 <>
                                    <svg
                                       className="w-4 h-4 flex-shrink-0"
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
                                    <span className="hidden sm:inline">
                                       Eliminar
                                    </span>
                                 </>
                              )}
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Formulario de edición inline */}
                  {editingId === apartment.id && (
                     <div className="mt-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                           Editando apartamento
                        </h4>

                        <form onSubmit={handleSubmitEdit} className="space-y-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Título (opcional)
                              </label>
                              <input
                                 type="text"
                                 name="title"
                                 value={formData.title}
                                 onChange={handleInputChange}
                                 className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                                 placeholder="Ej: Apartamento céntrico"
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Dirección *
                              </label>
                              <input
                                 type="text"
                                 name="address"
                                 value={formData.address}
                                 onChange={handleInputChange}
                                 className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 ${
                                    errors.address
                                       ? "border-red-500"
                                       : addressValidation.isValid === true
                                       ? "border-green-500"
                                       : addressValidation.isValid === false
                                       ? "border-red-500"
                                       : "border-gray-300 dark:border-gray-600"
                                 }`}
                                 placeholder="Calle Gran Vía, 1, Madrid"
                                 required
                              />

                              {/* Indicadores de validación de dirección */}
                              {addressValidation.isValidating && (
                                 <div className="flex items-center mt-1 text-sm text-blue-600 dark:text-blue-400">
                                    <svg
                                       className="animate-spin h-4 w-4 mr-1"
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
                                    Validando dirección...
                                 </div>
                              )}

                              {addressValidation.isValid === true && (
                                 <div className="flex items-center mt-1 text-sm text-green-600 dark:text-green-400">
                                    <svg
                                       className="h-4 w-4 mr-1"
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
                                    Dirección válida
                                 </div>
                              )}

                              {addressValidation.isValid === false && (
                                 <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                                    <svg
                                       className="h-4 w-4 mr-1"
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
                                    {addressValidation.message}
                                 </div>
                              )}

                              {errors.address && (
                                 <p className="mt-1 text-sm text-red-600">
                                    {errors.address}
                                 </p>
                              )}
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Precio (€/mes) *
                              </label>
                              <input
                                 type="number"
                                 name="price"
                                 value={formData.price}
                                 onChange={handleInputChange}
                                 className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 ${
                                    errors.price
                                       ? "border-red-500"
                                       : "border-gray-300 dark:border-gray-600"
                                 }`}
                                 placeholder="800"
                                 min="1"
                                 required
                              />
                              {errors.price && (
                                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.price}
                                 </p>
                              )}
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Barrio (opcional)
                              </label>
                              <input
                                 type="text"
                                 name="zone"
                                 value={formData.zone}
                                 onChange={handleInputChange}
                                 className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                                 placeholder="Ej: Malasaña, Salamanca, Chamartín"
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Notas (opcional)
                              </label>
                              <textarea
                                 name="notes"
                                 value={formData.notes}
                                 onChange={handleInputChange}
                                 rows={3}
                                 className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 resize-none"
                                 placeholder="Información adicional sobre el apartamento..."
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Estado
                                 </label>
                                 <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                                 >
                                    <option value="available">
                                       🟢 Disponible
                                    </option>
                                    <option value="rented">🔴 Alquilado</option>
                                 </select>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Color del icono
                                 </label>
                                 <div className="flex items-center space-x-2">
                                    <input
                                       type="color"
                                       name="iconColor"
                                       value={formData.iconColor}
                                       onChange={handleInputChange}
                                       className="w-12 h-9 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                                       title="Seleccionar color del icono"
                                    />
                                    <input
                                       type="text"
                                       name="iconColor"
                                       value={formData.iconColor}
                                       onChange={handleInputChange}
                                       className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 text-sm"
                                       placeholder="#3B82F6"
                                       pattern="^#[0-9A-Fa-f]{6}$"
                                    />
                                 </div>
                                 <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                    Color que aparecerá en el mapa
                                 </p>
                              </div>
                           </div>

                           {errors.submit && (
                              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 rounded-md">
                                 <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.submit}
                                 </p>
                              </div>
                           )}

                           <div className="flex flex-col sm:flex-row gap-3 pt-4">
                              <button
                                 type="button"
                                 onClick={handleCancelEdit}
                                 className="order-2 sm:order-1 flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md font-medium transition-colors duration-200"
                              >
                                 Cancelar
                              </button>
                              <button
                                 type="submit"
                                 disabled={
                                    isSubmitting ||
                                    addressValidation.isValidating ||
                                    (formData.address !== apartment.address &&
                                       addressValidation.isValid === false)
                                 }
                                 className="order-1 sm:order-2 flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-300 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                 {isSubmitting ? (
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
                                       <span className="hidden sm:inline">
                                          Actualizando...
                                       </span>
                                       <span className="sm:hidden">...</span>
                                    </>
                                 ) : (
                                    <>
                                       <span className="hidden sm:inline">
                                          Actualizar Apartamento
                                       </span>
                                       <span className="sm:hidden">
                                          Actualizar
                                       </span>
                                    </>
                                 )}
                              </button>
                           </div>
                        </form>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
}
