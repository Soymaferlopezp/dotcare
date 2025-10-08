# DOTCARE (setup mínimo)

DOTCARE — Setup base (Next.js + Tailwind + shadcn-like + Supabase + Web3 Paseo)

Plataforma de bienestar con token-gating para builders Web3.

Framework: Next.js 15 (App Router, TypeScript, src/).

UI: Tailwind CSS v3 (modo estable) + componentes estilo shadcn (Button, Card, Input) + toasts con sonner.

Datos: Supabase cliente vía .env (sin Prisma).

Web3: wagmi v2 + RainbowKit v2 + viem v2, red Paseo (Polkadot EVM testnet) con RPC propio, WalletConnect (Project ID).

Idioma base: ES.

1) Requisitos

Node ≥ 18.18 (ideal 20/22).

npm ≥ 9.

Windows CMD (no PowerShell).

Extensión de wallet EVM (MetaMask/Brave/OKX).

2) Instalación
cd dotcare
npm install
npm run dev -- -p 3000


Abrir: http://localhost:3000/

3) Variables de entorno

Crear .env.local en la raíz del repo:

# Paseo (Polkadot) — Passet Hub EVM testnet
NEXT_PUBLIC_CHAIN_ID=420420422
NEXT_PUBLIC_RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<tu_project_id_wc>

# Supabase (solo cliente)
NEXT_PUBLIC_SUPABASE_URL=<https://xxxxx.supabase.co>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<eyJhbGciOi...>


Importante:

Next solo expone variables que comienzan con NEXT_PUBLIC_.

Tras modificar .env.local, reinicia npm run dev.

4) Estructura relevante
src/
  app/
    api/health/route.ts    ← endpoint de salud
    globals.css            ← @tailwind base|components|utilities
    layout.tsx             ← Providers + Toaster (dark mode por clase)
    page.tsx               ← Home + ConnectButton + demo UI
    providers.tsx          ← Wagmi + React Query + RainbowKit (v2)
    subscribe/page.tsx     ← placeholder newsletter
    premium/page.tsx       ← placeholder token-gating
  components/ui/           ← button, card, input, toaster
  lib/
    utils.ts               ← cn()
    supabase.ts            ← cliente (solo front)
    wagmi.ts               ← config Paseo + WC (v2)

5) Decisiones de diseño (y por qué)

Tailwind v3 (no v4): evitamos el plugin @tailwindcss/postcss y cambios de última hora; v3 es estable en Next 15.

CSS global dentro de app/ e import relativo ("./globals.css"): alias @/ no siempre aplica a CSS global en App Router.

Supabase en cliente: usamos NEXT_PUBLIC_SUPABASE_* para que las credenciales anónimas lleguen al navegador.

Wagmi/RainbowKit v2 con getDefaultConfig: una sola fuente de verdad para conectores y chains (evita choques con helpers viejos).

Paseo EVM: chain personalizado con defineChain, chainId=420420422, RPC oficial; RainbowKit initialChain = Paseo.

Dark mode: darkMode: "class" + <html className="dark"> para forzar tema ahora (se puede reemplazar por toggler después).

Warning de workspace root: forzado con outputFileTracingRoot: process.cwd() y eliminación de lockfile “intruso” en la carpeta de usuario.

6) Scripts útiles (CMD)
npm run dev -- -p 3000     # arrancar en 3000
npm run dev -- -p 3001     # alterno si hay conflicto
rmdir /S /Q .next          # limpiar caché de Next en Windows

7) Health check

Endpoint mínimo:

GET /api/health → { ok: true, paseo: { chainId, rpcConfigured }, walletconnect: bool, supabaseEnv: bool, time }

Prueba rápida:

curl http://127.0.0.1:3000/api/health

---

# DOTCARE Landing Page

Promesa: “Estructura mental + hábitos medibles para sostener el ritmo builder”
Stack: Next.js (App Router + TS), Tailwind, RainbowKit + wagmi/viem, Google Fonts (Space Grotesk, Inter, JetBrains Mono).

🚀 Objetivo del Hito 1

Construir una landing token-aware (sin lógica de gating aún) con secciones clave, branding y accesibilidad base, más conexión de wallet EVM en la chain Paseo (Polkadot) Testnet — Passet Hub.

📦 Instalación & Scripts

Requisitos

Node.js 18+

npm (Windows CMD)

Instalación

npm install


Desarrollo

npm run dev


Build

npm run build


Preview

npm run start

🌐 Variables de entorno

Crea .env.local en la raíz:

# WalletConnect (RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Paseo (Polkadot) – Passet Hub EVM Testnet
NEXT_PUBLIC_CHAIN_ID=420420422
NEXT_PUBLIC_RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io


Nota: si cambias de red, ajusta CHAIN_ID y RPC_URL y actualiza el defineChain en src\lib\wagmi.ts.

🧱 Estructura del proyecto (Hito 1)
src\
  app\
    layout.tsx          # Fuentes, ThemeProvider, Providers, tokens
    globals.css         # Tailwind layers + a11y + base tipográfica
    tokens.css          # Tokens (CSS variables) light/dark
    page.tsx            # Landing: Header + secciones + Footer
    subscribe\
      page.tsx          # Placeholder /subscribe
    providers.tsx       # Wagmi + React Query + RainbowKitProvider
  components\
    Header.tsx
    ThemeProvider.tsx
    ThemeToggle.tsx         # (opc.) toggle simple
    SkipLink.tsx            # A11y
    Hero.tsx
    Sponsors.tsx
    ProblemSection.tsx
    OpportunitySection.tsx
    BenefitsSection.tsx
    Testimonials.tsx
    Pricing.tsx
    Team.tsx
    Footer.tsx
  lib\
    copy.ts                 # Single source of truth de contenidos
    wagmi.ts                # Chain Paseo y config Wagmi + RainbowKit
public\
  brand\dotcare_light.png   # Logo para fondos oscuros
  brand\dotcare_dark.png    # Logo para fondos claros
  logos\nerdconf_light.png
  logos\nerdconf_dark.png
  logos\polkadot_light.png
  logos\polkadot_dark.png
next.config.mjs
README.md

🖋️ Tipografías

Títulos (H1–H3): Space Grotesk

Párrafos/UI: Inter

Micro-UI/Técnico: JetBrains Mono

Se inyectan con next/font en layout.tsx y se aplican vía variables CSS:

<body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ...`}>

🎨 Tokens & Branding

Archivo: src\app\tokens.css
(CSS variables mapeadas a Tailwind en tailwind.config.js vía theme.extend.colors)

Fondos: --ink, --surface, --panel

Texto: --text, --muted

Bordes: --border

Acentos/estado: --emerald, --cyan, --magenta, --violet, --amber, --success, --error

Buenas prácticas

Texto legible en fondos oscuros; contrastes AA/AAA.

Gradientes/glow solo en CTAs y destacados.

Logos

public\brand\dotcare_light.png (modo dark)

public\brand\dotcare_dark.png (modo light)

Sponsors (light/dark): nerdconf_*, polkadot_* en public\logos\.

🔗 Conexión de Wallet (RainbowKit + wagmi)

Providers: src\app\providers.tsx

Config/Chain: src\lib\wagmi.ts (usa defineChain para Paseo (Polkadot) Testnet — Passet Hub)

Botón: Header.tsx renderiza ConnectButton (RainbowKit)

Notas

RainbowKitProvider usa initialChain={paseo}.

wagmiConfig se crea con getDefaultConfig y transport HTTP del RPC de Paseo.

El botón muestra estado compacto (chainStatus="icon", accountStatus="address").

📚 Secciones implementadas

Header (logo auto-swap light/dark, nav anclas, ConnectButton)

Hero (título, subtítulo, CTAs → /subscribe)

Sponsors (2 logos, variantes light/dark, centrados)

ProblemSection (3 cards con emojis)

OpportunitySection (3 cards con emojis + CTA → /subscribe)

BenefitsSection (lista 10 ítems con emojis, id="beneficios")

Testimonials (3 cards con emojis)

Pricing (toggle Mensual/Anual + 10 features con emojis, id="planes")

Team (3 cards con emojis, id="equipo")

Footer (logo auto-swap + derechos)

A11y review (skip link, foco visible, reduced motion, landmarks)

---

# DOTCARE — Hito 2: Plataforma de Pago (Off-chain)

Checkout de suscripción con UI a dos columnas, Supabase (anon), endpoints Next.js y modo claro/oscuro unificado. **Sin blockchain aún**: el botón “Transferencia realizada” marca la sesión como `ready_for_chain` (off-chain) y redirige a `/subscribe/success?sessionId=...`.

---

## Requisitos

- Node 18+  
- NPM  
- Cuenta en **Supabase**  
- Next.js 15 (App Router)  
- Tailwind (`darkMode: "class"`)

---

## Instalación (Windows CMD)

```cmd
npm i
REM variables locales
copy .env.example .env.local
REM dev server
npm run dev
Variables de entorno
Edita .env.local:

env
Copiar código
# Supabase (públicas para este Hito)
SUPABASE_URL=...      # Settings → API → Project URL
SUPABASE_ANON_KEY=... # Settings → API → anon public

# Paseo / Tesorería (front)
NEXT_PUBLIC_TREASURY_ADDRESS=0x90B3EA700173274560182CbF76ED8E6E66Ad2494
NEXT_PUBLIC_PASEO_NAME=Paseo PassetHub
NEXT_PUBLIC_PASEO_RPC=https://testnet-passet-hub-eth-rpc.polkadot.io
NEXT_PUBLIC_PASEO_CHAIN_ID=420420422
NEXT_PUBLIC_PASEO_SYMBOL=PAS
Base de datos (Supabase)
Crea proyecto y copia SUPABASE_URL y SUPABASE_ANON_KEY.

En SQL Editor pega db\h2_schema.sql y ejecuta.

(Opcional) Inserta cupón de prueba:

sql
Copiar código
insert into public.coupons (code, type, discount_bps, max_uses, used, active, expires_at)
values ('NERDCONF-2025','percent',2000,100,0,true, now() + interval '90 days');
Tablas (off-chain):

users

coupons

checkout_sessions

webhooks

Estados checkout_sessions.status:
created → review (opcional) → code_applied → confirmed_offchain → ready_for_chain → (H3) onchain_success → (H3) active.

RLS: políticas de desarrollo permisivas ya incluidas en el SQL. Endurecer en producción.

Estructura de archivos (H2)
csharp
Copiar código
src\
  app\
    subscribe\
      page.tsx
      success\
        page.tsx
    api\
      checkout\
        session\route.ts           # POST
        apply-code\route.ts        # POST
        [id]\route.ts              # GET
        confirm-offchain\route.ts  # POST
  components\
    ThemeProvider.tsx
    ThemeFab.tsx                   # FAB global ☀︎/☾
    subscribe\
      LeftPanel.tsx
      RightPanel.tsx
      ProductBox.tsx
      PlanSelector.tsx
      CouponField.tsx
      OrderSummary.tsx
      OrderDetailsModal.tsx
      WalletSection.tsx
      NetworkHelp.tsx
      TermsCheck.tsx
      ConfirmTransferButton.tsx
      LogoMini.tsx
  lib\
    pricing.ts
    validators.ts
    supabase.ts
  styles\
    checkout.css
public\
  pay\treasury-qr.png
  brand\dotcare_light.png
  brand\dotcare_dark.png
db\
  h2_schema.sql
UI / Flujo
Ruta principal: /subscribe (maquetado 2 columnas)

Izquierda (orden):

Logo mini (cambia según tema).

Caja de producto (copy exacto).

Selector de plan: $20 / mensual | $144 / anual (nota: “Suscripción anual — Ahorra 5 meses”).

Cupón (valida formato local: A-Z 0-9 -, 3–24).

Resumen: Total due today + link “Ver detalles de la orden” (modal con desglose).

Próximo pago (30 días mensual / 365 días anual).

Derecha:

Conectar Wallet (placeholder).

Wallet destino (de .env), QR (public\pay\treasury-qr.png).

Datos PASEO (texto + link a ChainList).

Checklist de términos.

Botón principal “Transferencia realizada” (marca sesión ready_for_chain y redirige a /subscribe/success?sessionId=...).

Tema light/dark

FAB global (☀︎/☾) en todas las páginas.

ThemeProvider con next-themes (attribute="class", defaultTheme="dark").

Tokens en tokens.css: :root oscuro, .light claro.

Endpoints
POST /api/checkout/session
Crea una sesión.

Body

json
Copiar código
{ "plan": "monthly" | "yearly" }
Res (201)

json
Copiar código
{ "sessionId": "UUID" }
POST /api/checkout/apply-code
Aplica cupón a la sesión.

Body

json
Copiar código
{ "sessionId": "UUID", "code": "NERDCONF-2025" }
Res (200)

json
Copiar código
{
  "sessionId":"...","base_price_cents":2000,
  "discount_bps":2000,"final_price_cents":1600,
  "final_price_label":"$16.00","status":"code_applied"
}
GET /api/checkout/:id
Devuelve estado/valores de la sesión.

Res (200)

json
Copiar código
{
  "id":"...","plan":"monthly",
  "base_price_cents":2000,"discount_bps":2000,
  "final_price_cents":1600,"code":"NERDCONF-2025",
  "status":"code_applied","paid_offchain":false,
  "created_at":"...","expires_at":null
}
POST /api/checkout/confirm-offchain
Marca paid_offchain=true y status=ready_for_chain.

Body

json
Copiar código
{ "sessionId": "UUID" }
Res (200)

json
Copiar código
{ "sessionId":"...", "status":"ready_for_chain", "paid_offchain":true }