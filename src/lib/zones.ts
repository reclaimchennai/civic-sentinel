export interface ZoneData {
  id: string;
  name: string;
  mayor: { handle: string; points: number; avatar?: string };
  totalReports: number;
  activeReporters: number;
  topCategory: string;
}

export const CHENNAI_ZONES: ZoneData[] = [
  {
    id: "z1",
    name: "T. Nagar",
    mayor: { handle: "@ChennaiSuperUser", points: 4500 },
    totalReports: 342,
    activeReporters: 28,
    topCategory: "Parking Violations",
  },
  {
    id: "z2",
    name: "Adyar",
    mayor: { handle: "@AdyarWarrior", points: 3850 },
    totalReports: 289,
    activeReporters: 22,
    topCategory: "Road Damage",
  },
  {
    id: "z3",
    name: "Mylapore",
    mayor: { handle: "@MylaporeMani", points: 3200 },
    totalReports: 256,
    activeReporters: 19,
    topCategory: "Garbage Dumping",
  },
  {
    id: "z4",
    name: "Anna Nagar",
    mayor: { handle: "@AnnaNagarAce", points: 2900 },
    totalReports: 231,
    activeReporters: 24,
    topCategory: "Street Lights",
  },
  {
    id: "z5",
    name: "Velachery",
    mayor: { handle: "@VelacheryVibe", points: 2450 },
    totalReports: 198,
    activeReporters: 15,
    topCategory: "Drainage",
  },
  {
    id: "z6",
    name: "Tambaram",
    mayor: { handle: "@TambaramTiger", points: 2100 },
    totalReports: 176,
    activeReporters: 12,
    topCategory: "Encroachment",
  },
  {
    id: "z7",
    name: "Porur",
    mayor: { handle: "@PorurPatrol", points: 1800 },
    totalReports: 154,
    activeReporters: 10,
    topCategory: "Water Supply",
  },
  {
    id: "z8",
    name: "Chromepet",
    mayor: { handle: "@ChromepetChamp", points: 1650 },
    totalReports: 132,
    activeReporters: 9,
    topCategory: "Noise Pollution",
  },
];
