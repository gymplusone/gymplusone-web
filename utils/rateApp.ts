import * as StoreReview from "expo-store-review";
import { Alert } from "react-native";

/**
 * Triggers the system in-app review sheet when the OS allows it (store build,
 * quotas, etc.). Otherwise shows a short demo fallback.
 */
export async function requestAppRating(): Promise<void> {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return;
    }
  } catch {
    // Fall through to alert.
  }

  Alert.alert(
    "Rate GYM +1",
    "Ratings aren’t available in this environment (for example Simulator, web, or Expo Go). When the app is on the App Store or Google Play, you’ll be able to leave a review there.",
    [{ text: "OK" }],
  );
}
