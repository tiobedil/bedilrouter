"use client";

import { useState, useEffect } from "react";
import GatewayCard from "./components/GatewayCard";
import ProvidersCard from "./components/ProvidersCard";
import CombosCard from "./components/CombosCard";
import UsageCard from "./components/UsageCard";
import {
  summarizeGateway,
  summarizeProviders,
  summarizeCombos,
  summarizeUsage,
} from "./summary";

const fetchJson = (url) => fetch(url, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null));

export default function OverviewPageClient() {
  const [baseUrl] = useState(
    () => (typeof window !== "undefined" ? window.location.origin : "")
  );
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState(null);
  const [providers, setProviders] = useState(null);
  const [combos, setCombos] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [health, tunnel, providersRes, combosRes, usageRes] = await Promise.all([
          fetchJson("/api/health").catch(() => null),
          fetchJson("/api/tunnel/status").catch(() => null),
          fetchJson("/api/providers").catch(() => null),
          fetchJson("/api/combos").catch(() => null),
          fetchJson("/api/usage/stats?period=today").catch(() => null),
        ]);
        if (cancelled) return;
        setGateway(summarizeGateway({ health, tunnel }));
        setProviders(summarizeProviders(providersRes?.connections));
        setCombos(summarizeCombos(combosRes?.combos));
        setUsage(summarizeUsage(usageRes));
      } catch {
        if (!cancelled) {
          setGateway((p) => p || summarizeGateway({}));
          setProviders((p) => p || summarizeProviders([]));
          setCombos((p) => p || summarizeCombos([]));
          setUsage((p) => p || summarizeUsage(null));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <GatewayCard summary={gateway} loading={loading} baseUrl={baseUrl} />
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <ProvidersCard summary={providers} loading={loading} />
        <CombosCard summary={combos} loading={loading} />
      </div>
      <UsageCard summary={usage} loading={loading} />
    </div>
  );
}
