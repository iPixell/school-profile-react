function Achievements() {
 return (
  <main>
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Prestasi</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
     {[1, 2, 3].map((item) => (
      <article
       key={item}
       className="overflow-hidden rounded-xl bg-white shadow-md"
      >
       <div className="flex h-48 items-center justify-center bg-gray-300">
        <span className="text-sm text-gray-600">Gambar belum tersedia</span>
       </div>

       <div className="p-5">
        <h3 className="mb-3 text-base font-bold">
         Data prestasi belum tersedia
        </h3>

        <p className="text-sm text-gray-500">Nama siswa belum tersedia</p>

        <p className="text-sm text-gray-500">
         Tingkat kejuaraan belum tersedia
        </p>

        <p className="text-sm text-gray-500">Tahun belum tersedia</p>
       </div>
      </article>
     ))}
    </div>
   </section>
  </main>
 );
}

export default Achievements;
