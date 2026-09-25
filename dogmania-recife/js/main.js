// DogMania Recife — interações
(() => {
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Barra de progresso de leitura
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggle = (open) => {
    nav.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggle(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));

  // Frase de apresentação: palavra por palavra
  document.querySelectorAll(".words").forEach((p) => {
    let i = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
            const s = document.createElement("span");
            s.className = "w";
            s.style.transitionDelay = `${i++ * 35}ms`;
            s.textContent = part;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(p);
    p.classList.add("reveal-words");
  });

  // Revelar ao rolar
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .words").forEach((el) => obs.observe(el));

  // Contadores do hero
  const fmt = (v, dec) => v.toFixed(dec).replace(".", ",");
  document.querySelectorAll(".count").forEach((el) => {
    const to = parseFloat(el.dataset.to);
    const dec = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = fmt(to, dec); return; }
    const start = performance.now() + 600;
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min(Math.max((now - start) / dur, 0), 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    // Brilho que segue o mouse nos cartões
    document.querySelectorAll(".tile").forEach((t) => {
      t.addEventListener("mousemove", (e) => {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${e.clientX - r.left}px`);
        t.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });

    // Parallax suave no visual do hero
    const hero = document.querySelector(".hero");
    const dog = document.querySelector(".hero__photo");
    const cards = document.querySelectorAll(".fcard");
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      dog.style.translate = `${x * 14}px ${y * 10}px`;
      cards.forEach((c, i) => (c.style.translate = `${x * (22 + i * 8)}px ${y * (16 + i * 6)}px`));
    });
    hero.addEventListener("mouseleave", () => {
      dog.style.translate = "";
      cards.forEach((c) => (c.style.translate = ""));
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
