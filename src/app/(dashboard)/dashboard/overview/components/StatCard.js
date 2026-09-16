"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { Card } from "@heroui/react";

const TONE_CLASSES = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

export default function StatCard({ icon, label, value, tone, hint, href }) {
  const toneClass = TONE_CLASSES[tone] || "text-text-main";
  const body = (
    <Card className="flex min-w-0 flex-col gap-1 p-4">
      <div className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-[18px] text-text-muted">{icon}</span>}
        <span className="truncate text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      </div>
      <span className={`truncate text-2xl font-bold ${toneClass}`}>{value}</span>
      {hint && <span className="truncate text-[11px] text-text-muted">{hint}</span>}
    </Card>
  );
  if (!href) return body;
  return (
    <Link
      href={href}
      className="block min-w-0 rounded-[14px] transition-all hover:shadow-[var(--shadow-warm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&>div]:hover:border-brand-500/30"
    >
      {body}
    </Link>
  );
}

StatCard.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(["default", "primary", "success", "warning", "info"]),
  hint: PropTypes.string,
  href: PropTypes.string,
};
