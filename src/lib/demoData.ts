import {
  Badge, Course, CourseProgress, FeedSummaryData, Post, RightNewsItem, UserMini, Workshop,
  Deal, Specialist, UserProfile, UserTag, SubscriptionRow, InvoiceRow
} from "./types";

/** ─────────────────────────────────────────────────────────────
 *  Users (avatars en /public/users/)
 *  ────────────────────────────────────────────────────────────*/
export const USERS: Record<"zula" | "mary" | "mafer", UserMini> = {
  zula: {
    id: "zula",
    name: "Zula",
    role: "CFO de Blockbears | DOTCARE",
    admin: true,
    avatar: "/users/zula.png",
  },
  mary: {
    id: "mary",
    name: "Mary",
    role: "CEO de Blockbears | DOTCARE",
    admin: true,
    avatar: "/users/mary.png",
  },
  mafer: {
    id: "mafer",
    name: "Mafer",
    role: "CTO de Blockbears | DOTCARE",
    admin: true,
    avatar: "/users/mafer.png",
  },
};

/** ─────────────────────────────────────────────────────────────
 *  Badges & Feed summary
 *  ────────────────────────────────────────────────────────────*/
export const BADGES: Badge[] = [
  { id: "focus", name: "Focus Protocol", color: "bg-emerald-500" },
  { id: "starter", name: "Starter Pack", color: "bg-cyan-500" },
  { id: "streak7", name: "Streak 7d", color: "bg-fuchsia-500" },
];

export const COURSES_PROGRESS: CourseProgress[] = [
  {
    id: "silva",
    title: "Método Silva — Fundamentos",
    slug: "metodo-silva",
    progress: 35,
    minutes: 120,
  },
  {
    id: "enfoque",
    title: "Protocolos de Enfoque — Antifrágil",
    slug: "protocolos-de-enfoque",
    progress: 60,
    minutes: 180,
  },
  {
    id: "riesgo",
    title: "Cálculo de Riesgo Emocional",
    slug: "calculo-de-riesgo",
    progress: 10,
    minutes: 95,
  },
];

export const FEED_SUMMARY: FeedSummaryData = {
  user: USERS.mary,
  addressShort: "0x12…A9E3",
  badges: BADGES,
  streakDays: 5,
  coursesInProgress: COURSES_PROGRESS,
};

/** ─────────────────────────────────────────────────────────────
 *  Right column (news)
 *  ────────────────────────────────────────────────────────────*/
export const RIGHT_NEWS: RightNewsItem[] = [
  {
    id: "n1",
    title: "Nuevo módulo: Deep Work Descentralizado",
    tag: "Nuevo",
    href: "/premium/cursos/protocolos-de-enfoque",
    dateISO: "2025-10-08T09:00:00.000Z",
  },
  {
    id: "n2",
    title: "Actualización de Workshops: Productividad x Web3",
    tag: "Update",
    href: "/premium/intro/workshops",
    dateISO: "2025-10-07T15:30:00.000Z",
  },
  {
    id: "n3",
    title: "Guía rápida: Matriz de Eisenhower (plantilla)",
    tag: "Recurso",
    href: "/premium/cursos",
    dateISO: "2025-10-06T11:00:00.000Z",
  },
];

/** ─────────────────────────────────────────────────────────────
 *  Workshops
 *  ────────────────────────────────────────────────────────────*/
export const WORKSHOPS_UPCOMING: Workshop[] = [
  {
    id: "w1",
    title: "Productividad Antifrágil con Protocolos de Enfoque",
    description: "Diseña tu ‘Smart Contract del Tiempo’.",
    startsAtISO: "2025-10-12T18:00:00.000Z",
    durationMin: 60,
    mode: "Workshop",
  },
  {
    id: "w2",
    title: "Deep Work Descentralizado: Bloquea el ruido",
    description: "Regla de Ulises + herramientas.",
    startsAtISO: "2025-10-15T17:00:00.000Z",
    durationMin: 45,
    mode: "Live Stream",
  },
];

export const WORKSHOPS_PAST: Workshop[] = [
  {
    id: "p1",
    title: "Matriz de Eisenhower — Casos reales",
    description: "Cómo priorizar sin culpa.",
    startsAtISO: "2025-10-01T19:00:00.000Z",
    durationMin: 40,
    mode: "Live Stream",
    recordingUrl: "/premium/intro/workshops?p=p1",
  },
  {
    id: "p2",
    title: "Pomodoro 10-3-2-1 — Setup rápido",
    description: "Stack de energía para builders.",
    startsAtISO: "2025-09-25T16:00:00.000Z",
    durationMin: 35,
    mode: "AMA",
    recordingUrl: "/premium/intro/workshops?p=p2",
  },
];

/** ─────────────────────────────────────────────────────────────
 *  Wall / Posts seed
 *  ────────────────────────────────────────────────────────────*/
export const POSTS_SEED: Post[] = [
  {
    id: "nv1",
    scope: "novedades",
    authorId: "mary",
    title: "¡Lanzamos el Dashboard Premium!",
    text:
      "Primera versión con Feed, Workshops y muro. Si ves algo raro en modo light, avísanos.",
    createdAtISO: "2025-10-08T14:10:00.000Z",
  },
  {
    id: "cm1",
    scope: "comenta",
    authorId: "zula",
    title: "¿Qué app de timeboxing recomiendan?",
    text: "Quiero algo simple con integraciones a calendario.",
    createdAtISO: "2025-10-07T10:00:00.000Z",
  },
  {
    id: "cd1",
    scope: "codigo",
    authorId: "mafer",
    title: "Código de conducta — borrador",
    text:
      "Respeto, cero spam, y foco en aportar valor. Sugerencias bienvenidas.",
    createdAtISO: "2025-10-06T09:00:00.000Z",
  },
  {
    id: "sp1",
    scope: "soporte",
    authorId: "mary",
    title: "Soporte de cuenta",
    text:
      "Si no te carga el feed, limpia cache o recarga. Deja tu caso aquí y te respondemos.",
    createdAtISO: "2025-10-05T12:00:00.000Z",
  },
  {
    id: "fb1",
    scope: "feedback",
    authorId: "zula",
    title: "Feedback del modo oscuro",
    text:
      "Se ve 🔥. En light hay subtítulos muy pálidos; sugeriría subir contraste.",
    createdAtISO: "2025-10-05T13:20:00.000Z",
  },
];

/** ─────────────────────────────────────────────────────────────
 *  Courses — listado y detalle
 *  ────────────────────────────────────────────────────────────*/
export const COURSES: Course[] = [
  {
    id: "c1",
    slug: "metodo-silva",
    title: "Método Silva — Fundamentos",
    tagline: "Reprograma tu enfoque para estados de alto rendimiento.",
    minutesTotal: 120,
    progressPct: 35,
    modules: [
      {
        id: "m1",
        title: "Introducción y base mental",
        lessons: [
          { id: "l1", title: "Qué es el Método Silva", minutes: 8 },
          { id: "l2", title: "Principios de visualización", minutes: 12 },
          { id: "l3", title: "Práctica Alfa breve", minutes: 10 },
        ],
      },
      {
        id: "m2",
        title: "Aplicaciones prácticas",
        lessons: [
          { id: "l4", title: "Límites y foco", minutes: 15 },
          { id: "l5", title: "Anclajes y hábitos", minutes: 18 },
        ],
      },
    ],
  },
  {
    id: "c2",
    slug: "protocolos-de-enfoque",
    title: "Protocolos de Enfoque — Antifrágil",
    tagline: "Convierte tu mente en un nodo que mejora con el estrés.",
    minutesTotal: 180,
    progressPct: 60,
    modules: [
      {
        id: "m1",
        title: "Deep Work Descentralizado",
        lessons: [
          { id: "l1", title: "El activo más escaso", minutes: 10 },
          { id: "l2", title: "Regla de Ulises", minutes: 12 },
        ],
      },
      {
        id: "m2",
        title: "Contrato del Tiempo",
        lessons: [
          { id: "l3", title: "Timeboxing y 20/20/20", minutes: 16 },
          { id: "l4", title: "Método Ivy Lee", minutes: 10 },
        ],
      },
    ],
  },
  {
    id: "c3",
    slug: "calculo-de-riesgo",
    title: "Cálculo de Riesgo Emocional",
    tagline: "Toma decisiones con métricas y menos sesgos.",
    minutesTotal: 95,
    progressPct: 10,
    modules: [
      {
        id: "m1",
        title: "Fundamentos",
        lessons: [
          { id: "l1", title: "Mapa emocional", minutes: 9 },
          { id: "l2", title: "Sesgos comunes", minutes: 11 },
        ],
      },
      {
        id: "m2",
        title: "Herramientas",
        lessons: [
          { id: "l3", title: "Matriz básica de riesgo", minutes: 14 },
          { id: "l4", title: "Checklist de verificación", minutes: 10 },
        ],
      },
    ],
  },
];

/** ─────────────────────────────────────────────────────────────
 *  Estado mutable (mock) para progreso/streak
 *  ────────────────────────────────────────────────────────────*/
export const STATE = {
  streakDays: FEED_SUMMARY.streakDays,
  courseProgressPct: Object.fromEntries(
    COURSES.map((c) => [c.slug, c.progressPct ?? 0])
  ) as Record<string, number>,
};

/** ─────────────────────────────────────────────────────────────
 *  Datos Interesantes — Descuentos & Especialistas
 *  (imágenes opcionales en /public/images/…; si faltan se muestra emoji)
 *  ────────────────────────────────────────────────────────────*/
export const DEALS = [
  {
    id: "d-notion",
    title: "Notion — 20% OFF plan Plus",
    image: "/images/deals/notion.png",
    excerpt: "Organiza tu cerebro en bloques. Perk para DOTCARE.",
    body:
      "Incluye espacios ilimitados, colaboradores y control de permisos.\n\n" +
      "- Activación inmediata\n- Aplica a cuentas nuevas\n- Válido hasta Q4\n\n" +
      "Pro tip: usa la plantilla de **Matriz de Eisenhower** del dashboard.",
    cta: { label: "Ir a Notion", href: "https://www.notion.so" },
  },
  {
    id: "d-grammarly",
    title: "Grammarly — 3 meses Premium",
    image: "/images/deals/grammarly.png",
    excerpt: "Escritura clara y tono profesional.",
    body:
      "Cobertura en inglés y español con detección de tono.\n\n" +
      "- Extensiones para navegador\n- Integración con Gmail y docs\n- Soporte para equipos",
    cta: { label: "Reclamar", href: "https://www.grammarly.com" },
  },
];

export const SPECIALISTS = [
  {
    id: "s-ana",
    name: "Ana Ponce",
    image: "/images/experts/ana.png",
    specialty: "Psicología del alto rendimiento",
    excerpt: "Protocolos de foco y gestión emocional para builders.",
    body:
      "Sesiones 1:1 y grupos reducidos. Programa de 4 semanas con medición de hábitos.\n\n" +
      "- Evaluación inicial\n- Diseño de rutina personalizada\n- Seguimiento semanal",
    contact: { label: "Agendar", href: "/subscribe" },
  },
  {
    id: "s-luis",
    name: "Luis Ortega",
    image: "/images/experts/luis.png",
    specialty: "Nutrición para productividad",
    excerpt: "Estrategias de energía sostenida y sueño.",
    body:
      "Stack de nutrición práctica para builders y founders.\n\n" +
      "- Auditoría de hábitos\n- Plan semanal\n- Protocolos 10-3-2-1",
    contact: { label: "Consultar", href: "/subscribe" },
  },
];

/** Avatar helper (solo usamos estas 4 imágenes) */
export const AVATARS = {
  mary: "/users/mary.png",
  mafer: "/users/mafer.png",
  zula: "/users/zula.png",
  default: "/users/dotcare.png",
} as const;

/** Perfil por defecto (sin wallet): GM, Builder + DOTCARE con avatar dotcare.png */
export const PROFILE_STATE: UserProfile = {
  id: "u_demo",
  address: "—",
  addressShort: "guest",
  alias: "Builder",
  bio: "Una bio corta sobre ti, tus intereses y lo que te hace especial",
  avatar: AVATARS.default,
  tag: "DOTCARE",
  xUrl: "https://x.com/gavofyork",
};

/** Colores por tag (tokens del brief) */
export function tagBg(tag: UserTag) {
  const token =
    tag === "ADMIN" ? "var(--violet)" :
    tag === "NERD" ? "var(--cyan)" :
    tag === "DOTCARELOVER" ? "var(--emerald)" :
    "var(--magenta)"; // DOTCARE
  return `color-mix(in oklab, ${token} 22%, transparent)`;
}

/** Billing mock (para la pestaña Billing) */
export const SUBSCRIPTION: SubscriptionRow = {
  product: "DOTCARE Premium",
  status: "activo",
  amountUsd: 12,
  renewISO: "2025-11-01T12:00:00.000Z",
};

export const INVOICES: InvoiceRow[] = [
  {
    dateISO: "2025-10-01T12:00:00.000Z",
    product: "DOTCARE Premium",
    amountUsd: 12,
    status: "Paid",
    txHash: "0x5e1f...9ab2",
    explorerUrl: "https://etherscan.io/tx/0x5e1f...9ab2",
  },
];