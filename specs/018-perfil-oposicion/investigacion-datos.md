# Investigación de datos: Perfil de oposición

Investigación factual de `investigador-convocatorias` (2026-09-14) para las 4 oposiciones en alcance, de cara a `design.md` y a la redacción de contenido real por `preparador-opos`. No es contenido publicado en la app — es la base de datos crudos, con fuente y hueco explícito donde no se encontró nada oficial (principio 3 de `CONSTITUTION.md`: nunca inventar, un hueco documentado es un resultado válido).

Fecha de consulta general: 2026-09-14, salvo que se indique otra cosa.

## 1. Ayuntamiento de Zaragoza — Auxiliar Administrativo (`ayto-zgz-aux-adm`)

**Ficha general**
- Denominación oficial: Escala de Administración General, Subescala Auxiliar; Grupo/Subgrupo C2. Fuente: [zaragoza.es/oferta id=1681](https://www.zaragoza.es/oferta/ofertaDetalle.jsp?id=1681).
- Requisitos: título de Graduado en ESO o equivalente. Edad y nacionalidad: no localizadas en la ficha resumen (probablemente en el PDF de bases, no accesible por scraping automático).
- Funciones típicas: no encontradas en fuente oficial accesible.

**Proceso selectivo**
- Oposición (turno libre), dos ejercicios eliminatorios el mismo día: 1º test de 50 preguntas (máx. 55 min); 2º práctico, dos supuestos teórico-prácticos de 10 preguntas cada uno. Fuente: resumen de bases vía zaragoza.es.
- **No confirmado:** sistema de puntuación exacto, si genera bolsa de trabajo (el PDF de bases, 411 KB, no fue accesible por scraping).
- Plazas convocatoria vigente (BOP nº147, 30/06/2025; BOE nº257, 25/10/2025): 43 plazas turno libre ordinario + 4 de ampliación (2 reservadas a discapacidad), total 47. Plazo de inscripción: 26/10/2025–14/11/2025.
- Periodicidad histórica: **no verificada** — una fuente secundaria (no oficial) sugiere que la convocatoria de 2019 también fue de 47 plazas, pero no se confirma con fuente primaria.

**Retribuciones** (fuente oficial: [zaragoza.es/sede/organizacion/retribuciones](https://www.zaragoza.es/sede/portal/organizacion/retribuciones))
- Grupo C2, año 2025: sueldo base 738,50 €/mes; paga extra 731,77 €; total bruto anual 10.325,54 €; complemento de destino nivel 22: 628,31 €/mes (8.796,34 €/año).
- Año 2026: sueldo base 749,58 €/mes; complemento destino nivel 22: 637,73 €/mes (8.928,22 €/año); complemento específico ejemplo estrato 00002: 1.006,64 €/mes.
- **No confirmado:** qué estrato de complemento específico corresponde exactamente al puesto de Auxiliar Administrativo (la tabla oficial tiene varios estratos, solo se verificó un ejemplo). Una fuente de academia (Cierzo Formación) da cifras distintas (nivel 15, estrato 03012, específico 1.081,99 €) — al ser contradictoria y no oficial, no se usa.

**Participación**
- **No encontrado**: aspirantes presentados/admitidos, ni de la convocatoria 2025 ni de anteriores.

## 2. Diputación de Zaragoza — Auxiliar Administrativo (`dpz-aux-adm`)

**Ficha general**
- Denominación: Escala de Administración General, Subescala Auxiliar, Grupo/Subgrupo C2. Fuente: extractos de BOE-A-2026-9821 y BOPZ nº68 (25/03/2026).
- Requisitos: nacionalidad española o de otro Estado UE, capacidad funcional. **Titulación exigida no confirmada** — una síntesis de búsqueda dijo "Bachillerato", lo que contradice el patrón de las otras 3 oposiciones C2 (ESO/Técnico); no se da por bueno sin verificación directa.
- **Bloqueo técnico:** dpz.es dio error de certificado SSL en todas las herramientas de acceso disponibles, y el HTML descargado por curl no contenía el texto (carga dinámica). No se pudieron leer las bases completas. Recomendado reintentar con navegador normal, no herramienta automatizada.

**Proceso selectivo**
- Sistema: "solo oposición, sin méritos" (oposición libre). Plazas: 26 (acumuladas OEP 2023: 7, OEP 2024: 10, OEP 2025: 9). Bases: BOPZ nº68, 25/03/2026. Plazo de inscripción: 26/03/2026–27/04/2026. Tasa: 6,01 €. Primer ejercicio: 26/09/2026.
- **No confirmado:** número y estructura exacta de ejercicios (una síntesis no oficial menciona test de 100 preguntas + práctico, sin verificar), si genera bolsa de trabajo.

**Retribuciones**
- **No encontrada** tabla retributiva propia ni complemento específico del puesto en fuente oficial verificable (mismo bloqueo de acceso a dpz.es).

**Participación**
- **No encontrado**: aspirantes presentados, actual ni histórico.

## 3. Gobierno de Aragón (DGA) — Escala Auxiliar Administrativa (`dga-aux-adm`)

La mejor documentada — acceso directo al texto íntegro del BOA.

**Ficha general** (Fuente: BOA nº247, 23/12/2025, csv BOA20251223012, Resolución de 19/12/2025 del Director General de la Función Pública, [PDF oficial](https://www.boa.aragon.es/cgi-bin/EBOA/BRSCGI?CMD=VEROBJ&MLKOB=1427870670404))
- Denominación oficial: **Cuerpo Auxiliar de la Administración General de la Comunidad Autónoma de Aragón, Escala Auxiliar Administrativa (Auxiliares Administrativos), Subgrupo C2.**
- Titulación: Graduado en Educación Secundaria Obligatoria, título de Técnico o equivalente.
- Edad: 16 años cumplidos, sin exceder la edad máxima de jubilación forzosa.
- Nacionalidad: española, UE, o asimilados según art. 57.1 EBEP.
- Funciones típicas: no detalladas en la convocatoria (remite al temario).

**Proceso selectivo**
- Sistema: oposición + curso de formación selectivo (20h, online), NO concurso-oposición.
- Dos ejercicios eliminatorios tipo test, mismo día:
  - 1º (teórico): 70 preguntas + 5 de reserva, 4 opciones, 1 válida. 2 horas. Mínimo 35/70.
  - 2º (práctico): 30 preguntas + 5 reserva sobre supuesto(s) prácticos. 1 hora. Mínimo 15/30, solo se corrige si se aprobó el 1º.
  - Penalización: −0,3333 por error; no contestadas no penalizan.
- Genera lista de espera de personal interino (art. 9 de la convocatoria) — cumple la función de bolsa aunque no se llame así formalmente.
- Plazas convocatoria 25/0109: 28 (código 250109, 1 reservada a víctimas de violencia de género), acumulando OEP 2023+2024+2025. Tasa: 12,76 €.

**Retribuciones**
- **No encontrada** tabla oficial con cifras exactas de sueldo/complemento destino/específico para C2 en Aragón. Se confirmó la existencia de un Acuerdo de 14/01/2026 del Gobierno de Aragón que actualiza retribuciones de administración general (incremento del 2,5% en 2025 según Decreto-Ley 8/2025, citado por fuentes secundarias), pero no se accedió al documento con cifras exactas.

**Participación**
- **No encontrado**: aspirantes presentados, ni en esta convocatoria (25/0109) ni en anteriores (18/19, 22/23).

## 4. AGE — Cuerpo General Auxiliar (`age-aux-general`)

Fuente: BOE-A-2025-26262, BOE nº306, 22/12/2025, Resolución de 18/12/2025 de la Secretaría de Estado de Función Pública ([texto íntegro](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262)); complementado con [INAP](https://sede.inap.gob.es/es/procedimientos-y-servicios/seleccion/procesos-selectivos-de-cuerpos-y-escalas-generales/cuerpo-general-auxiliar-de-la-administracion-del-estado-ingreso-libre-convocatoria-2025).

**Ficha general**
- Denominación oficial: Cuerpo General Auxiliar de la Administración del Estado, Subgrupo C2, ingreso libre.
- Titulación: Graduado en ESO o equivalente/superior.
- Edad: 16 a 65 años.
- Nacionalidad: española (y UE en igualdad de condiciones).
- **Importante:** oferta de ámbito estatal (1.700 plazas totales, no desglosadas por Aragón).

**Proceso selectivo**
- Oposición pura, ejercicio único con 2 partes obligatorias y eliminatorias, mismo acto, 90 minutos totales:
  - Parte 1: hasta 60 preguntas (30 Bloque I + 30 psicotécnicas), 0–50 puntos, mínimo 25.
  - Parte 2: hasta 50 preguntas Bloque II, 0–50 puntos, mínimo 25.
  - Penalización: −1/3 por error.
- Genera bolsa/listas de interinos tras el proceso (Comisión Permanente de Selección).
- Plazas: 1.700 (1.544 general + 156 discapacidad ≥33%). Plazo: 23/12/2025–22/01/2026. Examen: 23/05/2026 (fecha provisional, cronograma INAP).
- Periodicidad histórica **parcialmente verificada**: OEP 2021 → 550 plazas; OEP 2023 (acumulada 2021+2022) → 1.150 plazas; OEP 2025 (actual) → 1.700 plazas — pero las cifras de OEP 2021/2023 vienen de síntesis de búsqueda, no de lectura directa del BOE correspondiente, así que no se dan como confirmadas al 100%.

**Retribuciones**
- Tabla salarial general C2 según Real Decreto-ley 14/2025 de 2 de diciembre: sueldo base 2026 ≈ 749,58 €/mes según fuente secundaria que cita el documento oficial SEPG. **No confirmado directamente** — fallo de acceso (timeout) al PDF oficial de la Secretaría de Estado de Presupuestos y Gastos ([enlace a confirmar](https://www.sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/CostesPersonal/EstadisticasInformes/Documents/A%C3%91O%202025/Retribuciones%20del%20personal%20funcionario.%20Real%20Decreto-ley%2014%202025,%20de%202%20de%20diciembre.pdf)).
- Complemento de destino/específico del puesto AGE en Aragón: **no encontrado**.

**Participación**
- **No encontrado**: aspirantes presentados (el examen es en mayo 2026, aún sin datos). Para convocatorias anteriores tampoco se encontraron cifras agregadas — el INAP no las centraliza, remite a cada convocatoria individual.

## Resumen de huecos (para que `design.md` decida cómo tratarlos en UI)

| Dato | Zaragoza | DPZ | DGA | AGE |
|---|---|---|---|---|
| Requisitos completos | Parcial (falta edad/nacionalidad) | Parcial (titulación dudosa) | Completo | Completo |
| Funciones del puesto | No encontrado | No encontrado | No encontrado | No encontrado |
| Estructura proceso selectivo | Parcial (falta puntuación) | Parcial (no confirmado) | Completo | Completo |
| Bolsa de trabajo | No confirmado | No confirmado | Sí (lista de espera) | Sí |
| Retribución base C2 | Sí (oficial, 2025/2026) | No encontrado | No encontrado | No confirmado (fallo técnico de acceso) |
| Complemento específico | Parcial (estrato dudoso) | No encontrado | No encontrado | No encontrado |
| Aspirantes presentados | No encontrado | No encontrado | No encontrado | No encontrado (examen aún no celebrado) |

**Funciones del puesto** y **aspirantes presentados** están vacíos en las 4 — no es un fallo de la investigación, es que esos datos casi nunca se publican de forma agregada y accesible para este tipo de proceso. `design.md` debería asumir que esas dos filas estarán "pendiente de confirmar" en las 4 oposiciones desde el primer día, no tratarlo como un caso raro.

## Bloqueo técnico a resolver

dpz.es dio error de certificado SSL con herramientas automatizadas — recomendable que alguien con navegador normal confirme si el sitio es accesible así, antes de asumir que los datos de DPZ están definitivamente fuera de alcance.
