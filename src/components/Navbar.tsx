import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Profil Sekolah", path: "/profil-sekolah" },
  { label: "Ekstrakurikuler", path: "/ekstrakurikuler" },
  { label: "Sarana & Prasarana", path: "/sarana-prasarana" },
  { label: "Informasi SPMB", path: "/spmb" },
  { label: "Kontak Kami", path: "/kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            LOGO
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide text-slate-900">
              NAMA SEKOLAH
            </p>

            <p className="text-xs text-slate-500">
              School Profile
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-[14px] font-medium text-slate-700 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-lg p-2 text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Menu"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-slate-100 bg-white px-6 py-3 shadow-lg lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block border-b border-slate-100 py-4 text-sm font-medium text-slate-700 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}