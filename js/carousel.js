document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const dotsBox = document.getElementById("carouselDots");
  const prev = document.getElementById("carouselPrev");
  const next = document.getElementById("carouselNext");
  let starred = [];

  function slideHTML(index, data) {
    const slide = document.createElement("article");
    slide.className = `slide slide-bg-${(index % 3) + 1}`;
    slide.setAttribute("aria-label", `Momento ${index + 1}`);
    const number = String(index + 1).padStart(2, "0");
    slide.innerHTML = `<span class="slide-number">${number}</span><div class="slide-copy"><p class="slide-tag"></p><h3></h3><p class="slide-text"></p></div>`;
    slide.querySelector(".slide-tag").textContent = data.tag;
    slide.querySelector("h3").textContent = data.title;
    slide.querySelector(".slide-text").textContent = data.description || "";
    if (data.description === undefined) slide.querySelector(".slide-text").remove();
    if (data.image) {
      const probe = new Image();
      probe.onload = () => { slide.style.backgroundImage = `linear-gradient(0deg,#000c,transparent 70%), url("${data.image}")`; slide.classList.add("has-photo"); };
      probe.src = data.image;
    }
    return slide;
  }

  function build() {
    const current = Math.round(track.scrollLeft / (track.clientWidth || 1));
    track.innerHTML = "";
    const slides = LOVE_CONFIG.memories.map(m => ({ tag: m.tag, title: m.title, description: m.description, image: m.image }));
    starred.forEach(src => slides.push({ tag: "UM DOS NOSSOS MELHORES MOMENTOS", title: "Guardado com carinho", image: src }));
    slides.forEach((s, i) => track.appendChild(slideHTML(i, s)));

    dotsBox.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot-btn";
      dot.setAttribute("aria-label", `Ir para o momento ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsBox.appendChild(dot);
    });
    update();
    if (current > 0) goTo(Math.min(current, slides.length - 1), true);
  }

  function goTo(i, instant) {
    track.scrollTo({ left: i * track.clientWidth, behavior: instant ? "auto" : "smooth" });
  }
  function update() {
    const n = track.children.length;
    const i = Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / (track.clientWidth || 1))));
    [...dotsBox.children].forEach((d, k) => d.classList.toggle("active", k === i));
    prev.disabled = i === 0;
    next.disabled = i >= n - 1;
  }
  const index = () => Math.round(track.scrollLeft / (track.clientWidth || 1));

  prev.addEventListener("click", () => goTo(index() - 1));
  next.addEventListener("click", () => goTo(index() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(index() + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index() - 1); }
  });
  window.addEventListener("resize", () => goTo(index(), true));
  window.addEventListener("album:change", e => { starred = e.detail.starred; build(); });

  /* Troca sozinho; pausa quando a pessoa interage */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const every = (LOVE_CONFIG.carouselSeconds || 0) * 1000;
  let paused = false, timer;
  function tick() {
    if (paused || document.hidden) return;
    const n = track.children.length;
    goTo(index() >= n - 1 ? 0 : index() + 1);
  }
  if (every && !reduce) {
    timer = setInterval(tick, every);
    const box = document.getElementById("carousel");
    ["mouseenter", "focusin", "touchstart"].forEach(ev => box.addEventListener(ev, () => { paused = true; }, { passive: true }));
    ["mouseleave", "focusout", "touchend"].forEach(ev => box.addEventListener(ev, () => { paused = false; }, { passive: true }));
  }

  build();
});
