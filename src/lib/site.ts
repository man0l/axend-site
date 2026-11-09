export const SITE = {
  name: 'Axend',
  url: 'https://axendai.com',
  appStoreUrl: 'https://apps.apple.com/us/app/axend-grooming-self-care/id6788362935',
  contactEmail: 'hello@axendai.com',
  // Preview deploys set PUBLIC_NOINDEX=1; unset it at go-live.
  noindex: import.meta.env.PUBLIC_NOINDEX === '1',
};

/** App Store link with a per-page campaign token so App Store Connect shows which page drove the install. */
export function appStoreLink(ct: string): string {
  const token = ct.replace(/[^a-z0-9-]/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'home';
  return `${SITE.appStoreUrl}?pt=axendai&ct=${token}&mt=8`;
}

export const CLUSTERS = {
  improve: { slug: 'improve', label: 'Improve your score', blurb: 'Practical, self-care steps for skin, hair, jawline, posture and presentation.' },
  trust: { slug: 'how-it-works', label: 'How it works', blurb: 'How face scans work, how accurate they are, and what they cannot tell you.' },
  compare: { slug: 'compare', label: 'Comparisons', blurb: 'Honest comparisons of the kinds of attractiveness tests and face rating tools.' },
  looksmax: { slug: 'looksmax', label: 'Looksmax explained', blurb: 'Plain-language explainers on looksmaxxing terms. Cosmetic and self-care only.' },
} as const;
export type ClusterKey = keyof typeof CLUSTERS;
