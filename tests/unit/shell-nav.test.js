import { describe, it, expect } from "vitest";
import {
  NAV_ITEMS,
  DEBUG_ITEMS,
  SYSTEM_ITEMS,
  COMBINED_WEB_ITEM,
  VISIBLE_MEDIA_KINDS,
  SETTINGS_ENTRY,
  EXTERNAL_ENTRIES,
  isActiveNav,
  filterVisibleMediaKinds,
  getVisibleDebugItems,
  getAllSidebarHrefs,
} from "@/shared/components/layouts/shellNav";

describe("shellNav (Fase 1 shell model)", () => {
  it("keeps the same primary nav entries", () => {
    expect(NAV_ITEMS.map((i) => i.href)).toEqual([
      "/dashboard",
      "/dashboard/endpoint",
      "/dashboard/providers",
      "/dashboard/combos",
      "/dashboard/usage",
      "/dashboard/quota",
      "/dashboard/token-saver",
      "/dashboard/cli-tools",
    ]);
  });

  it("keeps system + debug + settings + external entries", () => {
    expect(SYSTEM_ITEMS.map((i) => i.href)).toEqual([
      "/dashboard/proxy-pools",
      "/dashboard/skills",
    ]);
    expect(DEBUG_ITEMS.map((i) => i.href)).toEqual([
      "/dashboard/console-log",
      "/dashboard/translator",
    ]);
    expect(SETTINGS_ENTRY.href).toBe("/dashboard/profile");
    expect(EXTERNAL_ENTRIES.map((i) => i.href)).toEqual(["https://9english.net/"]);
  });

  it("keeps the visible media kinds + combined web entry", () => {
    expect(VISIBLE_MEDIA_KINDS).toEqual(["embedding", "image", "video", "tts", "stt"]);
    expect(COMBINED_WEB_ITEM.href).toBe("/dashboard/media-providers/web");
  });

  it("overview entry is active only for the dashboard root", () => {
    expect(isActiveNav("/dashboard", "/dashboard")).toBe(true);
    expect(isActiveNav("/dashboard/endpoint", "/dashboard")).toBe(false);
    expect(isActiveNav("/dashboard/endpoint", "/dashboard/endpoint")).toBe(true);
    expect(isActiveNav("/dashboard/providers", "/dashboard/endpoint")).toBe(false);
  });

  it("matches nested routes via prefix", () => {
    expect(isActiveNav("/dashboard/providers/abc", "/dashboard/providers")).toBe(true);
    expect(isActiveNav("/dashboard/media-providers/image", "/dashboard/providers")).toBe(false);
  });

  it("filters media kinds to the visible allow-list, preserving order", () => {
    const kinds = [
      { id: "tts", label: "TTS" },
      { id: "webSearch", label: "Web Search" },
      { id: "image", label: "Image" },
    ];
    expect(filterVisibleMediaKinds(kinds).map((k) => k.id)).toEqual(["tts", "image"]);
  });

  it("hides the translator entry unless enabled", () => {
    expect(getVisibleDebugItems(false).map((i) => i.href)).toEqual(["/dashboard/console-log"]);
    expect(getVisibleDebugItems(true).map((i) => i.href)).toEqual([
      "/dashboard/console-log",
      "/dashboard/translator",
    ]);
  });

  it("exposes every sidebar href for smoke coverage", () => {
    const hrefs = getAllSidebarHrefs({
      mediaKinds: [{ id: "embedding" }, { id: "image" }, { id: "video" }, { id: "tts" }, { id: "stt" }],
      translatorEnabled: true,
    });
    for (const href of [
      "/dashboard",
      "/dashboard/endpoint",
      "/dashboard/providers",
      "/dashboard/combos",
      "/dashboard/usage",
      "/dashboard/quota",
      "/dashboard/token-saver",
      "/dashboard/cli-tools",
      "/dashboard/media-providers/embedding",
      "/dashboard/media-providers/web",
      "/dashboard/proxy-pools",
      "/dashboard/skills",
      "/dashboard/console-log",
      "/dashboard/translator",
      "/dashboard/profile",
    ]) {
      expect(hrefs).toContain(href);
    }
  });
});
