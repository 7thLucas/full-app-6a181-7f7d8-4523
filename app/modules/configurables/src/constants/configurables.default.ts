/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultPastry = {
  name: string;
  photoUrl: string;
  emoji?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline: string;
  logoUrl: string;
  brandColor: TBrandColor;
  soldTodayHeading: string;
  soldTodaySubheading: string;
  insightHeading: string;
  insightSubheading: string;
  loginWelcome: string;
  enableUndo: boolean;
  showBestsellerBadges: boolean;
  gridColumns: number;
  defaultPastries: TDefaultPastry[];
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Crumb",
  tagline: "Tap-fast sold-today tracker for your bakery.",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#C8924A",   // Crust Gold
    secondary: "#8B5A2B", // Toasted Caramel
    accent: "#FAF3E3",    // Butter Cream
  },
  soldTodayHeading: "Sold today",
  soldTodaySubheading: "Tap a pastry once each time it sells.",
  insightHeading: "Today's bestsellers",
  insightSubheading: "What's flying off the shelf right now.",
  loginWelcome: "Welcome back to the counter.",
  enableUndo: true,
  showBestsellerBadges: true,
  gridColumns: 3,
  defaultPastries: [
    { name: "Butter Croissant",     photoUrl: "", emoji: "🥐" },
    { name: "Pain au Chocolat",     photoUrl: "", emoji: "🍫" },
    { name: "Sourdough Loaf",       photoUrl: "", emoji: "🍞" },
    { name: "Cinnamon Roll",        photoUrl: "", emoji: "🥯" },
    { name: "Blueberry Muffin",     photoUrl: "", emoji: "🫐" },
    { name: "Almond Danish",        photoUrl: "", emoji: "🥮" },
  ],
};
