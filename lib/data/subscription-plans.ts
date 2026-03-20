export type SubscriptionTier = 'free' | 'premium' | 'pro' | 'elite' | 'vip';

export type SubscriptionPlan = {
  id: SubscriptionTier;
  name: string;
  price: number; // USD/month
  priceAnnual: number; // USD/month billed annually
  stripePriceId: string;
  stripeAnnualPriceId: string;
  color: string;
  badge: string;
  description: string;
  features: string[];
  limits: {
    rooms: number; // -1 = unlimited
    roomMembers: number;
    fileUploadMB: number;
    callParticipants: number;
    messageHistory: number; // days, -1 = unlimited
    customStatus: boolean;
    badges: boolean;
    nameEffects: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
  };
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    stripePriceId: '',
    stripeAnnualPriceId: '',
    color: '#6b7280',
    badge: '🆓',
    description: 'Get started with AlloChat',
    features: [
      'Up to 5 public rooms',
      '500MB file storage',
      'Standard emojis & reactions',
      '30-day message history',
      'Basic profile customization',
      '1:1 voice & video calls',
    ],
    limits: {
      rooms: 5,
      roomMembers: 50,
      fileUploadMB: 10,
      callParticipants: 2,
      messageHistory: 30,
      customStatus: false,
      badges: true,
      nameEffects: false,
      apiAccess: false,
      whiteLabel: false,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    priceAnnual: 3.99,
    stripePriceId: 'price_premium_monthly',
    stripeAnnualPriceId: 'price_premium_annual',
    color: '#8b5cf6',
    badge: '⭐',
    description: 'For active community members',
    features: [
      'Up to 20 rooms',
      '5GB file storage',
      'Custom status with emoji',
      'Unlimited message history',
      'Profile themes & name colors',
      'Group calls up to 10 people',
      'Ad-free experience',
      'Priority support',
    ],
    limits: {
      rooms: 20,
      roomMembers: 200,
      fileUploadMB: 50,
      callParticipants: 10,
      messageHistory: -1,
      customStatus: true,
      badges: true,
      nameEffects: true,
      apiAccess: false,
      whiteLabel: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    priceAnnual: 7.99,
    stripePriceId: 'price_pro_monthly',
    stripeAnnualPriceId: 'price_pro_annual',
    color: '#f59e0b',
    badge: '🔥',
    description: 'For power users & room owners',
    features: [
      'Unlimited rooms',
      '50GB file storage',
      'All Premium features',
      'Group calls up to 50 people',
      'Analytics dashboard',
      'Room scheduling & events',
      'Plugin marketplace access',
      'Animated name effects',
      'API access (10K req/day)',
    ],
    limits: {
      rooms: -1,
      roomMembers: 1000,
      fileUploadMB: 200,
      callParticipants: 50,
      messageHistory: -1,
      customStatus: true,
      badges: true,
      nameEffects: true,
      apiAccess: true,
      whiteLabel: false,
    },
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 29.99,
    priceAnnual: 24.99,
    stripePriceId: 'price_elite_monthly',
    stripeAnnualPriceId: 'price_elite_annual',
    color: '#ef4444',
    badge: '👑',
    description: 'For businesses & large communities',
    features: [
      'Everything in Pro',
      '500GB file storage',
      'Unlimited call participants',
      'White-label branding',
      'Custom domain',
      'Dedicated support',
      'SLA guarantee',
      'Unlimited API access',
      'Advanced analytics',
      'Custom integrations',
    ],
    limits: {
      rooms: -1,
      roomMembers: -1,
      fileUploadMB: 1000,
      callParticipants: -1,
      messageHistory: -1,
      customStatus: true,
      badges: true,
      nameEffects: true,
      apiAccess: true,
      whiteLabel: true,
    },
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 0,
    priceAnnual: 0,
    stripePriceId: '',
    stripeAnnualPriceId: '',
    color: '#10b981',
    badge: '💎',
    description: 'Special tier granted by administrators',
    features: [
      'Everything in Elite',
      'VIP exclusive badges',
      'Direct line to owners',
    ],
    limits: {
      rooms: -1,
      roomMembers: -1,
      fileUploadMB: 2000,
      callParticipants: -1,
      messageHistory: -1,
      customStatus: true,
      badges: true,
      nameEffects: true,
      apiAccess: true,
      whiteLabel: true,
    },
  },
];

export const PLAN_MAP = Object.fromEntries(SUBSCRIPTION_PLANS.map((p) => [p.id, p]));
