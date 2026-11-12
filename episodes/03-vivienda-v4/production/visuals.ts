// Visuals for script v6 (08-guion-v6.md), by name. Beats in timeline.json refer to
// these names. The charts are the ones from the earlier cuts (shared, not copied);
// the new ones live in ./visuals/v5.
//
// Every visual is wrapped with `withSlot`, so a beat can show the open question
// «¿Dónde viven esos hogares?» in the HUD with `props.slot`.
import type {VisualRegistry} from '../../../production/src/timeline';
import {barras, outro} from '../../03-vivienda/production/visuals/closing';
import {cartela} from '../../03-vivienda/production/visuals/apertura';
import {cola} from '../../03-vivienda/production/visuals/cuenta';
import {dato, estudios, frase, plazo, rango} from '../../03-vivienda/production/visuals/generic';
import {construir, suelo, vacias} from '../../03-vivienda/production/visuals/s4';
import {giro, publica, topes, volver} from '../../03-vivienda/production/visuals/s6';
import {promesas} from '../../03-vivienda-v3/production/visuals/nuevos';
import {anual, campana, gancho, linea, lugares, pregunta, resta, ritmo, stopBefore, tabla, withHeader, withSlot} from './visuals/v5';

const base: VisualRegistry = {
  barras, outro, cartela, cola, dato, estudios, frase, plazo, rango, construir, suelo, vacias, giro, publica, topes, promesas,
  anual, campana, gancho, linea, lugares, pregunta, resta, ritmo, tabla,
  // The same charts, cut where the script tells the rest later (or not at all).
  volver_reparto: stopBefore(volver, 'usen'),
  publica_parque: stopBefore(publica, 'once'),
  construir_serie: stopBefore(construir, 'cuenta'),
  suelo_planes: stopBefore(suelo, 'vox'),
  // The same charts, with a line that says what they are about.
  plazo_cabecera: withHeader(plazo),
  dato_cabecera: withHeader(dato),
};

export const visuals: VisualRegistry = Object.fromEntries(Object.entries(base).map(([name, visual]) => [name, withSlot(visual)]));
