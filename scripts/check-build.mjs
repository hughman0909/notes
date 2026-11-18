import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const base = '/notes/';
let checked = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"?#]+)[^"]*"/g)) {
      const href = match[1];
      if (!href.startsWith(base)) continue;
      let target = path.resolve(root, decodeURIComponent(href.slice(base.length)));
      if (!target.startsWith(`${root}${path.sep}`) && target !== root) throw new Error(`Path escapes dist: ${href}`);
      if (href.endsWith('/')) target = path.join(target, 'index.html');
      try { await stat(target); } catch { throw new Error(`Broken link in ${path.relative(root,file)}: ${href}`); }
      checked++;
    }
  }
}
await walk(root);
await stat(path.join(root, 'pagefind/pagefind.js'));
await stat(path.join(root, 'sitemap-index.xml'));
console.log(`Verified ${checked} internal links and assets; search and sitemap are present.`);
