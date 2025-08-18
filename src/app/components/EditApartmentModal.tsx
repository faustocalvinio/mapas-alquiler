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
   createdAt: string;
}

interface EditApartmentModalProps {
   apartment: Apartment | null;
   isOpen: boolean;
   onClose: () => void;
   onApartmentUpdated: () => void;
}

export default function EditApartmentModal({
   apartment,
   isOpen,
   onClose,
   onApartmentUpdated,
}: EditApartmentModalProps) {
   const [formData, setFormData] = useState({
      title: "",
      address: "",
      price: "",
      zone: "",
      notes: "",
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
      if (!formData.address || formData.address === apartment?.address) {
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
   }, [formData.address, apartment?.address]);

   // Llenar el formulario cuando se abra el modal
   useEffect(() => {
      if (apartment && isOpen) {
         setFormData({
            title: apartment.title || "",
            address: apartment.address,
            price: apartment.price.toString(),
            zone: apartment.zone || "",
            notes: apartment.notes || "",
         });
         setErrors({});
         setAddressValidation({
            isValidating: false,
            isValid: null,
            message: "",
         });
      }
   }, [apartment, isOpen]);

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;
      if (!apartment) return;

      // Si la dirección cambió, verificar que sea válida
      if (
         formData.address !== apartment.address &&
         addressValidation.isValid === false
      ) {
         setErrors({
            address: "Por favor, ingresa una dirección válida",
         });
         return;
      }

      setIsSubmitting(true);

      try {
         const response = await fetch(`/api/apartments?id=${apartment.id}`, {
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
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
               errorData.error || "Error al actualizar el apartamento"
            );
         }

         onApartmentUpdated();
         onClose();
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

   if (!isOpen || !apartment) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                     Editar Apartamento
                  </h2>
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 text-2xl"
                     type="button"
                  >
                     ×
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título (opcional)
                     </label>
                     <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Apartamento céntrico"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                     </label>
                     <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           errors.address
                              ? "border-red-500"
                              : addressValidation.isValid === true
                              ? "border-green-500"
                              : addressValidation.isValid === false
                              ? "border-red-500"
                              : "border-gray-300"
                        }`}
                        placeholder="Calle Gran Vía, 1, Madrid"
                        required
                     />

                     {/* Indicadores de validación de dirección */}
                     {addressValidation.isValidating && (
                        <div className="flex items-center mt-1 text-sm text-blue-600">
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
                        <div className="flex items-center mt-1 text-sm text-green-600">
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
                        <div className="flex items-center mt-1 text-sm text-red-600">
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
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (€/mes) *
                     </label>
                     <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           errors.price ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="800"
                        min="1"
                        required
                     />
                     {errors.price && (
                        <p className="mt-1 text-sm text-red-600">
                           {errors.price}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zona (opcional)
                     </label>
                     <input
                        type="text"
                        name="zone"
                        value={formData.zone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Centro, Salamanca, Chamartín"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas (opcional)
                     </label>
                     <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Información adicional sobre el apartamento..."
                     />
                  </div>

                  {errors.submit && (
                     <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                     </div>
                  )}

                  <div className="flex gap-3 pt-4">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors duration-200"
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
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                              Actualizando...
                           </>
                        ) : (
                           "Actualizar Apartamento"
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
