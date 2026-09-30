import { useEffect, useState } from "react";
import {
 Eye,
 LogOut,
 Menu,
 X,
 School,
 Trophy,
 Users,
 Building2,
 ClipboardList,
 MapPin,
 Instagram,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";

const menuItems = [
 {
  label: "Profil Sekolah",
  path: "/admin/profil-sekolah",
  icon: School,
 },
 {
  label: "Ekstrakurikuler",
  path: "/admin/ekstrakurikuler",
  icon: Users,
 },
 {
  label: "Prestasi",
  path: "/admin/prestasi",
  icon: Trophy,
 },
 {
  label: "Sejarah Kepala Sekolah",
  path: "/admin/sejarah-kepala-sekolah",
  icon: Users,
 },
 {
  label: "Guru & Tenaga Administrasi",
  path: "/admin/staff",
  icon: Users,
 },
 {
  label: "Fasilitas",
  path: "/admin/fasilitas",
  icon: Building2,
 },
 {
  label: "SPMB",
  path: "/admin/spmb",
  icon: ClipboardList,
 },
 {
  label: "Kontak",
  path: "/admin/kontak",
  icon: MapPin,
 },
 {
  label: "Sosial Media",
  path: "/admin/sosial-media",
  icon: Instagram,
 },
];

function AdminLayout() {
 const navigate = useNavigate();

 const [isOpen, setIsOpen] = useState(false);
 const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);

 useEffect(() => {
  async function loadSchoolProfile() {
   try {
    const response = await getSchoolProfile();
    setSchoolProfile(response.data);
   } catch (error) {
    console.error("Gagal mengambil profil sekolah:", error);
   }
  }

  loadSchoolProfile();
 }, []);

 const handleLogout = () => {
  navigate("/login");
 };

 return (
  <div className="min-h-screen bg-gray-100">
   {/* Mobile header */}
   <header className="flex items-center justify-between bg-[#B46000] px-5 py-4 text-white lg:hidden">
    <div className="flex items-center gap-3">
     {schoolProfile?.logoUrl ? (
      <img
       src={schoolProfile.logoUrl}
       alt={`Logo ${schoolProfile.schoolName}`}
       className="h-10 w-10 rounded-full object-cover"
      />
     ) : (
      <div className="h-10 w-10 rounded-full bg-gray-300" />
     )}

     <span className="text-sm font-bold">
      {schoolProfile?.schoolName || "SD NEGERI BAROS 3"}
     </span>
    </div>

    <button
     type="button"
     onClick={() => setIsOpen((prev) => !prev)}
     aria-label="Buka menu"
    >
     {isOpen ? <X size={26} /> : <Menu size={26} />}
    </button>
   </header>

   <div className="flex min-h-screen">
    {/* Sidebar */}
    <aside
     className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#B46000] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
     }`}
    >
     <div className="flex h-full flex-col">
      {/* School identity */}
      <div className="px-6 pb-6 pt-8">
       <div className="flex items-center gap-4">
        {schoolProfile?.logoUrl ? (
         <img
          src={schoolProfile.logoUrl}
          alt={`Logo ${schoolProfile.schoolName}`}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
         />
        ) : (
         <div className="h-14 w-14 shrink-0 rounded-full bg-gray-300" />
        )}

        <span className="text-sm font-bold leading-tight">
         {schoolProfile?.schoolName || "SD NEGERI BAROS 3"}
        </span>
       </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-6">
       <div className="space-y-1">
        {menuItems.map((item) => {
         const Icon = item.icon;

         return (
          <NavLink
           key={item.path}
           to={item.path}
           onClick={() => setIsOpen(false)}
           className={({ isActive }) =>
            `flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition ${
             isActive ? "bg-white/15 font-semibold" : "hover:bg-white/10"
            }`
           }
          >
           <Icon size={21} />
           <span>{item.label}</span>
          </NavLink>
         );
        })}
       </div>
      </nav>

      {/* Bottom actions */}
      <div className="space-y-1 px-4 pb-6">
       <button
        type="button"
        onClick={() => {
         setIsOpen(false);
         navigate("/home");
        }}
        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
       >
        <Eye size={21} />
        <span>Lihat Website</span>
       </button>

       <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
       >
        <LogOut size={21} />
        <span>Logout</span>
       </button>
      </div>
     </div>
    </aside>

    {/* Overlay mobile */}
    {isOpen && (
     <button
      type="button"
      aria-label="Tutup menu"
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-40 bg-black/30 lg:hidden"
     />
    )}

    {/* Content */}
    <main className="min-w-0 flex-1 bg-white">
     <Outlet />
    </main>
   </div>
  </div>
 );
}

export default AdminLayout;
