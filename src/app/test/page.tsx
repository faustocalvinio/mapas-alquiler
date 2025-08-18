"use client";

import { useSession } from "next-auth/react";
import AuthButton from "../components/AuthButton";

export default function HomePage() {
   const { data: session, status } = useSession();

   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
               <div className="flex justify-between items-center mb-4">
                  <div></div>
                  <AuthButton />
               </div>
               <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Mapa de Apartamentos en Madrid
               </h1>
               <p className="text-gray-600">Debug de autenticación</p>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
               <h2 className="text-xl font-semibold mb-4">
                  Estado de Autenticación
               </h2>
               <div className="space-y-2">
                  <p>
                     <strong>Status:</strong> {status}
                  </p>
                  <p>
                     <strong>Tiene sesión:</strong> {session ? "Sí" : "No"}
                  </p>
                  {session && (
                     <>
                        <p>
                           <strong>Email:</strong> {session.user?.email}
                        </p>
                        <p>
                           <strong>Nombre:</strong> {session.user?.name}
                        </p>
                        <p>
                           <strong>ID:</strong> {session.user?.id}
                        </p>
                        <p>
                           <strong>Autorizado:</strong>{" "}
                           {session.user?.isAuthorized ? "Sí" : "No"}
                        </p>
                     </>
                  )}
               </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold mb-4">
                  Session Data (JSON)
               </h2>
               <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
               </pre>
            </div>

            {!session && (
               <div className="text-center mt-8">
                  <a
                     href="/auth/signin"
                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                  >
                     Iniciar Sesión
                  </a>
               </div>
            )}
         </div>
      </div>
   );
}
