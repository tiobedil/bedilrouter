"use client";

import PropTypes from "prop-types";
import { Chip } from "@heroui/react";

const STATE_MAP = {
  online: { color: "success", label: "Online" },
  degraded: { color: "warning", label: "Degraded" },
  off: { color: "default", label: "Off" },
  unknown: { color: "default", label: "Unknown" },
  offline: { color: "danger", label: "Offline" },
};

export default function StatusChip({ state }) {
  const { color, label } = STATE_MAP[state] || STATE_MAP.unknown;
  return (
    <Chip color={color} variant="soft" size="sm">
      {label}
    </Chip>
  );
}

StatusChip.propTypes = {
  state: PropTypes.oneOf(["online", "degraded", "off", "unknown", "offline"]),
};
