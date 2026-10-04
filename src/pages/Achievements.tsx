import React, { useEffect, useState } from 'react';
import {
 getAchievements,
 type Achievement,
} from "../services/achievement.service";

function Achievements() {
 const [achievements, setAchievements] = useState<Achievement[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  async function loadData() {
   try {
    const response = await getAchievements();
    setAchievements(response);
   } catch (error) {
    console.error("Gagal mengambil data prestasi:", error);
    setError("Gagal mengambil data prestasi.");
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

 return (
  <main>
   {/* Header */}
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Prestasi Sekolah</h1>
   </section>

   {/* Daftar prestasi */}
   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    {achievements.length > 0 ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...achievements]
       .sort((a, b) => {
        if (b.year !== a.year) {
         return b.year - a.year;
        }

        return (
         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
       })
       .map((item) => (
        <article
         key={item.id}
         className="overflow-hidden rounded-xl bg-white shadow-sm"
        >
         <div className="flex h-52 items-center justify-center bg-gray-300">
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
          <h2 className="mb-4 text-base font-bold text-gray-800">
           {item.competition}
          </h2>

          <div className="space-y-2 text-sm text-gray-600">
           <p>
            <span className="font-bold">Nama siswa:</span> {item.studentName}
           </p>

           <p>
            <span className="font-bold">Peringkat:</span> {item.rank}
           </p>

           <p>
            <span className="font-bold">Tingkat:</span> {item.level}
           </p>

           <p>
            <span className="font-bold">Tahun:</span> {item.year}
           </p>
          </div>
         </div>
        </article>
       ))}
     </div>
    ) : (
     <div className="flex min-h-40 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada data prestasi yang ditambahkan.
      </p>
     </div>
    )}
   </section>
  </main>
 );
}

export default Achievements;
