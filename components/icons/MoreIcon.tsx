import Svg, { Circle } from 'react-native-svg';

/** Horizontal ··· menu — solid dots (filled), aligned to `more.svg` positions. */
export function MoreIcon({
  color,
  size = 24,
}: {
  color: string;
  size?: number;
}) {
  const r = 2;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={12} r={r} fill={color} />
      <Circle cx={12} cy={12} r={r} fill={color} />
      <Circle cx={19} cy={12} r={r} fill={color} />
    </Svg>
  );
}
