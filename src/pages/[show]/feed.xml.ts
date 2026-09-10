import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET({ params }: APIContext) {
  const { show } = params;
  const shows = getCollection('shows');
  const current = shows.find(s => s.slug === show);
  if (!current) return new Response('Not Found', { status: 404 });

  const episodes = getCollection('episodes', d => d.data.show === show && !!d.data.audio);
  const site = Astro.site!;

  return rss({
    title: `${current.data.title} · PULSO ARCHIVO`,
    description: current.data.description ?? '',
    site,
    language: current.data.language ?? 'es',
    items: episodes.map(ep => ({
      title: `T${ep.data.season_num}.${ep.data.episode_num} — ${ep.data.title}`,
      pubDate: ep.data.date,
      description: ep.data.description ?? '',
      link: `/${show}/${ep.data.season_slug}/${ep.data.episode_slug}`,
      enclosure: {
        url: ep.data.audio!,
        type: 'audio/mpeg',
        ...(ep.data.audio_size ? { length: ep.data.audio_size } : {}),
      },
    })),
    customData: `
      <itunes:author>${current.data.author ?? 'PULSO ARCHIVO'}</itunes:author>
      <itunes:explicit>no</itunes:explicit>
      <itunes:block>no</itunes:block>
      ${current.data.cover_url ? `<itunes:image href="${current.data.cover_url}"/>` : ''}
      <itunes:category text="Music">
        ${(current.data.categories ?? []).map(c => `<itunes:category text="${c}"/>`).join('')}
      </itunes:category>
    `,
  });
}
