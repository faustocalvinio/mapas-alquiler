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

// Lista de barrios de Madrid
const MADRID_NEIGHBORHOODS = [
   "Malasaña",
   "Chueca",
   "La Latina",
   "Lavapiés",
   "Sol",
   "Huertas",
   "Salamanca",
   "Chamberí",
   "Conde Duque",
   "Justicia",
   "Universidad",
   "Embajadores",
   "Cortes",
   "Palacio",
   "Recoletos",
   "Goya",
   "Lista",
   "Castellana",
   "Almagro",
   "Trafalgar",
   "Arapiles",
   "Gaztambide",
   "Vallehermoso",
   "Ríos Rosas",
   "Cuatro Caminos",
   "Castillejos",
   "Almenara",
   "Valdeacederas",
   "Berruguete",
   "Bellas Vistas",
   "Tetuán",
   "Estrella",
   "Ibiza",
   "Jerónimos",
   "Cortes",
   "Pacifico",
   "Adelfas",
   "Estrella",
   "Niño Jesús",
   "Concepción",
   "Legazpi",
   "Delicias",
   "Palos de Moguer",
   "Atocha",
   "Arganzuela",
   "Imperial",
   "Las Acacias",
   "La Chopera",
   "Acacias",
   "Moscardó",
   "Usera",
   "Orcasitas",
   "Orcasur",
   "San Fermín",
   "Almendrales",
   "Pradolongo",
   "Carabanchel",
   "Comillas",
   "Opañel",
   "San Isidro",
   "Vista Alegre",
   "Puerta Bonita",
   "Buenavista",
   "Abrantes",
   "Latina",
   "Los Cármenes",
   "Puerta del Ángel",
   "Lucero",
   "Aluche",
   "Campamento",
   "Cuatro Vientos",
   "Las Águilas",
   "Moncloa",
   "Argüelles",
   "Ciudad Universitaria",
   "Valdezarza",
   "Valdemarín",
   "El Plantío",
   "Casa de Campo",
   "Chamartín",
   "El Viso",
   "Prosperidad",
   "Ciudad Jardín",
   "Hispanoamérica",
   "Nueva España",
   "Castilla",
   "Hortaleza",
   "Palomas",
   "Valdefuentes",
   "Canillas",
   "Pinar del Rey",
   "Apóstol Santiago",
   "Valdelatas",
   "Sanchinarro",
   "El Goloso",
   "Fuencarral",
   "El Pardo",
   "Fuentelarreina",
   "Peñagrande",
   "Barrio del Pilar",
   "La Paz",
   "Valverde",
   "Mirasierra",
   "El Goloso",
   "Ciudad Lineal",
   "Ventas",
   "Pueblo Nuevo",
   "Quintana",
   "La Concepción",
   "San Pascual",
   "San Juan Bautista",
   "Colina",
   "Atalaya",
   "Costillares",
   "Moratalaz",
   "Pavones",
   "Horcajo",
   "Marroquina",
   "Media Legua",
   "Fontarrón",
   "Vinateros",
   "Vicálvaro",
   "Ambroz",
   "Casco Histórico de Vicálvaro",
   "Villa de Vallecas",
   "Casco Histórico de Vallecas",
   "Santa Eugenia",
   "Ensanche de Vallecas",
   "Puente de Vallecas",
   "Entrevías",
   "San Diego",
   "Palomeras Bajas",
   "Palomeras Sureste",
   "Portazgo",
   "Numancia",
   "Barajas",
   "Alameda de Osuna",
   "Aeropuerto",
   "Casco Histórico de Barajas",
   "Timón",
   "Corralejos",
   "San Blas",
   "Simancas",
   "Hellín",
   "Amposta",
   "Arcos",
   "Rosas",
   "Rejas",
   "Canillejas",
   "Salvador",
].sort();

export default function AddApartmentForm({
   onApartmentAdded,
}: AddApartmentFormProps) {
   const [formData, setFormData] = useState({
      title: "",
      address: "",
      price: "",
      neighborhood: "",
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
   const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState<
      string[]
   >([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const neighborhoodInputRef = useRef<HTMLInputElement>(null);

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

   const filterNeighborhoods = (query: string) => {
      if (!query.trim()) {
         setNeighborhoodSuggestions([]);
         setShowSuggestions(false);
         return;
      }

      const filtered = MADRID_NEIGHBORHOODS.filter((neighborhood) =>
         neighborhood.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Mostrar máximo 8 sugerencias

      setNeighborhoodSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
   };

   const selectNeighborhood = (neighborhood: string) => {
      setFormData((prev) => ({ ...prev, neighborhood }));
      setShowSuggestions(false);
      setNeighborhoodSuggestions([]);
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
               zone: formData.neighborhood || undefined,
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
            neighborhood: "",
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

      // Filtrar barrios mientras se escribe
      if (name === "neighborhood") {
         filterNeighborhoods(value);
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

   // Cerrar sugerencias al hacer clic fuera
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            neighborhoodInputRef.current &&
            !neighborhoodInputRef.current.contains(event.target as Node)
         ) {
            setShowSuggestions(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
         <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Añadir Nuevo Apartamento
         </h2>

         {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4">
               {error}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
               >
                  Título (opcional)
               </label>
               <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Ej: Piso luminoso en el centro"
               />
            </div>

            <div>
               <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
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
                  className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                     addressValidation.isValid === false
                        ? "border-red-400 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400"
                        : addressValidation.isValid === true
                        ? "border-green-400 dark:border-green-500 focus:ring-green-500 dark:focus:ring-green-400"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                  placeholder="Ej: Calle Gran Vía 1, Madrid"
               />

               {/* Indicador de validación */}
               {addressValidation.message && (
                  <div
                     className={`mt-1 text-sm flex items-center ${
                        addressValidation.isValidating
                           ? "text-blue-700 dark:text-blue-300"
                           : addressValidation.isValid
                           ? "text-green-700 dark:text-green-300"
                           : "text-red-700 dark:text-red-300"
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
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
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
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Ej: 1200"
               />
            </div>

            <div className="relative" ref={neighborhoodInputRef}>
               <label
                  htmlFor="neighborhood"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
               >
                  Barrio (opcional)
               </label>
               <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  onFocus={() => {
                     if (formData.neighborhood) {
                        filterNeighborhoods(formData.neighborhood);
                     }
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Escribe para buscar barrios de Madrid..."
                  autoComplete="off"
               />

               {/* Sugerencias de barrios */}
               {showSuggestions && neighborhoodSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                     {neighborhoodSuggestions.map((neighborhood, index) => (
                        <button
                           key={index}
                           type="button"
                           onClick={() => selectNeighborhood(neighborhood)}
                           className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                        >
                           {neighborhood}
                        </button>
                     ))}
                  </div>
               )}
            </div>

            <div>
               <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
               >
                  Notas (opcional)
               </label>
               <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-vertical"
                  placeholder="Ej: Apartamento en excelente estado, muy luminoso, cerca del metro..."
               />
               <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Añade cualquier información adicional sobre el apartamento
               </p>
            </div>

            <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
               {isLoading ? "Añadiendo..." : "Añadir Apartamento"}
            </button>
         </form>
      </div>
   );
}
