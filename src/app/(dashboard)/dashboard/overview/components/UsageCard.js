"use client";

import PropTypes from "prop-types";
import { Skeleton } from "@heroui/react";
import SectionHeader from "./SectionHeader";
import StatCard from "./StatCard";
import { fmt, fmtCost } from "../summary";

export default function UsageCard({ summary, loading }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <SectionHeader
        icon="bar_chart"
        title="Usage today"
        description={summary?.activeCount > 0 ? `${summary.activeCount} active requests` : "Token consumption and request counts"}
        href="/dashboard/usage"
        actionLabel="Analytics"
      />
      {loading ? (
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Skeleton className="h-[86px] w-full" />
          <Skeleton className="h-[86px] w-full" />
          <Skeleton className="h-[86px] w-full" />
          <Skeleton className="h-[86px] w-full" />
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Requests" value={fmt(summary.requests)} href="/dashboard/usage" />
          <StatCard label="Input tokens" value={fmt(summary.promptTokens)} tone="primary" href="/dashboard/usage" />
          <StatCard label="Output tokens" value={fmt(summary.completionTokens)} tone="success" href="/dashboard/usage" />
          <StatCard
            label="Est. cost"
            value={`~${fmtCost(summary.cost)}`}
            tone="warning"
            hint="Estimated, not actual billing"
            href="/dashboard/usage"
          />
        </div>
      )}
    </div>
  );
}

UsageCard.propTypes = {
  summary: PropTypes.shape({
    requests: PropTypes.number,
    promptTokens: PropTypes.number,
    completionTokens: PropTypes.number,
    cost: PropTypes.number,
    activeCount: PropTypes.number,
  }),
  loading: PropTypes.bool,
};
