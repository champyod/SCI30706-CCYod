"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const blob = document.getElementById("glassBlob");
  const reflection = document.getElementById("blobReflection");
  const stage = document.getElementById("blobStage");
  const dots = document.querySelectorAll(".mesh-dot");

  if (!blob || !reflection || !stage) return;

  // half-dimensions for normalisation
  const halfW = blob.offsetWidth / 2;
  const halfH = blob.offsetHeight / 2;
  const maxAngle = 14; // degrees

  // idle breathing data
  let idleTime = 0;
  let isIdle = true;

  function updateGlass(e) {
    const rect = blob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // normalised offset from centre (-1 … 1)
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // ---- 3D tilt (follows cursor like a real glass lens) ----
    const tiltX = dy * maxAngle * -1;
    const tiltY = dx * maxAngle;
    blob.style.transform =
      `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // ---- Specular reflection (Fresnel-like) ----
    // highlight moves toward the light source (cursor),
    // gets brighter & sharper at grazing angles
    const fresnel = Math.min(dist * 0.5, 1);
    const sharpen = 10 + dist * 20;
    const bright = 0.02 + fresnel * 0.22;

    // offset highlight toward cursor, clamped near edge for realistic glass flare
    const hx = 50 + dx * 35;
    const hy = 50 + dy * 35;

    reflection.style.background =
      `radial-gradient(` +
      `ellipse ${sharpen}% ${sharpen * 0.5}% at ${hx}% ${hy}%, ` +
      `rgba(255,255,255,${bright}) 0%, ` +
      `rgba(255,255,255,${bright * 0.4}) 40%, ` +
      `transparent 100%` +
    `)`;
    reflection.style.opacity = Math.max(0.2, 1 - dist * 0.25);

    // ---- Blob-internal refraction illusion ----
    // slight background shift = glass lens effect
    const shiftX = dx * 8;
    const shiftY = dy * 6;
    dots.forEach((d) => {
      const origX = parseFloat(d.dataset.origX) || 0;
      const origY = parseFloat(d.dataset.origY) || 0;
      if (!origX) {
        d.dataset.origX = d.offsetLeft;
        d.dataset.origY = d.offsetTop;
      }
      d.style.transform =
        `translate(${-shiftX}px, ${-shiftY}px) scale(${1 + dist * 0.08})`;
    });

    // reset idle timer on mouse move
    idleTime = 0;
    isIdle = false;
  }

  // ---- Idle animation (slow ambient drift when cursor is away) ----
  function idleLoop() {
    idleTime += 1;
    if (idleTime < 30) return; // 2 seconds at 15fps debounce after last move

    if (!isIdle) {
      isIdle = true;
      // reset tilt
      blob.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
    }

    const t = Date.now() / 6000;
    // slow ambient highlight wander
    const hx = 50 + Math.sin(t * 0.7) * 18;
    const hy = 50 + Math.cos(t * 0.5) * 18;
    const breathe = 0.12 + Math.sin(t * 0.3) * 0.04;

    reflection.style.background =
      `radial-gradient(` +
      `ellipse 18% 10% at ${hx}% ${hy}%, ` +
      `rgba(255,255,255,${breathe}) 0%, ` +
      `rgba(255,255,255,${breathe * 0.3}) 40%, ` +
      `transparent 100%` +
    `)`;
    reflection.style.opacity = "0.5";

    // idle bg drift
    dots.forEach((d) => {
      const origX = parseFloat(d.dataset.origX) || d.offsetLeft;
      const origY = parseFloat(d.dataset.origY) || d.offsetTop;
      const driftX = Math.sin(t * 0.5 + origX * 0.01) * 4;
      const driftY = Math.cos(t * 0.4 + origY * 0.01) * 4;
      d.style.transform = `translate(${driftX}px, ${driftY}px)`;
    });

    requestAnimationFrame(idleLoop);
  }

  // ---- Event listeners ----
  stage.addEventListener("mousemove", updateGlass);
  stage.addEventListener("mouseleave", () => {
    idleTime = 0;
    isIdle = false;
    // graceful reset
    blob.style.transition = "transform 0.4s ease-out";
    blob.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
    setTimeout(() => { blob.style.transition = "transform 0.08s ease-out"; }, 400);

    // fade reflection to idle glow
    dots.forEach((d) => {
      d.style.transform = "";
    });
  });

  // initialise bg dot positions
  dots.forEach((d) => {
    d.dataset.origX = d.offsetLeft;
    d.dataset.origY = d.offsetTop;
  });

  // start idle loop
  requestAnimationFrame(idleLoop);
});
