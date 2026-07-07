import { helloWorld } from './example';

declare let global: Record<string, unknown>;

global.helloWorld = helloWorld;
