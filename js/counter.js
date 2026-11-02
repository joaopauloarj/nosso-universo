function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getElapsed(start, now) {
  if (now < start) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    days += daysInMonth(prev.getFullYear(), prev.getMonth());
    months--;
  }
  if (months < 0) { months += 12; years--; }
  return { years, months, days, hours, minutes, seconds };
}

function updateLoveCounter() {
  const p = getElapsed(getStartDate(), new Date());
  Object.keys(p).forEach(key => {
    const el = document.getElementById(key);
    if (!el) return;
    el.textContent = ["hours", "minutes", "seconds"].includes(key) ? String(p[key]).padStart(2, "0") : p[key].toLocaleString("pt-BR");
  });
}
updateLoveCounter();
setInterval(updateLoveCounter, 1000);
