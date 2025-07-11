import React, { useRef, useEffect } from 'react';

const emeraldShades = [
  '#2ecc71', // Emerald
  '#27ae60', // Darker emerald
  '#a3e635', // Light emerald
  '#34d399', // Soft emerald
  '#059669', // Deep emerald
  '#10b981', // Medium emerald
  '#6ee7b7', // Pale emerald
  '#16a34a', // Rich emerald
  '#22c55e', // Bright emerald
  '#4ade80'  // Pastel emerald
];

const FLASH_COUNT = 1000;
const FLASH_INTERVAL = 2200; // ms between new flashes (slower)
const FLASH_FADE_TIME = 1000; // ms for fade in/out (1 second)

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const GridBackground = () => {
  const canvasRef = useRef(null);
  const flashesRef = useRef([]);
  const lastFlashTime = useRef(Date.now());
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', handleResize);

    function spawnFlash() {
      const color = emeraldShades[Math.floor(Math.random() * emeraldShades.length)];
      flashesRef.current.push({
        x: randomBetween(0.1 * width, 0.9 * width),
        y: randomBetween(0.1 * height, 0.9 * height),
        radius: randomBetween(120, 420), // blob-sized light leaks
        color,
        start: Date.now(),
        duration: FLASH_FADE_TIME
      });
      // Limit number of flashes
      if (flashesRef.current.length > FLASH_COUNT) {
        flashesRef.current.shift();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Draw grid (optional, keep subtle)
      const gridSize = 80;
      ctx.save();
      ctx.strokeStyle = 'rgba(46, 204, 113, 0.06)'; // ultra subtle green grid
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
      // Draw flashes
      const now = Date.now();
      for (let flash of flashesRef.current) {
        const elapsed = now - flash.start;
        let alpha = 0;
        if (elapsed < flash.duration / 2) {
          // Fade in
          alpha = (elapsed / (flash.duration / 2));
        } else if (elapsed < flash.duration) {
          // Fade out
          alpha = 1 - ((elapsed - flash.duration / 2) / (flash.duration / 2));
        }
        alpha *= 0.18; // max opacity
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = flash.color;
        ctx.shadowBlur = 60 + flash.radius * 0.7;
        const grad = ctx.createRadialGradient(
          flash.x, flash.y, flash.radius * 0.2,
          flash.x, flash.y, flash.radius
        );
        grad.addColorStop(0, flash.color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.radius, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      // Remove finished flashes
      flashesRef.current = flashesRef.current.filter(flash => (now - flash.start) < flash.duration);
      // Spawn new flash at interval
      if (now - lastFlashTime.current > FLASH_INTERVAL) {
        spawnFlash();
        lastFlashTime.current = now;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#000',
        display: 'block',
        transition: 'background 0.3s'
      }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
};

export default GridBackground;