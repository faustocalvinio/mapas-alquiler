"use client";

import { useState } from "react";

interface FiltersProps {
   onFiltersChange: (filters: {
      minPrice?: number;
      maxPrice?: number;
      zone?: string;
   }) => void;
}

export default function Filters({ onFiltersChange }: FiltersProps) {
   const [filters, setFilters] = useState({
      minPrice: "",
      maxPrice: "",
      zone: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);

      // Aplicar filtros
      const filtersToApply: {
         minPrice?: number;
         maxPrice?: number;
         zone?: string;
      } = {};

      if (newFilters.minPrice)
         filtersToApply.minPrice = parseInt(newFilters.minPrice);
      if (newFilters.maxPrice)
         filtersToApply.maxPrice = parseInt(newFilters.maxPrice);
      if (newFilters.zone) filtersToApply.zone = newFilters.zone;

      onFiltersChange(filtersToApply);
   };

   const clearFilters = () => {
      setFilters({ minPrice: "", maxPrice: "", zone: "" });
      onFiltersChange({});
   };

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

            <div>
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
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Ej: Malasaña, Chueca, La Latina"
               />
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
