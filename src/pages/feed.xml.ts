import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const episodes = getCollection('episodes', d => !!d.data.audio);
  const site = Astro.site!;
  return rss({
    title: 'PULSO ARCHIVO',
    description: 'Archivo y difusión de techno, trance, eurodance y hard-house.',
    site,
    items: episodes.map(ep => ({
      title: `T${ep.data.season_num}.${ep.data.episode_num} — ${ep.data.title}`,
      pubDate: ep.data.date,
      description: ep.data.description ?? '',
      link: `/${ep.data.show}/${ep.data.season_slug}/${ep.data.episode_slug}`,
      enclosure: {
        url: ep.data.audio!,
        type: 'audio/mpeg',
        ...(ep.data.audio_size ? { length: ep.data.audio_size } : {}),
      },
    })),
    customData: `
      <itunes:author>PULSO ARCHIVO</itunes:author>
      <itunes:explicit>no</itunes:explicit>
      <itunes:block>no</itunes:block>
    `,
  });
}
