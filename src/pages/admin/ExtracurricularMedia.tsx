import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CloudUpload,
  Image as ImageIcon,
  Trash2,
  Video,
  X,
  AlertTriangle,
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
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);

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

      const found = extraResponse.data.find(
        (item) => item.id === extraId,
      );

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
    const rejected: string[] = [];

    for (const file of Array.from(selected)) {
      const isImage =
        file.type === "image/png" ||
        file.type === "image/jpeg";

      const isVideo = file.type === "video/mp4";

      if (!isImage && !isVideo) {
        rejected.push(
          `"${file.name}" harus berupa gambar PNG/JPG atau video MP4.`,
        );
        continue;
      }

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        rejected.push(`Foto "${file.name}" melebihi batas 5 MB.`);
        continue;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        rejected.push(`Video "${file.name}" melebihi batas 50 MB.`);
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length > 0) {
      setFiles((current) => [...current, ...accepted]);
      setSuccess("");
    }

    setError(rejected.join(" "));

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function handleDeleteMedia() {
    if (!selectedMedia) return;

    const mediaId = selectedMedia.id;

    try {
      setDeletingId(mediaId);
      setError("");
      setSuccess("");

      await deleteExtracurricularMedia(extraId, mediaId);

      setMedia((current) =>
        current.filter((item) => item.id !== mediaId),
      );

      setSelectedMedia(null);
      setSuccess("Dokumentasi berhasil dihapus.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus dokumentasi.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (files.length === 0) {
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
        err instanceof Error
          ? err.message
          : "Gagal mengunggah dokumentasi.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-w-0">
      {/* HEADER */}
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Pengelolaan Dokumentasi Ekstrakurikuler
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola dan atur dokumentasi kegiatan ekstrakurikuler di sekolah.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/ekstrakurikuler")}
          className="inline-flex shrink-0 items-center gap-2 text-sm text-gray-500 transition hover:text-[#B46000]"
        >
          <ArrowLeft size={21} className="text-[#EF8700]" />
          <span className="hidden sm:inline">Kembali</span>
        </button>
      </header>

      {/* PESAN ERROR */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Tutup pesan error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* PESAN BERHASIL */}
      {success && (
        <div
          role="status"
          className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Tutup pesan sukses"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* CONTAINER UTAMA */}
      <section className="overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="border-b border-gray-300 px-4 py-3 sm:px-5">
          <h2 className="text-lg font-bold text-gray-900">
            {loading ? "Memuat..." : extra?.name || "Ekstrakurikuler"}
          </h2>

          <p className="text-sm font-medium text-gray-500">
            Dokumentasi kegiatan ekstrakurikuler{" "}
            {extra?.name ? extra.name.toLowerCase() : ""}
          </p>
        </div>

        {/* GALERI DOKUMENTASI */}
        <div className="px-4 py-5 sm:px-5">
          <h3 className="mb-4 text-base font-bold text-gray-900">
            Dokumentasi
          </h3>

          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <p className="text-sm text-gray-500">
                Memuat dokumentasi...
              </p>
            </div>
          ) : media.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-center text-sm text-gray-500">
                Belum ada dokumentasi untuk ekstrakurikuler ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  {/* FOTO ATAU VIDEO */}
                  <div className="flex aspect-video items-center justify-center overflow-hidden bg-gray-100">
                    {item.type === "VIDEO" ? (
                      <video
                        src={item.url}
                        controls
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={`Dokumentasi ${extra?.name || "ekstrakurikuler"}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* IKON DELETE DI POJOK KANAN ATAS */}
                  <button
                    type="button"
                    title="Hapus dokumentasi"
                    aria-label={`Hapus dokumentasi ${item.id}`}
                    disabled={deletingId !== null || uploading}
                    onClick={() => setSelectedMedia(item)}
                    className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* KETERANGAN */}
                  <div className="flex items-center gap-2 border-t border-gray-200 px-3 py-2.5 text-xs text-gray-600">
                    {item.type === "VIDEO" ? (
                      <Video size={16} />
                    ) : (
                      <ImageIcon size={16} />
                    )}

                    <span>
                      {item.type === "VIDEO" ? "Video" : "Foto"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM UPLOAD */}
        <div className="border-t border-gray-300 px-4 py-5 sm:px-5">
          <h3 className="mb-4 text-base font-bold text-gray-900">
            Tambah Dokumentasi
          </h3>

          <form onSubmit={handleUpload}>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Foto/Video
            </label>

            <button
              type="button"
              disabled={uploading || loading || !extra}
              onClick={() => fileRef.current?.click()}
              className="flex min-h-[155px] w-full flex-col items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-6 text-center transition hover:border-[#EF8700] hover:bg-orange-50/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CloudUpload
                size={42}
                strokeWidth={1.5}
                className="mb-2 text-[#EF8700]"
              />

              <span className="text-sm font-semibold text-gray-800">
                Pilih foto atau video
              </span>

              <span className="mt-1 text-xs text-gray-400">
                Format PNG, JPG, MP4
              </span>

              <span className="mt-1 text-xs text-gray-400">
                Maksimal foto 5 MB dan video 50 MB
              </span>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,video/mp4"
              multiple
              onChange={(event) =>
                handleFiles(event.target.files)
              }
              className="hidden"
            />

            {/* DAFTAR FILE */}
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
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {isVideo ? (
                          <Video size={18} className="shrink-0 text-gray-500" />
                        ) : (
                          <ImageIcon size={18} className="shrink-0 text-gray-500" />
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm text-gray-800">
                            {file.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => removeFile(index)}
                        className="shrink-0 rounded p-1 text-red-600 transition hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
                        aria-label={`Hapus ${file.name} dari daftar upload`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TOMBOL AKSI */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin/ekstrakurikuler")}
                disabled={uploading}
                className="rounded-lg border border-gray-400 bg-white px-6 py-2 text-xs font-medium text-black transition hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={
                  uploading ||
                  loading ||
                  !extra ||
                  files.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F5820B] px-7 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Mengunggah..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MODAL KONFIRMASI HAPUS */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              deletingId === null
            ) {
              setSelectedMedia(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Tombol tutup */}
            <div className="flex justify-end px-4 pt-4">
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => setSelectedMedia(null)}
                aria-label="Tutup konfirmasi"
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pb-6 text-center sm:px-8">
              {/* Ikon peringatan */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle
                    size={27}
                    className="text-red-600"
                  />
                </div>
              </div>

              <h2
                id="delete-modal-title"
                className="text-xl font-bold text-gray-900"
              >
                Hapus Dokumentasi?
              </h2>

              <p
                id="delete-modal-description"
                className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500"
              >
                Apakah kamu yakin ingin menghapus dokumentasi ini?
                Dokumentasi yang dihapus tidak akan ditampilkan
                kembali di galeri.
              </p>

              {/* Informasi jenis file */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm">
                  {selectedMedia.type === "VIDEO" ? (
                    <Video size={20} />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    Dokumentasi {selectedMedia.type === "VIDEO" ? "Video" : "Foto"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ekstrakurikuler {extra?.name || ""}
                  </p>
                </div>
              </div>

              {/* Tombol modal */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => setSelectedMedia(null)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => void handleDeleteMedia()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId !== null ? (
                    "Menghapus..."
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Ya, Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
