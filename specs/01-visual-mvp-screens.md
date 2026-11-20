# SPEC 01 — MVP visual: todas las pantallas de Arcade Vault

> **Status:** Implemented.
> **Depends on:** Ninguna (los estilos ya viven en `app/globals.css`)
> **Date:** 2026-11-18
> **Objective:** Portar a Next.js (App Router, TypeScript, UI en inglés) las 5 pantallas de `references/templates/` — Library, Game Detail, Player, Auth y Hall of Fame — más el Nav y el footer, solo como maqueta visual y sin ningún juego real.

---

## Por qué existe este spec

`references/templates/` es un prototipo SPA (React por CDN + Babel, navegación por estado y hash). El proyecto real es Next.js 16 con `cacheComponents` y `partialPrefetching`. Este spec traduce el prototipo a rutas reales y componentes TypeScript sin rediseñar nada: el CSS ya fue copiado a `app/globals.css`, y el objetivo es fidelidad visual.

---

## Scope

**In:**

- Rutas App Router: `/` (Library), `/games/[id]` (Game Detail), `/games/[id]/play` (Player), `/auth`, `/hall-of-fame`.
- Nav (con menú móvil/hamburguesa) y footer compartidos en `app/layout.tsx`.
- Datos mock de los 8 juegos y generador determinista de rankings (`seededScores`), portados a TypeScript.
- Toda la UI, textos, metadata y datos mock traducidos a inglés.
- Sesión falsa: login/registro aceptan cualquier valor, guardan `{ name }` en `localStorage` bajo `av_user`, accesible vía React Context (`UserProvider` + `useUser`).
- Player como maqueta: HUD, marco CRT, puntuación simulada con `setInterval`, pausa, botón FIN y modal de Game Over, tal cual el template.
- Filtros de la Library (búsqueda por nombre + chips de categoría) funcionales en cliente.
- Formato `en-US` para números (`28,450`) y fechas (`MM/DD/2026`) mediante helpers centralizados.
- Estado "game not found" (`notFound()`) para ids inexistentes.

**Out of scope (para futuros specs):**

- Cualquier juego jugable (lógica, canvas, input de teclado/táctil).
- Autenticación real, backend, base de datos, OAuth (los botones Google/GitHub son decorativos).
- Persistencia real de puntuaciones: el botón "SAVE SCORE" solo muestra el toast, no escribe `av_scores` ni nada.
- Rankings reales; se usan los generados por `seededScores`.
- Contador de créditos funcional (se queda fijo en `CREDITS · 03`).
- Internacionalización / selector de idioma.
- Tests automatizados (unitarios o visuales).
- Rediseño o cambios de estilo respecto al template.

---

## Data model

Archivo `lib/games.ts` (datos y tipos) y `lib/scores.ts` (generador), portados de `data.jsx` con textos en inglés:

```ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type AccentColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;          // slug de URL, p. ej. "block-buster"
  title: string;       // en mayúsculas
  short: string;       // descripción de la tarjeta
  long: string;        // descripción del detalle
  cat: Category;
  cover: string;       // clase CSS existente: "cover-bricks", "cover-tetro", ...
  color: AccentColor;  // color del botón PLAY
  best: number;
  plays: string;       // ya formateado: "12.4K"
};

export type ScoreRow = { rank: number; name: string; score: number; date: string };

export type User = { name: string }; // localStorage["av_user"], null = invitado
```

Convenciones:

- `GAMES: Game[]` (8 juegos, mismas clases `cover-*` y colores que el template) y `CATS = ["ALL", ...categorías]` en `lib/games.ts`.
- `seededScores(seed: number, count?: number): ScoreRow[]` en `lib/scores.ts`; misma fórmula LCG del template, así server y client generan lo mismo (sin `Math.random`).
- Los ids se traducen al inglés (`bloque-buster` → `block-buster`, `caida` → `drop`, `serpentina` → `serpent`, `gloton` → `muncher`, `invasores` → `invaders`, `rocas` → `rocks`, `ranaria` → `froggy`, `duelo-pixel` → `pixel-duel`). Los seeds de `seededScores` se calculan con el nuevo `id.length`, por lo que los rankings pueden variar respecto al template; es aceptable.
- Helpers `formatScore(n)` (`toLocaleString("en-US")`) y `formatDate` en `lib/format.ts`.
- Archivos nuevos de UI en `components/` (`nav.tsx`, `footer.tsx`, `user-provider.tsx`, `game-card.tsx`, `library.tsx`, `leaderboard.tsx`, `hall-of-fame.tsx`, `auth-form.tsx`, `game-player.tsx`). Los Server Components son el default; `"use client"` solo donde hay estado o efectos.

---

## Implementation plan

Antes de empezar: leer en `node_modules/next/dist/docs/` las guías de `cacheComponents`, `partialPrefetching`, rutas dinámicas (`generateStaticParams`, `params` asíncrono) y `notFound`, según exige `CLAUDE.md` / `AGENTS.md`. Para el diseño de UI usar `/frontend-design` (CLAUDE.md).

1. **Datos y helpers.** Crear `lib/games.ts`, `lib/scores.ts`, `lib/format.ts` con los datos en inglés. Verificación: `npx tsc --noEmit` pasa.
2. **Sesión.** Crear `components/user-provider.tsx` (Context + `useUser`; lee `av_user` en `useEffect` tras montar para evitar hydration mismatch; expone `user`, `login`, `logout`). Verificación: se monta en el layout sin errores.
3. **Layout compartido.** Crear `components/nav.tsx` (logo, links con estado activo según `usePathname`, contador de créditos, botón de sesión, hamburguesa + panel móvil) y `components/footer.tsx`; montarlos en `app/layout.tsx` junto al `UserProvider`. Verificación: el Nav se ve en `/` y el menú móvil abre/cierra.
4. **Library (`/`).** Crear `components/game-card.tsx` (tilt 3D) y `components/library.tsx` (hero, buscador, chips, grid, estado "NO RESULTS") y usarlos en `app/page.tsx`. Cada tarjeta enlaza a `/games/[id]`. Verificación: filtros por texto y categoría funcionan.
5. **Game Detail (`/games/[id]`).** Crear `app/games/[id]/page.tsx` con `generateStaticParams`, `notFound()` y `components/leaderboard.tsx`. Botones a `/games/[id]/play` y `/`. Verificación: las 8 URLs renderizan y un id inexistente muestra 404.
6. **Player (`/games/[id]/play`).** Crear `app/games/[id]/play/page.tsx` y `components/game-player.tsx` (HUD, CRT, pausa, FIN, modal Game Over con nombre y toast "SCORE SAVED", reiniciar). Verificación: la puntuación sube, pausa la detiene, FIN abre el modal.
7. **Auth (`/auth`).** Crear `app/auth/page.tsx` y `components/auth-form.tsx` (pestañas sign in / create account, guest, botones sociales decorativos). Al enviar: `login({ name })` y `router.push("/")`. Verificación: tras entrar, el Nav muestra el nombre.
8. **Hall of Fame (`/hall-of-fame`).** Crear `app/hall-of-fame/page.tsx` y `components/hall-of-fame.tsx` (pestañas por juego, podio, tabla animada, fila "YOUR BEST" solo con sesión). Verificación: cambiar de pestaña cambia el ranking.
9. **Metadata y limpieza.** Títulos por ruta con `generateMetadata`, quitar assets sin uso de `public/` (SVG por defecto de create-next-app) y confirmar que ninguna ruta usa el template original. Verificación: `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.

---

## Acceptance criteria

**General**

- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [ ] Ninguna página muestra errores ni warnings de hydration en la consola del navegador.
- [ ] Todo texto visible, `<title>` y datos mock están en inglés; no queda texto en español.
- [ ] No se modifica el CSS visual de `app/globals.css` (solo se permiten añadidos que el port requiera).
- [ ] No existe lógica de juego real: ningún canvas, ni input de teclado/táctil de juego.

**Nav y layout**

- [ ] Nav y footer aparecen en las 5 rutas.
- [ ] El link activo (Library / Hall of Fame) se resalta; en `/games/[id]` y `/games/[id]/play` queda activo Library.
- [ ] En ancho móvil aparece la hamburguesa, abre el panel con backdrop y se cierra al pulsar el backdrop o un link.
- [ ] Sin sesión el botón dice "Sign In" y lleva a `/auth`; con sesión muestra `{NAME} ▾` y al pulsarlo cierra sesión.

**Library `/`**

- [ ] Se muestran 8 tarjetas con su cover, categoría, título, descripción y mejor puntuación formateada (`28,450`).
- [ ] Escribir en el buscador filtra por título; un chip de categoría filtra por categoría; ambos se combinan.
- [ ] Sin coincidencias aparece el mensaje "NO RESULTS".
- [ ] Pulsar una tarjeta o su botón PLAY navega a `/games/[id]`.

**Game Detail**

- [ ] `/games/<id>` renderiza cover, tags, título, descripción larga, strip de estadísticas y leaderboard de 10 filas con top 1–3 diferenciados.
- [ ] "PLAY NOW" navega a `/games/<id>/play`; "BACK TO THE VAULT" a `/`.
- [ ] `/games/inexistente` y `/games/inexistente/play` devuelven 404.

**Player**

- [ ] La puntuación aumenta automáticamente; PAUSE la detiene y muestra el overlay "PAUSED"; RESUME la reanuda.
- [ ] END abre el modal "GAME OVER" con la puntuación final; el campo de nombre limita a 10 caracteres en mayúsculas.
- [ ] "SAVE SCORE" muestra el toast "SCORE SAVED" y no escribe nada en `localStorage`.
- [ ] "PLAY AGAIN" reinicia puntuación, vidas y nivel; "EXIT" vuelve al detalle del juego.

**Auth**

- [ ] Las pestañas alternan entre sign in y create account; solo esta última muestra el campo de email.
- [ ] Enviar el formulario con cualquier valor (incluso vacío) guarda `av_user` en `localStorage`, navega a `/` y el Nav muestra el nombre en mayúsculas (máx. 10 caracteres, `PLAYER1` si estaba vacío).
- [ ] "PLAY AS GUEST" navega a `/` sin sesión.
- [ ] Recargar la página con sesión iniciada mantiene el nombre en el Nav.

**Hall of Fame**

- [ ] Hay una pestaña por cada uno de los 8 juegos; cambiarla actualiza podio y tabla (12 filas).
- [ ] El podio muestra 02 / 01 / 03 con estilos silver / gold / bronze.
- [ ] La fila "YOUR BEST" solo aparece con sesión iniciada.
- [ ] "BACK TO LIBRARY" navega a `/`.

---

## Decisions

- **Yes:** UI, metadata, datos mock y ids en inglés. `CLAUDE.md` lo exige y `layout.tsx` ya declara `lang="en"`.
- **No:** mantener español como los templates. Contradice `CLAUDE.md`.
- **Yes:** rutas reales del App Router. URLs compartibles, botón atrás nativo y prefetch.
- **No:** SPA por hash del template. Desaprovecha Next.js.
- **Yes:** Player con la simulación del template. Mantiene el valor de maqueta visual (HUD, pausa, modal) sin implementar un juego.
- **No:** Player estático con "COMING SOON". Se pierden estados visuales que hay que construir igualmente.
- **Yes:** sesión falsa en `localStorage` (`av_user`) vía Context. Nav, Hall of Fame y Player la necesitan y la lectura post-mount evita hydration mismatch.
- **No:** persistir `av_scores`. Nada lo lee todavía; irá con un spec de puntuaciones reales.
- **Yes:** `components/` y `lib/` en la raíz con TypeScript (alias `@/*` = raíz). Server Components por defecto.
- **No:** carpetas `_components` dentro de `app/`. Nav, GameCard y Leaderboard se comparten entre rutas.
- **Yes:** formato `en-US` en helpers centralizados. Coherente con UI en inglés.
- **Yes:** verificación por checklist manual más lint/tsc/build. El proyecto no tiene tests.
- **No:** Playwright. Añade tooling y dependencias; su propio spec si se quiere.
- **Yes:** `seededScores` determinista, sin `Math.random`, para que server y client coincidan.

---

## Risks

| Riesgo | Mitigación |
| --- | --- |
| `cacheComponents` / `partialPrefetching` cambian el renderizado y pueden romper rutas dinámicas o el acceso a `params`. | Leer las guías en `node_modules/next/dist/docs/` antes de crear rutas; los datos son estáticos, así que usar `generateStaticParams`. |
| Hydration mismatch al leer `localStorage` en el Nav. | `UserProvider` lee `av_user` en `useEffect` tras montar; el primer render es siempre "sin sesión". |
| Fechas o números distintos entre servidor y cliente. | Helpers con locale fijo `en-US` y generador de rankings determinista. |
| `app/globals.css` no incluye Preflight (decisión previa). | No añadir Tailwind preflight; usar las clases del tema (`av-*`) existentes. |
| `setInterval` del Player sigue corriendo al salir de la pantalla. | Limpiar el intervalo en el cleanup del `useEffect`; comprobar que no hay warnings al navegar. |

---

## What is **not** in this spec

- Ningún juego jugable (ni siquiera uno).
- Backend, base de datos, autenticación real u OAuth.
- Guardado real de puntuaciones o rankings reales.
- Créditos funcionales.
- Internacionalización.
- Tests automatizados.
- Cambios de diseño sobre los templates.

Cada uno de estos puntos, si se aborda, va en su propio spec.
