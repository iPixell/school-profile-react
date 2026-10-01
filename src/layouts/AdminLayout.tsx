import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
 ArrowLeft,
} from "lucide-react";

import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";

function AdminLayout() {
 const navigate = useNavigate();

 const [profile, setProfile] = useState<SchoolProfile | null>(null);
 const [sidebarOpen, setSidebarOpen] = useState(false);

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

 const handleLogout = async () => {
  try {
   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

   await fetch(`${apiUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
   });
  } catch (error) {
   console.error("Gagal logout:", error);
  } finally {
   sessionStorage.removeItem("accessToken");
   localStorage.removeItem("rememberMe");
   navigate("/login", { replace: true });
  }
 };

 const menuItems = [
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
  {
   label: "Prestasi",
   path: "/admin/prestasi",
   icon: Trophy,
  },
  {
   label: "Riwayat Kepala Sekolah",
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
   path: "/admin/fasilitas",
   icon: Wrench,
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
   icon: Share2,
  },
 ];

 return (
  <div className="min-h-screen bg-[#f5f5f5]">
   {/* =========================
          MOBILE HEADER
      ========================== */}
   <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#B46000] px-4 text-white lg:hidden">
    <div className="flex min-w-0 items-center gap-3">
     {profile?.logoUrl ? (
      <img
       src={profile.logoUrl}
       alt={profile.schoolName}
       className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
     ) : (
      <div className="h-9 w-9 shrink-0 rounded-full bg-gray-300" />
     )}

     <span className="truncate text-sm font-bold">
      {profile?.schoolName || "Admin Panel"}
     </span>
    </div>

    <button
     type="button"
     onClick={() => setSidebarOpen((prev) => !prev)}
     className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition hover:bg-white/10"
     aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
    >
     {sidebarOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
    </button>
   </header>

   {/* =========================
          MOBILE OVERLAY
      ========================== */}
   {sidebarOpen && (
    <button
     type="button"
     aria-label="Tutup sidebar"
     onClick={() => setSidebarOpen(false)}
     className="fixed inset-0 z-40 bg-black/40 lg:hidden"
    />
   )}

   {/* =========================
          SIDEBAR
      ========================== */}
   <aside
    className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col bg-[#B46000] text-white transition-transform duration-200 lg:translate-x-0 ${
     sidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`}
   >
    {/* School identity */}
    <div className="flex items-center gap-3 px-5 py-6">
     {profile?.logoUrl ? (
      <img
       src={profile.logoUrl}
       alt={profile.schoolName}
       className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
     ) : (
      <div className="h-12 w-12 shrink-0 rounded-full bg-gray-300" />
     )}

     <p className="text-sm font-bold leading-5">
      {profile?.schoolName || "SD NEGERI BAROS 3"}
     </p>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto px-3 pb-4">
     <div className="space-y-1">
      {menuItems.map((item) => {
       const Icon = item.icon;

       return (
        <NavLink
         key={item.path}
         to={item.path}
         onClick={() => setSidebarOpen(false)}
         className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
           isActive ? "bg-white/15 font-semibold" : "hover:bg-white/10"
          }`
         }
        >
         <Icon size={18} />
         <span>{item.label}</span>
        </NavLink>
       );
      })}
     </div>
    </nav>

    {/* Bottom menu */}
    <div className="space-y-1 border-t border-white/10 px-3 py-4">
     <NavLink
      to="/home"
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition hover:bg-white/10"
     >
      <Eye size={18} />
      <span>Lihat Website</span>
     </NavLink>

     <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-white/10"
     >
      <LogOut size={18} />
      <span>Logout</span>
     </button>
    </div>
   </aside>

   {/* =========================
          MAIN CONTENT
      ========================== */}
   <div className="min-h-screen lg:pl-[250px]">
    <main className="p-3 sm:p-5 lg:p-8">
     <div className="mx-auto max-w-[1400px]">
      <Outlet />
     </div>
    </main>
   </div>
  </div>
 );
}

export default AdminLayout;
