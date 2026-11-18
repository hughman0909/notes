// Keep Mermaid out of Shiki and load its renderer only on pages with diagrams.
export default function remarkMermaid() {
  return (tree, file) => {
    function visit(node) {
      if (!node.children) return;
      node.children = node.children.map(child => {
        if (child.type === 'code' && child.lang === 'mermaid') {
          if (file.extname === '.mdx') {
            return { type: 'mdxJsxFlowElement', name: 'pre', attributes: [{ type: 'mdxJsxAttribute', name: 'data-mermaid', value: '' }], children: [{ type: 'mdxJsxFlowElement', name: 'code', attributes: [], children: [{ type: 'text', value: child.value }] }] };
          }
          const escaped = child.value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
          return { type: 'html', value: `<pre data-mermaid><code>${escaped}</code></pre>` };
        }
        visit(child); return child;
      });
    }
    visit(tree);
  };
}
