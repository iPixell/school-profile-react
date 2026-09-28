function Home() {
 return (
  <main>
   {/* Hero */}
   <section className="relative h-[260px] bg-gray-300 sm:h-[300px] md:h-[350px]">
    <div className="mx-auto flex h-full max-w-7xl items-center px-6">
     <div className="text-white">
      <p className="mb-2 text-sm sm:text-base">Selamat Datang di</p>

      <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
       SD NEGERI BAROS 3
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
       SD Negeri Baros 3 adalah sekolah dasar yang berkomitmen mencetak generasi
       muda yang berkarakter, berilmu, berprestasi, dan berwawasan lingkungan.
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
       Visi sekolah belum ditambahkan.
      </p>
     </div>

     {/* Misi */}
     <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
      <h2 className="mb-4 inline-block border-b-4 border-amber-500 pb-1 text-xl font-bold">
       Misi
      </h2>

      <ul className="space-y-3 text-sm leading-6 text-gray-700 sm:text-base">
       <li>• Misi sekolah belum ditambahkan.</li>
      </ul>
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
        <h3 className="mb-3 text-base font-bold">Belum ada data prestasi</h3>

        <p className="text-sm text-gray-500">Nama siswa belum tersedia</p>

        <p className="text-sm text-gray-500">
         Tingkat kejuaraan belum tersedia
        </p>

        <p className="text-sm text-gray-500">Tahun belum tersedia</p>
       </div>
      </article>
     ))}
    </div>

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
