# SPEC 02 — Home (landing) en `/` y Library en `/games`

> **Status:** Draft
> **Depends on:** SPEC 01
> **Date:** 2026-11-20
> **Objective:** Portar la landing `references/home-about/home.jsx` a Next.js como nueva página `/` (en inglés) y mover la Library actual a `/games`, sin implementar ninguna otra vista.

---

## Por qué existe este spec

Hoy `/` es la Library. El template `references/home-about/` añade una landing (hero, features, preview de juegos, stats, actividad, precios, CTA final) que debe ocupar `/`. Eso desplaza la Library a `/games`, y obliga a revisar todos los links y redirects que apuntaban a `/`. El CSS del Home vive en `references/home-about/styles.css` y todavía no está en `app/globals.css`.

---

## Scope

**In:**

- Nueva `/` con las 6 secciones del template: Hero, Why Arcade Vault, Games preview, Stats, Live activity (+ Top players), Pricing (+ FAQ) y Final CTA.
- Library movida a `/games` (`app/games/page.tsx`), con el mismo contenido que tiene hoy `/`.
- Nav: nuevo link "Home" (`/`); "Library" pasa a apuntar a `/games`. Sin link "About".
- Redirects: login, registro, guest y los botones "back" a la Library apuntan a `/games` en lugar de `/`.
- Portar a `app/globals.css` los estilos del Home y los de Activity y Pricing de `references/home-about/styles.css` (bloques `/* ===== HOME PAGE ===== */`, `/* ===== ACTIVITY ... */` y `/* ===== PRICING ===== */`).
- Datos mock de actividad y top jugadores en `lib/home.ts`, con textos en inglés.
- Animación de reveal al hacer scroll (`IntersectionObserver`) en un componente cliente.
- Toda la UI del Home en inglés; números con `formatScore` (`en-US`).

**Out of scope (para futuros specs):**

- Vista "About" y su link en el Nav (los archivos `about.jsx`, `nav.jsx` y el gamepad del template no se tocan).
- Cualquier cambio en las demás vistas más allá de los links/redirects listados.
- Datos de actividad reales o en tiempo real; rankings reales.
- Registro real, pagos o planes de precios funcionales (la tarjeta de precio es solo visual).
- Contador de créditos funcional, i18n, tests automatizados.
- Rediseño respecto al template.

---

## Data model

Archivo nuevo `lib/home.ts` con datos estáticos tipados:

```ts
import type { AccentColor } from "@/lib/games";

export type ActivityRow = {
  player: string;      // "NEONFOX"
  gameId: string;      // id de GAMES: "drop", "muncher", ...
  score: number;       // 184220
  ago: string;         // "2 min ago"
  color: AccentColor;  // clase neon-{color}
};

export type TopPlayer = { rank: number; player: string; score: number };
```

Convenciones:

- `ACTIVITY: ActivityRow[]` (7 filas) y `TOP_PLAYERS: TopPlayer[]` (5 filas) con los mismos jugadores y puntuaciones del template.
- El nombre del juego en la actividad sale de `GAMES` por `gameId` (mapeo: Caída → `drop`, Glotón → `muncher`, Invasores → `invaders`, Rocas → `rocks`, Bloque Buster → `block-buster`, Serpentina → `serpent`, Ranaria → `froggy`).
- Features, stats y FAQ son contenido de presentación y viven como constantes locales en los componentes; no necesitan tipos exportados.
- Reutiliza `Game`, `GAMES` y `formatScore` del SPEC 01; no cambia ningún tipo existente.

---

## Implementation plan

Antes de empezar: leer en `node_modules/next/dist/docs/` las guías de `cacheComponents` y `partialPrefetching` relevantes a páginas estáticas y `Link`, según `CLAUDE.md` / `AGENTS.md`. Para el diseño de UI usar `/frontend-design` (CLAUDE.md).

1. **Mover la Library a `/games`.** Crear `app/games/page.tsx` con el contenido actual de `app/page.tsx` (metadata "Library · Arcade Vault", `<Library />`). `app/page.tsx` queda temporalmente igual. Verificación: `/games` muestra la Library y `npx tsc --noEmit` pasa.
2. **Actualizar Nav y redirects.** En `components/nav.tsx` añadir "Home" (`/`) y apuntar "Library" a `/games`, tanto en desktop como en el panel móvil; "Home" activo solo con `pathname === "/"`, "Library" activo con `pathname` que empiece por `/games`; el logo sigue yendo a `/`. Cambiar `router.push("/")` de `components/auth-form.tsx` (login, registro y guest) y los links "BACK TO THE VAULT" / "BACK TO LIBRARY" (detalle de juego, Hall of Fame) a `/games`. Verificación: ningún link de Library apunta a `/`.
3. **Estilos.** Copiar a `app/globals.css` los bloques HOME PAGE, ACTIVITY y PRICING del template, sin duplicar reglas ya existentes (`.btn`, `.neon-*`, `blink`, `pulse`, `fade-in`). Verificación: `npm run build` pasa y las páginas existentes no cambian visualmente.
4. **Datos.** Crear `lib/home.ts` con `ACTIVITY` y `TOP_PLAYERS`. Verificación: `npx tsc --noEmit` pasa.
5. **Piezas del Home.** Crear `components/home-silhouettes.tsx` (8 siluetas SVG decorativas), `components/feature-icon.tsx` (iconos GAMEPAD/FREE/TROPHY/ROCKET) y `components/reveal.tsx` (client component: `IntersectionObserver` que añade la clase `in` a los `.reveal`, con cleanup). Verificación: compilan sin errores.
6. **Página Home.** Crear `components/home.tsx` (Server Component) con las 6 secciones, usar `Link` en lugar de `navigate` y montar `<Reveal />`. Las mini-cards enlazan a `/games/[id]` (primeros 6 de `GAMES`); "EXPLORE GAMES", "VIEW ALL GAMES" y "INSERT COIN" a `/games`; "CREATE ACCOUNT" y "START FREE" a `/auth`; "VIEW HALL" a `/hall-of-fame`. Reemplazar `app/page.tsx` para renderizar `<Home />` dentro de `<main className="av-main">` con metadata `Arcade Vault`. Verificación: `/` muestra el Home completo.

---

## Acceptance criteria

**General**

- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [ ] Ninguna ruta muestra errores ni warnings de hydration en la consola.
- [ ] Todo texto visible del Home está en inglés; no queda español en `/`.
- [ ] No se crea ninguna ruta distinta de `/games` (no existe `/about`) y no hay link "About" en el Nav.
- [ ] Las rutas `/games/[id]`, `/games/[id]/play`, `/auth` y `/hall-of-fame` se ven igual que antes del cambio.

**Rutas y navegación**

- [ ] `/` renderiza el Home y `/games` renderiza la Library con 8 tarjetas, buscador y chips funcionando.
- [ ] El Nav (desktop y panel móvil) muestra "Home", "Library" y "Hall of Fame", en ese orden.
- [ ] En `/` queda activo "Home"; en `/games`, `/games/[id]` y `/games/[id]/play` queda activo "Library"; en `/hall-of-fame`, "Hall of Fame".
- [ ] Tras login, registro o "PLAY AS GUEST" la URL pasa a ser `/games`.
- [ ] "BACK TO THE VAULT" (detalle) y "BACK TO LIBRARY" (Hall of Fame) navegan a `/games`.

**Home**

- [ ] El hero muestra el eyebrow con cursor parpadeante, las tres líneas del título, el subtítulo, los CTAs "EXPLORE GAMES" (→ `/games`) y "CREATE ACCOUNT" (→ `/auth`), el indicador de scroll y 8 siluetas flotantes.
- [ ] La sección "Why Arcade Vault?" muestra 4 feature cards (cyan, yellow, magenta, green) con su icono.
- [ ] La sección de juegos muestra 6 mini-cards con su cover, título y categoría; pulsar una navega a `/games/<id>`; "VIEW ALL GAMES →" navega a `/games`.
- [ ] La sección de stats muestra 3 bloques.
- [ ] "Live activity" muestra 7 filas con jugador, juego (título tomado de `GAMES`), `+` puntuación formateada (`184,220`) y tiempo relativo en inglés; "Top players · today" muestra 5 filas con top 1–3 diferenciados y "VIEW HALL →" navega a `/hall-of-fame`.
- [ ] Pricing muestra la tarjeta "$0 / FOREVER" con 6 ítems, 3 preguntas de FAQ, y "START FREE →" navega a `/auth`.
- [ ] El CTA final muestra "READY TO PLAY?" y "INSERT COIN →" navega a `/games`.
- [ ] Las secciones con `.reveal` aparecen (clase `in`) al entrar en el viewport al hacer scroll.
- [ ] En ancho móvil (≤ 480 px) no hay scroll horizontal en `/`.

---

## Decisions

- **Yes:** Home en `/` y Library en `/games`. Es lo pedido; `/games/[id]` ya vive bajo `/games`, así que la jerarquía queda coherente.
- **No:** dejar la Library en `/` y poner el Home en otra ruta. Contradice la petición.
- **Yes:** añadir solo "Home" al Nav, sin "About". Decisión del usuario; esa vista queda fuera.
- **Yes:** login, guest y los botones "back" van a `/games`. El usuario llega ahí con intención de jugar.
- **No:** volver al Home tras autenticarse. Añade un paso extra antes de jugar.
- **Yes:** mock estático en `lib/home.ts` con juegos referenciados por id de `GAMES`. Evita nombres de juego desincronizados con el catálogo.
- **No:** derivar la actividad de `seededScores`. Añade lógica y se aleja del template.
- **Yes:** Home como Server Component con un único client component pequeño (`Reveal`) para el `IntersectionObserver`. Mantiene casi todo estático y prerenderizable.
- **No:** convertir todo el Home en `"use client"`. No hay estado que lo justifique.
- **Yes:** portar solo los bloques de CSS del Home, Activity y Pricing. Gamepad, About y temas pertenecen a otras vistas.
- **Yes:** mantener los datos del template tal cual (p. ej. stats "12+ GAMES" aunque hoy haya 8). Es fidelidad visual; el copy se ajusta en un spec de contenido.
- **Yes:** verificación por checklist manual más lint/tsc/build, como en SPEC 01.

---

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Quedan links o redirects a `/` que esperaban la Library. | Buscar todas las referencias a `"/"` en `app/` y `components/` en el paso 2; criterios de aceptación explícitos para login/guest/back. |
| El CSS copiado duplica o pisa reglas existentes (`.btn`, `.neon-*`, `.fade-in`, `.stat-*`). | Revisar duplicados antes de pegar; comprobar que las otras 4 vistas no cambian. |
| Las secciones `.reveal` quedan invisibles si el `IntersectionObserver` no corre. | `Reveal` se monta en la propia página y limpia en el cleanup; verificar con scroll real y tras navegación cliente (volver al Home desde otra ruta). |
| `cacheComponents` / `partialPrefetching` afectan a una página que mezcla Server y Client Components. | Leer las guías antes de empezar; el Home no accede a datos dinámicos. |

---

## What is **not** in this spec

- La vista "About" ni su link en el Nav.
- Cambios en Game Detail, Player, Auth o Hall of Fame más allá de los links/redirects indicados.
- Actividad o rankings reales, backend o autenticación.
- Planes de pago o suscripciones funcionales.
- Internacionalización, créditos funcionales o tests automatizados.
- Cambios de diseño sobre el template.

Cada uno de estos puntos, si se aborda, va en su propio spec.
