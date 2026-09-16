"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { Card, Skeleton } from "@heroui/react";
import StatusChip from "./StatusChip";
import SectionHeader from "./SectionHeader";

function EndpointLine({ label, entry, manageHref }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="w-[88px] shrink-0 text-center font-mono text-xs text-text-muted">{label}</span>
      <div className="min-w-0 flex-1">
        {entry.state === "online" ? (
          <code className="block truncate font-mono text-sm text-text-main" title={entry.url}>
            {entry.url}
          </code>
        ) : (
          <span className="block truncate text-sm text-text-muted">
            {entry.state === "off" ? "Not enabled" : entry.state === "degraded" ? "Connecting…" : "Checking…"}
          </span>
        )}
      </div>
      <StatusChip state={entry.state} />
      {entry.state === "off" && manageHref && (
        <Link
          href={manageHref}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Enable
        </Link>
      )}
    </div>
  );
}

EndpointLine.propTypes = {
  label: PropTypes.string.isRequired,
  entry: PropTypes.shape({
    state: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  manageHref: PropTypes.string,
};

export default function GatewayCard({ summary, loading, baseUrl }) {
  return (
    <Card className="p-6">
      <SectionHeader
        icon="hub"
        title="Gateway"
        description="Local endpoint and remote access"
        href="/dashboard/endpoint"
        actionLabel="Manage"
      />
      <div className="mt-4 flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        {loading ? (
          <>
            <Skeleton className="my-2 h-6 w-full" />
            <Skeleton className="my-2 h-6 w-full" />
            <Skeleton className="my-2 h-6 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 py-2">
              <span className="w-[88px] shrink-0 text-center font-mono text-xs text-text-muted">Local</span>
              <code className="min-w-0 flex-1 truncate font-mono text-sm text-text-main" title={`${baseUrl}/v1`}>
                {baseUrl}/v1
              </code>
              <StatusChip state={summary?.status === "online" ? "online" : summary?.status || "unknown"} />
            </div>
            <EndpointLine label="Tunnel" entry={summary?.tunnel || { state: "unknown", url: "" }} manageHref="/dashboard/endpoint" />
            <EndpointLine label="Tailscale" entry={summary?.tailscale || { state: "unknown", url: "" }} manageHref="/dashboard/endpoint" />
          </>
        )}
      </div>
    </Card>
  );
}

GatewayCard.propTypes = {
  summary: PropTypes.shape({
    status: PropTypes.string,
    tunnel: PropTypes.object,
    tailscale: PropTypes.object,
  }),
  loading: PropTypes.bool,
  baseUrl: PropTypes.string,
};
