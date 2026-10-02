import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshAdminToken } from "../services/auth.service";

interface AdminRouteProps {
 children: React.ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
 const navigate = useNavigate();
 const location = useLocation();

 const [checkingAuth, setCheckingAuth] = useState(true);
 const [authenticated, setAuthenticated] = useState(false);

 useEffect(() => {
  let mounted = true;

  async function checkAuthentication() {
   try {
    const accessToken = sessionStorage.getItem("accessToken");

    /*
     * Kalau access token masih ada,
     * izinkan masuk ke Admin Panel.
     *
     * Validitas token tetap akan dicek backend
     * ketika melakukan request API.
     */
    if (accessToken) {
     if (mounted) {
      setAuthenticated(true);
      setCheckingAuth(false);
     }

     return;
    }

    /*
     * Tidak ada access token di sessionStorage.
     *
     * Coba gunakan refresh token yang tersimpan
     * di HttpOnly cookie.
     */
    await refreshAdminToken();

    if (mounted) {
     setAuthenticated(true);
    }
   } catch (error) {
    console.error("Autentikasi admin gagal:", error);

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
  if (!checkingAuth && !authenticated) {
   navigate("/login", {
    replace: true,
    state: {
     from: location.pathname,
    },
   });
  }
 }, [checkingAuth, authenticated, navigate, location.pathname]);

 if (checkingAuth) {
  return (
   <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <p className="text-sm text-gray-500">Memeriksa sesi...</p>
   </div>
  );
 }

 if (!authenticated) {
  return null;
 }

 return <>{children}</>;
}

export default AdminRoute;
