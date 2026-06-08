import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export type PaymentMode = "super" | "spotlight" | "meal_plan";

interface PremiumPaymentModalProps {
  visible: boolean;
  mode: PaymentMode;
  planName?: string;
  priceLabel?: string;
  onClose: () => void;
  onSuccess: (tierName: string, price: string) => void;
}

export function PremiumPaymentModal({
  visible,
  mode,
  planName = "",
  priceLabel = "",
  onClose,
  onSuccess
}: PremiumPaymentModalProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<"select" | "apple_pay" | "card_entry" | "success">("select");
  const [selectedTier, setSelectedTier] = useState(0);

  // Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("Month");
  const [cardExpiryYear, setCardExpiryYear] = useState("Year");
  const [cardCvv, setCardCvv] = useState("");

  const superTiers = [
    { name: "1 Month", price: "£11.00", desc: "Most flexible" },
    { name: "3 Months", price: "£26.00", desc: "Best Value" },
    { name: "1 Year", price: "£66.00", desc: "Save 50%" }
  ];

  const spotlightTiers = [
    { name: "1 Hour", price: "£4.99", desc: "Get matches quick" },
    { name: "24 Hours", price: "£14.99", desc: "Maximum visibility" }
  ];

  const tiers = mode === "super" ? superTiers : mode === "spotlight" ? spotlightTiers : [];

  // Reset state on open
  useEffect(() => {
    if (visible) {
      setStep(mode === "meal_plan" ? "apple_pay" : "select");
      setSelectedTier(0);
      setCardName("");
      setCardNumber("");
      setCardExpiryMonth("Month");
      setCardExpiryYear("Year");
      setCardCvv("");
    }
  }, [visible, mode]);

  const activePlanName = mode === "meal_plan" ? planName : tiers[selectedTier]?.name + " " + (mode === "super" ? "Super +1" : "Spotlight");
  const activePrice = mode === "meal_plan" ? priceLabel : tiers[selectedTier]?.price;

  const handleCardNumberChange = (text: string) => {
    // Format card number to have spaces every 4 characters
    const cleaned = text.replace(/\s?/g, "");
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += cleaned[i];
    }
    setCardNumber(formatted.substring(0, 19));
  };

  const handlePay = () => {
    setStep("success");
  };

  const handleSuccessClose = () => {
    onSuccess(activePlanName, activePrice);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/60 justify-end"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <View className="bg-surface rounded-t-xxl border-t border-border overflow-hidden">
          <View style={{ paddingBottom: insets.bottom + 16 }} className="px-6 pt-5">
            {/* Header */}
            {step !== "success" && (
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text font-bold text-lg">
                  {step === "select" && (mode === "super" ? "Become a Super +1" : "Boost with Spotlight")}
                  {step === "apple_pay" && "Confirm Payment"}
                  {step === "card_entry" && "Card Details"}
                </Text>
                <Pressable onPress={onClose} className="p-1">
                  <Ionicons name="close" size={24} className="text-textMuted" />
                </Pressable>
              </View>
            )}

            {/* Step 1: Select Tier */}
            {step === "select" && (
              <View className="mb-4">
                <Text className="text-textSecondary mb-4 text-sm">
                  {mode === "super" 
                    ? "Unlock premium filters, see who liked you, and send direct gym partner requests."
                    : "Become a spotlight profile to show up first in search and find partners faster."}
                </Text>
                
                {/* Subscription Options */}
                <View className="gap-3 mb-6">
                  {tiers.map((t, idx) => (
                    <Pressable
                      key={t.name}
                      onPress={() => setSelectedTier(idx)}
                      className={`flex-row justify-between items-center p-4 rounded-md border ${
                        selectedTier === idx ? "border-primary bg-primary/5" : "border-border bg-surfaceElevated"
                      }`}
                    >
                      <View>
                        <Text className="text-text font-semibold text-base">{t.name}</Text>
                        <Text className="text-textMuted text-xs mt-1">{t.desc}</Text>
                      </View>
                      <Text className="text-primary font-bold text-base">{t.price}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Continue/Pay buttons */}
                <Pressable
                  onPress={() => setStep("apple_pay")}
                  className="bg-black py-3.5 rounded-full items-center justify-center flex-row mb-3"
                >
                  <Text className="text-white font-bold text-base"> Pay</Text>
                </Pressable>
                
                <Pressable
                  onPress={() => setStep("card_entry")}
                  className="bg-surfaceElevated border border-border py-3 rounded-full items-center justify-center"
                >
                  <Text className="text-text font-semibold text-sm">Pay with Card</Text>
                </Pressable>
              </View>
            )}

            {/* Step 2: Apple Pay Sheet */}
            {step === "apple_pay" && (
              <View className="mb-4">
                {/* Card representation */}
                <View className="border border-border rounded-lg p-4 bg-surfaceElevated mb-6">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-text font-bold text-sm"> Pay Summary</Text>
                    <Ionicons name="logo-apple" size={20} className="text-text" />
                  </View>
                  <View className="flex-row justify-between py-1 border-b border-border/40">
                    <Text className="text-textMuted text-xs">Product</Text>
                    <Text className="text-text text-xs font-medium">{activePlanName}</Text>
                  </View>
                  <View className="flex-row justify-between py-2 items-center">
                    <Text className="text-text font-bold text-sm">Total Amount</Text>
                    <Text className="text-primary font-black text-base">{activePrice}</Text>
                  </View>
                </View>

                <Text className="text-textMuted text-center text-xs mb-6">
                  Double-click the side button to complete simulated purchase
                </Text>

                <Pressable
                  onPress={handlePay}
                  className="bg-primary py-3.5 rounded-full items-center justify-center"
                >
                  <Text className="text-white font-bold text-base">Confirm Pay</Text>
                </Pressable>

                <Pressable
                  onPress={() => setStep(mode === "meal_plan" ? "apple_pay" : "select")}
                  className="mt-3 py-2 items-center"
                >
                  <Text className="text-textMuted text-xs font-semibold">Change Payment Method</Text>
                </Pressable>
              </View>
            )}

            {/* Step 3: Card Details Form */}
            {step === "card_entry" && (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} className="mb-2">
                <Text className="text-textMuted text-xs uppercase tracking-wider mb-2">Payment Details</Text>
                <View className="flex-row gap-1 items-center mb-4 border border-border/60 rounded-md p-2 bg-surfaceElevated">
                  <Ionicons name="card" size={20} className="text-primary" />
                  <Text className="text-textSecondary text-xs">Visa / Mastercard / Amex accepted</Text>
                </View>

                <Text className="text-textSecondary font-semibold text-xs mb-1.5">Name on card</Text>
                <TextInput
                  placeholder="e.g. Eleanor Pena"
                  placeholderTextColor="#9CA3AF"
                  value={cardName}
                  onChangeText={setCardName}
                  className="border border-border rounded-md p-3 text-text mb-4 bg-surface"
                />

                <Text className="text-textSecondary font-semibold text-xs mb-1.5">Card number</Text>
                <TextInput
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  className="border border-border rounded-md p-3 text-text mb-4 bg-surface"
                />

                <View className="flex-row gap-4 mb-6">
                  <View className="flex-1">
                    <Text className="text-textSecondary font-semibold text-xs mb-1.5">Card Expiration</Text>
                    <View className="flex-row gap-2">
                      <TextInput
                        placeholder="MM"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        maxLength={2}
                        className="border border-border rounded-md p-3 text-text flex-1 text-center bg-surface"
                      />
                      <TextInput
                        placeholder="YY"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        maxLength={2}
                        className="border border-border rounded-md p-3 text-text flex-1 text-center bg-surface"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-textSecondary font-semibold text-xs mb-1.5">Card Security Code</Text>
                    <TextInput
                      placeholder="CVC"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={3}
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      className="border border-border rounded-md p-3 text-text text-center bg-surface"
                    />
                  </View>
                </View>

                <Pressable
                  onPress={handlePay}
                  disabled={!cardName || cardNumber.length < 15}
                  className={`py-3.5 rounded-full items-center justify-center ${
                    cardName && cardNumber.length >= 15 ? "bg-black" : "bg-borderLight"
                  }`}
                >
                  <Text className={`font-bold text-base ${
                    cardName && cardNumber.length >= 15 ? "text-white" : "text-textMuted"
                  }`}>
                    Buy ({activePrice})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setStep("select")}
                  className="mt-3 py-2 items-center"
                >
                  <Text className="text-textMuted text-xs font-semibold">Back</Text>
                </Pressable>
              </ScrollView>
            )}

            {/* Step 4: Purchase Success */}
            {step === "success" && (
              <View className="items-center py-8">
                {/* Success Icon Badge */}
                <View className="bg-primary/10 border border-primary p-5 rounded-full mb-6">
                  <Ionicons name="checkmark-circle" size={54} className="text-primary" />
                </View>
                
                <Text className="text-text font-black text-2xl text-center mb-2">
                  Purchase Completed!
                </Text>
                <Text className="text-textSecondary text-center mb-8 px-4 text-sm leading-5">
                  You have successfully unlocked {activePlanName}. A confirmation email will be sent shortly.
                </Text>

                <Pressable
                  onPress={handleSuccessClose}
                  className="bg-black py-3 px-12 rounded-full items-center justify-center w-full"
                >
                  <Text className="text-white font-bold text-sm">
                    {mode === "meal_plan" ? "View Plan" : "Done"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
