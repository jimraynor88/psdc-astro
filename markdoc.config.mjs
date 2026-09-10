import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    callout: {
      render: component('./src/components/Callout.astro'),
      attributes: {
        type:  { type: String, default: 'info', matches: ['info','note','tip','warn','quote'] },
        label: { type: String, required: false },
      },
    },
  },
});
