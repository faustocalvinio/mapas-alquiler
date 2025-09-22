"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
   const [providers, setProviders] = useState<any>(null);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   useEffect(() => {
      const getAuthProviders = async () => {
         const res = await getProviders();
         setProviders(res);
      };
      getAuthProviders();
   }, []);

   const handleCredentialsLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
         });

         if (result?.error) {
            setError("Email o contraseña incorrectos");
         } else {
            window.location.href = "/";
         }
      } catch (err) {
         setError("Error al iniciar sesión");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
         <div className="max-w-md w-full space-y-8">
            <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  Iniciar Sesión
               </h2>
               <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Acceso solo para usuarios autorizados
               </p>
            </div>

            {/* Formulario de credenciales */}
            <form className="mt-8 space-y-6" onSubmit={handleCredentialsLogin}>
               <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                     <label htmlFor="email" className="sr-only">
                        Email
                     </label>
                     <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-t-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                        placeholder="Email"
                     />
                  </div>
                  <div>
                     <label htmlFor="password" className="sr-only">
                        Contraseña
                     </label>
                     <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-b-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                        placeholder="Contraseña"
                     />
                  </div>
               </div>

               {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm text-center">
                     {error}
                  </div>
               )}

               <div>
                  <button
                     type="submit"
                     disabled={loading}
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors disabled:opacity-50"
                  >
                     {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </button>
               </div>
            </form>

            {/* Divisor */}
            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
               </div>
               <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                     O continúa con
                  </span>
               </div>
            </div>

            {/* Botones de providers OAuth */}
            <div>
               {providers &&
                  Object.values(providers).map((provider: any) => {
                     // Solo mostrar providers que no sean credentials
                     if (provider.id === "credentials") return null;

                     return (
                        <div key={provider.name} className="mt-4">
                           <button
                              onClick={() =>
                                 signIn(provider.id, { callbackUrl: "/" })
                              }
                              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                           >
                              <svg
                                 className="w-5 h-5 mr-2"
                                 viewBox="0 0 24 24"
                                 fill="currentColor"
                              >
                                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                 <path d="M12 1C7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                              </svg>
                              Continuar con {provider.name}
                           </button>
                        </div>
                     );
                  })}
            </div>
         </div>
      </div>
   );
}
