const APP_VERSION = "1.5";

const APP_CHANGELOG = [
  {
    version: "1.5",
    groups: [
      {
        title: "Geburtsdatum/Adresse/Kontakt aus Trainerdaten",
        items: [
          "Die Trainerdaten-Karte zeigt jetzt zusätzlich Geburtsdatum, Adresse, Telefonnummer und E-Mail-Adresse an.",
          "IBAN/Bankverbindung bleiben weiterhin ausgeblendet."
        ]
      }
    ]
  },
  {
    version: "1.4",
    groups: [
      {
        title: "Führerschein/Führungszeugnis übersichtlicher",
        items: [
          "Führerschein und Führungszeugnis stehen jetzt als eigene, untereinander angeordnete Zeilen statt gemeinsam mit Status/Vertrag im selben Raster."
        ]
      }
    ]
  },
  {
    version: "1.3",
    groups: [
      {
        title: "Alle Nutzer statt nur Gruppe „Trainer“",
        items: [
          "Die Übersicht zeigt jetzt jedes Nutzerkonto, nicht mehr nur Mitglieder der Gruppe „Trainer“."
        ]
      }
    ]
  },
  {
    version: "1.2",
    groups: [
      {
        title: "Dokumente direkt öffnen",
        items: [
          "„Führerschein öffnen“ und „Führungszeugnis öffnen“ direkt in der Trainerdaten-Karte, statt erst in Trainerdaten selbst nachschauen zu müssen.",
          "Führungszeugnis bleibt dabei weiterhin nur für Admins einsehbar, Führerschein für Admins und die Gruppe „Führerschein Einsicht“ — gleiche Rechte wie in Trainerdaten selbst."
        ]
      }
    ]
  },
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
