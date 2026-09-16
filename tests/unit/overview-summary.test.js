import { describe, it, expect } from "vitest";
import {
  summarizeGateway,
  summarizeProviders,
  summarizeCombos,
  summarizeUsage,
} from "@/app/(dashboard)/dashboard/overview/summary";

describe("overview summary helpers (Fase 2, visual-only)", () => {
  it("summarizes gateway + tunnel + tailscale states", () => {
    expect(
      summarizeGateway({
        health: { ok: true },
        tunnel: {
          tunnel: {
            enabled: true,
            settingsEnabled: true,
            tunnelUrl: "https://x.trycloudflare.com",
            publicUrl: "https://r1.abc-tunnel.us",
            running: true,
          },
          tailscale: {
            enabled: false,
            settingsEnabled: false,
            tunnelUrl: "",
            running: false,
            loggedIn: false,
          },
        },
      })
    ).toEqual({
      status: "online",
      tunnel: { state: "online", url: "https://r1.abc-tunnel.us" },
      tailscale: { state: "off", url: "" },
    });
  });

  it("marks tunnel degraded when enabled in settings but not running", () => {
    const res = summarizeGateway({
      health: { ok: true },
      tunnel: {
        tunnel: { enabled: false, settingsEnabled: true, tunnelUrl: "", publicUrl: "", running: false },
        tailscale: { enabled: false, settingsEnabled: false, tunnelUrl: "", running: false, loggedIn: false },
      },
    });
    expect(res.status).toBe("online");
    expect(res.tunnel.state).toBe("degraded");
  });

  it("reports unknown gateway when health is unreachable, offline when unhealthy", () => {
    expect(summarizeGateway({ health: null, tunnel: null }).status).toBe("unknown");
    expect(summarizeGateway({ health: { ok: false }, tunnel: null }).status).toBe("offline");
  });

  it("counts provider connections with the same effective-status rules as the providers page", () => {
    const res = summarizeProviders([
      { id: "1", provider: "anthropic", name: "Anthropic", authType: "oauth", isActive: true, testStatus: "active" },
      { id: "2", provider: "openai", name: "OpenAI", authType: "apikey", isActive: false, testStatus: "unknown" },
      { id: "3", provider: "gemini", name: "Gemini", authType: "oauth", isActive: true, testStatus: "error", lastError: "401 unauthorized" },
      // unavailable without cooldown counts as active (mirrors providers page)
      { id: "4", provider: "codex", name: "Codex", authType: "oauth", isActive: true, testStatus: "unavailable" },
      // unavailable under cooldown stays an error
      { id: "5", provider: "kiro", name: "Kiro", authType: "oauth", isActive: true, testStatus: "unavailable", modelLock_m: new Date(Date.now() + 60000).toISOString() },
    ]);
    expect(res.total).toBe(5);
    expect(res.enabled).toBe(4);
    expect(res.connected).toBe(2);
    expect(res.errors).toBe(2);
    expect(res.disabled).toBe(1);
    expect(res.errorList.map((e) => e.id)).toEqual(["3", "5"]);
    expect(res.errorList[0]).toMatchObject({ name: "Gemini", provider: "gemini", tag: "AUTH" });
  });

  it("handles empty provider lists", () => {
    expect(summarizeProviders([])).toEqual({
      total: 0, enabled: 0, connected: 0, errors: 0, disabled: 0, errorList: [],
    });
    expect(summarizeProviders(null)).toEqual(summarizeProviders([]));
  });

  it("summarizes llm combos only, with model counts", () => {
    expect(
      summarizeCombos([
        { id: "a", name: "main", kind: "llm", models: ["m1", "m2", "m3"] },
        { id: "b", name: "fast", kind: null, models: ["m1"] },
        { id: "c", name: "web", kind: "webSearch", models: ["x", "y"] },
      ])
    ).toEqual({
      total: 2,
      totalModels: 4,
      top: [
        { name: "main", modelCount: 3 },
        { name: "fast", modelCount: 1 },
      ],
    });
  });

  it("passes usage totals through untouched with top providers", () => {
    expect(
      summarizeUsage({
        totalRequests: 120,
        totalPromptTokens: 5000,
        totalCompletionTokens: 2000,
        totalCachedTokens: 500,
        totalCost: 1.234,
        byProvider: {
          anthropic: { requests: 80, promptTokens: 1, completionTokens: 1, cost: 1 },
          openai: { requests: 40, promptTokens: 1, completionTokens: 1, cost: 0.2 },
        },
        activeRequests: [{ model: "m", provider: "p", account: "a", count: 1 }],
        recentRequests: [{}, {}, {}],
      })
    ).toEqual({
      requests: 120,
      promptTokens: 5000,
      completionTokens: 2000,
      cachedTokens: 500,
      cost: 1.234,
      activeCount: 1,
      recentCount: 3,
      topProviders: [
        { provider: "anthropic", requests: 80 },
        { provider: "openai", requests: 40 },
      ],
    });
  });
});
