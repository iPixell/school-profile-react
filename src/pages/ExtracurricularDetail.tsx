import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

  const [extracurricular, setExtracurricular] =
    useState<Extracurricular | null>(null);
  const [media, setMedia] = useState<ExtracurricularMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const extracurricularId = Number(id);

        if (
          !id ||
          !Number.isInteger(extracurricularId) ||
          extracurricularId <= 0
        ) {
          throw new Error("ID ekstrakurikuler tidak valid.");
        }

        const response = await getExtracurriculars();

        const found = response.data.find(
          (item) => item.id === extracurricularId,
        );

        if (!found) {
          throw new Error("Ekstrakurikuler tidak ditemukan.");
        }

        if (active) {
          setExtracurricular(found);
        }

        try {
          const mediaResponse =
            await getExtracurricularMedia(extracurricularId);

          if (active) {
            setMedia(mediaResponse.data);
          }
        } catch {
          if (active) {
            setMedia([]);
            setError("Dokumentasi gagal dimuat. Silakan coba lagi.");
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Data ekstrakurikuler gagal dimuat.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] p-6 text-sm text-gray-500">
        Memuat dokumentasi...
      </main>
    );
  }

  if (error && !extracurricular) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] p-6 text-sm text-red-600">
        {error}
      </main>
    );
  }

  if (!extracurricular) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-4 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4">
          <Link
            to="/ekstrakurikuler"
            className="text-sm text-orange-600 hover:underline"
          >
            ← Kembali ke Ekstrakurikuler
          </Link>

          <h1 className="mt-3 text-xl font-bold text-gray-950">
            {extracurricular.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Dokumentasi kegiatan ekstrakurikuler{" "}
            {extracurricular.name.toLowerCase()}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
          >
            {error}
          </div>
        )}

        <section className="rounded border border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-base font-bold text-gray-950">
            Dokumentasi Kegiatan
          </h2>

          {media.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={item.url}
                      alt={`Dokumentasi ${extracurricular.name}`}
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="h-52 w-full bg-black object-contain"
                    />
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-32 items-center justify-center rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
              Belum ada dokumentasi untuk ekstrakurikuler ini.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ExtracurricularDetail;
