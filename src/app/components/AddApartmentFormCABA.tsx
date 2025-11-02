"use client";

import { useState } from "react";
import { CABA_NEIGHBORHOODS, USD_TO_ARS_RATE } from "@/utils/apartments";

interface AddApartmentFormProps {
   onAdd: (apartment: any) => void;
   onCancel?: () => void;
}

export default function AddApartmentForm({
   onAdd,
   onCancel,
}: AddApartmentFormProps) {
   const [formData, setFormData] = useState({
      title: "",
      address: "",
      price: "",
      currency: "USD",
      zone: "",
      neighborhood: "",
      rooms: "",
      bathrooms: "",
      squareMeters: "",
      expenses: "",
      notes: "",
      link: "",
      status: "available",
      iconColor: "#3B82F6",
   });

   const [isValidatingAddress, setIsValidatingAddress] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.address || !formData.price) {
         alert("Por favor completa el domicilio y el precio");
         return;
      }

      setIsValidatingAddress(true);

      try {
         // Validar la dirección con la API de geocoding
         const response = await fetch("/api/validate-address", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               address: formData.address + ", CABA, Argentina",
            }),
         });

         const data = await response.json();

         if (!data.valid) {
            alert(
               "No se pudo validar la dirección. Por favor verifica que sea correcta."
            );
            setIsValidatingAddress(false);
            return;
         }

         // Calcular el precio en ambas monedas
         const priceValue = parseFloat(formData.price);
         const apartmentData = {
            ...formData,
            priceUSD:
               formData.currency === "USD"
                  ? priceValue
                  : priceValue / USD_TO_ARS_RATE,
            priceARS:
               formData.currency === "ARS"
                  ? priceValue
                  : priceValue * USD_TO_ARS_RATE,
            rooms: formData.rooms ? parseInt(formData.rooms) : null,
            bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
            squareMeters: formData.squareMeters
               ? parseFloat(formData.squareMeters)
               : null,
            expenses: formData.expenses ? parseFloat(formData.expenses) : null,
            lat: data.lat,
            lng: data.lng,
         };

         await onAdd(apartmentData);

         // Reset form
         setFormData({
            title: "",
            address: "",
            price: "",
            currency: "USD",
            zone: "",
            neighborhood: "",
            rooms: "",
            bathrooms: "",
            squareMeters: "",
            expenses: "",
            notes: "",
            link: "",
            status: "available",
            iconColor: "#3B82F6",
         });
      } catch (error) {
         console.error("Error al agregar apartamento:", error);
         alert("Error al agregar el apartamento. Por favor intenta de nuevo.");
      } finally {
         setIsValidatingAddress(false);
      }
   };

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4"
      >
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Agregar Apartamento en CABA
         </h2>

         <div>
            <label
               htmlFor="title"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
               Título (opcional)
            </label>
            <input
               type="text"
               id="title"
               name="title"
               value={formData.title}
               onChange={handleChange}
               placeholder="Ej: Departamento luminoso en Palermo"
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
         </div>

         <div>
            <label
               htmlFor="address"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
               Dirección * (calle y altura en CABA)
            </label>
            <input
               type="text"
               id="address"
               name="address"
               value={formData.address}
               onChange={handleChange}
               placeholder="Ej: Av. Santa Fe 1234"
               required
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
               <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Barrio
               </label>
               <select
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               >
                  <option value="">Seleccionar...</option>
                  {CABA_NEIGHBORHOODS.map((neighborhood) => (
                     <option key={neighborhood} value={neighborhood}>
                        {neighborhood}
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label
                  htmlFor="neighborhood"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Sub-zona (opcional)
               </label>
               <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="Ej: Palermo Soho"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
               <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Precio de Alquiler *
               </label>
               <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ej: 500"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               />
            </div>

            <div>
               <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Moneda *
               </label>
               <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               >
                  <option value="USD">USD (Dólares)</option>
                  <option value="ARS">ARS (Pesos)</option>
               </select>
            </div>
         </div>

         {formData.price && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
               <p className="text-blue-800 dark:text-blue-300">
                  {formData.currency === "USD" ? (
                     <>
                        <strong>
                           USD{" "}
                           {parseFloat(formData.price).toLocaleString("es-AR")}
                        </strong>{" "}
                        ≈ ARS{" "}
                        {(
                           parseFloat(formData.price) * USD_TO_ARS_RATE
                        ).toLocaleString("es-AR")}
                     </>
                  ) : (
                     <>
                        <strong>
                           ARS{" "}
                           {parseFloat(formData.price).toLocaleString("es-AR")}
                        </strong>{" "}
                        ≈ USD{" "}
                        {(
                           parseFloat(formData.price) / USD_TO_ARS_RATE
                        ).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                     </>
                  )}
               </p>
               <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Tipo de cambio: 1 USD = {USD_TO_ARS_RATE} ARS
               </p>
            </div>
         )}

         <div className="grid grid-cols-3 gap-4">
            <div>
               <label
                  htmlFor="rooms"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Ambientes
               </label>
               <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Ej: 2"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               />
            </div>

            <div>
               <label
                  htmlFor="bathrooms"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Baños
               </label>
               <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Ej: 1"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               />
            </div>

            <div>
               <label
                  htmlFor="squareMeters"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Metros²
               </label>
               <input
                  type="number"
                  id="squareMeters"
                  name="squareMeters"
                  value={formData.squareMeters}
                  onChange={handleChange}
                  placeholder="Ej: 45"
                  min="1"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               />
            </div>
         </div>

         <div>
            <label
               htmlFor="expenses"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
               Expensas (en ARS)
            </label>
            <input
               type="number"
               id="expenses"
               name="expenses"
               value={formData.expenses}
               onChange={handleChange}
               placeholder="Ej: 50000"
               min="0"
               step="100"
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
         </div>

         <div>
            <label
               htmlFor="notes"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
               Notas adicionales
            </label>
            <textarea
               id="notes"
               name="notes"
               value={formData.notes}
               onChange={handleChange}
               placeholder="Información adicional sobre el apartamento..."
               rows={3}
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
         </div>

         <div>
            <label
               htmlFor="link"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
               Link (ZonaProp, MercadoLibre, etc.)
            </label>
            <input
               type="url"
               id="link"
               name="link"
               value={formData.link}
               onChange={handleChange}
               placeholder="https://..."
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
               <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Estado
               </label>
               <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
               >
                  <option value="available">Disponible</option>
                  <option value="reserved">Reservado</option>
                  <option value="rented">Alquilado</option>
               </select>
            </div>

            <div>
               <label
                  htmlFor="iconColor"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Color del marcador
               </label>
               <input
                  type="color"
                  id="iconColor"
                  name="iconColor"
                  value={formData.iconColor}
                  onChange={handleChange}
                  className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
               />
            </div>
         </div>

         <div className="flex gap-3 pt-4">
            <button
               type="submit"
               disabled={isValidatingAddress}
               className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
               {isValidatingAddress ? "Validando..." : "Agregar Apartamento"}
            </button>
            {onCancel && (
               <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
               >
                  Cancelar
               </button>
            )}
         </div>
      </form>
   );
}
