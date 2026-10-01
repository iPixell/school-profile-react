import { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2, UserRound } from "lucide-react";
import {
  createStaff,
  deleteStaff,
  getStaff,
  updateStaff,
  type Staff as StaffData,
  type StaffType,
} from "../../services/staff.service";

export default function Staff() {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState<StaffType>("TEACHER");
  const [classTaught, setClassTaught] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadStaff() {
    try {
      setLoading(true);
      setError("");

      const response = await getStaff();
      setStaff(response.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data guru dan tenaga administrasi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  function resetForm() {
    setName("");
    setPosition("");
    setType("TEACHER");
    setClassTaught("");
    setPhotoUrl("");
    setEditingId(null);
  }

  function handleEdit(item: StaffData) {
    setEditingId(item.id);
    setName(item.name);
    setPosition(item.position);
    setType(item.type);
    setClassTaught(item.classTaught ?? "");
    setPhotoUrl(item.photoUrl ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !position.trim()) {
      setError("Nama dan posisi wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: name.trim(),
        position: position.trim(),
        type,
        classTaught:
          type === "TEACHER" && classTaught.trim()
            ? classTaught.trim()
            : undefined,
        photoUrl: photoUrl.trim() || undefined,
      };

      if (editingId !== null) {
        await updateStaff(editingId, payload);
      } else {
        await createStaff(payload);
      }

      resetForm();
      await loadStaff();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus data ini?",
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteStaff(id);
      await loadStaff();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus data.");
    }
  }

  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return staff;

    return staff.filter((item) =>
      [
        item.name,
        item.position,
        item.type,
        item.classTaught ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [staff, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Guru & Tenaga Administrasi
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola data guru dan tenaga administrasi sekolah.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              {editingId !== null
                ? "Edit Data"
                : "Tambah Data"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Isi informasi guru atau tenaga administrasi.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* NAMA */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* POSISI */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Posisi
              </label>

              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Guru Matematika"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Jenis
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as StaffType)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="TEACHER">Guru</option>
                <option value="ADMINISTRATIVE">
                  Tenaga Administrasi
                </option>
              </select>
            </div>

            {/* KELAS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Kelas yang Diajar
              </label>

              <input
                type="text"
                value={classTaught}
                onChange={(e) => setClassTaught(e.target.value)}
                disabled={type !== "TEACHER"}
                placeholder={
                  type === "TEACHER"
                    ? "Contoh: VII A, VIII B"
                    : "Tidak berlaku"
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 disabled:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* FOTO */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                URL Foto
              </label>

              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* BUTTON */}
            <div className="flex flex-col gap-2 pt-2 sm:flex-row md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Menyimpan..."
                  : editingId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Data"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-white shadow-sm">
          {/* TABLE HEADER */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Daftar Guru & Tenaga Administrasi
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredStaff.length} data
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau posisi..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="space-y-3 p-4 md:hidden">
            {loading ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Memuat data...
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Belum ada data.
              </div>
            ) : (
              filteredStaff.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                        <UserRound size={22} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {item.position}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        {item.type === "TEACHER"
                          ? "Guru"
                          : "Tenaga Administrasi"}
                      </span>

                      {item.classTaught && (
                        <p className="mt-2 text-xs text-slate-500">
                          Kelas: {item.classTaught}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Jenis
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kelas
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      Belum ada data.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.photoUrl ? (
                            <img
                              src={item.photoUrl}
                              alt={item.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                              <UserRound size={18} />
                            </div>
                          )}

                          <span className="font-medium text-slate-800">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.position}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                          {item.type === "TEACHER"
                            ? "Guru"
                            : "Tenaga Administrasi"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.classTaught || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-orange-500"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                            title="Hapus"
                          >
                            <Trash2 size={17} />
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
      </div>
    </div>
  );
}