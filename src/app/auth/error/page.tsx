"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function AuthErrorContent() {
   const searchParams = useSearchParams();
   const error = searchParams.get("error");

   const getErrorMessage = (error: string | null) => {
      switch (error) {
         case "AccessDenied":
            return "Acceso denegado. Tu email no está autorizado para acceder a esta aplicación.";
         case "OAuthAccountNotLinked":
            return "Error al vincular la cuenta. Inténtalo de nuevo.";
         case "Configuration":
            return "Error de configuración del servidor.";
         default:
            return "Ha ocurrido un error durante la autenticación.";
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
         <div className="max-w-md w-full space-y-8">
            <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  Error de Autenticación
               </h2>
               <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 rounded-md">
                  <p className="text-red-800 dark:text-red-200 text-center">
                     {getErrorMessage(error)}
                  </p>
                  {error && (
                     <p className="text-red-600 dark:text-red-400 text-sm text-center mt-2">
                        Código de error: {error}
                     </p>
                  )}
               </div>
               <div className="mt-6 text-center">
                  <Link
                     href="/auth/signin"
                     className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                     Intentar nuevamente
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}

export default function AuthError() {
   return (
      <Suspense
         fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
         }
      >
         <AuthErrorContent />
      </Suspense>
   );
}
