import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const posts = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/posts', generateId: ({ entry }) => entry.replace(/\/index\.(md|mdx)$/, '') }),
  schema: z.object({ title: z.string(), description: z.string(), date: z.coerce.date(), type: z.enum(['article', 'writeup']), tags: z.array(z.string()).default([]), draft: z.boolean().default(false), sample: z.boolean().default(false), externalUrl: z.url({ protocol: /^https$/ }).optional() }),
});
export const collections = { posts };
