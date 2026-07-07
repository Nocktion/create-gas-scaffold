import { doGet, doPost } from './api';

declare let global: Record<string, unknown>;

global.doGet = doGet;
global.doPost = doPost;
