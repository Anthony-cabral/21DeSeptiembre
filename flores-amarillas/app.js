(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  let paused = reducedMotion.matches;
  function setMotion() {
    root.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    const label = paused ? 'Activar animaciones' : 'Pausar animaciones';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.querySelector('.motion-label').textContent = paused ? 'Activar magia' : 'Pausar magia';
  }
  toggle.addEventListener('click', () => { paused = !paused; setMotion(); });
  reducedMotion.addEventListener('change', (event) => { paused = event.matches; setMotion(); });
  setMotion();

  const particles = document.querySelector('.particles');
  for (let i = 0; i < 22; i++) {
    const particle = document.createElement('span');
    particle.className = i < 15 ? 'spark' : 'petal';
    particle.style.left = `${(i * 37 + 11) % 97}%`;
    particle.style.animationDelay = `${-i * 1.7}s`;
    if (i < 15) {
      particle.style.top = `${(i * 23 + 15) % 90}%`;
      particle.style.width = particle.style.height = `${i % 3 + 2}px`;
    }
    particles.append(particle);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    root.classList.add('motion-ready');
  }

  document.querySelectorAll('.flower-choice').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.flower-choice').forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle('selected', selected);
        choice.setAttribute('aria-pressed', String(selected));
      });
      document.querySelector('#flower-message').textContent = button.dataset.message;
    });
  });

  function updateCountdown() {
    const now = new Date();
    const target = FlowerCountdown.target(now);
    const values = FlowerCountdown.remaining(target, now);
    for (const [unit, value] of Object.entries(values)) {
      document.getElementById(unit).textContent = String(value).padStart(2, '0');
    }
    const giftDay = FlowerCountdown.isGiftDay(now);
    document.querySelector('#arrival-message').hidden = !giftDay;
    document.querySelector('#countdown-title').innerHTML = giftDay ? 'Hoy te doy tus flores.<br><em>Y un abrazo de los bonitos.</em>' : 'Falta poquito para<br><em>entregártelas en persona.</em>';
    const date = document.querySelector('#gift-date');
    date.dateTime = `${target.getFullYear()}-09-28`;
    date.textContent = `28 de septiembre de ${target.getFullYear()}`;
  }
  updateCountdown();
  let timer = window.setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', () => {
    window.clearInterval(timer);
    if (!document.hidden) { updateCountdown(); timer = window.setInterval(updateCountdown, 1000); }
  });
})();
