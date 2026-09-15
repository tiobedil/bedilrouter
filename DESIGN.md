---
version: alpha
name: 9Router Dashboard
description: Design language of the 9Router AI-gateway dashboard before the HeroUI v3 revamp.
colors:
  brand-500: "#E56A4A"
  brand-600: "#cc5236"
  brand-300: "#ee8d6a"
  danger: "#cf222e"
  success: "#10B981"
  warning: "#F59E0B"
  info: "#3B82F6"
typography:
  sans:
    fontFamily: Inter
  mono:
    fontFamily: ui-monospace, monospace
rounded:
  base: 10px
  lg: 14px
spacing:
  card: 24px
  gap: 12px
components:
  button-primary:
    background: "{colors.brand-500}"
    foreground: "#ffffff"
  badge-soft:
    background: "{colors.brand-500}"
    foreground: "{colors.brand-600}"
---

## Overview

9Router is a dense operational dashboard for managing AI provider keys, routing combos, and usage. The visual language is a warm-neutral canvas with a single terracotta brand accent, custom-built primitives (Button, Card, Modal, Badge, Input), and Material Symbols icons.

## Colors

The brand accent is terracotta `#E56A4A` with a 9-step scale; interactive states darken to `brand-600`. Status colors use Tailwind defaults at 10% background opacity with 600-weight text (400 in dark mode). Text hierarchy is main/muted/subtle; surfaces step bg-alt, surface, surface-2, surface-3.

## Themes

Light and dark share the same brand scale. Alternate-theme values:

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#FDFAF6` | `#1a1a1a` |
| `--color-bg-alt` | `#F7F3EE` | `#1F1F1E` |
| `--color-surface` | `#ffffff` | `#262626` |
| `--color-surface-2` | `#f4f4f5` | `#303030` |
| `--color-surface-3` | `#e7e7e9` | `#3a3a3a` |
| `--color-border` | `#e5e7eb` | `#333333` |
| `--color-border-subtle` | `#f1f1f3` | `#2a2a2a` |
| `--color-text-main` | `#0a0a0a` | `#ededed` |
| `--color-text-muted` | `#6B7280` | `#9ca3af` |
| `--color-text-subtle` | `#9CA3AF` | `#6b7280` |
| `--color-danger` | `#cf222e` | `#ef4444` |
| `--color-success` | `#10B981` | `#22c55e` |
| `--color-warning` | `#F59E0B` | `#fbbf24` |
| `--color-info` | `#3B82F6` | `#60a5fa` |

Dark mode is class-driven (`.dark` on `<html>`) with a pre-paint anti-flash script mirroring the persisted zustand theme store.

## Typography

Inter is the primary face with Apple system fallbacks; monospace is reserved for keys, tokens, IDs, and code samples. Body copy and controls render at `text-sm`/`text-xs`; headings descend `text-lg` to `text-3xl`. Inputs render at 16px on mobile to prevent iOS zoom, collapsing to `text-sm` at `sm:` and up.

## Layout

The app shell is a fixed sidebar (`w-72`, vibrancy blur) beside a fluid content column. Cards default to `p-6` with `12px` internal gaps; list rows use dividers rather than boxes for density.

## Elevation & Depth

Three shadow tiers: soft for cards, elevated (with top highlight inset) for modals and drawers, warm brand-tinted glow for CTAs and hover emphasis only. Focus rings are brand-tinted (`rgba(229,106,74,0.18)`).

## Shapes

Cards and modals use 14px radius; buttons and inputs use 10px; status badges are fully rounded pills. The macOS-style modal header uses traffic-light dots on desktop and an X button on mobile.

## Components

Buttons have five variants (primary, secondary, outline, ghost, danger, success) with an `active:scale` press effect. Badges are soft-tinted pills with optional dot or icon. Inputs sit on `surface-2` with transparent borders, gaining a brand ring on focus. Tables favor row dividers with hover actions revealed on `group-hover`.
