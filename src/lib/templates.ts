export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  defaultSeverity: number;
  defaultNotes: string;
  usageCount: number;
  creator: string;
}

export const MOCK_TEMPLATES: ReportTemplate[] = [
  {
    id: "t1",
    name: "Standard Pothole",
    category: "Road Damage",
    subCategory: "Pothole",
    defaultSeverity: 3,
    defaultNotes: "Pothole on main road, approximately 1ft wide",
    usageCount: 234,
    creator: "@ChennaiSuperUser",
  },
  {
    id: "t2",
    name: "Blocked Drain",
    category: "Drainage",
    subCategory: "Blocked Drain",
    defaultSeverity: 4,
    defaultNotes: "Storm drain blocked with debris/garbage",
    usageCount: 189,
    creator: "@AdyarWarrior",
  },
  {
    id: "t3",
    name: "Illegal Parking",
    category: "Parking",
    subCategory: "No Parking Zone",
    defaultSeverity: 2,
    defaultNotes:
      "Vehicle parked in no-parking zone blocking pedestrian path",
    usageCount: 156,
    creator: "@MylaporeMani",
  },
  {
    id: "t4",
    name: "Streetlight Out",
    category: "Street Lights",
    subCategory: "Non-functional",
    defaultSeverity: 3,
    defaultNotes: "Streetlight not working, area is dark at night",
    usageCount: 142,
    creator: "@AnnaNagarAce",
  },
  {
    id: "t5",
    name: "Garbage Dump",
    category: "Sanitation",
    subCategory: "Illegal Dumping",
    defaultSeverity: 4,
    defaultNotes: "Garbage dumped on public road/empty lot",
    usageCount: 198,
    creator: "@VelacheryVibe",
  },
];
