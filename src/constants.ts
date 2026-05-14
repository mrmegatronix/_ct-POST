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
  { name: "Printer Friendly (White)", bg: "#FFFFFF", text: "#000000", accent: COLORS.gold },
  { name: "Printer Friendly (Light Gray)", bg: "#F4F4F5", text: "#18181B", accent: COLORS.gold },
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
  { name: "A3 Poster", width: 600, height: 900, label: "A3 Poster (2cm Gutter)" },
  { name: "Social", width: 800, height: 800, label: "Social Media (1:1)" },
];

export type PosterTheme = "tavern" | "social_club" | "both";

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
  qrPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  qrShape?: 'square' | 'rounded' | 'circle';
  qrLogo?: boolean;
  eventDate?: string;
  eventTime?: string;
  logoType: "default" | "minimal";
  showLogo: boolean;
  size: "A4" | "A3 Poster" | "Social" | string;
  image?: string;
  imageScale: number;
  imageOffset: { x: number; y: number };
  foregroundImage?: string;
  foregroundScale?: number;
  foregroundOffset?: { x: number; y: number };
  solidBackgroundHeight?: number;
  contentScale: number;
  contentVerticalPosition?: number;
  overlayOpacity: number;
  referenceImage?: string;
  referenceOpacity?: number;
  titleAlign?: 'left' | 'center' | 'right';
  subtitleAlign?: 'left' | 'center' | 'right';
  detailsAlign?: 'left' | 'center' | 'right';
  footerAlign?: 'left' | 'center' | 'right';
  titleColor?: string;
  subtitleColor?: string;
  detailsColor?: string;
  footerColor?: string;
  logoColor?: string;
  logoAccent?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

export const LAYOUT_SAMPLES = [
  { name: "Burger Night", path: "/samples/2025-CT-BURGER-NIGHT-THURSDAYS-595x842.jpg" },
  { name: "Happy Hours", path: "/samples/2025-CT-HAPPY-HOURS-THUR-and-FRI-595x842.jpg" },
  { name: "Rump Steak", path: "/samples/2025-CT-RUMP-STEAK-595x842.jpg" },
  { name: "Fundraiser Quiz", path: "/samples/CAR-FundraiserQuiz-WebPoster.png" },
  { name: "Chase The Ace", path: "/samples/CT-ChaseTheAce-WebPoster.png" },
  { name: "Sunday Special", path: "/samples/CT-SundaySpecial-DIGI-Web-595x842.png" },
  { name: "Wings Trivia", path: "/samples/CT-WingsTrivia_WebPoster-595x842.jpg" },
  { name: "Web Template", path: "/samples/Wordpress-Web-Image-24.png" }
];

export const INITIAL_POSTER: PosterData = {
  id: "initial",
  title: "Sunday Roast",
  subtitle: "2 COURSE $30 | 3 COURSE $35",
  details: "Book a spot now\ncoasterstavern.co.nz",
  footer: "coasterstavern.co.nz",
  theme: "tavern",
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  accentColor: COLORS.gold,
  qrUrl: "https://coasterstavern.co.nz",
  qrColor: COLORS.black,
  qrPosition: 'bottom-right',
  qrShape: 'rounded',
  qrLogo: true,
  eventDate: "Every Thursday",
  eventTime: "From 7:00 PM",
  logoType: "default",
  showLogo: true,
  size: "A3 Poster",
  imageScale: 1,
  imageOffset: { x: 0, y: 0 },
  foregroundScale: 1,
  foregroundOffset: { x: 0, y: 0 },
  contentScale: 1,
  solidBackgroundHeight: 50,
  contentVerticalPosition: 50,
  overlayOpacity: 0.2,
  referenceOpacity: 0.5,
  titleAlign: 'center',
  subtitleAlign: 'center',
  detailsAlign: 'center',
  footerAlign: 'center',
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
};
