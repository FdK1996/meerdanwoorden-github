(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  var status = document.getElementById("form-status");
  var submitButton = form.querySelector('button[type="submit"]');
  var fallbackEmail = "info@meerdanwoorden.com";
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.noValidate = true;

  var fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    subject: form.querySelector("#subject"),
    message: form.querySelector("#message"),
    consent: form.querySelector("#consent")
  };

  function errorElement(name) {
    return form.querySelector('[data-error-for="' + name + '"]');
  }

  function setError(name, message) {
    var field = fields[name];
    var error = errorElement(name);
    if (field) {
      if (message) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    }
    if (error) {
      error.textContent = message || "";
    }
  }

  function value(name) {
    return fields[name] ? fields[name].value.trim() : "";
  }

  function validate() {
    var errors = {};

    if (value("name").length < 2) {
      errors.name = "Vul je naam in.";
    }
    if (!emailPattern.test(value("email"))) {
      errors.email = "Vul een geldig e-mailadres in.";
    }
    if (value("subject").length < 2) {
      errors.subject = "Vul een onderwerp in.";
    }
    if (value("message").length < 10) {
      errors.message = "Schrijf een bericht van minimaal 10 tekens.";
    }
    if (!fields.consent.checked) {
      errors.consent =
        "Geef toestemming voor het verwerken van je gegevens.";
    }

    ["name", "email", "subject", "message", "consent"].forEach(function (name) {
      setError(name, errors[name] || "");
    });

    return errors;
  }

  function firstInvalid(errors) {
    var order = ["name", "email", "subject", "message", "consent"];
    for (var i = 0; i < order.length; i += 1) {
      if (errors[order[i]]) {
        return fields[order[i]];
      }
    }
    return null;
  }

  function showStatus(message, type, link) {
    if (!status) {
      return;
    }
    status.className = "form-status" + (type ? " is-" + type : "");
    status.textContent = message;
    if (link) {
      status.appendChild(document.createTextNode(" "));
      var anchor = document.createElement("a");
      anchor.href = link;
      anchor.textContent = "Open je e-mailprogramma";
      status.appendChild(anchor);
    }
  }

  function mailtoLink() {
    var subject = "Contact via meerdanwoorden.com: " + value("subject");
    var body =
      "Naam: " +
      value("name") +
      "\nE-mailadres: " +
      value("email") +
      "\n\n" +
      value("message") +
      "\n\nToestemming gegeven voor verwerking van deze gegevens: ja";
    return (
      "mailto:" +
      fallbackEmail +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  function fallbackToEmail() {
    var link = mailtoLink();
    showStatus(
      "Je bericht wordt klaargezet in je e-mailprogramma. Lukt dat niet, mail dan rechtstreeks naar " +
        fallbackEmail +
        ".",
      "success",
      link
    );
    window.location.href = link;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (form.querySelector("#website") && value("website") !== "") {
      showStatus("Bedankt voor je bericht.", "success");
      form.reset();
      return;
    }

    var errors = validate();
    var invalid = firstInvalid(errors);
    if (invalid) {
      invalid.focus();
      showStatus("Controleer de gemarkeerde velden.", "error");
      return;
    }

    var action = form.getAttribute("action") || "";
    var configured =
      form.getAttribute("data-endpoint-configured") === "true" &&
      /^https?:\/\//i.test(action) &&
      action.indexOf("YOUR_FORM_ID") === -1;

    if (!configured) {
      fallbackToEmail();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }
    showStatus("Bezig met verzenden…");

    fetch(action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Verzenden mislukt");
        }
        return response;
      })
      .then(function () {
        form.reset();
        ["name", "email", "subject", "message", "consent"].forEach(function (
          name
        ) {
          setError(name, "");
        });
        showStatus(
          "Bedankt! Je bericht is verzonden. Ik neem zo snel mogelijk contact met je op.",
          "success"
        );
      })
      .catch(function () {
        var link = mailtoLink();
        showStatus(
          "Het verzenden is niet gelukt. Probeer het later opnieuw of mail rechtstreeks naar " +
            fallbackEmail +
            ".",
          "error",
          link
        );
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });

  Object.keys(fields).forEach(function (name) {
    var field = fields[name];
    if (!field) {
      return;
    }
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") {
        setError(name, "");
      }
    });
    field.addEventListener("change", function () {
      if (field.getAttribute("aria-invalid") === "true") {
        setError(name, "");
      }
    });
  });
})();
