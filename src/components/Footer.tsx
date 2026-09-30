import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { getContacts, type Contact } from "../services/contact.service";
import {
 getSocialMedias,
 type SocialMedia,
} from "../services/socialMedia.service";
import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";

function Footer() {
 const [contact, setContact] = useState<Contact | null>(null);
 const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
 const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);

 useEffect(() => {
  async function loadData() {
   try {
    const contactResponse = await getContacts();
    setContact(contactResponse.data[0] ?? null);
   } catch (error) {
    console.error("Gagal mengambil data kontak:", error);
   }

   try {
    const schoolProfileResponse = await getSchoolProfile();
    setSchoolProfile(schoolProfileResponse.data);
   } catch (error) {
    console.error("Gagal mengambil profil sekolah:", error);
   }

   try {
    const socialMediaResponse = await getSocialMedias();
    setSocialMedias(socialMediaResponse.data);
   } catch (error) {
    console.error("Gagal mengambil data media sosial:", error);
   }
  }

  loadData();
 }, []);

 return (
  <footer className="bg-amber-700 text-white">
   <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
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

    <div>
     <h3 className="mb-5 text-base font-bold">Kontak Kami</h3>

     {contact ? (
      <div className="space-y-3 text-sm">
       {contact.address && (
        <div className="flex items-start gap-3">
         <MapPin size={18} />
         <span>{contact.address}</span>
        </div>
       )}

       {contact.phone && (
        <div className="flex items-center gap-3">
         <Phone size={18} />
         <span>{contact.phone}</span>
        </div>
       )}

       {contact.email && (
        <div className="flex items-center gap-3">
         <Mail size={18} />
         <span>{contact.email}</span>
        </div>
       )}
      </div>
     ) : (
      <p className="text-sm">Data kontak belum tersedia.</p>
     )}
    </div>

    <div>
     <h3 className="mb-5 text-base font-bold">Ikuti Kami</h3>

     <div className="flex items-center gap-4">
      <a
       href={
        socialMedias.find((item) => item.platform.toLowerCase() === "instagram")
         ?.url || "#"
       }
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Instagram"
       className="transition-opacity hover:opacity-70"
      >
       <FaInstagram size={22} />
      </a>

      <a
       href={
        socialMedias.find((item) => item.platform.toLowerCase() === "facebook")
         ?.url || "#"
       }
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Facebook"
       className="transition-opacity hover:opacity-70"
      >
       <FaFacebook size={22} />
      </a>

      <a
       href={
        socialMedias.find((item) => item.platform.toLowerCase() === "youtube")
         ?.url || "#"
       }
       target="_blank"
       rel="noopener noreferrer"
       aria-label="YouTube"
       className="transition-opacity hover:opacity-70"
      >
       <FaYoutube size={22} />
      </a>
     </div>
    </div>
   </div>

   <div className="border-t border-white/20 py-3 text-center text-xs">
    © 2026 {schoolProfile?.schoolName || "SD Negeri Baros 3"}
   </div>
  </footer>
 );
}

export default Footer;
Footer;
