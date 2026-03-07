// Mock data for ÉLITE app — all in Portuguese

export interface Experience {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
  saved: boolean;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  dates: string;
  hotel: string;
  transport: string;
  status: "confirmado" | "pendente" | "concluído";
  image: string;
}

export interface Property {
  id: string;
  name: string;
  city: string;
  country: string;
  type: string;
  valuation: number;
  monthlyExpense: number;
  staff: number;
  image: string;
  appreciation: number[];
}

export interface SocialEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  rsvp: "confirmado" | "interessado" | "pendente";
}

export interface HealthAppointment {
  id: string;
  provider: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: "personal_trainer" | "médico" | "spa" | "wellness";
  contact: string;
}

export interface ActivityItem {
  id: string;
  type: "event" | "travel" | "experience" | "health" | "property";
  title: string;
  description: string;
  time: string;
  icon: string;
}

export const experiences: Experience[] = [
  {
    id: "exp1",
    title: "Degustação Privada de Vinhos",
    category: "Gastronomia",
    location: "Mayfair, Londres",
    date: "2026-03-08",
    time: "20:00",
    description: "Uma noite exclusiva com vinhos raros da Borgonha, harmonizados com queijos artesanais franceses.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop",
    saved: false,
  },
  {
    id: "exp2",
    title: "Leilão de Arte Contemporânea",
    category: "Arte",
    location: "Christie's, Nova York",
    date: "2026-03-12",
    time: "18:00",
    description: "Leilão exclusivo com peças de Basquiat, Kaws e artistas emergentes selecionados.",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop",
    saved: true,
  },
  {
    id: "exp3",
    title: "Jantar Michelin — Alain Ducasse",
    category: "Gastronomia",
    location: "The Dorchester, Londres",
    date: "2026-03-10",
    time: "19:30",
    description: "Menu degustação de 8 pratos pelo chef Alain Ducasse com vinhos selecionados.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    saved: false,
  },
  {
    id: "exp4",
    title: "Lançamento Audemars Piguet Royal Oak",
    category: "Relógios",
    location: "Genebra, Suíça",
    date: "2026-03-15",
    time: "17:00",
    description: "Evento exclusivo para o lançamento da nova coleção Royal Oak Offshore em titânio.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=400&fit=crop",
    saved: true,
  },
  {
    id: "exp5",
    title: "Concerto VIP — Andrea Bocelli",
    category: "Entretenimento",
    location: "Royal Albert Hall, Londres",
    date: "2026-03-20",
    time: "20:30",
    description: "Apresentação privada com acesso ao backstage e jantar pós-show.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    saved: false,
  },
  {
    id: "exp6",
    title: "Test Drive Rolls-Royce Spectre",
    category: "Automotivo",
    location: "Goodwood, Inglaterra",
    date: "2026-03-22",
    time: "10:00",
    description: "Experiência exclusiva com o primeiro Rolls-Royce 100% elétrico na fábrica de Goodwood.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop",
    saved: false,
  },
];

export const trips: Trip[] = [
  {
    id: "trip1",
    destination: "Maldivas",
    country: "Maldivas",
    dates: "15–22 Mar 2026",
    hotel: "Soneva Fushi Resort",
    transport: "Jato Privado Gulfstream G650",
    status: "confirmado",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop",
  },
  {
    id: "trip2",
    destination: "Tóquio",
    country: "Japão",
    dates: "2–8 Abr 2026",
    hotel: "Aman Tokyo",
    transport: "First Class Emirates",
    status: "pendente",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
  },
  {
    id: "trip3",
    destination: "Saint-Tropez",
    country: "França",
    dates: "20–27 Mai 2026",
    hotel: "Hôtel de Paris",
    transport: "Iate Privado",
    status: "pendente",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&h=400&fit=crop",
  },
  {
    id: "trip4",
    destination: "Aspen",
    country: "EUA",
    dates: "10–15 Dez 2025",
    hotel: "The Little Nell",
    transport: "Jato Privado Citation X",
    status: "concluído",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  },
];

export const properties: Property[] = [
  {
    id: "prop1",
    name: "Penthouse Knightsbridge",
    city: "Londres",
    country: "Reino Unido",
    type: "Penthouse",
    valuation: 18500000,
    monthlyExpense: 12500,
    staff: 3,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    appreciation: [15.2, 16.1, 16.8, 17.3, 17.9, 18.5],
  },
  {
    id: "prop2",
    name: "Villa Palm Jumeirah",
    city: "Dubai",
    country: "Emirados Árabes",
    type: "Villa",
    valuation: 12800000,
    monthlyExpense: 8900,
    staff: 5,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    appreciation: [10.5, 11.2, 11.8, 12.1, 12.5, 12.8],
  },
  {
    id: "prop3",
    name: "Mansão Star Island",
    city: "Miami",
    country: "EUA",
    type: "Mansão",
    valuation: 22000000,
    monthlyExpense: 15200,
    staff: 7,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    appreciation: [19.0, 19.8, 20.3, 20.9, 21.5, 22.0],
  },
  {
    id: "prop4",
    name: "Château Provence",
    city: "Provence",
    country: "França",
    type: "Château",
    valuation: 9200000,
    monthlyExpense: 6800,
    staff: 4,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    appreciation: [8.1, 8.5, 8.7, 8.9, 9.0, 9.2],
  },
];

export const socialEvents: SocialEvent[] = [
  {
    id: "soc1",
    title: "World Economic Forum — Sessão Privada",
    type: "Conferência",
    date: "2026-03-18",
    location: "Davos, Suíça",
    attendees: 45,
    description: "Mesa redonda exclusiva com líderes de tecnologia e finanças sobre o futuro da IA.",
    rsvp: "confirmado",
  },
  {
    id: "soc2",
    title: "Jantar de Networking — Tech Founders",
    type: "Networking",
    date: "2026-03-10",
    location: "The Arts Club, Londres",
    attendees: 20,
    description: "Jantar privado com fundadores de unicórnios e investidores de venture capital.",
    rsvp: "confirmado",
  },
  {
    id: "soc3",
    title: "Gala Beneficente — Fundação Amfar",
    type: "Gala",
    date: "2026-04-05",
    location: "Cannes, França",
    attendees: 300,
    description: "Gala anual com leilão de arte e performances ao vivo. Dress code: Black Tie.",
    rsvp: "interessado",
  },
  {
    id: "soc4",
    title: "Encontro VIP — Clube de Investidores",
    type: "VIP",
    date: "2026-03-25",
    location: "Soho House, Miami",
    attendees: 15,
    description: "Discussão sobre oportunidades de investimento em mercados emergentes.",
    rsvp: "pendente",
  },
];

export const healthAppointments: HealthAppointment[] = [
  {
    id: "h1",
    provider: "James Mitchell",
    specialty: "Personal Trainer",
    date: "2026-03-07",
    time: "07:00",
    location: "KX Gym, Chelsea",
    type: "personal_trainer",
    contact: "+44 20 7123 4567",
  },
  {
    id: "h2",
    provider: "Dra. Isabella Romano",
    specialty: "Dermatologista",
    date: "2026-03-09",
    time: "14:00",
    location: "Harley Street Clinic",
    type: "médico",
    contact: "+44 20 7890 1234",
  },
  {
    id: "h3",
    provider: "The Lanesborough Spa",
    specialty: "Spa & Wellness",
    date: "2026-03-11",
    time: "11:00",
    location: "The Lanesborough, Londres",
    type: "spa",
    contact: "+44 20 7259 5599",
  },
  {
    id: "h4",
    provider: "Dr. Marcus Chen",
    specialty: "Médico Cardiologista",
    date: "2026-03-13",
    time: "10:30",
    location: "London Bridge Hospital",
    type: "médico",
    contact: "+44 20 7407 3100",
  },
  {
    id: "h5",
    provider: "Mindfulness Studio",
    specialty: "Meditação & Mindfulness",
    date: "2026-03-08",
    time: "08:00",
    location: "Re:Mind Studio, Mayfair",
    type: "wellness",
    contact: "+44 20 7946 0958",
  },
  {
    id: "h6",
    provider: "Sophie Laurent",
    specialty: "Nutricionista",
    date: "2026-03-14",
    time: "16:00",
    location: "Clínica Privada, Knightsbridge",
    type: "wellness",
    contact: "+44 20 7225 3311",
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "act1",
    type: "experience",
    title: "Nova experiência disponível",
    description: "Degustação privada de vinhos esta noite em Mayfair.",
    time: "Há 2 horas",
    icon: "🍷",
  },
  {
    id: "act2",
    type: "travel",
    title: "Viagem confirmada",
    description: "Maldivas — jato privado reservado para 15 de março.",
    time: "Há 5 horas",
    icon: "✈️",
  },
  {
    id: "act3",
    type: "event",
    title: "Convite recebido",
    description: "Gala Amfar em Cannes — confirmação pendente.",
    time: "Ontem",
    icon: "💎",
  },
  {
    id: "act4",
    type: "health",
    title: "Lembrete de consulta",
    description: "Personal trainer amanhã às 7h — KX Gym Chelsea.",
    time: "Ontem",
    icon: "💪",
  },
  {
    id: "act5",
    type: "property",
    title: "Atualização de patrimônio",
    description: "Valorização de +2.3% na Villa Palm Jumeirah.",
    time: "2 dias atrás",
    icon: "🏠",
  },
];

export const todayAgenda = [
  { time: "07:00", title: "Personal Trainer — KX Gym", type: "health" },
  { time: "09:30", title: "Reunião com gestor de patrimônio", type: "event" },
  { time: "12:00", title: "Almoço — Nobu Berkeley", type: "experience" },
  { time: "14:30", title: "Chamada de vídeo — arquiteto Dubai", type: "property" },
  { time: "17:00", title: "Spa — The Lanesborough", type: "health" },
  { time: "20:00", title: "Degustação de vinhos — Mayfair", type: "experience" },
];

export const categories = [
  "Todos",
  "Gastronomia",
  "Arte",
  "Relógios",
  "Entretenimento",
  "Automotivo",
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
