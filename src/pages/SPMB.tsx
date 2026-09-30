import React, { useEffect, useState } from 'react';
import { getSpmb, type Spmb as SpmbData } from "../services/spmb.service";

function SPMB() {
 const [spmb, setSpmb] = useState<SpmbData | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  async function loadData() {
   try {
    const response = await getSpmb();
    setSpmb(response.data[0] ?? null);
   } catch (error) {
    console.error("Gagal mengambil informasi SPMB:", error);
    setError("Gagal mengambil informasi SPMB.");
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
    <h1 className="text-2xl font-bold md:text-3xl">Informasi SPMB</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    {spmb ? (
     <div className="grid items-start gap-8 md:grid-cols-2">
      <div>
       <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
        {spmb.title}
       </h2>

       <p className="text-sm leading-6 text-gray-700 sm:text-base">
        {spmb.description || "Informasi SPMB belum tersedia."}
       </p>

       {spmb.portalUrl && (
        <a
         href={spmb.portalUrl}
         target="_blank"
         rel="noopener noreferrer"
         className="mt-6 inline-block rounded-md bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
        >
         Kunjungi Portal SPMB
        </a>
       )}
      </div>

      <div className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-gray-300 sm:h-64">
       {spmb.photoUrl ? (
        <img
         src={spmb.photoUrl}
         alt={spmb.title}
         className="h-full w-full object-cover"
        />
       ) : (
        <span className="text-sm text-gray-600">Gambar belum tersedia</span>
       )}
      </div>
     </div>
    ) : (
     <div className="flex min-h-40 items-center justify-center text-center">
      <p className="text-sm text-gray-500">Informasi SPMB belum tersedia.</p>
     </div>
    )}
   </section>
  </main>
 );
}

export default SPMB;
