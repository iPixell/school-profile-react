import React, { useEffect, useState } from 'react';
import type { SubmitEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from "../services/api";
import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";

interface ResetPasswordResponse {
 message: string;
}

function ResetPassword() {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();

 const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);

 const [token, setToken] = useState("");

 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");

 const [passwordError, setPasswordError] = useState("");
 const [confirmPasswordError, setConfirmPasswordError] = useState("");
 const [submitError, setSubmitError] = useState("");

 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  const resetToken = searchParams.get("token");

  if (resetToken) {
   setToken(resetToken);
  }
 }, [searchParams]);

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

  setPasswordError("");
  setConfirmPasswordError("");
  setSubmitError("");

  if (!token) {
   setSubmitError("Token reset password tidak ditemukan.");
   return;
  }

  let hasError = false;

  if (!password) {
   setPasswordError("Password wajib diisi.");
   hasError = true;
  } else if (password.length < 8) {
   setPasswordError("Password minimal 8 karakter.");
   hasError = true;
  }

  if (!confirmPassword) {
   setConfirmPasswordError("Konfirmasi password wajib diisi.");
   hasError = true;
  } else if (password !== confirmPassword) {
   setConfirmPasswordError("Konfirmasi password tidak sama.");
   hasError = true;
  }

  if (hasError) return;

  try {
   setIsLoading(true);

   await apiFetch<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
     token,
     newPassword: password,
    }),
   });

   navigate("/reset-password/success");
  } catch (error) {
   if (error instanceof Error) {
    setSubmitError(error.message);
   } else {
    setSubmitError("Gagal mengubah password. Silakan coba lagi.");
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
      Reset Password
     </h1>

     <p className="mt-2 text-sm text-gray-500">
      Masukkan password baru untuk akun Anda.
     </p>
    </div>

    <form className="space-y-5" onSubmit={handleSubmit}>
     {/* Password baru */}
     <div>
      <label
       htmlFor="password"
       className="mb-2 block text-sm font-semibold text-gray-700"
      >
       Password Baru
      </label>

      <div className="relative">
       <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
         setPassword(e.target.value);
         setPasswordError("");
         setSubmitError("");
        }}
        placeholder="Masukkan password baru"
        autoComplete="new-password"
        className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${
         passwordError || submitError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
          : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
        }`}
       />

       <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#B46000]"
        aria-label={
         showPassword ? "Sembunyikan password" : "Tampilkan password"
        }
       >
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
       </button>
      </div>

      {passwordError && (
       <p className="mt-1.5 text-sm text-red-500">{passwordError}</p>
      )}
     </div>

     {/* Konfirmasi password */}
     <div>
      <label
       htmlFor="confirmPassword"
       className="mb-2 block text-sm font-semibold text-gray-700"
      >
       Konfirmasi Password
      </label>

      <div className="relative">
       <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => {
         setConfirmPassword(e.target.value);
         setConfirmPasswordError("");
         setSubmitError("");
        }}
        placeholder="Masukkan ulang password"
        autoComplete="new-password"
        className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${
         confirmPasswordError || submitError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
          : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
        }`}
       />

       <button
        type="button"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#B46000]"
        aria-label={
         showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"
        }
       >
        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
       </button>
      </div>

      {confirmPasswordError && (
       <p className="mt-1.5 text-sm text-red-500">{confirmPasswordError}</p>
      )}
     </div>

     {submitError && <p className="text-sm text-red-500">{submitError}</p>}

     <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
     >
      {isLoading ? "Menyimpan..." : "Reset Password"}
     </button>
    </form>
   </section>
  </main>
 );
}

export default ResetPassword;
