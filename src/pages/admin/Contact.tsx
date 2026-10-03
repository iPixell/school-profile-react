import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Map,
} from "lucide-react";

import {
  createContact,
  getContacts,
} from "../../services/contact.service";

import type {
  Contact,
  ContactFormData,
} from "../../services/contact.service";

function ContactPage() {
  const [data, setData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const item = response.data?.[0] ?? null;

      setData(item);

      if (item) {
        setForm({
          address: item.address ?? "",
          phone: item.phone ?? "",
          email: item.email ?? "",
          whatsapp: item.whatsapp ?? "",
          location: item.location ?? "",
          googleMaps: item.googleMaps ?? "",
        });
      }
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

  function handleCancel() {
    if (data) {
      setForm({
        address: data.address ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        whatsapp: data.whatsapp ?? "",
        location: data.location ?? "",
        googleMaps: data.googleMaps ?? "",
      });
    } else {
      setForm({
        address: "",
        phone: "",
        email: "",
        whatsapp: "",
        location: "",
        googleMaps: "",
      });
    }

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.address.trim() ||
      !form.phone.trim() ||
      !form.email.trim()
    ) {
      setError("Alamat, nomor telepon, dan email wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createContact({
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        location: form.location.trim(),
        googleMaps: form.googleMaps.trim(),
      });

      await loadContacts();
      setSuccess("Informasi kontak berhasil disimpan.");
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

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-48px)] bg-white p-5">
        <p className="text-sm text-gray-500">
          Memuat data kontak...
        </p>
      </section>
    );
  }

  const fields = [
    {
      label: "Alamat",
      key: "address" as const,
      icon: MapPin,
      placeholder: "Masukkan alamat sekolah",
      type: "textarea",
    },
    {
      label: "Nomor Telepon",
      key: "phone" as const,
      icon: Phone,
      placeholder: "Contoh: 02112345678",
      type: "tel",
    },
    {
      label: "Email",
      key: "email" as const,
      icon: Mail,
      placeholder: "contoh@sekolah.sch.id",
      type: "email",
    },
    {
      label: "WhatsApp",
      key: "whatsapp" as const,
      icon: MessageCircle,
      placeholder: "Contoh: 628123456789",
      type: "tel",
    },
    {
      label: "Lokasi",
      key: "location" as const,
      icon: Globe,
      placeholder: "Contoh: Kota Sukabumi",
      type: "text",
    },
    {
      label: "Link Google Maps",
      key: "googleMaps" as const,
      icon: Map,
      placeholder: "https://maps.google.com/...",
      type: "url",
    },
  ];

  return (
    <section className="min-h-[calc(100vh-48px)] bg-white px-2 py-3 sm:px-3 sm:py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-black">
          Kontak Sekolah
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola informasi kontak dan lokasi sekolah
        </p>
      </div>

      {/* Pesan */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded border border-gray-300 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-5 text-sm font-bold text-black">
            Informasi Kontak
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;

              return (
                <div
                  key={field.key}
                  className={
                    field.key === "address"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-black">
                    <Icon size={14} className="text-orange-600" />
                    {field.label}
                    {["address", "phone", "email"].includes(
                      field.key,
                    ) && <span className="text-red-600">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      value={form[field.key]}
                      onChange={(event) =>
                        handleChange(
                          field.key,
                          event.target.value,
                        )
                      }
                      placeholder={field.placeholder}
                      rows={3}
                      required
                      className="w-full resize-none rounded border border-gray-400 px-3 py-2 text-xs outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(event) =>
                        handleChange(
                          field.key,
                          event.target.value,
                        )
                      }
                      placeholder={field.placeholder}
                      required={["phone", "email"].includes(
                        field.key,
                      )}
                      className="h-9 w-full rounded border border-gray-400 px-3 text-xs outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="rounded border border-gray-400 bg-white px-5 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded bg-[#F5820B] px-6 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ContactPage;