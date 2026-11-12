# Registro de fuentes (inicio, 4 noviembre 2026)

**Nivel de verificación:** **[P]** leída la fuente primaria. **[S]** solo cobertura de prensa o resumen de tercero: no usar en guion sin ir al original. **[C]** cálculo propio a partir de fuentes citadas: explicar en pantalla que es nuestro.

## Demanda: población y hogares

### V1 - INE, Estadística Continua de Población, 1 julio 2026 (provisional) [P]
https://www.ine.es/dyngs/Prensa/ECP2T26.htm
- Población: 49.801.559. Aumento interanual: 444.205 (0,90%).
- Hogares: 19.874.860. Aumento interanual: 238.585 [C, resta de la propia tabla] (1,22%).
- **Límite:** los hogares son provisionales desde el censo de viviendas de 2021 y se revisan cada trimestre. El INE los estima, no los cuenta uno a uno.

### V2 - INE, series de hogares por tamaño (API Tempus, tablas 60131, 60132, 60133) [P]
https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/60133?nult=26

| Miembros | Ene 2021 | Jul 2026 | Cambio |
|---|---:|---:|---:|
| 1 | 5.001.166 | 5.678.769 | +677.603 |
| 2 | 5.203.749 | 5.779.949 | +576.200 |
| 3 | 3.837.982 | 3.926.489 | +88.507 |
| 4 o más | 4.496.326 | 4.489.653 | -6.673 |
| **Total** | **18.539.223** | **19.874.860** | **+1.335.637** |

Tamaño medio: 2,54 → 2,49. Hogares nuevos, de julio a julio: 2022 +282.739; 2023 +266.633; 2024 +193.860; 2025 +223.758; 2026 +238.585.

### V3 - ¿Población o gente viviendo sola? Descomposición [C]
Efecto población = (P1 − P0) / tamaño inicial. Efecto tamaño = crecimiento total − efecto población.

| Periodo | Hogares nuevos | Por población | Por hogares más pequeños |
|---|---:|---:|---:|
| 2011-2021 (censos) | +455.531 | ~35% | ~65% |
| 2021-2026 | +1.335.637 | ~71% (68-74%) | ~29% (26-32%) |
| 2024-2039 (proyección INE) | +3.691.151 | ~54% | ~46% |

- El rango de 2021-2026 refleja el redondeo del tamaño medio publicado (2,49). P1 no se publica en la tabla: es hogares × tamaño.
- **Límite:** censos de 2011 y 2021 con metodología distinta; el primer tramo es orientativo. Una descomposición aritmética no dice *por qué* cambia el tamaño.
- **Dos cifras que parecen contradecirse y no lo hacen:** el 51% de los hogares nuevos de 2021-2026 son unipersonales [C], pero solo ~29% del crecimiento se debe a que baje el tamaño medio. Miden cosas distintas: qué tipo de hogar aparece frente a qué pasaría con el tamaño de hogar constante.
- **Territorio:** los unipersonales son 41% del crecimiento en Madrid, 43% en Barcelona, 35% en Alicante; en Ourense 102% y en Zamora 189% (allí crecen los solos y bajan los demás) [C].

### V4 - INE, Censo 2021, hogares [P]
https://ine.es/prensa/censo_2021_jun.pdf
- Hogares unipersonales: 5.001.166. De ellos, 2.089.175 de personas de 65 años o más (41,8% [C]); el 70,8% de estos son mujeres.
- **Por tanto:** «vivir solo» no equivale a «querer independizarse». Buena parte es viudedad y envejecimiento en la vivienda que ya se tenía.
- Tamaño medio histórico: 3,82 (1970), 3,59 (1981), 3,26 (1991), 2,86 (2001), 2,58 (2011), 2,54 (2021).

### V5 - INE, Proyección de hogares 2024-2039 (junio 2024) [P]
https://ine.es/dyngs/Prensa/PROH20242039.htm
- De 19.310.776 a 23.001.927 hogares (+19,1%). Unipersonales: 28,1% → 33,5%. Tamaño: 2,50 → 2,32.
- **Límite:** «simulación estadística» si siguen las tendencias; no es una predicción. Publicación de 2024: comprobar si hay revisión.

### V6 - EsadeEcPol, vivir solo en Europa [S]
https://www.esade.edu/ecpol/es/blog/vivir-solo-en-europa/
- Crecimiento reciente en menores de 65: de 11,2% a 13,1% entre 2022 y 2025 en el tramo de 35 a 45 años. Un tercio de los jóvenes emancipados en 2025. Hogares unipersonales cerca de la media europea, con 13 puntos de brecha respecto a Alemania o Francia.

## El déficit

### V7 - Banco de España, Informe Anual 2025, cap. 2, epígrafe 4.1, pp. 153-158 (junio 2026) [P]
[Informe](https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/25/InfAnual_2025.pdf), [presentación](https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/25/Fich/IIPP-2026-06-18-lopez-salido-es-or.pdf)

**Método.** Indicador de flujo: viviendas terminadas menos variación de hogares residentes. Solo cubre la demanda de vivienda principal de residentes. No hemos localizado ajuste por demoliciones, ni una hipótesis de equilibrio inicial. La comparación internacional no es homogénea: España usa terminadas; otros países, visados de dos años antes.

**Cifras.**
- Déficit 2021-2025: 750.000. Es −3,7% de los hogares de 2025 (gráfico 2.11) o −3,9% de los hogares medios del periodo (gráfico 2.10): mismo dato, distinto denominador.
- Comparación (gráfico 2.11): Portugal −6,6; Italia −1,5; zona euro −0,5; Francia 0,0; Alemania +0,5. La prensa daba Francia 0,2.
- 2025: 240.000 hogares nuevos y 92.000 terminadas (−9%).
- 52,5% del déficit en seis provincias: Madrid, Barcelona, Alicante, València, Murcia y Málaga.
- Diferencial histórico, % de hogares medios: 1982-90 +6,9; 1991-2000 +5,1; 2001-10 +9,4; 2011-20 −1,2; 2021-25 −3,9.
- Unas 450.000 viviendas nuevas sin vender (estimación del Ministerio), estables desde 2018 y muchas poco adecuadas por ubicación o estado. Hay stock nuevo sin vender en plena tensión de demanda.
- Viviendas iniciadas por 1.000 hab., 2025: Italia 0,9; Alemania 2,2; España 2,8; UE 3,5; Países Bajos 3,8; Francia 4,8; Polonia 7,8.
- Turísticas: ~355.000 (1,5% del parque). Turísticas más propiedad de no residentes: ~900.000 (3,3%); Alicante 14,5%, Málaga 14,1%. Parque público: 1,5% de las principales, frente a ~7%.

**Absorción por el stock (p. 153).** El uso residencial sube 1,2 millones entre 2021 y 2025, y «como mínimo, un 60 %» procede de viviendas ya construidas con otros usos.

**Disponibilidad de viviendas sin uso residencial, 2025, % del parque (cuadro 2.7):** Madrid 9,9; Bizkaia 11,6; Barcelona 11,9; Gipuzkoa 13,7; Álava 13,9; **España 27,1**; Ourense 49,8; Zamora 50,5; Soria 54,1; Teruel 55,2; Ávila 58,2.
- Madrid y Barcelona: «rango máximo» de 300.000-350.000 hogares, menos en las capitales. Cada una movilizó ya 90.000-95.000 en 2021-2025 (nota 35).
- Movilizar es limitado: esas viviendas tienen otros usos, o están vacías con «habitabilidad» desconocida y sobre todo fuera de grandes núcleos. Último dato de vacías: 2020 (nota 36).

**Suelo (pp. 157-158), datos del SIU del Ministerio.** Previsión de 7 millones de viviendas potenciales en España, pero solo ~1,1 millones en las seis grandes áreas urbanas, donde reside el 36% de los hogares. Área de Barcelona ~120.000 (5,9% de sus hogares); Madrid 550.000 (19%); Sevilla 163.000 (27%). Ejecución de lo previsto: Sevilla 28%, Madrid y Málaga 35%, Zaragoza 46,6%. El SIU usa imágenes por satélite: hay incertidumbre si no están actualizadas (nota 42).

**Otros datos.** Elasticidad de la oferta a largo plazo ~0,45, como cota superior. «Hacia un millón en 2028» sigue solo en [Artículo14](https://www.articulo14.es/economia/banco-espana-deficit-millon-viviendas-2028-20261009.html) [S].

**Límite e interés.** El BdE concluye priorizando la oferta, aunque cita también vivienda pública, rehabilitación y movilización de vacías. No publica en estas páginas cómo estima el 60%. La cobertura de prensa inicial decía «Valencia» y «la mitad»: usar las cifras de aquí.
- **Vivienda protegida, Informe Anual 2025, p. 177 del PDF [P]:** entre 1991 y 2015 se construyeron más de 1,3 millones con recursos públicos, con protección limitada en el tiempo y mayoritariamente vendidas por debajo del mercado; de ahí, según el informe, el parque actual de 1,5%.
- **Posición del propio informe, p. 17 del PDF [P]:** las políticas «deberían priorizar actuaciones que aumenten la disponibilidad de nuevas viviendas». Decirlo al citarlo como árbitro.

### V8 - Producción de vivienda [P para la serie hasta 2024; S para 2025]
- Serie oficial, [Boletín anual 2024 del Observatorio de Vivienda y Suelo](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/vivienda-agenda-urbana/Documents/2025/040725-ObservatoriodeviviendaysueloBoletnanual24.pdf), tabla 1.2 (libre + protegida): 2011 179.351; 2012 133.415; 2013 60.289; 2014 50.428; 2015 49.472; 2016 44.630; 2017 54.274; 2018 64.044; 2019 78.810; 2020 87.504; 2021 94.728; 2022 89.545; 2023 89.320; 2024 100.980. La parte libre se estima desde visados de los colegios de arquitectos, y las cifras se revisan entre boletines.
- Serie larga, misma tabla (libre + protegida): 2003 503.724; 2004 563.923; 2005 591.604; 2006 658.510; 2007 647.179; 2008 632.218; 2009 424.459; 2010 276.883. Desde 2011 cae por debajo de 250.000 y no vuelve.
- Suma [C]: 802.217 en 2011-2020; 466.573 en 2021-2025, contando 92.000 en 2025.
- Visados de obra nueva 2025: 139.016, +8,8% ([Alimarket](https://www.alimarket.es/construccion/noticia_amp/422444/los-visados-aumentan-un-8-8--en-vivienda-nueva-y-un-2-9--en-rehabilitacion)). Un visado autoriza, no construye.
- Terminadas 2025: **92.000** (V7) frente a **80.792** ([The Corner](https://thecorner.eu/54/11104-social-housing-units-built-in-spain-in-2025-23/124961/)). **Casi seguro resuelto [C]:** 80.792 libres + 11.104 protegidas = 91.896. Falta la tabla oficial de 2025 para confirmarlo.
- VPO terminadas 2025: 11.104, -22,7% (misma fuente).
- Consultora Atlas vía [El Cronista](https://www.cronista.com/espana/economia-finanzas/crisis-habitacional-espana-tiene-suelo-para-7-millones-de-viviendas-pero-solo-el-05-puede-edificarse): suelo para 7 millones, solo 0,4-0,5% finalista. **No usar todavía:** el artículo se contradice, no define «finalista» y no enlaza el informe.

### V20 - Banco de España, Documento Ocasional 2433 (2024) [P]
https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesSeriadas/DocumentosOcasionales/24/Fich/do2433.pdf
- P. 14: parte del déficit «estaría cubriéndose» con vacías movilizadas, secundarias convertidas en principales e inmuebles terciarios convertidos en residenciales.
- Las proyecciones de hogares del INE de octubre de 2022 preveían 270.000 hogares menos para 2024-25 que las de junio de 2024: «elevada incertidumbre».
- La propiedad de no residentes en 2022-23 añadiría ~120.000 a la necesidad, sin contar la segunda residencia de residentes ni el alquiler a no residentes.

### V21 - Prueba del argumento de absorción [C]
Parte de V2, V7 y V9. **Resultado: se confirma como cuenta, no como observación.**

| Comprobación | Resultado | Lectura |
|---|---:|---|
| Hogares, ene 2021-ene 2026 | +1.222.836 | Coincide con los «1,2 millones» de uso residencial del BdE: parecen ser la misma cifra |
| 750.000 / 1,2 millones | 62,5% | Coincide con «como mínimo, un 60 %» |
| Terminadas implícitas | ~473.000 | ~95.000/año |
| No principales: 8.087.092 (censo 2021) − 750.000 | ~7,33 M, 27,1% del parque | Reproduce el 27,1% del cuadro 2.7 |
| Madrid y Barcelona: hogares de ene 2026 y % del cuadro 2.7 | ~302.000 y ~315.000 | El «rango máximo» parece ser **por provincia** y equivaler a **todas** sus no principales |
| Madrid: parque del Ministerio a fin de 2025 (3.054.762, V22) − hogares del INE | 305.555, 10,0% | Reproduce el 9,9% del cuadro 2.7 |

- **Por tanto:** el 60% y el déficit parecen dos caras de una misma resta, no dos mediciones. Es inferencia nuestra: el cuadro 2.7 cita también Catastro y Agencia Tributaria, y la coincidencia no prueba su método.
- **Qué puede haber dentro de esa resta:** absorción real; hogares sobrestimados, porque el INE los estima y revisa (V1, V20); terminadas mal medidas (V8); conversiones de locales. Las demoliciones irían en sentido contrario: aumentarían lo absorbido.
- **La serie del Ministerio (V22) no es una segunda prueba independiente:** parece la misma resta con otra estimación de hogares. Ver V24 para los rangos.
- **«No principal» no es «vacía»:** de los 8,1 millones de 2021, solo 3,8 eran vacías (V9). La fuente no reparte lo absorbido entre vacías, secundarias y otros usos.
- **Nadie lo ha contado todavía:** el último recuento es de 2021. La cifra de 3,8 millones tiene cinco años, y si la absorción es real ya no describe el presente. El censo pendiente (V9) lo contrastaría directamente.
- 1,44 viviendas por hogar en 2021; ~1,37 a principios de 2026 con estas cuentas. «1,4» sigue siendo válido, con fecha.

### V22 - Ministerio de Vivienda, estimación del parque de viviendas [P hasta 2023; S 2024-2025]
Hasta 2023: [Boletín anual 2024](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/vivienda-agenda-urbana/Documents/2025/040725-ObservatoriodeviviendaysueloBoletnanual24.pdf), tablas 8.1 y 8.2. 2024: [Idealista](https://www.idealista.com/news/node/851807). 2025: [EFE vía RTVC](https://rtvc.es/canarias-cuenta-con-11-millones-de-viviendas-18-junio-2016/); la URL dice 2016, pero el texto habla del cierre de 2025 y encaja con 2024.

| Fin de año | Total | Principales | No principales | Δ principales | Δ no principales | Δ total | Terminadas (V8) |
|---|---:|---:|---:|---:|---:|---:|---:|
| 2020 (censo) | 26.623.708 | 18.536.616 | 8.087.092 | | | | |
| 2021 | 26.719.905 | 18.661.493 | 8.058.412 | +124.877 | −28.680 | +96.197 | 94.728 |
| 2022 | 26.811.833 | 18.876.667 | 7.935.166 | +215.174 | −123.246 | +91.928 | 89.545 |
| 2023 | 26.902.443 | 19.165.829 | 7.736.614 | +289.162 | −198.552 | +90.610 | 89.320 |
| 2024 | 27.004.765 [C] | 19.278.057 [C] | 7.726.708 | +112.228 | −9.906 | +102.322 | 100.980 |
| 2025 | 27.099.556 | 19.571.428 | 7.528.128 | +293.371 | −198.580 | +94.791 | 92.000 |
| **2020-2025 [C]** | | | | **+1.034.812** | **−558.964** | **+475.848** | **466.573** |

- **La «contradicción» de 2024 no indica que la absorción se parase:** el dato es atípico entre 2023 y 2025, y coincide con un aumento flojo de hogares en la EPA ese año (ver abajo). El Ministerio afirma expresamente que las no principales bajaron 198.552 en 2023.
- **Corrección:** el «+834.210 (+3,2%)» de 2023 en la [prensa](https://www.cronista.com/espana/economia-finanzas/se-registraron-casi-27-millones-de-viviendas-en-todo-el-pais-casi-un-2-se-encuentran-inhabitadas) es un artefacto: la serie se rehízo con el censo de 2021. En la serie actual, el aumento es de 90.610.
- El total crece casi igual que las terminadas: es censo más flujos. El reparto entre principales y no principales es otra cosa.
- **Metodología leída** ([copia local](2025-02_metodologia_estimacion_del_parque_de_viviendas.pdf), [original](https://www.mivau.gob.es/recursos_mfom/comodin/recursos/2025-02_metodologia_estimacion_del_parque_de_viviendas.pdf), febrero de 2025) [P]: parque = año anterior + libres terminadas + protegidas terminadas + creadas por rehabilitación − suprimidas, desde los censos. Todas sus fuentes son de construcción, con imputación de datos faltantes. **No explica cómo se reparten principales y no principales**, aunque lo publica.
- **El reparto parece venir de los hogares de la EPA [C, inferencia]:**

| Año | Δ principales, Ministerio | Δ hogares EPA, misma tabla 8.1 | Diferencia |
|---|---:|---:|---:|
| 2021 | +124.877 | +172.200 | −47.323 |
| 2022 | +215.174 | +210.700 | +4.474 |
| 2023 | +289.162 | +286.800 | +2.362 |
| 2024 | +112.228 | +107.700 | +4.528 |
| 2025 | +293.371 | +258.200 (T4, INE actual) | +35.171 |

  Coincide casi exactamente en 2022-2024 y peor en 2021 y 2025. No lo declara el Ministerio y son pocos datos: **hay que preguntarle**. Si se confirma, las no principales son un **residuo** (parque − hogares estimados), no una medición. **No es una prueba independiente de la cuenta del BdE:** es la misma resta con otra estimación de hogares del INE.
- [Boletín especial Censo 2021](https://publicaciones.transportes.gob.es/downloadcustom/sample/3408) [P]: 4,2 M secundarias y 3,8 M vacías. La comparación de vacías con 2011 está afectada por el cambio a criterio eléctrico.
- Sin vender: 452.670 a fin de 2025, −5,7% (EFE) [S]; matiza el «estables» de V7.

### V24 - ¿Cuánto déficit y cuánta absorción? Según qué serie [C]
Parte de V2, V8, V22 y la EPA del INE ([tabla 65270](https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/65270?nult=50)). **Las series coinciden bastante, pero comparten insumos: coincidir no es confirmar.**

**Trampa de la EPA:** en abril de 2024 el INE [cambió su base poblacional](https://www.ine.es/dyngs/Prensa/cbEPA2021.htm): hasta 2020, base 2011; desde 2021, base censo 2021. Por eso los hogares caen 207.800 entre T4 2020 y T1 2021, cuando la tendencia es subir. **No se puede restar a través de ese salto.** La tabla 8.1 del Ministerio mezcla además datos anteriores y posteriores a la revisión. Una versión previa de este registro daba «EPA +777.400, brecha ~403.000»: **era un error nuestro** y queda retirado.

**2022-2025, cuatro años, sin cruzar el salto** (terminadas: 371.845):
| Demanda medida con | Aumento | Brecha | Parte no cubierta por obra nueva |
|---|---:|---:|---:|
| Hogares INE, ECP (ene 2022-ene 2026) | 939.956 | **~568.000** | ~60% |
| Hogares INE, EPA actual (T4 2021-T4 2025) | 970.200 | **~598.000** | ~62% |
| Principales, Ministerio (fin 2021-fin 2025) | 909.935 | **~538.000** | ~59% |

Unas 135.000-150.000 viviendas al año, y en torno al 60%, con las tres. Encaja con el dato del BdE.

**2021-2025, cinco años** (terminadas: 466.573):
| Demanda medida con | Aumento | Brecha | Parte no cubierta |
|---|---:|---:|---:|
| ECP (ene 2021-ene 2026) | 1.222.836 | **~756.000** (BdE: 750.000) | ~62% |
| EPA actual (T1 2021-T1 2026) | 1.307.600 | **~841.000** | ~64% |
| Principales, Ministerio (fin 2020-fin 2025) | 1.034.812 | **~568.000** | ~55% |

**Lectura:**
- De los ~188.000 que separan ECP y Ministerio, ~158.000 están en 2021 (+282.880 frente a +124.877). El extremo bajo depende sobre todo de ese año, que es también donde peor encaja el Ministerio con la EPA, y no sabemos por qué. **Es el extremo más débil.** La cifra de 750.000 está bien respaldada por los datos actuales del INE; el rango amplio es de ~570.000 a ~840.000.
- Se puede decir «en torno al 60%» y «más de la mitad». «Como mínimo un 60%» es la formulación del BdE, y hay que citarla como suya.
- **Lo que esto no prueba:** las tres cuentas usan las mismas terminadas y parten del mismo censo, y la EPA y la ECP se apoyan en la misma base poblacional. Un error común no se vería aquí. Solo un censo nuevo o una medición directa, como la de Euskadi (V25), observa el uso de las viviendas.

**El choque 2011-2020 (V7 frente a V23): la evidencia se inclina hacia un superávit moderado, sin cerrar la cuestión:**
| Viviendas | Hogares | Resultado | Lectura |
|---|---|---:|---|
| Censo bruto, +1.415.085 | Censo, +455.531 | **+959.554** | Cifra de V23; parece inflada |
| Terminadas, +802.217 | Censo, +455.531 | **+346.686** | |
| Censo por año de construcción, +734.655 | Censo, +455.531 | **+279.124** | |
| Terminadas, +802.217 | EPA base 2011, 2011-2020, +822.000 | **−19.783** | Base anterior al censo de 2021 |
| Terminadas, +802.217 | EPA base 2011, 2010-2020, +1.071.300 | **−269.083** | Base anterior al censo de 2021 |
| Terminadas, +802.217 | Implícito en BdE, ~+1,02 M | **~−220.000** (−1,2%) | Serie no identificada |

- Los +959.554 de V23 parecen inflados: el censo creció ~600.000 más que lo terminado, y el método censal cambió. Conviene no usarlos sin esa advertencia.
- La EPA de base 2011 queda ~281.000 hogares por encima del censo a finales de 2020, y el propio INE la rebajó con la nueva base. Eso resta fuerza a las filas negativas que dependen de ella.
- El −1,2% del BdE no puede salir de hogares censo a censo. Su nota habla de «censos y padrones» (V20), sin dar el detalle. **No usar en pantalla ni el −1,2% ni los +959.554 sin explicar esto.** Preguntar al BdE.
- **Límite:** el censo de 2011 y el de 2021 usan métodos distintos, y el ajuste de la EPA al censo no es una confirmación independiente.
- Lo que no depende de esta discusión: en 2021 había 8,1 millones de no principales. Y el BdE reconoce el exceso acumulado hasta 2010.

### V25 - Euskadi, Encuesta sobre el Uso de la Vivienda (EUV) 2021 y 2023 [P]
[Informe 2023](https://www.euskadi.eus/contenidos/documentacion/ovv_sectorvivienda_evv2023_inf/es_def/EUV23_Informe-de-Resultados_ES.pdf), [informe 2021](https://www.euskadi.eus/contenidos/documentacion/ovv_vv_2021/es_def/adjuntos/Informe-sobre-el-uso-de-la-vivienda-en-Euskadi-2021.pdf), [ficha metodológica](https://www.euskadi.eus/informacion/estadistica-de-vivienda-vacia-evv-ficha-metodologica/web01-a2etxebi/es/). **La única medición directa y repetida del uso de las viviendas que hemos encontrado.** Encuesta bienal por cuestionario, con 749 secciones censales de 1.714. Clasifica por uso real, «con independencia» del empadronamiento.

| Viviendas familiares | 2019 | 2021 | 2023 | Cambio 2019-21 | Cambio 2021-23 |
|---|---:|---:|---:|---:|---:|
| Total | 1.059.465 | 1.073.954 | 1.078.112 | +14.489 | +4.158 |
| Principales | 972.486 | 997.050 | 999.754 | +24.564 | +2.704 |
| Temporada | 33.446 | 30.147 | 35.306 | −3.299 | +5.159 |
| Deshabitadas | 53.533 | 46.757 | 43.052 | −6.776 | −3.705 |
| No principales | 86.979 | 76.904 | 78.358 | −10.075 | +1.454 |

**Prueba contra los hogares del INE [C]:** sumando las tres provincias, la ECP da +14.085 hogares de octubre de 2021 a octubre de 2023 ([tabla 60133](https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/60133?nult=26)). La resta del método nacional implicaría que las no principales caen ~9.900 (+4.158 − 14.085). La encuesta mide +1.454.

**Lectura:**
- **2019-2021 apoya el mecanismo:** ~41% del aumento de principales salió del stock existente, medido sobre el terreno. Es anterior al periodo del BdE.
- **2021-2023 no lo confirma:** las deshabitadas siguen bajando, pero suben las de temporada y las no principales no caen. **Es la primera evidencia que no comparte insumos y no sale igual.**
- **No refuta el 60% nacional:** es una sola comunidad, de crecimiento lento, y la diferencia son ~11.000 viviendas, un punto del parque. **La ficha no publica el error muestral**, y las secciones por área funcional llevan avisos de pocas unidades. Dos años pueden ser ruido. Preguntar el error al Gobierno Vasco.
- **Independencia parcial:** el padrón se usa para estratificar la muestra (ficha). No sabemos si interviene al elevar resultados.
- **Nivel:** la EUV da 60.000-70.000 principales más que hogares la ECP. Encaja con que cuente a quien vive sin empadronarse, pero no lo hemos comprobado.
- **Falta la edición de 2025:** tocaría por periodicidad y no la hemos encontrado. Sería la prueba decisiva dentro de Euskadi.

**Otras fuentes revisadas:**
- **Censo nuevo:** no hay ninguno posterior a 2021 con datos. La prensa cita un convenio Eustat-INE para los «Censos de Población y Viviendas del año 2026» y la ECEPOV 2026, con entrega de datos de la encuesta [antes del 1 de enero de 2027](https://www.ondavasca.com/eustat-e-ine-acuerdan-realizar-el-censo-de-poblacion-y-viviendas-2026-en-euskadi/) [S]. Sin fecha de resultados ni método. El [Censo Anual de Población](https://www.ine.es/metodologia/t20/meto_censo_poblacion_anual.pdf) no sirve: es independiente del censo de viviendas.
- **Electricidad:** es el dato que usó el INE en 2021, con consumo de 2020. No hemos encontrado una serie pública posterior por vivienda. Sería la mejor prueba nacional. Preguntar al INE y a la CNMC.
- **IRPF:** la [partida 155](https://sede.agenciatributaria.gob.es/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Estadisticas/Publicaciones/sites/irpf/2023/jrubik70f52f47cdd3375b7d926a3e3d4a6019217fa7a5.html) (inmuebles a disposición) podría indicar la evolución de las no principales de particulares. Sin revisar la serie. Cuenta declarantes, no viviendas, y no cubre sociedades ni, previsiblemente, los regímenes forales.
- **Catastro:** publica inmuebles de uso residencial, un uso jurídico o físico, no si alguien vive allí. Podría contrastar las terminadas y las demoliciones, pero no la ocupación. Serie nacional sin descargar.

### V23 - Arellano y Roca (UPC), «Cinco tesis sobre la política de vivienda en España» [P, diapositivas]
[Diapositivas](https://www.upc.edu/ca/sala-de-premsa/pdfs/cinco-tesis-sobre-la-vivienda-en-espana). Artículo: https://doi.org/10.37230/CyTET.2025.225.8, sin leer.
- Tesis: (1) no existe un grave déficit; (2) más viviendas no bajan precios; (3) no falta suelo; (4) el gran problema es la falta de vivienda social (17% de lo terminado en 2007-2023); (5) hay que controlar los alquileres.
- Argumento clave: el BdE no considera el superávit previo. En 2011-2021 el parque superó en 959.554 el aumento de hogares; en 2021 sobraban 8.084.485 viviendas respecto a hogares (30%).
- **Choque con V7:** para 2011-20 el BdE da −1,2% y estos autores un superávit. Desglose en V24: la diferencia viene de qué viviendas y qué hogares se cuentan.
- **Lo que hay que matizar:** 8 millones de «exceso» incluye toda segunda residencia y no dice dónde está, justo lo que discute el cuadro 2.7. El IA 2025 sí reconoce el superávit anterior y la absorción; las diapositivas parecen responder a un BdE anterior. La tesis 2 se apoya en la experiencia observada, sin contrafactual declarado. El «5% deseable» de vacías no trae fuente. Los 154.000/año de construcción no aclaran si son iniciadas o visados: no comparar con terminadas.
- **Límite e interés:** toma partido: propone más vivienda protegida y control de alquileres. Equilibra a V7 y V10, pero no es neutral, igual que ellas.

## Stock y vacías

### V9 - INE, Censo 2021, viviendas (clasificación eléctrica provisional) [P]
https://ine.es/prensa/censo_2021_jun.pdf
- Total: 26.623.708. Principales: 18.536.616. **1,44 viviendas por hogar** [C]. Unas 8,1 millones no principales [C].
- Vacías: 3.837.328 (14,4%). Muy bajo consumo: 943.924 (3,5%). Uso esporádico: 2.514.511 (9,4%).
- **Definición de vacía:** sin contrato de luz, o con consumo anual inferior al de una vivienda media del municipio ocupada 15 días.

| Municipio | % población | Vacías | % sobre sus viviendas | % de todas las vacías |
|---|---:|---:|---:|---:|
| < 1.000 hab. | 3,1 | 551.377 | 33,3 | 14,4 |
| 1.001-10.000 | 17,2 | 1.173.031 | 21,6 | 30,6 |
| 10.001-50.000 | 26,9 | 995.782 | 13,9 | 25,9 |
| 50.001-250.000 | 29,0 | 714.065 | 10,2 | 18,6 |
| > 250.000 | 23,8 | 403.073 | 7,5 | 10,5 |

- Grandes ciudades: Barcelona 9,3%, Valencia 8,8%, Málaga 6,4%, Madrid 6,3%. Santa Cruz de Tenerife 17,3%, Vigo 15,1%.
- **Cinturones metropolitanos:** Majadahonda 2,7%, Fuenlabrada 2,9%, Móstoles 3,1%, Cerdanyola 3,0%, Pallejà 2,4%. Más del 93% de viviendas principales en Coslada, Fuenlabrada, Parla, Cornellà o Sant Boi.
- **Límites:** clasificación provisional; consumo de 2020, año de pandemia; una vivienda «vacía» puede ser habitable o una ruina, y el censo no lo distingue. El INE prevé censos de viviendas para años terminados en 1, 5 y 8: **si sale el de 2025 antes de producir, hay que rehacer esta sección.**

### V10 - Cátedra APCE-UPF, viviendas vacías, 2026 (vía Interempresas) [S]
https://www.interempresas.net/Construccion/651073-APCE-UPF-sostienen-vivienda-vacia-no-solucionara-crisis-acceso-vivienda-concentrarse.html
- Sostiene que el censo sobredimensiona las vacías en grandes ciudades. Censo municipal de Barcelona por observación directa (2019): 1,22%, frente a 9,3% del INE (2021). Girona (2017): algo más de 2%.
- **Límite e interés:** APCE agrupa a promotores y constructores y el estudio concluye a favor de más oferta. No invalida el dato, pero obliga a contrastarlo. Años y definiciones distintos: no es una resta limpia.

### V11 - Tinsa, Situación de la vivienda vacía (2023) [S]
https://www.tinsa.es/sala-de-prensa/notas-de-prensa/informe-vivienda-vacia-2023/
- 1 millón de vacías en 46 municipios; 2,8 millones en más de 8.000. Seis mayores ciudades: 266.173, un 40% menos que en 2001. Ourense 43,7%, Lugo 37,3%.
- Causas citadas: inhabitabilidad, procesos jurídicos, obsolescencia de segunda residencia, despoblación.
- **Límite e interés:** empresa de tasación. Compara censos que el INE considera no plenamente comparables.

## Políticas sobre vacías

### V12 - Impuesto catalán sobre vacías (Ley 14/2015) e Ivàlua (vía Diari de Tarragona) [S]
https://www.diaridetarragona.com/tarragona/263433/mitad-pisos-vacios-tarragona-pagan-impuesto-desocupados.html
- Evaluación asociada a más movilización hacia alquiler asequible, con «importantes limitaciones metodológicas» y sin cambios observados en el mercado general ni en la ratio de vacías.
- **No usar** las cifras de Tarragona: el artículo invierte las suyas (157 y 97). Buscar el informe de Ivàlua y los datos de la Agència Tributària de Catalunya.
- **Verificado el 6 de noviembre de 2026 [P]:** [síntesis de Ivàlua](https://ivalua.cat/sites/default/files/2024-02/PB_Impost%20als%20Habitatges%20Buits%20_Def.pdf) y [ficha](https://ivalua.cat/ca/avaluacio/habitatge/impost-sobre-els-habitatges-buits). Todeschini y Borrell Porta, realizada en septiembre de 2022, datos de 2014-2019, dobles diferencias. Sin efecto estadísticamente significativo en el número de vacías ni en el alquiler; asociado a más cesión a alquiler asequible, con sesgos «importants i poc quantificables». Las vacías se miden por consumo de agua (<3 m³ al año), con error de medida, porque el registro no sirve. Entonces el impuesto solo afectaba a personas jurídicas. Ivàlua explica que cada año aparecen vacías nuevas. El informe completo no se ha leído.

### V13 - Andalucía, expropiación temporal de uso (Decreto-ley 6/2013) [S]
[Idealista](https://www.idealista.com/news/node/602805), [Legal Today](https://www.legaltoday.com/practica-juridica/derecho-civil/civil/la-expropiacion-de-viviendas-vacias-es-competencia-exlusiva-del-estado-2015-06-29/)
- Viviendas de bancos, para personas en riesgo de exclusión. 18 expedientes iniciados en tres meses, según la propia Junta.
- El Constitucional lo anuló en 2015 por invadir competencia estatal, **no** por declarar imposible la medida en sí, según esta cobertura. Es un matiz decisivo: leer la sentencia.

## Oferta y suelo

### V14 - Barcelona, PDU metropolitano (Ara, 10 feb 2026) [S]
https://es.ara.cat/economia/inmobiliario/luz-verde-metropolis-futuro-220-000-pisos-espacios-mixtos-equilibrar-territorio_1_5644044.html
- 220.000 pisos hasta 2050 (167.000-262.000) para 184.000 residentes más. Sin crecimiento extensivo: **desclasifica 1.850 ha**. 10% asequible.
- Según Cátedra APCE-UPF, el 73% del potencial depende de renovar ciudad construida, más lento y caro.
- Redacción desde 2015, primer avance 2019, aprobación definitiva prevista en 2028.
- **Límite:** el texto aprobado no era público en esa fecha. Es un plan a 25 años, no una obra.

### V15 - Madrid, Desarrollos del Sureste [S]
[Comunidad de Madrid, 2018](https://www.comunidad.madrid/node/50679), [Idealista](https://www.idealista.com/news/taxonomy/term/3052)
- Previstos en el PGOU de 1997: unas 105.000 viviendas (otra fuente da 66.000). Plan Director municipal de 2017-2018 que los reduce a la mitad; recurso de los propietarios; suspensión cautelar del TSJM.
- Los Ahijones, primera fase autorizada en enero de 2025: 3.131 viviendas de ~18.850.
- **Límite:** la Comunidad es parte en el conflicto político. **Sin confirmar** el estado actual del pleito.
- **Añadido el 10 de noviembre de 2026 para el guion v6 [S]:** [Madridiario](https://www.madridiario.es/vivienda/sureste-madrid-boom-inmobiliario-nuevos-barrios) (1 de abril de 2026, actualizado el 9). Son cinco desarrollos en el borde sureste de la ciudad: El Cañaveral, Los Berrocales, Los Ahijones, Los Cerros y Valdecarros. «Más de 118.000 nuevas viviendas», entre el 50% y el 56% protegidas. El Cañaveral, «barrio consolidado desde 2017».
- **Límite de ese añadido:** las cifras por desarrollo del artículo suman 120.941, no 118.000; con la cifra de 105.000 de arriba, el guion dice «más de 100.000». **No decir** que El Cañaveral es el único habitado (sin comprobar) ni dar superficie total (sin fuente).

### V16 - Efecto de construir sobre precios [S]
- Asquith, Mast y Reed (2019): grandes edificios nuevos en barrios de renta baja frenan los alquileres cercanos ([resumen UCLA](https://www.lewis.ucla.edu/2021/07/07/05-market-rate-development-and-neighborhood-rents-with-evan-mast/)).
- Mast: 100 viviendas de mercado generan unas 70 vacantes en barrios de menor renta ([Minneapolis Fed](https://www.minneapolisfed.org/article/2024/how-new-apartments-create-opportunities-for-all)).
- **Límite:** Estados Unidos, con otra regulación y otro mercado. No hay evidencia española equivalente localizada.
- **Verificado el 6 de noviembre de 2026 [P, solo resúmenes]:** [Asquith, Mast y Reed](https://research.upjohn.org/up_workingpapers/316/), *REStat* 2023: alquileres cercanos 5-7% menores. [Mast](https://research.upjohn.org/up_workingpapers/307/), *JUE* 2023: 100 viviendas de mercado llevan a 45-70 personas a salir de barrios de renta inferior a la mediana. **Es personas, no «vacantes», y es un rango:** no decir «70 vacantes». El guion no usa estas cifras.

## Soluciones que no tocan oferta ni demanda directamente

### V17 - INE, EPA submuestra 2025 (teletrabajo) [P]
https://ine.es/dyngs/Prensa/vsEPA2025.htm
- Más de la mitad de días en casa: 7,9%. Ocasional: 7,7%. Ninguno: 83,4%. 2024: 7,8%, 7,6%, 83,6%.
- Estable desde mediados de 2021, según [Genbeta](https://www.genbeta.com/a-fondo/teletrabajo-se-ha-consolidado-espana-pandemia-datos-hablan-claro-seguimos-muy-lejos-nuestro-potencial/amp) [S]; confirmar con la serie del INE.
- **Límite:** semana de referencia. Sin desglose por ocupación en la nota: mirar el anexo.

### V18 - Teletrabajo y precios [S]
- Gupta, Mittal, Peeters y Van Nieuwerburgh (2022, *JFE*): la pandemia aplanó la curva de precios y alquileres entre centro y periferia en EE. UU., más donde hay más teletrabajo ([NBER](https://www.nber.org/papers/w28675)).
- Idealista vía [The Olive Press](https://theolivepress.es/spain-news/2022/08/10/analysis-how-the-pandemic-practice-of-working-from-home-is-driving-up-property-prices-in-rural-spain): municipios de menos de 5.000 hab. +6,2% frente a +1,2% nacional desde marzo de 2020. Es un portal, no un estudio causal.

### V19 - Transporte y precios [S]
- Santander: ~1,1% menos de precio por minuto adicional al centro (Ibeas et al., 2012, [RePEc](https://econpapers.repec.org/RePEc:eee:jotrge:v:24:y:2012:i:c:p:370-382)).
- Metrosur, Madrid: Mejía Dorantes, Páez y Vassallo. Pendiente de leer.
- **Límite:** ninguna fuente evalúa Cercanías o Rodalies como política de vivienda.

## Pisos turísticos

### V26 - INE, Viviendas turísticas en España, estadística experimental, mayo 2026 [P]
[Página y método](https://ine.es/experimental/viv_turistica/experimental_viv_turistica.htm); API Tempus, tablas 39363 (municipios), 39364 (provincias) y 39365 (% sobre viviendas censadas). Descargado el 6 de noviembre de 2026.

| | Nov 2024 | May 2025 | Nov 2025 | May 2026 | % censadas, may 2026 | May 2026 frente a may 2025 [C] |
|---|---:|---:|---:|---:|---:|---:|
| España | 376.463 | 381.837 | 329.764 | **341.001** | **1,28** | −10,7% |
| Málaga (prov.) | 45.543 | 48.412 | 48.261 | 45.176 | 4,53 | −6,7% |
| Alicante (prov.) | 41.179 | 40.273 | 29.697 | 32.148 | 2,38 | −20,2% |
| Las Palmas (prov.) | 27.217 | 27.038 | 27.336 | 26.998 | 4,90 | −0,1% |
| Barcelona (prov.) | 18.157 | 18.113 | 15.741 | 15.905 | 0,61 | −12,2% |
| Madrid (prov.) | 20.760 | 18.555 | 15.309 | 13.431 | 0,45 | −27,6% |
| Barcelona (mun.) | 9.750 | 9.579 | 8.536 | 8.231 | | −14,1% |
| Madrid (mun.) | 17.274 | 15.242 | 12.637 | 10.836 | | −28,9% |

- **Qué mide:** anuncios extraídos por *web scraping* de tres plataformas, filtrados según la normativa de cada comunidad y sin duplicados. **No es un registro ni un censo de pisos que dejan de ser turísticos.** La página no aclara si un anuncio está realmente activo.
- **Comparar solo mayo con mayo o noviembre con noviembre:** hay estacionalidad, y antes de 2024 los meses de referencia eran febrero y agosto. La prensa cita un máximo de 403.267 en agosto de 2021 (Forbes), que no es comparable sin más. Andalucía se revisó en 2025 para incluir las licencias VUT.
- **Otra cifra, otro método:** Barcelona tiene 8.231 anuncios según el INE y 10.101 licencias en 2024 (V27). Ninguna de las dos es «la real». El BdE da ~355.000 y 1,5% (V7): no usar esa cifra junto a la del INE sin explicarlo.
- **Lo que no dice:** adónde han ido los ~40.800 que faltan en un año. Pueden ser alquiler habitual, de temporada, venta, ilegalidad o simple retirada del anuncio. El Ministerio atribuye la caída a sus medidas ([elDiario.es](https://www.eldiario.es/economia/numero-viviendas-turisticas-cae-12-4-ano_1_12976102.html), [Forbes](https://forbes.es/forbestravel/964774/la-vivienda-turistica-cae-un-107-y-marca-uno-de-los-mayores-retrocesos-historicos/)), sin evaluación causal localizada. **No decir que han vuelto al alquiler.**

### V27 - Barcelona: fin de las licencias y efecto en precios [S, salvo indicación]
- **Medida:** el Decreto-ley catalán 3/2023 lleva a que las licencias expiren en noviembre de 2028, y el alcalde Collboni anunció en junio de 2024 que no se renovarían: 10.101 pisos ([Catalan News](https://www.catalannews.com/business/item/pwc-study-banning-tourist-flats-in-barcelona-could-cost-19bn-and-40000-jobs)). Un blog de una empresa de alquiler da 10.627 licencias en octubre de 2026 y dice que el Constitucional rechazó el recurso en marzo de 2025 ([Llavai](https://www.llavai.com/blog/tourist-flat-ban-2028-barcelona-renters)). **Verificar ambas cosas en origen.**
- **Evidencia a favor:** García-López, Jofre-Monseny, Martínez-Mazza y Segú, *Journal of Urban Economics*, 2020, vol. 119, [DOI 10.1016/j.jue.2020.103278](https://doi.org/10.1016/j.jue.2020.103278). Airbnb subió los alquileres un 1,9% en el barrio medio y un 7% en el decil de barrios con más actividad; precios de compraventa, 4,6% y 17%; precios ofertados, 3,7% y 14%. Es la mejor evidencia causal de este capítulo. No citar el 5,3% del documento de trabajo.
- **Leído el 6 de noviembre de 2026 (introducción, descripción de datos y conclusiones del [artículo publicado](https://diposit.ub.edu/items/37ecddcd-ee73-4aa9-a118-f0bf151abd37/full); sin revisar tablas ni robustez) [P]:**
  - **Datos:** compraventas de segunda mano 2009-2017; anuncios de Idealista activos cada diciembre 2007-2017; 221 áreas de unos 7.000 habitantes. **Los alquileres son precios de anuncio, no de contrato.**
  - **Qué significa cada cifra:** el 1,9% corresponde a 54 anuncios en un área, nivel medio de 2016. El 7% corresponde a 200 anuncios, media del decil superior, donde ~5% de las viviendas están en Airbnb. En toda la ciudad, 2,06% en 2015.
  - **Límite que dicen los autores:** el efecto no pequeño sobre alquileres no explica la mayor parte de la subida de la ciudad en 2012-2016. Todas sus estimaciones del efecto medio quedan entre 1% y 3%.
  - **Otro resultado:** Airbnb reduce los hogares residentes en el barrio.
  - **Periodo:** crecimiento hasta 2016, con vigilancia baja hasta entonces. Mide la llegada de Airbnb. No traslada a Málaga ni Las Palmas, cuyo ~5% es provincial.
- **Evidencia que no tenemos:** una evaluación de lo que pasa *al retirar* pisos turísticos. Un efecto al subir no garantiza el mismo efecto al bajar. Pueden venderse o pasar a uso propio en vez de alquilarse.
- **Interesados:** PwC, por encargo de Apartur (patronal), estima 1.900 M€ de PIB y unos 40.000 empleos si se prohíben. El Ayuntamiento lo rechaza y dice que 10.000 pisos darían vivienda a 25.000 personas (Catalan News, enero de 2025). Ninguna de las dos cifras es una evaluación independiente.
- **Verificado el 6 de noviembre de 2026:** [STC 64/2025, de 13 de marzo](https://hj.tribunalconstitucional.es/HJ/es/Resolucion/GetDocumentResolucion/31461) [P]: desestima el recurso de más de cincuenta diputados del Grupo Popular, con voto particular de dos magistrados. Licencias de cinco años, prorrogables si el planeamiento lo permite; las existentes, cinco años, «prorrogables a diez» si el titular acredita que el régimen no compensa la pérdida. **Barcelona es un anuncio:** 10.101 y Collboni, solo por prensa de junio de 2024 ([Noticias de Navarra](https://www.noticiasdenavarra.com/sociedad/2024/06/21/ayuntamiento-barcelona-preve-eliminar-pisos-8387534.html)). No hemos visto aprobada la revisión del plan urbanístico (PEUAT). Algunas fuentes dicen 2029. Otros municipios siguen el mismo camino ([El Debate](https://www.eldebate.com/espana/cataluna/barcelona/20260309/prohibicion-pisos-turisticos-impulsada-barcelona-extiende-toda-area-metropolitana_392923.html)).

### V28 - Registro único: anulado en parte por el Supremo [P]
[Sentencia de 19 de mayo de 2026, BOE-A-2026-12300](https://www.boe.es/boe/dias/2026/06/08/pdfs/BOE-A-2026-12300.pdf), a instancias de la Generalitat Valenciana. Anula los preceptos del RD 1312/2024 sobre el procedimiento de registro único y el resto se mantiene («Desestimar el recurso en todo lo demás»). Los despachos jurídicos lo interpretan como falta de competencia estatal, y que la Ventanilla Única Digital sigue en pie ([Uría](https://www.uria.com/es/publicaciones/9847-el-tribunal-supremo-anula-el-registro-unico-de-arrendamientos-de-corta-duracion)). El BOE publica solo el fallo, y hay otra publicación sin leer (BOE-A-2026-13893). Forbes da 21 de mayo: es incorrecto, según el BOE. **El preámbulo del RDL 29/2026 (V31) sigue citando el registro como prueba de que regular funciona.**

## Limitar alquileres

### V29 - Cataluña: dos topes, dos tipos de dato [P para el estudio de 2020; S para el resto]
- **Tope de 2020:** [Monràs y Montalvo](https://www.frbsf.org/wp-content/uploads/sites/4/wp2023-28.pdf). Versión de septiembre de 2023 leída en introducción, datos y resultados principales, con microdatos de fianzas (2016-junio de 2021) y diferencias en diferencias. Precios ~5% menos en municipios afectados frente a los no afectados, sin tendencias previas distintas. Los no afectados subieron ~7% en toda la distribución; en los afectados, lo más caro baja hasta ~4% en términos absolutos y lo barato sube más que en el grupo de control. **Contratos nuevos: ~10% menos** (tabla IV, PPML, −0,111, que incluye meses sin contratos; la introducción dice «alrededor del 10%»), **o ~19% según MCO** (−0,207, sin esos meses, que son cerca de la mitad de las observaciones). Por encima del precio de referencia caen mucho y por debajo suben, sin compensarlo. Elasticidad de ~2. **Sustituye al ~15% de la versión de 2022: no usarlo.** Miden contratos nuevos, un flujo, no el parque de alquiler. Hay un apéndice con otra medida, sin leer. Ventana corta y con pandemia, aunque excluyen el confinamiento. El tope cayó por inconstitucional. Documento de trabajo; la investigación tuvo apoyo de la Generalitat. Es otra norma, con otro diseño que la actual: no trasladar los números tal cual.
- **Tope actual (Ley 12/2023, desde marzo de 2024). Datos administrativos, vía [Verificat](https://www.verificat.cat/es/tope-alquiler-precios-oferta-catalunya/), 5 de noviembre de 2026:**
  - Desde el primer trimestre de 2024: +0,7% en municipios regulados y +13,8% en el resto, con ~10% de la población. No es un experimento: son municipios distintos.
  - Barcelona, alquiler total −4,4% desde marzo de 2024, pero precio por m² +2,3%, en máximo histórico: se alquilan pisos más pequeños. **Las dos cifras son ciertas y sugieren cosas opuestas.**
  - Contratos firmados, abril-junio de 2026: ~26.500, el mínimo desde 2010, con tendencia a la baja desde 2021. Saldo neto: +2.500 frente a +7.400 antes del tope. Menos firmas no implica menos inquilinos: también puede ser menos rotación.
  - Temporada: −71% entre T3 y T4 de 2025 sin causa explicada, y saldo de −1.000 en T2 de 2026.
- **Anuncios:**
  - Fedea: oferta −20,5% en Cataluña y −22,2% en Barcelona frente a −7% en el resto de España y +3,9% en Madrid, seis primeros trimestres. Datos de Alquiler Seguro, empresa del sector, con fuentes no especificadas (según Verificat).
  - [idealista](https://www.idealista.com/news/inmobiliario/vivienda/2026/03/16/888113-dos-anos-de-alquiler-en-zonas-tensionadas-en-cataluna-espantada-de-la-oferta-y-una): en Barcelona, el alquiler temporal es ~64% de sus anuncios, frente al 34% de marzo de 2024. Es un portal con interés en el asunto, y anuncios no son contratos.
- **La contradicción:** los anuncios sugieren huida a temporada, y las fianzas no la muestran con esa fuerza en 2026. Una posible causa es que parte del temporal no deposita fianza, pero **es una hipótesis nuestra, sin dato**. No hemos encontrado evaluación causal publicada del tope actual.
- Verificat dice 271 municipios e idealista 261: comprobar en el DOGC.
- **Tablas leídas el 6 de noviembre de 2026 (Monràs y Montalvo, tabla IV) [P]:** todos los contratos, OLS −0,207 (−0,181 con tendencias provinciales; −0,093 trimestral), PPML −0,111 (−0,069 en municipios de menos de 40.000; −0,086 trimestral). El rango real va de ~7% a ~19%, y el titular de los autores es ~10%. OLS pierde cerca de la mitad de las observaciones, los municipios-mes sin contratos. Control: todos los no regulados, que los autores reconocen distintos. Comparar con Jofre-Monseny et al. (V36): solo mercados tensos, datos trimestrales, hasta 2022, término de anticipación. Son diferencias de diseño, no una causa demostrada.

## Compra extranjera y parque público

### V30 - Quién compra y cuánta vivienda pública hace falta para llegar a la media [S y C]
- **Compras:** Notariado 2025, más de 138.250 por extranjeros (18,8% de las ventas, −0,8%), de los que 52.781 no residentes (−9,4%). Leído por buscador: **falta la fuente directa y el reparto UE/no UE**, sin el cual no se mide la propuesta del PSOE, que solo afecta a no residentes de fuera de la UE. Muchos de estos pisos son de segunda mano: no comparar con los 92.000 terminados. Incluye a extranjeros que viven aquí y trabajan aquí.
- **Efecto:** la propiedad de no residentes añade ~120.000 a la necesidad en 2022-2023 (V20). Muy concentrada: turísticas y no residentes son 14,5% en Alicante y 14,1% en Málaga (V7).
- **Parque público:** 1,5% de las principales frente a ~7% (V7). **Cuenta propia [C]:** 750.000 es el 3,7% de los hogares de 2025 (V7), luego hay ~20,3 M de hogares. Pasar de 1,5% a 7% son **~1,1 millones de viviendas**. Las 184.000 anunciadas por el Gobierno en 2023 (V32; también citadas como 180.000 y 183.000) llevarían a ~2,4%: (1,5% de 20,3 M + 184.000) / 20,3 M. Supone que todas son nuevas para el parque público, lo más favorable. Comprar pisos existentes aumenta el parque público, pero no el número de viviendas.

## El debate de la campaña

### V31 - Real Decreto-ley 29/2026 [P]
[BOE-A-2026-20823](https://www.boe.es/buscar/pdf/2026/BOE-A-2026-20823-consolidado.pdf), 7 de octubre de 2026. En vigor desde el día siguiente, salvo excepciones. Leídos los artículos 1, 7 y 8 (en parte), las disposiciones finales 5.ª y 6.ª y parte del preámbulo; en total son 91 páginas.
- **Turísticos:** IVA del 10% en alquileres amueblados de hasta 30 noches, desde el 1 de diciembre de 2026, con exención en la vivienda donde reside el arrendador. Ayuntamientos en zonas tensionadas: recargo de IBI de hasta 50%, 100% con dos o más inmuebles y 150% con cuatro o más. **No prohíbe.**
- **Vacías (art. 8, leído):** los ayuntamientos pueden exigir un recargo de IBI de hasta 50% a inmuebles residenciales desocupados de forma continuada y sin causa justificada más de dos años. Fuera de zonas tensionadas solo para titulares de cuatro o más inmuebles; hasta 100% con más de tres años de desocupación o, en zona tensionada, con cuatro o más inmuebles; con puntos adicionales en algunos casos. **Es una definición distinta de la del censo (V9).**
- **Compras:** no es una prohibición general a fondos. Limita, hasta 2030, a grandes tenedores y compradores de carteras adquirir por debajo del 70% del valor de mercado, con excepciones. No hemos encontrado una medida sobre extranjeros.
- **Contratos:** prórroga de hasta dos años, a petición del inquilino al corriente de pago, para contratos que acaben antes de 2029, salvo necesidad acreditada del propietario. Actualización de renta: máximo 2% sin nuevo pacto hasta 2027.
- **El preámbulo también afirma:** turísticas ~10% del mercado de alquiler; casi una de cada dos alquiladas en los centros de Sevilla y Málaga. **Comprobado: coincide con el BdE, gráfico 2.12 (V33),** con la salvedad de lo que excluye ese denominador, que el preámbulo no menciona.
- **Pendiente:** RDL 28/2026 (renovación de contratos), sin leer. La prensa dice que entra en vigor el 15 de noviembre.
- **Votación, a 6 de noviembre de 2026:** la Diputación Permanente debe convalidarlos. **No hay sesión convocada**, según [la página del Congreso](https://www.congreso.es/es/sesiones-de-la-diputacion-permanente). El 12 de noviembre es una previsión de prensa de octubre ([Demócrata](https://www.democrata.es/politica/el-congreso-preve-decidir-sobre-los-decretos-de-vivienda-justo-tras-la-huelga-general-y-en-la-antesala-de-la-campana/)). [El Riu](https://elriu.cat/politica/el-plazo-para-convalidar-los-decretos-de-vivienda-vence-el-mismo-dia-que-arranca-la-campana-electora), actualizado hoy, dice que la Mesa no ha fijado fecha y da como límite el **13 de noviembre**, contando días hábiles. [Fedea](https://documentos.fedea.net/pubs/ap/2026/ap2026-24.pdf) habla de treinta días desde la promulgación, sin dar fecha.
- **Resultado esperado, no ocurrido:** se espera convalidar el RDL 29, con el PNV a favor, y que el RDL 28 decaiga por empate a 34, sin llegar a aplicarse (Fedea, Demócrata). El Riu solo asegura mayoría para «al menos un decreto». **Escribir el guion con ambas salidas y fijar la frase tras votar.** Si cae el RDL 29, se caen de la lista el IVA del 10% y el recargo del IBI.
- **Fedea, opinión y no dato:** califica la vía de «fraude de ley». Si se cita, atribuirlo.
- **Actualizado el 6 de noviembre de 2026 [S]:** fuentes parlamentarias citadas por [EFE](https://www.infobae.com/espana/agencias/2026/11/04/el-congreso-sometera-a-convalidacion-los-decretos-de-vivienda-el-12-de-noviembre/) sitúan el debate y la votación en la Diputación Permanente el 12 de noviembre. Sin previsión de voto. El Congreso aún no publicaba la sesión.

### V32 - Elecciones y propuestas, a 6 de noviembre de 2026 [S; provisional]
- **Elecciones:** [RD 806/2026, BOE del 6 de octubre, según LegalToday](https://www.legaltoday.com/actualidad-juridica/noticias-de-derecho/el-boe-publica-el-real-decreto-de-disolucion-de-las-cortes-y-la-convocatoria-electoral-para-el-29-de-noviembre-2026-10-06/): 29 de noviembre, campaña del 13 al 27. Antes, el 2 de octubre, el Congreso rechazó los RDL 26 y 27/2026 con PP, Vox, Junts y UPN en contra, y PNV y CC también en el segundo ([elDiario.es](https://www.eldiario.es/politica/ultima-hora-decreto-vivienda-acampada-puerta-sol-directo_6_13555604.html)). Votos: 172-178 y 166-184, según [Wolo](https://www.wolorent.com/blog/congreso-rechaza-ambos-decretos-ley-vivienda-2026) y Fedea (V31); contrastar con el diario de sesiones si van a pantalla.
- **Sin programas todavía:** a 2 de noviembre ningún partido había publicado el completo, según [DobleLectura](https://doblelectura.es/guia/propuestas-vivienda-elecciones-generales-2026). **Esa guía se declara redactada por IA**, y [Política Electoral](https://www.politicaelectoral.com/es/espana/generales-2026/nacional/pp) y [DatosClaros](https://www.datosclaros.es/comparador-de-programas-29n/) son agregadores. Sirven para orientarse, **no para citar**. Cada propuesta usada en pantalla necesita su documento original, con fecha.
- **Para verificar en origen:**

| | Construir | Alquiler | Turísticos | Extranjeros | Público |
|---|---|---|---|---|---|
| **PP** | «Al menos un millón», 250.000 al año; IVA 4%; Ley del Suelo | Eliminar zonas tensionadas y topes | Nada localizado | Nada localizado | Suelo público, venta hasta 30% por debajo del mercado |
| **PSOE** | Plan Estatal 7.000 M€; ICO | RDL 28 y 29; 2% | IVA 10%, IBI (V31) | 100% a no UE no residentes (proposición de 2025) | 183.000 (2023); Casa 47 |
| **Vox** | Sin cifra; más suelo, altura y densidad; menos impuestos a construir | Derogar medidas «intervencionistas» | «Regulación» de la proliferación e inspección | «Fiscalidad diferenciada» a no comunitarios | «Inundar» de protegida, para «familias españolas», con colaboración público-privada |
| **Sumar / Frente Amplio** | Rehabilitación (2023) | Renovación automática; contratos indefinidos | Limitar turístico y de temporada | Nada localizado | 1% del PIB al año |

- Podemos: expropiar a fondos, bajar alquileres un 40%, y 2% de turísticos en zonas tensionadas. ERC: impuesto a la tercera vivienda y siguientes, 21% de IVA en turísticos.
- **Comprobado en origen o cerca, 6 de noviembre de 2026:**
  - **Vox [P]:** [Programa económico y de vivienda](https://www.voxespana.es/wp-content/uploads/2025/10/Programa-WEB-021025.pdf), PDF creado en septiembre de 2025, pp. 44-46: la fila de la tabla sale de ahí. **No es el programa del 29-N**; citarlo con su fecha y revisar si hay uno nuevo. Corrige nuestro «nada localizado» en turísticos. No da cifra de viviendas.
  - **PSOE [S]:** proposición registrada el 30 de mayo de 2025, «Impuesto Complementario Estatal» del 100% a no residentes en la UE, deducible lo pagado en ITP y AJD ([PwC](https://periscopiofiscalylegal.pwc.es/nuevo-impuesto-sobre-la-transmision-de-muebles-a-no-residentes-en-la-ue/amp/)). Falta el BOCG y su estado actual. Expertos dudan de su encaje: posible carácter confiscatorio y libre circulación de capitales ([El Independiente](https://www.elindependiente.com/economia/vivienda/2025/06/13/nuevo-impuesto-que-grava-inversiones-inmobiliarias-de-no-residentes-fuera-de-la-ue/)). **Las 183.000 siguen sin origen localizado.**
  - **PP [S]:** «Contrato con España» del 19 de octubre, doce compromisos. [Artículo14](https://www.articulo14.es/politica/feijoo-firma-su-contrato-con-espana-que-la-palabra-de-un-presidente-vuelva-a-tener-valor-20261019.html) solo recoge como punto 4 atender «el primer problema»: la vivienda, sin cifra. El millón aparece en [moncloa.com](https://www.moncloa.com/2026/10/19/feijoo-espana-3451414/) (privado) e [idealista](https://www.idealista.com/news/taxonomy/term/7853). **Sin el texto del PP no sabemos si el millón se refiere a iniciadas o terminadas, ni si es privada o pública.** Eso cambia la prueba de V33.
  - **Frente Amplio [S]:** [Brains RE News](https://brainsre.news/?p=316467) lo describe como Movimiento Sumar, IU, Más Madrid y Comuns, con Colau de candidata. El 1% del PIB y las 500.000 de alquiler social son de 2023 y 2024: **no presentarlos como propuesta de 2026.** Dice que no había programas publicados; re-comprobar.
- **Dos cruces:** PSOE y Vox coinciden en tratar distinto a compradores de fuera de la UE: **comprobado en los términos de arriba**, con instrumentos no equivalentes. Vox y Sumar en vivienda protegida o social a gran escala: lado de Vox comprobado, lado de Sumar solo con textos anteriores, y difieren en a quién va. **Justo lo que busca el episodio: las ideas no siguen las líneas de partido.**
- **Vox, también en esas páginas [P]:** «Derogación de todas las medidas intervencionistas en el mercado de alquileres» y «mano dura con la okupación y la inquiocupación», y afirma que eso hará aflorar la oferta de larga duración. Es una hipótesis comprobable para la que no tenemos datos. Da también un argumento: la vivienda es hoy el 1,12% del gasto público frente al 13% en los años sesenta (sin verificar).
- **Sin verificar, no usar:** Feijóo, «400.000 propietarios retiraron viviendas del alquiler» ([Diario Sabemos](https://diariosabemos.com/analisis/cronica/feijoo-vigo-verificacion-vivienda-impuestos-corrupcion-promesas_519536_102.html), sin confirmar ni desmentir). Buscar su origen; ver V29.
- **Verificado el 6 de noviembre de 2026:** PP [P, web]: «[construirá un millón de viviendas en la próxima legislatura](https://www.pp.es/actualidad/articulos/feijoo-anuncia-deducciones-para-alquileres-y-aprobara-en-sus-cien-dias-las-leyes-para-construir-un-millon-de-viviendas-y-desalojar-okupas/)» (21 de octubre) y [déficit de un millón](https://www.pp.es/actualidad/articulos/feijoo-se-marca-como-objetivo-cubrir-el-deficit-del-millon-de-casas-y-propone-mayor-financiacion-para-ccaa-y-ayuntamientos-que-trabajen-en-vivienda/) (12 de enero). La moción de febrero habla de condiciones que «permitan construir» ([Diario Estrategia](https://www.diarioestrategia.cl/texto-diario/mostrar/5774653/pp-presenta-esta-semana-congreso-plan-construir-millon-viviendas-cuatro-anos), leído) y esdiario de «promover». Una búsqueda atribuye «iniciar» a otras fuentes, no trazadas. El programa «Por lo importante: vivienda» consta en [Brains RE](https://brainsre.news/?p=316467), pero no hemos localizado el PDF. **Gobierno [S]:** la cifra varía entre 180.000, 183.000 y 184.000. [idealista, 2023](https://www.idealista.com/news/inmobiliario/vivienda/2023/05/24/806097-solo-el-37-de-las-184-000-viviendas-prometidas-por-sanchez-estan-en-alquiler-social): ~123.000 del mapa de Mitma + 50.000 de Sareb + ~11.000 del Fondo Social, 36,8% disponibles o en desarrollo, sin plazo. [idealista, 2025](https://www.idealista.com/news/node/862242): la ministra habla de unas 100.000 entregadas, sin base explicada. No comparable sin más con las 9.000 protegidas terminadas al año del Banco de España.

### V33 - La misma prueba de escala para cada frase [C]
Cálculos propios, para dar orden de magnitud. **No son previsiones.** Parten de V7, V8, V24, V26 y V30.
- **Un millón en cuatro años:** 250.000 al año son 2,7 veces las terminadas en 2025 (92.000) y 2,5 veces las de 2024 (100.980). Con ~240.000 hogares nuevos al año, sobrarían ~10.000 al año: **~40.000 en cuatro años frente a un déficit de 750.000**. La frase «casi no la cerraría» **solo vale a este ritmo de hogares**, y el ritmo es la variable decisiva:

| Hogares nuevos al año | Margen en 4 años con 250.000 al año | Del déficit de 750.000 | Referencia |
|---|---|---|---|
| 300.000 | −200.000 | crece | Hipótesis |
| 246.000 | +16.000 | 2% | Simulación del INE 2024-2039 (V5) |
| 240.000 | +40.000 | 5% | 2025 (V7) |
| 200.000 | +200.000 | 27% | Hipótesis |
| ~100.000 | +600.000 | 80% | Orden de magnitud de 2011-2020, deducido de V7 y V8 |
| 62.500 | +750.000 | 100% | Lo que haría falta |

  - **Prueba adversaria [6 de noviembre de 2026]: la cuenta aguanta, pero no la frase sin condición.** Decir: «al ritmo actual de hogares, frena la brecha, pero no la cierra»; y que si los hogares bajaran a los ritmos de la década pasada cerraría gran parte. Se dan solo en orden de magnitud.
  - **Los hogares no son independientes de la oferta.** Más vivienda también puede permitir que se emancipe más gente: parte del éxito aparecería como más hogares y la resta no se cerraría, aunque la gente viviera mejor. **Una resta que no se cierra no prueba que construir no funcione.**
  - **750.000 no son 750.000 familias sin casa.** Es un indicador de flujo (V7): esos hogares ya viven en algún sitio, en buena parte en vivienda que tenía otro uso. Cerrarlo por completo no tiene por qué ser el objetivo.
  - **El precedente existe.** Se terminaron más de 250.000 viviendas todos los años de 2003 a 2010, con máximo de 658.510 en 2006 (V8). Por tanto, no se puede decir que 250.000 sea imposible. Ese mismo periodo acabó en crisis y dio un excedente (+9,4% en 2001-2010, V7). No sabemos con qué capacidad se puede repetir: falta la mano de obra actual (Por investigar, 6).
  - **Precios [no causal]:** vivienda libre, 1.824 €/m² en 2005 y 2.086 en 2007, en pleno máximo de construcción; 1.463 en 2014; 1.972 en 2024, todo nominal (Observatorio, tabla 2.1). El crédito y la crisis pesan demasiado para atribuir nada a la construcción. **Solo enseña que construir mucho no garantizó por sí solo precios bajos en un auge de crédito.** No sustituye a la evidencia de V16.
  - **Falta saber si el millón son terminadas** (V32).
- **Todos los pisos turísticos de España, a vivienda habitual:** 341.001 es el 45% del déficit, unos 17 meses de hogares nuevos o ~2,3-2,5 años de brecha anual (135.000-150.000). Se usa una sola vez; la brecha se repite cada año. Es un techo: no todos pasarían a vivienda habitual, y están muy concentrados.
- **Donde aprieta:** Madrid provincia, 13.431 turísticas, y Barcelona provincia, 15.905. El BdE calcula 90.000-95.000 movilizadas en cada una en 2021-2025 (nota 35), unas 18.000-19.000 al año. **Todos sus pisos turísticos equivalen a ~9-10 meses de ese ritmo.** **Corregido el 6 de noviembre de 2026:** una versión anterior contaba cuatro años y decía ~7-8 meses; era un error nuestro. En cambio, en barrios y costa el peso es otro: 4,5-4,9% del parque provincial en Málaga y Las Palmas, y efectos de 7% en alquiler en los barrios más afectados de Barcelona (V27).
- **Peso en el mercado del alquiler, 2025 (BdE, gráfico 2.12, p. 161, comprobado sobre la imagen) [P]:** total de España 10,8%. Área urbana y centro de zona turística: Málaga 28,9 y 44,6; Sevilla 12,1 y 44,9; Las Palmas 12,9 y 26,9; Barcelona 4,0 y 22,2; Madrid 2,8 y 14,9; Palma 7,6 y 0,7. **El denominador excluye temporada, habitaciones y alquiler de sociedades, así que estas cuotas se pasan por arriba.** El BdE atribuye a las restricciones el bajo peso en el centro de Palma (nota 48) y dice que limitaciones regulatorias o el paso a temporada «podrían» explicar la caída nacional. Es la mejor cifra para el contraste entre país y barrio.
- **Parque público a la media:** ~1,1 millones (V30).
- **Revisadas el 6 de noviembre de 2026:** las cuentas de turísticos y parque público cuadran. Sus límites: 341.001 es un techo, y el dato provincial oculta la concentración en barrios, por lo que no debe usarse para un barrio.
- **Lectura:** todas las medidas tienen sentido a alguna escala, y ninguna cierra la cuenta nacional sola. **No concluir de esto que los turísticos «no importan»:** para un barrio concreto pueden ser lo que más importa.

### V34 - Impuesto a vacías: el mejor caso a favor localizado [S]
Vancouver (Empty Homes Tax, desde 2017). La ciudad informa de −36% de propiedades vacías desde la introducción ([CTV](https://bc.ctvnews.ca/vancouver-s-tripled-empty-homes-tax-brings-in-32m-leads-to-decline-in-vacant-property-mayor-1.5858832)) y de 0,49% de vacías en el año fiscal 2024 ([informe de 2025](https://vancouver.ca/files/cov/2025-empty-homes-tax-annual-report.pdf)). Dos cautelas: lo evalúa el propio municipio, que admite que aislar el efecto es difícil por otras medidas simultáneas; y el primer recuento halló 2.538, cerca de una décima parte de lo que estimaba ([BIV](https://biv.com/article/2018/12/empty-homes-are-fraction-city-vancouver-estimate-report)). Parece funcionar a escala de ciudad y con base pequeña, lo que apoya a ambos lados. Todo leído por buscador: leer los informes antes de usarlo. Sigue faltando una fuente española.
- **Verificado en origen el 6 de noviembre de 2026 [P]:** [nota de la ciudad](https://vancouver.ca/news-calendar/eht-drives-housing-vacancies-record-low-dec-2025.aspx): 0,90% en 2017 y 0,49% en 2024, 979 propiedades. **El −36% es solo 2017-2021** ([informe de 2022](https://vancouver.ca/files/cov/vancouver-2022-empty-homes-tax-annual-report.pdf)); el [de 2023](https://vancouver.ca/files/cov/2023-11-30-empty-homes-tax-annual-report.pdf) da −54% hasta 2022. Ambos dicen que aislar el efecto «is challenging». El de 2023 cita también el impuesto provincial (Speculation and Vacancy Tax) al hablar del alquiler. Las cifras se revisan con las auditorías: 2.538 no encaja con 0,90%, así que no calcular un porcentaje propio. Estos PDF se leyeron por extracción de texto parcial; el recuento de 2.538 sigue por BIV.

### V35 - Lo que cada lado echaría de menos: esfuerzo, suelo y desahucios [P salvo lo indicado]
- **Sobrecarga en el alquiler:** [Eurostat, ilc_lvho07c](https://ec.europa.eu/eurostat/databrowser/view/ilc_lvho07c/default/table), consultado por API el 6 de noviembre de 2026 (actualizado el 29 de octubre). Hogares que dedican más del 40% de sus ingresos a la vivienda. Inquilinos a precio de mercado, 2025: España 26,8; zona euro 18,0; Francia 18,7; Italia 22,3; Alemania 13,2. España: 30,6 en 2023, 28,1 en 2024. Todos los hogares, 2025: España 7,2; zona euro 7,9. Coincide con el Banco de España (Informe Anual 2025, PDF p. 151).
  - **Límites:** encuesta, y mide a quien ya alquila, no a quien no llega a hacerlo. La definición de Eurostat incluye suministros básicos. El Banco de España habla de renta bruta y Eurostat de ingresos disponibles según lo que recordamos de su definición: comprobar en los metadatos antes de precisar; el guion dice «ingresos». La bajada 2023-2025 no tiene causa asignada: no atribuirla a ninguna medida.
- **Suelo:** Banco de España, PDF p. 167: transformar suelo «puede durar más de una década», por la multiplicidad de trámites y niveles de aprobación. Lo atribuye a la consulta de la CNMC. **Leída esa consulta (11 páginas): no da esa cifra, solo pregunta por la duración (p. 9).** Por eso el guion atribuye al Banco de España. Su nota 53 da 10-15 años, y más de 20 en algunos ámbitos, según Colliers y APCE (2024), estudio del sector: no usar sin decirlo. La p. 177 cita la inseguridad jurídica entre las causas de demora. La CNMC dice que el suelo «podría representar hasta un 45%» del precio, sin fuente; su estudio sigue en curso.
- **Licencias [S]:** [EY y Asprima, 2020](https://www.ey.com/es_es/newsroom/2020/05/el-retraso-en-la-concesion-de-licencias-de-obra-nueva-tiene-un-sobrecoste-medio-para-el-comprador-de-casi-13-000-euros-por-vivienda): unos 12 meses de media frente a un plazo legal de 3. Antiguo, de una patronal, y anterior a reformas en Madrid y Cataluña. No usado.
- **Desahucios:** [CGPJ, datos de 2025](https://www.poderjudicial.es/cgpj/es/Poder-Judicial/En-Portada/Las-ejecuciones-hipotecarias-y-los-concursos-registrados-en-los-organos-judiciales-crecieron-en-2025-un-30---respecto-al-ano-anterior). Lanzamientos de la LAU: 18.317 (71,7%); por impago de alquiler, −10,9%. **La nota se contradice en el total:** 24.540 en un párrafo y 25.540 en otro; las partes suman 24.540 y los porcentajes encajan con 25.540. No citar el total. Cuarto trimestre de 2025, datos que el CGPJ llama orientativos: 2.732 peticiones de suspensión por vulnerabilidad, 2.559 resueltas, 472 suspensiones [C]. **Ninguna duración media oficial localizada;** las que circulan son de empresas del sector. Los lanzamientos cuentan desalojos, no impagos ni okupación: no prueban ni desmienten el argumento de Vox.
- **El Banco de España equilibra ambos lados:** los controles son eficaces a corto plazo para los contratos vigentes, con riesgos no deseados (p. 185), y la protección a inquilinos puede reducir oferta si las administraciones no cubren riesgos de los propietarios (p. 183).

## Por investigar
**Regla desde el 6 de noviembre:** nada de esta lista bloquea el guion por depender de una respuesta institucional. Lo que no se resuelva se cuenta como incertidumbre o se saca (ver decisiones, punto 5).

1. **Comprobaciones que podemos hacer solos:** tablas de 2025 de la EUV vasca, si son públicas; serie de la partida 155 de la AEAT; tablas oficiales 2024-2025 del Ministerio, solo disponibles por prensa. Preguntar al Ministerio, BdE, Gobierno Vasco, INE o CNMC es opcional y no se espera respuesta.
2. Una fuente que defienda con rigor la movilización de vacías: sindicatos de inquilinas, PAH, Observatori DESC, Ivàlua. V23 discute el déficit, pero no aporta evidencia sobre movilización; V10 y V11 siguen pesando del mismo lado. Una búsqueda el 4 de noviembre no encontró un informe adecuado.
3. Terminadas 2025 en el Ministerio. Serie larga 2003-2024 y precios ya leídos en el Boletín del Observatorio (V33); falta 2000-2002 si se quiere mostrar. Leer el artículo completo de V23.
4. Censo de viviendas 2025: fecha de publicación. Es la comprobación directa de V21.
5. STC sobre el decreto andaluz; censos directos de vacías en otras ciudades; estado físico de las vacías.
6. Capacidad de construir: mano de obra, plazos reales de licencias (nada localizado todavía).
7. Tiempos de desplazamiento y fiabilidad de Cercanías y Rodalies; ocupaciones teletrabajables.
8. Tasa «sana» de vacías friccionales en otros países, con definiciones comparables.
9. Ingresos: ¿a qué precio se vende y alquila lo nuevo, y quién puede pagarlo?

### V36 - Las cuatro preguntas en topes, compra extranjera y vivienda pública [P salvo lo indicado]
**Topes**
- **Segundo estudio del tope de 2020 [P, manuscrito aceptado]:** [Jofre-Monseny, Martínez-Mazza y Segú](https://discovery.ucl.ac.uk/id/eprint/10181899/1/Martinez_final_manuscript_postprint_UB.pdf), *Regional Science and Urban Economics*, 2023. Fianzas de INCASOL, 2016-2022; compara con municipios no regulados que también tenían mercado tenso. Alquileres 4%-6% menores. Sin evidencia de caída en contratos firmados, contratos terminados ni parque activo. Financiado por el Ministerio de Ciencia. Los autores avisan de que la corta vida del tope impide medir efectos a largo plazo. **No conocemos la causa de la diferencia con Monràs y Montalvo (V29), que atribuyen a la oferta una caída de ~10% y defienden que los contratos nuevos la aproximan bien.** Falta leer las tablas de ambos.
- **Dónde [S]:** [Taxdown](https://taxdown.es/propietario/zonas-tensionadas), a 30 de septiembre de 2026: 317 municipios (Cataluña 271, Navarra 21, País Vasco 18, Asturias 5, Galicia 2), con siete cubiertos solo en parte; ninguno en la Comunidad de Madrid. Empresa privada que cita nueve resoluciones del BOE. Asturias y Santiago se confirman en [BOE-A-2026-16532](https://www.boe.es/boe/dias/2026/07/29/pdfs/BOE-A-2026-16532.pdf) [P]; la suma total no la hemos rehecho. El Banco de España (PDF p. 152) cita cuatro comunidades, sin Asturias, que llega después. Población cubierta: no encontrada.
- **Duración [P]:** [Ley 12/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203), art. 18: tres años, prorrogables cada año. Las primeras de Cataluña vencen en marzo de 2027, y la Generalitat tramita prorrogar 118 municipios y retirar 22, según Taxdown [S].
- **Para quién [P]:** Banco de España, Informe Anual 2025, PDF p. 141: 20,2% de hogares en alquiler en 2025. P. 185: controles eficaces sobre todo a corto plazo para quien ya tiene contrato; si se mantienen, riesgo de menos oferta nueva y paso a turístico, temporada o venta. Sus notas 92-93 citan ambos lados.

**Compra extranjera**
- **Banco de España [P], PDF pp. 159-162:** cuantía agregada «modesta», concentrada en costa e islas. Cuota en 2025 (cuadro 2.8): Alicante 33,3%, Málaga 27,9%, Baleares 23,0%, Santa Cruz de Tenerife 20,3%, Las Palmas 14,9%, Girona 14,7%, Castellón 5,6%, España 7,4%. Provincias de Madrid 1,6% y Barcelona 2,2%. **El texto da el 7,4% como media de 2021-2025 y el cuadro como cuota de 2025: el guion dice «cerca del 7%».** Nota 47: las ventas de no residentes son el 6,8% del total en 2025 (Notariado). **El saldo es cuenta nuestra [C] entre fuentes distintas: por eso no decimos una cifra.** Parque de no residentes más turísticas: ~900.000, un 3,3%; 14% en Alicante y Málaga.
- **Fuera de la UE [S]:** 18.800 en 2024, 2,7% de las compraventas y ~13,5% de las compras de extranjeros, según notarios citados por [idealista](https://www.idealista.com/news/boletines/web/851048) y [Spanish Property Insight](https://www.spanishpropertyinsight.com/reports/non-resident-buyers-from-outside-the-eu). Ambos con interés en el sector. Falta 2025.
- **Evidencia exterior, sin usar:** la nota 88 del Banco de España (PDF p. 184) resume a Francke et al. (2023) como límites a extranjeros en Países Bajos. **Creemos que ese trabajo trata de inversores que compran para alquilar, no de extranjeros. Es de memoria, sin comprobar: no usar sin leerlo.**
- **Estado de la proposición del PSOE:** sin confirmar. Las fuentes llegan a 2025 y no hemos visto el BOCG. El guion solo dice «proposición de 2025».

**Vivienda pública [P, Banco de España, PDF pp. 177-179 salvo cuentas]**
- Terminadas: 11.000 en 2025, 9.000 al año en 2015-2024, 62.000 al año en los noventa, 56.000 en los dos mil. Iniciadas en 2025: 15.500. En 2025, 37,4% de alquiler protegido y 49% de venta a precio limitado.
- **[C]:** 1,1 millones entre 11.000 son 100 años; entre 62.000, unos 18. No equivale a un pronóstico: las protegidas no son todas públicas, ni las de los noventa siguen protegidas.
- Dinero: Plan Estatal 2026-2030, 7.000 millones; MRR, 1.200 millones para ~20.000 viviendas; ICO, 4.000 millones en préstamos y 2.000 en avales. El Banco de España dice que los esfuerzos tardarán en materializarse y son pequeños frente a las necesidades.
- Suelo: Casa 47 recibe de la Sareb 40.000 viviendas y 2.400 parcelas, con potencial de 55.000. Reparto geográfico: no leído.
- Para quién: inquilinos de Casa 47 con ingresos de 2 a 7,5 veces el IPREM; renta hasta el 30% del ingreso medio.
- **Verificado el 6 de noviembre de 2026 [P]:** suma de las nueve resoluciones del BOE hasta el segundo trimestre de 2026: Cataluña 271, Navarra 21, País Vasco 18, Asturias 5, Galicia 2 = **317**. Ninguna de la Comunidad de Madrid. Son parciales Gijón, Avilés, Gozón, Llanes, Cabrales, Galdakao y Vitoria-Gasteiz. No localizada la resolución del tercer trimestre de 2026. **Notariado [S]:** 52.781 no residentes en 2025 se repite en prensa. 18.800 fuera de la UE y ~39.500 de la UE sin periodo claro más allá de 2024. Las 8.213 de [Forbes](https://forbes.es/economia/902610/la-compraventa-de-vivienda-por-extranjeros-se-redujo-un-44-en-el-segundo-semestre-hasta-66-629-operaciones/) son «resto de extracomunitarios», residentes incluidos, en un semestre: no es el mismo dato.


### V37 - Promesas de vivienda frente a lo entregado, Gobierno del PSOE [S]

Añadido el 10 de noviembre de 2026 para el guion v3. No hay un recuento oficial de viviendas prometidas y entregadas (Maldita, 30 de abril de 2026).

- **Promesa de 2023:** unas 184.000 viviendas asequibles, sumando ~123.000 del Ministerio, ~50.000 de la Sareb y ~11.000 del Fondo Social (idealista, 2023; también citadas como 180.000 y 183.000). Sin documento oficial localizado (V32).
- **Lo entregado, según la ministra:** unas 100.000 (idealista, 2025). No hemos encontrado cómo se cuentan.
- **Recuento de prensa:** unas 49.000 protegidas entregadas desde 2021, frente a ~276.000 anunciadas (El Español, abril de 2026, cuenta propia del medio).
- **Casa 47:** 1.249 viviendas, el 9,6% de las 13.000 previstas para 2026 (El Español, 9 de noviembre de 2026).
- **Protegidas terminadas en 2025:** 11.000 en toda España (Banco de España, V7).
- **PP:** no gobierna España desde junio de 2018, así que su promesa (V32) no tiene un historial nacional con el que compararla. El guion la prueba contra la capacidad del país (V8, V33).

## Añadidos para el guion v6 (10 de noviembre de 2026)

### V38 - Densidad urbana: síntesis de estudios [P, documento de trabajo]

Ahlfeldt y Pietrostefani, «The economic effects of density: A synthesis», CEPR DP13440; publicado en *Journal of Urban Economics* (2019). [LSE Research Online](https://researchonline.lse.ac.uk/id/eprint/100004).

- Reúne 347 estimaciones de 180 estudios sobre 15 tipos de efecto.
- **A favor de la densidad:** salarios más altos (elasticidad 0,04), más patentes, menos uso del coche, servicios públicos más baratos.
- **En contra:** alquileres más altos (0,15), costes de construcción más altos (0,55), mayor concentración de contaminación (0,13), algo menos de bienestar declarado.
- **Delincuencia:** en conjunto, menos delitos por habitante con más densidad (0,085). Pero los autores advierten: «crime rates increase in density for US cities, whereas the opposite is true for other OECD countries».
- **Límite:** la parte de delincuencia son 13 estimaciones. Son asociaciones entre ciudades distintas, no el efecto de densificar un barrio concreto. Según los propios autores, los estudios más citados o más rigurosos hallan efectos menos positivos. Ninguna estimación es española: no decir «en España».

### V39 - Banco de España, «El teletrabajo en España» [P]

Anghel, Cozzolino y Lacuesta, *Boletín Económico* 2/2020. [RePEc](https://ideas.repec.org/a/bde/joures/y2020i06daan13.html).

- El 30% de los ocupados podría teletrabajar, al menos ocasionalmente. En 2019 lo hacía el 8,3%.
- **[C]** Con V17: 7,9% + 7,7% = 15,6% en 2025 («cerca del 16%»).
- **Límite:** el 30% es un potencial estimado por ocupaciones, con datos de 2019. No dice cuántos se mudarían ni adónde. Ninguna fuente española mide el efecto del teletrabajo sobre el déficit de vivienda (V18 es de Estados Unidos y de un portal).

### V40 - Autovías, tren y reparto de la población [P, solo resúmenes]

- García-López, Holl y Viladecans-Marsal, «Suburbanization and highways: when the Romans, the Bourbons and the first cars still shape Spanish cities», IEB Working Paper 2013/05 ([UB](https://diposit.ub.edu/dspace/handle/2445/115869)). Cada autovía radial construida entre 1991 y 2006 redujo un 5% la población de la ciudad central entre 1991 y 2011. Los municipios de alrededor con mejor acceso crecieron un 4,6% más (7,1% a 5-11 km).
- Garcia-López, Pasidis y Viladecans-Marsal, IEB Working Paper 2015/30 ([RePEc](https://econpapers.repec.org/RePEc:ieb:wpaper:doc2015-30)). Ciudades europeas: una autovía radial más desplaza cerca del 4% de la población central en diez años. Para el ferrocarril, «no significant effect» de media; sí hay efecto en el centro y norte de Europa.
- **Límite:** miden dónde vive la gente, no precios ni déficit. Leídos solo los resúmenes. El estudio español es de autovías, no de tren: el guion no puede decir que el tren reparta población en España. Sigue valiendo el límite de V19: ninguna fuente evalúa Cercanías o Rodalies como política de vivienda.
