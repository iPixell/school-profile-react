import { useEffect, useMemo, useState } from "react";
import {
 Search,
 Pencil,
 Trash2,
 ImagePlus,
 X,
 LoaderCircle,
} from "lucide-react";
import {
 getAchievements,
 createAchievement,
 updateAchievement,
 deleteAchievement,
} from "../../services/achievement.service";
import type { Achievement as AchievementType } from "../../types/achievement";

type FormDataState = {
 competition: string;
 studentName: string;
 rank: string;
 level: string;
 year: string;
};

const initialForm: FormDataState = {
 competition: "",
 studentName: "",
 rank: "",
 level: "",
 year: "",
};

type FormErrors = Partial<Record<keyof FormDataState | "photo", string>>;

export default function Achievement() {
 const [achievements, setAchievements] = useState<AchievementType[]>([]);
 const [search, setSearch] = useState("");
 const [form, setForm] = useState<FormDataState>(initialForm);
 const [errors, setErrors] = useState<FormErrors>({});
 const [photo, setPhoto] = useState<File | null>(null);
 const [photoPreview, setPhotoPreview] = useState("");
 const [editingId, setEditingId] = useState<number | string | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [deletingId, setDeletingId] = useState<number | string | null>(null);
 const [pageError, setPageError] = useState("");
 const [success, setSuccess] = useState("");

 async function loadAchievements() {
  try {
   setLoading(true);
   setPageError("");
   const data = await getAchievements();
   setAchievements(data);
  } catch (error) {
   setPageError(
    error instanceof Error ? error.message : "Gagal mengambil data prestasi.",
   );
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  void loadAchievements();
 }, []);

 const filteredAchievements = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  return achievements.filter((item) =>
   [
    item.competition,
    item.studentName,
    item.rank,
    item.level,
    String(item.year),
   ].some((value) => value?.toLowerCase().includes(keyword)),
  );
 }, [achievements, search]);

 function handleFieldChange(field: keyof FormDataState, value: string) {
  setForm((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: "" }));
  setPageError("");
  setSuccess("");
 }

 function handlePhotoChange(file: File | null) {
  if (photoPreview.startsWith("blob:")) {
   URL.revokeObjectURL(photoPreview);
  }

  setPhoto(null);
  setPhotoPreview("");
  setErrors((prev) => ({
   ...prev,
   photo: "",
  }));

  if (!file) {
   return;
  }

  if (!["image/jpeg", "image/png"].includes(file.type)) {
   setErrors((prev) => ({
    ...prev,
    photo: "Foto harus berformat JPG atau PNG.",
   }));

   return;
  }

  if (file.size > 5 * 1024 * 1024) {
   setErrors((prev) => ({
    ...prev,
    photo: "Ukuran foto maksimal 5 MB.",
   }));

   return;
  }

  setPhoto(file);
  setPhotoPreview(URL.createObjectURL(file));
 }

 function validate(): boolean {
  const nextErrors: FormErrors = {};

  if (!form.competition.trim()) {
   nextErrors.competition = "Kompetisi wajib diisi.";
  }

  if (!form.studentName.trim()) {
   nextErrors.studentName = "Nama siswa wajib diisi.";
  }

  if (!form.rank.trim()) {
   nextErrors.rank = "Rank wajib diisi.";
  }

  if (!form.level.trim()) {
   nextErrors.level = "Level wajib diisi.";
  }

  if (!form.year.trim()) {
   nextErrors.year = "Tahun wajib diisi.";
  }

  if (photo) {
   if (!["image/jpeg", "image/png"].includes(photo.type)) {
    nextErrors.photo = "Foto harus berformat JPG atau PNG.";
   } else if (photo.size > 5 * 1024 * 1024) {
    nextErrors.photo = "Ukuran foto maksimal 5 MB.";
   }
  }

  setErrors(nextErrors);
  return Object.keys(nextErrors).length === 0;
 }

 function resetForm() {
  setForm(initialForm);
  setErrors({});
  setPhoto(null);

  if (photoPreview.startsWith("blob:")) {
   URL.revokeObjectURL(photoPreview);
  }

  setPhotoPreview("");
  setEditingId(null);
 }

 function startEdit(item: AchievementType) {
  setEditingId(item.id);
  setForm({
   competition: item.competition,
   studentName: item.studentName,
   rank: item.rank,
   level: item.level,
   year: String(item.year),
  });
  setPhoto(null);
  setPhotoPreview(item.photoUrl || "");
  setErrors({});
  setPageError("");
  setSuccess("");

  document
   .getElementById("achievement-form")
   ?.scrollIntoView({ behavior: "smooth", block: "start" });
 }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setSuccess("");
  setPageError("");

  if (!validate()) return;

  const payload = new FormData();
  payload.append("competition", form.competition.trim());
  payload.append("studentName", form.studentName.trim());
  payload.append("rank", form.rank.trim());
  payload.append("level", form.level.trim());
  payload.append("year", String(Number(form.year)));

  if (photo) {
   payload.append("photo", photo);
  }

  try {
   setSaving(true);

   if (editingId !== null) {
    await updateAchievement(editingId, payload);
    setSuccess("Data prestasi berhasil diperbarui.");
   } else {
    await createAchievement(payload);
    setSuccess("Data prestasi berhasil ditambahkan.");
   }

   resetForm();
   await loadAchievements();
  } catch (error) {
   setPageError(
    error instanceof Error ? error.message : "Gagal menyimpan data prestasi.",
   );
  } finally {
   setSaving(false);
  }
 }

 async function handleDelete(id: number | string) {
  const confirmed = window.confirm("Yakin ingin menghapus data prestasi ini?");

  if (!confirmed) return;

  try {
   setDeletingId(id);
   setPageError("");
   setSuccess("");
   await deleteAchievement(id);
   setSuccess("Data prestasi berhasil dihapus.");
   await loadAchievements();
  } catch (error) {
   setPageError(
    error instanceof Error ? error.message : "Gagal menghapus data prestasi.",
   );
  } finally {
   setDeletingId(null);
  }
 }

 const inputClass = (field: keyof FormDataState) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
   errors[field]
    ? "border-red-500 focus:ring-red-100"
    : "border-gray-300 focus:border-[#B46000] focus:ring-orange-100"
  }`;

 function renderField(
  field: keyof FormDataState,
  label: string,
  placeholder: string,
  type = "text",
 ) {
  return (
   <div>
    <label
     htmlFor={field}
     className="mb-1.5 block text-sm font-medium text-gray-700"
    >
     {label} <span className="text-red-500">*</span>
    </label>
    <input
     id={field}
     type={type}
     value={form[field]}
     onChange={(e) => handleFieldChange(field, e.target.value)}
     placeholder={placeholder}
     className={inputClass(field)}
     min={type === "number" ? 1900 : undefined}
     max={type === "number" ? 9999 : undefined}
    />
    {errors[field] && (
     <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    )}
   </div>
  );
 }

 return (
  <main className="min-w-0 w-full space-y-6 p-4 sm:p-6 lg:p-8">
   <header>
    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Prestasi</h1>
    <p className="mt-1 text-sm text-gray-500">
     Kelola data prestasi siswa sekolah
    </p>
   </header>

   {pageError && (
    <div
     role="alert"
     className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
     <span>{pageError}</span>
     <button
      type="button"
      onClick={() => setPageError("")}
      aria-label="Tutup pesan"
     >
      <X size={16} />
     </button>
    </div>
   )}

   {success && (
    <div
     role="status"
     className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
    >
     {success}
    </div>
   )}

   <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
    {/* Daftar prestasi */}
    <section className="min-w-0">
     <div className="relative mb-4 w-full sm:max-w-sm">
      <Search
       size={18}
       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input
       type="search"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       placeholder="Cari nama kompetisi siswa..."
       className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-[#B46000] focus:ring-2 focus:ring-orange-100"
      />
     </div>

     {/* Tabel desktop */}
     <div className="hidden overflow-x-auto rounded-lg border border-gray-300 md:block">
      <table className="w-full min-w-[650px] border-collapse text-left text-xs lg:text-sm">
       <thead className="bg-[#F4EBDD]">
        <tr className="border-b border-gray-300">
         {[
          "No",
          "Kompetisi",
          "Nama Siswa",
          "Rank",
          "Level",
          "Tahun",
          "Foto",
          "Aksi",
         ].map((heading) => (
          <th
           key={heading}
           className="whitespace-nowrap px-3 py-4 font-semibold text-gray-800"
          >
           {heading}
          </th>
         ))}
        </tr>
       </thead>
       <tbody>
        {loading ? (
         <tr>
          <td colSpan={8} className="py-12 text-center text-gray-500">
           <LoaderCircle className="mx-auto mb-2 animate-spin" />
           Memuat data...
          </td>
         </tr>
        ) : filteredAchievements.length === 0 ? (
         <tr>
          <td colSpan={8} className="py-12 text-center text-gray-500">
           Data prestasi tidak ditemukan.
          </td>
         </tr>
        ) : (
         filteredAchievements.map((item, index) => (
          <tr
           key={item.id}
           className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
          >
           <td className="px-3 py-4">{index + 1}</td>
           <td className="max-w-[150px] px-3 py-4">
            <span className="line-clamp-2">{item.competition}</span>
           </td>
           <td className="px-3 py-4">{item.studentName}</td>
           <td className="px-3 py-4">{item.rank}</td>
           <td className="px-3 py-4">{item.level}</td>
           <td className="px-3 py-4">{item.year}</td>
           <td className="px-3 py-4">
            {item.photoUrl ? (
             <a
              href={item.photoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#B46000] underline"
             >
              Lihat
             </a>
            ) : (
             <span className="text-gray-400">-</span>
            )}
           </td>
           <td className="px-3 py-4">
            <div className="flex items-center gap-2">
             <button
              type="button"
              onClick={() => startEdit(item)}
              title="Edit"
              className="text-[#D97706] hover:text-orange-800"
             >
              <Pencil size={17} />
             </button>
             <button
              type="button"
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              title="Hapus"
              className="text-[#D97706] hover:text-red-700 disabled:opacity-50"
             >
              {deletingId === item.id ? (
               <LoaderCircle size={17} className="animate-spin" />
              ) : (
               <Trash2 size={17} />
              )}
             </button>
            </div>
           </td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     {/* Kartu mobile */}
     <div className="space-y-3 md:hidden">
      {loading ? (
       <div className="rounded-lg border p-8 text-center text-sm text-gray-500">
        <LoaderCircle className="mx-auto mb-2 animate-spin" />
        Memuat data...
       </div>
      ) : filteredAchievements.length === 0 ? (
       <div className="rounded-lg border p-8 text-center text-sm text-gray-500">
        Data prestasi tidak ditemukan.
       </div>
      ) : (
       filteredAchievements.map((item, index) => (
        <article
         key={item.id}
         className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
         <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
           <p className="text-xs text-gray-400">Prestasi #{index + 1}</p>
           <h2 className="mt-1 break-words font-semibold text-gray-900">
            {item.competition}
           </h2>
           <p className="mt-1 text-sm text-gray-600">{item.studentName}</p>
          </div>
          {item.photoUrl && (
           <img
            src={item.photoUrl}
            alt={`Foto prestasi ${item.competition}`}
            className="h-14 w-14 shrink-0 rounded-lg object-cover"
           />
          )}
         </div>

         <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-sm">
          <div>
           <p className="text-xs text-gray-400">Rank</p>
           <p className="mt-1 font-medium">{item.rank}</p>
          </div>
          <div>
           <p className="text-xs text-gray-400">Level</p>
           <p className="mt-1 font-medium">{item.level}</p>
          </div>
          <div>
           <p className="text-xs text-gray-400">Tahun</p>
           <p className="mt-1 font-medium">{item.year}</p>
          </div>
         </div>

         <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
          <button
           type="button"
           onClick={() => startEdit(item)}
           className="flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm text-[#B46000]"
          >
           <Pencil size={15} />
           Edit
          </button>
          <button
           type="button"
           onClick={() => handleDelete(item.id)}
           disabled={deletingId === item.id}
           className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50"
          >
           <Trash2 size={15} />
           Hapus
          </button>
         </div>
        </article>
       ))
      )}
     </div>
    </section>

    {/* Form */}
    <section
     id="achievement-form"
     className="h-fit min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 xl:border-0 xl:p-0 xl:shadow-none"
    >
     <div className="mb-5 flex items-center justify-between gap-2">
      <h2 className="font-semibold text-gray-900">
       {editingId !== null ? "Edit Prestasi" : "Tambah Prestasi"}
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

     <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {renderField("competition", "Kompetisi", "Masukkan nama kompetisi")}
      {renderField("studentName", "Nama Siswa", "Masukkan nama siswa")}
      {renderField("rank", "Rank", "Contoh: Juara 1")}
      {renderField("level", "Level", "Contoh: Nasional")}
      <div>
       <label
        htmlFor="year"
        className="mb-1.5 block text-sm font-medium text-gray-700"
       >
        Tahun <span className="text-red-500">*</span>
       </label>

       <input
        id="year"
        type="date"
        value={form.year ? `${form.year}-01-01` : ""}
        onChange={(e) => {
         const value = e.target.value;

         handleFieldChange("year", value ? value.slice(0, 4) : "");
        }}
        className={inputClass("year")}
       />

       {errors.year && (
        <p className="mt-1 text-xs text-red-500">{errors.year}</p>
       )}
      </div>

      <div>
       <label
        htmlFor="photo"
        className="mb-1.5 block text-sm font-medium text-gray-700"
       >
        Foto{" "}
        <span className="text-xs font-normal text-gray-400">(Opsional)</span>
       </label>

       <label
        htmlFor="photo"
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-center transition ${errors.photo ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-[#B46000] hover:bg-orange-50"}`}
       >
        {photoPreview ? (
         <img
          src={photoPreview}
          alt="Pratinjau foto prestasi"
          className="h-20 max-w-full rounded-lg object-contain"
         />
        ) : (
         <ImagePlus size={28} className="text-gray-400" />
        )}
        <span className="text-xs text-gray-500">
         {photo ? photo.name : "Klik untuk memilih foto"}
        </span>
        <span className="text-[11px] text-gray-400">Format JPG atau PNG</span>
       </label>
       <input
        id="photo"
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
        className="sr-only"
       />

       {errors.photo && (
        <p className="mt-1 text-xs text-red-500">{errors.photo}</p>
       )}

       {(photo || (editingId !== null && photoPreview)) && (
        <button
         type="button"
         onClick={() => {
          handlePhotoChange(null);
          if (editingId !== null) {
           const current = achievements.find((item) => item.id === editingId);
           setPhotoPreview(current?.photoUrl || "");
          }
         }}
         className="mt-2 text-xs text-red-500 hover:underline"
        >
         Hapus pilihan foto
        </button>
       )}
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
       <button
        type="button"
        onClick={resetForm}
        disabled={saving}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
       >
        Batal
       </button>
       <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#EF8700] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-60"
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
    </section>
   </div>
  </main>
 );
}
