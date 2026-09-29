import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-5 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">

        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
            LOGO
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Lupa Password
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Masukkan email akun admin Anda. Kami akan mengirimkan link untuk
            mereset password.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "/reset-link-sent";
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                placeholder="admin@sekolah.sch.id"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00] active:scale-[0.99]"
          >
            Kirim Link Reset
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#B46000]"
            >
              ? Kembali ke Login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ForgotPassword;
