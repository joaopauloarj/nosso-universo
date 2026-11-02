function getStartDate() {
  const d = LOVE_CONFIG.startDate;
  return new Date(d.year, d.month - 1, d.day, d.hour || 0, d.minute || 0);
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js");
  const start = getStartDate();
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* Apresentação */
  const I = LOVE_CONFIG.intro;
  document.getElementById("heroKicker").textContent = I.kicker;
  const title = document.getElementById("heroTitle");
  title.append(document.createTextNode(I.title + " "));
  const em = document.createElement("em");
  em.textContent = I.highlight;
  title.append(em);
  document.getElementById("heroText").textContent = I.text;
  const short = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h").replace("h00", "h");
  document.getElementById("stickerDate").textContent = `${String(start.getDate()).padStart(2, "0")}.${String(start.getMonth() + 1).padStart(2, "0")}`;
  document.getElementById("stickerYear").textContent = start.getFullYear();
  document.getElementById("stickerTime").textContent = short;

  /* História */
  document.getElementById("storyWeekday").textContent = cap(start.toLocaleDateString("pt-BR", { weekday: "long" }));
  document.getElementById("storyDay").textContent = String(start.getDate()).padStart(2, "0");
  document.getElementById("storyMonth").textContent = `${cap(start.toLocaleDateString("pt-BR", { month: "long" }))} de ${start.getFullYear()}`;
  document.getElementById("storyTime").textContent = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h").replace("h00", "h");
  document.getElementById("storyText").innerHTML = LOVE_CONFIG.story.map(p => `<p></p>`).join("");
  document.querySelectorAll("#storyText p").forEach((p, i) => { p.textContent = LOVE_CONFIG.story[i]; });

  /* Contagem: rótulo */
  const time = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h").replace("h00", "h");
  document.getElementById("startDateLabel").textContent =
    `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}, às ${time}`;

  /* Carta */
  const L = LOVE_CONFIG.letter;
  document.getElementById("letterGreeting").textContent = L.greeting;
  document.getElementById("letterText").textContent = L.text;
  document.getElementById("letterSign").textContent = L.signature;
  const openBtn = document.getElementById("openLetter");
  const reveal = document.getElementById("letterReveal");
  const envelope = document.getElementById("envelope");
  openBtn.addEventListener("click", () => {
    const opening = reveal.hidden;
    envelope.classList.toggle("open", opening);
    openBtn.setAttribute("aria-expanded", String(opening));
    openBtn.innerHTML = opening ? "Fechar cartinha <span>♡</span>" : "Abrir minha cartinha <span>♡</span>";
    if (opening) {
      setTimeout(() => { reveal.hidden = false; reveal.scrollIntoView({ behavior: "smooth", block: "center" }); }, 650);
    } else {
      reveal.hidden = true;
    }
  });

  /* Rodapé e topo */
  document.getElementById("footerDate").textContent = start.toLocaleDateString("pt-BR");
  document.getElementById("backButton").addEventListener("click", () => history.length > 1 ? history.back() : window.scrollTo({ top: 0, behavior: "smooth" }));
  document.getElementById("forwardButton").addEventListener("click", () => history.forward());

  /* Navegação ativa conforme a rolagem */
  const links = document.querySelectorAll("[data-target]");
  const chapterNow = document.getElementById("chapterNow");
  const setActive = id => {
    links.forEach(l => l.classList.toggle("active", l.dataset.target === id));
    const ch = document.getElementById(id);
    if (ch && ch.dataset.label) chapterNow.textContent = ch.dataset.label;
  };
  setActive("inicio");
  const chapters = document.querySelectorAll("[data-chapter]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    chapters.forEach(c => io.observe(c));

    const rv = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); rv.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".content-section, .letter-section").forEach(s => { s.classList.add("fade-in"); rv.observe(s); });
  }
});
