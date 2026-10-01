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

 async function loadHistories() {
  try {
   setLoading(true);
   setError("");

   const response = await getPrincipalHistories();

   setHistories(response.data);
  } catch (err) {
   console.error(err);

   setError("Gagal mengambil data riwayat kepala sekolah.");
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
 }

 function handleEdit(item: PrincipalHistoryData) {
  setEditingId(item.id);
  setName(item.name);
  setPeriod(item.period);

  setError("");
  setSuccess("");
 }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!name.trim()) {
   setError("Nama wajib diisi.");
   return;
  }

  if (!period.trim()) {
   setError("Periode wajib diisi.");
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
  } catch (err) {
   console.error(err);

   setError("Gagal menyimpan data kepala sekolah.");
  } finally {
   setSaving(false);
  }
 }

 async function handleDelete(id: number) {
  const confirmed = window.confirm(
   "Apakah kamu yakin ingin menghapus data kepala sekolah ini?",
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

   await loadHistories();

   setSuccess("Data kepala sekolah berhasil dihapus.");
  } catch (err) {
   console.error(err);

   setError("Gagal menghapus data kepala sekolah.");
  }
 }

 const filteredHistories = histories.filter(
  (item) =>
   item.name.toLowerCase().includes(search.toLowerCase()) ||
   item.period.toLowerCase().includes(search.toLowerCase()),
 );

 return (
  <div>
   {/* =========================
          HEADER
      ========================== */}

   <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
     Riwayat Kepala Sekolah
    </h1>

    <p className="mt-2 text-sm text-gray-500 sm:text-base">
     Kelola data riwayat kepala sekolah
    </p>
   </div>

   {/* =========================
          MESSAGE
      ========================== */}

   {error && (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
     {error}
    </div>
   )}

   {success && (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
     {success}
    </div>
   )}

   {/* =========================
          CONTENT
      ========================== */}

   <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
    {/* =========================
            TABLE
        ========================== */}

    <section className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-6">
     {/* Search */}

     <div className="mb-6 w-full max-w-[420px]">
      <div className="flex items-center rounded-md border border-gray-300 bg-white">
       <Search size={21} className="ml-3 shrink-0 text-gray-600" />

       <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari nama kepala sekolah..."
        className="w-full bg-transparent px-3 py-3 text-sm outline-none"
       />
      </div>
     </div>

     {loading ? (
      <div className="flex min-h-[300px] items-center justify-center">
       <p className="text-sm text-gray-500">Memuat data...</p>
      </div>
     ) : (
      <div className="overflow-x-auto">
       <table className="w-full min-w-[650px] border-collapse">
        <thead>
         <tr className="bg-[#F5EBDD]">
          <th className="border border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-800">
           No
          </th>

          <th className="border border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-800">
           Nama
          </th>

          <th className="border border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-800">
           Periode
          </th>

          <th className="border border-gray-300 px-4 py-4 text-center text-sm font-bold text-gray-800">
           Aksi
          </th>
         </tr>
        </thead>

        <tbody>
         {filteredHistories.length > 0 ? (
          filteredHistories.map((item, index) => (
           <tr key={item.id} className="transition hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-5 text-sm text-gray-700">
             {index + 1}
            </td>

            <td className="border border-gray-300 px-4 py-5 text-sm font-medium text-gray-800">
             {item.name}
            </td>

            <td className="border border-gray-300 px-4 py-5 text-sm text-gray-700">
             {item.period}
            </td>

            <td className="border border-gray-300 px-4 py-5">
             <div className="flex items-center justify-center gap-4">
              <button
               type="button"
               onClick={() => handleEdit(item)}
               className="text-[#F28C00] transition hover:text-[#B46000]"
               title="Edit"
              >
               <Pencil size={22} />
              </button>

              <button
               type="button"
               onClick={() => handleDelete(item.id)}
               className="text-[#F28C00] transition hover:text-red-600"
               title="Hapus"
              >
               <Trash2 size={22} />
              </button>
             </div>
            </td>
           </tr>
          ))
         ) : (
          <tr>
           <td
            colSpan={4}
            className="border border-gray-300 px-4 py-14 text-center text-sm text-gray-500"
           >
            {search
             ? "Data tidak ditemukan."
             : "Belum ada data riwayat kepala sekolah."}
           </td>
          </tr>
         )}
        </tbody>
       </table>
      </div>
     )}
    </section>

    {/* =========================
            FORM
        ========================== */}

    <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
     <h2 className="mb-6 text-lg font-bold text-gray-900">
      {editingId !== null ? "Edit Kepala Sekolah" : "Tambah Kepala sekolah"}
     </h2>

     <form onSubmit={handleSubmit} className="space-y-5">
      <div>
       <label
        htmlFor="principal-name"
        className="mb-2 block text-sm font-bold text-gray-800"
       >
        Nama
        <span className="text-red-500">*</span>
       </label>

       <input
        id="principal-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kepala sekolah"
        className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/10"
       />
      </div>

      <div>
       <label
        htmlFor="principal-period"
        className="mb-2 block text-sm font-bold text-gray-800"
       >
        Periode
        <span className="text-red-500">*</span>
       </label>

       <input
        id="principal-period"
        type="text"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        placeholder="Contoh: 2024-Sekarang"
        className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/10"
       />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
       <button
        type="button"
        onClick={resetForm}
        disabled={saving}
        className="rounded-md border border-gray-400 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
       >
        Batal
       </button>

       <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-[#F28C00] px-7 py-2.5 text-sm font-bold text-white transition hover:bg-[#D97800] disabled:cursor-not-allowed disabled:opacity-60"
       >
        {saving ? "Menyimpan..." : editingId !== null ? "Update" : "Simpan"}
       </button>
      </div>
     </form>
    </section>
   </div>
  </div>
 );
}

export default PrincipalHistory;
