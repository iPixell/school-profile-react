import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
} from "react-icons/fa6";

import { getContacts, type Contact } from "../services/contact.service";

import {
  getSchoolProfile,
  type SchoolProfile,
} from "../services/schoolProfile.service";

import {
  getSocialMedias,
  type SocialMedia,
} from "../services/socialMedia.service";

function Footer() {
  const [contact, setContact] = useState<Contact | null>(null);

  const [schoolProfile, setSchoolProfile] =
    useState<SchoolProfile | null>(null);

  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const contactResponse = await getContacts();

        if (mounted) {
          setContact(contactResponse.data[0] ?? null);
        }
      } catch (error) {
        console.error("Gagal mengambil data kontak:", error);
      }

      try {
        const schoolProfileResponse = await getSchoolProfile();

        if (mounted) {
          setSchoolProfile(schoolProfileResponse.data);
        }
      } catch (error) {
        console.error("Gagal mengambil profil sekolah:", error);
      }

      try {
        const socialMediaResponse = await getSocialMedias();

        if (mounted) {
          setSocialMedias(socialMediaResponse.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data sosial media:", error);

        if (mounted) {
          setSocialMedias([]);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const socialIcons: Record<
    string,
    React.ComponentType<{ size?: number }>
  > = {
    instagram: FaInstagram,
    facebook: FaFacebook,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    x: FaXTwitter,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    linkedin: FaLinkedin,
  };

  return (
    <footer className="bg-amber-700 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Logo & Nama Sekolah */}
        <div className="flex items-center gap-4">
          {schoolProfile?.logoUrl ? (
            <img
              src={schoolProfile.logoUrl}
              alt={`Logo ${schoolProfile.schoolName}`}
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200" />
          )}

          <span className="text-lg font-bold leading-tight">
            {schoolProfile?.schoolName || "SD NEGERI BAROS 3"}
          </span>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="mb-5 text-base font-bold">Kontak Kami</h3>

          {contact ? (
            <div className="space-y-3 text-sm">
              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0" />

                  <span>{contact.address}</span>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0" />

                  <span>{contact.phone}</span>
                </div>
              )}

              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0" />

                  <span>{contact.email}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm">Data kontak belum tersedia.</p>
          )}
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-5 text-base font-bold">Ikuti Kami</h3>

          <div className="flex flex-wrap items-center gap-4">
            {socialMedias.map((item) => {
              const Icon = socialIcons[item.platform.toLowerCase()];

              if (!Icon) {
                return null;
              }

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.platform}
                  title={item.platform}
                  className="transition-opacity hover:opacity-70"
                >
                  <Icon size={24} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20 py-3 text-center text-xs">
        © 2026 {schoolProfile?.schoolName || "SD Negeri Baros 3"}
      </div>
    </footer>
  );
}

export default Footer;