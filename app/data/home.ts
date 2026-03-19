export const homeData = {
  hero: {
    badge: "AlloChat",
    title: "Real-time chat, rooms, and calls in one place.",
    description: "Build communities with instant messaging, voice/video calls, profiles, and gamification powered by Next.js + Convex.",
    primaryButton: { text: "Get Started", href: "/sign-up" },
    secondaryButton: { text: "Sign In", href: "/sign-in" },
    tertiaryButton: { text: "Explore Lobby", href: "/lobby" }
  },
  features: [
    {
      icon: "solar:chat-round-dots-linear",
      title: "Realtime Messaging",
      description: "Low-latency room chat with reactions and mentions."
    },
    {
      icon: "solar:phone-calling-rounded-linear",
      title: "Voice & Video",
      description: "Join room calls with reliable signaling and quality controls."
    },
    {
      icon: "solar:users-group-rounded-linear",
      title: "Community Rooms",
      description: "Create public or private spaces with moderation controls."
    },
    {
      icon: "solar:medal-ribbons-star-linear",
      title: "Gamification",
      description: "Levels, badges, streaks, and leaderboards to boost engagement."
    }
  ],
  footer: {
    left: "AlloChat",
    right: "Next.js + Convex + Base UI"
  }
};
