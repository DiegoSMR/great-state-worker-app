# Spec: Progreso de Estudio

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Empieza a registrar qué ha estudiado realmente el usuario — sin introducir todavía algoritmos complejos ni estimación de dominio — distinguiendo explícitamente "ver un concepto" de "haberlo estudiado". Es la base de datos sobre la que se construyen flashcards, repaso inteligente, sesiones, dashboard y planificador.

## Historias de usuario

- Como usuario, quiero que la app registre qué conceptos he abierto, para saber qué me falta sin llevar la cuenta yo mismo.
- Como usuario, quiero retomar el estudio exactamente donde lo dejé.
- Como usuario, quiero ver de un vistazo qué conceptos de un tema/oposición tengo pendientes, vistos, estudiados o que necesito repasar.
- Como usuario, quiero marcar manualmente un concepto como "necesita repaso" cuando siento que no lo domino, aunque el sistema todavía no lo infiera automáticamente.

## Alcance (v1)

- Registro automático de "visto" al abrir un concepto con contenido real.
- Marcado manual de "estudiado" y "necesita repaso" desde la vista del concepto.
- Indicador de estado por concepto en los listados de oposición y de tema (reutiliza `001-seccion-estudio`).
- Acceso "Continuar estudiando" hacia el último concepto abierto.

## Fuera de alcance

- Estimación automática de dominio — requiere datos de flashcards/tests que todavía no existen (ver `006-repaso-inteligente`).
- Repetición espaciada / algoritmo de priorización de repaso — `006-repaso-inteligente`.
- Cronometraje preciso de sesiones — `007-sesiones-estudio`.
- Estadísticas agregadas — `014-estadisticas`.

## Criterios de aceptación

- [ ] Al abrir un concepto con contenido real se registra automáticamente que el usuario lo ha "visto".
- [ ] El usuario puede marcar explícitamente un concepto como "estudiado" o "necesita repaso" sin salir de la vista.
- [ ] Los listados de oposición y de tema muestran el estado de progreso de cada concepto.
- [ ] Existe un acceso "Continuar estudiando" que lleva al último concepto abierto, cuando existe historial.
- [ ] El progreso se guarda por usuario, preparado para multiusuario futuro aunque no haya login todavía (mismo patrón que los bookmarks de `001-seccion-estudio`).

## Preguntas abiertas

- Cómo relacionar el "visto" automático con el "estudiado" manual sin generar ruido — ver `design.md`.
