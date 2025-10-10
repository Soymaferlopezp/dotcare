// ==== Badges / Feed ====
export type Badge = { id: string; name: string; color?: string };

export type CourseProgress = {
  id: string;
  title: string;
  slug: string;
  progress: number;
  minutes: number;
};

export type UserMini = {
  id: "zula" | "mary" | "mafer";
  name: string;
  role: string;
  admin: boolean;
  avatar: string;
};

export type FeedSummaryData = {
  user: UserMini;
  addressShort: string;
  badges: Badge[];
  streakDays: number;
  coursesInProgress: CourseProgress[];
};

export type RightNewsItem = {
  id: string;
  title: string;
  tag?: string;
  href?: string;
  dateISO: string;
};

// ==== Workshops / Wall ====
export type Workshop = {
  id: string;
  title: string;
  description: string;
  startsAtISO: string;
  durationMin: number;
  mode: "Live Stream" | "AMA" | "Workshop";
  recordingUrl?: string;
};

export type PostScope = "novedades" | "comenta" | "codigo" | "soporte" | "feedback";
export type Post = {
  id: string;
  scope: PostScope;
  authorId: UserMini["id"];
  title?: string;
  text: string;
  createdAtISO: string;
};

// ==== Courses ====
export type Lesson = { id: string; title: string; minutes: number };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Course = {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  minutesTotal: number;
  modules: Module[];
  progressPct?: number;
};

// ==== Datos Interesantes ====
export type Deal = {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  body: string;
  cta?: { label: string; href: string };
};

export type Specialist = {
  id: string;
  name: string;
  image: string;
  specialty: string;
  excerpt: string;
  body: string;
  contact?: { label: string; href: string };
};

// === Perfil / Billing ===
export type UserTag = "ADMIN" | "NERD" | "DOTCARELOVER" | "DOTCARE";

export type UserProfile = {
  id: string;
  // si no hay wallet aún, estos pueden ser "—" y "guest"
  address: string;
  addressShort: string;
  alias: string;        // seudónimo (por defecto: "Builder")
  bio?: string;
  avatar: string;       // /users/dotcare.png o /users/{admin}.png o URL
  tag: UserTag;
  xUrl?: string;
};

export type SubscriptionRow = {
  product: string;
  status: "activo" | "suspendido";
  amountUsd: number;
  renewISO: string;
};

export type InvoiceRow = {
  dateISO: string;
  product: string;
  amountUsd: number;
  status: "Paid";
  txHash: string;
  explorerUrl: string;
};
