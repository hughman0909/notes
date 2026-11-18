const dialog = document.querySelector<HTMLDialogElement>('#search-dialog')!;
let initialized = false;
async function openSearch() {
  dialog.showModal();
  if (initialized) return;
  initialized = true;
  try {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = `${base}/pagefind/pagefind-ui.css`; document.head.append(css);
    const script = document.createElement('script'); script.src = `${base}/pagefind/pagefind-ui.js`;
    await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = reject; document.head.append(script); });
    const UI = (window as unknown as { PagefindUI: new (options: object) => unknown }).PagefindUI;
    new UI({ element: '#search', bundlePath: `${base}/pagefind/`, showSubResults: true, translations: { placeholder: '記事・キーワードを検索' } });
    dialog.querySelector<HTMLInputElement>('input')?.focus();
  } catch { document.querySelector<HTMLElement>('#search-message')!.hidden = false; initialized = false; }
}
document.querySelector('.search-trigger')?.addEventListener('click', openSearch);
document.querySelector('#close-search')?.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
document.addEventListener('keydown', e => { if (e.key === '/' && !dialog.open && !(e.target instanceof HTMLElement && (e.target.matches('input,textarea,select') || e.target.isContentEditable))) { e.preventDefault(); openSearch(); } });
