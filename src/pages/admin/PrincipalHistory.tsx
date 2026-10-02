import React, { useEffect, useState } from 'react';
import { Pencil, Search, Trash2 } from "lucide-react";
import {
 getPrincipalHistories,
 createPrincipalHistory,
 updatePrincipalHistory,
 deletePrincipalHistory,
 type PrincipalHistory as PrincipalHistoryData,
} from "../../services/principalHistory.service";

function PrincipalHistory() {
 const [histories, setHistories] = useState<PrincipalHistoryData[]>([]);

 const [search, setSearch] = useState("");

 const [name, setName] = useState("");

 const [period, setPeriod] = useState("");

 const [editingId, setEditingId] = useState<number | null>(null);

 const [loading, setLoading] = useState(true);

 const [saving, setSaving] = useState(false);

 const [error, setError] = useState("");

 const [success, setSuccess] = useState("");

 const [nameError, setNameError] = useState("");

 const [periodError, setPeriodError] = useState("");

 async function loadHistories() {
  try {
   setLoading(true);
   setError("");

   const response = await getPrincipalHistories();

   setHistories(response.data);
  } catch (error) {
   console.error("Gagal mengambil data:", error);

   setError(
    error instanceof Error
     ? error.message
     : "Gagal mengambil data riwayat kepala sekolah.",
   );
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  loadHistories();
 }, []);

 function resetForm() {
  setName("");
  setPeriod("");

  setEditingId(null);

  setNameError("");
  setPeriodError("");
 }

 function handleEdit(item: PrincipalHistoryData) {
  setEditingId(item.id);

  setName(item.name);
  setPeriod(item.period);

  setNameError("");
  setPeriodError("");

  setError("");
  setSuccess("");
 }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setNameError("");
  setPeriodError("");
  setError("");
  setSuccess("");

  let hasError = false;

  if (!name.trim()) {
   setNameError("Nama kepala sekolah wajib diisi.");

   hasError = true;
  }

  if (!period.trim()) {
   setPeriodError("Periode wajib diisi.");

   hasError = true;
  }

  if (hasError) {
   return;
  }

  try {
   setSaving(true);

   if (editingId !== null) {
    await updatePrincipalHistory(editingId, {
     name: name.trim(),
     period: period.trim(),
    });

    setSuccess("Data kepala sekolah berhasil diperbarui.");
   } else {
    await createPrincipalHistory({
     name: name.trim(),
     period: period.trim(),
    });

    setSuccess("Data kepala sekolah berhasil ditambahkan.");
   }

   resetForm();

   await loadHistories();
  } catch (error) {
   console.error("Gagal menyimpan data kepala sekolah:", error);

   setError(
    error instanceof Error
     ? error.message
     : "Gagal menyimpan data kepala sekolah.",
   );
  } finally {
   setSaving(false);
  }
 }

 async function handleDelete(id: number) {
  const confirmed = window.confirm(
   "Apakah kamu yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
   return;
  }

  try {
   setError("");
   setSuccess("");

   await deletePrincipalHistory(id);

   if (editingId === id) {
    resetForm();
   }

   setSuccess("Data kepala sekolah berhasil dihapus.");

   await loadHistories();
  } catch (error) {
   console.error("Gagal menghapus data:", error);

   setError(
    error instanceof Error
     ? error.message
     : "Gagal menghapus data kepala sekolah.",
   );
  }
 }

 const filteredHistories = histories.filter((item) => {
  const keyword = search.toLowerCase().trim();

  if (!keyword) {
   return true;
  }

  return (
   item.name.toLowerCase().includes(keyword) ||
   item.period.toLowerCase().includes(keyword)
  );
 });

 return (
  <main className="min-h-screen bg-gray-100 p-1 sm:p-2 lg:p-4">
   <div className="mx-auto max-w-7xl">
    {/* HEADER */}
    <div className="mb-6">
     <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
      Riwayat Kepala Sekolah
     </h1>

     <p className="mt-1 text-sm text-gray-500">
      Kelola data riwayat kepala sekolah
     </p>
    </div>

    {/* GLOBAL ERROR */}
    {error && (
     <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
     </div>
    )}

    {/* SUCCESS */}
    {success && (
     <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
      {success}
     </div>
    )}

    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
     {/* ================= TABLE ================= */}
     <section className="min-w-0 rounded-xl bg-white p-5 shadow-sm sm:p-6">
      {/* SEARCH */}
      <div className="mb-5">
       <label
        htmlFor="search-principal"
        className="mb-2 block text-sm font-semibold text-gray-700"
       >
        Cari Data
       </label>

       <div className="relative">
        <Search
         size={18}
         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
         id="search-principal"
         type="text"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         placeholder="Cari nama atau periode..."
         className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
        />
       </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
       <table className="w-full min-w-[620px] border-collapse">
        <thead>
         <tr className="bg-[#F8F1E8] text-left">
          <th className="px-4 py-3 text-sm font-semibold text-gray-700">No</th>

          <th className="px-4 py-3 text-sm font-semibold text-gray-700">
           Nama Kepala Sekolah
          </th>

          <th className="px-4 py-3 text-sm font-semibold text-gray-700">
           Periode
          </th>

          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
           Aksi
          </th>
         </tr>
        </thead>

        <tbody>
         {loading ? (
          <tr>
           <td
            colSpan={4}
            className="px-4 py-10 text-center text-sm text-gray-500"
           >
            Memuat data...
           </td>
          </tr>
         ) : filteredHistories.length === 0 ? (
          <tr>
           <td
            colSpan={4}
            className="px-4 py-10 text-center text-sm text-gray-500"
           >
            Belum ada data kepala sekolah.
           </td>
          </tr>
         ) : (
          filteredHistories.map((item, index) => (
           <tr key={item.id} className="border-t border-gray-200">
            <td className="px-4 py-4 text-sm text-gray-700">{index + 1}</td>

            <td className="px-4 py-4 text-sm font-medium text-gray-900">
             {item.name}
            </td>

            <td className="px-4 py-4 text-sm text-gray-700">{item.period}</td>

            <td className="px-4 py-4">
             <div className="flex justify-center gap-2">
              <button
               type="button"
               onClick={() => handleEdit(item)}
               className="rounded-lg p-2 text-[#B46000] transition hover:bg-[#B46000]/10"
               aria-label="Edit data"
              >
               <Pencil size={17} />
              </button>

              <button
               type="button"
               onClick={() => handleDelete(item.id)}
               className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
               aria-label="Hapus data"
              >
               <Trash2 size={17} />
              </button>
             </div>
            </td>
           </tr>
          ))
         )}
        </tbody>
       </table>
      </div>
     </section>

     {/* ================= FORM ================= */}
     <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
       <h2 className="text-lg font-bold text-gray-900">
        {editingId !== null ? "Edit Kepala Sekolah" : "Tambah Kepala Sekolah"}
       </h2>

       <p className="mt-1 text-sm text-gray-500">
        {editingId !== null
         ? "Ubah data kepala sekolah."
         : "Tambahkan data kepala sekolah baru."}
       </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
       {/* NAME */}
       <div>
        <label
         htmlFor="principal-name"
         className="mb-2 block text-sm font-semibold text-gray-700"
        >
         Nama Kepala Sekolah
         <span className="text-red-500"> *</span>
        </label>

        <input
         id="principal-name"
         type="text"
         value={name}
         onChange={(e) => {
          setName(e.target.value);

          setNameError("");
          setError("");
          setSuccess("");
         }}
         placeholder="Contoh: Ahmad S.Pd."
         className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
          nameError
           ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
           : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
         }`}
        />

        {nameError && (
         <p className="mt-1.5 text-sm text-red-500">{nameError}</p>
        )}
       </div>

       {/* PERIOD */}
       <div>
        <label
         htmlFor="principal-period"
         className="mb-2 block text-sm font-semibold text-gray-700"
        >
         Periode
         <span className="text-red-500"> *</span>
        </label>

        <input
         id="principal-period"
         type="text"
         value={period}
         onChange={(e) => {
          setPeriod(e.target.value);

          setPeriodError("");
          setError("");
          setSuccess("");
         }}
         placeholder="Contoh: 2018 - 2022"
         className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
          periodError
           ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
           : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
         }`}
        />

        {periodError && (
         <p className="mt-1.5 text-sm text-red-500">{periodError}</p>
        )}
       </div>

       {/* ACTION */}
       <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <button
         type="button"
         onClick={resetForm}
         disabled={saving}
         className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:flex-1"
        >
         Batal
        </button>

        <button
         type="submit"
         disabled={saving}
         className="w-full rounded-lg bg-[#B46000] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#944F00] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
        >
         {saving
          ? "Menyimpan..."
          : editingId !== null
            ? "Simpan Perubahan"
            : "Simpan"}
        </button>
       </div>
      </form>
     </section>
    </div>
   </div>
  </main>
 );
}

export default PrincipalHistory;
