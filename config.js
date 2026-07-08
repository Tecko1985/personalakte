const APP_VERSION = "1.1";

const APP_CHANGELOG = [
  {
    version: "1.1",
    groups: [
      {
        title: "Führerschein/Führungszeugnis aus Trainerdaten",
        items: [
          "Die Trainerdaten-Karte zeigt jetzt zusätzlich Führerschein- (inkl. Gültigkeit) und Führungszeugnis-Status.",
          "Die separate Fahrtenbuch-Karte entfällt — das Führerschein-Register ist dorthin migriert, siehe Trainerdaten."
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
          "Zusammengeführte Ansicht aller aktiven Trainer (Mitglieder der Gruppe „Trainer“): Lizenz, Mannschaften, Trainerkodex-Status, Trainerdaten-Status und Checkliste Zugang/Abgang auf einen Blick.",
          "Suchfeld und Lizenz-Filter für die Übersichtsliste.",
          "Detailansicht pro Trainer mit allen Quellen (zusätzlich Personalkosten-Saison, Kadermanager-Rolle, Fahrtenbuch-Führerschein-Status) — Bearbeitet wird weiterhin nur in der jeweiligen Quell-App, die Personalakte selbst ist rein lesende Aggregation."
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
