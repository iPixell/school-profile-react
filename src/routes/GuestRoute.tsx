import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAdminToken } from "../services/auth.service";

interface GuestRouteProps {
 children: React.ReactNode;
}

function isAccessTokenValid(token: string | null): boolean {
 if (!token) {
  return false;
 }

 try {
  const payloadBase64 = token.split(".")[1];

  if (!payloadBase64) {
   return false;
  }

  const payload = JSON.parse(
   atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")),
  );

  if (typeof payload.exp !== "number") {
   return false;
  }

  return payload.exp * 1000 > Date.now();
 } catch {
  return false;
 }
}

function GuestRoute({ children }: GuestRouteProps) {
 const navigate = useNavigate();

 const [checkingAuth, setCheckingAuth] = useState(true);
 const [authenticated, setAuthenticated] = useState(false);

 useEffect(() => {
  let mounted = true;

  async function checkAuthentication() {
   const accessToken = sessionStorage.getItem("accessToken");

   /*
    * Access token masih valid.
    */
   if (isAccessTokenValid(accessToken)) {
    if (mounted) {
     setAuthenticated(true);
     setCheckingAuth(false);
    }

    return;
   }

   /*
    * Access token tidak ada / sudah expired.
    *
    * Coba gunakan refresh token.
    */
   if (accessToken) {
    sessionStorage.removeItem("accessToken");
   }

   try {
    await refreshAdminToken();

    if (mounted) {
     setAuthenticated(true);
    }
   } catch {
    if (mounted) {
     setAuthenticated(false);
    }
   } finally {
    if (mounted) {
     setCheckingAuth(false);
    }
   }
  }

  checkAuthentication();

  return () => {
   mounted = false;
  };
 }, []);

 useEffect(() => {
  if (!checkingAuth && authenticated) {
   navigate("/admin/profil-sekolah", {
    replace: true,
   });
  }
 }, [checkingAuth, authenticated, navigate]);

 if (checkingAuth) {
  return (
   <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <p className="text-sm text-gray-500">Memeriksa sesi...</p>
   </div>
  );
 }

 if (authenticated) {
  return null;
 }

 return <>{children}</>;
}

export default GuestRoute;
