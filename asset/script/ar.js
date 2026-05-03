// ==========================================
// 1. Hero Image Carousel
// ==========================================
const dots = document.querySelectorAll(".dot");
const images = document.querySelectorAll(".hero-image");

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    dots.forEach((d) => d.classList.remove("active"));
    images.forEach((img) => {
      img.classList.remove("active");
      img.classList.add("leaving");
    });

    dot.classList.add("active");
    images[index].classList.add("active");
    images[index].classList.remove("leaving");

    setTimeout(() => {
      images.forEach((img) => img.classList.remove("leaving"));
    }, 800);
  });
});

let currentSlide = 0;
setInterval(() => {
  if (dots.length > 0) {
    dots[currentSlide].click();
    currentSlide = (currentSlide + 1) % images.length;
  }
}, 4000);

// ==========================================
// 2. AR + AUDIO SYSTEM (FIX)
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  const infoTitle = document.getElementById("info-title");
  const infoText = document.getElementById("info-text");
  const playBtn = document.getElementById("playBtn");
  const targets = document.querySelectorAll("[mindar-image-target]");

  let currentModel = null;
  let isPlaying = false;

  // =====================
  // AUDIO MAP
  // =====================
  const soundMap = {
    Badak: document.getElementById("badakSound"),
    Gajah: document.getElementById("gajahSound"),
    Harimau: document.getElementById("harimauSound"),
    Komodo: document.getElementById("komodoSound"),
    Monyet: document.getElementById("monyetSound"),
  };

  function stopAllAudio() {
    Object.values(soundMap).forEach((a) => {
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    });
  }

  function resetModel(model) {
    if (!model) return;

    model.setAttribute("visible", false);
    stopAllAudio();

    playBtn.innerText = "▶";
    isPlaying = false;
  }

  // =====================
  // TARGET LOOP
  // =====================
  targets.forEach((target) => {
    const model = target.querySelector("[gltf-model]");
    if (!model) return;

    model.setAttribute("visible", false);

    target.addEventListener("targetFound", () => {
      if (currentModel && currentModel !== model) {
        resetModel(currentModel);
      }

      currentModel = model;
      model.setAttribute("visible", true);

      const title = model.getAttribute("data-title");
      const desc = model.getAttribute("data-dsc");

      if (infoTitle && title) infoTitle.innerText = title;
      if (infoText && desc) infoText.innerText = desc;

      playBtn.style.display = "block";
    });

    target.addEventListener("targetLost", () => {
      resetModel(model);

      if (currentModel === model) {
        currentModel = null;
      }

      infoTitle.innerText = "Arahkan Kamera ke Marker";
      infoText.innerText = "";

      playBtn.style.display = "none";
    });
  });

  // =====================
  // UNLOCK AUDIO (WAJIB)
  // =====================
  document.body.addEventListener(
    "click",
    () => {
      Object.values(soundMap).forEach((audio) => {
        if (!audio) return;
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});
      });
    },
    { once: true },
  );

  // =====================
  // BUTTON PLAY / PAUSE
  // =====================
  playBtn.addEventListener("click", () => {
    if (!currentModel) return;
    if (!currentModel.object3D.visible) return;

    const animal = currentModel.getAttribute("data-title");
    const audio = soundMap[animal];

    if (!audio) return;

    if (!isPlaying) {
      stopAllAudio();

      audio.play();
      playBtn.innerText = "⏸";
      isPlaying = true;

      audio.onended = () => {
        playBtn.innerText = "▶";
        isPlaying = false;
      };
    } else {
      audio.pause();
      playBtn.innerText = "▶";
      isPlaying = false;
    }
  });
});

// ==========================================
// 3. AR Visibility Control
// ==========================================
document.addEventListener("visibilitychange", () => {
  const sceneEl = document.querySelector("a-scene");

  if (sceneEl && sceneEl.systems && sceneEl.systems["mindar-image-system"]) {
    const mindar = sceneEl.systems["mindar-image-system"];

    if (document.visibilityState === "visible") {
      mindar.start();
    } else {
      mindar.stop();
    }
  }
});
