function SPMB() {
  return (
    <main>
      <section className="bg-amber-700 py-10 text-center text-white md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">
          Informasi SPMB
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
              Informasi SPMB
            </h2>

            <p className="text-sm leading-6 text-gray-700 sm:text-base">
              Informasi mengenai Seleksi Penerimaan Murid Baru
              belum tersedia.
            </p>

            <a
              href="#"
              className="mt-6 inline-block rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Kunjungi Portal SPMB
            </a>
          </div>

          <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64">
            <span className="text-sm text-gray-600">
              Gambar belum tersedia
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SPMB;