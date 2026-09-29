import { useState } from "react";
import type { SubmitEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    // Validasi email
    if (!email.trim()) {
      setEmailError("Email wajib diisi.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Format email tidak valid.");
      hasError = true;
    }

    // Validasi password
    if (!password) {
      setPasswordError("Password wajib diisi.");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);

      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      // Response error dari backend
      if (!response.ok) {
        setLoginError(data.message);
        return;
      }

      // Response sukses dari backend
      sessionStorage.setItem("accessToken", data.accessToken);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate("/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
            LOGO
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Masuk ke Admin Panel
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setLoginError("");
              }}
              placeholder="Masukkan email"
              autoComplete="email"
              className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
              }`}
            />

            {emailError && (
              <p className="mt-1.5 text-sm text-red-500">
                {emailError}
              </p>
            )}
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                  setLoginError("");
                }}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${
                  passwordError || loginError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                    : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
                }`}
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#B46000]"
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="mt-1.5 text-sm text-red-500">
                {passwordError}
              </p>
            )}

            {/* Error langsung dari backend */}
            {loginError && (
              <p className="mt-1.5 text-sm text-red-500">
                {loginError}
              </p>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;