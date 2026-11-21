import {makeProject} from '@motion-canvas/core';
import scene from './scene?scene';
import {episodeExporter} from '../../../production/src/exporter';
export default makeProject({scenes: [scene], audio: '/04-tu-voto/generated/soundtrack.wav', plugins: [episodeExporter]});
