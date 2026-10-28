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
  source: string;
  partner_id: number | null;
  transkription: string;
  recording_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Partner {
  id: number;
  firma: string;
  kontakt_name: string;
  email: string;
  phone: string;
  plz: string;
  ort: string;
  radius_km: number;
  active: number;
}

interface UserSession {
  userId: number;
  username: string;
  displayName: string;
  role: "admin" | "partner";
  partnerId: number | null;
}

const STATUS_COLORS: Record<string, string> = {
  neu: "bg-blue-100 text-blue-800",
  kontaktiert: "bg-yellow-100 text-yellow-800",
  offerte: "bg-purple-100 text-purple-800",
  abgeschlossen: "bg-green-100 text-green-800",
  abgelehnt: "bg-red-100 text-red-800",
};

const SOURCE_LABELS: Record<string, string> = {
  web: "Formular",
  phone: "Telefon",
};

const STATUS_OPTIONS = ["alle", "neu", "kontaktiert", "offerte", "abgeschlossen", "abgelehnt"];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserSession | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filter, setFilter] = useState("alle");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"leads" | "partners" | "users">("leads");
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== "alle" ? `?status=${filter}` : "";
      const res = await fetch(`/api/leads${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setLeads(await res.json());
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  const fetchPartners = useCallback(async () => {
    if (user?.role !== "admin") return;
    const res = await fetch("/api/partners", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPartners(await res.json());
  }, [token, user]);

  const fetchUsers = useCallback(async () => {
    if (user?.role !== "admin") return;
    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
  }, [token, user]);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    const savedUser = sessionStorage.getItem("admin_user");
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn && token) {
      fetchLeads();
      fetchPartners();
      fetchUsers();
    }
  }, [loggedIn, token, filter, fetchLeads, fetchPartners, fetchUsers]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      setLoggedIn(true);
      sessionStorage.setItem("admin_token", data.token);
      sessionStorage.setItem("admin_user", JSON.stringify(data.user));
    } else {
      setLoginError("Falscher Benutzername oder Passwort");
    }
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function assignPartner(leadId: number, partnerId: number | null) {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ partner_id: partnerId }),
    });
    fetchLeads();
    if (selected?.id === leadId) setSelected({ ...selected, partner_id: partnerId });
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

  async function createPartner(formData: {
    firma: string; kontakt_name: string; email: string; phone: string;
    plz: string; ort: string; radius_km: number; username: string; password: string;
  }) {
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowPartnerForm(false);
      fetchPartners();
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    setLoggedIn(false);
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotMessage("");
    if (!forgotUsername.trim()) {
      setForgotMessage("Bitte Benutzername eingeben");
      return;
    }
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: forgotUsername }),
    });
    const data = await res.json();
    if (res.ok) {
      setForgotSuccess(true);
      setForgotMessage(data.message);
    } else {
      setForgotMessage(data.error || "Fehler beim Zurücksetzen");
    }
  }

  async function handleResetPassword(userId: number) {
    if (!resetPassword || resetPassword.length < 4) {
      setResetMessage("Passwort muss mindestens 4 Zeichen haben");
      return;
    }
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, newPassword: resetPassword }),
    });
    if (res.ok) {
      setResetMessage("Passwort wurde zurückgesetzt");
      setResetPassword("");
      setTimeout(() => { setResetUserId(null); setResetMessage(""); }, 2000);
    } else {
      const data = await res.json();
      setResetMessage(data.error || "Fehler");
    }
  }

  async function toggleUserActive(userId: number, currentActive: number) {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, active: currentActive ? 0 : 1 }),
    });
    fetchUsers();
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
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  function getPartnerName(partnerId: number | null): string {
    if (!partnerId) return "—";
    const p = partners.find((p) => p.id === partnerId);
    return p ? p.firma : "—";
  }

  // ─── LOGIN ───
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#001F45] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-black text-[#003A7D] uppercase">Garagentor</h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs font-extrabold tracking-[0.25em] text-[#F9AD09] uppercase">Renovation</p>
            <p className="text-gray-400 text-sm mt-3">Admin-Bereich</p>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Benutzername"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
          />
          {loginError && <p className="text-red-600 text-sm mb-4">{loginError}</p>}
          {!showForgot ? (
            <>
              <button className="w-full bg-[#003A7D] hover:bg-[#002D63] text-white py-2.5 rounded-lg font-semibold transition-colors">
                Anmelden
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(true); setForgotMessage(""); setForgotSuccess(false); setForgotUsername(""); }}
                className="w-full text-center mt-4 text-xs text-gray-400 hover:text-[#003A7D] transition-colors cursor-pointer"
              >
                Passwort vergessen?
              </button>
            </>
          ) : (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-600 mb-3">Passwort zurücksetzen</p>
              <input
                type="text"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                placeholder="Benutzername"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#F9AD09]"
              />
              {forgotMessage && (
                <p className={`text-sm mb-3 ${forgotSuccess ? "text-green-600" : "text-red-600"}`}>{forgotMessage}</p>
              )}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full bg-[#F9AD09] hover:bg-[#e09d08] text-white py-2.5 rounded-lg font-semibold transition-colors mb-2"
              >
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotMessage(""); }}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Zurück zum Login
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }

  // ─── ADMIN PANEL ───
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003A7D] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-bold text-lg">
              Garagentor-Renovation <span className="text-white/50 font-normal">Admin</span>
            </h1>
            {user?.role === "admin" && (
              <div className="flex gap-1">
                <button
                  onClick={() => setTab("leads")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${tab === "leads" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Leads
                </button>
                <button
                  onClick={() => setTab("partners")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${tab === "partners" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Partner
                </button>
                <button
                  onClick={() => setTab("users")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${tab === "users" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Users
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">
              {user?.displayName} ({user?.role === "admin" ? "Admin" : "Partner"})
            </span>
            <button onClick={logout} className="text-sm text-white/50 hover:text-white">Abmelden</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === "leads" ? (
          <>
            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === s ? "bg-[#003A7D] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
              <span className="ml-auto text-sm text-gray-400 self-center">{leads.length} Lead{leads.length !== 1 ? "s" : ""}</span>
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
                          selected?.id === lead.id ? "border-[#003A7D] ring-1 ring-[#003A7D]" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm truncate">{lead.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || ""}`}>
                                {lead.status}
                              </span>
                              {lead.source === "phone" && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">📞 Anruf</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {lead.plz} {lead.ort} · {lead.phone} {lead.email ? `· ${lead.email}` : ""}
                              {user?.role === "admin" && lead.partner_id ? ` · → ${getPartnerName(lead.partner_id)}` : ""}
                            </p>
                            {lead.transkription && (
                              <p className="text-xs text-amber-700 mt-1 truncate">💬 {lead.transkription.slice(0, 100)}{lead.transkription.length > 100 ? "…" : ""}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(lead.created_at)}</span>
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
                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  <div className="space-y-3 text-sm mb-6">
                    {selected.source && (
                      <div>
                        <span className="text-gray-500">Quelle:</span>{" "}
                        <span className={selected.source === "phone" ? "text-orange-600 font-medium" : ""}>
                          {SOURCE_LABELS[selected.source] || selected.source}
                        </span>
                      </div>
                    )}
                    {selected.email && (
                      <div>
                        <span className="text-gray-500">E-Mail:</span>{" "}
                        <a href={`mailto:${selected.email}`} className="text-[#003A7D] hover:underline">{selected.email}</a>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Telefon:</span>{" "}
                      <a href={`tel:${selected.phone}`} className="text-[#003A7D] hover:underline">{selected.phone}</a>
                    </div>
                    {(selected.plz || selected.ort) && (
                      <div><span className="text-gray-500">Ort:</span> {selected.plz} {selected.ort}</div>
                    )}
                    {selected.tor_typ && <div><span className="text-gray-500">Tor-Typ:</span> {selected.tor_typ}</div>}
                    {selected.breite && (
                      <div><span className="text-gray-500">Masse:</span> {selected.breite}{selected.hoehe ? ` × ${selected.hoehe}` : ""} cm</div>
                    )}
                    {selected.nachricht && (
                      <div>
                        <span className="text-gray-500">Nachricht:</span>
                        <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selected.nachricht}</p>
                      </div>
                    )}
                    {selected.transkription && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <span className="text-amber-700 font-medium text-xs uppercase tracking-wide">Transkription</span>
                        <p className="mt-1.5 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{selected.transkription}</p>
                      </div>
                    )}
                    {selected.recording_url && (
                      <div>
                        <span className="text-gray-500">Aufnahme:</span>
                        <audio controls className="w-full mt-1" src={selected.recording_url}>
                          <a href={selected.recording_url} target="_blank" rel="noopener noreferrer">Aufnahme abspielen</a>
                        </audio>
                      </div>
                    )}
                    <div><span className="text-gray-500">Erstellt:</span> {formatDate(selected.created_at)}</div>
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
                              <img src={src} alt={`Foto ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-100" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Status */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Status:</p>
                    <select
                      value={selected.status}
                      onChange={(e) => updateStatus(selected.id, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D] bg-white"
                    >
                      {STATUS_OPTIONS.filter((s) => s !== "alle").map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Partner zuweisen (nur Admin) */}
                  {user?.role === "admin" && partners.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Partner zuweisen:</p>
                      <select
                        value={selected.partner_id || ""}
                        onChange={(e) => assignPartner(selected.id, e.target.value ? Number(e.target.value) : null)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D] bg-white"
                      >
                        <option value="">Kein Partner (nur Hauptadmin)</option>
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>{p.firma} — {p.kontakt_name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Aktionen */}
                  <div className="space-y-2">
                    {selected.phone && (
                      <a href={getWhatsAppLink(selected)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                        WhatsApp senden
                      </a>
                    )}
                    {selected.email && (
                      <a href={getMailLink(selected)}
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                        E-Mail senden
                      </a>
                    )}
                    {user?.role === "admin" && (
                      <button onClick={() => deleteLead(selected.id)}
                        className="w-full text-red-500 hover:text-red-700 py-2 text-sm transition-colors">
                        Lead löschen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : tab === "users" ? (
          // ─── USERS TAB ───
          <div>
            <h2 className="text-xl font-bold text-[#003A7D] mb-6">Benutzerverwaltung</h2>
            <div className="space-y-3">
              {users.map((u: any) => (
                <div key={u.id} className="bg-white rounded-lg border border-gray-100 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-[#003A7D]">{u.display_name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>
                          {u.role}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {u.active ? "Aktiv" : "Gesperrt"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Benutzername: <span className="font-mono text-gray-700">{u.username}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setResetUserId(resetUserId === u.id ? null : u.id); setResetPassword(""); setResetMessage(""); }}
                        className="px-3 py-1.5 bg-[#F9AD09] hover:bg-[#e09d08] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Passwort zurücksetzen
                      </button>
                      <button
                        onClick={() => toggleUserActive(u.id, u.active)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${u.active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                      >
                        {u.active ? "Sperren" : "Aktivieren"}
                      </button>
                    </div>
                  </div>
                  {resetUserId === u.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 mb-1 block">Neues Passwort</label>
                          <input
                            type="password"
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                            placeholder="Neues Passwort eingeben"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]"
                          />
                        </div>
                        <button
                          onClick={() => handleResetPassword(u.id)}
                          className="bg-[#003A7D] hover:bg-[#002D63] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Speichern
                        </button>
                      </div>
                      {resetMessage && (
                        <p className={`text-sm mt-2 ${resetMessage.includes("zurückgesetzt") ? "text-green-600" : "text-red-600"}`}>
                          {resetMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // ─── PARTNER TAB ───
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#003A7D]">Partner & Regionen</h2>
              <button
                onClick={() => setShowPartnerForm(!showPartnerForm)}
                className="bg-[#003A7D] hover:bg-[#002D63] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {showPartnerForm ? "Abbrechen" : "+ Neuer Partner"}
              </button>
            </div>

            {showPartnerForm && <PartnerForm onSubmit={createPartner} />}

            <div className="space-y-3">
              {partners.length === 0 ? (
                <p className="text-gray-400 text-sm">Noch keine Partner angelegt.</p>
              ) : (
                partners.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg border border-gray-100 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[#003A7D]">{p.firma}</h3>
                        <p className="text-sm text-gray-600">{p.kontakt_name}</p>
                        <p className="text-sm text-gray-400 mt-1">{p.plz} {p.ort} · Radius {p.radius_km} km</p>
                        {p.phone && <p className="text-sm text-gray-400">{p.phone}</p>}
                        {p.email && <p className="text-sm text-gray-400">{p.email}</p>}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                        {p.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PartnerForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    firma: "", kontakt_name: "", email: "", phone: "",
    plz: "", ort: "", radius_km: 15, username: "", password: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
      <h3 className="font-bold text-[#003A7D] mb-4">Neuen Partner anlegen</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required placeholder="Firma *" value={form.firma} onChange={(e) => setForm({ ...form, firma: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        <input required placeholder="Kontaktperson *" value={form.kontakt_name} onChange={(e) => setForm({ ...form, kontakt_name: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        <input placeholder="E-Mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        <input required placeholder="PLZ *" value={form.plz} onChange={(e) => setForm({ ...form, plz: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        <input required placeholder="Ort *" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        <div>
          <label className="text-xs text-gray-500">Radius (km)</label>
          <input type="number" value={form.radius_km} onChange={(e) => setForm({ ...form, radius_km: parseInt(e.target.value) || 15 })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
        </div>
        <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
          <p className="text-sm font-medium text-gray-600 mb-3">Login für Partner (optional)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Benutzername" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
            <input type="password" placeholder="Passwort" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003A7D]" />
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-[#003A7D] hover:bg-[#002D63] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
        Partner erstellen
      </button>
    </form>
  );
}
