import React, { useEffect, useState } from 'react';
import {
 getSchoolProfile,
 type SchoolProfile as SchoolProfileData,
} from "../services/schoolProfile.service";
import {
 getPrincipalHistories,
 type PrincipalHistory,
} from "../services/principalHistory.service";
import { getStaff, type Staff } from "../services/staff.service";

function SchoolProfile() {
 const [profile, setProfile] = useState<SchoolProfileData | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const [principalHistories, setPrincipalHistories] = useState<
  PrincipalHistory[]
 >([]);

 const [staff, setStaff] = useState<Staff[]>([]);

 useEffect(() => {
  async function loadData() {
   try {
    const [profileResponse, principalResponse, staffResponse] =
     await Promise.all([
      getSchoolProfile(),
      getPrincipalHistories(),
      getStaff(),
     ]);

    setProfile(profileResponse.data);
    setPrincipalHistories(principalResponse.data);
    setStaff(staffResponse.data);
   } catch (error) {
    console.error("Gagal mengambil data profil sekolah:", error);
    setError("Gagal mengambil data profil sekolah.");
   } finally {
    setLoading(false);
   }
  }

  loadData();
 }, []);

 if (loading) {
  return (
   <main className="flex min-h-96 items-center justify-center">
    <p className="text-sm text-gray-500">Memuat data...</p>
   </main>
  );
 }

 if (error) {
  return (
   <main className="flex min-h-96 items-center justify-center">
    <p className="text-sm text-red-500">{error}</p>
   </main>
  );
 }

 if (!profile) {
  return (
   <main className="flex min-h-96 items-center justify-center">
    <p className="text-sm text-gray-500">Data profil sekolah belum tersedia.</p>
   </main>
  );
 }

 return (
  <main>
   {/* Header */}
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Profil Sekolah</h1>
   </section>

   {/* Tentang Sekolah */}
   <section
    id="tentang-sekolah"
    className="mx-auto max-w-7xl px-6 py-12 md:py-16"
   >
    <div className="grid items-start gap-8 md:grid-cols-2">
     <div>
      <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
       Tentang Sekolah
      </h2>

      <p className="text-sm leading-6 text-gray-700 sm:text-base">
       {profile.about || "Informasi tentang sekolah belum tersedia."}
      </p>
     </div>

     <div className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-gray-300 sm:h-64">
      {profile.logoUrl ? (
       <img
        src={profile.logoUrl}
        alt={profile.schoolName}
        className="h-full w-full object-cover"
       />
      ) : (
       <span className="text-sm text-gray-600">Gambar belum tersedia</span>
      )}
     </div>
    </div>
   </section>

   {/* Sejarah */}
   <section id="sejarah" className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
    <div className="grid items-start gap-8 md:grid-cols-2">
     <div>
      <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
       Sejarah Sekolah
      </h2>

      <p className="text-sm leading-6 text-gray-700 sm:text-base">
       {profile.history || "Sejarah sekolah belum tersedia."}
      </p>
     </div>

     <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64">
      <span className="text-sm text-gray-600">Gambar belum tersedia</span>
     </div>
    </div>
   </section>

   {/* Visi & Misi */}
   <section id="visi-misi" className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
    <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
     Visi & Misi
    </h2>

    <div className="space-y-6 text-sm leading-6 text-gray-700 sm:text-base">
     {/* Visi */}
     <div>
      <h3 className="mb-2 font-bold">Visi</h3>

      <p>{profile.vision || "Visi sekolah belum tersedia."}</p>
     </div>

     {/* Misi */}
     <div>
      <h3 className="mb-2 font-bold">Misi</h3>

      {profile.mission ? (
       <ul className="space-y-2">
        {profile.mission.split("\n").map((item, index) => (
         <li key={index}>• {item}</li>
        ))}
       </ul>
      ) : (
       <p>Misi sekolah belum tersedia.</p>
      )}
     </div>
    </div>
   </section>

   {/* Riwayat Kepala Sekolah */}
   <section
    id="kepala-sekolah"
    className="mx-auto max-w-4xl px-6 pb-12 md:pb-16"
   >
    <div className="mb-8 text-center">
     <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold text-gray-800">
      Pejabat Kepala Sekolah
     </h2>
    </div>

    {principalHistories.length > 0 ? (
     <div className="mx-auto max-w-3xl">
      <ul className="space-y-3">
       {principalHistories.map((item) => (
        <li
         key={item.id}
         className="flex items-start gap-3 text-sm leading-6 text-gray-700 sm:text-base"
        >
         <span className="mt-0.5 font-bold text-amber-600">•</span>

         <span>
          <span className="font-medium">{item.period}</span>
          {" — "}
          <span className="font-semibold text-gray-800">{item.name}</span>
         </span>
        </li>
       ))}
      </ul>
     </div>
    ) : (
     <div className="flex min-h-32 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada data pejabat kepala sekolah.
      </p>
     </div>
    )}
   </section>

   {/* Guru & Tenaga Administrasi */}
   <section id="guru-staff" className="mx-auto max-w-7xl px-6 pb-16">
    <div className="mb-8 text-center">
     <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
      Guru & Tenaga Administrasi
     </h2>
    </div>

    {staff.length > 0 ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {staff.map((item) => (
       <article
        key={item.id}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
       >
        {/* Foto */}
        <div className="flex h-56 items-center justify-center bg-gray-300">
         {item.photoUrl ? (
          <img
           src={item.photoUrl}
           alt={item.name}
           className="h-full w-full object-cover"
          />
         ) : (
          <span className="text-sm text-gray-600">Gambar belum tersedia</span>
         )}
        </div>

        {/* Informasi */}
        <div className="p-5">
         <h3 className="text-base font-bold text-gray-800">{item.name}</h3>

         <p className="mt-1 text-sm text-gray-600">{item.position}</p>

         {item.type === "TEACHER" && item.classTaught && (
          <p className="mt-1 text-sm text-gray-600">
           Kelas: {item.classTaught}
          </p>
         )}

         <p className="mt-2 text-xs font-medium text-amber-600">
          {item.type === "TEACHER" ? "Guru" : "Tenaga Administrasi"}
         </p>
        </div>
       </article>
      ))}
     </div>
    ) : (
     <div className="flex min-h-32 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada data guru dan tenaga administrasi yang ditambahkan.
      </p>
     </div>
    )}
   </section>
  </main>
 );
}

export default SchoolProfile;
