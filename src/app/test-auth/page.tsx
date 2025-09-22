"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function TestAuth() {
   const { data: session, status } = useSession();

   if (status === "loading") {
      return <div className="p-8">Cargando...</div>;
   }

   return (
      <div className="p-8 max-w-2xl mx-auto">
         <h1 className="text-2xl font-bold mb-6">Test de Autenticación</h1>

         {session ? (
            <div className="space-y-4">
               <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                     ✅ Sesión Activa
                  </h2>
                  <div className="space-y-2 text-sm">
                     <p>
                        <strong>Email:</strong> {session.user.email}
                     </p>
                     <p>
                        <strong>Nombre:</strong> {session.user.name}
                     </p>
                     <p>
                        <strong>ID:</strong> {session.user.id}
                     </p>
                     <p>
                        <strong>Tipo:</strong>{" "}
                        {session.user.userType || "No definido"}
                     </p>
                     <p>
                        <strong>Autorizado:</strong>{" "}
                        {session.user.isAuthorized ? "Sí" : "No"}
                     </p>
                  </div>
               </div>

               <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
               >
                  Cerrar Sesión
               </button>
            </div>
         ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
               <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Sin Sesión
               </h2>
               <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  No hay usuario autenticado actualmente.
               </p>
               <a
                  href="/auth/signin"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
               >
                  Iniciar Sesión
               </a>
            </div>
         )}

         <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Enlaces de Prueba</h2>
            <div className="space-y-2">
               <Link href="/" className="block text-blue-600 hover:underline">
                  ← Volver al Mapa
               </Link>
               <Link href="/admin" className="block text-blue-600 hover:underline">
                  Panel de Administración
               </Link>
               <Link
                  href="/auth/signin"
                  className="block text-blue-600 hover:underline"
               >
                  Página de Login
               </Link>
            </div>
         </div>

         <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Información del Sistema</h3>
            <div className="text-sm space-y-1">
               <p>
                  <strong>Status de Sesión:</strong> {status}
               </p>
               <p>
                  <strong>Timestamp:</strong> {new Date().toLocaleString()}
               </p>
            </div>
         </div>
      </div>
   );
}
