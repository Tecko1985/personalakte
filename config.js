const APP_VERSION = "1.2";

const APP_CHANGELOG = [
  {
    version: "1.2",
    groups: [
      {
        title: "Bugfix",
        items: [
          "„Vertrag ausstehend" wurde auch für bereits digital unterschriebene Trainerverträge angezeigt — Personalakte las noch die Felder aus der Zeit vor dem digitalen Unterschreiben-Workflow in Trainerdaten. Zeigt Vertragsstatus jetzt korrekt an, inkl. Bereitgestellt-/Unterschrieben-Datum in der Detailansicht."
        ]
      }
    ]
  },
  {
    version: "1.1",
    groups: [
      {
        title: "Trainerdaten",
        items: [
          "Trainerlizenz-Status (Dokument-Scan) ergänzt und direkt öffenbar — an derselben Stelle wie Führerschein/Führungszeugnis, Rechte serverseitig geprüft (nur Admin)."
        ]
      }
    ]
  },
  {
    version: "1.0",
    groups: [
      {
        title: "Übersicht",
        items: [
          "Zusammengeführte Ansicht aller Trainer/Nutzerkonten: Lizenz, Mannschaften, Trainerkodex-Status, Trainerdaten (inkl. Geburtsdatum, Adresse, Telefon, E-Mail sowie Führerschein- und Führungszeugnis-Status) und Checkliste Zugang/Abgang auf einen Blick. IBAN/Bankverbindung bleiben bewusst ausgeblendet.",
          "Führerschein und Führungszeugnis lassen sich direkt aus der Trainerdaten-Karte öffnen — Führungszeugnis nur für Admins, Führerschein für Admins und die Gruppe „Führerschein Einsicht“ (Rechte serverseitig geprüft).",
          "Suchfeld und Lizenz-Filter für die Übersichtsliste.",
          "Detailansicht pro Trainer mit allen Quellen (zusätzlich Personalkosten-Saison und Kadermanager-Rolle) — bearbeitet wird weiterhin nur in der jeweiligen Quell-App, die Personalakte selbst ist rein lesende Aggregation."
        ]
      },
      {
        title: "Archiv",
        items: [
          "Trainer, die den Verein verlassen, lassen sich archivieren: das zentrale Konto wird für den Login gesperrt, ein Datenschnappschuss wandert ins Archiv.",
          "Gruppenzugehörigkeiten bleiben beim Archivieren unangetastet.",
          "Archivierte Trainer lassen sich jederzeit wieder reaktivieren — der Login funktioniert danach sofort wieder."
        ]
      }
    ]
  }
];
