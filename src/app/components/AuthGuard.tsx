"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
   const { data: session, status } = useSession();
   const router = useRouter();

   useEffect(() => {
      console.log("AuthGuard - Status:", status);
      console.log("AuthGuard - Session:", session);

      if (status === "loading") return; // Still loading

      if (!session) {
         console.log("AuthGuard - No session, redirecting to signin");
         router.push("/auth/signin");
         return;
      }

      if (!session.user?.isAuthorized) {
         console.log("AuthGuard - User not authorized, redirecting to signin");
         router.push("/auth/signin");
         return;
      }

      console.log("AuthGuard - User is authorized, allowing access");
   }, [session, status, router]);

   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   if (!session) {
      return null;
   }

   if (!session.user?.isAuthorized) {
      return null;
   }

   return <>{children}</>;
}
