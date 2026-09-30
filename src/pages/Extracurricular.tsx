import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
 getExtracurriculars,
 type Extracurricular as ExtracurricularData,
} from "../services/extracurricular.service";

function Extracurricular() {
 const [extracurriculars, setExtracurriculars] = useState<
  ExtracurricularData[]
 >([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  async function loadData() {
   try {
    const response = await getExtracurriculars();
    setExtracurriculars(response.data);
   } catch (error) {
    console.error("Gagal mengambil data ekstrakurikuler:", error);
    setError("Gagal mengambil data ekstrakurikuler.");
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
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Ekstrakurikuler</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    {extracurriculars.length > 0 ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {extracurriculars.map((item) => (
       <article
        key={item.id}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
       >
        <div className="flex h-52 items-center justify-center bg-gray-300">
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

        <div className="p-5">
         <h2 className="text-base font-bold text-gray-800">{item.name}</h2>

         <Link
          to={`/ekstrakurikuler/${item.id}`}
          className="mt-4 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700"
         >
          Lihat Dokumentasi Kegiatan
         </Link>
        </div>
       </article>
      ))}
     </div>
    ) : (
     <div className="flex min-h-40 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada data ekstrakurikuler yang ditambahkan.
      </p>
     </div>
    )}
   </section>
  </main>
 );
}

export default Extracurricular;
