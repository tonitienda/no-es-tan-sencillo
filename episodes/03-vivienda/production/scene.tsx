import resolved from './build/timeline.resolved.json';
import {createEpisodeScene} from '../../../production/src/scene';
import type {Resolved} from '../../../production/src/timeline';
import {visuals} from './visuals';
export default createEpisodeScene(resolved as unknown as Resolved, visuals);
