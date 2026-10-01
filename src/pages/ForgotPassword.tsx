import React, { useEffect, useState } from 'react';
import type { SubmitEvent } from "react";
import { Mail } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from "../services/api";
import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";

interface ForgotPasswordResponse {
 message: string;
}

function ForgotPassword() {
 const navigate = useNavigate();

 const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);

 const [email, setEmail] = useState("");
 const [emailError, setEmailError] = useState("");
 const [submitError, setSubmitError] = useState("");
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  async function loadSchoolProfile() {
   try {
    const response = await getSchoolProfile();
    setSchoolProfile(response.data);
   } catch (error) {
    console.error("Gagal mengambil profil sekolah:", error);
   }
  }

  loadSchoolProfile();
 }, []);

 const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  setEmailError("");
  setSubmitError("");

  if (!email.trim()) {
   setEmailError("Email wajib diisi.");
   return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
   setEmailError("Format email tidak valid.");
   return;
  }

  try {
   setIsLoading(true);

   await apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
     email: email.trim(),
    }),
   });

   navigate("/reset-link-sent");
  } catch (error) {
   if (error instanceof Error) {
    setSubmitError(error.message);
   } else {
    setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
   }
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <main className="flex min-h-screen items-center justify-center bg-white px-5 py-8">
   <section className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">
    {/* Logo sekolah */}
    <div className="mb-6 flex justify-center">
     {schoolProfile?.logoUrl ? (
      <img
       src={schoolProfile.logoUrl}
       alt={`Logo ${schoolProfile.schoolName}`}
       className="h-24 w-24 rounded-full object-cover"
      />
     ) : (
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
       Logo
      </div>
     )}
    </div>

    <div className="mb-8 text-center">
     <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
      Lupa Password
     </h1>

     <p className="mt-2 text-sm text-gray-500">
      Masukkan email yang terdaftar untuk menerima instruksi reset password.
     </p>
    </div>

    <form className="space-y-5" onSubmit={handleSubmit}>
     <div>
      <label
       htmlFor="email"
       className="mb-2 block text-sm font-semibold text-gray-700"
      >
       Email
      </label>

      <div className="relative">
       <Mail
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       />

       <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
         setEmail(e.target.value);
         setEmailError("");
         setSubmitError("");
        }}
        placeholder="Masukkan email"
        autoComplete="email"
        className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 ${
         emailError || submitError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
          : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
        }`}
       />
      </div>

      {emailError && (
       <p className="mt-1.5 text-sm text-red-500">{emailError}</p>
      )}

      {submitError && (
       <p className="mt-1.5 text-sm text-red-500">{submitError}</p>
      )}
     </div>

     <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
     >
      {isLoading ? "Mengirim..." : "Kirim Instruksi Reset"}
     </button>

     {/* Kembali ke Login */}
     <div className="text-center">
      <Link
       to="/login"
       className="text-sm font-semibold text-[#B46000] hover:underline"
      >
       ← Kembali ke Login
      </Link>
     </div>
    </form>
   </section>
  </main>
 );
}

export default ForgotPassword;
