"use client";

import { useState, useEffect, useCallback } from "react";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  plz: string;
  ort: string;
  tor_typ: string;
  breite: string;
  hoehe: string;
  nachricht: string;
  fotos: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  neu: "bg-blue-100 text-blue-800",
  kontaktiert: "bg-yellow-100 text-yellow-800",
  offerte: "bg-purple-100 text-purple-800",
  abgeschlossen: "bg-green-100 text-green-800",
  abgelehnt: "bg-red-100 text-red-800",
};

const STATUS_OPTIONS = ["alle", "neu", "kontaktiert", "offerte", "abgeschlossen", "abgelehnt"];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("alle");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== "alle" ? `?status=${filter}` : "";
      const res = await fetch(`/api/leads${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLeads(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn && token) fetchLeads();
  }, [loggedIn, token, filter, fetchLeads]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      setLoggedIn(true);
      sessionStorage.setItem("admin_token", data.token);
    } else {
      setLoginError("Falsches Passwort");
    }
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
  }

  async function deleteLead(id: number) {
    if (!confirm("Diesen Lead wirklich löschen?")) return;
    await fetch(`/api/leads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (selected?.id === id) setSelected(null);
    fetchLeads();
  }

  function logout() {
    setToken("");
    setLoggedIn(false);
    sessionStorage.removeItem("admin_token");
  }

  function getWhatsAppLink(lead: Lead) {
    const text = encodeURIComponent(
      `Hallo ${lead.name}, vielen Dank für Ihre Anfrage zur Garagentor-Renovation. Wir haben Ihre Anfrage erhalten und melden uns in Kürze mit einer Offerte bei Ihnen. Freundliche Grüsse, Garagentor-Renovation`
    );
    const phone = lead.phone.replace(/\s+/g, "").replace(/^0/, "+41");
    return `https://wa.me/${phone}?text=${text}`;
  }

  function getMailLink(lead: Lead) {
    const subject = encodeURIComponent("Ihre Anfrage bei Garagentor-Renovation");
    const body = encodeURIComponent(
      `Hallo ${lead.name},\n\nVielen Dank für Ihre Anfrage zur Garagentor-Renovation.\n\nWir haben Ihre Anfrage erhalten und werden Ihnen in Kürze eine Offerte zustellen.\n\nFreundliche Grüsse\nGaragentor-Renovation`
    );
    return `mailto:${lead.email}?subject=${subject}&body=${body}`;
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + "Z").toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold mb-6 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {loginError && (
            <p className="text-red-600 text-sm mb-4">{loginError}</p>
          )}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold transition-colors">
            Anmelden
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="font-bold text-lg">
            Garagentor-Renovation{" "}
            <span className="text-gray-400 font-normal">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {leads.length} Lead{leads.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === s
                  ? "bg-anthracite text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Lead-Liste */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <p className="text-gray-400 text-sm">Laden...</p>
            ) : leads.length === 0 ? (
              <p className="text-gray-400 text-sm">Keine Leads gefunden.</p>
            ) : (
              <div className="space-y-2">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className={`bg-white rounded-lg border p-4 cursor-pointer transition-colors ${
                      selected?.id === lead.id
                        ? "border-orange-400 ring-1 ring-orange-400"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">
                            {lead.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || ""}`}
                          >
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {lead.plz} {lead.ort} · {lead.phone} · {lead.email}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lead-Detail */}
          {selected && (
            <div className="hidden lg:block w-96 bg-white rounded-lg border border-gray-100 p-6 sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">{selected.name}</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div>
                  <span className="text-gray-500">E-Mail:</span>{" "}
                  <a href={`mailto:${selected.email}`} className="text-orange-600 hover:underline">
                    {selected.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">Telefon:</span>{" "}
                  <a href={`tel:${selected.phone}`} className="text-orange-600 hover:underline">
                    {selected.phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">Ort:</span> {selected.plz}{" "}
                  {selected.ort}
                </div>
                {selected.tor_typ && (
                  <div>
                    <span className="text-gray-500">Tor-Typ:</span>{" "}
                    {selected.tor_typ}
                  </div>
                )}
                {selected.breite && (
                  <div>
                    <span className="text-gray-500">Masse:</span>{" "}
                    {selected.breite}
                    {selected.hoehe ? ` × ${selected.hoehe}` : ""} cm
                  </div>
                )}
                {selected.nachricht && (
                  <div>
                    <span className="text-gray-500">Nachricht:</span>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                      {selected.nachricht}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Erstellt:</span>{" "}
                  {formatDate(selected.created_at)}
                </div>
              </div>

              {/* Fotos */}
              {(() => {
                const fotos: string[] = JSON.parse(selected.fotos || "[]");
                return fotos.length > 0 ? (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Fotos:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {fotos.map((src, i) => (
                        <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                          <img
                            src={src}
                            alt={`Foto ${i + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-100"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Status ändern */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Status:</p>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {STATUS_OPTIONS.filter((s) => s !== "alle").map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aktionen */}
              <div className="space-y-2">
                <a
                  href={getWhatsAppLink(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  💬 WhatsApp senden
                </a>
                <a
                  href={getMailLink(selected)}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  ✉️ E-Mail senden
                </a>
                <button
                  onClick={() => deleteLead(selected.id)}
                  className="w-full text-red-500 hover:text-red-700 py-2 text-sm transition-colors"
                >
                  Lead löschen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
