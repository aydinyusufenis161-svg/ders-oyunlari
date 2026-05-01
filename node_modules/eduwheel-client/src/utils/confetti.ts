import confetti from 'canvas-confetti';

export function fireConfettiBurst() {
  const defaults = { origin: { y: 0.7 } };
  confetti({ ...defaults, particleCount: 80, spread: 70, startVelocity: 45 });
  confetti({ ...defaults, particleCount: 45, spread: 120, startVelocity: 35, scalar: 0.9 });
}

