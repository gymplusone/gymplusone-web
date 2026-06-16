// components/buddies/SpotlightModal.tsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const spotlightImg = require("@/assets/spotlight.png");

type SpotlightModalProps = {
  visible: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
};

export function SpotlightModal({ visible, onClose, onUpgrade }: SpotlightModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<"1month" | "3month" | "6month">("1month");

  const plans = {
    "1month": {
      price: "£25.00",
      features: [
        "Unlimited likes and matches",
        "45 minutes spotlight visibility",
        "View invitees on a see invitees' profiles",
        "View full thread of other users' posts",
        "Premium profile (increased visibility)",
      ],
    },
    "3month": {
      price: "£60.00",
      features: [
        "Unlimited likes and matches",
        "2 hours spotlight visibility",
        "View invitees on a see invitees' profiles",
        "View full thread of other users' posts",
        "Premium profile (increased visibility)",
        "Priority support",
      ],
    },
    "6month": {
      price: "£100.00",
      features: [
        "Unlimited likes and matches",
        "4 hours spotlight visibility",
        "View invitees on a see invitees' profiles",
        "View full thread of other users' posts",
        "Premium profile (increased visibility)",
        "Priority support",
        "Exclusive events access",
      ],
    },
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
            <Text style={styles.headerTitle}>Spotlight</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroImageContainer}>
                <Image source={spotlightImg} style={styles.heroImage} resizeMode="contain" />
              </View>
              <Text style={styles.heroTitle}>Become a Super PT</Text>
              <Text style={styles.heroSubtitle}>
                Unlimited likes, 1 hour spotlight a month, view invitations (see invitees biography)
              </Text>
            </View>

            {/* Plan Selection */}
            <View style={styles.planSection}>
              <View style={styles.planTabs}>
                <TouchableOpacity
                  style={[styles.planTab, selectedPlan === "1month" && styles.planTabActive]}
                  onPress={() => setSelectedPlan("1month")}
                >
                  <Text style={[styles.planTabText, selectedPlan === "1month" && styles.planTabTextActive]}>
                    1 Month
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.planTab, selectedPlan === "3month" && styles.planTabActive]}
                  onPress={() => setSelectedPlan("3month")}
                >
                  <Text style={[styles.planTabText, selectedPlan === "3month" && styles.planTabTextActive]}>
                    3 Months
                  </Text>
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.planTab, selectedPlan === "6month" && styles.planTabActive]}
                  onPress={() => setSelectedPlan("6month")}
                >
                  <Text style={[styles.planTabText, selectedPlan === "6month" && styles.planTabTextActive]}>
                    6 Months
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.planCard}>
                <Text style={styles.planPrice}>{plans[selectedPlan].price}</Text>
                <View style={styles.featuresList}>
                  {plans[selectedPlan].features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#0001FF" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity 
                  style={styles.upgradeBtn}
                  onPress={() => {
                    if (onUpgrade) onUpgrade();
                    onClose();
                  }}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="home" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="analytics" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
              <View style={styles.navPlusBtn}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="mail" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Invites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="chatbubble" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// components/buddies/SuperModal.tsx
type SuperModalProps = {
  visible: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
};

export function SuperModal({ visible, onClose, onUpgrade }: SuperModalProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<"intro" | "payment" | "confirmation">("intro");
  const [paymentMethod, setPaymentMethod] = useState("Visa");
  const [cardDetails, setCardDetails] = useState({
    name: "Jennie",
    number: "0000 0000 0000 0000",
    month: "2",
    year: "9",
    code: "",
  });

  const paymentMethods = ["Visa", "Mastercard", "American Express", "Discover"];

  const renderIntro = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <View style={styles.heroImageContainer}>
          <Image source={spotlightImg} style={styles.heroImage} resizeMode="contain" />
        </View>
        <Text style={styles.heroTitle}>Become a Super PT</Text>
        <Text style={styles.heroSubtitle}>
          Unlimited likes, 1 hour spotlight a month, view invitations (see invitees biography)
        </Text>
      </View>

      <View style={styles.paymentIntroSection}>
        <Text style={styles.paymentLabel}>Pay</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Or Pay Using</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Card</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.upgradeBtn}
          onPress={() => setStep("payment")}
        >
          <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPayment = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={styles.paymentTitle}>Card Details</Text>

      <View style={styles.paymentForm}>
        <Text style={styles.formLabel}>Payment Method</Text>
        <View style={styles.paymentMethodGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.paymentMethodItem, paymentMethod === method && styles.paymentMethodActive]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text style={[styles.paymentMethodText, paymentMethod === method && styles.paymentMethodTextActive]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.formLabel}>Name on card</Text>
        <TextInput
          style={styles.formInput}
          value={cardDetails.name}
          onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
          placeholder="Name on card"
        />

        <Text style={styles.formLabel}>Card number</Text>
        <TextInput
          style={styles.formInput}
          value={cardDetails.number}
          onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
          placeholder="0000 0000 0000 0000"
          keyboardType="numeric"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <Text style={styles.formLabel}>Card expiration</Text>
            <View style={styles.expirationRow}>
              <TextInput
                style={[styles.formInput, styles.smallInput]}
                value={cardDetails.month}
                onChangeText={(text) => setCardDetails({ ...cardDetails, month: text })}
                placeholder="Month"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.formInput, styles.smallInput]}
                value={cardDetails.year}
                onChangeText={(text) => setCardDetails({ ...cardDetails, year: text })}
                placeholder="Year"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.formLabel}>Card Security Code</Text>
            <View style={styles.securityRow}>
              <TextInput
                style={[styles.formInput, styles.codeInput]}
                value={cardDetails.code}
                onChangeText={(text) => setCardDetails({ ...cardDetails, code: text })}
                placeholder="Code"
                keyboardType="numeric"
                secureTextEntry
              />
              <TouchableOpacity style={styles.infoBtn}>
                <Ionicons name="help-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.buyBtn}
          onPress={() => setStep("confirmation")}
        >
          <Text style={styles.buyBtnText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderConfirmation = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationIcon}>
        <Ionicons name="checkmark-circle" size={80} color="#0001FF" />
      </View>
      <Text style={styles.confirmationTitle}>Purchase Complete!</Text>
      <Text style={styles.confirmationSubtitle}>
        You now have the following for a month:
      </Text>
      <View style={styles.confirmationFeatures}>
        <View style={styles.confirmationFeature}>
          <Ionicons name="checkmark" size={20} color="#0001FF" />
          <Text style={styles.confirmationFeatureText}>Unlimited likes and matches</Text>
        </View>
        <View style={styles.confirmationFeature}>
          <Ionicons name="checkmark" size={20} color="#0001FF" />
          <Text style={styles.confirmationFeatureText}>1 hour daily spotlight visibility</Text>
        </View>
        <View style={styles.confirmationFeature}>
          <Ionicons name="checkmark" size={20} color="#0001FF" />
          <Text style={styles.confirmationFeatureText}>View invitations & see invitees' profiles</Text>
        </View>
        <View style={styles.confirmationFeature}>
          <Ionicons name="checkmark" size={20} color="#0001FF" />
          <Text style={styles.confirmationFeatureText}>View full thread of other users'</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.returnBtn}
        onPress={() => {
          setStep("intro");
          onClose();
        }}
      >
        <Text style={styles.returnBtnText}>Return</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            {step !== "intro" && (
              <Pressable onPress={() => setStep("intro")} style={styles.closeBtn}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </Pressable>
            )}
            <Text style={styles.headerTitle}>Spotlight</Text>
            {step !== "intro" && <View style={styles.headerRight} />}
          </View>

          {step === "intro" && renderIntro()}
          {step === "payment" && renderPayment()}
          {step === "confirmation" && renderConfirmation()}

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="home" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="analytics" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
              <View style={styles.navPlusBtn}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="mail" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Invites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="chatbubble" size={24} color="#9CA3AF" />
              <Text style={styles.navText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
    minHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Manrope",
  },
  headerRight: {
    width: 32,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroImageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    fontFamily: "Manrope",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Manrope",
    lineHeight: 20,
  },
  planSection: {
    marginTop: 8,
  },
  planTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  planTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    position: "relative",
  },
  planTabActive: {
    backgroundColor: "#0001FF",
  },
  planTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Manrope",
  },
  planTabTextActive: {
    color: "#fff",
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularBadgeText: {
    fontSize: 8,
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Manrope",
  },
  planCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    fontFamily: "Manrope",
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Manrope",
    flex: 1,
  },
  upgradeBtn: {
    backgroundColor: "#0001FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  upgradeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope",
  },
  paymentIntroSection: {
    gap: 16,
  },
  paymentLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Manrope",
  },
  paymentOptions: {
    flexDirection: "row",
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  paymentOptionText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Manrope",
    fontWeight: "500",
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Manrope",
    marginBottom: 20,
  },
  paymentForm: {
    gap: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Manrope",
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Manrope",
    color: "#000",
  },
  paymentMethodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  paymentMethodItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  paymentMethodActive: {
    backgroundColor: "#0001FF",
    borderColor: "#0001FF",
  },
  paymentMethodText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Manrope",
  },
  paymentMethodTextActive: {
    color: "#fff",
  },
  rowFields: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  expirationRow: {
    flexDirection: "row",
    gap: 8,
  },
  smallInput: {
    flex: 1,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  codeInput: {
    flex: 1,
  },
  infoBtn: {
    padding: 4,
  },
  buyBtn: {
    backgroundColor: "#0001FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope",
  },
  confirmationContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationIcon: {
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    fontFamily: "Manrope",
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Manrope",
    marginBottom: 24,
    textAlign: "center",
  },
  confirmationFeatures: {
    width: "100%",
    gap: 12,
    marginBottom: 32,
  },
  confirmationFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  confirmationFeatureText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Manrope",
  },
  returnBtn: {
    backgroundColor: "#0001FF",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  returnBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
    gap: 2,
  },
  navItemActive: {
    marginTop: -20,
  },
  navPlusBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0001FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0001FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  navText: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Manrope",
  },
});

