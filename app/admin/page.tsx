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
const KANBAN_COLUMNS = ["neu", "kontaktiert", "offerte", "abgeschlossen", "abgelehnt"];
const KANBAN_LABELS: Record<string, string> = {
  neu: "Neu",
  kontaktiert: "Kontaktiert",
  offerte: "Offerte",
  abgeschlossen: "Erledigt",
  abgelehnt: "Abgelehnt",
};
const KANBAN_HEADER_COLORS: Record<string, string> = {
  neu: "bg-blue-500",
  kontaktiert: "bg-yellow-500",
  offerte: "bg-purple-500",
  abgeschlossen: "bg-green-500",
  abgelehnt: "bg-red-400",
};

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
  const [tab, setTab] = useState<"leads" | "partners" | "users" | "dashboard">("leads");
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [draggedLead, setDraggedLead] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [impersonating, setImpersonating] = useState<Partner | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = viewMode === "list" && filter !== "alle" ? `?status=${filter}` : "";
      const res = await fetch(`/api/leads${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setLeads(await res.json());
    } finally {
      setLoading(false);
    }
  }, [token, filter, viewMode]);

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
  }, [loggedIn, token, filter, viewMode, fetchLeads, fetchPartners, fetchUsers]);

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

  const [forgotPassword, setForgotPassword] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotMessage("");
    if (!forgotUsername.trim()) {
      setForgotMessage("Bitte Benutzername eingeben");
      return;
    }
    if (!forgotPassword || forgotPassword.length < 4) {
      setForgotMessage("Passwort muss mindestens 4 Zeichen haben");
      return;
    }
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: forgotUsername, newPassword: forgotPassword }),
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

  const MESSAGE_TEMPLATES = [
    {
      id: "erstantwort",
      label: "Erstantwort",
      subject: "Ihre Anfrage bei Garagentor-Renovation",
      text: (l: Lead) => `Hallo ${l.name},\n\nVielen Dank für Ihre Anfrage zur Garagentor-Renovation.\n\nWir haben Ihre Anfrage erhalten und werden Ihnen in Kürze eine Offerte zustellen.\n\nFreundliche Grüsse\nGaragentor-Renovation`,
    },
    {
      id: "offerte",
      label: "Offerte senden",
      subject: "Ihre Offerte – Garagentor-Renovation",
      text: (l: Lead) => `Hallo ${l.name},\n\nAnbei erhalten Sie unsere Offerte für Ihre Garagentor-Renovation${l.tor_typ ? ` (${l.tor_typ})` : ""}${l.breite ? `, Masse: ${l.breite}${l.hoehe ? ` × ${l.hoehe}` : ""} cm` : ""}.\n\nBei Fragen stehen wir Ihnen gerne zur Verfügung.\n\nFreundliche Grüsse\nGaragentor-Renovation`,
    },
    {
      id: "nachfassen",
      label: "Nachfassen",
      subject: "Nachfrage zu Ihrer Anfrage – Garagentor-Renovation",
      text: (l: Lead) => `Hallo ${l.name},\n\nWir haben Ihnen kürzlich eine Offerte für Ihre Garagentor-Renovation zugestellt. Haben Sie noch Fragen oder wünschen Sie einen Termin vor Ort?\n\nWir freuen uns auf Ihre Rückmeldung.\n\nFreundliche Grüsse\nGaragentor-Renovation`,
    },
    {
      id: "termin",
      label: "Termin",
      subject: "Terminbestätigung – Garagentor-Renovation",
      text: (l: Lead) => `Hallo ${l.name},\n\nGerne bestätigen wir Ihren Termin für die Besichtigung vor Ort${l.ort ? ` in ${l.plz} ${l.ort}` : ""}.\n\nBitte teilen Sie uns mit, falls sich etwas ändern sollte.\n\nFreundliche Grüsse\nGaragentor-Renovation`,
    },
  ];

  function getWhatsAppLink(lead: Lead, templateId?: string) {
    const template = templateId ? MESSAGE_TEMPLATES.find(t => t.id === templateId) : MESSAGE_TEMPLATES[0];
    const text = encodeURIComponent(template ? template.text(lead) : "");
    const phone = lead.phone.replace(/\s+/g, "").replace(/^0/, "+41");
    return `https://wa.me/${phone}?text=${text}`;
  }

  function getMailLink(lead: Lead, templateId?: string) {
    const template = templateId ? MESSAGE_TEMPLATES.find(t => t.id === templateId) : MESSAGE_TEMPLATES[0];
    if (!template) return "";
    const subject = encodeURIComponent(template.subject);
    const body = encodeURIComponent(template.text(lead));
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
                onClick={() => { setShowForgot(true); setLoginError(""); setForgotMessage(""); setForgotSuccess(false); setForgotUsername(""); setForgotPassword(""); }}
                className="w-full text-center mt-4 text-xs text-gray-400 hover:text-[#003A7D] transition-colors cursor-pointer"
              >
                Passwort vergessen?
              </button>
            </>
          ) : null}
        </form>
        {showForgot && (
          <form onSubmit={handleForgotPassword} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm mt-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Passwort zurücksetzen</p>
            <input
              type="text"
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
              placeholder="Benutzername"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#F9AD09]"
            />
            <input
              type="password"
              value={forgotPassword}
              onChange={(e) => setForgotPassword(e.target.value)}
              placeholder="Neues Passwort"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#F9AD09]"
            />
            {forgotMessage && (
              <p className={`text-sm mb-3 ${forgotSuccess ? "text-green-600" : "text-red-600"}`}>{forgotMessage}</p>
            )}
            <button
              type="submit"
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
          </form>
        )}
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
                  onClick={() => setTab("dashboard")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${tab === "dashboard" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Dashboard
                </button>
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
            {user?.role === "admin" && partners.length > 0 && (
              <select
                value={impersonating?.id || ""}
                onChange={(e) => {
                  const pid = e.target.value ? Number(e.target.value) : null;
                  setImpersonating(pid ? partners.find(p => p.id === pid) || null : null);
                }}
                className="bg-white/10 border border-white/20 text-white text-xs rounded px-2 py-1 focus:outline-none"
              >
                <option value="" className="text-gray-900">Alle Partner (Admin)</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id} className="text-gray-900">Ansicht: {p.firma}</option>
                ))}
              </select>
            )}
            <span className="text-sm text-white/60">
              {impersonating ? `👁 ${impersonating.firma}` : `${user?.displayName} (${user?.role === "admin" ? "Admin" : "Partner"})`}
            </span>
            <button onClick={logout} className="text-sm text-white/50 hover:text-white">Abmelden</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === "dashboard" ? (
          /* ─── DASHBOARD TAB ─── */
          (() => {
            const allLeads = leads;
            const filteredLeads = impersonating ? allLeads.filter(l => l.partner_id === impersonating.id) : allLeads;
            const stats = {
              total: filteredLeads.length,
              neu: filteredLeads.filter(l => l.status === "neu").length,
              kontaktiert: filteredLeads.filter(l => l.status === "kontaktiert").length,
              offerte: filteredLeads.filter(l => l.status === "offerte").length,
              abgeschlossen: filteredLeads.filter(l => l.status === "abgeschlossen").length,
              abgelehnt: filteredLeads.filter(l => l.status === "abgelehnt").length,
              phone: filteredLeads.filter(l => l.source === "phone").length,
              web: filteredLeads.filter(l => l.source === "web" || !l.source).length,
            };
            const conversionRate = stats.total > 0 ? Math.round((stats.abgeschlossen / stats.total) * 100) : 0;
            return (
              <div>
                <h2 className="text-xl font-bold text-[#003A7D] mb-6">
                  Dashboard {impersonating ? `— ${impersonating.firma}` : ""}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-3xl font-bold text-[#003A7D]">{stats.total}</p>
                    <p className="text-sm text-gray-500 mt-1">Leads gesamt</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">Abschlussrate</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-3xl font-bold text-blue-600">{stats.neu}</p>
                    <p className="text-sm text-gray-500 mt-1">Neue Leads</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-3xl font-bold text-purple-600">{stats.offerte}</p>
                    <p className="text-sm text-gray-500 mt-1">Offene Offerten</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Status-Übersicht */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-bold text-[#003A7D] mb-4">Status-Übersicht</h3>
                    <div className="space-y-3">
                      {KANBAN_COLUMNS.map(status => {
                        const count = filteredLeads.filter(l => l.status === status).length;
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={status} className="flex items-center gap-3">
                            <span className="text-sm w-24 text-gray-600">{KANBAN_LABELS[status]}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                              <div className={`${KANBAN_HEADER_COLORS[status]} h-full rounded-full transition-all flex items-center justify-end pr-2`} style={{ width: `${Math.max(pct, 8)}%` }}>
                                <span className="text-xs text-white font-medium">{count}</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quellen */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-bold text-[#003A7D] mb-4">Lead-Quellen</h3>
                    <div className="flex gap-6 items-center justify-center py-4">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 mx-auto">
                          <span className="text-2xl font-bold text-blue-600">{stats.web}</span>
                        </div>
                        <p className="text-sm text-gray-600">Formular</p>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-2 mx-auto">
                          <span className="text-2xl font-bold text-orange-600">{stats.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600">Telefon</p>
                      </div>
                    </div>
                    {!impersonating && partners.length > 0 && (
                      <>
                        <h3 className="font-bold text-[#003A7D] mt-6 mb-4">Leads pro Partner</h3>
                        <div className="space-y-2">
                          {partners.map(p => {
                            const pLeads = allLeads.filter(l => l.partner_id === p.id).length;
                            return (
                              <div key={p.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{p.firma}</span>
                                <span className="font-semibold text-[#003A7D]">{pLeads}</span>
                              </div>
                            );
                          })}
                          <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                            <span className="text-gray-500">Nicht zugewiesen</span>
                            <span className="font-semibold text-gray-400">{allLeads.filter(l => !l.partner_id).length}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Letzte Leads */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-bold text-[#003A7D] mb-4">Letzte 5 Leads</h3>
                  <div className="space-y-2">
                    {filteredLeads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${KANBAN_HEADER_COLORS[lead.status]}`} />
                          <span className="text-sm font-medium">{lead.name}</span>
                          <span className="text-xs text-gray-400">{lead.plz} {lead.ort}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                          <span className="text-xs text-gray-400">{formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        ) : tab === "leads" ? (
          <>
            {/* Header mit View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {impersonating && (
                  <span className="text-sm font-medium text-[#003A7D] bg-[#003A7D]/10 px-3 py-1 rounded-full">
                    👁 {impersonating.firma}
                    <button onClick={() => setImpersonating(null)} className="ml-2 text-gray-400 hover:text-red-500">✕</button>
                  </span>
                )}
                <span className="text-sm text-gray-400">
                  {(impersonating ? leads.filter(l => l.partner_id === impersonating.id) : leads).length} Lead{(impersonating ? leads.filter(l => l.partner_id === impersonating.id) : leads).length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === "kanban" ? "bg-[#003A7D] text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === "list" ? "bg-[#003A7D] text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Liste
                </button>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                {(() => {
                  const displayLeads = impersonating ? leads.filter(l => l.partner_id === impersonating.id) : leads;
                  return viewMode === "kanban" ? (
                  /* ─── KANBAN BOARD ─── */
                  <div className="flex gap-3 overflow-x-auto pb-4">
                    {KANBAN_COLUMNS.map((status) => {
                      const columnLeads = displayLeads.filter((l) => l.status === status);
                      return (
                        <div
                          key={status}
                          className={`flex-shrink-0 w-56 rounded-xl bg-gray-100 flex flex-col transition-colors ${dragOverColumn === status ? "ring-2 ring-[#003A7D] bg-blue-50" : ""}`}
                          onDragOver={(e) => { e.preventDefault(); setDragOverColumn(status); }}
                          onDragLeave={() => setDragOverColumn(null)}
                          onDrop={() => {
                            if (draggedLead !== null) {
                              updateStatus(draggedLead, status);
                              setDraggedLead(null);
                              setDragOverColumn(null);
                            }
                          }}
                        >
                          <div className={`${KANBAN_HEADER_COLORS[status]} text-white px-3 py-2 rounded-t-xl flex items-center justify-between`}>
                            <span className="font-semibold text-sm">{KANBAN_LABELS[status]}</span>
                            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{columnLeads.length}</span>
                          </div>
                          <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 16rem)" }}>
                            {columnLeads.map((lead) => (
                              <div
                                key={lead.id}
                                draggable
                                onDragStart={() => setDraggedLead(lead.id)}
                                onDragEnd={() => { setDraggedLead(null); setDragOverColumn(null); }}
                                onClick={() => setSelected(lead)}
                                className={`bg-white rounded-lg border p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                                  selected?.id === lead.id ? "border-[#003A7D] ring-1 ring-[#003A7D]" : "border-gray-200"
                                } ${draggedLead === lead.id ? "opacity-50" : ""}`}
                              >
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="font-semibold text-sm truncate">{lead.name}</span>
                                  {lead.source === "phone" && <span className="text-xs">📞</span>}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{lead.plz} {lead.ort}</p>
                                {lead.phone && <p className="text-xs text-gray-400 truncate">{lead.phone}</p>}
                                {user?.role === "admin" && lead.partner_id && (
                                  <p className="text-xs text-[#003A7D] mt-1 truncate">→ {getPartnerName(lead.partner_id)}</p>
                                )}
                                <p className="text-xs text-gray-300 mt-1.5">{formatDate(lead.created_at)}</p>
                              </div>
                            ))}
                            {columnLeads.length === 0 && (
                              <p className="text-xs text-gray-400 text-center py-8">Keine Leads</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ─── LISTENANSICHT ─── */
                  <>
                    <div className="flex gap-2 mb-4 flex-wrap">
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
                    </div>
                    {loading ? (
                      <p className="text-gray-400 text-sm">Laden...</p>
                    ) : displayLeads.length === 0 ? (
                      <p className="text-gray-400 text-sm">Keine Leads gefunden.</p>
                    ) : (
                      <div className="space-y-2">
                        {displayLeads.map((lead) => (
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
                  </>
                );
                })()}
              </div>

              {/* Lead-Detail Sidebar */}
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

                  {/* Vorlagen & Aktionen */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 transition-colors border border-gray-200"
                    >
                      <span>Vorlagen & Nachrichten</span>
                      <span className="text-xs">{showTemplates ? "▲" : "▼"}</span>
                    </button>
                    {showTemplates && (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 space-y-2">
                        {MESSAGE_TEMPLATES.map((tpl) => (
                          <div key={tpl.id} className="flex gap-1.5">
                            <span className="text-xs text-gray-500 w-20 pt-1.5 flex-shrink-0">{tpl.label}</span>
                            <div className="flex gap-1.5 flex-1">
                              {selected.phone && (
                                <a href={getWhatsAppLink(selected, tpl.id)} target="_blank" rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                                  WhatsApp
                                </a>
                              )}
                              {selected.email && (
                                <a href={getMailLink(selected, tpl.id)}
                                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                                  E-Mail
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!showTemplates && (
                      <div className="flex gap-2">
                        {selected.phone && (
                          <a href={getWhatsAppLink(selected)} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                            WhatsApp
                          </a>
                        )}
                        {selected.email && (
                          <a href={getMailLink(selected)}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                            E-Mail
                          </a>
                        )}
                      </div>
                    )}
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`}
                        className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                        Anrufen
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

            {/* Schweizer Kantonskarte */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
              <h3 className="font-bold text-[#003A7D] mb-4">Abdeckung Schweiz</h3>
              <SwissCantonMap partners={partners} leads={leads} />
            </div>

            <div className="space-y-3">
              {partners.length === 0 ? (
                <p className="text-gray-400 text-sm">Noch keine Partner angelegt.</p>
              ) : (
                partners.map((p) => {
                  const partnerLeads = leads.filter(l => l.partner_id === p.id);
                  return (
                    <div key={p.id} className="bg-white rounded-lg border border-gray-100 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-[#003A7D]">{p.firma}</h3>
                            <span className="bg-[#003A7D]/10 text-[#003A7D] text-xs px-2 py-0.5 rounded-full font-medium">
                              {partnerLeads.length} Leads
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{p.kontakt_name}</p>
                          <p className="text-sm text-gray-400 mt-1">{p.plz} {p.ort} · Radius {p.radius_km} km</p>
                          {p.phone && <p className="text-sm text-gray-400">{p.phone}</p>}
                          {p.email && <p className="text-sm text-gray-400">{p.email}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setImpersonating(p); setTab("leads"); }}
                            className="px-3 py-1.5 bg-[#003A7D]/10 hover:bg-[#003A7D]/20 text-[#003A7D] rounded-lg text-xs font-medium transition-colors"
                          >
                            Als Partner ansehen
                          </button>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                            {p.active ? "Aktiv" : "Inaktiv"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SWISS_CANTONS: { id: string; name: string; x: number; y: number }[] = [
  { id: "ZH", name: "Zürich", x: 345, y: 120 },
  { id: "BE", name: "Bern", x: 220, y: 200 },
  { id: "LU", name: "Luzern", x: 295, y: 175 },
  { id: "UR", name: "Uri", x: 330, y: 210 },
  { id: "SZ", name: "Schwyz", x: 350, y: 175 },
  { id: "OW", name: "Obwalden", x: 295, y: 210 },
  { id: "NW", name: "Nidwalden", x: 310, y: 195 },
  { id: "GL", name: "Glarus", x: 385, y: 170 },
  { id: "ZG", name: "Zug", x: 330, y: 155 },
  { id: "FR", name: "Fribourg", x: 185, y: 210 },
  { id: "SO", name: "Solothurn", x: 250, y: 120 },
  { id: "BS", name: "Basel-Stadt", x: 230, y: 70 },
  { id: "BL", name: "Basel-Land", x: 240, y: 85 },
  { id: "SH", name: "Schaffhausen", x: 335, y: 55 },
  { id: "AR", name: "Appenzell A.Rh.", x: 420, y: 115 },
  { id: "AI", name: "Appenzell I.Rh.", x: 415, y: 130 },
  { id: "SG", name: "St. Gallen", x: 400, y: 130 },
  { id: "GR", name: "Graubünden", x: 430, y: 210 },
  { id: "AG", name: "Aargau", x: 290, y: 105 },
  { id: "TG", name: "Thurgau", x: 375, y: 85 },
  { id: "TI", name: "Tessin", x: 350, y: 300 },
  { id: "VD", name: "Waadt", x: 130, y: 260 },
  { id: "VS", name: "Wallis", x: 230, y: 300 },
  { id: "NE", name: "Neuenburg", x: 165, y: 175 },
  { id: "GE", name: "Genf", x: 95, y: 290 },
  { id: "JU", name: "Jura", x: 185, y: 115 },
];

function SwissCantonMap({ partners, leads }: { partners: Partner[]; leads: Lead[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredCanton = SWISS_CANTONS.find(c => c.id === hovered);

  function getCantonColor(cantonId: string) {
    const cantonLeads = leads.filter(l => {
      const cantonPLZs: Record<string, [number, number][]> = {
        ZH: [[8000, 8499]], BE: [[3000, 3999]], LU: [[6000, 6099]], UR: [[6400, 6499]],
        SZ: [[6400, 6449], [8840, 8849]], OW: [[6060, 6079]], NW: [[6360, 6399]],
        GL: [[8750, 8799]], ZG: [[6300, 6349]], FR: [[1700, 1799]], SO: [[4500, 4599]],
        BS: [[4000, 4059]], BL: [[4100, 4199]], SH: [[8200, 8249]], AR: [[9050, 9099]],
        AI: [[9050, 9058]], SG: [[9000, 9499]], GR: [[7000, 7599]], AG: [[5000, 5499]],
        TG: [[8500, 8599]], TI: [[6500, 6999]], VD: [[1000, 1399]], VS: [[1900, 1999], [3900, 3999]],
        NE: [[2000, 2099]], GE: [[1200, 1299]], JU: [[2800, 2899]],
      };
      const plz = parseInt(l.plz);
      const ranges = cantonPLZs[cantonId] || [];
      return ranges.some(([min, max]) => plz >= min && plz <= max);
    });
    if (cantonLeads.length === 0) return "#e5e7eb";
    if (cantonLeads.length <= 2) return "#93c5fd";
    if (cantonLeads.length <= 5) return "#3b82f6";
    return "#003A7D";
  }

  return (
    <div className="relative">
      <svg viewBox="50 30 430 310" className="w-full max-w-2xl mx-auto">
        {SWISS_CANTONS.map(canton => (
          <g key={canton.id} onMouseEnter={() => setHovered(canton.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
            <circle cx={canton.x} cy={canton.y} r={18} fill={getCantonColor(canton.id)} stroke={hovered === canton.id ? "#003A7D" : "#fff"} strokeWidth={hovered === canton.id ? 3 : 1.5} className="transition-all" />
            <text x={canton.x} y={canton.y + 1} textAnchor="middle" dominantBaseline="middle" className="text-[9px] font-bold fill-white pointer-events-none" style={{ fontSize: "9px" }}>
              {canton.id}
            </text>
          </g>
        ))}
      </svg>
      {hoveredCanton && (
        <div className="absolute top-2 right-2 bg-white shadow-lg rounded-lg px-4 py-3 border border-gray-200">
          <p className="font-bold text-[#003A7D] text-sm">{hoveredCanton.name}</p>
          <p className="text-xs text-gray-500">
            {leads.filter(l => {
              const plz = parseInt(l.plz);
              const ranges: Record<string, [number, number][]> = {
                ZH: [[8000, 8499]], BE: [[3000, 3999]], LU: [[6000, 6099]], SG: [[9000, 9499]],
                AG: [[5000, 5499]], TG: [[8500, 8599]], GR: [[7000, 7599]], TI: [[6500, 6999]],
                VD: [[1000, 1399]], GE: [[1200, 1299]], VS: [[1900, 1999], [3900, 3999]],
              };
              const r = ranges[hoveredCanton.id] || [];
              return r.some(([min, max]) => plz >= min && plz <= max);
            }).length} Leads
          </p>
        </div>
      )}
      <div className="flex gap-4 justify-center mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> 0 Leads</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-300 inline-block" /> 1-2</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> 3-5</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#003A7D] inline-block" /> 6+</span>
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
