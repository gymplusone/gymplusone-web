import { SupportTopicForm } from "@/components/contact/SupportTopicForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";

type ContactTopic = "general" | "payment" | "safety" | "technical";

const TOPIC_CONFIG: Record<
  ContactTopic,
  { title: string; description: string; placeholder: string }
> = {
  general: {
    title: "Ask a general question",
    description:
      "Send us your question about using GYM +1, your profile, or the product. We’ll follow up with the right information when support is available.",
    placeholder: "Type your question here...",
  },
  payment: {
    title: "Help with payment",
    description:
      "Tell us what happened with your payment or plan purchase. We’re here to help if you see an error, need a refund, or want support with billing details.",
    placeholder: "Describe your payment issue...",
  },
  safety: {
    title: "Report a safety concern",
    description:
      "If you have a safety concern, share the details here so we can review and respond. We prioritize safe experiences for all members.",
    placeholder: "Tell us what happened...",
  },
  technical: {
    title: "Report a technical issue",
    description:
      "Tell us about the bug, crash, or app behavior you’re seeing. The more detail you provide, the faster we can investigate.",
    placeholder: "Describe the technical issue...",
  },
};

export default function ContactTopicScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topic: string }>();
  const topic = (params.topic ?? "general") as ContactTopic;
  const config = TOPIC_CONFIG[topic] ?? TOPIC_CONFIG.general;

  const handleSubmit = (message: string) => {
    Alert.alert(
      "Submitted",
      "Your message was sent to support. We’ll get back to you soon.",
      [{ text: "OK", onPress: () => router.replace("/contact") }],
    );
  };

  return (
    <SupportTopicForm
      title={config.title}
      description={config.description}
      placeholder={config.placeholder}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitText="Submit"
    />
  );
}
