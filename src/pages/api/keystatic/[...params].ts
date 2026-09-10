import { makeRouteHandler } from '@keystatic/astro';

export const prerender = false;

export const { GET, POST } = makeRouteHandler();
