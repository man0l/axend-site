import { SITE } from '../lib/site';

export interface Author {
  name: string;
  role: string;
  org: string;
  bio: string;
  /** Square headshot (>= 400px) under /public. Unset until the founder sends one: the UI shows initials. */
  photo?: string;
  sameAs: string[];
}

// Name, bio and LinkedIn are pending founder confirmation on SLA-1476. Do not add credentials that are not confirmed.
export const FOUNDER: Author = {
  name: 'Manol Trendafilov',
  role: 'Founder',
  org: 'Axend',
  bio: 'Manol Trendafilov is the founder of Axend, the grooming and self-care app behind this site. Manol builds the on-device face scan and writes and reviews the guides to the editorial standards on this page. Axend is cosmetic and self-care only, and nothing here is medical advice.',
  photo: '/founder.jpg',
  sameAs: ['https://x.com/manol_ai'],
};

export const FOUNDER_URL = `${SITE.url}/about#founder`;

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** schema.org Person. `withId` makes it referenceable from the Organization graph on /about. */
export function personLd(a: Author = FOUNDER) {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/about#founder`,
    name: a.name,
    url: FOUNDER_URL,
    jobTitle: `${a.role}, ${a.org}`,
    description: a.bio,
    ...(a.photo ? { image: new URL(a.photo, SITE.url).href } : {}),
    sameAs: a.sameAs,
    worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}
