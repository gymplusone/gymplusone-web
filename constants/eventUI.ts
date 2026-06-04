/**
 * Shared visual tokens for event list, detail hero, and related surfaces.
 */

import type { ViewStyle } from 'react-native';
import { radius, spacing } from '@/constants/Theme';

/** Primary CTA in `ScreenFooterBar` — matches Private Event “Create Now”. */
export const FOOTER_PRIMARY_CTA_BUTTON_STYLE: ViewStyle = {
  borderRadius: radius.full,
  paddingVertical: spacing.xs,
};

export const EVENT_ICON_WELL_BG = 'rgba(196, 181, 253, 0.22)';

export const EVENT_LIST_ICON_WELL_SIZE = 52;

export const EVENT_HERO_ICON_WELL_SIZE = 56;

export const EVENT_HERO_HEIGHT = 220;

export const EVENT_MAP_PREVIEW_HEIGHT = 180;
