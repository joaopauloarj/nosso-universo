/* Armazenamento local (IndexedDB) das fotos enviadas neste navegador */
const PhotoStore = (() => {
  const DB = "nosso-universo", STORE = "photos";
  let dbPromise;
  function open() {
    if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("indexedDB indisponível"));
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }
  function run(mode, fn) {
    return open().then(db => new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const r = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(r && r.result);
      t.onerror = () => reject(t.error);
    }));
  }
  return {
    all: () => run("readonly", s => s.getAll()),
    put: item => run("readwrite", s => s.put(item)),
    remove: id => run("readwrite", s => s.delete(id))
  };
})();

function fileToDataURL(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.86));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("imagem inválida")); };
    img.src = url;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("albumGrid");
  const count = document.getElementById("albumCount");
  const input = document.getElementById("uploadInput");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  let uploaded = [];

  /* ---------- Foto das alianças ---------- */
  const frame = document.getElementById("ringsFrame");
  const ringsImg = document.getElementById("ringsPhoto");
  const ringsInput = document.getElementById("ringsInput");
  function showRings(src) {
    const probe = new Image();
    probe.onload = () => { ringsImg.src = src; ringsImg.hidden = false; frame.classList.add("has-photo"); };
    probe.src = src;
  }
  document.getElementById("ringsChange").addEventListener("click", () => ringsInput.click());
  ringsInput.addEventListener("change", async () => {
    const file = ringsInput.files[0];
    ringsInput.value = "";
    if (!file) return;
    try {
      const data = await fileToDataURL(file);
      showRings(data);
      PhotoStore.put({ id: "rings", kind: "rings", data }).catch(() => {});
    } catch { showToast("Não consegui abrir essa imagem."); }
  });

  /* ---------- Carregar o que já foi salvo ---------- */
  let saved = [];
  try { saved = await PhotoStore.all(); } catch { saved = []; }
  uploaded = saved.filter(p => p.kind === "album").sort((a, b) => a.ts - b.ts);
  const rings = saved.find(p => p.kind === "rings");
  if (rings) showRings(rings.data); else showRings(LOVE_CONFIG.ringsPhoto);

  /* ---------- Álbum ---------- */
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
  }
  lightbox.addEventListener("click", e => { if (e.target !== lightboxImg) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

  function tile(src, opts = {}) {
    const el = document.createElement("figure");
    el.className = "album-item";
    const img = document.createElement("img");
    img.src = src; img.alt = "Foto do nosso álbum"; img.loading = "lazy";
    img.addEventListener("click", () => openLightbox(src));
    el.appendChild(img);
    if (opts.item) {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "tile-btn tile-star" + (opts.item.starred ? " on" : "");
      star.title = "Destacar nos melhores momentos";
      star.setAttribute("aria-label", "Destacar nos melhores momentos");
      star.textContent = opts.item.starred ? "★" : "☆";
      star.addEventListener("click", () => {
        opts.item.starred = !opts.item.starred;
        PhotoStore.put(opts.item).catch(() => {});
        render();
      });
      const del = document.createElement("button");
      del.type = "button";
      del.className = "tile-btn tile-del";
      del.title = "Remover foto";
      del.setAttribute("aria-label", "Remover foto");
      del.textContent = "×";
      del.addEventListener("click", () => {
        uploaded = uploaded.filter(p => p.id !== opts.item.id);
        PhotoStore.remove(opts.item.id).catch(() => {});
        render();
      });
      el.append(star, del);
    }
    return el;
  }

  function render() {
    grid.innerHTML = "";
    const add = document.createElement("button");
    add.type = "button";
    add.className = "album-add";
    add.innerHTML = "<span>＋</span><small>Adicionar foto</small>";
    add.addEventListener("click", () => input.click());
    grid.appendChild(add);

    LOVE_CONFIG.album.forEach(src => grid.appendChild(tile(src)));
    uploaded.forEach(item => grid.appendChild(tile(item.data, { item })));

    const total = LOVE_CONFIG.album.length + uploaded.length;
    if (total === 0) {
      for (let i = 0; i < 3; i++) {
        const ghost = document.createElement("div");
        ghost.className = "album-ghost";
        ghost.setAttribute("aria-hidden", "true");
        ghost.textContent = "♡";
        grid.appendChild(ghost);
      }
    }
    count.textContent = `${total} ${total === 1 ? "foto" : "fotos"}`;
    window.dispatchEvent(new CustomEvent("album:change", { detail: { starred: uploaded.filter(p => p.starred).map(p => p.data) } }));
  }

  document.getElementById("uploadButton").addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const files = [...input.files];
    input.value = "";
    let failed = 0;
    for (const file of files) {
      try {
        const data = await fileToDataURL(file);
        const item = { id: `p${Date.now()}${Math.random().toString(36).slice(2, 7)}`, kind: "album", data, starred: false, ts: Date.now() };
        uploaded.push(item);
        PhotoStore.put(item).catch(() => {});
      } catch { failed++; }
    }
    render();
    if (failed) showToast(failed === 1 ? "Uma imagem não pôde ser aberta." : `${failed} imagens não puderam ser abertas.`);
  });

  render();
});
