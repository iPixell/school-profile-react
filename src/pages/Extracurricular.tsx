import { Link } from 'react-router-dom';

function Extracurricular() {
 return (
  <main>
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Ekstrakurikuler</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
     {[1, 2, 3].map((item) => (
      <article
       key={item}
       className="overflow-hidden rounded-xl bg-white shadow-md"
      >
       <div className="flex h-52 items-center justify-center bg-gray-300">
        <span className="text-sm text-gray-600">Gambar belum tersedia</span>
       </div>

       <div className="p-5 text-center">
        <h2 className="text-lg font-semibold">
         Data ekstrakurikuler belum tersedia
        </h2>

        <p className="mt-2 text-sm text-gray-500">
         Belum ada data yang ditambahkan.
        </p>

        <Link
         to={`/ekstrakurikuler/${item}`}
         className="mt-4 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
         Lihat Dokumentasi Kegiatan
        </Link>
       </div>
      </article>
     ))}
    </div>
   </section>
  </main>
 );
}

export default Extracurricular;
