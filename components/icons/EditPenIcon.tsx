import * as React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export function EditPenIcon({ size = 24, color = "#292D32" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.1999 10.4899L13.2299 8.51993L10.0199 5.30993C9.33993 4.63993 8.17993 5.11993 8.17993 6.07993V12.3099V17.9199C8.17993 18.8799 9.33993 19.3599 10.0199 18.6799L15.1999 13.4999C16.0299 12.6799 16.0299 11.3199 15.1999 10.4899Z"
        fill={color}
      />
    </Svg>
  );
}
