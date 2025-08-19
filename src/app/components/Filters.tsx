"use client";

import { useState, useEffect, useRef } from "react";

interface FiltersProps {
   onFiltersChange: (filters: {
      minPrice?: number;
      maxPrice?: number;
      zone?: string;
      status?: string;
   }) => void;
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

export default function Filters({ onFiltersChange }: FiltersProps) {
   const [filters, setFilters] = useState({
      minPrice: "",
      maxPrice: "",
      zone: "",
      status: "",
   });
   const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState<
      string[]
   >([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const neighborhoodInputRef = useRef<HTMLInputElement>(null);

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
      const newFilters = { ...filters, zone: neighborhood };
      setFilters(newFilters);
      setShowSuggestions(false);
      setNeighborhoodSuggestions([]);

      // Aplicar filtros
      const filtersToApply: {
         minPrice?: number;
         maxPrice?: number;
         zone?: string;
         status?: string;
      } = {};

      if (newFilters.minPrice)
         filtersToApply.minPrice = parseInt(newFilters.minPrice);
      if (newFilters.maxPrice)
         filtersToApply.maxPrice = parseInt(newFilters.maxPrice);
      if (newFilters.zone) filtersToApply.zone = newFilters.zone;
      if (newFilters.status) filtersToApply.status = newFilters.status;

      onFiltersChange(filtersToApply);
   };

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);

      // Filtrar barrios mientras se escribe (solo para el campo zone)
      if (name === "zone") {
         filterNeighborhoods(value);
      }

      // Aplicar filtros
      const filtersToApply: {
         minPrice?: number;
         maxPrice?: number;
         zone?: string;
         status?: string;
      } = {};

      if (newFilters.minPrice)
         filtersToApply.minPrice = parseInt(newFilters.minPrice);
      if (newFilters.maxPrice)
         filtersToApply.maxPrice = parseInt(newFilters.maxPrice);
      if (newFilters.zone) filtersToApply.zone = newFilters.zone;
      if (newFilters.status) filtersToApply.status = newFilters.status;

      onFiltersChange(filtersToApply);
   };

   const clearFilters = () => {
      setFilters({ minPrice: "", maxPrice: "", zone: "", status: "" });
      setNeighborhoodSuggestions([]);
      setShowSuggestions(false);
      onFiltersChange({});
   };

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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Filtros
         </h2>

         <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label
                     htmlFor="minPrice"
                     className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                     Precio mínimo (€)
                  </label>
                  <input
                     type="number"
                     id="minPrice"
                     name="minPrice"
                     value={filters.minPrice}
                     onChange={handleChange}
                     min="0"
                     className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                     placeholder="Ej: 500"
                  />
               </div>

               <div>
                  <label
                     htmlFor="maxPrice"
                     className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                     Precio máximo (€)
                  </label>
                  <input
                     type="number"
                     id="maxPrice"
                     name="maxPrice"
                     value={filters.maxPrice}
                     onChange={handleChange}
                     min="0"
                     className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                     placeholder="Ej: 2000"
                  />
               </div>
            </div>

            <div className="relative" ref={neighborhoodInputRef}>
               <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
               >
                  Barrio
               </label>
               <input
                  type="text"
                  id="zone"
                  name="zone"
                  value={filters.zone}
                  onChange={handleChange}
                  onFocus={() => {
                     if (filters.zone) {
                        filterNeighborhoods(filters.zone);
                     }
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
               >
                  Estado
               </label>
               <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
               >
                  <option value="">Todos los estados</option>
                  <option value="available">🟢 Solo disponibles</option>
                  <option value="rented">🔴 Solo alquilados</option>
               </select>
            </div>

            <button
               onClick={clearFilters}
               className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
               Limpiar Filtros
            </button>
         </div>
      </div>
   );
}
