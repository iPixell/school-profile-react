import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
 Building2,
 GraduationCap,
 Trophy,
 Users,
 School,
 Wrench,
 ClipboardList,
 MapPin,
 Share2,
 Eye,
 LogOut,
 Menu,
 X,
 LayoutDashboard,
} from "lucide-react";

import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";

import { logoutAdmin } from "../services/auth.service";

function AdminLayout() {
 const [profile, setProfile] = useState<SchoolProfile | null>(null);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const location = useLocation();

 useEffect(() => {
  async function loadProfile() {
   try {
    const response = await getSchoolProfile();
    setProfile(response.data);
   } catch (error) {
    console.error("Gagal mengambil profil sekolah:", error);
   }
  }

  loadProfile();
 }, []);

 useEffect(() => {
  setSidebarOpen(false);
 }, [location.pathname]);

 const handleLogout = async () => {
  try {
   await logoutAdmin();
   window.location.href = "/login";
  } catch (error) {
   console.error("Gagal logout:", error);
  }
 };

 const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  {
   label: "Profil Sekolah",
   path: "/admin/profil-sekolah",
   icon: Building2,
  },
  {
   label: "Ekstrakurikuler",
   path: "/admin/ekstrakurikuler",
   icon: GraduationCap,
  },
  { label: "Prestasi", path: "/admin/prestasi", icon: Trophy },
  {
   label: "Sejarah Kepala Sekolah",
   path: "/admin/principal-history",
   icon: School,
  },
  {
   label: "Guru & Tenaga Administrasi",
   path: "/admin/staff",
   icon: Users,
  },
  {
   label: "Fasilitas",
   path: "/admin/facilities",
   icon: Wrench,
  },
  { label: "SPMB", path: "/admin/spmb", icon: ClipboardList },
  { label: "Kontak", path: "/admin/contact", icon: MapPin },
  {
   label: "Sosial Media",
   path: "/admin/sosial-media",
   icon: Share2,
  },
 ];

 return (
  <div className="min-h-screen bg-[#f5f5f5]">
   {/* Header mobile */}
   <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#B45F00] px-4 text-white lg:hidden">
    <div className="flex min-w-0 items-center gap-3">
     {profile?.logoUrl ? (
      <img
       src={profile.logoUrl}
       alt="Logo sekolah"
       className="h-10 w-10 rounded-full object-cover"
      />
     ) : (
      <div className="h-10 w-10 rounded-full bg-gray-300" />
     )}

     <span className="truncate text-sm font-bold">
      {profile?.schoolName || "SD NEGERI BAROS 3"}
     </span>
    </div>

    <button
     type="button"
     onClick={() => setSidebarOpen(true)}
     className="rounded-md p-2 hover:bg-white/10"
     aria-label="Buka menu"
    >
     <Menu size={23} />
    </button>
   </header>

   {/* Overlay mobile */}
   {sidebarOpen && (
    <button
     type="button"
     aria-label="Tutup menu"
     onClick={() => setSidebarOpen(false)}
     className="fixed inset-0 z-40 bg-black/40 lg:hidden"
    />
   )}

   {/* Sidebar */}
   <aside
    className={`fixed inset-y-0 left-0 z-50 flex w-[205px] flex-col bg-[#B45F00] text-white transition-transform duration-300 lg:translate-x-0 ${
     sidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`}
   >
    {/* Profil sekolah */}
    <div className="flex min-h-[94px] items-center justify-between px-3">
     <div className="flex min-w-0 items-center gap-3">
      {profile?.logoUrl ? (
       <img
        src={profile.logoUrl}
        alt="Logo sekolah"
        className="h-10 w-10 shrink-0 rounded-full object-cover"
       />
      ) : (
       <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300" />
      )}

      <p className="text-xs font-bold leading-4">
       {profile?.schoolName || "SD NEGERI BAROS 3"}
      </p>
     </div>

     <button
      type="button"
      onClick={() => setSidebarOpen(false)}
      className="rounded p-1 hover:bg-white/10 lg:hidden"
      aria-label="Tutup sidebar"
     >
      <X size={19} />
     </button>
    </div>

    {/* Menu utama */}
    <nav className="mt-3 flex-1 overflow-y-auto px-2">
     <div className="space-y-1">
      {menuItems.map((item) => {
       const Icon = item.icon;

       return (
        <NavLink
         key={item.path}
         to={item.path}
         end={item.end}
         onClick={() => setSidebarOpen(false)}
         className={({ isActive }) =>
          `flex min-h-[39px] items-center gap-3 rounded-lg px-2 text-[11px] leading-[15px] transition ${
           isActive
            ? "bg-white/20 font-semibold"
            : "font-normal hover:bg-white/10"
          }`
         }
        >
         <Icon size={15} className="shrink-0" />
         <span>{item.label}</span>
        </NavLink>
       );
      })}
     </div>
    </nav>

    {/* Menu bawah */}
    <div className="space-y-1 px-2 pb-5 pt-3">
     <NavLink
      to="/home"
      onClick={() => setSidebarOpen(false)}
      className="flex min-h-[39px] items-center gap-3 rounded-lg px-2 text-[11px] hover:bg-white/10"
     >
      <Eye size={15} />
      <span>Lihat Website</span>
     </NavLink>

     <button
      type="button"
      onClick={handleLogout}
      className="flex min-h-[39px] w-full items-center gap-3 rounded-lg px-2 text-left text-[11px] hover:bg-white/10"
     >
      <LogOut size={15} />
      <span>Logout</span>
     </button>
    </div>
   </aside>

   {/* Konten halaman */}
   <div className="min-h-screen lg:pl-[205px]">
    <main className="min-w-0 p-3 sm:p-5 lg:p-6">
     <div className="mx-auto w-full max-w-[1400px]">
      <Outlet />
     </div>
    </main>
   </div>
  </div>
 );
}

export default AdminLayout;
