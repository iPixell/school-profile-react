
import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Map,
} from "lucide-react";
import { getContacts } from "../services/contact.service";
import type { Contact as ContactType } from "../services/contact.service";

function Contact() {
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getContacts();
        setContact(response.data[0] ?? null);
      } catch (error) {
        console.error("Gagal mengambil data kontak:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const contactItems = [
    {
      label: "Alamat",
      value: contact?.address,
      icon: MapPin,
    },
    {
      label: "Nomor Telepon",
      value: contact?.phone,
      icon: Phone,
    },
    {
      label: "Email",
      value: contact?.email,
      icon: Mail,
    },
    {
      label: "WhatsApp",
      value: contact?.whatsapp,
      icon: MessageCircle,
    },
    {
      label: "Lokasi",
      value: contact?.location,
      icon: Map,
    },
  ];

  return (
    <main>
      <section className="bg-amber-700 py-10 text-center text-white md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">
          Kontak Kami
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-6 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
              Hubungi Kami
            </h2>

            {loading ? (
              <p className="text-gray-500">Memuat data kontak...</p>
            ) : !contact ? (
              <p className="text-gray-500">
                Data kontak belum tersedia.
              </p>
            ) : (
              <div className="space-y-5">
                {contactItems.map(({ label, value, icon: Icon }) =>
                  value ? (
                    <div key={label} className="flex items-start gap-4">
                      <div className="rounded-full bg-amber-100 p-3 text-amber-700">
                        <Icon size={21} />
                      </div>
                      <div>
                        <p className="font-bold">{label}</p>
                        <p className="mt-1 whitespace-pre-line text-sm text-gray-500 sm:text-base">
                          {value}
                        </p>
                      </div>
                    </div>
                  ) : null
                )}

                {contact.googleMaps && (
                  <a
                    href={contact.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <MapPin size={18} />
                    Lihat Google Maps
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="min-h-64 overflow-hidden rounded-xl bg-gray-200">
            {contact?.googleMaps ? (
              <iframe
                title="Lokasi sekolah"
                src={contact.googleMaps}
                className="h-64 w-full border-0 md:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-gray-600">
                Lokasi / Google Maps belum tersedia
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;