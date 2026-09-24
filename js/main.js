(function () {
  "use strict";

  var DEFAULT_VIEW = "home";
  var views = Array.prototype.slice.call(document.querySelectorAll("[data-view]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  var validIds = views.map(function (v) { return v.id; });
  var baseTitle = document.title.split(" — ")[0];

  var sectionTitles = {
    home: "World Wide Map Service",
    about: "About",
    services: "Services",
    team: "Team",
    work: "Work",
    contact: "Contact"
  };

  function activateView(id, opts) {
    opts = opts || {};
    if (validIds.indexOf(id) === -1) id = DEFAULT_VIEW;

    views.forEach(function (v) {
      v.classList.toggle("is-active", v.id === id);
    });
    navLinks.forEach(function (l) {
      l.classList.toggle("is-active", l.dataset.target === id);
    });

    if (opts.scroll !== false) {
      window.scrollTo(0, 0);
    }
    if (opts.pushState !== false) {
      var newHash = "#" + id;
      if (window.location.hash !== newHash) {
        history.pushState({ view: id }, "", newHash);
      }
    }
    if (sectionTitles[id]) {
      document.title = baseTitle + " — " + sectionTitles[id];
    }
    closeMobileNav();
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = link.dataset.target;
      activateView(target);
    });
  });

  window.addEventListener("popstate", function () {
    var id = (window.location.hash || "#" + DEFAULT_VIEW).replace("#", "");
    activateView(id, { pushState: false });
  });

  var initialId = (window.location.hash || "#" + DEFAULT_VIEW).replace("#", "");
  activateView(initialId, { pushState: false, scroll: false });

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  function closeMobileNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* Header shadow on scroll */
  var header = document.querySelector(".site-header");
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  /* Project filters */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll("[data-categories]"));
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var filter = btn.dataset.filter;
      projectCards.forEach(function (card) {
        var cats = card.dataset.categories.split(" ");
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* Scroll-reveal animation */
  var animatedEls = Array.prototype.slice.call(document.querySelectorAll("[data-animate]"));
  if ("IntersectionObserver" in window && animatedEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    animatedEls.forEach(function (el) { observer.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Contact form (front-end only: no email backend is wired up yet) */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#cf-name");
      var email = form.querySelector("#cf-email");
      var message = form.querySelector("#cf-message");
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      var valid = true;
      [name, email, message].forEach(function (field) {
        if (!field.value.trim()) valid = false;
      });
      if (!emailPattern.test(email.value.trim())) valid = false;

      if (!valid) {
        form.classList.add("was-validated");
        return;
      }

      var successBox = document.querySelector("[data-form-success]");
      var successName = document.querySelector("[data-success-name]");
      if (successName) successName.textContent = name.value.trim().split(" ")[0];
      form.classList.add("is-hidden");
      if (successBox) successBox.classList.add("is-visible");
      form.reset();
    });
  }

  /* Footer year */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
