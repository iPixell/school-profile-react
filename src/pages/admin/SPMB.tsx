import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus, Upload } from "lucide-react";

import {
  createSpmb,
  getSpmb,
  updateSpmb,
} from "../../services/spmb.service";

import type { Spmb } from "../../services/spmb.service";

function SPMB() {
  const [data, setData] = useState<Spmb | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  async function loadSpmb() {
    try {
      setLoading(true);
      setError("");

      const response = await getSpmb();
      const item = response.data?.[0] ?? null;

      setData(item);

      if (item) {
        setTitle(item.title ?? "");
        setDescription(item.description ?? "");
        setPortalUrl(item.portalUrl ?? "");
        setPreview(item.photoUrl ?? "");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data SPMB.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpmb();
  }, []);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleCancel() {
    if (data) {
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setPortalUrl(data.portalUrl ?? "");
      setPreview(data.photoUrl ?? "");
    } else {
      setTitle("");
      setDescription("");
      setPortalUrl("");
      setPreview("");
    }

    setPhoto(null);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");

    if (!title.trim()) {
      setError("Judul SPMB wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = {
        title: title.trim(),
        description: description.trim() || undefined,
        portalUrl: portalUrl.trim() || undefined,
        photo,
      };

      if (data) {
        await updateSpmb(data.id, formData);
      } else {
        await createSpmb(formData);
      }

      await loadSpmb();
      setSuccess("Informasi SPMB berhasil disimpan.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data SPMB.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-48px)] bg-white p-5">
        <p className="text-sm text-gray-500">Memuat data SPMB...</p>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-48px)] bg-white px-2 py-3 sm:px-3 sm:py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-black">
          Informasi SPMB
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola Informasi penerimaan peserta didik baru
        </p>
      </div>

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded border border-gray-400 bg-white p-4 shadow-sm sm:p-5">
          <div className="space-y-2">
            {/* Judul */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-black">
                Judul<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="h-6 w-full rounded border border-gray-400 px-2 text-xs outline-none focus:border-orange-500"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-black">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
                className="w-full resize-none rounded border border-gray-400 px-2 py-2 text-xs outline-none focus:border-orange-500"
              />
            </div>

            {/* Portal */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-black">
                Portal SPMB
              </label>
              <input
                type="url"
                value={portalUrl}
                onChange={(event) =>
                  setPortalUrl(event.target.value)
                }
                className="h-6 w-full rounded border border-gray-400 px-2 text-xs outline-none focus:border-orange-500"
              />
            </div>

            {/* Foto */}
            <div>
              <label className="mb-2 block text-[11px] font-semibold text-black">
                Foto
              </label>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex h-[83px] w-full max-w-[148px] items-center justify-center overflow-hidden rounded-lg bg-[#D9D9D9]">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview banner SPMB"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus
                      size={42}
                      className="text-white"
                    />
                  )}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <span className="text-[11px] font-semibold text-black">
                    Banner
                  </span>

                  <label className="flex cursor-pointer items-center gap-1 rounded border border-gray-500 px-2 py-1 text-[10px] text-black transition hover:bg-gray-100">
                    <Upload size={12} className="text-orange-600" />
                    Ubah Gambar
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol */}
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="min-w-[80px] rounded border border-gray-500 bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="min-w-[92px] rounded bg-[#F5820B] px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SPMB;