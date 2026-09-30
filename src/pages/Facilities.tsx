import React, { useEffect, useState } from 'react';
import { getFacilities, type Facility } from "../services/facility.service";

function Facilities() {
 const [facilities, setFacilities] = useState<Facility[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  async function loadData() {
   try {
    const response = await getFacilities();
    setFacilities(response.data);
   } catch (error) {
    console.error("Gagal mengambil data sarana & prasarana:", error);
    setError("Gagal mengambil data sarana & prasarana.");
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
    <h1 className="text-2xl font-bold md:text-3xl">Sarana & Prasarana</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    {facilities.length > 0 ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {facilities.map((item) => (
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

         <p className="mt-2 text-sm leading-6 text-gray-600">
          {item.description || "Deskripsi belum tersedia."}
         </p>
        </div>
       </article>
      ))}
     </div>
    ) : (
     <div className="flex min-h-40 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada data sarana & prasarana yang ditambahkan.
      </p>
     </div>
    )}
   </section>
  </main>
 );
}

export default Facilities;
