import config from './brand.config.json';

type Language = keyof typeof config.tagline;

// Optional brand images: drop a file with one of these names in src/brand/assets/
// (svg, png or webp) and it is picked up; no code change needed.
const assets = import.meta.glob<string>('./assets/*.{svg,png,webp}', { eager: true, import: 'default' });

function asset(name: string): string | undefined {
  const match = Object.keys(assets).find((path) => path.replace(/^.*\/|\.[^.]+$/g, '') === name);
  return match ? assets[match] : undefined;
}

/**
 * Everything that identifies the product: name, tagline, logos, contact.
 * A white-label deployment changes brand.config.json, theme.css and assets/,
 * and nothing else.
 */
export const brand = {
  ...config,
  /** Large faded shape behind the login hero. */
  heroWatermark: asset('hero-watermark'),
  /** Logo shown above the name in the login hero. */
  heroLogo: asset('hero-logo'),
  /** Logo at the top of the sidebar; the name is rendered as text when absent. */
  sidebarLogo: asset('sidebar-logo'),
  taglineFor(language: string): string {
    const short = language.split('-')[0] as Language;
    return config.tagline[short] ?? config.tagline.en;
  },
};
