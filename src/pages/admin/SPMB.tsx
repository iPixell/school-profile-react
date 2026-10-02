import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  createSpmb,
  deleteSpmb,
  getSpmb,
  updateSpmb,
} from "../../services/spmb.service";

import type { Spmb } from "../../services/spmb.service";
function SPMB() {
  const [data, setData] = useState<Spmb[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
      setData(response.data);
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

  function resetForm() {
    setTitle("");
    setDescription("");
    setPortalUrl("");
    setPhoto(null);
    setPreview("");
    setEditingId(null);
  }

  function openAddForm() {
    resetForm();
    setIsFormOpen(true);
  }

  function openEditForm(item: Spmb) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setPortalUrl(item.portalUrl ?? "");
    setPhoto(null);
    setPreview(item.photoUrl ?? "");
    setIsFormOpen(true);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    resetForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

      if (editingId === null) {
        await createSpmb(formData);
      } else {
        await updateSpmb(editingId, formData);
      }

      await loadSpmb();

      setIsFormOpen(false);
      resetForm();
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

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus data SPMB ini?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteSpmb(id);

      setData((current) =>
        current.filter((item) => item.id !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data SPMB.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            SPMB
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi Seleksi Penerimaan Murid Baru.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="w-full rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 sm:w-auto"
        >
          + Tambah SPMB
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Memuat data SPMB...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Belum ada data SPMB.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-4 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Tambah Data
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100"
            >
              {/* Image */}
              <div className="h-48 bg-gray-100">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Foto belum tersedia
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {item.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                  {item.description ||
                    "Tidak ada deskripsi."}
                </p>

                {item.portalUrl && (
                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block truncate text-sm font-medium text-amber-600 hover:underline"
                  >
                    Buka Portal SPMB
                  </a>
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    className="flex-1 rounded-lg border border-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 rounded-lg border border-red-500 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6">
          <div className="my-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl sm:my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId === null
                  ? "Tambah SPMB"
                  : "Edit SPMB"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-5 sm:p-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Judul SPMB
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="Masukkan judul SPMB"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Deskripsi
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Masukkan deskripsi SPMB"
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Portal */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Portal SPMB
                  </label>

                  <input
                    type="url"
                    value={portalUrl}
                    onChange={(event) =>
                      setPortalUrl(event.target.value)
                    }
                    placeholder="https://contoh.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Photo */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Foto / Banner
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-600 file:mr-4 file:border-0 file:bg-amber-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
                  />

                  {preview && (
                    <div className="mt-4 overflow-hidden rounded-xl border">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 p-5 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId === null
                      ? "Simpan"
                      : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default SPMB;