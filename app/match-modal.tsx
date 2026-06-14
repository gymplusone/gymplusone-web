import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

// We'll simulate fetching profile data using the ID
import { mockProfiles } from "@/data/mockProfiles";
const USER_AVATAR_PLACEHOLDER = require("@/assets/images/gym/2149278038.jpg");

export default function MatchModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, type } = params; // type can be "match" or "powerLike"

  const profile = mockProfiles.find((p) => p.id === id) || mockProfiles[0];
  const [message, setMessage] = useState("");

  const isMatch = type !== "powerLike";

  const handleSend = () => {
    // Send message logic
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={24} color="#000" />
      </Pressable>
      <Text style={styles.title}>About Gym+1</Text>

      <View style={styles.content}>
        <View style={styles.avatarsContainer}>
          <Image source={USER_AVATAR_PLACEHOLDER} style={styles.avatarLeft} />
          <Image source={{ uri: profile.mainImage }} style={styles.avatarRight} />
          
          <View style={[styles.badge, isMatch ? styles.badgeMatch : styles.badgePowerLike]}>
            {isMatch ? (
              <Feather name="check-circle" size={32} color="#fff" />
            ) : (
              <Text style={{ fontSize: 32 }}>⚡</Text>
            )}
          </View>
        </View>

        <Text style={styles.heading}>
          {isMatch ? "It's A Match!" : "You've sent a Power Like."}
        </Text>
        <Text style={styles.subtext}>
          {isMatch 
            ? "Now, you have 24 hours to start chatting." 
            : "You can now send them a message right away — no need to wait for a match."}
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Send a Message....."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />
          <Pressable onPress={handleSend} style={styles.sendBtn}>
            <Feather name="send" size={20} color="#0001FF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 40,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 40,
  },
  avatarsContainer: {
    flexDirection: "row",
    position: "relative",
    height: 180,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLeft: {
    width: 140,
    height: 140,
    borderRadius: 20,
    position: "absolute",
    left: 0,
  },
  avatarRight: {
    width: 140,
    height: 140,
    borderRadius: 20,
    position: "absolute",
    right: 0,
  },
  badge: {
    position: "absolute",
    bottom: -10,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  badgeMatch: {
    backgroundColor: "#0001FF",
  },
  badgePowerLike: {
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 40,
    marginBottom: 16,
  },
  subtext: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: 20,
    width: "100%",
    height: 56,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
  },
  sendBtn: {
    padding: 8,
  },
});
