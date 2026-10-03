import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import {
    FaInstagram,
    FaFacebook,
    FaYoutube,
    FaWhatsapp,
} from "react-icons/fa";

import { getContacts } from "../services/contact.service";
import type { Contact } from "../services/contact.service";
import { getSchoolProfile } from "../services/schoolProfile.service";
import type { SchoolProfile } from "../services/schoolProfile.service";
import { getSocialMedias } from "../services/socialMedia.service";
import type { SocialMedia } from "../services/socialMedia.service";

export default function Footer() {
    const [contact, setContact] = useState<Contact | null>(null);
    const [profile, setProfile] = useState<SchoolProfile | null>(null);
    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contactRes, profileRes, socialRes] = await Promise.all([
                    getContacts(),
                    getSchoolProfile(),
                    getSocialMedias(),
                ]);

                setContact(contactRes.data?.[0] ?? null);
                setProfile(profileRes.data ?? null);
                setSocialMedia(socialRes.data ?? []);
            } catch (error) {
                console.error("Gagal mengambil data footer:", error);
            }
        };

        fetchData();
    }, []);

    const whatsappNumber = contact?.whatsapp?.replace(/\D/g, "");

    return (
        <footer className="bg-amber-700 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
                {/* Profil Sekolah */}
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        {profile?.logoUrl && (
                            <img
                                src={profile.logoUrl}
                                alt="Logo sekolah"
                                className="h-14 w-14 rounded-full bg-white object-contain p-1"
                            />
                        )}

                        <h2 className="text-xl font-bold">
                            {profile?.schoolName || "Nama Sekolah"}
                        </h2>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-200">
                        {profile?.shortInfo || "Selamat datang di website sekolah kami."}
                    </p>
                </div>

                {/* Kontak */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold">Hubungi Kami</h3>

                    <div className="space-y-3 text-sm text-gray-200">
                        {contact?.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                                <span>{contact.address}</span>
                            </div>
                        )}

                        {contact?.phone && (
                            <a
                                href={`tel:${contact.phone}`}
                                className="flex items-center gap-3 transition hover:text-green-300"
                            >
                                <Phone className="h-5 w-5 shrink-0" />
                                <span>{contact.phone}</span>
                            </a>
                        )}

                        {contact?.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center gap-3 transition hover:text-green-300"
                            >
                                <Mail className="h-5 w-5 shrink-0" />
                                <span>{contact.email}</span>
                            </a>
                        )}

                        {whatsappNumber && (
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 transition hover:text-green-300"
                            >
                                <FaWhatsapp className="h-5 w-5 shrink-0" />
                                <span>WhatsApp</span>
                            </a>
                        )}

                        {contact?.googleMaps && (
                            <a
                                href={contact.googleMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 transition hover:text-green-300"
                            >
                                <MapPin className="h-5 w-5 shrink-0" />
                                <span>Lihat Lokasi</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Media Sosial */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold">Media Sosial</h3>

                    <div className="flex flex-wrap gap-4">
                        {socialMedia.map((item) => {
                            const platform = item.platform.toLowerCase();

                            const Icon =
                                platform.includes("instagram")
                                    ? FaInstagram
                                    : platform.includes("facebook")
                                        ? FaFacebook
                                        : platform.includes("youtube")
                                            ? FaYoutube
                                            : null;

                            return (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.platform}
                                    title={item.platform}
                                    className="text-2xl transition hover:text-green-300"
                                >
                                    {Icon ? <Icon /> : item.platform}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 px-6 py-4 text-center text-sm text-gray-300">
                © {new Date().getFullYear()} {profile?.schoolName || "Sekolah Kami"}

            </div>
        </footer>
    );
}
