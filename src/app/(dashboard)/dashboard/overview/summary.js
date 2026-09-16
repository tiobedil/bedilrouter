export const fmt = (n) => new Intl.NumberFormat().format(n || 0);
export const fmtCost = (n) => `$${(n || 0).toFixed(2)}`;

function summarizeRemoteAccess(t) {
  if (!t) return { state: "unknown", url: "" };
  const url = t.publicUrl || t.tunnelUrl || "";
  if (t.enabled) return { state: "online", url };
  if (t.settingsEnabled) return { state: "degraded", url };
  return { state: "off", url: "" };
}

export function summarizeGateway({ health, tunnel } = {}) {
  const status = !health ? "unknown" : health.ok ? "online" : "offline";
  return {
    status,
    tunnel: summarizeRemoteAccess(tunnel?.tunnel),
    tailscale: summarizeRemoteAccess(tunnel?.tailscale),
  };
}

function isCooldown(conn) {
  const now = Date.now();
  return Object.entries(conn || {}).some(
    ([k, v]) => k.startsWith("modelLock_") && v && new Date(v).getTime() > now
  );
}

function getEffectiveStatus(conn) {
  if (!conn) return "unknown";
  if (conn.testStatus === "unavailable" && !isCooldown(conn)) return "active";
  return conn.testStatus || "unknown";
}

export function getConnectionErrorTag(connection) {
  if (!connection) return null;
  const explicitType = connection.lastErrorType;
  if (explicitType === "runtime_error") return "RUNTIME";
  if (
    explicitType === "upstream_auth_error" ||
    explicitType === "auth_missing" ||
    explicitType === "token_refresh_failed" ||
    explicitType === "token_expired"
  )
    return "AUTH";
  if (explicitType === "upstream_rate_limited") return "429";
  if (explicitType === "upstream_unavailable") return "5XX";
  if (explicitType === "network_error") return "NET";

  const numericCode = Number(connection.errorCode);
  if (Number.isFinite(numericCode) && numericCode >= 400)
    return String(numericCode);

  const msg = connection.lastError || "";
  const codeMatch = msg.match(/\b([45]\d{2})\b/);
  const fromMessage = codeMatch ? codeMatch[1] : null;
  if (fromMessage === "401" || fromMessage === "403") return "AUTH";
  if (fromMessage) return fromMessage;

  const lower = msg.toLowerCase();
  if (
    lower.includes("runtime") ||
    lower.includes("not runnable") ||
    lower.includes("not installed")
  )
    return "RUNTIME";
  if (
    lower.includes("invalid api key") ||
    lower.includes("token invalid") ||
    lower.includes("revoked") ||
    lower.includes("unauthorized")
  )
    return "AUTH";

  return "ERR";
}

const ERROR_STATUSES = new Set(["error", "expired", "unavailable"]);

export function summarizeProviders(connections) {
  const list = Array.isArray(connections) ? connections : [];
  const empty = { total: 0, enabled: 0, connected: 0, errors: 0, disabled: 0, errorList: [] };
  if (list.length === 0) return empty;

  let enabled = 0;
  let connected = 0;
  const errorList = [];
  for (const c of list) {
    if (c.isActive !== false) enabled += 1;
    const status = getEffectiveStatus(c);
    if (status === "active" || status === "success") connected += 1;
    if (ERROR_STATUSES.has(status)) {
      errorList.push({
        id: c.id,
        name: c.name || c.provider,
        provider: c.provider,
        tag: getConnectionErrorTag(c),
      });
    }
  }
  return {
    total: list.length,
    enabled,
    connected,
    errors: errorList.length,
    disabled: list.length - enabled,
    errorList,
  };
}

export function summarizeCombos(combos) {
  const list = (Array.isArray(combos) ? combos : []).filter(
    (c) => !c.kind || c.kind === "llm"
  );
  return {
    total: list.length,
    totalModels: list.reduce(
      (n, c) => n + (Array.isArray(c.models) ? c.models.length : 0),
      0
    ),
    top: list.map((c) => ({
      name: c.name,
      modelCount: Array.isArray(c.models) ? c.models.length : 0,
    })),
  };
}

export function summarizeUsage(stats) {
  const s = stats || {};
  const byProvider = s.byProvider || {};
  const topProviders = Object.entries(byProvider)
    .map(([provider, data]) => ({ provider, requests: data?.requests || 0 }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 5);
  return {
    requests: s.totalRequests || 0,
    promptTokens: s.totalPromptTokens || 0,
    completionTokens: s.totalCompletionTokens || 0,
    cachedTokens: s.totalCachedTokens || 0,
    cost: s.totalCost || 0,
    activeCount: (s.activeRequests || []).reduce((n, r) => n + (r.count || 0), 0),
    recentCount: (s.recentRequests || []).length,
    topProviders,
  };
}
