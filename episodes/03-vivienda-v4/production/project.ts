import {makeProject} from '@motion-canvas/core';
import scene from './scene?scene';
import {episodeExporter} from '../../../production/src/exporter';
export default makeProject({scenes: [scene], audio: '/03-vivienda-v4/generated/soundtrack.wav', plugins: [episodeExporter]});
