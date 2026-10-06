import { useEffect, useRef, useState } from "react";
import {
 ArrowLeft,
 CloudUpload,
 Image as ImageIcon,
 Trash2,
 Video,
 X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
 getExtracurriculars,
 type Extracurricular,
} from "../../services/extracurricular.service";

import {
 deleteExtracurricularMedia,
 getExtracurricularMedia,
 uploadExtracurricularMedia,
 type ExtracurricularMedia as MediaType,
} from "../../services/extracurricularMedia.service";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export default function ExtracurricularMedia() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const fileRef = useRef<HTMLInputElement>(null);

 const [extra, setExtra] = useState<Extracurricular | null>(null);
 const [media, setMedia] = useState<MediaType[]>([]);
 const [files, setFiles] = useState<File[]>([]);

 const [loading, setLoading] = useState(true);
 const [uploading, setUploading] = useState(false);

 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [deletingId, setDeletingId] = useState<number | null>(null);

 const extraId = Number(id);

 async function loadData() {
  if (!Number.isInteger(extraId) || extraId <= 0) {
   setError("ID ekstrakurikuler tidak valid.");
   setLoading(false);
   return;
  }

  try {
   setLoading(true);
   setError("");

   const [extraResponse, mediaResponse] = await Promise.all([
    getExtracurriculars(),
    getExtracurricularMedia(extraId),
   ]);

   const found = extraResponse.data.find((item) => item.id === extraId);

   setExtra(found || null);
   setMedia(mediaResponse.data);
  } catch (err) {
   setError(
    err instanceof Error
     ? err.message
     : "Gagal mengambil dokumentasi ekstrakurikuler.",
   );
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  void loadData();
 }, [id]);

 function handleFiles(selected: FileList | null) {
  if (!selected) return;

  const accepted: File[] = [];

  for (const file of Array.from(selected)) {
   const isImage = file.type.startsWith("image/");
   const isVideo = file.type === "video/mp4";

   if (!isImage && !isVideo) {
    setError(`"${file.name}" harus berupa gambar atau video MP4.`);
    continue;
   }

   if (isImage && file.size > MAX_IMAGE_SIZE) {
    setError(`Foto "${file.name}" melebihi batas 5 MB.`);
    continue;
   }

   if (isVideo && file.size > MAX_VIDEO_SIZE) {
    setError(`Video "${file.name}" melebihi batas 50 MB.`);
    continue;
   }

   accepted.push(file);
  }

  if (accepted.length > 0) {
   setError("");
   setSuccess("");
   setFiles((current) => [...current, ...accepted]);
  }

  if (fileRef.current) {
   fileRef.current.value = "";
  }
 }

 function removeFile(index: number) {
  setFiles((current) => current.filter((_, i) => i !== index));
 }

 async function handleDeleteMedia(mediaId: number) {
  const confirmed = window.confirm(
   "Apakah kamu yakin ingin menghapus dokumentasi ini?",
  );

  if (!confirmed) return;

  try {
   setDeletingId(mediaId);
   setError("");
   setSuccess("");

   await deleteExtracurricularMedia(extraId, mediaId);

   setMedia((current) => current.filter((item) => item.id !== mediaId));

   setSuccess("Dokumentasi berhasil dihapus.");
  } catch (err) {
   setError(
    err instanceof Error ? err.message : "Gagal menghapus dokumentasi.",
   );
  } finally {
   setDeletingId(null);
  }
 }

 async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (!files.length) {
   setError("Pilih minimal satu foto atau video.");
   return;
  }

  if (!extra) {
   setError("Data ekstrakurikuler tidak ditemukan.");
   return;
  }

  try {
   setUploading(true);

   for (const file of files) {
    await uploadExtracurricularMedia(extraId, file);
   }

   setFiles([]);

   if (fileRef.current) {
    fileRef.current.value = "";
   }

   setSuccess("Dokumentasi berhasil diunggah.");

   await loadData();
  } catch (err) {
   setError(
    err instanceof Error ? err.message : "Gagal mengunggah dokumentasi.",
   );
  } finally {
   setUploading(false);
  }
 }

 return (
  <main className="min-w-0">
   {/* Header */}
   <header className="mb-5 flex items-start justify-between gap-4">
    <div className="min-w-0">
     <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
      Pengelolaan Dokumentasi Ekstrakurikuler
     </h1>

     <p className="mt-1 text-sm text-gray-500">
      Kelola dan atur dokumentasi kegiatan ekstrakurikuler di sekolah
     </p>
    </div>

    <button
     type="button"
     onClick={() => navigate("/admin/ekstrakurikuler")}
     className="inline-flex shrink-0 items-center gap-2 text-sm text-gray-500 transition hover:text-[#B46000]"
    >
     <ArrowLeft size={21} className="text-[#EF8700]" />
     <span className="hidden sm:inline">Back</span>
    </button>
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

   {/* Container utama */}
   <section className="overflow-hidden border border-gray-400 bg-white">
    {/* Judul ekstrakurikuler */}
    <div className="border-b border-gray-400 px-4 py-3 sm:px-5">
     <h2 className="text-lg font-bold text-gray-900">
      {loading ? "Memuat..." : extra?.name || "Ekstrakurikuler"}
     </h2>

     <p className="text-sm font-medium text-gray-500">
      Dokumentasi kegiatan ekstrakurikuler{" "}
      {extra?.name ? extra.name.toLowerCase() : ""}
     </p>
    </div>

    {/* Dokumentasi */}
    <div className="px-4 py-5 sm:px-5">
     <h3 className="mb-4 text-base font-bold text-gray-900">Dokumentasi</h3>

     {loading ? (
      <div className="flex min-h-40 items-center justify-center">
       <p className="text-sm text-gray-500">Memuat dokumentasi...</p>
      </div>
     ) : media.length === 0 ? (
      <div className="flex min-h-40 items-center justify-center rounded border border-gray-200 bg-gray-50">
       <p className="text-sm text-gray-500">
        Belum ada dokumentasi untuk ekstrakurikuler ini.
       </p>
      </div>
     ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
       {media.map((item) => (
  <div
    key={item.id}
    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
  >
    {item.type === "VIDEO" ? (
      <video
        src={item.url}
        controls
        className="aspect-video h-full w-full object-cover"
      />
    ) : (
      <img
        src={item.url}
        alt={`Dokumentasi ${extra?.name || "ekstrakurikuler"}`}
        className="aspect-video h-full w-full object-cover"
        loading="lazy"
      />
    )}

    <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2.5">
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {item.type === "VIDEO" ? (
          <Video size={15} />
        ) : (
          <ImageIcon size={15} />
        )}

        <span>
          {item.type === "VIDEO" ? "Video" : "Foto"}
        </span>
      </div>

      <button
        type="button"
        title="Hapus dokumentasi"
        disabled={deletingId === item.id}
        onClick={() => void handleDeleteMedia(item.id)}
        className="rounded p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={17} />
      </button>
    </div>
  </div>
))}
      </div>
     )}
    </div>

    {/* Tambah Dokumentasi */}
    <div className="border-t border-gray-400 px-4 py-5 sm:px-5">
     <h3 className="mb-4 text-base font-bold text-gray-900">
      Tambah Dokumentasi
     </h3>

     <form onSubmit={handleUpload}>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
       Foto/Video
      </label>

      {/* Upload area */}
      <button
       type="button"
       onClick={() => fileRef.current?.click()}
       className="flex min-h-[155px] w-full flex-col items-center justify-center rounded border border-gray-400 bg-white px-4 py-6 text-center transition hover:border-[#EF8700] hover:bg-orange-50/20"
      >
       <CloudUpload
        size={42}
        strokeWidth={1.5}
        className="mb-2 text-[#EF8700]"
       />

       <span className="text-sm font-semibold text-gray-800">
        Pilih foto atau video
       </span>

       <span className="mt-1 text-xs text-gray-400">Format PNG, JPG, MP4</span>
      </button>

      <input
       ref={fileRef}
       type="file"
       accept="image/png,image/jpeg,video/mp4"
       multiple
       onChange={(event) => handleFiles(event.target.files)}
       className="hidden"
      />

      {/* File yang dipilih */}
      {files.length > 0 && (
       <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-gray-800">
         File yang akan diunggah ({files.length})
        </p>

        {files.map((file, index) => {
         const isVideo = file.type === "video/mp4";

         return (
          <div
           key={`${file.name}-${index}`}
           className="flex items-center justify-between gap-3 border border-gray-300 px-3 py-2"
          >
           <div className="flex min-w-0 items-center gap-2">
            {isVideo ? (
             <Video size={18} className="shrink-0 text-gray-500" />
            ) : (
             <ImageIcon size={18} className="shrink-0 text-gray-500" />
            )}

            <div className="min-w-0">
             <p className="truncate text-sm text-gray-800">{file.name}</p>

             <p className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
             </p>
            </div>
           </div>

           <button
            type="button"
            disabled={uploading}
            onClick={() => removeFile(index)}
            className="shrink-0 text-red-600 transition hover:text-red-800 disabled:opacity-50"
            aria-label={`Hapus ${file.name}`}
           >
            <X size={18} />
           </button>
          </div>
         );
        })}
       </div>
      )}

      {/* Tombol */}
      <div className="mt-6 flex justify-end gap-2">
       <button
        type="button"
        onClick={() => navigate("/admin/ekstrakurikuler")}
        disabled={uploading}
        className="rounded border border-gray-500 bg-white px-6 py-2 text-xs font-medium text-black hover:bg-gray-100 disabled:opacity-50"
       >
        Batal
       </button>

       <button
        type="submit"
        disabled={uploading || loading || !extra || files.length === 0}
        className="inline-flex items-center justify-center gap-2 rounded bg-[#F5820B] px-7 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
       >
        {uploading ? "Mengunggah..." : "Simpan"}
       </button>
      </div>
     </form>
    </div>
   </section>
  </main>
 );
}
