// Persistenz über das zentrale ToolsUebersicht-Login-Gateway.
// Adaptiert aus E:\materialbedarf\db.js (gleiches Gateway-Muster), aber ohne
// generisches dav-load/dav-save: alle Schreibzugriffe laufen über zwei
// dedizierte Aktionen (archive-trainer/reactivate-trainer), damit der Server
// (nicht der Client) den Datenschnappschuss konsistent zusammenbaut.
const GATEWAY_URL = "https://landingpage.michel-brunner.workers.dev";
const TOKEN_STORAGE_KEY = "tu_session_token";
const GATEWAY_APP_ID = "personalakte";

class NotLoggedInError extends Error {
  constructor(message) {
    super(message || "Nicht angemeldet");
    this.name = "NotLoggedInError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message || "Daten wurden zwischenzeitlich von einem anderen Gerät geändert");
    this.name = "ConflictError";
  }
}

function getSessionToken() {
  try { return localStorage.getItem(TOKEN_STORAGE_KEY); } catch (_) { return null; }
}

async function gatewayRequest(payload) {
  const token = getSessionToken();
  if (!token) throw new NotLoggedInError();
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(payload)
  });
  if (resp.status === 401) throw new NotLoggedInError("Sitzung abgelaufen");
  if (resp.status === 403) throw new Error("Kein Zugriff auf dieses Tool.");
  if (resp.status === 409) throw new ConflictError((await resp.json().catch(() => null))?.error);
  if (!resp.ok) throw new Error(`Gateway-Fehler (HTTP ${resp.status})`);
  return resp.json();
}

// Liefert {username, isAdmin, groupIds, vorname, nachname, mannschaften} der eingeloggten Person.
async function fetchMe() {
  return gatewayRequest({ action: "me", app: GATEWAY_APP_ID });
}

// Liefert {trainerGroupExists, trainers:[...]} -- ein Datensatz je Mitglied der
// Trainer-Gruppe, inkl. archivierter (Gruppen werden beim Archivieren nicht
// entzogen). Ein bulk Join statt Einzel-Abruf pro Person, siehe CLAUDE.md.
async function fetchOverview() {
  return gatewayRequest({ action: "personalakte-overview" });
}

async function archiveTrainer(username, grund) {
  return gatewayRequest({ action: "archive-trainer", username, grund: grund || "" });
}

async function reactivateTrainer(username) {
  return gatewayRequest({ action: "reactivate-trainer", username });
}
