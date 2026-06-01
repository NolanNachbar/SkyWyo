import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'apex-horizon-media',
  title: 'Apex Horizon Media',

  projectId: process.env.SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.SANITY_DATASET ?? 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
