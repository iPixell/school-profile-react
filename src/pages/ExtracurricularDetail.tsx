import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
 getExtracurriculars,
 type Extracurricular,
} from "../services/extracurricular.service";
import {
 getExtracurricularMedia,
 type ExtracurricularMedia,
} from "../services/extracurricularMedia.service";

function ExtracurricularDetail() {
 const { id } = useParams();

 const [extracurricular, setExtracurricular] = useState<Extracurricular | null>(
  null,
 );
 const [media, setMedia] = useState<ExtracurricularMedia[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  async function loadData() {
   try {
    const extracurricularId = Number(id);

    if (!Number.isInteger(extracurricularId)) {
     throw new Error("ID ekstrakurikuler tidak valid.");
    }

    // Ambil data ekstrakurikuler terlebih dahulu
    const extracurricularResponse = await getExtracurriculars();

    const foundExtracurricular = extracurricularResponse.data.find(
     (item) => item.id === extracurricularId,
    );

    if (!foundExtracurricular) {
     throw new Error("Ekstrakurikuler tidak ditemukan.");
    }

    setExtracurricular(foundExtracurricular);

    // Dokumentasi boleh kosong
    try {
     const mediaResponse = await getExtracurricularMedia(extracurricularId);

     setMedia(mediaResponse.data);
    } catch (mediaError) {
     console.error("Belum ada dokumentasi ekstrakurikuler:", mediaError);

     setMedia([]);
    }
   } catch (error) {
    console.error("Gagal mengambil data ekstrakurikuler:", error);

    setError("Data ekstrakurikuler tidak ditemukan.");
   } finally {
    setLoading(false);
   }
  }

  loadData();
 }, [id]);

 if (loading) {
  return (
   <main className="flex min-h-96 items-center justify-center">
    <p className="text-sm text-gray-500">Memuat data...</p>
   </main>
  );
 }

 if (error || !extracurricular) {
  return (
   <main className="flex min-h-96 items-center justify-center">
    <p className="text-sm text-red-500">
     {error || "Data ekstrakurikuler tidak ditemukan."}
    </p>
   </main>
  );
 }

 return (
  <main>
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">
     Dokumentasi {extracurricular.name}
    </h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    {media.length > 0 ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item) => (
       <article
        key={item.id}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
       >
        {item.type === "IMAGE" ? (
         <img
          src={item.url}
          alt={`Dokumentasi ${extracurricular.name}`}
          className="h-56 w-full object-cover"
         />
        ) : (
         <video src={item.url} controls className="h-56 w-full object-cover" />
        )}
       </article>
      ))}
     </div>
    ) : (
     <div className="flex min-h-60 items-center justify-center text-center">
      <p className="text-sm text-gray-500">
       Belum ada dokumentasi yang tersedia.
      </p>
     </div>
    )}
   </section>
  </main>
 );
}

export default ExtracurricularDetail;
