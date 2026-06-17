"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const blob = document.getElementById("glassBlob");
  const reflection = document.getElementById("blobReflection");
  const container = document.getElementById("blobContainer");
  const badge = document.getElementById("blobBadge");
  const dots = document.querySelectorAll(".mesh-dot");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("modalClose");
  const btnMain = document.getElementById("btnMain");
  const btnSecondary = document.getElementById("btnSecondary");

  if (!blob || !reflection || !container) return;

  const maxAngle = 16;

  function updateGlass(e) {
    const rect = blob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // raw pixel distance from blob centre
    const rawDx = e.clientX - cx;
    const rawDy = e.clientY - cy;
    const rawDist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

    // effective blob radius (half the average dimension)
    const radius = (rect.width + rect.height) / 4;

    // Inverse-distance falloff:
    //   cursor at blob centre  → falloff = 1 (max effect)
    //   cursor at blob edge    → falloff ≈ 0.5
    //   cursor far away        → falloff → 0
    const falloff = radius / (rawDist + radius);

    // Direction vector × falloff (always -1..1, never flips)
    const dist = falloff;
    const dx = rawDist === 0 ? 0 : (rawDx / rawDist) * falloff;
    const dy = rawDist === 0 ? 0 : (rawDy / rawDist) * falloff;

    // ---- 3D tilt (smooth, max angle only when close) ----
    const tiltX = dy * maxAngle * -1;
    const tiltY = dx * maxAngle;
    blob.style.transform =
      `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // ---- Specular reflection (Fresnel) ----
    const fresnel = Math.min(dist * 0.6, 1);
    const sharpen = 8 + dist * 24;
    const bright = 0.02 + fresnel * 0.22;
    const hx = 50 + dx * 38;
    const hy = 50 + dy * 38;

    reflection.style.background =
      `radial-gradient(` +
      `ellipse ${sharpen}% ${sharpen * 0.45}% at ${hx}% ${hy}%, ` +
      `rgba(255,255,255,${bright}) 0%, ` +
      `rgba(255,255,255,${bright * 0.35}) 35%, ` +
      `transparent 100%` +
    `)`;
    reflection.style.opacity = String(0.15 + dist * 0.75);

    // ---- Background dots shift (lens refraction) ----
    dots.forEach((d) => {
      d.style.transform =
        `translate(${-(dx * 12)}px, ${-(dy * 10)}px) scale(${1 + dist * 0.12})`;
    });

    // ---- Badge fade ----
    if (badge) {
      badge.style.opacity = String(0.15 + dist * 0.75);
    }
  }

  // ---- Idle (ambient drift when no mouse activity) ----
  let idleTimeout = null;

  function startIdle() {
    if (idleTimeout) return;
    function idleFrame() {
      const t = Date.now() / 5000;
      const hx = 50 + Math.sin(t * 0.6) * 20;
      const hy = 50 + Math.cos(t * 0.45) * 20;
      const breathe = 0.08 + Math.sin(t * 0.25) * 0.04;

      reflection.style.background =
        `radial-gradient(` +
        `ellipse 16% 9% at ${hx}% ${hy}%, ` +
        `rgba(255,255,255,${breathe}) 0%, ` +
        `rgba(255,255,255,${breathe * 0.3}) 35%, ` +
        `transparent 100%` +
      `)`;
      reflection.style.opacity = "0.4";

      if (badge) badge.style.opacity = "0.6";

      idleTimeout = requestAnimationFrame(idleFrame);
    }
    idleTimeout = requestAnimationFrame(idleFrame);
  }

  function stopIdle() {
    if (idleTimeout) {
      cancelAnimationFrame(idleTimeout);
      idleTimeout = null;
    }
  }

  // ---- Full-screen tracking with distance falloff ----
  let moveTimer = null;

  document.addEventListener("mousemove", (e) => {
    stopIdle();
    updateGlass(e);
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => { startIdle(); }, 800);
  });

  startIdle();

  // ---- Modal / click ----
  function openModal() {
    stopIdle();
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    startIdle();
  }

  container.addEventListener("click", openModal);
  btnMain.addEventListener("click", openModal);
  btnSecondary.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  // ---- Dots initial positions ----
  dots.forEach((d) => {
    d.dataset.origX = d.offsetLeft;
    d.dataset.origY = d.offsetTop;
  });
});
