/* Fechas en la hora local de quien abre la página. El 28 completo es el día del regalo. */
globalThis.FlowerCountdown = Object.freeze({
  target(now = new Date()) {
    const year = now.getFullYear();
    const endOfGiftDay = new Date(year, 8, 29);
    return new Date(now >= endOfGiftDay ? year + 1 : year, 8, 28);
  },
  remaining(target, now = new Date()) {
    const total = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    return { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
  },
  isGiftDay(now = new Date()) { return now.getMonth() === 8 && now.getDate() === 28; }
});
