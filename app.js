let currentUsername = null;
let currentIsAdmin = false;
let currentVorname = null;
let currentNachname = null;

let allTrainers = [];       // roher trainers[]-Array aus fetchOverview()
let trainerGroupExists = true;
let ubersichtSuche = "";
let ubersichtLizenz = "";
let archivSuche = "";
let currentDetailUsername = null;
let detailReturnTab = "uebersicht";

const SOURCE_URLS = {
  trainerkodex: "https://tecko1985.github.io/trainerkodex/",
  trainerdaten: "https://tecko1985.github.io/Trainerdaten/",
  trainercheckliste: "https://tecko1985.github.io/TrainerCheckliste/",
  personalkosten: "https://tecko1985.github.io/Personalkosten/",
  kadermanager: "https://tecko1985.github.io/kadermanager/"
};

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return String(iso);
  return d.toLocaleDateString("de-DE") + ", " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
}

function fmtDateOnly(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return String(iso);
  return d.toLocaleDateString("de-DE");
}

function fullName(t) {
  return `${t.vorname || ""} ${t.nachname || ""}`.trim() || t.username;
}

function badge(kind, text) {
  return `<span class="status-badge status-${kind}">${escapeHtml(text)}</span>`;
}

function renderChangelog() {
  const list = document.getElementById("changelog-list");
  list.innerHTML = APP_CHANGELOG.map((entry) => `
    <div class="changelog-entry">
      <span class="cv">Version ${escapeHtml(entry.version)}</span>
      ${entry.groups.map((g) => `
        <div class="changelog-group">
          <div class="cg-title">${escapeHtml(g.title)}</div>
          <ul class="cg-items">${g.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function renderHeaderUser() {
  const el = document.getElementById("header-user");
  if (!el) return;
  if (!currentUsername) { el.textContent = ""; return; }
  const name = (currentVorname || currentNachname) ? `${currentVorname || ""} ${currentNachname || ""}`.trim() : currentUsername;
  el.textContent = "👤 " + name + (currentIsAdmin ? " (Admin)" : "");
}

function activateTab(name) {
  document.querySelectorAll("nav button[data-tab]").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".tab-section").forEach((s) => s.classList.remove("active"));
  const navBtn = document.querySelector(`nav button[data-tab="${name}"]`);
  if (navBtn) navBtn.classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}

function setupTabs() {
  document.querySelectorAll("nav button[data-tab]").forEach((b) => {
    b.addEventListener("click", () => activateTab(b.dataset.tab));
  });

  const versionBadgeHeader = document.getElementById("version-badge");
  const openVersionHistory = () => {
    activateTab("uebersicht");
    const panel = document.getElementById("changelog-panel");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  versionBadgeHeader.addEventListener("click", openVersionHistory);
  versionBadgeHeader.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVersionHistory(); }
  });

  document.getElementById("btn-detail-back").addEventListener("click", () => activateTab(detailReturnTab));
}

// ---------- Übersicht (aktive Trainer) ----------

function populateLizenzFilter() {
  const sel = document.getElementById("filter-lizenz");
  const current = sel.value;
  const values = Array.from(new Set(allTrainers.filter((t) => !t.archiviert && t.lizenz).map((t) => t.lizenz))).sort();
  sel.innerHTML = '<option value="">Alle Lizenzen</option>' + values.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
  if (values.includes(current)) sel.value = current;
}

function trainercheckisteBadges(t) {
  const zugang = t.trainercheckliste.zugang.abgeschlossen ? badge("ok", "Zugang ✓") : badge("offen", "Zugang offen");
  const abgang = t.trainercheckliste.abgang.abgeschlossen ? badge("ok", "Abgang ✓") : "";
  return zugang + abgang;
}

function renderUebersicht() {
  document.getElementById("uebersicht-no-group").style.display = trainerGroupExists ? "none" : "block";
  const wrap = document.getElementById("uebersicht-rows");
  if (!trainerGroupExists) { wrap.innerHTML = ""; document.getElementById("uebersicht-empty").style.display = "none"; return; }

  const suche = ubersichtSuche.trim().toLowerCase();
  const rows = allTrainers
    .filter((t) => !t.archiviert)
    .filter((t) => !ubersichtLizenz || t.lizenz === ubersichtLizenz)
    .filter((t) => !suche || fullName(t).toLowerCase().includes(suche))
    .sort((a, b) => a.nachname.localeCompare(b.nachname, "de"));

  document.getElementById("uebersicht-empty").style.display = rows.length ? "none" : "block";
  wrap.innerHTML = rows.map((t) => `
    <div class="trainer-row" data-username="${escapeHtml(t.username)}" data-from-tab="uebersicht">
      <div class="trainer-row-main">
        <span class="trainer-row-name">${escapeHtml(fullName(t))}</span>
        <span class="trainer-row-meta">${escapeHtml(t.lizenz || "ohne Lizenz")}${t.mannschaften.length ? " · " + escapeHtml(t.mannschaften.join(", ")) : ""}</span>
      </div>
      <div class="trainer-row-badges">
        ${t.trainerkodex.bestaetigt ? badge("ok", "Kodex ✓") : badge("offen", "Kodex offen")}
        ${t.trainerdaten.vertragsGeneriert ? badge("ok", "Vertrag ✓") : (t.trainerdaten.vorhanden ? badge("offen", "Vertrag ausstehend") : badge("fehlt", "Trainerdaten fehlen"))}
        ${trainercheckisteBadges(t)}
      </div>
    </div>
  `).join("");
}

// ---------- Archiv ----------

function renderArchiv() {
  const suche = archivSuche.trim().toLowerCase();
  const rows = allTrainers
    .filter((t) => t.archiviert)
    .filter((t) => !suche || fullName(t).toLowerCase().includes(suche))
    .sort((a, b) => String(b.archiviertAm || "").localeCompare(String(a.archiviertAm || "")));

  document.getElementById("archiv-empty").style.display = rows.length ? "none" : "block";
  document.getElementById("archiv-rows").innerHTML = rows.map((t) => `
    <div class="trainer-row" data-username="${escapeHtml(t.username)}" data-from-tab="archiv">
      <div class="trainer-row-main">
        <span class="trainer-row-name">${escapeHtml(fullName(t))}</span>
        <span class="trainer-row-meta">
          Archiviert am ${escapeHtml(fmtDate(t.archiviertAm))}${t.archiviertVon ? " von " + escapeHtml(t.archiviertVon) : ""}
          ${t.archiviertGrund ? "<br>Grund: " + escapeHtml(t.archiviertGrund) : ""}
        </span>
      </div>
      <div class="trainer-row-badges">${badge("archiviert", "Archiviert")}</div>
    </div>
  `).join("");
}

// ---------- Detailansicht ----------

function renderKvCard(elId, title, items) {
  document.getElementById(elId).innerHTML = `
    <h2>${escapeHtml(title)}</h2>
    <div class="kv-grid">
      ${items.map(([label, value]) => `
        <div class="kv-item">
          <span class="kv-label">${escapeHtml(label)}</span>
          <span class="kv-value">${value}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDetail(t) {
  renderKvCard("detail-stammdaten", "Stammdaten", [
    ["Name", escapeHtml(fullName(t))],
    ["Lizenz", escapeHtml(t.lizenz || "ohne Lizenz")],
    ["Mannschaften", escapeHtml(t.mannschaften.join(", ") || "—")],
    ["Status", t.archiviert ? badge("archiviert", "Archiviert") : badge("aktiv", "Aktiv")],
    ["Login eingerichtet", t.mustSetPassword ? "Nein (noch kein Passwort gesetzt)" : "Ja"],
    ["Zuletzt angemeldet", escapeHtml(fmtDate(t.lastLoginAt))]
  ]);

  renderKvCard("detail-trainerkodex", "Trainerkodex", [
    ["Bestätigt", t.trainerkodex.bestaetigt ? badge("ok", "Ja") : badge("offen", "Noch nicht")],
    ["Datum", escapeHtml(fmtDate(t.trainerkodex.datum))]
  ]);
  document.getElementById("detail-trainerkodex").innerHTML += `<div class="detail-source-link"><a class="btn secondary small" href="${SOURCE_URLS.trainerkodex}" target="_blank" rel="noopener">Trainerkodex öffnen</a></div>`;

  const tdStatusLabel = { unvollstaendig: "Unvollständig", ausstehend: "Ausstehend", generiert: "Vertrag generiert" };
  const docOpenBtn = (docType, label) => `<button type="button" class="btn secondary small doc-open-btn" data-trainer-id="${escapeHtml(t.trainerdaten.trainerId || "")}" data-doc-type="${docType}">${escapeHtml(label)}</button>`;
  renderKvCard("detail-trainerdaten", "Trainerdaten (Vertrag)", [
    ["Status", t.trainerdaten.vorhanden ? escapeHtml(tdStatusLabel[t.trainerdaten.status] || t.trainerdaten.status) : "Kein Datensatz"],
    ["Eingereicht am", escapeHtml(fmtDate(t.trainerdaten.unterschriftAm || t.trainerdaten.erstelltAm))],
    ["Vertrag generiert", t.trainerdaten.vertragsGeneriert ? "Ja" : "Nein"],
    ["Führerschein", t.trainerdaten.fuehrerscheinHochgeladenAm
      ? `${escapeHtml(fmtDateOnly(t.trainerdaten.fuehrerscheinHochgeladenAm))} · ${t.trainerdaten.fuehrerscheinGueltig ? badge("ok", "Gültig bis " + fmtDateOnly(t.trainerdaten.fuehrerscheinGueltigBis)) : badge("fehlt", "Abgelaufen")} ${docOpenBtn("fuehrerschein", "Führerschein öffnen")}`
      : badge("fehlt", "Kein Führerschein hinterlegt")],
    ["Führungszeugnis", t.trainerdaten.fuehrungszeugnisEingereichtAm
      ? `Eingereicht am ${escapeHtml(fmtDateOnly(t.trainerdaten.fuehrungszeugnisEingereichtAm))} ${docOpenBtn("fuehrungszeugnis", "Führungszeugnis öffnen")}`
      : badge("fehlt", "Noch nicht eingereicht")]
  ]);
  document.getElementById("detail-trainerdaten").innerHTML += `<p class="muted">IBAN/Adresse werden hier bewusst nicht angezeigt — Details nur in Trainerdaten selbst.</p><div class="detail-source-link"><a class="btn secondary small" href="${SOURCE_URLS.trainerdaten}" target="_blank" rel="noopener">Trainerdaten öffnen</a></div>`;

  renderKvCard("detail-trainercheckliste", "TrainerCheckliste (Zugang/Abgang)", [
    ["Zugang", t.trainercheckliste.zugang.abgeschlossen ? badge("ok", "Abgeschlossen") : badge("offen", "Offen")],
    ["Zugang-Datum", escapeHtml(fmtDateOnly(t.trainercheckliste.zugang.datum))],
    ["Abgang", t.trainercheckliste.abgang.abgeschlossen ? badge("ok", "Abgeschlossen") : badge("offen", "Offen")],
    ["Abgang-Datum", escapeHtml(fmtDateOnly(t.trainercheckliste.abgang.datum))]
  ]);
  document.getElementById("detail-trainercheckliste").innerHTML += `<div class="detail-source-link"><a class="btn secondary small" href="${SOURCE_URLS.trainercheckliste}" target="_blank" rel="noopener">TrainerCheckliste öffnen</a></div>`;

  const pkCard = document.getElementById("detail-personalkosten");
  if (t.personalkosten) {
    renderKvCard("detail-personalkosten", "Personalkosten (aktuelle Saison)", [
      ["Mannschaft", escapeHtml(t.personalkosten.mannschaft || "—")],
      ["Position", escapeHtml(t.personalkosten.position || "—")],
      ["Besonderheit", escapeHtml(t.personalkosten.besonderheit || "—")]
    ]);
  } else {
    pkCard.innerHTML = `<h2>Personalkosten (aktuelle Saison)</h2><p class="detail-quelle-fehlt">Kein Eintrag in der aktuellen Saison gefunden.</p>`;
  }
  pkCard.innerHTML += `<div class="detail-source-link"><a class="btn secondary small" href="${SOURCE_URLS.personalkosten}" target="_blank" rel="noopener">Personalkosten öffnen</a></div>`;

  const kmCard = document.getElementById("detail-kadermanager");
  if (t.kadermanager.length) {
    kmCard.innerHTML = `<h2>Kadermanager</h2>` + t.kadermanager.map((k) => `
      <div class="kadermanager-team">
        <span>${escapeHtml(k.team)}${k.position ? " · " + escapeHtml(k.position) : ""}</span>
        <span>${(k.rollen || []).map((r) => escapeHtml(r)).join(", ") || "—"}</span>
      </div>
    `).join("");
  } else {
    kmCard.innerHTML = `<h2>Kadermanager</h2><p class="detail-quelle-fehlt">In keinem Team als Kader-Mitglied gefunden.</p>`;
  }
  kmCard.innerHTML += `<div class="detail-source-link"><a class="btn secondary small" href="${SOURCE_URLS.kadermanager}" target="_blank" rel="noopener">Kadermanager öffnen</a></div>`;

  const actions = document.getElementById("detail-actions");
  actions.innerHTML = t.archiviert
    ? `<h2>Archiv-Status</h2><p class="muted">Dieses Konto ist archiviert und kann sich nicht anmelden.</p>
       <div class="btn-row" style="justify-content:flex-start; margin-top:10px;"><button type="button" class="btn success" id="btn-reactivate">Reaktivieren</button></div>`
    : `<h2>Archivieren</h2><p class="muted">Sperrt den Login des zentralen Kontos sofort. Gruppenzugehörigkeiten bleiben erhalten.</p>
       <div class="btn-row" style="justify-content:flex-start; margin-top:10px;"><button type="button" class="btn danger" id="btn-archive">Archivieren</button></div>`;
}

// Öffnet Führerschein/Führungszeugnis direkt als Blob in einem neuen Tab (gleiche
// Konvention wie Trainerdatens eigenes _ansehenDocumentAdmin: verzögertes revoke,
// da sofortiges Freigeben die Anzeige auf manchen Browsern abbricht).
async function openTrainerdatenDocument(btn) {
  const trainerId = btn.dataset.trainerId;
  const docType = btn.dataset.docType;
  if (!trainerId) { alert("Keine Trainerdaten-Zuordnung gefunden."); return; }
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Lade…";
  try {
    const blob = await fetchTrainerdatenDocument(trainerId, docType);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (e) {
    alert("Datei nicht abrufbar: " + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function openDetail(username, fromTab) {
  const t = allTrainers.find((x) => x.username === username);
  if (!t) return;
  currentDetailUsername = username;
  detailReturnTab = fromTab || "uebersicht";
  renderDetail(t);
  activateTab("detail");
}

// ---------- Archivieren / Reaktivieren ----------

async function doArchive(username) {
  const t = allTrainers.find((x) => x.username === username);
  if (!t) return;
  if (!confirm(`${fullName(t)} wirklich archivieren? Der Login wird sofort gesperrt (Gruppenzugehörigkeit bleibt erhalten).`)) return;
  const grund = prompt("Grund fürs Archivieren (optional):", "") || "";
  try {
    await archiveTrainer(username, grund);
  } catch (e) {
    alert("Archivieren fehlgeschlagen: " + e.message);
    return;
  }
  await loadOverviewAndRender();
  openDetail(username, "uebersicht");
}

async function doReactivate(username) {
  const t = allTrainers.find((x) => x.username === username);
  if (!t) return;
  if (!confirm(`${fullName(t)} wieder reaktivieren? Der Login funktioniert danach sofort wieder.`)) return;
  try {
    await reactivateTrainer(username);
  } catch (e) {
    alert("Reaktivieren fehlgeschlagen: " + e.message);
    return;
  }
  await loadOverviewAndRender();
  openDetail(username, "archiv");
}

// ---------- Laden ----------

async function loadOverviewAndRender() {
  const overview = await fetchOverview();
  trainerGroupExists = !!overview.trainerGroupExists;
  allTrainers = Array.isArray(overview.trainers) ? overview.trainers : [];
  populateLizenzFilter();
  renderUebersicht();
  renderArchiv();
}

function showApp() {
  document.getElementById("connect-screen").style.display = "none";
  document.getElementById("app-shell").style.display = "block";
}

function showConnectScreen(errorMsg) {
  document.getElementById("connect-screen").style.display = "block";
  document.getElementById("app-shell").style.display = "none";
  const err = document.getElementById("cloud-error");
  err.style.display = errorMsg ? "block" : "none";
  err.textContent = errorMsg || "";
}

async function init() {
  document.getElementById("version-badge").textContent = "v" + APP_VERSION;
  document.getElementById("version-badge-2").textContent = "v" + APP_VERSION;
  renderChangelog();
  setupTabs();

  document.getElementById("filter-suche").addEventListener("input", (e) => { ubersichtSuche = e.target.value; renderUebersicht(); });
  document.getElementById("filter-lizenz").addEventListener("change", (e) => { ubersichtLizenz = e.target.value; renderUebersicht(); });
  document.getElementById("archiv-suche").addEventListener("input", (e) => { archivSuche = e.target.value; renderArchiv(); });

  document.getElementById("uebersicht-rows").addEventListener("click", (e) => {
    const row = e.target.closest(".trainer-row");
    if (row) openDetail(row.dataset.username, row.dataset.fromTab);
  });
  document.getElementById("archiv-rows").addEventListener("click", (e) => {
    const row = e.target.closest(".trainer-row");
    if (row) openDetail(row.dataset.username, row.dataset.fromTab);
  });
  document.getElementById("detail-actions").addEventListener("click", (e) => {
    if (e.target.closest("#btn-archive")) doArchive(currentDetailUsername);
    else if (e.target.closest("#btn-reactivate")) doReactivate(currentDetailUsername);
  });
  document.getElementById("detail-trainerdaten").addEventListener("click", (e) => {
    const btn = e.target.closest(".doc-open-btn");
    if (btn) openTrainerdatenDocument(btn);
  });

  if (!getSessionToken()) {
    showConnectScreen();
    return;
  }

  try {
    const me = await fetchMe();
    currentUsername = me.username;
    currentIsAdmin = !!me.isAdmin;
    currentVorname = me.vorname || null;
    currentNachname = me.nachname || null;
    await loadOverviewAndRender();
    showApp();
    renderHeaderUser();
  } catch (e) {
    if (e instanceof NotLoggedInError) {
      showConnectScreen();
    } else {
      showConnectScreen("Fehler beim Laden: " + e.message);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => { init(); });
