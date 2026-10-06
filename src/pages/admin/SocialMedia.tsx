import React, { useEffect, useState } from 'react';
import { Pencil, Search, Trash2, X } from "lucide-react";
import {
 createSocialMedia,
 deleteSocialMedia,
 getSocialMedias,
 updateSocialMedia,
 type SocialMedia as SocialMediaType,
} from "../../services/socialMedia.service";

function SocialMedia() {
 const [socialMedias, setSocialMedias] = useState<SocialMediaType[]>([]);

 const [platform, setPlatform] = useState("");
 const [url, setUrl] = useState("");

 const [platformError, setPlatformError] = useState("");
 const [urlError, setUrlError] = useState("");

 const [search, setSearch] = useState("");

 const [editingId, setEditingId] = useState<number | null>(null);

 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);

 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");

 async function loadSocialMedias() {
  try {
   setLoading(true);
   setError("");

   const response = await getSocialMedias();
   setSocialMedias(response.data);
  } catch (error) {
   setError(
    error instanceof Error
     ? error.message
     : "Gagal mengambil data sosial media.",
   );
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  void loadSocialMedias();
 }, []);

 function resetForm() {
  setPlatform("");
  setUrl("");
  setPlatformError("");
  setUrlError("");
  setEditingId(null);
 }

 function validateForm() {
  let valid = true;

  setPlatformError("");
  setUrlError("");

  if (!platform.trim()) {
   setPlatformError("Platform wajib diisi.");
   valid = false;
  }

  if (!url.trim()) {
   setUrlError("URL wajib diisi.");
   valid = false;
  } else {
   try {
    new URL(url.trim());
   } catch {
    setUrlError("Format URL social media tidak valid.");
    valid = false;
   }
  }

  return valid;
 }

 async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (!validateForm()) {
   return;
  }

  try {
   setSaving(true);

   const data = {
    platform: platform.trim(),
    url: url.trim(),
   };

   if (editingId !== null) {
    await updateSocialMedia(editingId, data);
    setSuccess("Data sosial media berhasil diperbarui.");
   } else {
    await createSocialMedia(data);
    setSuccess("Data sosial media berhasil ditambahkan.");
   }

   resetForm();
   await loadSocialMedias();
  } catch (error) {
   setError(
    error instanceof Error
     ? error.message
     : "Gagal menyimpan data sosial media.",
   );
  } finally {
   setSaving(false);
  }
 }

 function handleEdit(item: SocialMediaType) {
  setEditingId(item.id);
  setPlatform(item.platform);
  setUrl(item.url);

  setPlatformError("");
  setUrlError("");
  setError("");
  setSuccess("");

  window.scrollTo({
   top: 0,
   behavior: "smooth",
  });
 }

 async function handleDelete(id: number) {
  const confirmed = window.confirm(
   "Apakah kamu yakin ingin menghapus sosial media ini?",
  );

  if (!confirmed) {
   return;
  }

  try {
   setError("");
   setSuccess("");

   await deleteSocialMedia(id);

   if (editingId === id) {
    resetForm();
   }

   setSocialMedias((current) => current.filter((item) => item.id !== id));

   setSuccess("Data sosial media berhasil dihapus.");
  } catch (error) {
   setError(
    error instanceof Error
     ? error.message
     : "Gagal menghapus data sosial media.",
   );
  }
 }

 const filteredSocialMedias = socialMedias.filter((item) =>
  item.platform.toLowerCase().includes(search.toLowerCase()),
 );

 return (
  <main className="min-w-0">
   <header className="mb-6 sm:mb-7">
    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
     Social Media
    </h1>

    <p className="mt-2 text-sm text-gray-500 sm:text-base">
     Kelola daftar sosial media sekolah
    </p>
   </header>

   {/* Pesan */}
   {error && (
    <div
     role="alert"
     className="mb-4 flex items-start justify-between gap-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
     <span>{error}</span>

     <button
      type="button"
      onClick={() => setError("")}
      aria-label="Tutup pesan"
     >
      <X size={17} />
     </button>
    </div>
   )}

   {success && (
    <div
     role="status"
     className="mb-4 flex items-start justify-between gap-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
    >
     <span>{success}</span>

     <button
      type="button"
      onClick={() => setSuccess("")}
      aria-label="Tutup pesan"
     >
      <X size={17} />
     </button>
    </div>
   )}

   {/* Konten utama */}
   <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
    {/* Daftar sosial media */}
    <div className="min-w-0 overflow-hidden border border-gray-300 bg-white">
     {/* Search */}
     <div className="border-b border-gray-300 p-4">
      <div className="relative w-full sm:max-w-[430px]">
       <Search
        size={20}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
       />

       <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari nama platform..."
        className="h-11 w-full rounded border border-gray-400 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#EF8700]"
       />
      </div>
     </div>

     {/* Desktop / Tablet */}
     <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[620px] border-collapse">
       <thead>
        <tr className="bg-[#F5E9DA]">
         <th className="border border-gray-400 px-4 py-3 text-left text-sm font-semibold text-gray-800">
          No
         </th>

         <th className="border border-gray-400 px-4 py-3 text-left text-sm font-semibold text-gray-800">
          Platform
         </th>

         <th className="border border-gray-400 px-4 py-3 text-left text-sm font-semibold text-gray-800">
          URL
         </th>

         <th className="border border-gray-400 px-4 py-3 text-center text-sm font-semibold text-gray-800">
          Aksi
         </th>
        </tr>
       </thead>

       <tbody>
        {loading ? (
         <tr>
          <td
           colSpan={4}
           className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500"
          >
           Memuat data...
          </td>
         </tr>
        ) : filteredSocialMedias.length === 0 ? (
         <tr>
          <td
           colSpan={4}
           className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500"
          >
           Belum ada data sosial media.
          </td>
         </tr>
        ) : (
         filteredSocialMedias.map((item, index) => (
          <tr key={item.id}>
           <td className="border border-gray-300 px-4 py-4 text-sm text-gray-800">
            {index + 1}
           </td>

           <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-800">
            {item.platform}
           </td>

           <td className="max-w-[280px] border border-gray-300 px-4 py-4 text-sm text-gray-800">
            <a
             href={item.url}
             target="_blank"
             rel="noopener noreferrer"
             className="block truncate underline hover:text-[#EF8700]"
             title={item.url}
            >
             {item.url}
            </a>
           </td>

           <td className="border border-gray-300 px-4 py-4">
            <div className="flex items-center justify-center gap-4">
             <button
              type="button"
              title="Edit sosial media"
              onClick={() => handleEdit(item)}
              className="text-[#EF8700] transition hover:text-orange-700"
             >
              <Pencil size={25} />
             </button>

             <button
              type="button"
              title="Hapus sosial media"
              onClick={() => void handleDelete(item.id)}
              className="text-red-500 transition hover:text-red-700"
             >
              <Trash2 size={25} />
             </button>
            </div>
           </td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     {/* Mobile */}
     <div className="space-y-3 p-4 sm:hidden">
      {loading ? (
       <div className="py-8 text-center text-sm text-gray-500">
        Memuat data...
       </div>
      ) : filteredSocialMedias.length === 0 ? (
       <div className="py-8 text-center text-sm text-gray-500">
        Belum ada data sosial media.
       </div>
      ) : (
       filteredSocialMedias.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-gray-300 p-4">
         <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
           <p className="text-xs text-gray-500">Platform</p>

           <p className="mt-1 text-sm font-semibold text-gray-900">
            {item.platform}
           </p>
          </div>

          <span className="shrink-0 text-xs text-gray-500">#{index + 1}</span>
         </div>

         <div className="mt-3">
          <p className="text-xs text-gray-500">URL</p>

          <a
           href={item.url}
           target="_blank"
           rel="noopener noreferrer"
           className="mt-1 block break-all text-sm text-gray-800 underline hover:text-[#EF8700]"
          >
           {item.url}
          </a>
         </div>

         <div className="mt-4 flex justify-end gap-4 border-t border-gray-200 pt-3">
          <button
           type="button"
           title="Edit sosial media"
           onClick={() => handleEdit(item)}
           className="text-[#EF8700] transition hover:text-orange-700"
          >
           <Pencil size={22} />
          </button>

          <button
           type="button"
           title="Hapus sosial media"
           onClick={() => void handleDelete(item.id)}
           className="text-red-500 transition hover:text-red-700"
          >
           <Trash2 size={22} />
          </button>
         </div>
        </div>
       ))
      )}
     </div>
    </div>

    {/* Form */}
    <div className="h-fit border border-gray-300 bg-white">
     <div className="border-b border-gray-300 px-5 py-4">
      <h2 className="text-lg font-bold text-gray-900">
       {editingId !== null ? "Edit Sosial Media" : "Tambah Sosial Media"}
      </h2>
     </div>

     <form onSubmit={handleSubmit} className="space-y-5 p-5">
      {/* Platform */}
      <div>
       <label
        htmlFor="social-platform"
        className="mb-2 block text-sm font-semibold text-gray-800"
       >
        Platform
        <span className="ml-1 text-red-500">*</span>
       </label>

       <select
  id="social-platform"
  value={platform}
  onChange={(event) => {
    setPlatform(event.target.value);
    setPlatformError("");
    setError("");
    setSuccess("");
  }}
  className={`h-11 w-full rounded border bg-white px-3 text-sm text-gray-800 outline-none transition ${
    platformError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-400 focus:border-[#EF8700]"
  }`}
>
  <option value="">Pilih platform</option>
  <option value="Instagram">Instagram</option>
  <option value="Facebook">Facebook</option>
  <option value="YouTube">YouTube</option>
  <option value="TikTok">TikTok</option>
  <option value="X">X</option>
  <option value="WhatsApp">WhatsApp</option>
  <option value="Telegram">Telegram</option>
  <option value="LinkedIn">LinkedIn</option>
</select>

       {platformError && (
        <p className="mt-1 text-xs text-red-500">{platformError}</p>
       )}
      </div>

      {/* URL */}
      <div>
       <label
        htmlFor="social-url"
        className="mb-2 block text-sm font-semibold text-gray-800"
       >
        URL
        <span className="ml-1 text-red-500">*</span>
       </label>

       <input
        id="social-url"
        type="url"
        value={url}
        onChange={(event) => {
         setUrl(event.target.value);
         setUrlError("");
         setError("");
         setSuccess("");
        }}
        placeholder="https://instagram.com/..."
        className={`h-11 w-full rounded border bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 ${
         urlError
          ? "border-red-500 focus:border-red-500"
          : "border-gray-400 focus:border-[#EF8700]"
        }`}
       />

       {urlError && <p className="mt-1 text-xs text-red-500">{urlError}</p>}
      </div>

      {/* Tombol */}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
       {editingId !== null && (
        <button
         type="button"
         onClick={resetForm}
         disabled={saving}
         className="rounded border border-gray-500 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:opacity-50"
        >
         Batal
        </button>
       )}

       <button
        type="submit"
        disabled={saving}
        className="rounded bg-[#F5820B] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
       >
        {saving ? "Menyimpan..." : editingId !== null ? "Perbarui" : "Simpan"}
       </button>
      </div>
     </form>
    </div>
   </section>
  </main>
 );
}

export default SocialMedia;
