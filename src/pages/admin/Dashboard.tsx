import { useEffect, useMemo, useState } from "react";
import {
 Building2,
 GraduationCap,
 Plus,
 School,
 Trophy,
 Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
 getExtracurriculars,
 type Extracurricular,
} from "../../services/extracurricular.service";

import {
 getAchievements,
 type Achievement,
} from "../../services/achievement.service";

import {
 getPrincipalHistories,
 type PrincipalHistory,
} from "../../services/principalHistory.service";

import { getStaff, type Staff } from "../../services/staff.service";

function useCountUp(target: number, duration = 900) {
 const [count, setCount] = useState(0);

 useEffect(() => {
  if (target <= 0) {
   setCount(0);
   return;
  }

  let startTime: number | null = null;
  let animationFrame: number;

  const animate = (currentTime: number) => {
   if (startTime === null) {
    startTime = currentTime;
   }

   const elapsed = currentTime - startTime;
   const progress = Math.min(elapsed / duration, 1);

   // Ease-out supaya awal cepat lalu sedikit melambat di akhir
   const easedProgress = 1 - Math.pow(1 - progress, 3);

   setCount(Math.floor(easedProgress * target));

   if (progress < 1) {
    animationFrame = requestAnimationFrame(animate);
   } else {
    setCount(target);
   }
  };

  animationFrame = requestAnimationFrame(animate);

  return () => {
   cancelAnimationFrame(animationFrame);
  };
 }, [target, duration]);

 return count;
}

function Dashboard() {
 const navigate = useNavigate();

 const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(
  [],
 );
 const [achievements, setAchievements] = useState<Achievement[]>([]);
 const [principalHistories, setPrincipalHistories] = useState<
  PrincipalHistory[]
 >([]);
 const [staff, setStaff] = useState<Staff[]>([]);

 const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function loadDashboard() {
   try {
    setLoading(true);

    const [
     extracurricularResponse,
     achievementResponse,
     principalHistoryResponse,
     staffResponse,
    ] = await Promise.all([
     getExtracurriculars(),
     getAchievements(),
     getPrincipalHistories(),
     getStaff(),
    ]);

    setExtracurriculars(extracurricularResponse.data);
    setAchievements(achievementResponse);
    setPrincipalHistories(principalHistoryResponse.data);
    setStaff(staffResponse.data);
   } catch (error) {
    console.error("Gagal mengambil data dashboard:", error);
   } finally {
    setLoading(false);
   }
  }

  void loadDashboard();
 }, []);

 const extracurricularCount = useCountUp(loading ? 0 : extracurriculars.length);

 const achievementCount = useCountUp(loading ? 0 : achievements.length);

 const principalHistoryCount = useCountUp(
  loading ? 0 : principalHistories.length,
 );

 const staffCount = useCountUp(loading ? 0 : staff.length);

 const recentData = useMemo(() => {
  const data = [
   ...extracurriculars.map((item) => ({
    type: "Ekstrakurikuler",
    name: item.name,
    date: item.createdAt,
   })),

   ...achievements.map((item) => ({
    type: "Prestasi",
    name: item.competition,
    date: item.createdAt,
   })),

   ...staff.map((item) => ({
    type: "Staff",
    name: item.name,
    date: item.createdAt,
   })),

   ...principalHistories.map((item) => ({
    type: "Kepala Sekolah",
    name: item.name,
    date: item.createdAt,
   })),
  ];

  return data
   .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 5);
 }, [extracurriculars, achievements, staff, principalHistories]);

 const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
   day: "2-digit",
   month: "2-digit",
   year: "numeric",
  });
 };

 const statCards = [
  {
   label: "Ekstrakurikuler",
   value: extracurricularCount,
   icon: GraduationCap,
  },
  {
   label: "Prestasi",
   value: achievementCount,
   icon: Trophy,
  },
  {
   label: "Kepala Sekolah",
   value: principalHistoryCount,
   icon: School,
  },
  {
   label: "Staff",
   value: staffCount,
   icon: Users,
  },
 ];

 const quickActions = [
  {
   label: "Tambah Ekstrakurikuler",
   path: "/admin/ekstrakurikuler",
  },
  {
   label: "Tambah Prestasi",
   path: "/admin/prestasi",
  },
  {
   label: "Tambah Kepala Sekolah",
   path: "/admin/principal-history",
  },
  {
   label: "Tambah Staff",
   path: "/admin/staff",
  },
  {
   label: "Tambah Fasilitas",
   path: "/admin/facilities",
  },
 ];

 return (
  <main className="min-w-0">
   {/* Header */}
   <header className="mb-6 sm:mb-7">
    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>

    <p className="mt-2 text-sm text-gray-500 sm:text-base">
     Selamat datang, Admin!
    </p>
   </header>

   {/* Statistik */}
   <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {statCards.map((item) => {
     const Icon = item.icon;

     return (
      <div
       key={item.label}
       className="border border-gray-300 bg-white px-4 py-4 sm:px-5 sm:py-5"
      >
       <div className="flex items-center gap-3">
        <Icon size={19} className="shrink-0 text-[#B45F00]" />

        <p className="text-sm font-medium text-gray-500">{item.label}</p>
       </div>

       <p className="mt-3 text-3xl font-bold text-gray-900 sm:mt-4 sm:text-4xl">
        {loading ? "..." : item.value}
       </p>
      </div>
     );
    })}
   </section>

   {/* Data terbaru + Quick Action */}
   <section className="mt-6 grid gap-5 lg:mt-8 xl:grid-cols-[minmax(0,1fr)_315px]">
    {/* Data Terbaru */}
    <div className="min-w-0 overflow-hidden border border-gray-300 bg-white">
     <div className="border-b border-gray-300 px-4 py-4 sm:px-5">
      <h2 className="text-lg font-bold text-gray-900">Data Terbaru</h2>
     </div>

     {/* Desktop / Tablet: Table */}
     <div className="hidden overflow-x-auto px-4 py-4 sm:block">
      <table className="w-full min-w-[560px] border-collapse">
       <thead>
        <tr className="bg-[#F5E9DA]">
         <th className="border border-gray-400 px-3 py-3 text-left text-sm font-semibold text-gray-800 sm:px-4">
          Jenis
         </th>

         <th className="border border-gray-400 px-3 py-3 text-left text-sm font-semibold text-gray-800 sm:px-4">
          Nama
         </th>

         <th className="border border-gray-400 px-3 py-3 text-left text-sm font-semibold text-gray-800 sm:px-4">
          Tanggal
         </th>
        </tr>
       </thead>

       <tbody>
        {loading ? (
         <tr>
          <td
           colSpan={3}
           className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500"
          >
           Memuat data...
          </td>
         </tr>
        ) : recentData.length === 0 ? (
         <tr>
          <td
           colSpan={3}
           className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500"
          >
           Belum ada data.
          </td>
         </tr>
        ) : (
         recentData.map((item, index) => (
          <tr key={`${item.type}-${item.name}-${index}`}>
           <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 sm:px-4">
            {item.type}
           </td>

           <td className="border border-gray-300 px-3 py-3 text-sm font-medium text-gray-800 sm:px-4">
            {item.name}
           </td>

           <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 sm:px-4">
            {formatDate(item.date)}
           </td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     {/* Mobile: Card */}
     <div className="space-y-3 p-4 sm:hidden">
      {loading ? (
       <div className="py-8 text-center text-sm text-gray-500">
        Memuat data...
       </div>
      ) : recentData.length === 0 ? (
       <div className="py-8 text-center text-sm text-gray-500">
        Belum ada data.
       </div>
      ) : (
       recentData.map((item, index) => (
        <div
         key={`${item.type}-${item.name}-${index}`}
         className="rounded-lg border border-gray-300 bg-white p-3"
        >
         <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
           <p className="text-xs font-medium text-gray-500">Jenis</p>

           <p className="mt-1 text-sm font-semibold text-gray-800">
            {item.type}
           </p>
          </div>

          <p className="shrink-0 text-xs text-gray-500">
           {formatDate(item.date)}
          </p>
         </div>

         <div className="mt-3">
          <p className="text-xs font-medium text-gray-500">Nama</p>

          <p className="mt-1 break-words text-sm font-medium text-gray-900">
           {item.name}
          </p>
         </div>
        </div>
       ))
      )}
     </div>
    </div>

    {/* Quick Action */}
    <div className="border border-gray-300 bg-white">
     <div className="border-b border-gray-300 px-4 py-4 sm:px-5">
      <h2 className="text-lg font-bold text-gray-900">Quick Action</h2>
     </div>

     <div className="space-y-3 p-4 sm:p-5">
      {quickActions.map((item) => (
       <button
        key={item.label}
        type="button"
        onClick={() => navigate(item.path)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-lg bg-[#F0C86B] px-4 text-left text-sm font-semibold text-white transition hover:bg-[#E9B94F]"
       >
        <span className="min-w-0 truncate">{item.label}</span>

        <Plus size={20} className="shrink-0" />
       </button>
      ))}
     </div>
    </div>
   </section>
  </main>
 );
}

export default Dashboard;
