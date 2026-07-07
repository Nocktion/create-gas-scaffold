import { doGet, doPost } from './api';
import { add } from './example';

declare let global: Record<string, unknown>;

global.doGet = doGet;
global.doPost = doPost;
global.add = add;
