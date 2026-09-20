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

  toggle.addEventListener('click', () => {
    paused = !paused;
    setMotion();
  });

  reducedMotion.addEventListener?.('change', event => {
    paused = event.matches;
    setMotion();
  });

  setMotion();

  function seedParticles(container, count = 24) {
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = i % 3 === 0 ? 'petal' : 'spark';

      if (particle.classList.contains('petal') && i % 2 === 0) {
        particle.classList.add('yellow');
      }

      particle.style.left = `${(i * 37 + 11) % 98}%`;
      particle.style.animationDelay = `${-i * 1.37}s`;
      particle.style.animationDuration = `${11 + (i % 6)}s`;

      if (particle.classList.contains('spark')) {
        particle.style.top = `${(i * 29 + 9) % 92}%`;
        const size = i % 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
      }

      container.append(particle);
    }
  }

  document.querySelectorAll('.particles').forEach(node => seedParticles(node));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    root.classList.add('motion-ready');
  }

  const messageCard = document.querySelector('.garden-message-card');
  const message = document.querySelector('#flower-message');

  function burst(button) {
    if (paused || reducedMotion.matches) return;

    const old = button.querySelector('.petals-burst');
    old?.remove();

    const burstBox = document.createElement('span');
    burstBox.className = 'petals-burst';

    const directions = [
      [-26, -22], [24, -25], [-31, 8], [30, 10], [-6, -35], [7, 29]
    ];

    directions.forEach(([x, y], index) => {
      const petal = document.createElement('i');
      petal.style.setProperty('--tx', `${x}px`);
      petal.style.setProperty('--ty', `${y}px`);
      petal.style.animationDelay = `${index * 28}ms`;
      if (index % 2 === 0) petal.style.background = '#f6de8b';
      burstBox.append(petal);
    });

    button.append(burstBox);
    window.setTimeout(() => burstBox.remove(), 950);
  }

  document.querySelectorAll('.flower-choice').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.flower-choice').forEach(choice => {
        const selected = choice === button;
        choice.classList.toggle('selected', selected);
        choice.setAttribute('aria-pressed', String(selected));
      });

      burst(button);
      messageCard.classList.add('changing');

      window.setTimeout(() => {
        message.textContent = button.dataset.message;
        messageCard.classList.remove('changing');
      }, reducedMotion.matches ? 0 : 180);
    });
  });

  const header = document.querySelector('#site-header');
  const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  function updateCountdown() {
    const now = new Date();
    const target = FlowerCountdown.target(now);
    const values = FlowerCountdown.remaining(target, now);

    for (const [unit, value] of Object.entries(values)) {
      document.getElementById(unit).textContent = String(value).padStart(2, '0');
    }

    const giftDay = FlowerCountdown.isGiftDay(now);
    const title = document.querySelector('#countdown-title');
    const subtitle = document.querySelector('#countdown-subtitle');
    const arrival = document.querySelector('#arrival-message');

    arrival.hidden = !giftDay;

    if (giftDay) {
      title.innerHTML = 'Ahora sí mi amor...<br><em>hoy son tuyas.</em>';
      subtitle.textContent = 'Se acabó la espera del ramito. Hoy toca verte, entregártelo y mirar esa carita tuya cuando lo recibas.';
    } else {
      title.innerHTML = 'Estas sí quiero<br><em>ponerlas en tus manos.</em>';
      subtitle.textContent = 'Así que por ahora este jardincito guarda el secreto mientras llega el momento de aparecer con tu ramito de verdad.';
    }

    const date = document.querySelector('#gift-date');
    date.dateTime = `${target.getFullYear()}-09-28`;
    date.textContent = `28 de septiembre de ${target.getFullYear()}`;
  }

  updateCountdown();
  let timer = window.setInterval(updateCountdown, 1000);

  document.addEventListener('visibilitychange', () => {
    window.clearInterval(timer);
    if (!document.hidden) {
      updateCountdown();
      timer = window.setInterval(updateCountdown, 1000);
    }
  });
})();
