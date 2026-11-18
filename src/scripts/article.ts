const article = document.querySelector<HTMLElement>('.prose')!;
const progress = document.querySelector<HTMLElement>('#reading-progress')!;
function updateProgress() { const start = article.offsetTop; const total = article.offsetHeight - window.innerHeight; progress.style.transform = `scaleX(${Math.min(1,Math.max(0,(window.scrollY-start)/Math.max(1,total)))})`; }
window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress); updateProgress();
article.querySelectorAll<HTMLPreElement>('pre').forEach(pre => {
 const code = pre.querySelector('code'); if (!code) return;
 if (pre.hasAttribute('data-mermaid') || pre.dataset.language === 'mermaid' || code.classList.contains('language-mermaid')) { const diagram = document.createElement('div'); diagram.className = 'mermaid-diagram'; diagram.textContent = code.textContent; pre.replaceWith(diagram); return; }
 const button = document.createElement('button');button.className='copy-button';button.textContent='Copy';button.setAttribute('aria-label','コードをコピー');button.setAttribute('aria-live','polite');pre.append(button);
 button.addEventListener('click',async()=>{try {await navigator.clipboard.writeText(code.textContent || '');button.textContent='Copied ✓';}catch{button.textContent='コピーできませんでした';}setTimeout(()=>button.textContent='Copy',2000);});
});
const imageDialog = document.querySelector<HTMLDialogElement>('.image-dialog')!;
article.querySelectorAll<HTMLImageElement>('img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`${img.alt}を拡大`); const show=()=>{const target=imageDialog.querySelector('img')!;target.src=img.currentSrc;target.alt=img.alt;imageDialog.showModal();};img.addEventListener('click',show);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}});});
imageDialog.querySelector('button')?.addEventListener('click',()=>imageDialog.close());imageDialog.addEventListener('click',e=>{if(e.target===imageDialog)imageDialog.close();});
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));}}},{rootMargin:'-10% 0px -70% 0px'});article.querySelectorAll('h2,h3').forEach(h=>observer.observe(h));
async function renderDiagrams(){ const diagrams = article.querySelectorAll<HTMLElement>('.mermaid-diagram'); if(!diagrams.length)return; const {default:mermaid}=await import('mermaid');mermaid.initialize({startOnLoad:false,theme:'dark',securityLevel:'strict',fontFamily:'Inter, sans-serif'});try{await mermaid.run({nodes:Array.from(diagrams)});}catch{diagrams.forEach(d=>d.setAttribute('aria-label','Mermaid diagram source'));} }
renderDiagrams();
