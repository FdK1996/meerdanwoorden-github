(function () {
  "use strict";

  var grid = document.getElementById("blog-grid");
  var button = document.getElementById("blog-load-more");
  var status = document.getElementById("blog-status");

  if (!grid || !button) {
    return;
  }

  var extraCards = Array.prototype.slice.call(
    grid.querySelectorAll(".blog-card--extra")
  );
  var batchSize = 8;
  var shown = 0;

  if (!extraCards.length) {
    button.hidden = true;
    return;
  }

  button.hidden = false;

  function updateButton() {
    var remaining = extraCards.length - shown;
    if (remaining <= 0) {
      button.hidden = true;
      if (status) {
        status.textContent = "Alle berichten zijn geladen.";
      }
      return;
    }
    button.textContent = "Meer laden (" + Math.min(batchSize, remaining) + ")";
  }

  button.addEventListener("click", function () {
    var batch = extraCards.slice(shown, shown + batchSize);
    batch.forEach(function (card) {
      card.classList.add("is-visible");
    });
    shown += batch.length;

    if (status) {
      status.textContent =
        batch.length === 1
          ? "1 bericht toegevoegd."
          : batch.length + " berichten toegevoegd.";
    }

    updateButton();

    if (shown < extraCards.length) {
      var firstNew = batch[0];
      if (firstNew) {
        var focusTarget = firstNew.querySelector("h3 a");
        if (focusTarget) {
          focusTarget.focus({ preventScroll: true });
        }
      }
    }
  });

  updateButton();
})();
