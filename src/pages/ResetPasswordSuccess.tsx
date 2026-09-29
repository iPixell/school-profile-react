import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

function ResetPasswordSuccess() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-5 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white px-6 py-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">

        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
            LOGO
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#B46000]/10">
            <CheckCircle size={50} className="text-[#B46000]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Password berhasil direset!
        </h1>

        <p className="mt-4 text-sm leading-6 text-gray-500">
          Password Anda telah berhasil diubah. Silakan login dengan password
          baru Anda.
        </p>

        <Link
          to="/login"
          className="mt-8 block w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00]"
        >
          Login Sekarang
        </Link>
      </section>
    </main>
  );
}

export default ResetPasswordSuccess;
