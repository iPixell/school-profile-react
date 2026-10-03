
import { useEffect, useState } from "react";
import { getSpmb } from "../services/spmb.service";
import type { Spmb as SpmbType } from "../services/spmb.service";

function SPMB() {
  const [spmb, setSpmb] = useState<SpmbType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpmb = async () => {
      try {
        const response = await getSpmb();
        setSpmb(response.data ?? []);
      } catch (error) {
        console.error("Gagal mengambil data SPMB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpmb();
  }, []);

  return (
    <main>
      <section className="bg-amber-700 py-10 text-center text-white md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">
          Informasi SPMB
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {loading ? (
          <p className="text-center text-gray-500">
            Memuat informasi SPMB...
          </p>
        ) : spmb.length === 0 ? (
          <p className="text-center text-gray-500">
            Informasi SPMB belum tersedia.
          </p>
        ) : (
          <div className="space-y-10">
            {spmb.map((item) => (
              <article
                key={item.id}
                className="grid items-start gap-8 md:grid-cols-2"
              >
                <div>
                  <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
                    {item.title}
                  </h2>

                  <p className="whitespace-pre-line text-sm leading-6 text-gray-700 sm:text-base">
                    {item.description || "Informasi belum tersedia."}
                  </p>

                  {item.portalUrl && (
                    <a
                      href={item.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      Kunjungi Portal SPMB
                    </a>
                  )}
                </div>

                <div>
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="h-52 w-full rounded-xl object-cover sm:h-64"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64">
                      <span className="text-sm text-gray-600">
                        Gambar belum tersedia
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default SPMB;