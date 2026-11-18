import { getCollection, type CollectionEntry } from 'astro:content';
export const posts = async () => (await getCollection('posts', ({ data }) => !data.draft && (import.meta.env.DEV || !data.sample))).sort((a,b) => b.data.date.valueOf() - a.data.date.valueOf());
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;
export const postUrl = (post: CollectionEntry<'posts'>) => post.data.externalUrl ?? url(`${post.data.type === 'article' ? 'articles' : 'writeups'}/${post.id}/`);
export const tagUrl = (tag: string) => url(`tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}/`);
export const date = (d: Date) => d.toISOString().slice(0,10).replaceAll('-', '.');
export const minutes = (body = '') => Math.max(1, Math.ceil((body.match(/[\u3000-\u9fff]/g)?.length || 0) / 500 + body.replace(/[\u3000-\u9fff]/g, '').split(/\s+/).length / 220));
