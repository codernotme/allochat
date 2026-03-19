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
  badge: "10,000+ people chatting right now",
  heading: ["Chat. Call. Connect.", "Find your people,", "wherever they are."],
  subheading:
    "AlloChat is your home for real conversations. Jump into rooms built around things you love, hop on a live call, and build friendships that actually last.",
  primaryCta: { label: "Start Chatting — It's Free", href: "/sign-up" },
  secondaryCta: { label: "Sign In", href: "/sign-in" },
  ghostCta: { label: "Explore Rooms →", href: "/lobby" },
  stats: [
    { value: "10K+", label: "Active Users" },
    { value: "500+", label: "Chat Rooms" },
    { value: "150+", label: "Countries" },
    { value: "24/7", label: "Always Online" },
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

export const stats = [
  { value: "50,000+", label: "Active Users" },
  { value: "2.4M", label: "Messages / day" },
  { value: "1,200+", label: "Active Rooms" },
  { value: "80+", label: "Countries" },
  { value: "4.9/5", label: "Avg Rating" },
];

export const pricing = {
  free: {
    name: "Free Forever",
    features: [
      "Unlimited rooms",
      "Text messaging",
      "Voice calls (up to 10 people)",
      "Basic XP & badges",
      "Mobile + web access",
    ],
  },
  pro: {
    name: "Pro",
    price: "₹199",
    period: "/mo",
    features: [
      "Everything in Free",
      "HD video calls (up to 50 people)",
      "Custom room themes",
      "Priority support",
      "Exclusive Pro badges",
      "Advanced moderation tools",
      "Analytics dashboard",
    ],
  },
};

export const comparison = [
  { feature: "Free video calls", allochat: true, discord: "Limited", slack: false },
  { feature: "Public community rooms", allochat: true, discord: true, slack: false },
  { feature: "XP Gamification", allochat: true, discord: false, slack: false },
  { feature: "No account for reading", allochat: true, discord: false, slack: false },
  { feature: "Real-time translation", allochat: true, discord: false, slack: false },
  { feature: "Built-in moderation AI", allochat: true, discord: false, slack: false },
  { feature: "Mobile web (no download)", allochat: true, discord: "Limited", slack: "Limited" },
];

export const leaderboardPreview = [
  { rank: 1, name: "Alex K.", level: 89, xp: "12,450 XP", avatar: "AK", color: "text-amber-500" },
  { rank: 2, name: "Priya M.", level: 84, xp: "11,200 XP", avatar: "PM", color: "text-slate-400" },
  { rank: 3, name: "Jay T.", level: 79, xp: "10,890 XP", avatar: "JT", color: "text-orange-700" },
  { rank: 4, name: "Sam R.", level: 71, xp: "9,340 XP", avatar: "SR", color: "text-muted-foreground" },
  { rank: 5, name: "Mia C.", level: 67, xp: "8,700 XP", avatar: "MC", color: "text-muted-foreground" },
];

export const trustSafety = [
  { icon: "solar:shield-check-bold", title: "AI Moderation", description: "Powered by real-time content scanning" },
  { icon: "solar:lock-keyhole-bold", title: "End-to-End Encryption", description: "Private messages stay private" },
  { icon: "solar:eye-bold", title: "Human Review Team", description: "Real people on call 24/7" },
  { icon: "solar:close-circle-bold", title: "Zero Tolerance Policy", description: "Hate speech removed instantly" },
];

export const communitySpotlight = [
  { title: "Gaming Lounge", description: "The most active gaming room anywhere.", members: "1,847", posts: "234", theme: "gaming" },
  { title: "Study Group", description: "Silent co-working and study sessions.", members: "950", posts: "120", theme: "study" },
  { title: "Tech & Dev", description: "Talk code, share projects, get help.", members: "1,200", posts: "450", theme: "tech" },
];
