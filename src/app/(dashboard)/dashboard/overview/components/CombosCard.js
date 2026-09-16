"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { Card, Skeleton } from "@heroui/react";
import SectionHeader from "./SectionHeader";
import { fmt } from "../summary";

export default function CombosCard({ summary, loading }) {
  return (
    <Card className="p-6">
      <SectionHeader
        icon="layers"
        title="Combos"
        description="Model combos with fallback"
        href="/dashboard/combos"
        actionLabel="Manage"
      />
      {loading ? (
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-main">{fmt(summary.total)}</span>
            <span className="text-xs text-text-muted">
              combos · {fmt(summary.totalModels)} models in fallback chains
            </span>
          </div>
          {summary.top.length > 0 ? (
            <div className="mt-3 flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.04] border-t border-black/[0.04] dark:border-white/[0.04]">
              {summary.top.slice(0, 4).map((c) => (
                <div key={c.name} className="flex items-center gap-2 py-2">
                  <code className="min-w-0 flex-1 truncate font-mono text-sm text-text-main" title={c.name}>
                    {c.name}
                  </code>
                  <span className="shrink-0 font-mono text-xs text-text-muted">
                    {c.modelCount} {c.modelCount === 1 ? "model" : "models"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              No combos yet.{" "}
              <Link href="/dashboard/combos" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
                Create one
              </Link>
            </p>
          )}
        </>
      )}
    </Card>
  );
}

CombosCard.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number,
    totalModels: PropTypes.number,
    top: PropTypes.array,
  }),
  loading: PropTypes.bool,
};
