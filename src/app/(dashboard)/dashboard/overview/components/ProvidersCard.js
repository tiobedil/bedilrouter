"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { Card, Chip, Skeleton } from "@heroui/react";
import SectionHeader from "./SectionHeader";
import { fmt } from "../summary";

export default function ProvidersCard({ summary, loading }) {
  return (
    <Card className="p-6">
      <SectionHeader
        icon="dns"
        title="Providers"
        description="Connection health across providers"
        href="/dashboard/providers"
        actionLabel="Manage"
      />
      {loading ? (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-2xl font-bold text-text-main">{fmt(summary.total)}</span>
              <span className="truncate text-xs text-text-muted">Connections</span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-2xl font-bold text-success">{fmt(summary.connected)}</span>
              <span className="truncate text-xs text-text-muted">Connected</span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className={`text-2xl font-bold ${summary.errors > 0 ? "text-danger" : "text-text-main"}`}>
                {fmt(summary.errors)}
              </span>
              <span className="truncate text-xs text-text-muted">Errors</span>
            </div>
          </div>
          {summary.errorList.length > 0 && (
            <div className="mt-4 flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.04] border-t border-black/[0.04] dark:border-white/[0.04]">
              {summary.errorList.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center gap-2 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm text-text-main">{e.name}</span>
                  <Chip color="danger" variant="soft" size="sm">
                    {e.tag}
                  </Chip>
                </div>
              ))}
              {summary.errorList.length > 4 && (
                <Link
                  href="/dashboard/providers"
                  className="py-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                >
                  +{summary.errorList.length - 4} more — view providers
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

ProvidersCard.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number,
    connected: PropTypes.number,
    errors: PropTypes.number,
    errorList: PropTypes.array,
  }),
  loading: PropTypes.bool,
};
