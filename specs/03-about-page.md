# SPEC 03 — Vista About (con formulario de contacto visual) en `/about`

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-11-20
> **Objective:** Portar la vista About de `references/home-about/about.jsx` a Next.js como nueva ruta `/about` (en inglés), con su formulario de contacto solo visual y un link "About" en el Nav.

---

## Por qué existe este spec

El SPEC 02 dejó fuera la vista "About" y su link en el Nav. El template `references/home-about/` ya la define (hero de misión, 3 highlights, divisor pixelado y formulario de contacto con éxito tipo terminal). Aún no existe servicio de email, así que el formulario se limita a validar y simular el éxito en cliente. Los estilos de About viven en `references/home-about/styles.css` (bloque `/* ===== ABOUT PAGE ===== */`) y todavía no están en `app/globals.css`.

---

## Scope

**In:**

- Nueva ruta `/about` (`app/about/page.tsx`) con metadata `About · Arcade Vault`.
- Hero con kicker, título, texto de misión y 3 highlights con icono (HEART magenta, BROWSER cyan, PLANT green).
- Divisor pixelado con 24 píxeles animados y sección de contacto, ambos con animación `reveal`.
- Formulario de contacto: campos name, email y message; los tres obligatorios (con `trim`); si falta alguno, animación `shake` y no se envía.
- Estado de éxito tipo terminal "VAULT-OS // TERMINAL" con el nombre del usuario en mayúsculas y botón "SEND ANOTHER MESSAGE" que resetea el formulario.
- Nav: nuevo link "About" en último lugar (Home, Library, Hall of Fame, About), en desktop y panel móvil, activo con `pathname.startsWith("/about")`.
- Portar a `app/globals.css` el bloque `/* ===== ABOUT PAGE ===== */` del template, sin duplicar reglas ya existentes (`.field`, `.btn`, `.reveal`, `blink`, `pulse-led`).
- Toda la UI del About traducida a inglés.

**Out of scope (para futuros specs):**

- Servicio de envío de emails, Server Action, API route o cualquier `fetch`: el envío es una simulación en cliente y los datos se descartan.
- Validación avanzada o mensajes de error por campo (solo `type="email"` del navegador y el `shake` del template).
- Link "About" en el footer.
- Persistencia del mensaje o del borrador (`localStorage`, base de datos).
- Cambios en las demás vistas más allá del link del Nav.
- Captcha, rate limiting, i18n, tests automatizados.
- Rediseño respecto al template (gamepad y themes del template no se tocan).

---

## Data model

Esta feature no introduce estructuras de datos compartidas ni archivos en `lib/`. Solo un tipo local en el componente cliente del formulario:

```ts
type ContactForm = { name: string; email: string; msg: string };
```

Convenciones:

- Estado del formulario: `form: ContactForm`, `sent: string | null` (nombre enviado; `null` = formulario visible) y `shake: boolean` (400 ms), igual que el template.
- Highlights, tips del contacto y líneas de la terminal son contenido de presentación y viven como constantes locales; no se exportan.
- Textos en inglés (traducción del template): kicker `▸ ABOUT`, título `ABOUT ARCADE VAULT`, `▸ CONTACT`, `CONTACT US`, labels `NAME` / `EMAIL` / `MESSAGE`, botón `▶  SEND MESSAGE`, tips `REPLY WITHIN 24-48H` / `SUGGESTIONS WELCOME` / `NO SPAM, EVER`, éxito `> MESSAGE RECEIVED. WE'LL GET BACK TO YOU SOON. THANKS, {NAME}.`

---

## Implementation plan

Antes de empezar: leer en `node_modules/next/dist/docs/` las guías de `cacheComponents` y `partialPrefetching` relevantes a páginas estáticas y Client Components, según `CLAUDE.md` / `AGENTS.md`. Para el diseño de UI usar `/frontend-design` (CLAUDE.md).

1. **Estilos.** Copiar a `app/globals.css` el bloque ABOUT PAGE del template (`.about*`, `.highlight*`, `.about-divider`, `.div-*`, `pxblink`, `.about-contact`, `.contact-*`, `.contact-form.shake`, `shake`, `.btn.press:active`, `.terminal-success`, `.term-*`), sin duplicar reglas existentes. Verificación: `npm run build` pasa y las demás vistas no cambian visualmente.
2. **Iconos.** Crear `components/highlight-icon.tsx` con los SVG HEART, BROWSER y PLANT del template (Server Component, prop `kind`). Verificación: `npx tsc --noEmit` pasa.
3. **Formulario.** Crear `components/contact-form.tsx` (`"use client"`) con estado, validación `trim`, `shake`, éxito tipo terminal y reset; el submit no hace ninguna llamada de red. Verificación: compila sin errores.
4. **Página About.** Crear `components/about.tsx` (Server Component) con hero, highlights, divisor y sección de contacto con `<ContactForm />`; montar `<Reveal />` (de SPEC 02). Crear `app/about/page.tsx` que lo renderiza dentro de `<main className="av-main">` con metadata `About · Arcade Vault`. Verificación: `/about` muestra la vista completa.
5. **Nav.** En `components/nav.tsx` añadir "About" (`/about`) al final de los links, en desktop y panel móvil, con estado activo según `pathname`. Verificación: el link aparece, navega y se resalta; los demás links no cambian.

---

## Acceptance criteria

**General**

- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [ ] `/about` no muestra errores ni warnings de hydration en la consola.
- [ ] Todo texto visible de `/about` está en inglés; no queda español.
- [ ] `/`, `/games`, `/games/[id]`, `/games/[id]/play`, `/auth` y `/hall-of-fame` se ven igual que antes, salvo el nuevo link del Nav.
- [ ] No existe ningún `fetch`, Server Action ni API route nueva.

**Nav**

- [ ] El Nav (desktop y panel móvil) muestra "Home", "Library", "Hall of Fame" y "About", en ese orden.
- [ ] En `/about` queda activo "About" y ningún otro link; en las demás rutas "About" no está activo.
- [ ] Pulsar "About" navega a `/about`.

**Vista About**

- [ ] El hero muestra el kicker `▸ ABOUT`, el título `ABOUT ARCADE VAULT` y el texto de misión.
- [ ] Se muestran 3 highlights con su icono y color (magenta, cyan, green).
- [ ] Se muestra el divisor con 24 píxeles animados y las secciones con `.reveal` reciben la clase `in` al entrar en el viewport.
- [ ] La sección de contacto muestra el título `CONTACT US`, el texto introductorio y los 3 tips con sus LEDs (green, yellow, magenta).
- [ ] En ancho móvil (≤ 480 px) no hay scroll horizontal en `/about`; los highlights y la rejilla de contacto pasan a una columna.

**Formulario**

- [ ] El formulario muestra los campos `NAME`, `EMAIL` y `MESSAGE` con sus placeholders y el botón `▶  SEND MESSAGE` a ancho completo.
- [ ] Enviar con cualquier campo vacío o solo con espacios activa el `shake` (≈ 400 ms) y no muestra la terminal de éxito.
- [ ] Enviar con los tres campos rellenos reemplaza el formulario por la terminal "VAULT-OS // TERMINAL" con el nombre en mayúsculas en el mensaje de éxito.
- [ ] "SEND ANOTHER MESSAGE" vuelve al formulario con los tres campos vacíos.
- [ ] Enviar el formulario no genera ninguna petición de red (pestaña Network vacía) ni escribe en `localStorage`.

---

## Decisions

- **Yes:** ruta propia `/about`. Es una vista independiente, con URL compartible y prefetch del Nav.
- **No:** ancla dentro del Home. El template la trata como pantalla separada.
- **Yes:** "About" al final del Nav (Home, Library, Hall of Fame, About). No reordena los links existentes ni cambia lo aprobado en el SPEC 02.
- **No:** orden del template (About antes de Hall of Fame). El orden no es crítico y esto minimiza el diff.
- **Yes:** simular el éxito del envío en cliente. Es lo pedido: solo se necesita el aspecto visual, sin servicio de email.
- **No:** Server Action vacía como punto de enganche. Añadiría un archivo de servidor sin función real; se creará cuando exista el servicio.
- **Yes:** traducir todo al inglés. `CLAUDE.md` lo exige y es el mismo criterio que SPEC 01 y SPEC 02.
- **Yes:** validación como el template (campos obligatorios con `trim` + `shake`). Fidelidad visual, sin estilos nuevos.
- **No:** mensajes de error por campo. Se aleja del template y requiere CSS nuevo.
- **Yes:** About como Server Component con un único Client Component de estado (`ContactForm`) y el `Reveal` existente. Mantiene casi todo estático.
- **No:** convertir toda la vista en `"use client"`. Solo el formulario tiene estado.
- **Yes:** portar solo el bloque ABOUT PAGE del CSS. Gamepad y themes pertenecen a otras vistas.
- **Yes:** verificación por checklist manual más lint/tsc/build, como en SPEC 01 y 02.

---

## Risks

| Riesgo | Mitigación |
| --- | --- |
| El CSS copiado duplica o pisa reglas existentes (`.field`, `.btn`, `.reveal`, `blink`, `shake`, `.divider`). | Revisar duplicados antes de pegar; comprobar que las otras vistas no cambian. |
| Las secciones `.reveal` quedan invisibles si el `IntersectionObserver` no corre. | Montar `<Reveal />` en la propia página; verificar con scroll real y tras navegación cliente (ir a `/about` desde otra ruta). |
| El `setTimeout` del `shake` sigue activo al salir de la página. | Limpiar el timeout en un cleanup de `useEffect` o evitar actualizar estado desmontado; comprobar que no hay warnings al navegar. |
| `cacheComponents` / `partialPrefetching` afectan a una página que mezcla Server y Client Components. | Leer las guías antes de empezar; `/about` no accede a datos dinámicos. |

---

## What is **not** in this spec

- Envío real de emails (servicio, Server Action o API).
- Validación avanzada, captcha o rate limiting.
- Link "About" en el footer.
- Persistencia del mensaje o del borrador.
- Cambios en otras vistas más allá del link del Nav.
- Internacionalización o tests automatizados.
- Cambios de diseño sobre el template.

Cada uno de estos puntos, si se aborda, va en su propio spec.
