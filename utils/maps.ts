import { Linking } from 'react-native';

/** Opens Google Maps search for a free-text place query (no API key). */
export function openGoogleMapsSearch(query: string) {
  const q = encodeURIComponent(query.trim());
  return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
}
