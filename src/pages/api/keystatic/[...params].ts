// src/pages/api/keystatic/[...params].ts
import { makeRouteHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

export const ALL = makeRouteHandler({
  config: keystaticConfig,
});
