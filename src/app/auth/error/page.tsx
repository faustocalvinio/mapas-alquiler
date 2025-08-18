"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
   const searchParams = useSearchParams();
   const error = searchParams.get("error");

   const getErrorMessage = (error: string | null) => {
      switch (error) {
         case "AccessDenied":
            return "Acceso denegado. Tu email no está autorizado para acceder a esta aplicación.";
         case "Configuration":
            return "Error de configuración del servidor.";
         default:
            return "Ha ocurrido un error durante la autenticación.";
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Error de Autenticación
               </h2>
               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-center">
                     {getErrorMessage(error)}
                  </p>
               </div>
               <div className="mt-6 text-center">
                  <Link
                     href="/auth/signin"
                     className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                     Intentar nuevamente
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
