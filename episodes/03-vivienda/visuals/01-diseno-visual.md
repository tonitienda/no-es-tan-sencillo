# Diseño visual v0.1: episodio 03, vivienda (primer vídeo de la serie)

**Fecha:** 10 de noviembre de 2026. **Base:** [inventario v0.1](00-inventory.md) y [guion v2](../script/04-guion-v2.md). **Estado:** propuesta para revisión. No es *look development* aprobado: falta probarlo en movimiento en Motion Canvas.

**Lienzo de diseño (keyframes y animaciones):** https://claude.ai/artifact/KgeWCiz1jxo3xfkiNfAyqh

- Fila 1: sistema (color, tipo, actores, R1–R4), mundo (planos y arco de cámara) y cartela.
- Filas 2 y 3: trece keyframes, uno por momento clave del guion (título de cada uno: sección, minuto, ENERGY).
- Fila 4: cuatro animaciones de muestra en bucle (A1 apertura, A2 el giro, A3 instrumentos, A4 volver a la cuenta).

**Copia local:** [`diseno/`](diseno/). `diseno/preview/index.html` se abre en el navegador sin nada más (galería de todos los fotogramas y animaciones); `diseno/project/` guarda los originales del lienzo (`canvas.json` y un `.dc.html` por fotograma).

## Por qué este mundo

Es el primer vídeo: lo que se fije aquí lo hereda la serie. Se fija **un gesto de serie** y **un mundo por episodio**.

- **Gesto de serie (fijo):** la frase vive en el cielo; los datos, en el suelo. Cada prueba baja de la frase al suelo y vuelve con R1 rellenado. Vale para cualquier tema.
- **Mundo de este episodio:** España de noche, inclinada, hecha de baldosas. Cada baldosa es una vivienda (o un bloque de ellas); la luz dentro es un hogar. Lo vacío no tiene luz. Así «¿dónde?» se responde viajando, no cambiando de diapositiva.

## cinematic_world

```yaml
cinematic_world:
  mode: "flat-shape-depth-world"
  spatial_model: "un mapa de España inclinado hecho de baldosas bajo un cielo donde flotan las frases"
  world_extent: "el mapa sale del encuadre por abajo y por los lados; el cielo sigue por arriba"
  depth_and_parallax: "far: cielo y frases (×0.25); back: España entera (×0.6); mid: el parque cercano (×1.0); near: evidencia (×1.25); hud: R1, R3, subtítulos"
  recurring_landmarks: ["Madrid", "Barcelona", "centro de Málaga", "el interior (Zamora)", "la barra R4", "las cuatro preguntas R1"]
  camera_arc: "una ventana en Madrid -> pull-back a España -> Madrid y Barcelona (suelo) -> interior (vacías) -> push al centro de Málaga (giro) -> grúa cenital a Cataluña (topes) -> costa -> vuelta al plano general"
  baseline_motion: "deriva lenta y determinista de la cámara; parpadeo mínimo de luces turísticas; los hogares no respiran en escala, solo en color"
  light_and_atmosphere: "luz práctica: los hogares son la única fuente; las ciudades son charcos de luz; bruma en el horizonte; viñeta suave"
  transition_logic: "viaje de cámara entre lugares del mismo mapa; corte duro solo al cambiar de frase (sección)"
  hud_policy: "R1 arriba a la derecha, R3 abajo a la izquierda; nunca en los planos del mundo"
  reading_locks: "cada cifra con su rótulo; tarjetas R2; tabla final; vista cenital de topes"
```

**Base cartográfica:** el contorno del lienzo es aproximado y sin islas. Pendiente: base con licencia (inventario, punto 5), con Baleares y Canarias (Las Palmas importa para turísticos).

## Actores y conducta

| Actor | Forma | Conducta | Nunca |
|---|---|---|---|
| Vivienda habitada | baldosa con luz ámbar dentro | se enciende cuando entra un hogar | aparecer ya encendida si la narración dice que alguien llega |
| Vacía | baldosa hueca, borde pizarra | quieta, fría; solo cambia si entra un hogar | respirar o brillar |
| Terminada | baldosa menta que se dibuja borde a borde | se dibuja antes de que llegue nadie | aparecer de golpe |
| Hogar | círculo de luz ámbar | viaja con cinta desde su origen hasta una baldosa | desaparecer: si no tiene casa, flota y espera |
| Turístico | baldosa lila | parpadeo muy leve (anuncio, no vecino) | contarse como «piso»: siempre «anuncio» |
| Hueco de déficit | ranura discontinua en R4 | se rellena: macizo si cuenta una vez, en pulsos si cuenta cada año | cambiar de escala |

## Color y tipo

| Token | Valor | Uso |
|---|---|---|
| noche | `#0B0E14` | fondo |
| marfil | `#F2EDE4` | texto principal, déficit, R1 |
| hogares | `#F5B85A` | luz habitada |
| terminadas | `#7FE0C2` | obra nueva |
| vacías | `#6F819A` (contorno) | huecos |
| turísticos | `#C7A4FF` | anuncios |
| texto secundario | `#B7C0CC`, `#8893A3` | ejes, rótulos (ambos pasan 4,5:1 sobre noche) |

Ningún partido tiene color. Comprobar en revisión que menta y lila no se lean como colores de partido en miniatura.

Tipos: **Archivo** condensada (cifras y cartela), **Instrument Serif** cursiva (solo frases, nunca datos), **Inter** (etiquetas), **IBM Plex Mono** (fuentes y fechas). Mínimo 22 px a 1080p.

## Piezas reutilizables (cambios sobre el inventario)

- **R1:** cuatro estados con el mismo tamaño. Pendiente: contorno. Respondida: relleno marfil. Parcial: medio relleno. **Sin respuesta: trama diagonal y sello propio, mismo tamaño y peso.** Se distinguen por luminosidad, no solo por tono. Se presenta como cuatro monolitos sobre el mapa (K05) y se acopla al HUD.
- **R2:** tarjeta oscura, frase en serif, «partido · documento · fecha» en mono. Igual para todos.
- **R3:** línea fija abajo a la izquierda con la marca como píldora: discontinua = cuenta nuestra; rellena = según medio; contorno = estimación.
- **R4:** 75 ranuras × 10.000, misma anchura en todo el vídeo. **Nuevo:** lo que cuenta una vez entra de un solo gesto; lo que cuenta cada año entra en pulsos de una ranura (A3). Hace visible «una sola vez» sin texto extra.

## ENERGY y momentos fuertes

| Sección | ENERGY | Momento |
|---|---|---|
| 1. Tres frases | 2 → 5 | frases que suben al cielo; **cartela: la ciudad se enciende bajo el título (WOW 1)** |
| 2. La cuenta | 3 → 4 | pull-back: el mapa se apila en dos barras; los hogares sin baldosa forman la cola |
| 3. Quién pide casa | 2 | las luces de cada baldosa se dividen (3,82 → 2,49) |
| 4. Construir | 3 | rascacielos 2003-2025 brotan del suelo; línea de 250.000 |
| 5. Vacías | 3 | viaje al interior; huecos fríos |
| 6. Turísticos | 3 → **5** | **push del plano nacional al centro de Málaga: los mismos píxeles se vuelven baldosas (WOW 2)** |
| 7. Otras frases | 2 | grúa cenital para topes; lectura |
| 8. Volver a la cuenta | 4 | los hogares entran en baldosas que ya existían |
| 9. Cierre | 1 | plano general; tabla; R1 a tamaño completo |

## visual_intent de los momentos consecuentes

```yaml
- beat: cartela (K02, A1)
  meaning: "Detrás de las frases evidentes hay un país entero que no cabe en ellas."
  technique: frases-que-retroceden-al-cielo + encendido-radial-del-mapa
  intensity: 5
  duration: "1.2s dentro de la cartela"
  exit_condition: "título legible; mapa encendido; frases como bruma en el plano far"
- beat: la cola (K04)
  meaning: "Hay más hogares nuevos que viviendas nuevas: los que sobran no desaparecen, esperan."
  technique: hogares-que-bajan + terminadas-que-se-dibujan + resto-que-flota
  intensity: 4
  duration: "3s en «¿dónde vive?»"
  exit_condition: "15 luces flotando arriba a la derecha; heredadas por K05"
- beat: el giro (K09, A2)
  meaning: "La misma cifra es pequeña para España y enorme para un barrio."
  technique: push-continuo-sin-corte + baldosas-que-se-convierten-en-rejilla + vuelta-a-foco-profundo
  intensity: 5
  duration: "3s de push + lectura de 3s + comparación de 2s"
  exit_condition: "1,28% y 44,6% a la vez en pantalla, con sus denominadores escritos"
- beat: volver a la cuenta (K12, A4)
  meaning: "Parte del «que se usen» ya ha pasado: los hogares entraron en viviendas que existían."
  technique: cintas-emisor-receptor; terminadas-dibujadas-antes; existentes-solo-se-encienden
  intensity: 4
  duration: "2.5s"
  exit_condition: "4 baldosas menta y 6 pizarra encendidas; etiqueta de estimación"
```

## Implementación en Motion Canvas

Reutilizar lo que ya existe en synesthetic-code-craft antes de inventar:

- **Escenario:** `createStage` / `createShot` (planos far, back, mid, near y `hud`). No usar el nodo `Camera`.
- **Mapa:** patrón de mundo proyectado con formas planas (referencia: The Mirror, `incident.jsx`). Proyectar las baldosas por código y ordenar por profundidad; no rasterizar una imagen.
- **Foco:** `focusOn` y desenfoque por plano para «presente, no es el sujeto» (K01, K07).
- **Luz:** `lightPool` para las ciudades; `hazeSheet` en el horizonte; `vignette` suave. Nada de destellos fuera de los dos WOW.
- **Movimiento de actores:** `transferRibbon` / `flowSignal` para hogar → baldosa; `draw-on` para terminadas; `impact` solo al llegar un hogar.
- **Bucles:** el parpadeo turístico y la deriva de cámara devuelven su handle y se cancelan antes de cambiar de estado.
- **Rascacielos (K06):** barras desde cero con textura de ventanas; mantener eje real.

## Cambios propuestos al inventario

1. **E03:** las barras se construyen con las baldosas del mapa (100.000 por baldosa), no como barras nuevas.
2. **E04:** los 148.000 hogares sin baldosa se quedan en pantalla y pasan a K05.
3. **E05:** R1 se presenta como cuatro monolitos sobre el mapa y luego se acopla al HUD.
4. **E07:** sigue sin PANTALLA en el guion; propuesta: dividir las luces de las baldosas, sin sección propia.
5. **E09:** ya está la serie completa 2003-2024 en el registro (V8); 2025 con trama de provisional.
6. **E11:** solo Madrid, Barcelona y Sevilla llevan cifra propia en el registro; confirmar las seis áreas en V7 antes de nombrarlas.
7. **E25:** vista cenital (lectura), con barras de recuento desde cero al lado del mapa.
8. **E36:** columnas propuestas en K13 (frase, frente al déficit, una vez o cada año, dónde importa). El contenido de las filas sigue siendo decisión humana; solo están rellenas las celdas que el guion ya dice.

## Pendiente

- Base cartográfica y licencia (con islas).
- Probar en Motion Canvas: el push del giro a velocidad real y a tamaño de móvil; la legibilidad de las etiquetas que se quedan de pie sobre el mapa inclinado.
- Decidir si los bookends del canal (pájaro y «Gracias por ver») aplican a esta serie.
- Fotograma de miniatura: candidato, el giro (1,28% frente a 44,6%) o la cartela con la ciudad encendida.
