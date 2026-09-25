// DogMania Recife — interações
(() => {
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = (open) => {
    nav.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggle(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));

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
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

  // Leve inclinação 3D no card do hero
  const card = document.querySelector(".hero__card");
  if (card && window.matchMedia("(pointer: fine)").matches) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
