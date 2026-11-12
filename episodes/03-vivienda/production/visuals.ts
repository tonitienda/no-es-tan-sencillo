// Visuals for this episode, by name. Beats in timeline.json refer to these names
// ("visual": "frases"). Built-ins: intro, outro, cartela, placeholder; an episode
// visual with the same name replaces the built-in (cartela does, to light the city).
// See production/README.md, "Writing a visual".
import type {VisualRegistry} from '../../../production/src/timeline';
import {barras, outro} from './visuals/closing';
import {cartela, frases} from './visuals/apertura';
import {cola, cuenta, preguntas} from './visuals/cuenta';
import {dato, estudios, frase, hogar, plazo, rango} from './visuals/generic';
import {construir, suelo, vacias} from './visuals/s4';
import {cierre, giro, publica, topes, volver} from './visuals/s6';

export const visuals: VisualRegistry = {
  barras, outro, frases, cartela, cuenta, cola, preguntas, dato, estudios, frase, hogar, plazo, rango,
  construir, suelo, vacias, giro, topes, publica, volver, cierre,
};
