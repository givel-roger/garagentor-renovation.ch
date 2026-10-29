"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!password || password.length < 4) {
      setMessage("Passwort muss mindestens 4 Zeichen haben");
      return;
    }
    if (password !== passwordConfirm) {
      setMessage("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, passwordConfirm }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMessage(data.message);
      } else {
        setMessage(data.error || "Fehler beim Zurücksetzen");
      }
    } catch {
      setMessage("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#001F45] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
          <h1 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-black text-[#003A7D] uppercase">Garagentor</h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs font-extrabold tracking-[0.25em] text-[#F9AD09] uppercase">Renovation</p>
          <p className="text-red-600 text-sm mt-6">Ungültiger Link. Bitte fordere einen neuen Reset-Link an.</p>
          <a href="/admin" className="inline-block mt-4 text-sm text-[#003A7D] hover:underline">Zurück zum Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001F45] flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-black text-[#003A7D] uppercase">Garagentor</h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs font-extrabold tracking-[0.25em] text-[#F9AD09] uppercase">Renovation</p>
          <p className="text-gray-400 text-sm mt-3">Neues Passwort setzen</p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 text-sm mb-4">{message}</p>
            <a href="/admin" className="inline-block bg-[#003A7D] hover:bg-[#002D63] text-white py-2.5 px-6 rounded-lg font-semibold transition-colors">
              Zum Login
            </a>
          </div>
        ) : (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Neues Passwort"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
              autoFocus
            />
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Passwort bestätigen"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
            />
            {message && <p className="text-red-600 text-sm mb-4">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003A7D] hover:bg-[#002D63] text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Wird gespeichert..." : "Passwort speichern"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#001F45] flex items-center justify-center">
        <p className="text-white">Laden...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
