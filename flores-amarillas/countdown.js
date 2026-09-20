/* Cuenta hacia el 28 de septiembre en la hora local del dispositivo. */
globalThis.FlowerCountdown = Object.freeze({
  target(now = new Date()) {
    const year = now.getFullYear();
    const endOfGiftDay = new Date(year, 8, 29);
    return new Date(now >= endOfGiftDay ? year + 1 : year, 8, 28);
  },
  remaining(target, now = new Date()) {
    const total = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor(total / 3600) % 24,
      minutes: Math.floor(total / 60) % 60,
      seconds: total % 60
    };
  },
  isGiftDay(now = new Date()) {
    return now.getMonth() === 8 && now.getDate() === 28;
  }
});

(() => {
  function update() {
    const now = new Date();
    const target = FlowerCountdown.target(now);
    const values = FlowerCountdown.remaining(target, now);
    for (const [key, value] of Object.entries(values)) {
      const el = document.getElementById(key);
      if (el) el.textContent = String(value).padStart(2, '0');
    }
    const date = document.querySelector('#giftDate');
    if (date) {
      date.dateTime = `${target.getFullYear()}-09-28`;
      date.textContent = `28 de septiembre de ${target.getFullYear()}`;
    }
    const message = document.querySelector('#arrivalMessage');
    if (message) message.hidden = !FlowerCountdown.isGiftDay(now);
    const title = document.querySelector('#countdownTitle');
    if (title && FlowerCountdown.isGiftDay(now)) title.innerHTML = 'Ahora sí mi amor...<br><em>hoy son tuyas.</em>';
  }
  if (typeof document !== 'undefined') {
    update();
    let timer = setInterval(update, 1000);
    document.addEventListener('visibilitychange', () => {
      clearInterval(timer);
      if (!document.hidden) { update(); timer = setInterval(update, 1000); }
    });
  }
})();
