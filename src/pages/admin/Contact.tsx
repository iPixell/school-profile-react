import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createContact,
  getContacts,
} from "../../services/contact.service";

import type {
  Contact,
  ContactFormData,
} from "../../services/contact.service";

function ContactPage() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState<ContactFormData>({
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    location: "",
    googleMaps: "",
  });

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const response = await getContacts();
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data kontak.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  function handleChange(
    field: keyof ContactFormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm({
      address: "",
      phone: "",
      email: "",
      whatsapp: "",
      location: "",
      googleMaps: "",
    });
  }

  function openForm() {
    resetForm();
    setError("");
    setIsFormOpen(true);
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

    if (!form.address.trim()) {
      setError("Alamat wajib diisi.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Nomor telepon wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createContact({
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        location: form.location.trim(),
        googleMaps: form.googleMaps.trim(),
      });

      await loadContacts();

      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data kontak.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kontak
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi kontak sekolah.
          </p>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="w-full rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 sm:w-auto"
        >
          + Tambah Kontak
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
            Memuat data kontak...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Belum ada data kontak.
          </p>

          <button
            type="button"
            onClick={openForm}
            className="mt-4 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Tambah Kontak
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {data.map((item) => (
            <article
              key={item.id}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6"
            >
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Informasi Kontak
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Alamat
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {item.address}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Telepon
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {item.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm text-gray-700">
                    {item.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {item.whatsapp || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Lokasi
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {item.location || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Google Maps
                  </p>

                  {item.googleMaps ? (
                    <a
                      href={item.googleMaps}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-sm font-medium text-amber-600 hover:underline"
                    >
                      Buka Google Maps
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-gray-700">
                      -
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6">
          <div className="my-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl sm:my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Tambah Kontak
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
                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Alamat
                  </label>

                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      handleChange(
                        "address",
                        event.target.value,
                      )
                    }
                    placeholder="Masukkan alamat sekolah"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Nomor Telepon
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      handleChange(
                        "phone",
                        event.target.value,
                      )
                    }
                    placeholder="Contoh: 02112345678"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      handleChange(
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="contoh@sekolah.sch.id"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    WhatsApp
                  </label>

                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(event) =>
                      handleChange(
                        "whatsapp",
                        event.target.value,
                      )
                    }
                    placeholder="Contoh: 628123456789"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Lokasi
                  </label>

                  <input
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      handleChange(
                        "location",
                        event.target.value,
                      )
                    }
                    placeholder="Contoh: Kota Sukabumi"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Google Maps */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Link Google Maps
                  </label>

                  <input
                    type="url"
                    value={form.googleMaps}
                    onChange={(event) =>
                      handleChange(
                        "googleMaps",
                        event.target.value,
                      )
                    }
                    placeholder="https://maps.google.com/..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
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
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default ContactPage;
