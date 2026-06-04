export type SettingsMenuItem = {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
};

export type SettingsMenuSection = {
  title: string;
  items: SettingsMenuItem[];
};

type Nav = { push: (href: string) => void };

export function getSettingsMenuSections(nav: Nav): SettingsMenuSection[] {
  return [
    {
      title: "Account",
      items: [
        {
          key: "account",
          label: "Account details",
          icon: "👤",
          onPress: () => {},
        },
        { key: "privacy", label: "Privacy", icon: "🔒", onPress: () => {} },
        {
          key: "notifications",
          label: "Notifications",
          icon: "🔔",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          key: "chats",
          label: "Chats",
          icon: "💬",
          onPress: () => nav.push("/(tabs)/messages"),
        },
        {
          key: "invite",
          label: "Invite a friend",
          icon: "🎁",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          key: "help",
          label: "Help & feedback",
          icon: "🛟",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          key: "terms",
          label: "Terms & policies",
          icon: "📄",
          onPress: () => {},
        },
        {
          key: "about",
          label: "About GYM +1",
          icon: "ℹ️",
          onPress: () => {},
        },
      ],
    },
  ];
}
