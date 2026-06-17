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

    // normalised from blob centre
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // ---- 3D tilt from full-screen mouse ----
    const tiltX = dy * maxAngle * -1;
    const tiltY = dx * maxAngle;
    blob.style.transform =
      `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // ---- Specular reflection (Fresnel) ----
    const fresnel = Math.min(dist * 0.45, 1);
    const sharpen = 8 + dist * 22;
    const bright = 0.02 + fresnel * 0.2;
    const hx = 50 + dx * 38;
    const hy = 50 + dy * 38;

    reflection.style.background =
      `radial-gradient(` +
      `ellipse ${sharpen}% ${sharpen * 0.45}% at ${hx}% ${hy}%, ` +
      `rgba(255,255,255,${bright}) 0%, ` +
      `rgba(255,255,255,${bright * 0.35}) 35%, ` +
      `transparent 100%` +
    `)`;
    reflection.style.opacity = String(Math.max(0.15, 1 - dist * 0.3));

    // ---- Background dot shift (refraction lens illusion) ----
    dots.forEach((d) => {
      const ox = parseFloat(d.dataset.origX);
      const oy = parseFloat(d.dataset.origY);
      d.style.transform =
        `translate(${-(dx * 10)}px, ${-(dy * 8)}px) scale(${1 + dist * 0.1})`;
    });

    // ---- Badge follow ----
    if (badge) {
      badge.style.opacity = String(Math.max(0.15, 1 - dist * 0.5));
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

  // ---- Full-screen tracking ----
  let moveTimer = null;

  document.addEventListener("mousemove", (e) => {
    stopIdle();
    updateGlass(e);
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => { startIdle(); }, 800);
  });

  // start idle initially
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

  // blob click opens modal
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
