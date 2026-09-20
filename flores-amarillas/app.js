(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    root.classList.add('motion-ready');
  }

  const flowerMessage = document.querySelector('#flowerMessage');
  document.querySelectorAll('.flower-choice').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.flower-choice').forEach(other => {
        const active = other === button;
        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      flowerMessage.animate([{opacity:.1, transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}], {duration:320,easing:'ease-out'});
      flowerMessage.textContent = button.dataset.message;
    });
  });

  const music = document.querySelector('#bgMusic');
  const soundToggle = document.querySelector('#soundToggle');
  soundToggle?.addEventListener('click', async () => {
    if (music.paused) {
      try { await music.play(); } catch {}
      soundToggle.textContent='♫';
      soundToggle.setAttribute('aria-pressed','false');
      soundToggle.setAttribute('aria-label','Pausar música');
    } else {
      music.pause();
      soundToggle.textContent='♪';
      soundToggle.setAttribute('aria-pressed','true');
      soundToggle.setAttribute('aria-label','Reproducir música');
    }
  });

  document.addEventListener('visibilitychange', () => {
    // No se reinicia el viaje; solo se deja el audio como estaba.
    if (document.hidden) return;
  });
})();
