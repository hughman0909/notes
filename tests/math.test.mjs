import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';

test('KaTeX renders the inline and display expressions used by research notes', () => {
  for (const displayMode of [false, true]) {
    const html = katex.renderToString('S_{t+1} = H_{I_t}(S_t)', { displayMode, throwOnError: true });
    assert.match(html, /class="katex/);
    assert.match(html, /<math/);
    assert.doesNotMatch(html, /katex-error/);
  }
});

test('inherited trust cannot enable links in mathematical input', () => {
  const options = Object.create({ trust: true });
  options.throwOnError = false;
  const html = katex.renderToString(String.raw`\href{https://example.com/}{x}`, options);
  assert.doesNotMatch(html, /<a\b/);
});
