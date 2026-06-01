import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'placeholder',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-05-28', // Use current date
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
