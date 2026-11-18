// The portfolio shares the GitHub Pages origin but lives outside /notes/.
export default function rehypeExternalLinks() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const destination = new URL(node.properties.href, 'https://hughman0909.github.io/notes/');
        const internal = destination.origin === 'https://hughman0909.github.io' && (destination.pathname === '/notes' || destination.pathname.startsWith('/notes/'));
        if (['http:', 'https:'].includes(destination.protocol) && !internal) {
          node.properties.target = '_blank';
          const rel = new Set(String(node.properties.rel || '').split(/[ ,]+/).filter(Boolean));
          rel.add('noopener'); rel.add('noreferrer');
          node.properties.rel = [...rel];
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
