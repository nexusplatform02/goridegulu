import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export function HomeIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* house shell */}
      <Path
        d="M21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* smile */}
      <Path
        d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ActivityIcon({ color, size = 24 }: IconProps) {
  // Bar chart + trend line (viewBox 0 0 32 32, scaled to size)
  const s = size / 32;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {/* bars */}
      <Rect x="1"  y="20" width="6" height="7"  rx="1" ry="1" fill={color} opacity={0.6} />
      <Rect x="9"  y="15" width="6" height="12" rx="1" ry="1" fill={color} opacity={0.6} />
      <Rect x="17" y="17" width="6" height="10" rx="1" ry="1" fill={color} opacity={0.6} />
      <Rect x="25" y="11" width="6" height="16" rx="1" ry="1" fill={color} opacity={0.6} />
      {/* base floor */}
      <Path d="M31,25H1v3a3,3,0,0,0,3,3H28a3,3,0,0,0,3-3Z" fill={color} />
      {/* trend dots */}
      <Circle cx="12" cy="6"     r="3" fill={color} />
      <Circle cx="20" cy="11.99" r="3" fill={color} />
      {/* trend line segment */}
      <Rect
        x="15" y="6" width="2" height="6"
        transform="rotate(-53.14, 16, 9)"
        fill={color}
        opacity={0.8}
      />
    </Svg>
  );
}

export function WalletIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* card body */}
      <Path
        d="M20.965 9C20.8873 7.1277 20.6366 5.97975 19.8284 5.17157C18.6569 4 16.7712 4 13 4L10 4C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H13C16.7712 20 18.6569 20 19.8284 18.8284C20.6366 18.0203 20.8873 16.8723 20.965 15"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* coin pocket */}
      <Path
        d="M20.8333 9H18.2308C16.4465 9 15 10.3431 15 12C15 13.6569 16.4465 15 18.2308 15H20.8333C20.9167 15 20.9583 15 20.9935 14.9979C21.5328 14.965 21.9623 14.5662 21.9977 14.0654C22 14.0327 22 13.994 22 13.9167V10.0833C22 10.006 22 9.96726 21.9977 9.9346C21.9623 9.43384 21.5328 9.03496 20.9935 9.00214C20.9583 9 20.9167 9 20.8333 9Z"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* card line */}
      <Path d="M6 8H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* coin dot */}
      <Path d="M17.9912 12H18.0002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChatIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* bubble */}
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* dots */}
      <Path
        d="M8 12H8.009M11.991 12H12M15.991 12H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </Svg>
  );
}
