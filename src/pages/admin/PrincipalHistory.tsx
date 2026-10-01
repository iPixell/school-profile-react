import { useEffect, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import {
  getPrincipalHistories,
  createPrincipalHistory,
  updatePrincipalHistory,
  deletePrincipalHistory,
  type PrincipalHistory as PrincipalHistoryData,
} from "../../services/principalHistory.service";

function PrincipalHistory() {
  const [histories, setHistories] = useState<PrincipalHistoryData[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadHistories() {
    try {
      setLoading(true);
      setError("");

      const response = await getPrincipalHistories();
      setHistories(response.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data riwayat kepala sekolah.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistories();
  }, []);

  function resetForm() {
    setName("");
    setPeriod("");
    setEditingId(null);
  }

  function handleEdit(item: PrincipalHistoryData) {
    setEditingId(item.id);
    setName(item.name);
    setPeriod(item.period);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !period.trim()) {
      setError("Nama dan periode wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updatePrincipalHistory(editingId, {
          name: name.trim(),
          period: period.trim(),
        });
      } else {
        await createPrincipalHistory({
          name: name.trim(),
          period: period.trim(),
        });
      }

      resetForm();
      await loadHistories();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus data ini?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deletePrincipalHistory(id);
      await loadHistories();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus data.");
    }
  }

  const filteredHistories = histories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Kepala Sekolah
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola data riwayat kepala sekolah
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Table */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            {/* Search */}
            <div className="mb-5 flex w-full max-w-sm items-center rounded-lg border border-gray-300 bg-white">
              <Search
                size={19}
                className="ml-3 shrink-0 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama kepala sekolah..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-gray-500">Memuat data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead>
                    <tr className="bg-[#F5EBDD] text-left">
                      <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-800">
                        No
                      </th>

                      <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-800">
                        Nama
                      </th>

                      <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-800">
                        Periode
                      </th>

                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-800">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistories.length > 0 ? (
                      filteredHistories.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="border border-gray-300 px-4 py-4 text-sm text-gray-700">
                            {index + 1}
                          </td>

                          <td className="border border-gray-300 px-4 py-4 text-sm text-gray-800">
                            {item.name}
                          </td>

                          <td className="border border-gray-300 px-4 py-4 text-sm text-gray-700">
                            {item.period}
                          </td>

                          <td className="border border-gray-300 px-4 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="text-amber-500 transition hover:text-amber-700"
                                title="Edit"
                              >
                                <Pencil size={21} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="text-orange-500 transition hover:text-orange-700"
                                title="Hapus"
                              >
                                <Trash2 size={21} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="border border-gray-300 px-4 py-12 text-center text-sm text-gray-500"
                        >
                          {search
                            ? "Data tidak ditemukan."
                            : "Belum ada data riwayat kepala sekolah."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Form */}
          <section className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-base font-bold text-gray-900">
              {editingId
                ? "Edit Kepala Sekolah"
                : "Tambah Kepala sekolah"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Nama */}
              <div>
                <label
                  htmlFor="principal-name"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Nama<span className="text-red-500">*</span>
                </label>

                <input
                  id="principal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kepala sekolah"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
                />
              </div>

              {/* Periode */}
              <div>
                <label
                  htmlFor="principal-period"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Periode<span className="text-red-500">*</span>
                </label>

                <input
                  id="principal-period"
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="Contoh: 2024-Sekarang"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#B46000] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#944F00] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Update"
                      : "Simpan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PrincipalHistory;
