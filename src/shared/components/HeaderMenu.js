"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Label } from "@heroui/react";
import { useTheme } from "@/shared/hooks/useTheme";
import ChangelogModal from "./ChangelogModal";
import { ConfirmModal } from "./Modal";

const ITEM_CLASS =
  "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors rounded-lg outline-none cursor-pointer";
const ITEM_DEFAULT = "text-text-main hover:bg-black/5 dark:hover:bg-white/5";
const ITEM_DANGER = "text-red-500 hover:bg-red-500/10";

function ItemIcon({ icon, danger }) {
  return (
    <span className={`material-symbols-outlined text-[20px] ${danger ? "" : "text-text-muted"}`}>
      {icon}
    </span>
  );
}

ItemIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  danger: PropTypes.bool,
};

export default function HeaderMenu({ onLogout }) {
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  const handleShutdown = async () => {
    setIsShuttingDown(true);
    try {
      await fetch("/api/version/shutdown", { method: "POST" });
    } catch (e) {
      // Expected to fail as server shuts down; ignore error
    }
    setIsShuttingDown(false);
    setShutdownOpen(false);
  };

  const actions = {
    changelog: () => setChangelogOpen(true),
    theme: () => toggleTheme(),
    shutdown: () => setShutdownOpen(true),
    logout: () => onLogout(),
  };

  const handleAction = (key) => actions[key]?.();

  return (
    <>
      <Dropdown>
        <Button
          isIconOnly
          variant="ghost"
          aria-label="Menu"
          title="Menu"
          className="flex items-center justify-center p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="material-symbols-outlined">grid_view</span>
        </Button>
        <Dropdown.Popover className="w-60 bg-surface border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
          <Dropdown.Menu aria-label="Header menu" onAction={handleAction}>
            <Dropdown.Item id="changelog" textValue="Change Log" className={`${ITEM_CLASS} ${ITEM_DEFAULT}`}>
              <ItemIcon icon="history" />
              <Label>Change Log</Label>
            </Dropdown.Item>
            <Dropdown.Item id="theme" textValue="Theme" className={`${ITEM_CLASS} ${ITEM_DEFAULT}`}>
              <ItemIcon icon={isDark ? "light_mode" : "dark_mode"} />
              <Label>Theme</Label>
            </Dropdown.Item>
            <Dropdown.Item id="shutdown" textValue="Shutdown" className={`${ITEM_CLASS} ${ITEM_DANGER}`}>
              <ItemIcon icon="power_settings_new" danger />
              <Label>Shutdown</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" textValue="Logout" className={`${ITEM_CLASS} ${ITEM_DANGER}`}>
              <ItemIcon icon="logout" danger />
              <Label>Logout</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
      <ConfirmModal
        isOpen={shutdownOpen}
        onClose={() => setShutdownOpen(false)}
        onConfirm={handleShutdown}
        title="Close Proxy"
        message="Are you sure you want to close the proxy server?"
        confirmText="Close"
        cancelText="Cancel"
        variant="danger"
        loading={isShuttingDown}
      />
    </>
  );
}

HeaderMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
