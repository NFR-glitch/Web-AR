// INTERAKSI AR
AFRAME.registerComponent("klik-hewan", {
  init: function () {
    const el = this.el;

    el.addEventListener("click", () => {
      el.setAttribute("scale", "1.5 1.5 1.5");

      document.getElementById("info-text").innerText = "🐘 Ini adalah hewan yang bisa kamu pelajari di AR!";
    });
  },
});
