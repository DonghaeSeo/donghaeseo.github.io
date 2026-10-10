// A small, one-time entrance. The document stays visible without JavaScript.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const running = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (preference.matches || target.contains(document.activeElement)) return;
      const animation = target.animate([
        { opacity: 0.65, transform: 'translateY(7px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 480, easing: 'cubic-bezier(.2,.65,.3,1)' });
      running.add(animation);
      // Background windows can suspend the document animation timeline.
      // Always release the effect so content remains fully readable.
      window.setTimeout(() => animation.cancel(), 650);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.identity, .introduction, .news-section, .research-project, .news-page > h1, .publication-page > h1, .publication-list li').forEach(node => observer.observe(node));
  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    observer.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
  });
})();
