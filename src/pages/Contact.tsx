import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import {
  getContacts,
  type Contact as ContactData,
} from "../services/contact.service";

function Contact() {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getContacts();
        setContact(response.data[0] ?? null);
      } catch (error) {
        console.error("Gagal mengambil data kontak:", error);
        setError("Gagal mengambil data kontak.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-gray-500">Memuat data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-amber-700 py-10 text-center text-white md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">
          Kontak Kami
        </h1>
      </section>

      {/* Kontak */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {contact ? (
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Informasi kontak */}
            <div className="space-y-7">
              {/* Alamat */}
              <div className="flex items-start gap-5">
                <MapPin
                  size={30}
                  strokeWidth={2.5}
                  className="mt-1 shrink-0 text-black"
                />

                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Alamat
                  </h2>
                  <p className="mt-1 text-sm text-gray-700 sm:text-base">
                    {contact.address || "Alamat belum tersedia."}
                  </p>
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-start gap-5">
                <Phone
                  size={30}
                  strokeWidth={2.5}
                  className="mt-1 shrink-0 text-black"
                />

                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Telepon
                  </h2>
                  <p className="mt-1 text-sm text-gray-700 sm:text-base">
                    {contact.phone || "Nomor telepon belum tersedia."}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <Mail
                  size={30}
                  strokeWidth={2.5}
                  className="mt-1 shrink-0 text-black"
                />

                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    E-mail
                  </h2>
                  <p className="mt-1 text-sm text-gray-700 sm:text-base">
                    {contact.email || "Email belum tersedia."}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-5">
                <MessageCircle
                  size={30}
                  strokeWidth={2.5}
                  className="mt-1 shrink-0 text-black"
                />

                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    WhatsApp
                  </h2>
                  <p className="mt-1 text-sm text-gray-700 sm:text-base">
                    {contact.whatsapp || "WhatsApp belum tersedia."}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-300 md:h-80">
              {contact.googleMaps ? (
                <a
                  href={contact.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
                >
                  Buka di Google Maps
                  <ExternalLink size={17} />
                </a>
              ) : (
                <span className="text-sm text-gray-600">
                  Lokasi belum tersedia
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center text-center">
            <p className="text-sm text-gray-500">
              Data kontak belum tersedia.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Contact;