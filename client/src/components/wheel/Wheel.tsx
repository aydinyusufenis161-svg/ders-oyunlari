import { motion } from 'framer-motion';
import { WHEEL_SEGMENTS } from '../../utils/constants';
import { describeArc, getSegmentAngle } from '../../utils/wheelMath';

interface WheelProps {
  rotation: number;
  isSpinning: boolean;
  onSpinComplete: () => void;
  isHost?: boolean;
}

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 10;
const SEGMENT_COUNT = WHEEL_SEGMENTS.length;

export default function Wheel({ rotation, isSpinning, onSpinComplete, isHost = true }: WheelProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Pointer */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-slate-800 drop-shadow-lg" />
      </div>

      {/* Wheel */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={
          isSpinning 
            ? {
                type: 'spring',
                stiffness: 40,
                damping: 20,
                mass: 2,
                restDelta: 0.001
              }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (isSpinning && isHost) onSpinComplete();
        }}
        style={{ willChange: 'transform' }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="drop-shadow-xl">
          {/* Outer ring */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 5} fill="none" stroke="#1e293b" strokeWidth="6" />

          {WHEEL_SEGMENTS.map((segment, i) => {
            const { start, end, center } = getSegmentAngle(i);
            const path = describeArc(CENTER, CENTER, RADIUS, start, end);
            const labelRadius = RADIUS * 0.65;
            const labelAngle = ((center - 90) * Math.PI) / 180;
            const labelX = CENTER + labelRadius * Math.cos(labelAngle);
            const labelY = CENTER + labelRadius * Math.sin(labelAngle);

            return (
              <g key={i}>
                <path d={path} fill={segment.color} stroke="#fff" strokeWidth="2" />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={segment.type === 'points' ? 16 : 11}
                  fontWeight="bold"
                  transform={`rotate(${center}, ${labelX}, ${labelY})`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {segment.label}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle cx={CENTER} cy={CENTER} r={30} fill="#1e293b" />
          <circle cx={CENTER} cy={CENTER} r={24} fill="#334155" />
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            ÇEVIR
          </text>
          {/* Inner shadow ring */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />

          {/* Segment divider dots */}
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
            const angle = ((i * (360 / SEGMENT_COUNT) - 90) * Math.PI) / 180;
            const dotX = CENTER + RADIUS * Math.cos(angle);
            const dotY = CENTER + RADIUS * Math.sin(angle);
            return <circle key={i} cx={dotX} cy={dotY} r={4} fill="#1e293b" />;
          })}
        </svg>
      </motion.div>
    </div>
  );
}
