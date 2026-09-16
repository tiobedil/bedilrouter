export const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/dashboard/endpoint", label: "Endpoint & Key", icon: "api" },
  { href: "/dashboard/providers", label: "Providers", icon: "dns" },
  { href: "/dashboard/combos", label: "Combo & Vision Adapter", icon: "layers" },
  { href: "/dashboard/usage", label: "Usage", icon: "bar_chart" },
  { href: "/dashboard/quota", label: "Quota Tracker", icon: "data_usage" },
  { href: "/dashboard/token-saver", label: "Token Saver", icon: "savings" },
  { href: "/dashboard/cli-tools", label: "CLI Tools", icon: "terminal" },
];

export const DEBUG_ITEMS = [
  { href: "/dashboard/console-log", label: "Console Log", icon: "terminal" },
  { href: "/dashboard/translator", label: "Translator", icon: "translate" },
];

export const SYSTEM_ITEMS = [
  { href: "/dashboard/proxy-pools", label: "Proxy Pools", icon: "lan" },
  { href: "/dashboard/skills", label: "Skills", icon: "extension" },
];

export const SETTINGS_ENTRY = { href: "/dashboard/profile", label: "Settings", icon: "settings" };

export const EXTERNAL_ENTRIES = [
  { href: "https://9english.net/", label: "9English", icon: "translate", external: true },
];

export const VISIBLE_MEDIA_KINDS = ["embedding", "image", "video", "tts", "stt"];

export const COMBINED_WEB_ITEM = {
  id: "web",
  label: "Web Fetch & Search",
  icon: "travel_explore",
  href: "/dashboard/media-providers/web",
};

export const TRANSLATOR_HREF = "/dashboard/translator";

export function isActiveNav(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

export function filterVisibleMediaKinds(kinds) {
  return kinds.filter((k) => VISIBLE_MEDIA_KINDS.includes(k.id));
}

export function getVisibleDebugItems(translatorEnabled) {
  return DEBUG_ITEMS.filter((item) => item.href !== TRANSLATOR_HREF || translatorEnabled);
}

export function getAllSidebarHrefs({ mediaKinds = [], translatorEnabled = false } = {}) {
  return [
    ...NAV_ITEMS.map((i) => i.href),
    ...filterVisibleMediaKinds(mediaKinds).map((k) => `/dashboard/media-providers/${k.id}`),
    COMBINED_WEB_ITEM.href,
    ...SYSTEM_ITEMS.map((i) => i.href),
    ...getVisibleDebugItems(translatorEnabled).map((i) => i.href),
    SETTINGS_ENTRY.href,
  ];
}
