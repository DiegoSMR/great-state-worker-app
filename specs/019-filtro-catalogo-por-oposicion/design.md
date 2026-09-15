# Design: Filtro del catálogo de temas por oposición

Fase: 2 — Design. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Visión general

`app/estudio/tema/page.tsx` es hoy un Server Component puro que renderiza `getConceptosEnAlcance()` sin parámetros. Como el layout raíz ya lee `cookies()` para las preferencias de interfaz (`ARCHITECTURE.md`, "Decidido: dónde vive la preferencia de interfaz"), **toda la app ya es dinámica** (`ƒ`, sin generación estática) — así que filtrar vía `searchParams` del lado servidor no tiene ningún coste adicional respecto a hoy, y evita introducir estado de cliente para algo que no lo necesita.

## Decisiones clave

### Decisión: filtrar vía `searchParams` de URL (`?oposicion=<id>`), no `useState` de cliente

- **Opción elegida:** `CatalogoTemasPage` pasa a ser `async` y recibe `searchParams: Promise<{ oposicion?: string }>` (mismo patrón `async`/`Promise` que ya usa `app/estudio/tema/[conceptoId]/page.tsx` para `params`). Valida el valor contra `OPOSICIONES_EN_ALCANCE_V1`; si no es válido o no está presente, se trata como "todas". Filtra `getConceptosEnAlcance()` quedándose con los conceptos donde `getOposicionesDeConcepto(concepto.id)` incluye esa oposición.
- **Alternativas consideradas:**
  - `useState` en un Client Component envolviendo la lista completa: descartado porque pierde gratis el Criterio 1.4 (conservar el filtro al volver con el botón "atrás" del navegador) — con `searchParams`, el historial del navegador ya lo resuelve sin código adicional.
  - Persistirlo como preferencia (cookie `gsw_prefs`): descartado explícitamente en `requirements.md` — es un filtro de la visita, no una preferencia de interfaz duradera.
- **Satisface:** Requisito 1 (1, 2, 3, 4)

### Decisión: el `<select>` de filtro es un Client Component mínimo

- **Opción elegida:** nuevo `components/estudio/FiltroOposicion.tsx` ("use client"), recibe `oposiciones: Oposicion[]` y `seleccionActual?: string` como props desde el Server Component. Usa `useRouter`/`usePathname` de `next/navigation` para hacer `router.push` con el query param actualizado al cambiar el `<select>` — sin recarga completa de página, coherente con el resto de la app (Server Components + islas de cliente puntuales, ver `SeccionesConcepto`, `BookmarkButton`).
- **Alternativas consideradas:** `<form method="get">` nativo (cero JS): descartado porque, aunque más simple, fuerza una navegación de documento completo en cada cambio de filtro — con `useRouter` la transición es más fluida sin añadir complejidad real.
- **Satisface:** Requisito 1 (1, 2, 3)

## Componentes afectados

- `app/estudio/tema/page.tsx` — se convierte en función `async`, recibe y valida `searchParams`, filtra la lista antes de renderizarla, pasa la oposición seleccionada al nuevo componente de filtro.
- `components/estudio/FiltroOposicion.tsx` (nuevo) — `<select>` con `<option>` "Todas" + una por oposición en alcance (`o.nombre`), navega actualizando el query param.
- `lib/temario.ts` — sin cambios; se reutiliza `getOposicionesDeConcepto` ya existente.

## Flujo de datos / interacción

1. Diego abre `/estudio/tema` (sin query) → ve el catálogo completo, como hoy.
2. Selecciona una oposición en `FiltroOposicion` → `router.push("/estudio/tema?oposicion=dga-aux-adm")`.
3. El Server Component vuelve a ejecutarse con ese `searchParams`, filtra la lista y actualiza el contador "N conceptos".
4. Diego entra en un tema (`/estudio/tema/[conceptoId]`) y pulsa "atrás" → el navegador restaura `/estudio/tema?oposicion=dga-aux-adm` tal cual estaba, filtro incluido.

## Riesgos y mitigaciones

- **Id de oposición inválido/manipulado en la URL** (p. ej. `?oposicion=no-existe`): se trata igual que "todas" (no hay `find` que falle ni pantalla rota) — mismo criterio defensivo que el resto de `lib/temario.ts`.
- **Accesibilidad del `<select>`:** `<label>` asociada visualmente o vía `aria-label`, mismo tratamiento de foco visible que ya cubren los tokens existentes — no requiere ninguna decisión nueva.
