import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMermaid from './scripts/remark-mermaid.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeExternalLinks from './scripts/rehype-external-links.mjs';
export default defineConfig({
  compressHTML: true,
  site: 'https://hughman0909.github.io', base: '/notes', trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: { processor: unified({ remarkPlugins: [remarkMermaid, remarkMath], rehypePlugins: [rehypeKatex, rehypeExternalLinks] }), shikiConfig: { theme: 'github-dark' } },
});
