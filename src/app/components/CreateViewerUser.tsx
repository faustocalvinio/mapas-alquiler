"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateViewerUser() {
   const { data: session } = useSession();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [name, setName] = useState("");
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");

      try {
         const response = await fetch("/api/auth/create-viewer", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email,
               password,
               name,
            }),
         });

         const data = await response.json();

         if (response.ok) {
            setMessage(
               `Usuario viewer creado exitosamente: ${data.user.email}`
            );
            setEmail("");
            setPassword("");
            setName("");
         } else {
            setError(data.error || "Error al crear usuario");
         }
      } catch (err) {
         setError("Error al conectar con el servidor");
      } finally {
         setLoading(false);
      }
   };

   // Solo mostrar a usuarios autorizados de Google
   if (!session?.user?.isAuthorized || session.user.userType !== "google") {
      return (
         <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
               Solo los administradores pueden acceder a esta función
            </p>
         </div>
      );
   }

   return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
         <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Crear Usuario Viewer
         </h2>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Nombre
               </label>
               <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del usuario"
               />
            </div>

            <div>
               <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Email *
               </label>
               <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@ejemplo.com"
               />
            </div>

            <div>
               <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
               >
                  Contraseña *
               </label>
               <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
               />
            </div>

            {error && (
               <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                     {error}
                  </p>
               </div>
            )}

            {message && (
               <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-green-600 dark:text-green-400 text-sm">
                     {message}
                  </p>
               </div>
            )}

            <button
               type="submit"
               disabled={loading}
               className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
               {loading ? "Creando..." : "Crear Usuario Viewer"}
            </button>
         </form>

         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
               Información importante:
            </h3>
            <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
               <li>
                  • Los usuarios viewer solo pueden ver el contenido, no
                  editarlo
               </li>
               <li>• Pueden iniciar sesión con email y contraseña</li>
               <li>• No tienen acceso a funciones de administración</li>
            </ul>
         </div>
      </div>
   );
}
