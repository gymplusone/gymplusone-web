import type { GymBuddyProfile } from '@/types';

const GYM_1 = require('@/assets/images/gym/2149278038.jpg');
const GYM_2 = require('@/assets/images/gym/2150165238.jpg');
const GYM_3 = require('@/assets/images/gym/2150975460.jpg');
const GYM_4 = require('@/assets/images/gym/2150399983.jpg');
const GYM_5 = require('@/assets/images/gym/2151450148.jpg');
const GYM_6 = require('@/assets/images/gym/9310.jpg');
const GYM_IMAGES = [GYM_1, GYM_2, GYM_3, GYM_4, GYM_5, GYM_6] as const;

/**
 * Match card hero image from `assets/images/gym`.
 */
export function getBuddyCardImageSource(profile: GymBuddyProfile) {
  const idNum = parseInt(profile.id, 10);
  const seed =
    profile.cardBackgroundImage === 2 ? 1 : profile.cardBackgroundImage === 1 ? 0 : idNum - 1;
  const idx = Number.isFinite(seed) ? Math.abs(seed) % GYM_IMAGES.length : 0;
  return GYM_IMAGES[idx];
}

/** Different gym asset for second story block in profile details. */
export function getBuddyCardImageSourceAlt(profile: GymBuddyProfile) {
  const idNum = parseInt(profile.id, 10);
  const baseIdx = Number.isFinite(idNum) ? Math.abs(idNum - 1) % GYM_IMAGES.length : 0;
  return GYM_IMAGES[(baseIdx + 1) % GYM_IMAGES.length];
}
