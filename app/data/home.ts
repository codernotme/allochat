// ─────────────────────────────────────────────────────────────────────────────
// AlloChat – Centralised homepage & shared site data
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "AlloChat",
  tagline: "Connect. Chat. Belong.",
  url: "https://allochat.app",
  socials: {
    twitter: "https://twitter.com/allochat",
    github: "https://github.com/allochat",
    discord: "https://discord.gg/allochat",
  },
};

export const nav = {
  links: [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Rooms", href: "/lobby" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Start Chatting Free", href: "/sign-up" },
};

export const hero = {
  badge: "🔥 10,000+ Active Users Right Now",
  heading: ["Real-time chat,", "rooms, and calls", "in one place."],
  subheading:
    "Build communities, make friends, and have meaningful conversations. AlloChat is your modern, safe home for instant messaging, voice and video calls — powered by Next.js & Convex.",
  primaryCta: { label: "Get Started — It's Free", href: "/sign-up" },
  secondaryCta: { label: "Sign In", href: "/sign-in" },
  ghostCta: { label: "View All Rooms →", href: "/lobby" },
  stats: [
    { value: "10K+", label: "Active Users" },
    { value: "500+", label: "Chat Rooms" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" },
  ],
};

export const features = [
  {
    icon: "solar:chat-square-2-bold",
    title: "Real-Time Messaging",
    description:
      "Lightning-fast, low-latency messaging with reactions, threads, mentions, and emoji support. Every message delivered instantly.",
    color: "from-blue-500/20 to-blue-600/5",
    accent: "text-blue-400",
  },
  {
    icon: "solar:videocamera-record-bold",
    title: "HD Voice & Video Calls",
    description:
      "Crystal-clear HD video and voice calls built right into every room. Join with one click — no extra apps or plugins required.",
    color: "from-purple-500/20 to-purple-600/5",
    accent: "text-purple-400",
  },
  {
    icon: "solar:users-group-two-rounded-bold",
    title: "Community Rooms",
    description:
      "Create public or private rooms and invite anyone. With powerful moderation tools, you stay in control of your community.",
    color: "from-green-500/20 to-green-600/5",
    accent: "text-green-400",
  },
  {
    icon: "solar:cup-star-bold",
    title: "Gamification & XP",
    description:
      "Earn XP, unlock badges, climb leaderboards and reach new levels just by being active. Staying engaged has never been more rewarding.",
    color: "from-yellow-500/20 to-yellow-600/5",
    accent: "text-yellow-400",
  },
  {
    icon: "solar:shield-check-bold",
    title: "Safe & Moderated",
    description:
      "Built-in content moderation, report systems, and community guidelines to keep AlloChat welcoming and secure for everyone.",
    color: "from-red-500/20 to-red-600/5",
    accent: "text-red-400",
  },
  {
    icon: "solar:global-bold",
    title: "Global Language Support",
    description:
      "Connect across language barriers with multi-language rooms and real-time translation. The world is your community.",
    color: "from-cyan-500/20 to-cyan-600/5",
    accent: "text-cyan-400",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds with just your email. No credit card needed. Your profile is yours — customise your avatar, bio, and status.",
    icon: "solar:user-plus-bold",
  },
  {
    step: "02",
    title: "Find or Create a Room",
    description:
      "Browse hundreds of public rooms by topic, language, or interest — or spin up your own private space in under 30 seconds.",
    icon: "solar:home-smile-bold",
  },
  {
    step: "03",
    title: "Start Chatting",
    description:
      "Send messages, join a live call, react to posts, and earn XP as you go. Every interaction makes AlloChat better for everyone.",
    icon: "solar:chat-round-line-bold",
  },
];

export const roomCategories = [
  { icon: "solar:hashtag-bold", label: "General Chat", users: "2.4K" },
  { icon: "solar:gameboy-bold", label: "Gaming Lounge", users: "1.8K" },
  { icon: "solar:music-notes-bold", label: "Music Room", users: "980" },
  { icon: "solar:notebook-bold", label: "Study Group", users: "750" },
  { icon: "solar:bag-bold", label: "Lifestyle", users: "640" },
  { icon: "solar:code-bold", label: "Tech & Dev", users: "520" },
  { icon: "solar:heart-bold", label: "Relationships", users: "1.2K" },
  { icon: "solar:earth-bold", label: "Languages", users: "890" },
];


export const testimonials = [
  {
    quote:
      "AlloChat replaced every other chat app I was using. The rooms feel alive and the video call quality is incredible.",
    author: "Jamie L.",
    role: "Community Creator",
    avatar: "JL",
  },
  {
    quote:
      "I found my closest online friends through AlloChat. The gamification keeps me coming back every day.",
    author: "Aria K.",
    role: "Level 42 Member",
    avatar: "AK",
  },
  {
    quote:
      "Running a community has never been easier. Moderation tools are top-notch and the rooms just work.",
    author: "Marcus T.",
    role: "Room Moderator",
    avatar: "MT",
  },
];

export const faqs = [
  {
    question: "Is AlloChat free to use?",
    answer:
      "Yes! AlloChat is completely free for everyone. You can join unlimited rooms, send messages, and take part in voice and video calls without paying a thing.",
  },
  {
    question: "Do I need to register to chat?",
    answer:
      "You need to create a free account to actively participate. Registration is quick — just an email address and a username.",
  },
  {
    question: "Is AlloChat safe?",
    answer:
      "Absolutely. We have automated content moderation, user-report systems, and a dedicated trust & safety team. Community guidelines apply to all rooms.",
  },
  {
    question: "Can I create my own chat room?",
    answer:
      "Yes! Any registered user can create public or private rooms. You control who joins, the topic, and moderation settings.",
  },
  {
    question: "What devices does AlloChat work on?",
    answer:
      "AlloChat is a web-based platform that works on any modern browser — desktop, tablet, or mobile. No download required.",
  },
  {
    question: "How does gamification work?",
    answer:
      "You earn XP by sending messages, joining calls, and engaging with the community. XP unlocks levels, badges, and special profile decorations.",
  },
];

export const footer = {
  tagline: "Real connections. Real conversations.",
  links: [
    {
      heading: "Platform",
      items: [
        { label: "Features", href: "/#features" },
        { label: "Chat Rooms", href: "/lobby" },
        { label: "Leaderboard", href: "/lobby" },
        { label: "Download App", href: "#" },
      ],
    },
    {
      heading: "Company",
      items: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Legal",
      items: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Refund Policy", href: "/refund" },
        { label: "Community Rules", href: "/community-rules" },
      ],
    },
  ],
  bottom: `© ${new Date().getFullYear()} AlloChat. All rights reserved.`,
};

