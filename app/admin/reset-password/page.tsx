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
  const [showPw, setShowPw] = useState(false);

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
            <div className="relative mb-3">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Neues Passwort"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
                autoFocus
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showPw ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={showPw ? "text" : "password"}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Passwort bestätigen"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showPw ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
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
