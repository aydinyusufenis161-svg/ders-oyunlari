import { WHEEL_SEGMENTS } from './constants';

const SEGMENT_COUNT = WHEEL_SEGMENTS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

export function getSegmentAngle(index: number): { start: number; end: number; center: number } {
  const start = index * SEGMENT_ANGLE;
  const end = start + SEGMENT_ANGLE;
  const center = start + SEGMENT_ANGLE / 2;
  return { start, end, center };
}

export function angleToSegmentIndex(angle: number): number {
  const normalized = ((angle % 360) + 360) % 360;
  const pointerAngle = (360 - normalized + 90) % 360;
  return Math.floor(pointerAngle / SEGMENT_ANGLE) % SEGMENT_COUNT;
}

export function generateSpinTarget(currentRotation: number): { targetIndex: number; totalRotation: number } {
  const targetIndex = Math.floor(Math.random() * SEGMENT_COUNT);
  const fullSpins = 5 + Math.floor(Math.random() * 6);

  const segmentCenter = getSegmentAngle(targetIndex).center;
  const offset = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.4);

  // The wheel is drawn with an offset of -90 degrees in describeArc.
  // Segment 0 center is at (segmentCenter - 90) degrees initially.
  // We want (segmentCenter - 90 + Rotation) = -90 (the top pointer position).
  // Rotation = -segmentCenter.
  const targetAbsoluteAngle = (((360 - segmentCenter + offset) % 360) + 360) % 360;

  // The current rotation within a 0-360 bound
  const currentMod = ((currentRotation % 360) + 360) % 360;
  
  // How much more we need to rotate to hit the target modulo angle
  let diff = targetAbsoluteAngle - currentMod;
  if (diff < 0) diff += 360;

  // The new absolute rotation
  const totalRotation = currentRotation + (fullSpins * 360) + diff;

  return { targetIndex, totalRotation };
}

export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
): string {
  const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
  const endRad = ((endAngleDeg - 90) * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}
