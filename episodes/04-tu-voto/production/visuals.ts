// Visuals for this episode, by name. Beats in timeline.json refer to these names.
// Built-ins: intro, outro, cartela, placeholder. See production/README.md, "Writing a visual".
import type {VisualRegistry} from '../../../production/src/timeline';
import {cinco, opciones, preguntas, provincias} from './visuals/s1';
import {conEscano, mapaSinEscano, nulo, sinEscano} from './visuals/s3';
import {blanco, blancos2023, grande, liston, madrid1993, umbral} from './visuals/s6';
import {abstencion, cierre, escanosEnBlanco, mayoria, sillaVacia, tabla} from './visuals/s7';

export const visuals: VisualRegistry = {
  opciones, preguntas, provincias, cinco, conEscano, sinEscano, mapaSinEscano, nulo,
  blanco, liston, grande, madrid1993, blancos2023, umbral, escanosEnBlanco, sillaVacia, mayoria, abstencion, tabla, cierre,
};
