"use client";

import PropTypes from "prop-types";
import Link from "next/link";

export default function SectionHeader({ icon, title, description, href, actionLabel }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
            <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-text-main">{title}</h2>
          {description && <p className="truncate text-xs text-text-muted">{description}</p>}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {actionLabel || "View all"}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      )}
    </div>
  );
}

SectionHeader.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  href: PropTypes.string,
  actionLabel: PropTypes.string,
};
