// Helper: safe query selectors
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Set footer year
(() => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

// Mobile menu toggle
(() => {
  const toggle = $(".nav__toggle");
  const linksWrap = $("[data-nav-links]");
  if (!toggle || !linksWrap) return;

  const setOpen = (open) => {
    linksWrap.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => {
    setOpen(!linksWrap.classList.contains("open"));
  });

  // Close menu after clicking a link (mobile)
  $$(".nav__link", linksWrap).forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!linksWrap.classList.contains("open")) return;
    const clickedInside = linksWrap.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) setOpen(false);
  });
})();

// Smooth scrolling with sticky-header offset
(() => {
  const header = $(".header");
  const headerH = () => (header ? header.getBoundingClientRect().height : 0);

  // Only intercept in-page hash links
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#top") return; // let browser handle

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const y = window.scrollY + target.getBoundingClientRect().top - headerH() - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", href);
    });
  });
})();

// Typing animation in hero (Disabled per user request)

// Scroll reveal animations
(() => {
  const revealEls = $$(".reveal");
  if (revealEls.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );

  revealEls.forEach((el, i) => {
    // small stagger for nicer feel
    el.style.transitionDelay = `${Math.min(i * 55, 260)}ms`;
    io.observe(el);
  });
})();

// Active section highlight in navbar
(() => {
  const links = $$(".nav__link");
  const map = new Map(); // sectionId -> link

  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    map.set(id, a);
  });

  const sections = Array.from(map.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.remove("active"));
    const link = map.get(id);
    if (link) link.classList.add("active");
  };

  const io = new IntersectionObserver(
    (entries) => {
      // pick the most visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { threshold: [0.22, 0.35, 0.5], rootMargin: "-18% 0px -65% 0px" }
  );

  sections.forEach((s) => io.observe(s));
})();

// Project "Live Demo" buttons (simple interaction)
(() => {
  const demoBtns = $$("[data-demo]");
  if (demoBtns.length === 0) return;

  demoBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Replace with a real URL later
      alert("Live demo link is a placeholder. Replace '#' with your project URL.");
    });
  });
})();

// Contact form interaction (no backend needed)
(() => {
  const form = $("#contactForm");
  const hint = $("#formHint");
  if (!form || !hint) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      hint.textContent = "Please fill in all fields.";
      return;
    }

    // Beginner-friendly: simulate a send without any server
    hint.textContent = "Sending...";

  });
})();

// (Disabled Project Card Hover Effect per user request)

