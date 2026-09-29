import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-5 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">

        {/* Logo - nanti ambil dari Backend */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
            LOGO
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Masuk ke Admin Panel
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#B46000]"
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#B46000]"
              />
              <span>Remember Me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#B46000] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00] active:scale-[0.99]"
          >
            Login
          </button>

        </form>
      </section>
    </main>
  );
}

export default Login;
