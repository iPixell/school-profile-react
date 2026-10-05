import React, { useEffect, useState } from 'react';
import {
 getSchoolProfile,
 type SchoolProfile,
} from "../services/schoolProfile.service";
import {
 getAchievements,
 type Achievement,
} from "../services/achievement.service";

function Home() {
 const [profile, setProfile] = useState<SchoolProfile | null>(null);
 const [achievements, setAchievements] = useState<Achievement[]>([]);

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
  async function loadAchievements() {
   try {
    const response = await getAchievements();
    setAchievements(response);
   } catch (error) {
    console.error("Gagal mengambil data prestasi:", error);
   }
  }

  loadAchievements();
 }, []);
 return (
  <main>
   {/* Hero */}
   <section
    className="relative h-[260px] bg-gray-300 bg-cover bg-center sm:h-[300px] md:h-[350px]"
    style={
     profile?.bannerUrl
      ? { backgroundImage: `url(${profile.bannerUrl})` }
      : undefined
    }
   >
    <div className="mx-auto flex h-full max-w-7xl items-center px-6">
     <div className="text-white">
      <p className="mb-2 text-sm sm:text-base">Selamat Datang di</p>

      <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
       {profile?.schoolName || "Nama Sekolah"}
      </h1>

      <p className="mt-2 text-sm sm:text-base">Belajar, Juara, Berkarakter</p>
     </div>
    </div>
   </section>

   {/* Tentang Kami */}
   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <div className="grid items-center gap-8 md:grid-cols-2">
     <div>
      <h2 className="mb-4 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
       Tentang Kami
      </h2>

      <p className="mb-6 max-w-xl text-sm leading-6 text-gray-700 sm:text-base">
       {profile?.shortInfo || "Informasi singkat sekolah belum tersedia."}
      </p>
      <a
       href="/profil-sekolah"
       className="inline-block rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
      >
       Profil Sekolah
      </a>
     </div>

     {/* Foto sekolah */}
     <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64 md:h-52 lg:h-56">
      <span className="text-sm text-gray-600">Gambar belum tersedia</span>
     </div>
    </div>
   </section>

   {/* Visi & Misi */}
   <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
    <div className="grid gap-6 md:grid-cols-2">
     {/* Visi */}
     <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
      <h2 className="mb-4 inline-block border-b-4 border-amber-500 pb-1 text-xl font-bold">
       Visi
      </h2>

      <p className="text-sm leading-6 text-gray-700 sm:text-base">
       {profile?.vision || "Visi sekolah belum tersedia."}
      </p>
     </div>

     {/* Misi */}
     <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
      <h2 className="mb-4 inline-block border-b-4 border-amber-500 pb-1 text-xl font-bold">
       Misi
      </h2>

      {profile?.mission ? (
       <ul className="space-y-2 text-sm leading-6 text-gray-700 sm:text-base">
        {profile.mission.split("\n").map((item, index) => (
         <li key={index} className="flex gap-2">
          <span className="text-amber-500">•</span>
          <span>{item}</span>
         </li>
        ))}
       </ul>
      ) : (
       <p className="text-sm leading-6 text-gray-700 sm:text-base">
        Misi sekolah belum tersedia.
       </p>
      )}
     </div>
    </div>
   </section>

   {/* Prestasi Kejuaraan Terbaru */}
   <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
    <div className="mb-6">
     <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
      Prestasi Kejuaraan Terbaru
     </h2>
    </div>

    {achievements.length > 0 ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...achievements]
       .sort((a, b) => b.year - a.year)
       .slice(0, 3)
       .map((item, index, array) => (
        <article
         key={item.id}
         className={`overflow-hidden rounded-xl bg-white shadow-md ${
          array.length === 3 && index === 2
           ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-full"
           : ""
         }`}
        >
         <div className="flex h-48 items-center justify-center bg-gray-300">
          {item.photoUrl ? (
           <img
            src={item.photoUrl}
            alt={item.competition}
            className="h-full w-full object-cover"
           />
          ) : (
           <span className="text-sm text-gray-600">Gambar belum tersedia</span>
          )}
         </div>

         <div className="p-5">
          <h3 className="mb-3 text-base font-bold text-gray-800">
           {item.competition}
          </h3>

          <div className="space-y-1 text-sm text-gray-500">
           <p>Nama siswa: {item.studentName}</p>
           <p>Peringkat: {item.rank}</p>
           <p>Tingkat: {item.level}</p>
           <p>Tahun: {item.year}</p>
          </div>
         </div>
        </article>
       ))}
     </div>
    ) : (
     <div className="flex min-h-40 items-center justify-center rounded-xl bg-gray-50">
      <p className="text-sm text-gray-500">
       Belum ada data prestasi yang tersedia.
      </p>
     </div>
    )}

    <div className="mt-6 text-right">
     <a
      href="/prestasi"
      className="text-sm font-semibold text-amber-600 hover:text-amber-700"
     >
      Lihat Lebih Banyak →
     </a>
    </div>
   </section>
  </main>
 );
}

export default Home;
