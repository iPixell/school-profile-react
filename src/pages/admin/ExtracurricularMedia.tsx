
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CloudUpload, Image as ImageIcon, Video, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExtracurriculars,
  type Extracurricular,
} from "../../services/extracurricular.service";
import {
  getExtracurricularMedia,
  uploadExtracurricularMedia,
  type ExtracurricularMedia as MediaType,
} from "../../services/extracurricularMedia.service";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

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

    const accepted = Array.from(selected);
    const invalid = accepted.find((file) => {
      const validType =
        file.type.startsWith("image/") ||
        file.type === "video/mp4";
      return !validType || file.size > MAX_FILE_SIZE;
    });

    if (invalid) {
      setError(
        "File harus berupa gambar atau video MP4 dengan ukuran maksimal 50 MB.",
      );
      return;
    }

    setError("");
    setSuccess("");
    setFiles((current) => [...current, ...accepted]);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!files.length) {
      setError("Pilih minimal satu foto atau video.");
      return;
    }

    try {
      setUploading(true);

      for (const file of files) {
        await uploadExtracurricularMedia(extraId, file);
      }

      setFiles([]);
      if (fileRef.current) fileRef.current.value = "";
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
    <main className="min-w-0 space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          onClick={() => navigate("/admin/extracurriculars")}
          className="inline-flex shrink-0 items-center gap-2 self-start text-sm text-gray-600 hover:text-[#B46000] sm:self-center"
        >
          <ArrowLeft size={19} className="text-[#EF8700]" />
          Back
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Tutup pesan">
            <X size={18} />
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

      <section className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
        <div className="border-b border-gray-300 px-4 py-3 sm:px-5">
          <h2 className="font-semibold text-gray-900">
            {loading ? "Memuat..." : extra?.name || "Ekstrakurikuler"}
          </h2>
          <p className="text-sm text-gray-500">
            Dokumentasi kegiatan ekstrakurikuler
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="mb-3 font-semibold text-gray-900">Dokumentasi</h3>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Memuat dokumentasi...
            </p>
          ) : media.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center">
              <ImageIcon size={36} className="mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Belum ada dokumentasi untuk ekstrakurikuler ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  {item.type === "VIDEO" ? (
                    <video
                      src={item.url}
                      controls
                      className="aspect-video w-full bg-gray-200 object-contain"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt="Dokumentasi ekstrakurikuler"
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600">
                    {item.type === "VIDEO" ? (
                      <Video size={15} />
                    ) : (
                      <ImageIcon size={15} />
                    )}
                    {item.type === "VIDEO" ? "Video" : "Foto"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 p-4 sm:p-5">
          <h3 className="mb-4 font-semibold text-gray-900">
            Tambah Dokumentasi
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Foto/Video
            </label>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex min-h-44 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 bg-white px-4 py-6 text-center transition hover:border-[#B46000] hover:bg-orange-50/30"
            >
              <CloudUpload size={36} className="mb-2 text-[#EF8700]" />
              <span className="text-sm font-semibold text-gray-800">
                Pilih foto atau video
              </span>
              <span className="mt-1 text-xs text-gray-500">
                Format gambar dan MP4, maksimal 50 MB per file
              </span>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/mp4"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  File yang akan diunggah ({files.length})
                </p>
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-800">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => removeFile(index)}
                      className="shrink-0 rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      aria-label={`Hapus ${file.name} dari antrean`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/extracurriculars")}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={uploading || loading || !extra}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EF8700] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D97700] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CloudUpload size={17} />
                {uploading ? "Mengunggah..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}