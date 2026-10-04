import { useEffect, useMemo, useRef, useState } from "react";
import {
 Search,
 Plus,
 Pencil,
 Trash2,
 Images,
 X,
 Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
 createExtracurricular,
 deleteExtracurricular,
 getExtracurriculars,
 updateExtracurricular,
 type Extracurricular as ExtracurricularType,
} from "../../services/extracurricular.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function Extracurricular() {
 const navigate = useNavigate();
 const fileRef = useRef<HTMLInputElement>(null);

 const [items, setItems] = useState<ExtracurricularType[]>([]);
 const [search, setSearch] = useState("");
 const [name, setName] = useState("");
 const [nameError, setNameError] = useState("");
 const [photo, setPhoto] = useState<File | null>(null);
 const [preview, setPreview] = useState("");
 const [editingId, setEditingId] = useState<number | null>(null);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);

 async function loadData() {
  try {
   setLoading(true);
   const response = await getExtracurriculars();
   setItems(response.data);
  } catch (err) {
   setError(
    err instanceof Error
     ? err.message
     : "Gagal mengambil data ekstrakurikuler.",
   );
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  void loadData();
 }, []);

 useEffect(() => {
  if (!photo) return;
  const url = URL.createObjectURL(photo);
  setPreview(url);
  return () => URL.revokeObjectURL(url);
 }, [photo]);

 const filteredItems = useMemo(
  () =>
   items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
   ),
  [items, search],
 );

 function resetForm() {
  setName("");
  setPhoto(null);
  setPreview("");
  setEditingId(null);
  setError("");
  if (fileRef.current) fileRef.current.value = "";
 }

 function startEdit(item: ExtracurricularType) {
  setEditingId(item.id);
  setName(item.name);
  setPhoto(null);
  setPreview(item.photoUrl || "");
  setError("");
  setSuccess("");

  if (fileRef.current) fileRef.current.value = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
 }

 function handleFile(file?: File) {
  if (!file) return;

  setError("");
  setSuccess("");

  if (!["image/jpeg", "image/png"].includes(file.type)) {
   setPhoto(null);
   setPreview("");

   if (fileRef.current) {
    fileRef.current.value = "";
   }

   setError("Foto harus berformat JPG atau PNG.");
   return;
  }

  if (file.size > MAX_FILE_SIZE) {
   setPhoto(null);
   setPreview("");

   if (fileRef.current) {
    fileRef.current.value = "";
   }

   setError("Ukuran foto maksimal 5 MB.");
   return;
  }

  setPhoto(file);
 }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");
  setSuccess("");
  setNameError("");

  if (!name.trim()) {
   setNameError("Nama ekstrakurikuler wajib diisi.");
   return;
  }

  if (photo) {
   if (!["image/jpeg", "image/png"].includes(photo.type)) {
    setError("Foto harus berformat JPG atau PNG.");
    return;
   }

   if (photo.size > MAX_FILE_SIZE) {
    setError("Ukuran foto maksimal 5 MB.");
    return;
   }
  }

  try {
   setSaving(true);

   const wasEditing = editingId !== null;

   if (wasEditing) {
    await updateExtracurricular(editingId, name.trim(), photo);
   } else {
    await createExtracurricular(name.trim(), photo);
   }

   resetForm();
   await loadData();

   setSuccess(
    wasEditing
     ? "Data ekstrakurikuler berhasil diperbarui."
     : "Ekstrakurikuler berhasil ditambahkan.",
   );
  } catch (err) {
   setError(
    err instanceof Error ? err.message : "Gagal menyimpan ekstrakurikuler.",
   );
  } finally {
   setSaving(false);
  }
 }

 async function handleDelete(item: ExtracurricularType) {
  const confirmed = window.confirm(
   `Yakin ingin menghapus ekstrakurikuler "${item.name}"?`,
  );
  if (!confirmed) return;

  try {
   setError("");
   setSuccess("");

   await deleteExtracurricular(item.id);

   if (editingId === item.id) {
    resetForm();
   }

   await loadData();

   setSuccess(`Ekstrakurikuler "${item.name}" berhasil dihapus.`);
  } catch (err) {
   setError(
    err instanceof Error ? err.message : "Gagal menghapus ekstrakurikuler.",
   );
  }
 }

 return (
  <main className="min-w-0 space-y-6">
   <header>
    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
     Ekstrakurikuler
    </h1>
    <p className="mt-1 text-sm text-gray-500">
     Kelola data kegiatan ekstrakurikuler sekolah
    </p>
   </header>

   {error && (
    <div
     role="alert"
     className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
     <span>{error}</span>
     <button
      type="button"
      onClick={() => setError("")}
      aria-label="Tutup pesan"
     >
      <X size={18} />
     </button>
    </div>
   )}

   {success && (
    <div
     role="status"
     className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
    >
     <span>{success}</span>
     <button
      type="button"
      onClick={() => setSuccess("")}
      aria-label="Tutup pesan"
     >
      <X size={18} />
     </button>
    </div>
   )}

   <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
    <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
     <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="font-semibold text-gray-900">Daftar Ekstrakurikuler</h2>
      <label className="relative block w-full sm:max-w-xs">
       <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       />
       <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari nama ekstrakurikuler..."
        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </label>
     </div>

     <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
       <thead>
        <tr className="bg-[#F5EBDD] text-gray-800">
         <th className="border-b border-gray-300 px-3 py-4">No</th>
         <th className="border-b border-gray-300 px-3 py-4">Nama</th>
         <th className="border-b border-gray-300 px-3 py-4">Foto</th>
         <th className="border-b border-gray-300 px-3 py-4 text-center">
          Aksi
         </th>
        </tr>
       </thead>
       <tbody>
        {loading ? (
         <tr>
          <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
           Memuat data...
          </td>
         </tr>
        ) : filteredItems.length === 0 ? (
         <tr>
          <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
           Data ekstrakurikuler tidak ditemukan.
          </td>
         </tr>
        ) : (
         filteredItems.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-200 last:border-0">
           <td className="px-3 py-4">{index + 1}</td>
           <td className="px-3 py-4 font-medium text-gray-800">{item.name}</td>
           <td className="px-3 py-3">
            {item.photoUrl ? (
             <img
              src={item.photoUrl}
              alt={item.name}
              className="h-12 w-16 rounded-md object-cover"
             />
            ) : (
             <span className="text-xs text-gray-400">Belum ada</span>
            )}
           </td>
           <td className="px-3 py-4">
            <div className="flex items-center justify-center gap-2">
             <button
              type="button"
              title="Edit"
              onClick={() => startEdit(item)}
              className="rounded p-1.5 text-[#B46000] hover:bg-orange-50"
             >
              <Pencil size={17} />
             </button>
             <button
              type="button"
              title="Hapus"
              onClick={() => void handleDelete(item)}
              className="rounded p-1.5 text-red-600 hover:bg-red-50"
             >
              <Trash2 size={17} />
             </button>
             <button
              type="button"
              title="Kelola dokumentasi"
              onClick={() =>
               navigate(`/admin/extracurriculars/${item.id}/media`)
              }
              className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
             >
              <Images size={18} />
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

    <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
     <div className="mb-5 flex items-center justify-between gap-2">
      <h2 className="font-semibold text-gray-900">
       {editingId !== null ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
      </h2>
      {editingId !== null && (
       <button
        type="button"
        onClick={resetForm}
        className="text-xs font-medium text-gray-500 hover:text-gray-900"
       >
        Batal edit
       </button>
      )}
     </div>

     <form onSubmit={handleSubmit} className="space-y-4">
      <div>
       <label
        htmlFor="extra-name"
        className="mb-2 block text-sm font-medium text-gray-700"
       >
        Nama <span className="text-red-600">*</span>
       </label>

       <input
        id="extra-name"
        value={name}
        onChange={(e) => {
         setName(e.target.value);
         setNameError("");
        }}
        placeholder="Masukkan nama ekstrakurikuler"
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B46000]/15 ${
  nameError
    ? "border-red-500 focus:border-red-500"
    : "border-gray-300 focus:border-[#B46000]"
}`}
       />

       {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
      </div>

      <div>
       <label className="mb-2 block text-sm font-medium text-gray-700">
        Foto
       </label>
       <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm file:mr-3 file:border-0 file:bg-[#F5EBDD] file:px-3 file:py-3 file:font-medium file:text-[#8A4A00] hover:file:bg-orange-100"
       />
       <p className="mt-1 text-xs text-gray-500">
        JPG atau PNG, maksimal 5 MB. Kosongkan jika tidak ingin mengganti foto.
       </p>
      </div>

      <div>
       <p className="mb-2 text-sm font-medium text-gray-700">Preview Foto</p>
       <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {preview ? (
         <img
          src={preview}
          alt="Preview foto ekstrakurikuler"
          className="max-h-64 w-full object-contain"
         />
        ) : (
         <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageIcon size={42} strokeWidth={1.3} />
          <span className="text-xs">Preview foto</span>
         </div>
        )}
       </div>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
       <button
        type="button"
        onClick={resetForm}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
       >
        Batal
       </button>
       <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EF8700] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D97700] disabled:cursor-not-allowed disabled:opacity-60"
       >
        <Plus size={16} />
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
  </main>
 );
}
