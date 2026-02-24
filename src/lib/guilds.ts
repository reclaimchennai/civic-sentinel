export interface Guild {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  maxMembers: number;
  totalPoints: number;
  level: number;
  zone: string;
  tags: string[];
  currentChallenge?: { title: string; progress: number; target: number };
  members: {
    handle: string;
    role: "leader" | "officer" | "member";
    points: number;
  }[];
}

export const MOCK_GUILDS: Guild[] = [
  {
    id: "g1",
    name: "T. Nagar Tigers",
    description:
      "The fiercest civic watchdogs in T. Nagar. We keep Ranganathan Street and Pondy Bazaar spotless.",
    icon: "Cat",
    memberCount: 24,
    maxMembers: 30,
    totalPoints: 18500,
    level: 5,
    zone: "T. Nagar",
    tags: ["Parking", "Road Damage", "Top Guild"],
    currentChallenge: {
      title: "Clean Pondy Bazaar",
      progress: 32,
      target: 50,
    },
    members: [
      { handle: "@ChennaiSuperUser", role: "leader", points: 4500 },
      { handle: "@TNagarTamil", role: "officer", points: 3200 },
      { handle: "@RanganathanRaj", role: "officer", points: 2800 },
      { handle: "@PondyPatrol", role: "member", points: 1900 },
      { handle: "@BazaarBoss", role: "member", points: 1450 },
    ],
  },
  {
    id: "g2",
    name: "Adyar Avengers",
    description:
      "Protecting the Adyar estuary and neighbourhood streets. From Besant Nagar beach to IIT campus.",
    icon: "Bird",
    memberCount: 18,
    maxMembers: 25,
    totalPoints: 14200,
    level: 4,
    zone: "Adyar",
    tags: ["Drainage", "Sanitation", "Environment"],
    currentChallenge: {
      title: "Adyar River Cleanup Drive",
      progress: 18,
      target: 30,
    },
    members: [
      { handle: "@AdyarWarrior", role: "leader", points: 3850 },
      { handle: "@BesantBeach", role: "officer", points: 2600 },
      { handle: "@IITWatcher", role: "member", points: 2100 },
      { handle: "@ElliotsEye", role: "member", points: 1750 },
    ],
  },
  {
    id: "g3",
    name: "Mylapore Monitors",
    description:
      "Heritage guardians of Mylapore. We protect the temple streets and historic lanes from civic neglect.",
    icon: "Landmark",
    memberCount: 15,
    maxMembers: 20,
    totalPoints: 11800,
    level: 4,
    zone: "Mylapore",
    tags: ["Garbage Dumping", "Encroachment", "Heritage"],
    currentChallenge: {
      title: "Temple Street Sweep",
      progress: 12,
      target: 20,
    },
    members: [
      { handle: "@MylaporeMani", role: "leader", points: 3200 },
      { handle: "@KapaliKumar", role: "officer", points: 2400 },
      { handle: "@SanSomeStreet", role: "member", points: 1800 },
      { handle: "@MandaveliFan", role: "member", points: 1500 },
    ],
  },
  {
    id: "g4",
    name: "Anna Nagar Alliance",
    description:
      "Organised civic watchers covering Anna Nagar East, West, and the Tower Park area. Streetlights are our specialty.",
    icon: "TowerControl",
    memberCount: 21,
    maxMembers: 30,
    totalPoints: 13600,
    level: 4,
    zone: "Anna Nagar",
    tags: ["Street Lights", "Road Damage", "Parks"],
    currentChallenge: {
      title: "Light Up Anna Nagar",
      progress: 27,
      target: 40,
    },
    members: [
      { handle: "@AnnaNagarAce", role: "leader", points: 2900 },
      { handle: "@TowerParkPro", role: "officer", points: 2500 },
      { handle: "@SecondAveWatch", role: "officer", points: 2200 },
      { handle: "@ShanthiColony", role: "member", points: 1700 },
      { handle: "@ANEastPatrol", role: "member", points: 1350 },
    ],
  },
  {
    id: "g5",
    name: "Velachery Vigilantes",
    description:
      "Battling waterlogging and traffic chaos in Velachery. Every monsoon, we are on the frontlines.",
    icon: "Waves",
    memberCount: 12,
    maxMembers: 20,
    totalPoints: 8900,
    level: 3,
    zone: "Velachery",
    tags: ["Drainage", "Flooding", "Traffic"],
    currentChallenge: {
      title: "Monsoon Ready Velachery",
      progress: 8,
      target: 25,
    },
    members: [
      { handle: "@VelacheryVibe", role: "leader", points: 2450 },
      { handle: "@TaramaniTech", role: "officer", points: 1900 },
      { handle: "@VijayaNagarV", role: "member", points: 1400 },
    ],
  },
];
