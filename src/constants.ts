/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const COLORS = {
  gold: "#CBA844",
  black: "#000000",
  white: "#FFFFFF",
  midnight: "#1D1714",
  stone: "#DDD4C2",
  cream: "#F9F7F4",
  pine: "#344A3C",
  sapphire: "#003A59",
  sage: "#AFBBAF",
  steel: "#A5BAC8",
  crimson: "#7B2B3B",
  tangerine: "#EC5C2F",
  blush: "#EACBC1",
  salmon: "#F8A890",
};

export const COLOR_PALETTES = [
  { name: "Official Black & Gold", bg: COLORS.black, text: COLORS.white, accent: COLORS.gold },
  { name: "Midnight Social", bg: COLORS.midnight, text: COLORS.cream, accent: COLORS.gold },
  { name: "Sunday Roast", bg: "#1A1512", text: COLORS.cream, accent: COLORS.gold }, // Based on your sample
  { name: "Chase the Ace", bg: "#0D2B45", text: "#D0E1F9", accent: "#FFD700" }, // Based on your sample
  { name: "Halloween Haunt", bg: "#0F0F0F", text: "#FF7518", accent: "#BC13FE" },
  { name: "Merry Christmas", bg: "#0B3D1D", text: "#FFFFFF", accent: "#C41E3A" },
  { name: "Racing Carnival", bg: "#2E5A27", text: COLORS.white, accent: COLORS.gold },
  { name: "New Years Eve", bg: COLORS.midnight, text: COLORS.white, accent: "#E5E4E2" },
];

export const FONTS = {
  header: "'IvyPresto Headline', serif",
  body: "'Basic Sans', sans-serif",
};

export type PosterSize = {
  name: string;
  width: number; // pixels (scaled for preview)
  height: number;
  label: string;
};

export const POSTER_SIZES: PosterSize[] = [
  { name: "A4", width: 595, height: 842, label: "A4 (4cm Gutter)" },
  { name: "Poster", width: 600, height: 900, label: "Standard Poster" },
  { name: "Social", width: 800, height: 800, label: "Social Media (1:1)" },
];

export type PosterTheme = "tavern" | "social_club";

export interface PosterData {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  price?: string;
  footer?: string;
  theme: PosterTheme;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  qrUrl: string;
  qrColor: string;
  qrPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  eventDate?: string;
  eventTime?: string;
  logoType: "default" | "minimal";
  size: string;
  image?: string;
  imageScale: number;
  imageOffset: { x: number; y: number };
  contentScale: number;
  overlayOpacity: number;
}

export const INITIAL_POSTER: PosterData = {
  id: "initial",
  title: "Sunday Roast",
  subtitle: "2 COURSE $30 | 3 COURSE $35",
  details: "Book a spot now\ncoasterstavern.co.nz",
  theme: "tavern",
  backgroundColor: COLORS.crimson,
  textColor: COLORS.white,
  accentColor: COLORS.gold,
  qrUrl: "https://coasterstavern.co.nz",
  qrColor: COLORS.black,
  qrPosition: 'bottom-right',
  eventDate: "Every Thursday",
  eventTime: "From 7:00 PM",
  logoType: "default",
  size: "Poster",
  imageScale: 1,
  imageOffset: { x: 0, y: 0 },
  contentScale: 1,
  overlayOpacity: 0.2,
};
