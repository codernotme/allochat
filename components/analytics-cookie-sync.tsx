'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function setClientCookie(name: string, value: string, maxAgeSeconds: number) {
  const encodedValue = encodeURIComponent(value);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodedValue}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function AnalyticsCookieSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pathWithQuery = query ? `${pathname}?${query}` : pathname;

    setClientCookie('allo_lp', pathWithQuery, 60 * 60 * 24 * 30);
    setClientCookie('allo_lh', String(Date.now()), 60 * 60 * 24 * 30);

    if (document.referrer) {
      setClientCookie('allo_ref', document.referrer, 60 * 60 * 24 * 30);
    }
  }, [pathname, searchParams]);

  return null;
}
