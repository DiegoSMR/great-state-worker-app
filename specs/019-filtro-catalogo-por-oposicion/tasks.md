# Tasks: Filtro del catálogo de temas por oposición

Fase: 3 — Tasks (completa). Fase 4 — Implementación (completa, en la rama `019-filtro-catalogo-por-oposicion`). Fase 5 — Verificación (completa, ver sección al final). Pendiente de revisión final de Diego y de su confirmación explícita para abrir el Pull Request hacia `development`.
Última actualización: 2026-09-15

Generadas a partir de "Componentes afectados" de `design.md` (aprobado). Un commit por Requisito completado, según `CONSTITUTION.md`. Rama `019-filtro-catalogo-por-oposicion`, creada desde `development` al empezar la Fase 4.

## Requisito 1 — Filtrar el catálogo por oposición

- [x] T1.1 `components/estudio/FiltroOposicion.tsx` (nuevo, `"use client"`): `<select>` con opción "Todas" + una por cada oposición en alcance (`o.nombre`); lee el valor actual vía `useSearchParams`; al cambiar, navega con `router.push` actualizando o quitando el query param `oposicion`.
  - Satisface: Requisito 1 (1, 2, 3)
- [x] T1.2 `app/estudio/tema/page.tsx`: convertir a función `async` que recibe `searchParams: Promise<{ oposicion?: string }>`; valida el valor contra `OPOSICIONES_EN_ALCANCE_V1` (id inválido o ausente → se trata como "todas"); filtra `getConceptosEnAlcance()` a los conceptos donde `getOposicionesDeConcepto(concepto.id)` incluye esa oposición; el contador "N conceptos" refleja la lista ya filtrada; renderiza `<FiltroOposicion>` pasándole la oposición seleccionada actual.
  - Satisface: Requisito 1 (1, 2, 3, 4)

## Verificación (Fase 5)

- [x] V1 `npm run lint` y `npm run build` limpios.
- [x] V2 Recorrido en navegador (dev server, Playwright headless, puerto 3032): `/estudio/tema` sin filtro, con cada una de las 4 oposiciones, vuelta a "todas"; comprobar que el botón "atrás" tras entrar en un tema conserva el filtro aplicado; claro/oscuro/papel; ancho tablet.
- [x] V3 Repaso criterio a criterio del Requisito 1 de `requirements.md` con evidencia concreta.

## Verificación

Repaso criterio a criterio de `requirements.md`, con evidencia concreta. `npm run lint` y `npm run build` limpios tras el commit del Requisito. Recorrido con Playwright headless (dev server, puerto 3032): navegación por los 5 valores del selector (Todas + 4 oposiciones), vuelta a "Todas", filtro + entrada en concepto + botón "atrás", id de oposición manipulado en la URL, y capturas en claro/oscuro/papel + ancho tablet (834px) — sin errores de consola atribuibles a este cambio (ver nota al final).

### Requisito 1 — Filtrar el catálogo por oposición

1. **Selector con las oposiciones en alcance + "todas".** `components/estudio/FiltroOposicion.tsx` renderiza `<option value="">Todas</option>` seguido de una `<option>` por cada oposición de `getOposicionesEnAlcance()` (mostrando `o.nombre`); confirmado en el recorrido: `OPCIONES: ["Todas","Auxiliar Administrativo","Auxiliar Administrativo","Escala Auxiliar Administrativa","Cuerpo General Auxiliar"]` y `VALUES: ["","ayto-zgz-aux-adm","dpz-aux-adm","dga-aux-adm","age-aux-general"]` — los 4 ids de `OPOSICIONES_EN_ALCANCE_V1`, sin ninguno de fuera de alcance (SALUD/informática).
2. **Filtrado por oposición concreta + contador actualizado.** `app/estudio/tema/page.tsx` filtra `getConceptosEnAlcance()` con `getOposicionesDeConcepto(concepto.id).some(r => r.oposicion.id === oposicionSeleccionada)` (mismo criterio de relación que usa el resto de `lib/temario.ts`). Verificado con las 4 oposiciones desde el catálogo completo (40 conceptos): `ayto-zgz-aux-adm` → 18, `dpz-aux-adm` → 18, `dga-aux-adm` → 22, `age-aux-general` → 24 — cada contador coincide con el nº de `<li>` renderizados en cada captura.
3. **"Todas" (o sin selección) muestra el catálogo completo.** Sin `?oposicion` en la URL, `oposicionSeleccionada` queda `undefined` y `conceptos = todosLosConceptos` (`app/estudio/tema/page.tsx`, línea ~27-31) — confirmado: `SIN FILTRO: 40 conceptos...` al abrir `/estudio/tema` sin query, y de nuevo `40 conceptos` tras seleccionar "Todas" desde un filtro activo (`VUELTA A TODAS: url=http://localhost:3032/estudio/tema contador="40 conceptos..."`, sin `?oposicion` en la URL resultante). Un id inválido/manipulado (`?oposicion=no-existe`) recibe el mismo tratamiento por diseño defensivo: `ID INVALIDO: contador="40 conceptos..." selectValue=""` — no hay pantalla rota ni `find` que falle.
4. **El filtro se conserva al entrar en un tema y volver atrás.** Al no vivir en estado de cliente sino en `searchParams` de la URL (`design.md`, decisión 1), el historial del navegador lo restaura solo. Verificado: filtro `ayto-zgz-aux-adm` aplicado (`FILTRO ANTES: .../estudio/tema?oposicion=ayto-zgz-aux-adm`) → clic en "La Constitución Española de 1978" (`ENTRO EN CONCEPTO: .../estudio/tema/constitucion-espanola`) → `goBack()` → `TRAS ATRAS: .../estudio/tema?oposicion=ayto-zgz-aux-adm` — `FILTRO CONSERVADO: true`.

### Temas visuales y ancho tablet

Capturado con un filtro aplicado (`ayto-zgz-aux-adm`, 18 conceptos) en claro, oscuro, papel (cookie `gsw_prefs` explícita en cada caso — ver nota debajo) y ancho tablet (834px, nav en densidad de iconos): el `<select>` usa los tokens `border-borde`/`bg-bg-primario`/`text-texto-primario` ya existentes, sin color propio, y se ve correctamente en los 4 casos — ningún desbordamiento ni recorte del selector o su etiqueta en tablet.

### Decisiones tomadas durante la implementación (no reabren `design.md`)

- `FiltroOposicion` recibe `seleccionActual` como prop (ya validado por el Server Component) en vez de leerlo él mismo vía `useSearchParams`, aunque T1.1 lo describía con `useSearchParams`. `design.md` ("Componentes afectados") ya especificaba el paso por prop, y así el valor que ve el `<select>` es siempre el ya defendido contra ids inválidos/manipulados en un único sitio (`page.tsx`) en vez de duplicar esa validación en el cliente. No cambia ningún criterio de aceptación — el comportamiento observable (selector, navegación, filtro) es idéntico.
- Verificación en navegador hecha con Playwright headless invocado vía `npx` (no hay dependencia de test instalada en el repo ni `chromium-cli` disponible en este entorno) — mismo patrón que la spec 018, sin añadir Playwright como dependencia del proyecto.
- Durante la comprobación en navegador apareció un error de consola `Falta DATABASE_URL — ver .env.example` al entrar en una página de concepto — proviene de `isBookmarked` (spec de marcadores, no de esta) y de que este worktree no tiene `.env` configurado; no es un error introducido por este cambio ni bloquea ninguno de los criterios del Requisito 1 (confirmado: el filtro y el contador funcionan correctamente en todos los pasos, incluido el que entra en un concepto).
