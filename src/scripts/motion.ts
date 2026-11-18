// Use native scrolling; only the Hero follows scroll position continuously.
// Content remains visible even if JS, observers, or animation APIs are unavailable.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const compact = window.matchMedia('(max-width: 700px)');
const hero = document.querySelector<HTMLElement>('.hero');
let cleanup = () => {};

function setupMotion() {
  cleanup();
  if (reduced.matches) return;
  const running = new Set<Animation>();
  let observer: IntersectionObserver | undefined;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        // Never animate a block already being read, a deep-link target, or focused content.
        const anchor = document.getElementById(decodeHash());
        if (entry.boundingClientRect.top < 70 || element.contains(document.activeElement) || (anchor && (element === anchor || element.contains(anchor))) || typeof element.animate !== 'function') continue;
        const image = element.matches('figure') || !!element.querySelector('img');
        const distance = compact.matches ? 5 : image ? 14 : 9;
        const animation = element.animate([
          { opacity: .65, transform: `translate3d(0,${distance}px,0)` },
          { opacity: 1, transform: 'translate3d(0,0,0)' },
        ], { duration: compact.matches ? 380 : image ? 700 : 550, easing: 'cubic-bezier(.2,.65,.3,1)' });
        running.add(animation);
        animation.onfinish = () => running.delete(animation);
      }
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.latest-note, .section-heading, .post-row, .archive > h1, .article-header > h1, .prose > h2, .prose > h3, .prose > p, .prose > blockquote, .prose > ul, .prose > ol, .prose > figure').forEach(element => observer!.observe(element));
  }

  let frame = 0;
  const updateHero = () => {
    frame = 0;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
    hero.style.setProperty('--hero-rise', `${(-28 * progress).toFixed(2)}px`);
    hero.style.setProperty('--hero-shift', `${(24 * progress).toFixed(2)}px`);
  };
  const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateHero); };
  const followHero = !!hero && !compact.matches;
  if (followHero) {
    updateHero();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
  // Anchor jumps and keyboard focus should land on stationary, fully visible content.
  const stopAnimations = () => { running.forEach(a => a.cancel()); running.clear(); };
  window.addEventListener('hashchange', stopAnimations);
  document.addEventListener('focusin', stopAnimations);
  cleanup = () => {
    observer?.disconnect();
    stopAnimations();
    window.cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    window.removeEventListener('hashchange', stopAnimations);
    document.removeEventListener('focusin', stopAnimations);
    hero?.style.removeProperty('--hero-rise');
    hero?.style.removeProperty('--hero-shift');
  };
}
function decodeHash() {
  try { return decodeURIComponent(window.location.hash.slice(1)); } catch { return ''; }
}
setupMotion();
reduced.addEventListener('change', setupMotion);
compact.addEventListener('change', setupMotion);
