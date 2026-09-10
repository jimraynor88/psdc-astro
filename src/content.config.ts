import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const shows = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/shows' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string().optional(),
    nav_sub: z.string().default('// archive'),
    accent: z.string().default('#53c8ff'),
    accent2: z.string().default('#2b6bff'),
    badge: z.string().optional(),
    description: z.string().optional(),
    visual: z.enum(['vinyl','speaker','mic','tv']).default('vinyl'),
    author: z.string().optional(),
    language: z.string().default('es'),
    license: z.string().optional(),
    frequency: z.string().optional(),
    format: z.string().optional(),
    boilerplate: z.string().optional(),
    weight: z.number().optional().default(99),
    cover_url: z.string().url().optional(),
    categories: z.array(z.string()).optional(),
  }),
});

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/episodes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    show: z.string(),
    season_num: z.number(),
    season_slug: z.string(),
    episode_num: z.number(),
    episode_slug: z.string(),
    date: z.coerce.date(),
    original_date: z.string().optional(),
    author: z.string().optional(),
    duration: z.string().optional(),
    bpm: z.number().optional(),
    genre: z.string().optional(),
    type: z.enum(['vinyl','speaker','mic','tv']).optional(),
    audio: z.string().url().optional(),
    audio_size: z.number().optional(),
    video_id: z.string().optional(),
    audio_alt: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
    chapters: z.array(z.object({ time: z.string(), label: z.string() })).optional(),
    boilerplate: z.boolean().default(true),
  }),
});

const novedades = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/novedades' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tagline: z.string().optional(),
    speeds: z.array(z.string()).optional(),
    links: z.array(z.object({ label: z.string(), url: z.string(), desc: z.string().optional() })).optional(),
  }),
});

const bio = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/bio' }),
  schema: z.object({
    name: z.string().optional(),
    avatar_char: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
  }),
});

export const collections = { shows, episodes, novedades, site, bio };
