"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateViewerUser from "../components/CreateViewerUser";

export default function AdminPage() {
   const { data: session, status } = useSession();
   const router = useRouter();

   useEffect(() => {
      if (status === "loading") return; // Todavía cargando

      if (!session) {
         router.push("/auth/signin");
         return;
      }

      if (!session.user?.isAuthorized || session.user.userType !== "google") {
         router.push("/");
         return;
      }
   }, [session, status, router]);

   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
         </div>
      );
   }

   if (
      !session ||
      !session.user?.isAuthorized ||
      session.user.userType !== "google"
   ) {
      return null; // El useEffect se encargará del redirect
   }

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Panel de Administración
               </h1>
               <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Gestiona usuarios y configuraciones del sistema
               </p>
            </div>

            <div className="grid gap-8">
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                     Gestión de Usuarios
                  </h2>

                  <CreateViewerUser />
               </div>

               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                     Información del Sistema
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 dark:text-blue-200">
                           Tu Sesión
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                           {session.user.email}
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400">
                           Tipo: {session.user.userType} | Autorizado:{" "}
                           {session.user.isAuthorized ? "Sí" : "No"}
                        </p>
                     </div>

                     <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800 dark:text-green-200">
                           Acciones Disponibles
                        </h3>
                        <ul className="text-sm text-green-600 dark:text-green-300 mt-1 space-y-1">
                           <li>• Crear usuarios viewer</li>
                           <li>• Gestionar apartamentos</li>
                           <li>• Administrar ubicaciones</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-8 text-center">
               <button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
               >
                  Volver al Mapa
               </button>
            </div>
         </div>
      </div>
   );
}
