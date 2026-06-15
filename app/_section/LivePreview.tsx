"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { DropdownMenuState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

type MenuItemRole = "menuitem" | "menuitemcheckbox" | "menuitemradio";

type MenuItem = {
  id: string;
  label: string;
  shortcut: string;
  role: MenuItemRole;
  checked: boolean;
  disabled: boolean;
  hasSubmenu: boolean;
};

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function shell(state: DropdownMenuState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    gap: state.gap,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px ${state.borderStyle} ${state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border}`,
    boxShadow: buildShadow(state),
    background: state.disabled && state.disabledUseCustomColors ? state.disabledBg : state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? state.disabledOpacity : 1,
    cursor: state.disabled ? state.disabledCursor : undefined,
  };
}

function buildItems(state: DropdownMenuState): MenuItem[] {
  return Array.from({ length: state.itemCount }, (_, index) => {
    const role: MenuItemRole =
      state.checkableItems && index === 1 ? "menuitemcheckbox" : state.checkableItems && index === 3 ? "menuitemradio" : "menuitem";

    return {
      id: `${state.id}-item-${index + 1}`,
      label: `${state.label} ${index + 1}`,
      shortcut: index % 3 === 0 ? "Ctrl+K" : index % 3 === 1 ? "Shift+Enter" : "Alt+M",
      role,
      checked: role !== "menuitem" && index % 2 === 1,
      disabled: state.disabled || (state.itemCount > 4 && index === state.itemCount - 1),
      hasSubmenu: index < state.submenuCount,
    };
  });
}

function nextIndex(current: number, direction: 1 | -1, total: number, loop: boolean) {
  if (loop) return (current + direction + total) % total;
  return Math.min(total - 1, Math.max(0, current + direction));
}

function placementStyle(state: DropdownMenuState): CSSProperties {
  const offset = state.offset ?? 10;
  const alignSelf = state.align === "center" ? "center" : state.align === "end" ? "flex-end" : "flex-start";

  return {
    alignSelf,
    marginTop: state.side === "bottom" ? offset : 0,
    marginRight: state.side === "left" ? offset : 0,
    marginBottom: state.side === "top" ? offset : 0,
    marginLeft: state.side === "right" ? offset : 0,
  };
}

export default function LivePreview({ state }: { state: DropdownMenuState }) {
  const [open, setOpen] = useState(state.previewState !== "closed" && !state.disabled);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = buildItems(state);
  const menuId = `${state.id}-menu`;
  const resolvedOpen = !state.disabled && (state.previewState === "open" || (state.previewState !== "closed" && open));
  const groupCount = Math.max(1, Math.min(state.groupCount, items.length));
  const groupSize = Math.ceil(items.length / groupCount);
  const loopNavigation = state.loopNavigation ?? true;

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    setOpen(true);
    setActiveIndex(0);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(items.length - 1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => nextIndex(current, event.key === "ArrowDown" ? 1 : -1, items.length, loopNavigation));
    }
  };

  const selectItem = (item: MenuItem) => {
    if (item.disabled) return;
    if (state.dismissOnSelect ?? true) setOpen(false);
  };

  return (
    <section id={state.id} aria-label={state.ariaLabel} style={shell(state)} className="flex flex-col justify-center">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: state.muted }}>
          {state.title}
        </p>
        <h3 className="mt-2" style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>
          {state.description}
        </h3>
      </div>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={resolvedOpen}
        aria-controls={menuId}
        disabled={state.disabled}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex w-fit items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition"
        style={{
          borderColor: state.previewState === "focus" ? state.accent : state.border,
          background: state.previewState === "active" ? state.accent : "rgba(255,255,255,.06)",
          color: state.previewState === "active" ? state.actionText : state.foreground,
        }}
      >
        {state.label}
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: resolvedOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: state.transitionDuration > 0 ? "transform 200ms ease" : "none",
            flexShrink: 0,
          }}
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: resolvedOpen ? "1fr" : "0fr",
          transition: state.transitionDuration > 0 ? "grid-template-rows 200ms ease" : "none",
        }}
      >
        <div style={{ overflow: "hidden" }} aria-hidden={!resolvedOpen || undefined}>
      <div
          id={menuId}
          role="menu"
          aria-label={state.ariaLabel}
          aria-orientation="vertical"
          tabIndex={state.tabIndex}
          onKeyDown={handleMenuKeyDown}
          className="grid w-full max-w-sm gap-2 border outline-none"
          style={{
            ...placementStyle(state),
            padding: state.sectionPaddingY,
            borderRadius: state.menuRadius,
            borderColor: state.menuBorder,
            background: state.menuBg,
            boxShadow: state.menuShadow,
            backdropFilter: "blur(16px)",
          }}
        >
          {Array.from({ length: groupCount }, (_, groupIndex) => {
            const groupItems = items.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize);
            if (!groupItems.length) return null;

            return (
              <div key={groupIndex} role="group" aria-label={`Group ${groupIndex + 1}`} className="grid gap-1">
                {groupIndex > 0 ? <div role="separator" className="my-1 h-px" style={{ background: state.separatorColor }} /> : null}
                <div className="px-3 pb-1 pt-1">
                  <p
                    className="font-semibold uppercase tracking-[0.18em]"
                    style={{ color: state.groupHeaderColor, fontSize: state.groupHeaderSize }}
                  >
                    {`Group ${groupIndex + 1}`}
                  </p>
                  <div className="mt-1 h-px" style={{ background: state.groupDividerColor }} />
                </div>
                {groupItems.map((item, itemIndex) => {
                  const absoluteIndex = groupIndex * groupSize + itemIndex;
                  const isCursor = absoluteIndex === activeIndex;
                  const isSelected = state.previewState === "selected";
                  const itemBackground = item.disabled
                    ? "transparent"
                    : isSelected
                      ? state.itemActiveBg
                      : isCursor
                        ? state.itemHoverBg
                        : state.itemBg;
                  const itemColor = item.disabled
                    ? state.itemDisabledColor
                    : isSelected
                      ? state.itemActiveText
                      : isCursor
                        ? state.itemHoverText
                        : state.itemText;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role={item.role}
                      aria-checked={item.role === "menuitem" ? undefined : item.checked}
                      aria-disabled={item.disabled || undefined}
                      aria-haspopup={item.hasSubmenu ? "menu" : undefined}
                      aria-expanded={item.hasSubmenu ? isCursor || isSelected : undefined}
                      tabIndex={isCursor || isSelected ? 0 : -1}
                      disabled={item.disabled}
                      onMouseEnter={() => setActiveIndex(absoluteIndex)}
                      onClick={() => selectItem(item)}
                      className="flex items-center gap-2 text-left text-sm"
                      style={{
                        minHeight: state.itemHeight,
                        padding: `0 ${state.itemPadding}px`,
                        borderRadius: state.itemRadius,
                        background: itemBackground,
                        color: itemColor,
                        transition: state.transitionDuration > 0 ? "background 150ms ease, color 150ms ease" : "none",
                      }}
                    >
                      {item.role === "menuitemcheckbox" ? (
                        <svg aria-hidden="true" width={state.iconSize} height={state.iconSize} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="1" y="1" width="12" height="12" rx="3" stroke={state.iconColor} strokeWidth="1.5" fill={item.checked ? state.iconColor : "none"} />
                          {item.checked && <path d="M3.5 7l2.5 2.5 4.5-5" stroke={item.disabled ? state.itemDisabledColor : state.checkmarkColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
                        </svg>
                      ) : item.role === "menuitemradio" ? (
                        <svg aria-hidden="true" width={state.iconSize} height={state.iconSize} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="7" cy="7" r="6" stroke={state.iconColor} strokeWidth="1.5" />
                          {item.checked && <circle cx="7" cy="7" r="3" fill={state.checkmarkColor} />}
                        </svg>
                      ) : null}
                      <span>{item.label}</span>
                      {item.hasSubmenu ? (
                        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: "auto", flexShrink: 0 }}>
                          <path d="M4.5 2.5L8 6l-3.5 3.5" stroke={state.submenuIndicatorColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : state.showShortcuts ? (
                        <span className="ml-auto text-xs" style={{ color: state.shortcutColor }}>{item.shortcut}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <p className="mt-4 text-xs" style={{ color: state.muted }}>
        {state.helper} Keyboard: Enter/Space opens, Arrow keys move, Home/End jump, Escape closes. Placement {state.side}/{state.align}, offset {state.offset ?? 10}px.
      </p>
    </section>
  );
}
