import { GalleryIcon } from "@/components/icons/GalleryIcon";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_LENGTH = 280;
/** Prototype: replace with signed-in user profile image when available. */
const USER_AVATAR_PLACEHOLDER = require("@/assets/images/gym/2149278038.jpg");

type HomeComposerProps = {
  onSubmit: (text: string, imageUri?: string) => void;
  placeholder?: string;
};

export function HomeComposer({
  onSubmit,
  placeholder = "What's your gym win today?",
}: HomeComposerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const inlineTriggerRef = useRef<TextInput>(null);
  const inlineFocusArmedRef = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const canPost = text.trim().length > 0 || imageUri != null;

  useEffect(() => {
    if (!modalOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, [modalOpen]);

  const resetDraft = useCallback(() => {
    setText("");
    setImageUri(null);
  }, []);

  const closeModal = useCallback(() => {
    Keyboard.dismiss();
    setModalOpen(false);
    resetDraft();
  }, [resetDraft]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const clearImage = useCallback(() => setImageUri(null), []);

  const submit = useCallback(() => {
    if (!canPost) return;
    onSubmit(text, imageUri ?? undefined);
    Keyboard.dismiss();
    setModalOpen(false);
    resetDraft();
  }, [canPost, imageUri, onSubmit, resetDraft, text]);

  return (
    <View style={styles.wrap}>
      <View style={styles.main}>
        <Image source={USER_AVATAR_PLACEHOLDER} style={styles.userAvatar} />
        <TextInput
          ref={inlineTriggerRef}
          value=""
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.triggerInput}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          onTouchStart={() => {
            inlineFocusArmedRef.current = true;
          }}
          onFocus={() => {
            if (!inlineFocusArmedRef.current) {
              inlineTriggerRef.current?.blur();
              return;
            }
            inlineFocusArmedRef.current = false;
            setModalOpen(true);
            requestAnimationFrame(() => inlineTriggerRef.current?.blur());
          }}
          onBlur={() => {
            inlineFocusArmedRef.current = false;
          }}
        />

        {/* add the image upload icon here */}
        <Pressable onPress={pickImage}>
          <GalleryIcon color={colors.text} size={20} />
        </Pressable>
      </View>

      <Modal
        visible={modalOpen}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalSafe} edges={["top", "bottom"]}>
          <KeyboardAvoidingView
            style={styles.modalKeyboard}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.headerSide, styles.headerSideLeft]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  onPress={closeModal}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.headerBtn,
                    pressed && styles.headerBtnPressed,
                  ]}
                >
                  <Text style={styles.headerCancel}>Cancel</Text>
                </Pressable>
              </View>
              <View style={styles.headerCenter}>
                <Text style={styles.modalTitle}>New post</Text>
              </View>
              <View style={[styles.headerSide, styles.headerSideRight]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Post"
                  onPress={submit}
                  disabled={!canPost}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.headerPostWrap,
                    pressed && canPost && styles.headerPostWrapPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.headerPost,
                      !canPost && styles.headerPostDisabled,
                    ]}
                  >
                    Post
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalComposerRow}>
                <Image
                  source={USER_AVATAR_PLACEHOLDER}
                  style={styles.modalComposerAvatar}
                />
                <TextInput
                  ref={inputRef}
                  style={styles.modalInput}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.primary}
                  cursorColor={colors.primary}
                  multiline
                  maxLength={MAX_LENGTH}
                  value={text}
                  onChangeText={setText}
                  textAlignVertical="top"
                />
              </View>

              {imageUri != null ? (
                <View style={styles.previewRow}>
                  <View style={styles.previewThumbWrap}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.previewThumb}
                      resizeMode="cover"
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Remove photo"
                      onPress={clearImage}
                      style={({ pressed }) => [
                        styles.removePhotoBtn,
                        pressed && styles.removePhotoBtnPressed,
                      ]}
                      hitSlop={8}
                    >
                      <Text style={styles.removePhotoText}>×</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.modalToolbar}>
              <Text style={styles.counter}>
                {text.length}/{MAX_LENGTH}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add photo"
                onPress={pickImage}
                style={({ pressed }) => [
                  styles.iconBtn,
                  pressed && styles.iconBtnPressed,
                ]}
                hitSlop={8}
              >
                <GalleryIcon color={colors.text} size={24} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  wrap: {
    // marginBottom: spacing.md,
    marginHorizontal: -spacing.lg,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface + "80",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  triggerInput: {
    ...typography.subhead,
    color: colors.textMuted,
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalKeyboard: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  headerSide: {
    width: 76,
    flexDirection: "row",
    alignItems: "center",
  },
  headerSideLeft: { justifyContent: "flex-start" },
  headerSideRight: { justifyContent: "flex-end" },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtn: { paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
  headerBtnPressed: { opacity: 0.7 },
  headerCancel: { ...typography.body, color: colors.primary },
  modalTitle: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: "center",
  },
  headerPostWrap: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  headerPostWrapPressed: { opacity: 0.88 },
  headerPost: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  headerPostDisabled: {
    color: colors.textMuted,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  modalComposerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  modalComposerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  modalInput: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    minHeight: 40,
    maxHeight: 320,
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
  },
  previewRow: {
    marginTop: spacing.xs,
    marginLeft: 40 + spacing.sm,
  },
  previewThumbWrap: {
    alignSelf: "flex-start",
    position: "relative",
  },
  previewThumb: {
    width: 120,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  removePhotoBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  removePhotoBtnPressed: { opacity: 0.85 },
  removePhotoText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: -2,
  },
  modalToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  counter: { ...typography.caption, color: colors.textMuted },
  iconBtn: { padding: spacing.xs },
  iconBtnPressed: { opacity: 0.7 },
  });
}
