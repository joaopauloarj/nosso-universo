document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".track");
  tracks.forEach(el => setupTrack(el, LOVE_CONFIG.songs[Number(el.dataset.index)]));
});

function setupTrack(root, song) {
  const audio = root.querySelector("audio");
  const button = root.querySelector(".play-button");
  const status = root.querySelector(".track-status");
  const progress = root.querySelector(".progress-fill");
  const bar = root.querySelector(".progress-track");
  const duration = root.querySelector(".track-duration");

  root.querySelector(".track-title").textContent = song.title;
  const artist = root.querySelector(".track-artist");
  artist.textContent = song.artist || "";
  artist.hidden = !song.artist;
  status.textContent = "";
  audio.src = song.file;

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    status.textContent = "Pronta para tocar";
    root.classList.add("ready");
  });
  audio.addEventListener("timeupdate", () => {
    progress.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100}%` : "0%";
  });
  audio.addEventListener("ended", () => {
    button.textContent = "▶";
    status.textContent = "Toque para ouvir de novo";
    progress.style.width = "0%";
  });
  audio.addEventListener("error", () => {
    root.classList.remove("ready");
    button.disabled = true;
  });

  bar.addEventListener("click", e => {
    if (!audio.duration) return;
    const r = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  button.addEventListener("click", async () => {
    if (button.disabled) return;
    if (audio.paused) {
      document.querySelectorAll(".track audio").forEach(other => {
        if (other !== audio) {
          other.pause();
          const t = other.closest(".track");
          t.querySelector(".play-button").textContent = "▶";
          if (t.classList.contains("ready")) t.querySelector(".track-status").textContent = "Pausada";
        }
      });
      try {
        await audio.play();
        button.textContent = "Ⅱ";
        status.textContent = "Tocando agora";
      } catch { button.disabled = true; }
    } else {
      audio.pause();
      button.textContent = "▶";
      status.textContent = "Pausada";
    }
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
