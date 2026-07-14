import React from 'react';
import { useWindowDimensions } from 'react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

interface Props {
  showRoute?: boolean;
}

export function MapBackground({ showRoute = false }: Props) {
  const { width: W, height: H } = useWindowDimensions();

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
      {/* ── Base ─────────────────────────────────────────────────── */}
      <Rect x={0} y={0} width={W} height={H} fill="#EAE6DF" />

      {/* ── Water ────────────────────────────────────────────────── */}
      <Rect x={0} y={H * 0.86} width={W} height={H * 0.14} fill="#A5CEE3" />
      <Rect x={0} y={H * 0.46} width={W * 0.10} height={H * 0.40} fill="#A5CEE3" />

      {/* ── Parks ────────────────────────────────────────────────── */}
      <Rect x={12} y={28} width={130} height={85} rx={6} fill="#C8E6B8" />
      <Rect x={W * 0.68} y={H * 0.42} width={W * 0.30} height={H * 0.10} rx={6} fill="#C8E6B8" />
      <Rect x={W * 0.12} y={H * 0.62} width={W * 0.18} height={H * 0.12} rx={4} fill="#C8E6B8" />
      <Rect x={W * 0.72} y={H * 0.72} width={W * 0.25} height={H * 0.10} rx={4} fill="#C8E6B8" />

      {/* ── Highway horizontal ────────────────────────────────────── */}
      <Rect x={0} y={H * 0.32} width={W} height={22} fill="#F8F0B8" />
      <Rect x={0} y={H * 0.32 + 10} width={W} height={2} fill="#E8C850" opacity={0.4} />

      {/* ── Highway vertical ─────────────────────────────────────── */}
      <Rect x={W * 0.42} y={0} width={22} height={H * 0.86} fill="#F8F0B8" />
      <Rect x={W * 0.42 + 11} y={0} width={2} height={H * 0.86} fill="#E8C850" opacity={0.4} />

      {/* ── Major roads horizontal ───────────────────────────────── */}
      <Rect x={0} y={H * 0.12} width={W} height={12} fill="#FFFFFF" />
      <Rect x={0} y={H * 0.24} width={W} height={12} fill="#FFFFFF" />
      <Rect x={0} y={H * 0.54} width={W} height={12} fill="#FFFFFF" />
      <Rect x={0} y={H * 0.70} width={W} height={12} fill="#FFFFFF" />

      {/* ── Major roads vertical ─────────────────────────────────── */}
      <Rect x={W * 0.18} y={0} width={12} height={H * 0.86} fill="#FFFFFF" />
      <Rect x={W * 0.62} y={0} width={12} height={H * 0.86} fill="#FFFFFF" />
      <Rect x={W * 0.82} y={0} width={12} height={H * 0.86} fill="#FFFFFF" />

      {/* ── Minor roads horizontal ───────────────────────────────── */}
      <Rect x={0} y={H * 0.07} width={W} height={6} fill="#F0ECE4" />
      <Rect x={0} y={H * 0.18} width={W} height={6} fill="#F0ECE4" />
      <Rect x={0} y={H * 0.44} width={W} height={6} fill="#F0ECE4" />
      <Rect x={0} y={H * 0.62} width={W} height={6} fill="#F0ECE4" />
      <Rect x={0} y={H * 0.78} width={W} height={6} fill="#F0ECE4" />

      {/* ── Minor roads vertical ─────────────────────────────────── */}
      <Rect x={W * 0.08} y={0} width={6} height={H * 0.86} fill="#F0ECE4" />
      <Rect x={W * 0.30} y={0} width={6} height={H * 0.86} fill="#F0ECE4" />
      <Rect x={W * 0.52} y={0} width={6} height={H * 0.86} fill="#F0ECE4" />
      <Rect x={W * 0.70} y={0} width={6} height={H * 0.86} fill="#F0ECE4" />
      <Rect x={W * 0.90} y={0} width={6} height={H * 0.86} fill="#F0ECE4" />

      {/* ── Building blocks ──────────────────────────────────────── */}
      {/* Row 1 – above y=12% */}
      <Rect x={W*0.09} y={8}    width={W*0.08} height={H*0.06} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.20} y={6}    width={W*0.09} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.20} y={H*0.075} width={W*0.09} height={H*0.04} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.09} y={H*0.075} width={W*0.08} height={H*0.04} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={6}    width={W*0.08} height={H*0.11} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={6}    width={W*0.06} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={6}    width={W*0.09} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.83} y={6}    width={W*0.06} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.91} y={6}    width={W*0.08} height={H*0.05} rx={2} fill="#D5CCBE" />
      {/* Row 1b – between 7% and 12% */}
      <Rect x={W*0.63} y={H*0.075} width={W*0.06} height={H*0.042} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={H*0.075} width={W*0.09} height={H*0.042} rx={2} fill="#D5CCBE" />

      {/* Row 2 – between 12% and 24% */}
      <Rect x={W*0.09} y={H*0.14} width={W*0.08} height={H*0.08} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.20} y={H*0.14} width={W*0.09} height={H*0.09} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={H*0.135} width={W*0.08} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={H*0.135} width={W*0.06} height={H*0.08} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={H*0.135} width={W*0.09} height={H*0.08} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.83} y={H*0.135} width={W*0.06} height={H*0.08} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.91} y={H*0.135} width={W*0.08} height={H*0.08} rx={2} fill="#D5CCBE" />

      {/* Row 3 – between 24% and 32% */}
      <Rect x={W*0.20} y={H*0.26} width={W*0.09} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={H*0.255} width={W*0.08} height={H*0.055} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={H*0.255} width={W*0.06} height={H*0.055} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={H*0.255} width={W*0.09} height={H*0.055} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.83} y={H*0.255} width={W*0.06} height={H*0.055} rx={2} fill="#D5CCBE" />

      {/* Row 4 – between 34% and 44% */}
      <Rect x={W*0.09} y={H*0.35} width={W*0.08} height={H*0.08} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.20} y={H*0.35} width={W*0.09} height={H*0.08} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={H*0.345} width={W*0.08} height={H*0.085} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.44} y={H*0.345} width={W*0.07} height={H*0.085} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.53} y={H*0.345} width={W*0.07} height={H*0.085} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={H*0.345} width={W*0.06} height={H*0.085} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={H*0.345} width={W*0.09} height={H*0.085} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.83} y={H*0.345} width={W*0.06} height={H*0.085} rx={2} fill="#D5CCBE" />

      {/* Row 5 – between 46% and 54% */}
      <Rect x={W*0.20} y={H*0.455} width={W*0.09} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={H*0.455} width={W*0.08} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.44} y={H*0.455} width={W*0.07} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.53} y={H*0.455} width={W*0.07} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={H*0.455} width={W*0.06} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={H*0.455} width={W*0.09} height={H*0.075} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.83} y={H*0.455} width={W*0.06} height={H*0.075} rx={2} fill="#D5CCBE" />

      {/* Row 6 – between 56% and 62% */}
      <Rect x={W*0.20} y={H*0.56} width={W*0.09} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={H*0.56} width={W*0.08} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.44} y={H*0.56} width={W*0.07} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={H*0.56} width={W*0.06} height={H*0.05} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.71} y={H*0.56} width={W*0.09} height={H*0.05} rx={2} fill="#D5CCBE" />

      {/* Row 7 – between 70% and 78% */}
      <Rect x={W*0.20} y={H*0.715} width={W*0.09} height={H*0.06} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.32} y={H*0.715} width={W*0.08} height={H*0.06} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.44} y={H*0.715} width={W*0.07} height={H*0.06} rx={2} fill="#D5CCBE" />
      <Rect x={W*0.63} y={H*0.715} width={W*0.06} height={H*0.06} rx={2} fill="#D5CCBE" />

      {/* ── Route overlay ─────────────────────────────────────────── */}
      {showRoute && (
        <>
          {[0.78, 0.71, 0.64, 0.57, 0.49, 0.41, 0.35].map((y, i) => (
            <Circle key={i} cx={W * 0.50} cy={H * y} r={4} fill="#00B14F" opacity={0.85} />
          ))}
          {/* Origin pin */}
          <Circle cx={W * 0.50} cy={H * 0.82} r={10} fill="#00B14F" />
          <Circle cx={W * 0.50} cy={H * 0.82} r={4} fill="#FFFFFF" />
          {/* Destination pin */}
          <Circle cx={W * 0.50} cy={H * 0.28} r={10} fill="#1A73E8" />
          <Circle cx={W * 0.50} cy={H * 0.28} r={4} fill="#FFFFFF" />
        </>
      )}
    </Svg>
  );
}
