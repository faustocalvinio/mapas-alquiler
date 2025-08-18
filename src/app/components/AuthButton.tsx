"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
   const { data: session, status } = useSession();

   if (status === "loading") {
      return (
         <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
         </div>
      );
   }

   if (session?.user) {
      return (
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               {session.user.image && (
                  <Image
                     src={session.user.image}
                     alt="Profile"
                     width={32}
                     height={32}
                     className="rounded-full"
                  />
               )}
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {session.user.name || session.user.email}
               </span>
            </div>
            <button
               onClick={() => signOut({ callbackUrl: "/auth/signin" })}
               className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
               Cerrar Sesión
            </button>
         </div>
      );
   }

   return null;
}
