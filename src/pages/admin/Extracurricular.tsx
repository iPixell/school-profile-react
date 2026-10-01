import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Pencil,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

import {
  createExtracurricular,
  deleteExtracurricular,
  getExtracurriculars,
  updateExtracurricular,
  type Extracurricular as ExtracurricularData,
} from "../../services/extracurricular.service";

export default function Extracurricular() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<ExtracurricularData[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const response = await getExtracurriculars();
      setItems(response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data ekstrakurikuler.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setName("");
    setPhotoUrl("");
    setPreview("");
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleEdit(item: ExtracurricularData) {
    setEditingId(item.id);
    setName(item.name);
    setPhotoUrl(item.photoUrl ?? "");
    setPreview(item.photoUrl ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Format foto harus JPG atau PNG.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    /*
     * Backend kita menyimpan photoUrl.
     *
     * Untuk sementara file dipreview di frontend.
     * Jika kamu sudah punya helper upload Supabase,
     * bagian ini tinggal diarahkan ke helper tersebut.
     */
    setPhotoUrl("");
    setError("");
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nama ekstrakurikuler wajib diisi.");
      return;
    }

    if (!photoUrl.trim() && !preview) {
      setError("Foto ekstrakurikuler wajib dipilih.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * Karena backend menerima photoUrl,
       * data yang disimpan harus berupa URL.
       *
       * Jika photoUrl kosong karena user baru memilih file,
       * upload Supabase perlu dilakukan terlebih dahulu.
       */
      if (!photoUrl.trim()) {
        setError(
          "Foto sudah dipilih tetapi belum memiliki URL. Gunakan URL foto Supabase yang sudah di-upload.",
        );
        return;
      }

      const payload = {
        name: name.trim(),
        photoUrl: photoUrl.trim(),
      };

      if (editingId !== null) {
        await updateExtracurricular(editingId, payload);
      } else {
        await createExtracurricular(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan ekstrakurikuler.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus ekstrakurikuler ini?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteExtracurricular(id);

      if (editingId === id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus ekstrakurikuler.");
    }
  }

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      item.name.toLowerCase().includes(keyword),
    );
  }, [items, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Ekstrakurikuler
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola data kegiatan ekstrakurikuler sekolah
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            {/* SEARCH */}
            <div className="mb-5">
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama ekstrakurikuler..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* MOBILE */}
            <div className="space-y-3 md:hidden">
              {loading ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  Memuat data...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  Belum ada data.
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">
                        {index + 1}
                      </span>

                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-600"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 py-2 text-sm text-red-500"
                      >
                        <Trash2 size={16} />
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[620px] border-collapse">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="border border-slate-300 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                      No
                    </th>

                    <th className="border border-slate-300 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                      Nama
                    </th>

                    <th className="border border-slate-300 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                      Foto
                    </th>

                    <th className="border border-slate-300 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="border border-slate-300 px-4 py-10 text-center text-sm text-slate-500"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="border border-slate-300 px-4 py-10 text-center text-sm text-slate-500"
                      >
                        Belum ada data.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-slate-300 px-4 py-4 text-sm text-slate-700">
                          {index + 1}
                        </td>

                        <td className="border border-slate-300 px-4 py-4 text-sm font-medium text-slate-800">
                          {item.name}
                        </td>

                        <td className="border border-slate-300 px-4 py-4">
                          {item.photoUrl ? (
                            <img
                              src={item.photoUrl}
                              alt={item.name}
                              className="h-10 w-16 rounded object-cover"
                            />
                          ) : (
                            <span className="text-sm text-slate-400">
                              -
                            </span>
                          )}
                        </td>

                        <td className="border border-slate-300 px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="text-orange-500 hover:text-orange-600"
                              title="Edit"
                            >
                              <Pencil size={23} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="text-orange-500 hover:text-red-500"
                              title="Hapus"
                            >
                              <Trash2 size={23} />
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

          {/* RIGHT FORM */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-800">
              {editingId !== null
                ? "Edit Ekstrakurikuler"
                : "Tambah Ekstrakurikuler"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* NAMA */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama ekstrakurikuler"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* FOTO */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Foto
                </label>

                <div className="rounded-lg border border-slate-300 p-4">
                  <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-slate-100">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <ImageIcon
                        size={45}
                        className="text-slate-300"
                      />
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Upload size={16} />
                    Pilih File
                  </button>

                  <p className="mt-2 text-center text-xs text-slate-400">
                    Format JPG, PNG
                  </p>
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  URL Foto
                </label>

                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Gunakan URL gambar Supabase yang sudah di-upload.
                </p>
              </div>

              {/* PREVIEW */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Preview Foto
                </label>

                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview foto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon
                      size={60}
                      className="text-slate-300"
                    />
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-400 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-orange-500 px-7 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}