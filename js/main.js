// Sou Vet — interações do site
(() => {
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const links = [...document.querySelectorAll(".nav__link")];

  // Header com sombra ao rolar
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggleMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
  links.forEach((l) => l.addEventListener("click", () => toggleMenu(false)));

  // Reveal ao rolar
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  // Contadores
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.target;
        const start = performance.now();
        const dur = 1800;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".counter").forEach((el) => countObs.observe(el));

  // Acordeão
  document.querySelectorAll(".acc-head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Link ativo conforme a seção visível
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const spyObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spyObs.observe(s));

  // Parallax suave na imagem do hero
  const heroVisual = document.querySelector(".hero__visual");
  if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", (ev) => {
      const r = hero.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      heroVisual.style.translate = `${x * -18}px ${y * -18}px`;
    });
    hero.addEventListener("mouseleave", () => (heroVisual.style.translate = "0 0"));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
