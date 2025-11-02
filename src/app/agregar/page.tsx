"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
   Apartment,
   CABA_NEIGHBORHOODS,
   USD_TO_ARS_RATE,
} from "@/utils/apartments";

const MapViewInteractive = dynamic(
   () => import("../components/MapViewInteractive"),
   {
      ssr: false,
      loading: () => (
         <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
            Cargando mapa interactivo...
         </div>
      ),
   }
);

export default function AddApartmentPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [apartments, setApartments] = useState<Apartment[]>([]);
   const [selectedLocation, setSelectedLocation] = useState<{
      lat: number;
      lng: number;
   } | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
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

   useEffect(() => {
      if (status === "unauthenticated") {
         router.push("/");
      }
   }, [status, router]);

   useEffect(() => {
      fetchApartments();
   }, []);

   const fetchApartments = async () => {
      try {
         const response = await fetch("/api/apartments");
         const data = await response.json();
         setApartments(data);
      } catch (error) {
         console.error("Error fetching apartments:", error);
      }
   };

   const handleMapClick = (lat: number, lng: number) => {
      setSelectedLocation({ lat, lng });
      // Hacer geocoding inverso para obtener la dirección
      reverseGeocode(lat, lng);
   };

   const reverseGeocode = async (lat: number, lng: number) => {
      try {
         const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            {
               headers: {
                  "User-Agent": "MapasAlquilerCABA/1.0",
               },
            }
         );
         const data = await response.json();

         if (data.address) {
            const road = data.address.road || "";
            const houseNumber = data.address.house_number || "";
            const address = houseNumber ? `${road} ${houseNumber}` : road;

            setFormData((prev) => ({
               ...prev,
               address: address || data.display_name,
               zone: data.address.suburb || data.address.neighbourhood || "",
            }));
         }
      } catch (error) {
         console.error("Error en geocoding inverso:", error);
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

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedLocation) {
         alert(
            "Por favor, haz clic en el mapa para seleccionar la ubicación del apartamento"
         );
         return;
      }

      if (!formData.address || !formData.price) {
         alert("Por favor completa el domicilio y el precio");
         return;
      }

      setIsSubmitting(true);

      try {
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
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
         };

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

         alert("✅ Apartamento agregado exitosamente");

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
         setSelectedLocation(null);

         // Refresh apartments
         fetchApartments();
      } catch (error) {
         console.error("Error adding apartment:", error);
         alert(
            "❌ Error al agregar el apartamento. Por favor intenta de nuevo."
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   if (status === "loading") {
      return (
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
         </div>
      );
   }

   if (!session) {
      return null;
   }

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         {/* Header */}
         <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ➕ Agregar Apartamento
                     </h1>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Haz clic en el mapa para seleccionar la ubicación
                     </p>
                  </div>
                  <button
                     onClick={() => router.push("/")}
                     className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                     ← Volver al inicio
                  </button>
               </div>
            </div>
         </header>

         <main className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Mapa Interactivo */}
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <div className="mb-4">
                     <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        🗺️ Mapa Interactivo
                     </h2>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        Haz clic en el mapa para marcar la ubicación del
                        apartamento
                     </p>
                     {selectedLocation && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-400">
                           ✓ Ubicación seleccionada:{" "}
                           {selectedLocation.lat.toFixed(6)},{" "}
                           {selectedLocation.lng.toFixed(6)}
                        </div>
                     )}
                  </div>
                  <div className="h-[600px] rounded-lg overflow-hidden">
                     <MapViewInteractive
                        apartments={apartments}
                        onMapClick={handleMapClick}
                        selectedLocation={selectedLocation}
                     />
                  </div>
               </div>

               {/* Formulario */}
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                     📝 Datos del Apartamento
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                           Dirección * (se completa al hacer clic en el mapa)
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
                                 <option
                                    key={neighborhood}
                                    value={neighborhood}
                                 >
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
                              Sub-zona
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
                              Precio *
                           </label>
                           <input
                              type="number"
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="500"
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
                              <option value="USD">USD</option>
                              <option value="ARS">ARS</option>
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
                                       {parseFloat(
                                          formData.price
                                       ).toLocaleString("es-AR")}
                                    </strong>{" "}
                                    ≈ ARS{" "}
                                    {(
                                       parseFloat(formData.price) *
                                       USD_TO_ARS_RATE
                                    ).toLocaleString("es-AR")}
                                 </>
                              ) : (
                                 <>
                                    <strong>
                                       ARS{" "}
                                       {parseFloat(
                                          formData.price
                                       ).toLocaleString("es-AR")}
                                    </strong>{" "}
                                    ≈ USD{" "}
                                    {(
                                       parseFloat(formData.price) /
                                       USD_TO_ARS_RATE
                                    ).toLocaleString("es-AR", {
                                       maximumFractionDigits: 0,
                                    })}
                                 </>
                              )}
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
                              placeholder="2"
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
                              placeholder="1"
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
                              placeholder="45"
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
                           placeholder="50000"
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
                           placeholder="Información adicional..."
                           rows={3}
                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                     </div>

                     <div>
                        <label
                           htmlFor="link"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                           Link de publicación
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

                     <button
                        type="submit"
                        disabled={isSubmitting || !selectedLocation}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                     >
                        {isSubmitting
                           ? "Agregando..."
                           : "✅ Agregar Apartamento"}
                     </button>
                  </form>
               </div>
            </div>
         </main>
      </div>
   );
}
