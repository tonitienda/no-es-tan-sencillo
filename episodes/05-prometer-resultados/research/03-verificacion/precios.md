# Verificación de fuentes: precios y termómetro (F5, F12, F13, F2, F3, F1)

**Fecha:** 26 de noviembre de 2026 (primera y segunda pasada).

**Cómo se ha hecho y qué limita el resultado:**
- **Primera pasada.** WebFetch no funcionó. Los hosts www.boe.es, www.cnmc.es y arxiv.org no resolvieron en esa sesión: estaban fuera de la red permitida. No se pudo abrir **ninguna** fuente primaria. Todo salió de los resúmenes y fragmentos que devuelve el buscador (WebSearch). Por eso **todas las entradas estaban en [S]**, aunque las URL apunten al documento original.
- **Segunda pasada (26/11).** Con la red ampliada se han descargado y leído (pdftotext) los originales accesibles: BOE (RDL 10/2022, RDL 3/2023 y Orden TED/517/2022), la decisión de la Comisión C(2022) 3942, tres informes de supervisión de la CNMC, el recuadro 4 del Boletín Económico 2/2022 del Banco de España, Robinson y otros (arXiv 2309.02608, v1 y v2), Blinder y Newton (NBER w0279, que es el artículo del *JME*) y dos documentos de trabajo del NBER de Cavallo. Las citas marcadas como literales están copiadas del original, con página.
- **Hosts bloqueados en la segunda pasada** (el proxy rechaza la conexión): imf.org, dspace.mit.edu, iwh-halle.de, cepr.org, jbs.cam.ac.uk, eprg.group.cam.ac.uk, oxfordenergy.org, esade.edu, energypolicy.columbia.edu, iit.comillas.edu, sciencedirect.com, documentos.fedea.net, app.bde.es, api.bls.gov, data.nber.org, newadvent.org, ccel.org, wikisource, thelatinlibrary.com, archive.org, bkv.unifr.ch y uni-hamburg.de. **www.bls.gov** devuelve «Access Denied» desde su propio servidor (no es el proxy). Lo que depende de esos hosts sigue en [S].
- **El presupuesto de búsquedas se agotó** en la primera pasada antes de terminar F1, y F3 quedó a medias. En la segunda pasada siguen pendientes por los bloqueos de arriba.
- Estados: **confirmado** (varias fuentes coinciden o se ha leído el original), **corregido** (la versión anterior estaba mal o incompleta) y **no encontrado**. Las etiquetas [P]/[S] van por entrada o, cuando una entrada mezcla ambas cosas, por punto.

---

### F5 - Excepción ibérica (RDL 10/2022 y RDL 3/2023) [P] (salvo los puntos marcados [S])
URL (BOE, RDL 10/2022): https://www.boe.es/boe/dias/2022/05/14/pdfs/BOE-A-2022-7843.pdf
URL (BOE, RDL 3/2023): https://www.boe.es/boe/dias/2023/03/29/pdfs/BOE-A-2023-7937.pdf
URL (BOE, Orden TED/517/2022, fecha de inicio): https://www.boe.es/boe/dias/2022/06/09/pdfs/BOE-A-2022-9435.pdf
URL (Comisión Europea, ayuda de Estado SA.102454): https://ec.europa.eu/competition/state_aid/cases1/202225/SA_102454_40776681-0000-C327-A344-3EC9A772C4AF_72_1.pdf
URL (CNMC, informe minorista 2022 y avance 2023, IS/DE/027/23, 25/04/2024): https://www.cnmc.es/sites/default/files/5337600.pdf
URL (CNMC, informe mayorista 2022, IS/DE/013/23, 22/02/2024): https://www.cnmc.es/sites/default/files/5177925.pdf
URL (CNMC, informe mayorista 2023, IS/DE/013/24, 28/01/2025): https://www.cnmc.es/sites/default/files/5779264.pdf

**Base legal y calendario** [P]
- **Confirmado.** El Real Decreto-ley 10/2022, de 13 de mayo, se publicó en el BOE el 14 de mayo de 2022 (BOE-A-2022-7843) y entró en vigor el día siguiente (disposición final undécima, BOE pág. 67178). El mecanismo quedaba supeditado a la autorización de la Comisión Europea, que la dio el 8 de junio de 2022 (decisión C(2022) 3942, expedientes SA.102454 para España y SA.102569 para Portugal; p. 1 de la decisión).
  - **Segunda pasada (26/11):** confirmado en el original. Art. 1.2 (BOE pág. 67154): «resultará de aplicación durante 12 meses contados a partir de la fecha que se determine en la Orden […]. En ningún caso el mecanismo de ajuste regulado en este real decreto-ley resultará de aplicación más allá del 31 de mayo de 2023».
- **Confirmado (la discrepancia de un día queda resuelta).** Se aplicó desde mediados de junio de 2022.
  - **Segunda pasada (26/11): resuelto.** Las dos fechas son correctas y miden cosas distintas. Orden TED/517/2022, apartado primero (BOE de 9 de junio de 2022, pág. 78752): «se fija como fecha de inicio del mecanismo de ajuste el 14 de junio de 2022. En dicha fecha, los agentes internalizarán la cuantía unitaria del ajuste […] para la casación del mercado diario realizada para el día siguiente, 15 de junio de 2022». Es decir, el 14 es la sesión de casación y el 15 el primer día de entrega. (La propia CNMC usa las tres fechas: «14 de junio» en IS/DE/013/23, p. 6; «15 de junio» en IS/DE/027/23, p. 55; y «16 de junio» en la nota de un gráfico de IS/DE/013/23, p. 40. Para el guion: «desde el 15 de junio de 2022».)
- **Corregido (la senda de 40 a 70 €/MWh no llegó a aplicarse entera).** La senda original del gas de referencia era de 40 €/MWh durante seis meses y luego +5 €/MWh al mes.
  - El preámbulo del RDL 10/2022 (BOE pág. 67149) dice: «comenzando por un valor de 40 €/MWh durante los seis primeros meses e incrementándose en escalones mensuales sucesivos de 5 €/MWh hasta alcanzar un valor de 70 €/MWh en el último mes».
  - El art. 3.1 (BOE págs. 67155-67156) dice que el precio «tomará inicialmente el valor de 40 €/MWh. Una vez transcurridos seis meses desde el inicio de aplicación de la medida, a partir del primer día del siguiente mes natural el precio de referencia del gas natural se incrementará mensualmente en 5 €/MWh».
  - **Segunda pasada (26/11): corregido.** Como el mecanismo empezó a mediados de junio, el tope fue de 40 €/MWh hasta diciembre de 2022, luego 45 (enero), 50 (febrero) y 55 €/MWh (marzo de 2023) (tabla del RDL 3/2023, BOE pág. 45680). Con la senda original, el último mes (mayo de 2023) habría sido de **65 €/MWh, no de 70**. Lo dicen el preámbulo del RDL 3/2023 (BOE pág. 45673: «finalizando con el mismo nivel de precio del gas natural que se hubiese alcanzado en mayo», es decir, 65) y el Banco de España (recuadro 4, p. 25: «will then be increased by €5/MWh each month in the following five months until it reaches €65/MWh in May 2023»).
  - El «tope medio de 48,8 €/MWh» de la Comisión es **48,75 €/MWh**, la media de una senda estilizada de 12 meses (40×6, 45, 50, 55, 60, 65 y 70) que aparece en el anexo 1 de la decisión (p. 47, columna «Monthly average»). Es una hipótesis de las autoridades, no la senda aplicada.
- **Confirmado.** El RDL 3/2023, de 28 de marzo, prorrogó el mecanismo hasta el **31 de diciembre de 2023** (nueva redacción del art. 1.2, BOE pág. 45679).
  - **Segunda pasada (26/11):** confirmado en el original. Fija la senda mensual 56,1 (abril), 57,2, 58,3, 59,4, 60,6, 61,7, 62,8, 63,9 y 65 €/MWh (diciembre) (tabla, BOE pág. 45680). Preámbulo (pág. 45673): «se ha acordado una senda lineal desde los 55 €/MWh de marzo hasta los 65 €/MWh en diciembre de 2023».
  - [S] Que el Gobierno anunciara en diciembre de 2023 que no habría nueva prórroga (Teresa Ribera dijo que la Comisión lo consideraba inviable) sigue sin verificar en una fuente primaria.
- **Corregido (importante para el guion).** «Junio de 2022 a diciembre de 2023» es la **vigencia legal**, no el tiempo en que el mecanismo actuó.
  - **Segunda pasada (26/11): confirmado en la CNMC [P].**
    - IS/DE/027/23, p. 11: «el 26 de febrero de 2023 fue el último día que se aplicó el mecanismo de ajuste dado el importante descenso de precios del gas».
    - IS/DE/027/23, p. 57: «A partir de marzo de 2023 la bajada del precio del gas en los mercados mayoristas sitúa su coste por debajo del precio de referencia del mecanismo de ajuste, por lo que no se aplica ninguna compensación por este motivo, aunque el mecanismo siguió vigente hasta finales de 2023».
    - IS/DE/013/24, p. 9: «fue prorrogado hasta el 31 de diciembre de 2023 […] si bien dejó de aplicarse en febrero de 2023».
  - **El mecanismo pagó compensaciones del 15 de junio de 2022 al 26 de febrero de 2023: algo más de ocho meses, no dieciocho.**

**Cómo funcionaba y quién pagaba** [P]
- **Confirmado.** Las centrales de gas recibían una compensación diaria. Art. 3.1 (BOE pág. 67155): Yi = (PGN − PRGN) / 0,55, donde PGN es el precio MIBGAS y PRGN el precio de referencia, y la cuantía «será nula» si PGN es inferior a PRGN. Art. 2.1: se aplica a los ciclos combinados, al carbón y a cierta cogeneración. Según la Comisión (considerando 37, p. 13), el 0,55 «reflects the assumed average efficiency (55 %) of gas-fired power plants».
- **Corregido / matizado.** «Financiado por los consumidores del mercado mayorista» es incompleto.
  - **Segunda pasada (26/11): confirmado en el original.** Comisión, considerando 44 (p. 16): «The total cost of the measure […] shall be financed in part by contributions imposed and levied by OMIE and the respective TSOs on the buyers of electricity in the Iberian wholesale electricity market, in proportion to the amount of electricity purchased by them for that period, and in part by congestion income». Las dos fuentes son:
    1. **Rentas de congestión con Francia.** Art. 14.1 del RDL 10/2022 (BOE pág. 67165): «el valor adicional de las rentas de congestión netas obtenidas en las subastas mensuales de asignación de capacidad en la interconexión con Francia será empleado para minorar el coste total del ajuste». Son «rentas adicionales» el exceso sobre el mismo mes del año anterior. El RDL 3/2023 cambió esta referencia al último año sin mecanismo (BOE pág. 45681).
    2. **Un cargo a los compradores.** Art. 7.4 (BOE pág. 67157): el coste se distribuye «entre todas las unidades de adquisición de los agentes del mercado ibérico de la energía eléctrica, en proporción a la energía programada». Quedan exentos el almacenamiento y los servicios auxiliares (art. 7.7) y la energía con coberturas a plazo «firmados con anterioridad al 26 de abril de 2022» (art. 8.1, pág. 67159). Las «renovaciones, revisiones de precio o prórrogas» posteriores a esa fecha no dan exención. El art. 8.6 (pág. 67161) extiende la exención a los contratos con consumidores finales a «precio fijo con anterioridad al 26 de abril de 2022 en tanto no se renueven ni se prorroguen ni sus precios se vean modificados».
  - Según la Comisión (considerando 46, nota 46, p. 17), esa fecha es «the day in which political consensus on the main elements of the measure was reached and made public».
  - Según la Comisión (considerando 47, p. 17), el cargo se cobraría el primer mes sobre algo más del 41% del consumo español y el 30% del portugués, y subiría al 100% y al 76% al final de la medida, a medida que se renovaran los contratos.
  - Matiz de la CNMC (IS/DE/027/23, p. 57): la supervisión «ha permitido reducir la energía exenta declarada inicialmente» y llevó a regularizar facturas mal emitidas.
- **La cifra de 8.400 millones es un presupuesto estimado ex ante, no el coste efectivo.**
  - **Segunda pasada (26/11): confirmado [P].** Comisión, considerando 27 (p. 11): «The estimated budget of the measure is EUR 8.4 billion for Spain and Portugal combined (EUR 6.3 billion for Spain and EUR 2.1 billion for Portugal)». Añade que el presupuesto «may vary depending on, in particular, the actual gas price». También dice que la medida «is not financed from the budget of either the Spanish State or the Portuguese State» (considerando 72, p. 23).
  - La previsión de que el ahorro superaría al cargo es de los Gobiernos, no una conclusión de la Comisión. Considerando 50 (p. 18): «Spain and Portugal maintain that […] the achieved reduction in wholesale prices is expected to be higher than the respective contribution».
- **Coste efectivo en euros: sigue sin encontrarse.** Los tres informes de la CNMC leídos no dan un total en millones de euros. Sí dan el coste unitario para la demanda:
  - «en promedio anual representó 26,55 €/MWh, a pesar de haberse aplicado sólo a partir del 14 de junio de 2022» (IS/DE/013/23, p. 38). El informe de 2023 dice 26,52 €/MWh para 2022 (pequeña discrepancia entre los dos informes).
  - «se redujo el coste medio para la demanda de este mecanismo hasta los 0,20 €/MWh en 2023» (IS/DE/013/24, p. 37).
  - Para el PVPC, «este supuso 85 €/MWh» durante el periodo de aplicación (IS/DE/027/23, nota 27, p. 28).
  - El total habría que sacarlo de las liquidaciones de OMIE (omie.es está bloqueado). La cifra de MDPI («unos 8.350 millones») sigue sin confirmar: no usarla.

**Ahorro según el Gobierno (son estimaciones del propio Gobierno, no evaluaciones independientes)** [S], salvo donde se indica
- MITECO, 1 de julio de 2022: «casi 250 millones de euros» en los primeros 15 días.
- Agosto de 2022 (fuentes del ministerio citadas por Europa Press): unos 2.012 millones.
- La Moncloa, 18 de enero de 2023: casi 4.600 millones hasta el 8 de enero de 2023.
- MITECO, marzo de 2023: 4.970 millones y, en otra nota, 5.106 millones de ahorro en el mercado mayorista hasta el 28 de febrero de 2023. En diciembre de 2023, la secretaria de Estado Sara Aagesen habló de 5.100 millones en la factura.
- El Gobierno anunció un efecto de entre el 15% y el 20% en la factura de las familias.
  - **Segunda pasada (26/11): confirmado como previsión ex ante [P].** Comisión, considerando 50 (p. 18): «Spain expects that household consumers on the PVPC tariff […] will benefit from an average reduction in electricity prices of approximately 15 %; for unhedged industrial consumers the reduction is estimated to be around 18 to 20 %».
  - Lo del «en torno a un 30%» sigue sin confirmar.
- **Cuidado:** algunas notas de diciembre de 2023 repiten los «250 millones» como si fueran el total. Es la cifra de los primeros 15 días.
- **El método del Gobierno compara el precio real con un precio estimado sin mecanismo, suponiendo que la demanda y las exportaciones no cambian.** Ese es el punto que critican los estudios independientes.
  - **Segunda pasada (26/11):** Robinson y otros (arXiv v2, p. 2) dicen que no han encontrado «no official public document outlining the methodological basis for the Ministry's calculation».

**Evaluaciones independientes (de más favorable a más crítica)**
- **[Nuevo, P] CNMC, informe de supervisión de los mercados minoristas 2022 (IS/DE/027/23), pp. 56-57.**
  - **Contraevidencia a la hipótesis del episodio: hay que mostrarla.** Para el PVPC, la CNMC estima el ahorro «de manera aproximada en el entorno del 18% en el coste de la energía desde la puesta en marcha del mecanismo hasta el 31 de diciembre de 2022».
  - Advierte que es un cálculo «simplificado»: el precio sin mecanismo es «precios del mercado diario + compensación de las instalaciones de gas», sin ajuste de la demanda, y no tiene en cuenta que las rentas de congestión «habrían redundado en un ahorro para el consumidor, de no haberse puesto en marcha este mecanismo» (nota 55, p. 57). Cubre solo el componente de energía y nada del mercado libre («es difícil estimar el ahorro para el mercado libre»).
  - **Corrige a la primera pasada,** que decía que la CNMC no tenía cifra propia. Sí la tiene, pero con el mismo tipo de contrafactual que se critica al Gobierno.
- **Ruiz, Schult y Wunder (IWH Halle, documento de trabajo, febrero de 2024), control sintético.** [S] (iwh-halle.de bloqueado)
  - URL: https://www.iwh-halle.de/en/publications/detail/the-effects-of-the-iberian-exception-mechanism-on-wholesale-electricity-prices-and-consumer-inflation-a-synthetic-controls-approach
  - Reducción media de alrededor del 40% del precio spot entre julio de 2022 y junio de 2023, en España y en Portugal. Otra fuente secundaria da 43%, unos 65 €/MWh: comprobar cuál es la versión final.
  - En España, la inflación general bajó 3,7 puntos de media; un resumen posterior del IWH dice 3,5 puntos. La inflación energética bajó unos 22 puntos.
  - **En Portugal no se detecta efecto en la inflación general** (efecto con seis meses de retraso y solo en la inflación energética).
  - *Nota propia:* la ventana del estudio incluye cuatro meses (de marzo a junio de 2023) en los que el mecanismo no pagó compensación (la CNMC lo confirma [P], véase arriba). Preguntar a los autores o leer cómo lo tratan.
- **EsadeEcPol, Insight 42 (enero o febrero de 2023), Hidalgo-Pérez, Collado, Galindo y Mateo.** [S] (esade.edu bloqueado)
  - URL: https://www.esade.edu/ecpol/wp-content/uploads/2023/02/AAFF_ENG_EsadeEcPol_Insight42_The-Effects-of-the-Gas-Cap-on-Prices-1.pdf
  - Tras seis meses, el PVPC era un 32% más barato que sin la excepción: «32% cheaper than they would be without the "Iberian exception"». Ahorro de unos 209 € por hogar en 2022.
  - Versión publicada: *Energy Policy* 188 (2024), 114092, doi 10.1016/j.enpol.2024.114092. El documento de trabajo dice que las exportaciones a Francia subieron más de un 80%. **No he confirmado la cifra principal de la versión publicada.**
  - Robinson y otros (v2, nota 27, p. 20) critican que Hidalgo y otros (2022) «study the effect on only a limited part of the market, and they do not incorporate demand elasticity».
- **Banco de España, Recuadro 4 del Boletín Económico 2/2022 (Matías Pacce e Isabel Sánchez, junio de 2022).** [P]
  - URL: https://www.bde.es/f/webbde/SES/Secciones/Publicaciones/InformesBoletinesRevistas/BoletinEconomico/22/T2/Files/be2202-it-Box4.pdf
  - Es una estimación **ex ante**.
  - **Segunda pasada (26/11): corregido.** El escenario **central** es −0,5 puntos, no −0,7. En la p. 26: «the mechanism would subtract approximately 0.5 pp from the average inflation rate for 2022».
    - −0,7 es la sensibilidad con gas según futuros TTF: «Under this assumption, the impact of the mechanism on average inflation would be -0.7 pp in 2022».
    - −0,6 es el escenario con más rentas de congestión.
    - −0,4 sale en las dos sensibilidades desfavorables (más generación afectada o solo el 35% de la demanda pagando el cargo).
    - Escenario central (p. 26): el precio mayorista bajaría «by around 30% on average over the next 11 and a half months» y la tarifa regulada «would decrease by 17%». Para 2023 prevé un efecto «slightly positive (of around 0.1 pp)».
  - [S] Lo del Boletín 3/2022 (revisión a −0,6) y lo de septiembre de 2022 («algo más de 2 puntos», la mitad por el tope) siguen sin comprobar: el boletín de septiembre redirige a app.bde.es, que está bloqueado.
- **[Nuevo, P parcial] Fedea, Diego Rodríguez, «La entrada en funcionamiento del límite al precio del gas: una nota», Apuntes Fedea 2022/15 (junio de 2022).**
  - URL: https://fedea.net/la-entrada-en-funcionamiento-del-limite-al-precio-del-gas/ (el PDF, en documentos.fedea.net, está bloqueado; he leído la página de presentación de Fedea, del 16 de junio de 2022).
  - **Corrige a la primera pasada:** Fedea **sí** publicó un análisis, aunque solo del primer día. Según la página de Fedea, el efecto inmediato «fue positivo pero modesto, generando una caída del precio efectivo para los compradores en el mercado spot de un 5,6%», en parte porque el reparto del coste deja fuera a muchos compradores y porque la mayor demanda, incluida la extranjera, «ha obligado a activar algunas centrales menos eficientes».
  - Si se suma el cargo de 59,27 €/MWh al precio del primer día, el precio efectivo fue de 224,86 €/MWh, «10,81 euros por encima del precio anterior», en una comparación ingenua que no tiene contrafactual.
  - Describe la medida como «la subvención al gas utilizado en la producción de electricidad» más que como un tope.
- **Fabra, Leblanc y Souza (2025), CEPR DP20593 / CESifo WP 12093, y columna de VoxEU «Winners and losers from the energy crisis».** [S] (cepr.org y cesifo.org bloqueados)
  - URL: https://cepr.org/voxeu/columns/winners-and-losers-energy-crisis-policy-lessons-iberian-electricity-market
  - Solo hogares españoles. La crisis subió la factura de los hogares en unos 338 € al año; sin medidas habrían sido unos 487 €. El alivio medio fue de unos 149 € por hogar, en torno al 30% de la carga, y la intervención ibérica explica casi el 59% del aumento evitado (el resto, medidas de ahorro energético). El alivio fue progresivo.
  - El beneficio de las generadoras subió en unos 29.000 millones durante la crisis.
  - Describen la medida con «little impact on public funds». Es coherente con la Comisión (considerando 72, p. 23 [P]): no se financia con presupuesto público, aunque la Comisión sí la considera ayuda de Estado.
  - **No he podido confirmar** la cifra de «unos 13.000 millones de ahorro» atribuida a Fabra en un resumen del buscador.
- **Robinson, Arcos-Vargas, Tennican y Núñez (2023), «The Iberian Exception: An overview of its effects over its first 100 days», Oxford Institute for Energy Studies EL-50 / arXiv 2309.02608.** [P] (leído en arXiv, v1 del 5 de septiembre y v2 del 25 de septiembre de 2023; la URL de OIES está bloqueada)
  - URL: https://arxiv.org/abs/2309.02608 (OIES: https://www.oxfordenergy.org/wpcms/wp-content/uploads/2023/11/EL-50-The-Iberian-Exception.pdf)
  - El contrafactual del Gobierno ignora la elasticidad de la demanda. Resumen de v2 (p. 1): «the government´s counterfactual ignores demand elasticity, and this inflates their estimate of immediate consumer benefits».
  - **Segunda pasada (26/11): la ambigüedad queda resuelta y la primera pasada estaba mal.** El 13% **no** es el resultado principal: es un primer contrafactual (solo con elasticidad de la demanda ibérica) que los autores rechazan. En la p. 24 de v2: «Although the IE savings of 13% are lower than the savings estimated using the Ministry's methodology, this first-pass analysis tends to support the Ministry conclusion […]. However, this estimate almost certainly overstates the consumer benefits of the IE».
  - Su contrafactual principal añade el comercio con Francia y da un **coste neto** para los consumidores afectados. En la p. 29: «the additional cost of the IE for affected Spanish consumers would have been 3%, or about €270 million, during the first 100 days», frente a los «€1,400 million euros that the Ministry approach estimates as the savings». En Portugal, unos 33 millones de coste adicional.
  - Resumen de v2 (p. 1): «affected consumers would have paid somewhat less for electricity in the first 100 days of the IE had it not been introduced». La v1 era más prudente: «may even lead to the conclusion that the latter would have paid less».
  - Otras cifras del original (v2):
    - Con el método del Ministerio, el ahorro sería del 20%, unos 1.400 millones en 100 días (p. 18).
    - Las rentas de congestión de cada país pasaron de unos 150 a unos 600 millones en 100 días. Al sistema francés le supuso «almost €450 million» más de ingresos (p. 30).
    - La parte española de las rentas, unos 500 millones, cubrió el 13% del coste del mecanismo (p. 30).
    - Hicieron falta «an additional 6.5 TWh of gas» (p. 30).
  - **Límites que hay que decir:** solo cubre los 100 primeros días (del 15 de junio al 23 de septiembre de 2022), el contrafactual de oferta y demanda lo construyen los autores con datos de OMIE, y ellos mismos lo llaman «initial assessment» (p. 33).
- **Lou, Pollitt, Robinson y Arcos-Vargas (EPRG, Cambridge, WP 2513, 2025; publicado en *Energy Economics*, 2026).** [S] (jbs.cam.ac.uk, eprg.group.cam.ac.uk y sciencedirect.com bloqueados; no está en arXiv)
  - URL: https://www.jbs.cam.ac.uk/wp-content/uploads/2025/06/eprg-wp2513.pdf (versión publicada: https://www.sciencedirect.com/science/article/pii/S0140988326001672)
  - En el escenario con ajuste de oferta y demanda, el precio diario mayorista bajó un **35,3%**.
  - El gas para generar electricidad subió un **25% en la península** frente al escenario sin excepción, y un 3,2% en el conjunto de la UE. Alrededor de una cuarta parte de ese aumento se debe a las exportaciones inducidas (a Francia y Marruecos).
  - La medida **distorsionó el comercio con Francia y encareció el coste para los consumidores ibéricos**.
  - No encuentran que elevara el precio del gas en el TTF.
  - Según el resumen no técnico, subvencionar el consumo inframarginal habría tenido el mismo efecto medio en la factura «at much lower societal cost».
- **Linares y Gómez San Román (Comillas, IIT), *Economics and Policy of Energy and the Environment*, 2023(1), pp. 5-16, revisión de estudios.** [S] (iit.comillas.edu bloqueado)
  - URL: https://www.iit.comillas.edu/publicacion/revista/en/2296/An_assessment_of_the_Iberian_Exception_to_control_electricity_prices
  - Fragmento del resumen: «the mechanism may have produced, depending on the assumptions, some reductions in electricity prices for Iberian consumers or none at all, but always at the expense of subsidies to French consumers and also increased rents for gas combined cycles, higher gas consumption, and larger CO2 emissions».
  - Proponen como alternativa un esquema temporal de comprador único.
- **Columbia CGEP, comentario de mayo de 2023.** [S] (energypolicy.columbia.edu bloqueado)
  - URL: https://www.energypolicy.columbia.edu/wp-content/uploads/2023/05/Iberian-Exception_Commentary_CGEP_051723-2.pdf
  - Los consumidores españoles subvencionaron a los franceses con una transferencia estimada de unos 600 millones de euros.
  - *Nota de la segunda pasada:* no confundir con los 600 millones de rentas de congestión **por país** en 100 días de Robinson y otros (p. 30), que son otro concepto.

**Lo que no he encontrado**
- **CNMC:** ~~ninguna evaluación contrafactual propia~~. **Segunda pasada (26/11): corregido.** Hay una estimación simplificada del ahorro en el PVPC (~18% del coste de la energía hasta el 31/12/2022, IS/DE/027/23, p. 57; véase arriba). **No** hay un coste total en euros en los tres informes leídos. El post del blog del 19 de septiembre de 2022 (blog.cnmc.es, bloqueado) no se ha podido leer.
- **Fedea:** ~~no aparece ningún análisis~~. **Segunda pasada (26/11): corregido.** Existe el Apuntes 2022/15 de Diego Rodríguez, que analiza solo el primer día (véase arriba).
- **Natalia Fabra:** no he encontrado una evaluación suya en solitario. Su trabajo es el de Fabra, Leblanc y Souza (2025). El estudio de *Energy Policy* es de Hidalgo-Pérez y otros, no de Fabra.
- **Prórroga de 2023:** no he localizado la decisión de la Comisión que autoriza la prórroga (solo el RDL 3/2023, que dice que la fecha de fin es «resultado del proceso de negociación con los servicios técnicos de la Comisión Europea», BOE pág. 45673).

**Resumen para el guion**
- **Hay consenso en que el precio mayorista bajó** (entre un 35% y un 43% según los estudios ex post, [S]; un 30% en la previsión ex ante del Banco de España, [P]). Pero el precio mayorista **no incluye el cargo** que pagaban los consumidores afectados: comparar solo precios mayoristas exagera el efecto.
- **El efecto en la factura final está discutido de verdad, y en las dos direcciones:**
  - **A favor de que funcionó (contraevidencia a la hipótesis del episodio):** CNMC, ~18% en el coste de la energía del PVPC en 2022 [P, método simplificado]; Esade, 32% en el PVPC [S]; IWH, −3,5/−3,7 puntos de inflación en España [S]; Banco de España, −0,5 puntos ex ante [P]; Fabra y otros, alivio progresivo de unos 149 € por hogar [S].
  - **En contra:** Robinson y otros, +3% de coste para los consumidores afectados en los primeros 100 días [P]; Fedea, solo un −5,6% el primer día [P parcial]; Linares y Gómez, «alguna reducción o ninguna» según los supuestos [S].
  - Los costes están documentados: más gas para generación (+25% según EPRG [S]; +6,5 TWh en 100 días según Robinson [P]), rentas de congestión para Francia, rentas para los ciclos combinados y más CO2.
- **Funcionó de verdad solo unos ocho meses** (del 15 de junio de 2022 al 26 de febrero de 2023, CNMC [P]). Después, el gas bajó del tope por sí solo.
- **Es un caso de «fijar el número» que no es un tope de precio final:** se subvenciona un insumo y se financia con un cargo a los consumidores. No conviene presentarlo como un control de precios clásico.

---

### F12 - Argentina, intervención del INDEC (2007-2015) [S] (con puntos [P] de Cavallo en el NBER)
URL (FMI, declaración de censura, comunicado 13/33): https://www.imf.org/en/News/Articles/2015/09/14/01/49/pr1333
URL (FMI, levantamiento, comunicado 16/497): https://www.imf.org/en/news/articles/2016/11/09/pr16497-argentina-imf-executive-board-removes-declaration-of-censure
URL (Cavallo 2013): https://dspace.mit.edu/handle/1721.1/107462
URL (Cavallo y Rigobon, NBER WP 22111, marzo de 2016): https://www.nber.org/papers/w22111
URL (Cavallo, Cruces y Perez-Truglia, NBER WP 22103, marzo de 2016): https://www.nber.org/papers/w22103
- **Segunda pasada (26/11), nota de fuentes.** imf.org y dspace.mit.edu siguen bloqueados: no he podido leer ni los comunicados del FMI ni el artículo de 2013. **El NBER w18311 que se indicaba en el encargo no es de Cavallo** (es Agarwal y otros, sobre el programa HAMP). Cavallo (2013) no parece tener versión NBER. En su lugar he leído dos documentos del NBER del propio Cavallo que resumen sus resultados.
- **Confirmado: enero-febrero de 2007.** El Gobierno apartó a la responsable técnica del IPC, Graciela Bevacqua, al elaborar el IPC preliminar de enero de 2007, que según Infobae estimaba un 2,1% [S]. Fuente: Infobae, «A 15 años de la intervención del Indec» (30 de enero de 2022), https://www.infobae.com/economia/2022/01/30/a-15-anos-de-la-intervencion-del-indec-como-se-decidio-la-destruccion-de-las-estadisticas-oficiales-por-varios-anos/
  - **Segunda pasada (26/11):** la cronología de Cavallo, Cruces y Perez-Truglia (w22103, p. 8, «compiled by the authors from newspaper articles») precisa las fechas:
    - Enero de 2007: «Bevacqua, the director of the Prices Departmen is suspended».
    - Febrero de 2007: «The government officially intervenes INDEC», «The first manipulated CPI-GBA monthly index is published» y «Bevacqua is officially fired».
  - Para el guion: suspensión en enero, intervención formal en febrero de 2007.
- **Confirmado: divergencia oficial frente a privadas y provincias.** [S] Años representativos:
  - 2007: 8,5% oficial.
  - 2008: 7,2% oficial frente a 23,4% de Ecolatina. Otro trabajo de la UCA da un 18% privado. Las privadas no dan una cifra única.
  - 2009: 7,7% oficial; las consultoras «duplican» el dato.
  - 2010: 10,9% oficial (alguna fuente dice 10,6%) frente a un 25-27% de las privadas y un **22,4% del IPC-7 provincias**.
  - 2014, ya con el IPCNu: **23,9% oficial frente a 38,5% del «IPC Congreso»** (la media de consultoras que publicaban diputados de la oposición).
  - Acumulado 2007-2015: INDEC 159,5% frente a 489,5% del relevamiento de EcoGo (Infobae).
  - **Precaución:** para 2011 hay un artículo que da 10,9% oficial, la misma cifra que 2010. Comprobar la serie oficial de 2011 antes de usarla.
- **Confirmado, con evidencia académica independiente de las consultoras:** Cavallo (2013), *Journal of Monetary Economics* 60(2), pp. 152-165.
  - Con precios en línea de supermercados (octubre de 2007 a marzo de 2011), la inflación en línea fue de un 20,1% anual frente al 8,5% oficial: «nearly three times higher than the official estimate» [S: cifras exactas sin leer en el artículo]. En Brasil, Chile, Colombia y Venezuela los índices en línea sí siguen al oficial [S].
  - **Segunda pasada (26/11): confirmado en redondo por el propio autor [P].** Cavallo y Rigobon (w22111, p. 2): «Cavallo (2013) showed that while Argentina's government announced an average annual inflation rate of 8 percent from 2007-2011, the online data suggested it was actually over 20 percent, in line with the estimates of some provincial governments and local economists».
  - Y en la nota 4 de la p. 12: «In Cavallo (2013) we showed that one could closely approximate the official index by simply dividing the online inflation rate by three».
  - **Para el guion se puede decir «un 8% oficial frente a más de un 20%» con fuente primaria.** El par 20,1/8,5 sigue en [S] hasta leer el artículo de 2013.
  - Matiz del mismo texto (p. 12): el índice en línea seguía la **dinámica** del oficial: «The difference was mostly in the level of the annual inflation rate, not its movements over time».
- **Corregido: terminología.** No fue una «moción de censura». El FMI la llama *declaration of censure* (declaración de censura) [S].
  - En julio de 2011 se constató el incumplimiento del artículo VIII, sección 5 [S].
  - El 17 de septiembre de 2012 hubo una *Statement of Concern*, y el **1 de febrero de 2013, la declaración de censura**, la primera del FMI contra un país miembro según MercoPress [S].
  - Se levantó el **9 de noviembre de 2016**, cuando el FMI consideró el IPC «in line with international standards» [S].
  - **Segunda pasada (26/11):** no he podido leer los comunicados del FMI (imf.org bloqueado), así que las fechas exactas siguen en [S]. Ojo: el propio Cavallo escribe «motion of censure», entre comillas (w22111, p. 12; w22103, p. 8, «Feb 2013 • The IMF issues a "motion of censure"»). En el guion conviene usar el término del FMI, «declaración de censura», pero no es un error grave de la prensa.
- **Confirmado: IPCNu.** El índice nacional sustituyó al IPC-GBA con el dato de enero de 2014 (3,7% mensual, publicado en febrero de 2014) [S].
  - **Segunda pasada (26/11) [P]:** w22103, p. 8: «Jan 2014 • The CPI-GBA is replaced by a new index, called CPI-Nu. It initially shows similar monthly inflation rates to unofficial estimates, but starts to diverge once again within a few months».
  - Lo mismo en w22111, p. 12: «the change was temporary and the new official index quickly lost all credibility again».
- **Confirmado: normalización de 2016.** El 7 de enero de 2016 se declaró la emergencia administrativa del Sistema Estadístico Nacional, con Jorge Todesca al frente del INDEC [S]. Siguieron unos seis meses sin IPC. El nuevo IPC (GBA, base abril de 2016) debutó a mediados de junio de 2016 con un 4,2% en mayo (Página/12, 16 de junio de 2016; Bolsa de Comercio de Rosario) [S]. No he visto el comunicado original del INDEC (indec.gob.ar bloqueado).
  - **Segunda pasada (26/11):** w22103, p. 8, da diciembre de 2015 para Todesca («Jorge Todesca became the director and Bevacqua returns as the technical director of INDEC») y la suspensión de la publicación del IPC. w22111, p. 12: la manipulación «continued for almost nine years, ending in December 2015».
- **No encontrado:** que San Luis siguiera publicando la inflación real solo aparece en un foro. No usarlo sin la fuente provincial.
- **Segunda pasada (26/11): las multas a consultoras ya tienen fuente académica** (antes era un dato de contexto sin verificar). w22103, p. 8: «Mar 2011 • Some private consultants are fined with 500.000 pesos for failing to comply with Moreno's request», y «Sep 2011 • Private consultants receive letters from the goverment threatening them with criminal prosecutions». Es una cronología hecha a partir de prensa, pero publicada por los autores.

---

### F13 - Objetivos de inflación [S]
URL (RBNZ, historia de los PTA): https://www.rbnz.govt.nz/monetary-policy/about-monetary-policy/history-of-the-remit-and-policy-targets-agreement
URL (BCE, comunicado del 8 de julio de 2021): https://www.ecb.europa.eu/press/pr/date/2021/html/ecb.pr210708~dc78cc4b0d.en.html
- **Segunda pasada (26/11):** no se ha revisado. rbnz.govt.nz y ecb.europa.eu están bloqueados y no era prioridad. Todo sigue en [S].
- **Confirmado (fecha precisada).** La Reserve Bank of New Zealand Act 1989 se aprobó el 15 de diciembre de 1989 y entró en vigor el 1 de febrero de 1990. El primer Policy Targets Agreement se firmó el **2 de marzo de 1990**: inflación entre el 0% y el 2% para diciembre de 1992. El banco dice: «We succeeded, achieving and maintaining inflation of around 2% from 1991».
- **Confirmado.** El BCE definía la estabilidad de precios como una inflación «below, but close to, two per cent» (precisión de la revisión de 2003; no he leído el texto de 2003). El 8 de julio de 2021 adoptó un objetivo **simétrico del 2% a medio plazo**: las desviaciones al alza y a la baja son igual de indeseables.
- **Confirmado.** La inflación del IAPC de la zona euro llegó al **10,6% en octubre de 2022** (blog del BCE del 10 de agosto de 2022 y posteriores, con datos de Eurostat).
- **Matizar (sin verificar en esta sesión):** «funcionó bastante bien hasta 2020» es discutible para la zona euro, porque la inflación estuvo varios años **por debajo** del objetivo antes de 2021. Comprobarlo con la serie del IAPC si se mantiene la frase.

---

### F2 - Controles de salarios y precios de Nixon (1971-1974) [P] (Blinder y Newton; el resto, [S])
URL (Blinder y Newton, NBER WP 279 / *Journal of Monetary Economics* 8(1), 1981): https://www.nber.org/papers/w0279 (PDF: https://www.nber.org/system/files/working_papers/w0279/w0279.pdf, que es el artículo publicado en el *JME*, pp. 1-23)
URL (Nixon, declaración sobre la Fase IV): https://www.presidency.ucsb.edu/documents/statement-announcing-measures-be-taken-under-phase-iv-the-economic-stabilization-program
- **Segunda pasada (26/11), nota de fuentes:** la referencia correcta es **NBER w0279**, como decía la primera pasada. El w0475 que se indicaba en el encargo es otro trabajo (Krueger, «Interactions between inflation and trade-regime objectives in stabilization programs», 1980).
- **Confirmado.** El 15 de agosto de 1971 se congelaron salarios, precios y alquileres durante 90 días (Fase I).
  - **Segunda pasada (26/11) [P]:** Blinder y Newton, p. 4: «The New Economic Policy of August 1971 began with a 90-day freeze on all wages, prices, and rents, with the exception of taxes, raw agricultural products, and mortgage interest».
- **Confirmado, con detalles que faltaban en la versión de memoria.** [S] El 29 de marzo de 1973 se fijaron techos para la carne de vacuno, cerdo y cordero. El 13 de junio de 1973 hubo una segunda congelación de hasta 60 días (Executive Order 11723) que excluía los productos agrarios sin procesar. La sustituyó la Executive Order 11730 del 18 de julio, y la Fase IV empezó el 12 de agosto de 1973. La carne de vacuno siguió con el techo de marzo hasta el 12 de septiembre de 1973. Los controles terminaron el **30 de abril de 1974**.
  - **Segunda pasada (26/11) [P]:** fin de los controles confirmado. Blinder y Newton, p. 5: «only about 12 percent of the CPI remained under control when the controls expired on April 30, 1974». Las fechas de las órdenes ejecutivas y de la carne siguen en [S] (presidency.ucsb.edu no comprobado).
- **Confirmado: escasez de carne en 1973.** [S]
  - Prensa de 1973: «9,000 workers had been laid off at 100 beef plants that had been forced to close or cut back on production», y ganaderos que retenían reses hasta que se levantara el techo.
  - El propio Nixon, en la declaración de la Fase IV, reconoce que el sector de la alimentación es donde se ve con más claridad el daño de los controles (techos de la carne y congelación de junio). No he leído la frase literal.
  - **No encontrado:** lo de los granjeros que ahogaban pollitos. No usarlo.
- **Pendiente → resuelto en parte.** **Segunda pasada (26/11) [P]:** Blinder y Newton, p. 4, dan las fases:
  - Fase II: «November 1971 to December 1972».
  - Fase III: «began in January 1973».
  - Segunda congelación: «from June to August 1973».
  - Las fechas del embargo de petróleo (octubre de 1973) siguen sin comprobar. Para separar los efectos basta con que la escasez de carne (de marzo a septiembre de 1973) es **anterior** al embargo.
- **Confirmado: Blinder y Newton (1981), *Journal of Monetary Economics* 8(1), pp. 1-23.** **Segunda pasada (26/11): confirmado en el original [P].** Resumen, p. 1, literal: «According to the estimates, by February 1974 controls had lowered the non-food non-energy price level by 3—4 percent. After that point, and especially after controls ended in April 1974, a period of rapid 'catch up' inflation eroded the gains that had been achieved, leaving the price level from zero to 2 percent below what it would have been in the absence of controls. The dismantling of controls can thus account for most the the burst of 'double digit' inflation in non-food and non-energy prices during 1974» (sic: «most the the»).
  - **Segunda pasada (26/11): corregido.** La primera pasada decía que «un capítulo posterior del NBER» encontraba un nivel de precios algo **más alto** según la especificación. No he localizado ese capítulo. Lo que sí está en el original es la revisión de estudios **anteriores** que hace el propio Blinder y Newton (pp. 6-7):
    - Gordon (1975) estimaba que los controles dejaron el nivel de precios «in 1975:1 1 percent above the no-controls path».
    - McGuire (1976), con el IPC, encontraba que «by 1974:2 the price level was about 3.5 percent higher than it would have been without controls». Blinder y Newton atribuyen parte de ese resultado a los alimentos y la energía, que «ought not to be blamed on controls».
    - Es decir, **el resultado depende del método y del índice**, y Blinder y Newton es la estimación más favorable a los controles dentro de esa literatura, con un efecto final de 0-2%.
- **Contraevidencia que hay que mostrar: Rockoff, *Drastic Measures* (Cambridge University Press, 1984).** [S] Según la reseña de EconPapers, la tesis del libro es que, «contrary to the conventional wisdom, there are situations where the net effect of controls can be positive». En concreto, los controles temporales pueden reducir el paro y la producción perdida de una desinflación. No he leído el capítulo sobre Nixon (econpapers.repec.org bloqueado en la segunda pasada).

---

### F3 - Office of Price Administration, Estados Unidos (1942-1946) [S]
URL (CEA, «Historical Parallels to Today's Inflationary Episode», 6 de julio de 2021): https://bidenwhitehouse.archives.gov/cea/written-materials/2021/07/06/historical-parallels-to-todays-inflationary-episode
URL (Mills y Rockoff 1987, *Journal of Economic History* 47(1)): https://ideas.repec.org/a/cup/jechis/v47y1987i01p197-213_04.html
- **Segunda pasada (26/11): sin avances con fuentes primarias.**
  - www.bls.gov devuelve «Access Denied» desde su propio servidor, tanto para la tabla histórica en PDF como para la página.
  - La API (api.bls.gov) y los datos de la base Macrohistory del NBER (data.nber.org, serie m04128 «U.S. Consumer Price Index, All Items, BLS 01/1913-03/1970») están bloqueados por el proxy.
  - bidenwhitehouse.archives.gov e ideas.repec.org también están bloqueados.
  - **No he calculado tasas interanuales:** no hay datos [P] sobre los que hacerlo, y no se van a inventar.
- **Confirmado: el marco.** La General Maximum Price Regulation de abril de 1942 congeló casi todos los precios de consumo al máximo de marzo de 1942. La orden *Hold the Line* llegó en abril de 1943. Hubo racionamiento.
- **Confirmado: inflación medida en guerra.** Según una exposición de los Oregon State Archives, el IPC subió en torno a un 24% entre 1939 y 1943 y solo un 4% entre 1943 y 1945. **Hay que separar los periodos:** antes de los controles generales hubo bastante inflación.
- **No encontrado: las tasas anuales oficiales de 1939 a 1948.** Siguen pendientes. Hay que sacarlas de la tabla histórica del IPC-U del BLS (https://www.bls.gov/cpi/tables/supplemental-files/historical-cpi-u-202104.pdf) desde un navegador o una red que el BLS no bloquee, y calcular las variaciones como [C] sobre [P].
- **Confirmado: el repunte tras retirar los controles.**
  - La OPA expiró el 30 de junio de 1946. Se restableció parcialmente el 26 de julio, y en noviembre de 1946 se retiraron casi todos los controles salvo alquileres, arroz y azúcar.
  - Según el CEA, los precios de los alimentos subieron un 13,8% en julio de 1946 y «in 1947, inflation jumped to over 20 percent».
  - Tasa interanual del IPC en diciembre de 1946: un 18,13% según inflationdata.com, cifra secundaria y con una tabla que parece descolocada. Confirmarla con el BLS.
- **Confirmado: infravaloración de la inflación.**
  - Friedman y Schwartz estiman que el índice «verdadero» estaba entre un 8% y un 10% por encima del oficial en los años centrales del control, y cifran la distorsión del deflactor del PNN en un 9,4%.
  - Mills y Rockoff (1987) la sitúan entre el 4,8% y el 9,4%.
  - Según una fuente secundaria, Rockoff estima que el IPC infravaloraba la subida de precios entre un 4,8% y un 7,3% en junio de 1946.
  - La OPA estimó que el mercado negro suponía entre el 3% y el 4% del coste de los alimentos (citado por Cato).
  - Rockoff advierte que el mercado negro no deja buenos registros estadísticos.
- **Matiz para el guion (contraevidencia):** incluso corregida, la inflación de guerra con controles y racionamiento parece moderada para una economía con ese exceso de demanda. Mills y Rockoff (1987) encuentran que en el Reino Unido hubo menos evasión y que la clave era el grado de reglamentación.
  - **Sin verificar:** a Paul Evans (1982, *Journal of Political Economy*, «The Effects of General Price Controls in the United States during World War II») se le atribuye que los controles dejaron el nivel de precios un 30% por debajo del que habría habido sin ellos. Esa cifra parece alta: comprobarla en el original antes de usarla (journals.uchicago.edu no se ha probado; penelope.uchicago.edu está bloqueado).

---

### F1 - Edicto de precios máximos de Diocleciano (año 301) y Lactancio [S]
URL (traducción inglesa de *De mortibus persecutorum*, New Advent): https://www.newadvent.org/fathers/0705.htm
URL (edición bilingüe, Bibliothek der Kirchenväter): https://bkv.unifr.ch/works/cpl-91
- **Segunda pasada (26/11): sigue sin cita verificada.** Todos los hosts con el texto, en latín o traducido, están bloqueados por el proxy: newadvent.org, ccel.org, thelatinlibrary.com, tertullian.org, en/la.wikisource.org, gutenberg.org, archive.org, bkv.unifr.ch, perseus.tufts.edu, documentacatholicaomnia.eu, intratext.com, attalus.org, fourthcentury.com, sourcebooks.fordham.edu, livius.org, books.google.com y emanualaltegeschichte.blogs.uni-hamburg.de. **No se ha copiado ningún pasaje: no hay que poner en pantalla ninguna cita de Lactancio** hasta cotejarla con una edición.
- **No encontrado: la cita literal.** Hay que copiarla de New Advent (traducción de W. Fletcher, Ante-Nicene Fathers, vol. 7) o de una edición crítica (Creed, Oxford, 1984) y anotar el párrafo exacto.
- **Por comprobar: la numeración.** El registro dice cap. 7 y el encargo dice 7.6-7. Un material docente alemán (Universidad de Hamburgo, traducción de Aloys Hartl) cita el pasaje del edicto como *De mort. pers.* 7,2. Fijar la numeración con la edición que se use.
- **Confirmado (en fuente secundaria): Lactancio es una fuente hostil.** El comentario de Hamburgo dice que la visión negativa del autor se entiende porque Diocleciano ordenó la persecución de los cristianos, y que la investigación juzga a Diocleciano de formas distintas. Decirlo en pantalla.
- **No verificado en esta sesión: qué fijaba el edicto** (precios máximos de cientos de bienes, salarios y fletes, y la pena de muerte para los infractores). Hay una traducción alemana del edicto en la Universidad de Hamburgo: https://emanualaltegeschichte.blogs.uni-hamburg.de/wp-content/uploads/Übersetzung-Höchstpreisedikt-des-Diokletian.pdf
