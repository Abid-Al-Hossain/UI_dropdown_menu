"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { DropdownMenuState } from "../types";

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

function shell(state: DropdownMenuState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    gap: state.gap,
    borderRadius: state.radius,
    border: `${state.borderWidth}px solid ${state.border}`,
    boxShadow: `0 ${Math.round(state.shadow / 3)}px ${state.shadow}px rgba(0,0,0,.28)`,
    background: state.background,
    color: state.foreground,
    fontFamily: state.fontFamily,
    opacity: state.disabled ? 0.55 : 1,
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
          color: state.previewState === "active" ? "#020617" : state.foreground,
        }}
      >
        {state.label}
        <span aria-hidden="true">{resolvedOpen ? "Close" : "Open"}</span>
      </button>

      {resolvedOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label={state.ariaLabel}
          aria-orientation="vertical"
          tabIndex={state.tabIndex}
          onKeyDown={handleMenuKeyDown}
          className="grid w-full max-w-sm gap-2 rounded-2xl border p-2 outline-none"
          style={{
            ...placementStyle(state),
            borderColor: state.border,
            background: "rgba(2,6,23,.74)",
            backdropFilter: "blur(16px)",
          }}
        >
          {Array.from({ length: groupCount }, (_, groupIndex) => {
            const groupItems = items.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize);
            if (!groupItems.length) return null;

            return (
              <div key={groupIndex} role="group" aria-label={`Group ${groupIndex + 1}`} className="grid gap-1">
                {groupIndex > 0 ? <div role="separator" className="my-1 h-px" style={{ background: state.border }} /> : null}
                {groupItems.map((item, itemIndex) => {
                  const absoluteIndex = groupIndex * groupSize + itemIndex;
                  const isActive = absoluteIndex === activeIndex || state.previewState === "selected";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role={item.role}
                      aria-checked={item.role === "menuitem" ? undefined : item.checked}
                      aria-disabled={item.disabled || undefined}
                      aria-haspopup={item.hasSubmenu ? "menu" : undefined}
                      aria-expanded={item.hasSubmenu ? isActive : undefined}
                      tabIndex={isActive ? 0 : -1}
                      disabled={item.disabled}
                      onMouseEnter={() => setActiveIndex(absoluteIndex)}
                      onClick={() => selectItem(item)}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm"
                      style={{
                        background: isActive ? "color-mix(in oklab, " + state.accent + " 26%, transparent)" : "transparent",
                        color: item.disabled ? state.muted : state.foreground,
                      }}
                    >
                      <span>{item.role === "menuitemcheckbox" ? (item.checked ? "[x] " : "[ ] ") : item.role === "menuitemradio" ? (item.checked ? "(o) " : "( ) ") : ""}{item.label}</span>
                      <span className="text-xs" style={{ color: state.muted }}>
                        {item.hasSubmenu ? "Submenu" : state.showShortcuts ? item.shortcut : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      <p className="mt-4 text-xs" style={{ color: state.muted }}>
        {state.helper} Keyboard: Enter/Space opens, Arrow keys move, Home/End jump, Escape closes. Placement {state.side}/{state.align}, offset {state.offset ?? 10}px.
      </p>
    </section>
  );
}
