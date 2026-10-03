import { useEffect, useState } from "react";
import { getFacilities } from "../services/facility.service";
import type { Facility } from "../services/facility.service";

function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getFacilities();
        setFacilities(response.data ?? []);
      } catch (error) {
        console.error("Gagal mengambil data fasilitas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <main>
      <section className="bg-amber-700 py-10 text-center text-white md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">
          Sarana & Prasarana
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {loading ? (
          <p className="text-center text-gray-500">
            Memuat data fasilitas...
          </p>
        ) : facilities.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada data sarana & prasarana yang ditambahkan.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <article
                key={facility.id}
                className="overflow-hidden rounded-xl bg-white shadow-md"
              >
                {facility.photoUrl ? (
                  <img
                    src={facility.photoUrl}
                    alt={facility.name}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-300">
                    <span className="text-sm text-gray-600">
                      Gambar belum tersedia
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-lg font-semibold">
                    {facility.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {facility.description || "Deskripsi belum tersedia."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Facilities;