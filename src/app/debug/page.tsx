"use client";

import { useSession, signOut } from "next-auth/react";

export default function DebugAuth() {
   const { data: session, status } = useSession();

   return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
         <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Debug de Autenticación</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
               <h2 className="text-xl font-semibold mb-4">
                  Estado de la Sesión
               </h2>
               <p>
                  <strong>Status:</strong> {status}
               </p>
               <p>
                  <strong>Session exists:</strong> {session ? "Yes" : "No"}
               </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
               <h2 className="text-xl font-semibold mb-4">
                  Datos de la Sesión
               </h2>
               <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
               </pre>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
               <h2 className="text-xl font-semibold mb-4">
                  Variables de Entorno
               </h2>
               <p>
                  <strong>NEXTAUTH_URL:</strong>{" "}
                  {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set"}
               </p>
               <p>
                  <strong>Emails autorizados:</strong>{" "}
                  {process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS ||
                     "Not accessible from client"}
               </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
               <h2 className="text-xl font-semibold mb-4">Acciones</h2>
               {session && (
                  <button
                     onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-4"
                  >
                     Cerrar Sesión
                  </button>
               )}
               <a
                  href="/auth/signin"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
               >
                  Ir a Login
               </a>
            </div>
         </div>
      </div>
   );
}
