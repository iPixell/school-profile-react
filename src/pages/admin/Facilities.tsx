import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Search, Pencil, Trash2, ImagePlus } from "lucide-react";

import {
  createFacility,
  deleteFacility,
  getFacilities,
  updateFacility,
} from "../../services/facility.service";

import type { Facility } from "../../services/facility.service";

function Facilities() {
  const [data, setData] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  async function loadFacilities() {
    try {
      setLoading(true);
      setError("");
      const response = await getFacilities();
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data fasilitas.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFacilities();
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  function resetForm() {
    setName("");
    setDescription("");
    setPhoto(null);
    setPreview("");
    setEditingId(null);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleEdit(item: Facility) {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description ?? "");
    setPhoto(null);
    setPreview(item.photoUrl ?? "");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Nama fasilitas wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = {
        name: name.trim(),
        description: description.trim() || undefined,
        photo,
      };

      if (editingId === null) {
        await createFacility(formData);
      } else {
        await updateFacility(editingId, formData);
      }

      await loadFacilities();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data fasilitas.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus fasilitas ini?",
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteFacility(id);
      setData((current) => current.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus fasilitas.",
      );
    }
  }

  return (
    <section className="min-h-[calc(100vh-48px)] bg-white px-2 py-3 sm:px-3 sm:py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-black">
          Sarana & Prasarana
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola data sarana & prasarana sekolah
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Layout utama */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)] lg:gap-5">
        {/* Bagian kiri: pencarian dan tabel */}
        <div className="min-w-0">
          <div className="relative mb-7 w-full max-w-[250px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama fasilitas..."
              className="h-7 w-full rounded border border-gray-400 bg-white pl-9 pr-2 text-xs outline-none focus:border-amber-600"
            />
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-[11px] text-black">
              <thead>
                <tr className="h-[60px] bg-[#F3E9DC]">
                  <th className="w-[7%] border border-gray-400 px-3">
                    No
                  </th>
                  <th className="w-[30%] border border-gray-400 px-3">
                    Nama
                  </th>
                  <th className="w-[35%] border border-gray-400 px-3">
                    Foto
                  </th>
                  <th className="w-[28%] border border-gray-400 px-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-400 px-3 py-8 text-center"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-400 px-3 py-8 text-center text-gray-500"
                    >
                      Data fasilitas tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="h-[61px]">
                      <td className="border border-gray-400 px-3">
                        {index + 1}
                      </td>
                      <td className="border border-gray-400 px-3">
                        {item.name}
                      </td>
                      <td className="border border-gray-400 px-3">
                        {item.photoUrl ? (
                          <a
                            href={item.photoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 underline"
                          >
                            Lihat foto
                          </a>
                        ) : (
                          "img.jpg"
                        )}
                      </td>
                      <td className="border border-gray-400 px-3">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            title="Edit fasilitas"
                            className="text-orange-500 transition hover:text-orange-700"
                          >
                            <Pencil size={22} fill="currentColor" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Hapus fasilitas"
                            className="text-orange-500 transition hover:text-orange-700"
                          >
                            <Trash2 size={22} fill="currentColor" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bagian kanan: form */}
        <div className="min-w-0">
          <h2 className="mb-5 text-sm font-bold text-black">
            {editingId === null
              ? "Tambah Fasilitas"
              : "Edit Fasilitas"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-black">
                Nama<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-6 w-full rounded border border-gray-400 px-2 text-xs outline-none focus:border-amber-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-black">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="w-full resize-none rounded border border-gray-400 px-2 py-2 text-xs outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-black">
                Foto
              </label>

              <label className="flex h-[72px] w-full max-w-[165px] cursor-pointer items-center justify-center gap-3 rounded border border-gray-400 bg-white px-2 hover:bg-gray-50">
                <span className="flex h-10 w-12 items-center justify-center rounded bg-gray-200">
                  <ImagePlus size={22} className="text-gray-500" />
                </span>
                <span className="text-[9px] leading-4 text-black">
                  Format, JPG, PNG
                  <br />
                  <span className="rounded border border-gray-400 px-1">
                    Pilih File
                  </span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-black">
                Preview Foto
              </label>

              <div className="flex h-[73px] w-full max-w-[163px] items-center justify-center overflow-hidden rounded-lg bg-[#D9D9D9]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview fasilitas"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus size={34} className="text-white" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded border border-gray-500 bg-white px-5 py-2 text-xs font-medium text-black hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded bg-[#F5820B] px-6 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Facilities;