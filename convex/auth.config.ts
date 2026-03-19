const normalizeDomain = (value: string) => value.replace(/\/+$/, '');

const configuredDomain =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.CONVEX_SITE_URL ||
  'http://localhost:3000';

const authConfig = {
  providers: [
    {
      domain: normalizeDomain(configuredDomain),
      applicationID: 'convex',
    },
  ],
};

export default authConfig;
