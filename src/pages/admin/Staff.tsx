import { useEffect, useMemo, useRef, useState } from "react";
import {
 Search,
 Plus,
 Pencil,
 Trash2,
 X,
 Users,
 Upload,
 Image as ImageIcon,
 LoaderCircle,
 RefreshCw,
} from "lucide-react";
import {
 getStaff,
 createStaff,
 updateStaff,
 deleteStaff,
 type Staff,
 type StaffType,
} from "../../services/staff.service";

type StaffForm = {
 name: string;
 position: string;
 type: StaffType | "";
 classTaught: string;
 photoUrl: string;
 photoFile: File | null;
};

const emptyForm: StaffForm = {
 name: "",
 position: "",
 type: "",
 classTaught: "",
 photoUrl: "",
 photoFile: null,
};

function StaffPage() {
 const [staff, setStaff] = useState<Staff[]>([]);
 const [form, setForm] = useState<StaffForm>(emptyForm);
 const [search, setSearch] = useState("");
 const [editingId, setEditingId] = useState<number | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [deletingId, setDeletingId] = useState<number | null>(null);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [message, setMessage] = useState("");
 const [apiError, setApiError] = useState("");
 const fileInputRef = useRef<HTMLInputElement>(null);

 async function loadStaff() {
  try {
   setLoading(true);
   setApiError("");
   const response = await getStaff();
   setStaff(response.data);
  } catch (error) {
   setApiError(
    error instanceof Error ? error.message : "Gagal mengambil data staff.",
   );
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  void loadStaff();
 }, []);

 const filteredStaff = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return staff;

  return staff.filter((item) =>
   [
    item.name,
    item.position,
    item.type === "TEACHER" ? "guru" : "administrasi staff",
    item.classTaught ?? "",
   ].some((value) => value.toLowerCase().includes(keyword)),
  );
 }, [staff, search]);

 function handleChange(field: keyof StaffForm, value: string) {
  setForm((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: "" }));
  setMessage("");
 }

 function validate() {
  const nextErrors: Record<string, string> = {};

  if (!form.name.trim()) {
   nextErrors.name = "Nama wajib diisi.";
  }

  if (!form.position.trim()) {
   nextErrors.position = "Posisi wajib diisi.";
  }

  if (!form.type) {
   nextErrors.type = "Tipe wajib dipilih.";
  }

  if (!form.classTaught.trim()) {
   nextErrors.classTaught = "Kelas wajib diisi.";
  }

  setErrors(nextErrors);
  return Object.keys(nextErrors).length === 0;
 }

 function resetForm() {
  setForm(emptyForm);
  setErrors({});
  setEditingId(null);
  setMessage("");
  if (fileInputRef.current) {
   fileInputRef.current.value = "";
  }
 }

 function startEdit(item: Staff) {
  setEditingId(item.id);
  setForm({
   name: item.name,
   position: item.position,
   type: item.type,
   classTaught: item.classTaught ?? "",
   photoUrl: item.photoUrl ?? "",
   photoFile: null,
  });
  setErrors({});
  setMessage("");
  window.scrollTo({ top: 0, behavior: "smooth" });
 }

 function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
   setErrors((prev) => ({
    ...prev,
    photoUrl: "Foto harus berupa JPG, PNG, atau WEBP.",
   }));

   event.target.value = "";
   return;
  }

  if (file.size > 5 * 1024 * 1024) {
   setErrors((prev) => ({
    ...prev,
    photoUrl: "Ukuran foto maksimal 5 MB.",
   }));

   event.target.value = "";
   return;
  }

  setForm((prev) => ({
   ...prev,
   photoFile: file,
   photoUrl: URL.createObjectURL(file),
  }));

  setErrors((prev) => ({
   ...prev,
   photoUrl: "",
  }));

  setMessage("");
 }

 async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setMessage("");

  if (!validate()) return;

  try {
   setSaving(true);

   const payload = {
  name: form.name.trim(),
  position: form.position.trim(),
  type: form.type as StaffType,
  classTaught: form.classTaught.trim(),
  ...(form.photoFile ? { photo: form.photoFile } : {}),
};

   if (editingId !== null) {
    await updateStaff(editingId, payload);
    setMessage("Data staff berhasil diperbarui.");
   } else {
    await createStaff(payload);
    setMessage("Data staff berhasil ditambahkan.");
   }

   resetForm();
   await loadStaff();
  } catch (error) {
   setApiError(
    error instanceof Error ? error.message : "Gagal menyimpan data staff.",
   );
  } finally {
   setSaving(false);
  }
 }

 async function handleDelete(item: Staff) {
  const confirmed = window.confirm(`Yakin ingin menghapus data ${item.name}?`);

  if (!confirmed) return;

  try {
   setDeletingId(item.id);
   setApiError("");
   await deleteStaff(item.id);
   setStaff((prev) => prev.filter((person) => person.id !== item.id));

   if (editingId === item.id) resetForm();

   setMessage("Data staff berhasil dihapus.");
  } catch (error) {
   setApiError(
    error instanceof Error ? error.message : "Gagal menghapus data staff.",
   );
  } finally {
   setDeletingId(null);
  }
 }

 return (
  <main className="min-w-0 w-full space-y-6">
   <header>
    <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
    <p className="mt-1 text-sm text-gray-500">
     Kelola data guru dan tenaga administrasi sekolah.
    </p>
   </header>

   {message && (
    <div
     role="status"
     className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
     <span>{message}</span>
     <button
      type="button"
      onClick={() => setMessage("")}
      aria-label="Tutup pesan"
     >
      <X size={16} />
     </button>
    </div>
   )}

   {apiError && (
    <div
     role="alert"
     className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
     <span>{apiError}</span>
     <button
      type="button"
      onClick={() => setApiError("")}
      aria-label="Tutup pesan"
     >
      <X size={16} />
     </button>
    </div>
   )}

   <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
    {/* Daftar staff */}
    <section className="min-w-0 space-y-4">
     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
       <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       />
       <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari nama, posisi, tipe, kelas..."
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
       />
      </div>

      <button
       type="button"
       onClick={resetForm}
       className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B46000] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#944F00]"
      >
       <Plus size={17} />
       Tambah Staff
      </button>
     </div>

     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
       <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Users size={17} className="text-[#B46000]" />
        Daftar Staff
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
         {filteredStaff.length}
        </span>
       </div>

       <button
        type="button"
        onClick={() => void loadStaff()}
        disabled={loading}
        title="Muat ulang"
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#B46000] disabled:opacity-50"
       >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
       </button>
      </div>

      {loading ? (
       <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
        <LoaderCircle className="animate-spin" size={20} />
        Memuat data staff...
       </div>
      ) : filteredStaff.length === 0 ? (
       <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
        <Users size={30} className="mb-2 text-gray-300" />
        <p className="font-medium text-gray-700">
         {search ? "Data tidak ditemukan" : "Belum ada data staff"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
         {search
          ? "Coba gunakan kata kunci lain."
          : "Tambahkan data staff melalui form."}
        </p>
       </div>
      ) : (
       <>
        {/* Tabel desktop */}
        <div className="hidden overflow-x-auto md:block">
         <table className="w-full min-w-[650px] border-collapse text-left text-sm">
          <thead className="bg-[#F5EBDD] text-xs text-gray-800">
           <tr>
            <th className="px-4 py-4 font-semibold">No</th>
            <th className="px-4 py-4 font-semibold">Nama</th>
            <th className="px-4 py-4 font-semibold">Posisi</th>
            <th className="px-4 py-4 font-semibold">Tipe</th>
            <th className="px-4 py-4 font-semibold">Kelas</th>
            <th className="px-4 py-4 font-semibold">Foto</th>
            <th className="px-4 py-4 text-center font-semibold">Aksi</th>
           </tr>
          </thead>
          <tbody>
           {filteredStaff.map((item, index) => (
            <tr
             key={item.id}
             className={`border-t border-gray-200 transition hover:bg-orange-50/40 ${
              editingId === item.id ? "bg-orange-50" : ""
             }`}
            >
             <td className="px-4 py-4 text-gray-600">{index + 1}</td>
             <td className="max-w-40 px-4 py-4 font-medium text-gray-900">
              <span className="block truncate">{item.name}</span>
             </td>
             <td className="max-w-36 px-4 py-4 text-gray-600">
              <span className="block truncate">{item.position}</span>
             </td>
             <td className="px-4 py-4 text-gray-600">
              {item.type === "TEACHER" ? "Guru" : "Administrasi"}
             </td>
             <td className="px-4 py-4 text-gray-600">
              {item.classTaught || "-"}
             </td>
             <td className="px-4 py-4">
              {item.photoUrl ? (
               <img
                src={item.photoUrl}
                alt={`Foto ${item.name}`}
                className="h-9 w-9 rounded-lg object-cover"
               />
              ) : (
               <span className="text-xs text-gray-400">-</span>
              )}
             </td>
             <td className="px-4 py-4">
              <div className="flex items-center justify-center gap-1">
               <button
                type="button"
                onClick={() => startEdit(item)}
                title="Edit staff"
                aria-label={`Edit ${item.name}`}
                className="rounded-md p-2 text-[#B46000] transition hover:bg-orange-100"
               >
                <Pencil size={16} />
               </button>
               <button
                type="button"
                onClick={() => void handleDelete(item)}
                disabled={deletingId === item.id}
                title="Hapus staff"
                aria-label={`Hapus ${item.name}`}
                className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
               >
                {deletingId === item.id ? (
                 <LoaderCircle size={16} className="animate-spin" />
                ) : (
                 <Trash2 size={16} />
                )}
               </button>
              </div>
             </td>
            </tr>
           ))}
          </tbody>
         </table>
        </div>

        {/* Kartu mobile */}
        <div className="divide-y divide-gray-200 md:hidden">
         {filteredStaff.map((item, index) => (
          <article key={item.id} className="p-4">
           <div className="flex min-w-0 items-start gap-3">
            {item.photoUrl ? (
             <img
              src={item.photoUrl}
              alt={`Foto ${item.name}`}
              className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover"
             />
            ) : (
             <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B46000]">
              <Users size={22} />
             </div>
            )}

            <div className="min-w-0 flex-1">
             <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
               <p className="truncate font-semibold text-gray-900">
                {item.name}
               </p>
               <p className="mt-0.5 text-sm text-gray-600">{item.position}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-400">
               #{index + 1}
              </span>
             </div>

             <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[#944F00]">
               {item.type === "TEACHER" ? "Guru" : "Administrasi"}
              </span>
              {item.classTaught && (
               <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                Kelas {item.classTaught}
               </span>
              )}
             </div>
            </div>
           </div>

           <div className="mt-3 flex justify-end gap-2">
            <button
             type="button"
             onClick={() => startEdit(item)}
             className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
             <Pencil size={14} />
             Edit
            </button>
            <button
             type="button"
             onClick={() => void handleDelete(item)}
             disabled={deletingId === item.id}
             className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
             {deletingId === item.id ? (
              <LoaderCircle size={14} className="animate-spin" />
             ) : (
              <Trash2 size={14} />
             )}
             Hapus
            </button>
           </div>
          </article>
         ))}
        </div>
       </>
      )}
     </div>
    </section>

    {/* Form tambah/edit */}
    <aside className="min-w-0">
     <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 xl:sticky xl:top-5"
     >
      <div className="mb-5 flex items-center justify-between gap-2">
       <h2 className="font-bold text-gray-900">
        {editingId !== null ? "Edit Staff" : "Tambah Staff"}
       </h2>
       {editingId !== null && (
        <button
         type="button"
         onClick={resetForm}
         className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
         title="Batal edit"
        >
         <X size={18} />
        </button>
       )}
      </div>

      <div className="space-y-4">
       <div>
        <label
         htmlFor="staff-name"
         className="mb-1.5 block text-sm font-medium text-gray-700"
        >
         Nama <span className="text-red-500">*</span>
        </label>
        <input
         id="staff-name"
         value={form.name}
         onChange={(e) => handleChange("name", e.target.value)}
         placeholder="Masukkan nama staff"
         aria-invalid={Boolean(errors.name)}
         className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 ${
          errors.name
           ? "border-red-500 focus:ring-red-100"
           : "border-gray-300 focus:border-[#B46000] focus:ring-orange-100"
         }`}
        />
        {errors.name && (
         <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
       </div>

       <div>
        <label
         htmlFor="staff-position"
         className="mb-1.5 block text-sm font-medium text-gray-700"
        >
         Posisi <span className="text-red-500">*</span>
        </label>
        <input
         id="staff-position"
         value={form.position}
         onChange={(e) => handleChange("position", e.target.value)}
         placeholder="Contoh: Guru Matematika"
         aria-invalid={Boolean(errors.position)}
         className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 ${
          errors.position
           ? "border-red-500 focus:ring-red-100"
           : "border-gray-300 focus:border-[#B46000] focus:ring-orange-100"
         }`}
        />
        {errors.position && (
         <p className="mt-1 text-xs text-red-600">{errors.position}</p>
        )}
       </div>

       <div>
        <label
         htmlFor="staff-type"
         className="mb-1.5 block text-sm font-medium text-gray-700"
        >
         Tipe <span className="text-red-500">*</span>
        </label>
        <select
         id="staff-type"
         value={form.type}
         onChange={(e) => handleChange("type", e.target.value)}
         aria-invalid={Boolean(errors.type)}
         className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 ${
          errors.type
           ? "border-red-500 focus:ring-red-100"
           : "border-gray-300 focus:border-[#B46000] focus:ring-orange-100"
         }`}
        >
         <option value="">Pilih tipe staff</option>
         <option value="TEACHER">Guru</option>
         <option value="ADMINISTRATIVE">Tenaga Administrasi</option>
        </select>
        {errors.type && (
         <p className="mt-1 text-xs text-red-600">{errors.type}</p>
        )}
       </div>

       <div>
        <label
         htmlFor="staff-class"
         className="mb-1.5 block text-sm font-medium text-gray-700"
        >
         Kelas <span className="text-red-500">*</span>
        </label>
        <input
         id="staff-class"
         value={form.classTaught}
         onChange={(e) => handleChange("classTaught", e.target.value)}
         placeholder="Contoh: 6A atau -"
         aria-invalid={Boolean(errors.classTaught)}
         className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 ${
          errors.classTaught
           ? "border-red-500 focus:ring-red-100"
           : "border-gray-300 focus:border-[#B46000] focus:ring-orange-100"
         }`}
        />
        {errors.classTaught && (
         <p className="mt-1 text-xs text-red-600">{errors.classTaught}</p>
        )}
       </div>

       <div>
        <label
         htmlFor="staff-photo"
         className="mb-1.5 block text-sm font-medium text-gray-700"
        >
         Foto{" "}
         <span className="text-xs font-normal text-gray-400">(opsional)</span>
        </label>

        <input
         ref={fileInputRef}
         id="staff-photo"
         type="file"
         accept="image/png,image/jpeg,image/webp"
         onChange={(e) => void handlePhotoChange(e)}
         className="hidden"
        />

        <div className="rounded-lg border border-dashed border-gray-300 p-3">
         {form.photoUrl ? (
          <div className="flex items-center gap-3">
           <img
            src={form.photoUrl}
            alt="Pratinjau foto staff"
            className="h-16 w-16 rounded-lg object-cover"
           />
           <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-600">Pratinjau foto</p>
            <button
             type="button"
             onClick={() => {
              handleChange("photoUrl", "");
              if (fileInputRef.current) {
               fileInputRef.current.value = "";
              }
             }}
             className="mt-1 text-xs font-medium text-red-600 hover:underline"
            >
             Hapus foto
            </button>
           </div>
          </div>
         ) : (
          <div className="flex flex-col items-center justify-center py-3 text-center">
           <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            <ImageIcon size={22} />
           </div>
           <p className="text-xs text-gray-500">
            JPG, PNG, atau WEBP (maks. 5 MB)
           </p>
          </div>
         )}

         <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
         >
          <Upload size={15} />
          Pilih Foto
         </button>
        </div>
        {errors.photoUrl && (
         <p className="mt-1 text-xs text-red-600">{errors.photoUrl}</p>
        )}
       </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
       <button
        type="button"
        onClick={resetForm}
        disabled={saving}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
       >
        Batal
       </button>
       <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F28C00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-60"
       >
        {saving && <LoaderCircle size={16} className="animate-spin" />}
        {saving
         ? "Menyimpan..."
         : editingId !== null
           ? "Simpan Perubahan"
           : "Simpan"}
       </button>
      </div>
     </form>
    </aside>
   </div>
  </main>
 );
}

export default StaffPage;
