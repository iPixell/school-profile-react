import React, { useEffect, useState } from 'react';
import { Menu, X } from "lucide-react";
import { NavLink } from 'react-router-dom';
import { getSchoolProfile } from "../services/schoolProfile.service";

const navItems = [
 { label: "Home", path: "/" },
 { label: "Profil Sekolah", path: "/profil-sekolah" },
 { label: "Ekstrakurikuler", path: "/ekstrakurikuler" },
 { label: "Sarana & Prasarana", path: "/sarana-prasarana" },
 { label: "Informasi SPMB", path: "/spmb" },
 { label: "Kontak Kami", path: "/kontak" },
];

function Navbar() {
 const [isOpen, setIsOpen] = useState(false);
 const [schoolName, setSchoolName] = useState("SD NEGERI BAROS 3");
 const [logoUrl, setLogoUrl] = useState<string | null>(null);

 useEffect(() => {
  async function loadSchoolProfile() {
   try {
    const response = await getSchoolProfile();

    setSchoolName(response.data.schoolName);
    setLogoUrl(response.data.logoUrl);
   } catch (error) {
    console.error("Gagal mengambil profil sekolah:", error);
   }
  }

  loadSchoolProfile();
 }, []);

 return (
  <header className="border-b border-gray-100 bg-white">
   <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    {/* Logo + Nama Sekolah */}
    <NavLink to="/" className="flex items-center gap-3">
     {logoUrl ? (
      <img
       src={logoUrl}
       alt={`Logo ${schoolName}`}
       className="h-10 w-10 rounded-full object-cover"
      />
     ) : (
      <div className="h-10 w-10 rounded-full bg-gray-200" />
     )}

     <span className="text-sm font-bold">{schoolName}</span>
    </NavLink>

    {/* Desktop */}
    <nav className="hidden items-center gap-7 md:flex">
     {navItems.map((item) => (
      <NavLink
       key={item.path}
       to={item.path}
       className={({ isActive }) =>
        `text-sm font-medium ${
         isActive ? "text-amber-600" : "text-gray-700 hover:text-amber-600"
        }`
       }
      >
       {item.label}
      </NavLink>
     ))}
    </nav>

    {/* Mobile */}
    <button
     type="button"
     className="md:hidden"
     onClick={() => setIsOpen(!isOpen)}
     aria-label="Toggle menu"
    >
     {isOpen ? <X size={25} /> : <Menu size={25} />}
    </button>
   </div>

   {/* Mobile Menu */}
   {isOpen && (
    <nav className="border-t border-gray-100 px-6 py-4 md:hidden">
     <div className="flex flex-col gap-4">
      {navItems.map((item) => (
       <NavLink
        key={item.path}
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
         `text-sm font-medium ${isActive ? "text-amber-600" : "text-gray-700"}`
        }
       >
        {item.label}
       </NavLink>
      ))}
     </div>
    </nav>
   )}
  </header>
 );
}

export default Navbar;
