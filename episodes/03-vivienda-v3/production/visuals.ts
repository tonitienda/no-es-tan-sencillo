// Version 3 of 03-vivienda (script v4): the v1 visuals, reused as they are, plus
// the new ones for the agenda, the worked example, section splashes and the promises.
import type {VisualRegistry} from '../../../production/src/timeline';
import {barras, outro} from '../../03-vivienda/production/visuals/closing';
import {cartela, frases} from '../../03-vivienda/production/visuals/apertura';
import {cola, cuenta, preguntas} from '../../03-vivienda/production/visuals/cuenta';
import {dato, estudios, frase, hogar, plazo, rango} from '../../03-vivienda/production/visuals/generic';
import {construir, suelo, vacias} from '../../03-vivienda/production/visuals/s4';
import {cierre, giro, publica, topes, volver} from '../../03-vivienda/production/visuals/s6';
import {agenda, ejemplo, palancas, promesas, resumen, splash, tesis} from './visuals/nuevos';

export const visuals: VisualRegistry = {
  barras, outro, frases, cartela, cuenta, cola, preguntas, dato, estudios, frase, hogar, plazo, rango,
  construir, suelo, vacias, giro, topes, publica, volver, cierre,
  agenda, ejemplo, promesas, splash, tesis, resumen, palancas,
};
