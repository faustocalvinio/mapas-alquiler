"use client";

import { useState, useEffect, useRef } from "react";

interface AddApartmentFormProps {
   onApartmentAdded: () => void;
}

interface AddressValidation {
   isValidating: boolean;
   isValid: boolean | null;
   message: string;
   fullAddress?: string;
}

export default function AddApartmentForm({
   onApartmentAdded,
}: AddApartmentFormProps) {
   const [formData, setFormData] = useState({
      title: "",
      address: "",
      price: "",
      zone: "",
      notes: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const [addressValidation, setAddressValidation] =
      useState<AddressValidation>({
         isValidating: false,
         isValid: null,
         message: "",
      });
   const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   const validateAddress = async (address: string) => {
      if (!address.trim()) {
         setAddressValidation({
            isValidating: false,
            isValid: null,
            message: "",
         });
         return;
      }

      setAddressValidation({
         isValidating: true,
         isValid: null,
         message: "Validando dirección...",
      });

      try {
         const response = await fetch("/api/validate-address", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
         });

         const data = await response.json();

         if (data.valid) {
            setAddressValidation({
               isValidating: false,
               isValid: true,
               message: `✓ Dirección encontrada: ${data.fullAddress}`,
               fullAddress: data.fullAddress,
            });
         } else {
            setAddressValidation({
               isValidating: false,
               isValid: false,
               message: data.error || "Dirección no encontrada",
            });
         }
      } catch (err) {
         setAddressValidation({
            isValidating: false,
            isValid: false,
            message: "Error al validar la dirección",
         });
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         const response = await fetch("/api/apartments", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: formData.title || undefined,
               address: formData.address,
               price: parseInt(formData.price),
               zone: formData.zone || undefined,
               notes: formData.notes || undefined,
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear el apartamento");
         }

         // Limpiar formulario
         setFormData({
            title: "",
            address: "",
            price: "",
            zone: "",
            notes: "",
         });
         setAddressValidation({
            isValidating: false,
            isValid: null,
            message: "",
         });
         onApartmentAdded();
      } catch (err) {
         setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
         setIsLoading(false);
      }
   };

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));

      // Validación de dirección con timeout de 3 segundos
      if (name === "address") {
         // Limpiar timeout anterior
         if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
         }

         // Si el campo está vacío, limpiar validación
         if (!value.trim()) {
            setAddressValidation({
               isValidating: false,
               isValid: null,
               message: "",
            });
            return;
         }

         // Establecer nuevo timeout
         validationTimeoutRef.current = setTimeout(() => {
            validateAddress(value);
         }, 1200);
      }
   };

   // Limpiar timeout al desmontar el componente
   useEffect(() => {
      return () => {
         if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
         }
      };
   }, []);

   return (
      <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Añadir Nuevo Apartamento
         </h2>

         {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
               {error}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Título (opcional)
               </label>
               <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Piso luminoso en el centro"
               />
            </div>

            <div>
               <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Dirección *
               </label>
               <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                     addressValidation.isValid === false
                        ? "border-red-300"
                        : addressValidation.isValid === true
                        ? "border-green-300"
                        : "border-gray-300"
                  }`}
                  placeholder="Ej: Calle Gran Vía 1, Madrid"
               />

               {/* Indicador de validación */}
               {addressValidation.message && (
                  <div
                     className={`mt-1 text-sm flex items-center ${
                        addressValidation.isValidating
                           ? "text-blue-600"
                           : addressValidation.isValid
                           ? "text-green-600"
                           : "text-red-600"
                     }`}
                  >
                     {addressValidation.isValidating && (
                        <svg
                           className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                     )}
                     {addressValidation.message}
                  </div>
               )}
            </div>

            <div>
               <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Precio (€/mes) *
               </label>
               <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: 1200"
               />
            </div>

            <div>
               <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Zona (opcional)
               </label>
               <input
                  type="text"
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Centro, Malasaña, Chueca"
               />
            </div>

            <div>
               <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Notas (opcional)
               </label>
               <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-vertical"
                  placeholder="Ej: Apartamento en excelente estado, muy luminoso, cerca del metro..."
               />
               <p className="mt-1 text-xs text-gray-500">
                  Añade cualquier información adicional sobre el apartamento
               </p>
            </div>

            <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
               {isLoading ? "Añadiendo..." : "Añadir Apartamento"}
            </button>
         </form>
      </div>
   );
}
