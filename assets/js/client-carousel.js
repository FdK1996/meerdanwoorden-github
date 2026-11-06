(function () {
  "use strict";

  var carousel = document.querySelector("[data-client-carousel]");
  if (!carousel) {
    return;
  }

  var track = carousel.querySelector("[data-client-track]");
  var pauseButton = carousel.querySelector("[data-client-pause]");
  if (!track) {
    return;
  }

  var logos = Array.prototype.slice.call(track.children);
  if (!logos.length) {
    return;
  }

  var group = document.createElement("div");
  group.className = "client-group";
  group.setAttribute("role", "presentation");

  logos.forEach(function (logo) {
    group.appendChild(logo);
  });

  var clone = group.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("data-client-clone", "");

  track.appendChild(group);
  track.appendChild(clone);
  carousel.classList.add("is-ready");

  if (!pauseButton) {
    return;
  }

  pauseButton.hidden = false;
  pauseButton.addEventListener("click", function () {
    var paused = carousel.classList.toggle("is-paused");
    pauseButton.setAttribute("aria-pressed", paused ? "true" : "false");
    pauseButton.textContent = paused ? "Doorgaan" : "Pauzeren";
  });
})();
