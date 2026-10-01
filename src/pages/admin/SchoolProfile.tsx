import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Upload } from "lucide-react";
import {
 getSchoolProfile,
 updateSchoolProfile,
 type SchoolProfile,
} from "../../services/schoolProfile.service";

function AdminSchoolProfile() {
 const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);

 /*
  * Field sengaja dimulai kosong.
  * Data lama akan ditampilkan sebagai placeholder.
  */
 const [schoolName, setSchoolName] = useState("");
 const [shortInfo, setShortInfo] = useState("");
 const [about, setAbout] = useState("");
 const [history, setHistory] = useState("");
 const [vision, setVision] = useState("");
 const [mission, setMission] = useState("");

 const [logoFile, setLogoFile] = useState<File | null>(null);
 const [bannerFile, setBannerFile] = useState<File | null>(null);

 const [logoPreview, setLogoPreview] = useState("");
 const [bannerPreview, setBannerPreview] = useState("");

 const [isLoading, setIsLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);

 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");

 const logoInputRef = useRef<HTMLInputElement>(null);
 const bannerInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
  async function loadSchoolProfile() {
   try {
    setIsLoading(true);
    setError("");

    const response = await getSchoolProfile();
    const data = response.data;

    setSchoolProfile(data);

    /*
     * Jangan masukkan data lama ke value.
     * Data lama akan menjadi placeholder.
     */
    setSchoolName("");
    setShortInfo("");
    setAbout("");
    setHistory("");
    setVision("");
    setMission("");

    setLogoPreview(data.logoUrl ?? "");
    setBannerPreview(data.bannerUrl ?? "");
   } catch (error) {
    console.error("Gagal mengambil profil sekolah:", error);

    setError(
     error instanceof Error
      ? error.message
      : "Gagal mengambil data profil sekolah.",
    );
   } finally {
    setIsLoading(false);
   }
  }

  loadSchoolProfile();
 }, []);

 const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
   setError("Logo harus berupa JPG atau PNG.");
   return;
  }

  setLogoFile(file);
  setLogoPreview(URL.createObjectURL(file));

  setError("");
  setSuccess("");
 };

 const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
   setError("Banner harus berupa JPG atau PNG.");
   return;
  }

  setBannerFile(file);
  setBannerPreview(URL.createObjectURL(file));

  setError("");
  setSuccess("");
 };

 const handleSave = async () => {
  setError("");
  setSuccess("");

  if (!schoolProfile) {
   setError("Data profil sekolah belum tersedia.");
   return;
  }

  /*
   * SchoolName adalah field wajib.
   *
   * Kalau admin tidak mengetik apa-apa,
   * gunakan data lama.
   */
  const finalSchoolName = schoolName.trim() || schoolProfile.schoolName.trim();

  if (!finalSchoolName) {
   setError("Nama sekolah wajib diisi.");
   return;
  }

  /*
   * Field optional:
   * kalau kosong, gunakan data lama.
   */
  const finalShortInfo = shortInfo.trim() || schoolProfile.shortInfo || "";

  const finalAbout = about.trim() || schoolProfile.about || "";

  const finalHistory = history.trim() || schoolProfile.history || "";

  const finalVision = vision.trim() || schoolProfile.vision || "";

  const finalMission = mission.trim() || schoolProfile.mission || "";

  try {
   setIsSaving(true);

   const formData = new FormData();

   formData.append("schoolName", finalSchoolName);
   formData.append("shortInfo", finalShortInfo);
   formData.append("about", finalAbout);
   formData.append("history", finalHistory);
   formData.append("vision", finalVision);
   formData.append("mission", finalMission);

   if (logoFile) {
    formData.append("logo", logoFile);
   }

   if (bannerFile) {
    formData.append("banner", bannerFile);
   }

   const response = await updateSchoolProfile(formData);

   const updatedProfile = response.data;

   setSchoolProfile(updatedProfile);

   /*
    * Setelah berhasil disimpan,
    * field kembali kosong dan data terbaru
    * menjadi placeholder.
    */
   setSchoolName("");
   setShortInfo("");
   setAbout("");
   setHistory("");
   setVision("");
   setMission("");

   setLogoFile(null);
   setBannerFile(null);

   setLogoPreview(updatedProfile.logoUrl ?? "");
   setBannerPreview(updatedProfile.bannerUrl ?? "");

   if (logoInputRef.current) {
    logoInputRef.current.value = "";
   }

   if (bannerInputRef.current) {
    bannerInputRef.current.value = "";
   }

   setSuccess("Profil sekolah berhasil diperbarui.");
  } catch (error) {
   console.error("Gagal menyimpan profil sekolah:", error);

   setError(
    error instanceof Error ? error.message : "Gagal menyimpan profil sekolah.",
   );
  } finally {
   setIsSaving(false);
  }
 };

 const handleCancel = () => {
  if (!schoolProfile) return;

  setSchoolName("");
  setShortInfo("");
  setAbout("");
  setHistory("");
  setVision("");
  setMission("");

  setLogoFile(null);
  setBannerFile(null);

  setLogoPreview(schoolProfile.logoUrl ?? "");
  setBannerPreview(schoolProfile.bannerUrl ?? "");

  setError("");
  setSuccess("");

  if (logoInputRef.current) {
   logoInputRef.current.value = "";
  }

  if (bannerInputRef.current) {
   bannerInputRef.current.value = "";
  }
 };

 if (isLoading) {
  return (
   <div className="flex min-h-[60vh] items-center justify-center">
    <p className="text-sm text-gray-500">Memuat profil sekolah...</p>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-white px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
   {/* Header */}
   <div className="mb-6 sm:mb-8">
    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
     Profil Sekolah
    </h1>

    <p className="mt-2 text-sm text-gray-500 sm:text-base">
     Kelola Informasi Profil Sekolah
    </p>
   </div>

   {/* Error */}
   {error && (
    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
     {error}
    </div>
   )}

   {/* Success */}
   {success && (
    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
     {success}
    </div>
   )}

   {/* Form */}
   <div className="rounded-xl border border-gray-300 bg-white p-4 sm:p-6 lg:p-7">
    <div className="grid gap-6 lg:grid-cols-2">
     {/* LEFT */}
     <div className="space-y-5">
      {/* Nama */}
      <div>
       <label
        htmlFor="schoolName"
        className="mb-2 block text-sm font-bold text-gray-900"
       >
        Nama Sekolah
        <span className="text-red-500">*</span>
       </label>

       <input
        id="schoolName"
        type="text"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder={schoolProfile?.schoolName || "Masukkan nama sekolah"}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>

      {/* Informasi Singkat */}
      <div>
       <label
        htmlFor="shortInfo"
        className="mb-2 block text-sm font-bold text-gray-900"
       >
        Informasi Singkat
       </label>

       <textarea
        id="shortInfo"
        value={shortInfo}
        onChange={(e) => setShortInfo(e.target.value)}
        placeholder={
         schoolProfile?.shortInfo || "Masukkan informasi singkat sekolah"
        }
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>

      {/* Tentang */}
      <div>
       <label
        htmlFor="about"
        className="mb-2 block text-sm font-bold text-gray-900"
       >
        Tentang Sekolah
       </label>

       <textarea
        id="about"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder={
         schoolProfile?.about || "Masukkan informasi tentang sekolah"
        }
        rows={5}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>
     </div>

     {/* RIGHT */}
     <div className="space-y-5">
      {/* Sejarah */}
      <div>
       <label
        htmlFor="history"
        className="mb-2 block text-sm font-bold text-gray-900"
       >
        Sejarah
       </label>

       <textarea
        id="history"
        value={history}
        onChange={(e) => setHistory(e.target.value)}
        placeholder={schoolProfile?.history || "Masukkan sejarah sekolah"}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>

      {/* Visi */}
      <div>
       <label
        htmlFor="vision"
        className="mb-2 block text-sm font-bold text-gray-900"
       >
        Visi
       </label>

       <textarea
        id="vision"
        value={vision}
        onChange={(e) => setVision(e.target.value)}
        placeholder={schoolProfile?.vision || "Masukkan visi sekolah"}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>

      {/* Misi */}
      <div>
       <label
        htmlFor="mission"
        className="mb-2 block text-sm font-bold text-gray-900"
       >
        Misi
       </label>

       <textarea
        id="mission"
        value={mission}
        onChange={(e) => setMission(e.target.value)}
        placeholder={schoolProfile?.mission || "Masukkan misi sekolah"}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>
     </div>
    </div>

    {/* =========================
            LOGO & BANNER
        ========================== */}
    <div className="mt-8">
     <h2 className="mb-5 text-sm font-bold text-gray-900">Logo & Banner</h2>

     <div className="grid gap-8 lg:grid-cols-2">
      {/* LOGO — duluan */}
      <div>
       <p className="mb-3 text-sm font-bold text-gray-900">Logo</p>

       <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 sm:w-60">
         {logoPreview ? (
          <img
           src={logoPreview}
           alt="Logo sekolah"
           className="h-full w-full object-contain"
          />
         ) : (
          <ImageIcon size={60} className="text-gray-400" />
         )}
        </div>

        <div>
         <input
          ref={logoInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleLogoChange}
          className="hidden"
         />

         <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-gray-400 px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
         >
          <Upload size={17} className="text-[#B46000]" />
          Ubah Gambar
         </button>
        </div>
       </div>
      </div>

      {/* BANNER */}
      <div>
       <p className="mb-3 text-sm font-bold text-gray-900">Banner</p>

       <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 sm:w-60">
         {bannerPreview ? (
          <img
           src={bannerPreview}
           alt="Banner sekolah"
           className="h-full w-full object-cover"
          />
         ) : (
          <ImageIcon size={60} className="text-gray-400" />
         )}
        </div>

        <div>
         <input
          ref={bannerInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleBannerChange}
          className="hidden"
         />

         <button
          type="button"
          onClick={() => bannerInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-gray-400 px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
         >
          <Upload size={17} className="text-[#B46000]" />
          Ubah Gambar
         </button>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Actions */}
   <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <button
     type="button"
     onClick={handleCancel}
     disabled={isSaving}
     className="rounded-lg border border-gray-400 bg-white px-7 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50 disabled:opacity-50"
    >
     Batal
    </button>

    <button
     type="button"
     onClick={handleSave}
     disabled={isSaving}
     className="rounded-lg bg-[#F28C00] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#D97800] disabled:cursor-not-allowed disabled:opacity-60"
    >
     {isSaving ? "Menyimpan..." : "Simpan"}
    </button>
   </div>
  </div>
 );
}

export default AdminSchoolProfile;
