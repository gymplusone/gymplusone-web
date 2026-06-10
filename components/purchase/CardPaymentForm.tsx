import { Button } from "@/components/Button";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSubmit: (payload: {
    name: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
  }) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function CardPaymentForm({
  onSubmit,
  onCancel,
  submitLabel = "Buy",
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const submit = () => {
    onSubmit({ name, cardNumber, expiry, cvc });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 56}
      style={styles.container}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Name on card</Text>
      </View>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="Jane Doe"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
      />

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Card number</Text>
      </View>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="0000 0000 0000 0000"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.rowSplit}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.text }]}>Expiry</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="MM/YY"
            placeholderTextColor={colors.textMuted}
            value={expiry}
            onChangeText={setExpiry}
          />
        </View>
        <View style={{ width: spacing.md }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.text }]}>CVC</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="123"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={cvc}
            onChangeText={setCvc}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <Button title={submitLabel} onPress={submit} fullWidth />
        {onCancel ? (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            fullWidth
            style={{ marginTop: spacing.sm }}
          />
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingHorizontal: spacing.lg },
    row: { marginTop: spacing.sm, marginBottom: spacing.xs },
    rowSplit: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
    label: { ...typography.caption },
    input: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      ...typography.body,
    },
    actions: { marginTop: spacing.md },
  });
}
