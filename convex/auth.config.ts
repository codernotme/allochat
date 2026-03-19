const normalizeDomain = (value: string) => value.trim().replace(/\/+$/, '');

const configuredDomains = [
  process.env.SITE_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.CONVEX_SITE_URL,
  'https://allochat.codernotme.studio',
  'http://localhost:3000',
]
  .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  .map(normalizeDomain);

const domains = Array.from(new Set(configuredDomains));

const authConfig = {
  providers: domains.map((domain) => ({
    domain,
    applicationID: 'convex',
  })),
};

export default authConfig;
