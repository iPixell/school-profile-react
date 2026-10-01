import { useEffect, useState } from 'react';
import {
 getSchoolProfile,
 type SchoolProfile as SchoolProfileData,
} from "../services/schoolProfile.service";
import {
 getPrincipalHistories,
 type PrincipalHistory,
} from "../services/principalHistory.service";

function SchoolProfile() {
 const [profile, setProfile] = useState<SchoolProfileData | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [principalHistories, setPrincipalHistories] = useState<
  PrincipalHistory[]
 >([]);

 useEffect(() => {
  async function loadData() {
   try {
    const [profileResponse, principalResponse] = await Promise.all([
     getSchoolProfile(),
     getPrincipalHistories(),
    ]);

    setProfile(profileResponse.data);
    setPrincipalHistories(principalResponse.data);
   } catch {
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
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Profil Sekolah</h1>
   </section>

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

     <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64">
      {profile.logoUrl ? (
       <img
        src={profile.logoUrl}
        alt={profile.schoolName}
        className="h-full w-full rounded-xl object-cover"
       />
      ) : (
       <span className="text-sm text-gray-600">Gambar belum tersedia</span>
      )}
     </div>
    </div>
   </section>

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

   <section
    id="kepala-sekolah"
    className="mx-auto max-w-7xl px-6 pb-12 md:pb-16"
   >
    <div className="mb-8 text-center">
     <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
      Riwayat Kepala Sekolah
     </h2>
    </div>

    {principalHistories.length > 0 ? (
     <div className="grid gap-x-10 gap-y-1 md:grid-cols-2">
      {principalHistories.map((item) => (
       <p
        key={item.id}
        className="text-sm font-bold leading-6 text-gray-700 sm:text-base"
       >
        {item.startYear} – {item.endYear ?? "Sekarang"} — {item.name}
       </p>
      ))}
     </div>
    ) : (
     <div className="flex min-h-32 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada data riwayat kepala sekolah.
      </p>
     </div>
    )}
   </section>

   <section id="guru-staff" className="mx-auto max-w-7xl px-6 pb-16">
    <div className="mb-8 text-center">
     <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
      Guru & Tenaga Administrasi
     </h2>
    </div>

    <div className="flex min-h-32 items-center justify-center text-center">
     <p className="text-sm text-gray-500">
      Belum ada data guru dan tenaga administrasi yang ditambahkan.
     </p>
    </div>
   </section>
  </main>
 );
}

export default SchoolProfile;
