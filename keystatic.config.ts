import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'jimraynor88',   // ← CAMBIAR
      name: 'psdc-astro',       // ← CAMBIAR
    },
    branchPrefix: '',
  },
  ui: {
    brand: { name: 'PSdC Admin' },
  },

  singletons: {
    site: singleton({
      label: 'Configuración global',
      path: 'src/content/site',
      format: { data: 'yaml' },
      schema: {
        site: fields.text({ label: 'Título del sitio', defaultValue: 'PSdC — Puro Sonido de Club' }),        description: fields.text({ label: 'Descripción', multiline: true, defaultValue: 'Archivo y difusión de techno, trance, eurodance y hard-house.' }),
        tagline: fields.text({ label: 'Tagline (mono, kicker)', defaultValue: 'dance music · archivo · difusión' }),
        speeds: fields.array(fields.text({ label: 'Velocidad' }), {
          label: 'Velocidades del player',
          defaultValue: ['0.88','1','1.10','1.15','1.19','1.28','1.55','1.82','2.18','2.81'],
        }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Etiqueta' }),
            url:   fields.url({ label: 'URL' }),
            desc:  fields.text({ label: 'Descripción corta' }),
          }),
          { label: 'Links externos globales', itemLabel: p => p.fields.label.value }
        ),
      },
    }),
    bio: singleton({
  label: 'Bio / Perfil',
  path: 'src/content/bio',
  format: { data: 'yaml' },
  schema: {
    name:        fields.text({ label: 'Nombre artístico', defaultValue: 'DJ-DuRaN' }),
    avatar_char: fields.text({ label: 'Inicial del avatar', defaultValue: 'D' }),
    description: fields.text({ label: 'Descripción corta', multiline: true }),
    body:        fields.text({ label: 'Bio completa', multiline: true }),
  },
}),
  },

  collections: {
    shows: collection({
      label: 'Shows / Podcasts',
      slugField: 'title',
      path: 'src/content/shows/*',
      format: { data: 'yaml' },
      schema: {
        title:       fields.text({ label: 'Título' }),
        kicker:      fields.text({ label: 'Kicker (subtítulo mono)' }),
        nav_sub:     fields.text({ label: 'Nav sub', defaultValue: '// archive' }),
        accent:      fields.text({ label: 'Color accent (hex)', defaultValue: '#53c8ff' }),
        accent2:     fields.text({ label: 'Color accent2 (hex)', defaultValue: '#2b6bff' }),
        badge:       fields.text({ label: 'Badge (ej: 3 temporadas · 42 eps)' }),
        description: fields.text({ label: 'Descripción', multiline: true }),
        visual: fields.select({
          label: 'Visual del player',
          options: [
            { label: 'Vinyl',   value: 'vinyl' },
            { label: 'Speaker', value: 'speaker' },
            { label: 'Mic',     value: 'mic' },
            { label: 'TV/CRT',  value: 'tv' },
          ],
          defaultValue: 'vinyl',
        }),
        author:      fields.text({ label: 'Autor/DJ' }),
        language:    fields.text({ label: 'Idioma', defaultValue: 'es' }),
        license:     fields.text({ label: 'Licencia', defaultValue: 'CC BY-NC 4.0' }),
        frequency:   fields.text({ label: 'Frecuencia (ej: mensual)' }),
        format:      fields.text({ label: 'Formato', defaultValue: 'mp3 320 kbps' }),
        boilerplate: fields.text({ label: 'Nota recurrente (aparece en todos los eps)', multiline: true }),
        weight:      fields.number({ label: 'Orden en nav (1 = primero)', defaultValue: 1 }),
        cover_url:   fields.url({ label: 'Portada del show (para itunes:image del feed, opcional)' }),
        categories:  fields.array(fields.text({ label: 'Categoría' }), { label: 'Categorías del feed' }),
      },
    }),

    episodes: collection({
      label: 'Episodios',
      slugField: 'title',
      path: 'src/content/episodes/*',
      format: { contentField: 'body' },
      schema: {
        title:       fields.text({ label: 'Título' }),
        description: fields.text({ label: 'Descripción corta', multiline: true }),
        show:        fields.relationship({ label: 'Show', collection: 'shows' }),
        season_num:  fields.number({ label: 'Nº Temporada', defaultValue: 1 }),
        season_slug: fields.text({ label: 'Slug temporada (s1, s2…)', defaultValue: 's1' }),
        episode_num: fields.number({ label: 'Nº Episodio', defaultValue: 1 }),
        episode_slug: fields.text({ label: 'Slug episodio (ep01-first-light…)' }),
        date:          fields.date({ label: 'Fecha publicación' }),
        original_date: fields.text({ label: 'Año/período original (ej: 1999)' }),
        author:   fields.text({ label: 'Autor/DJ' }),
        duration: fields.text({ label: 'Duración (mm:ss)', defaultValue: '00:00' }),
        bpm:      fields.number({ label: 'BPM' }),
        genre:    fields.text({ label: 'Género' }),
        type: fields.select({
          label: 'Visual (override del show)',
          options: [
            { label: 'Vinyl',   value: 'vinyl' },
            { label: 'Speaker', value: 'speaker' },
            { label: 'Mic',     value: 'mic' },
            { label: 'TV/CRT',  value: 'tv' },
          ],
          defaultValue: 'vinyl',
        }),
        audio:      fields.url({ label: 'URL audio (R2 / archive.org / WebDAV)' }),
        audio_size: fields.number({ label: 'Tamaño audio en bytes (opcional)' }),
        video_id:   fields.text({ label: 'YouTube video ID (opcional, sin URL)' }),
        audio_alt: fields.array(
          fields.object({
            label: fields.text({ label: 'Etiqueta' }),
            url:   fields.url({ label: 'URL' }),
          }),
          { label: 'Fuentes alternativas de audio', itemLabel: p => p.fields.label.value }
        ),
        chapters: fields.array(
          fields.object({
            time:  fields.text({ label: 'Tiempo (mm:ss)' }),
            label: fields.text({ label: 'Etiqueta' }),
          }),
          { label: 'Capítulos / marcas', itemLabel: p => `${p.fields.time.value} — ${p.fields.label.value}` }
        ),
        boilerplate: fields.boolean({ label: 'Incluir nota recurrente del show', defaultValue: true }),
        body: fields.markdoc({ label: 'Show notes (Markdoc: {% callout type="info" label="Info" %}...{% /callout %})' }),
      },
    }),

    novedades: collection({
      label: 'Novedades',
      slugField: 'title',
      path: 'src/content/novedades/*',
      format: { contentField: 'body' },
      schema: {
        title:       fields.text({ label: 'Título' }),
        description: fields.text({ label: 'Descripción corta', multiline: true }),
        date:        fields.date({ label: 'Fecha' }),
        body:        fields.markdoc({ label: 'Contenido (opcional)' }),
      },
    }),
  },
});
