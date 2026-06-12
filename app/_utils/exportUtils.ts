import type { DropdownMenuState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: DropdownMenuState, fileName = "dropdown-menu"): ExportPayload {
  return { fileName: `${fileName || "dropdown-menu"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: DropdownMenuState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

function buildItems(model) {
  return Array.from({ length: model.itemCount }, (_, index) => {
    const role = model.checkableItems && index === 1 ? "menuitemcheckbox" : model.checkableItems && index === 3 ? "menuitemradio" : "menuitem";

    return {
      id: model.id + "-item-" + (index + 1),
      label: model.label + " " + (index + 1),
      shortcut: index % 3 === 0 ? "Ctrl+K" : index % 3 === 1 ? "Shift+Enter" : "Alt+M",
      role,
      checked: role !== "menuitem" && index % 2 === 1,
      disabled: model.disabled || (model.itemCount > 4 && index === model.itemCount - 1),
      hasSubmenu: index < model.submenuCount,
    };
  });
}

function itemStyle(model, active, disabled) {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    border: 0,
    borderRadius: 12,
    padding: "10px 12px",
    background: active ? model.accent : "transparent",
    color: disabled ? model.muted : active ? "#020617" : model.foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    textAlign: "left",
    transition: model.motion ? "background 150ms ease, color 150ms ease" : "none",
  };
}

function nextIndex(current, direction, total, loop) {
  if (loop) return (current + direction + total) % total;
  return Math.min(total - 1, Math.max(0, current + direction));
}

export default function DropdownMenuComponent() {
  const [open, setOpen] = React.useState(state.previewState !== "closed" && !state.disabled);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const items = buildItems(state);
  const menuId = state.id + "-menu";
  const resolvedOpen = !state.disabled && (state.previewState === "open" || (state.previewState !== "closed" && open));
  const groupCount = Math.max(1, Math.min(state.groupCount, items.length));
  const groupSize = Math.ceil(items.length / groupCount);
  const loopNavigation = state.loopNavigation ?? true;
  const offset = state.offset ?? 10;
  const menuPlacementStyle = {
    alignSelf: state.align === "center" ? "center" : state.align === "end" ? "flex-end" : "flex-start",
    marginTop: state.side === "bottom" ? offset : 0,
    marginRight: state.side === "left" ? offset : 0,
    marginBottom: state.side === "top" ? offset : 0,
    marginLeft: state.side === "right" ? offset : 0,
  };

  const handleTriggerKeyDown = (event) => {
    if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    setOpen(true);
    setActiveIndex(0);
  };

  const handleMenuKeyDown = (event) => {
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

  const selectItem = (item) => {
    if (item.disabled) return;
    if (state.dismissOnSelect ?? true) setOpen(false);
  };

  return (
    <section
      id={state.id}
      aria-label={state.ariaLabel}
      style={{
        width: state.width,
        minHeight: state.height,
        padding: state.padding,
        borderRadius: state.radius,
        border: state.borderWidth + "px solid " + state.border,
        boxShadow: "0 " + Math.round(state.shadow / 3) + "px " + state.shadow + "px rgba(0,0,0,.28)",
        background: state.background,
        color: state.foreground,
        fontFamily: state.fontFamily,
        opacity: state.disabled ? 0.55 : 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: state.gap,
      }}
    >
      <div>
        <p style={{ margin: 0, color: state.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>{state.title}</p>
        <h3 style={{ margin: "8px 0 0", fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.description}</h3>
      </div>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={resolvedOpen}
        aria-controls={menuId}
        disabled={state.disabled}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          width: "fit-content",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderRadius: 16,
          border: "1px solid " + (state.previewState === "focus" ? state.accent : state.border),
          padding: "12px 16px",
          background: state.previewState === "active" ? state.accent : "rgba(255,255,255,.06)",
          color: state.previewState === "active" ? "#020617" : state.foreground,
          fontWeight: 700,
          cursor: state.disabled ? "not-allowed" : "pointer",
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
          style={{
            ...menuPlacementStyle,
            width: "100%",
            maxWidth: 360,
            display: "grid",
            gap: 8,
            borderRadius: 18,
            border: "1px solid " + state.border,
            padding: 8,
            background: "rgba(2,6,23,.74)",
            backdropFilter: "blur(16px)",
            outline: 0,
          }}
        >
          {Array.from({ length: groupCount }, (_, groupIndex) => {
            const groupItems = items.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize);
            if (!groupItems.length) return null;

            return (
              <div key={groupIndex} role="group" aria-label={"Group " + (groupIndex + 1)} style={{ display: "grid", gap: 4 }}>
                {groupIndex > 0 ? <div role="separator" style={{ height: 1, margin: "4px 0", background: state.border }} /> : null}
                {groupItems.map((item, itemIndex) => {
                  const absoluteIndex = groupIndex * groupSize + itemIndex;
                  const active = absoluteIndex === activeIndex || state.previewState === "selected";
                  const label = (item.role === "menuitemcheckbox" ? (item.checked ? "[x] " : "[ ] ") : item.role === "menuitemradio" ? (item.checked ? "(o) " : "( ) ") : "") + item.label;

                  if (item.role === "menuitemcheckbox") {
                    return <button key={item.id} type="button" role="menuitemcheckbox" aria-checked={item.checked} aria-disabled={item.disabled || undefined} aria-haspopup={item.hasSubmenu ? "menu" : undefined} aria-expanded={item.hasSubmenu ? active : undefined} tabIndex={active ? 0 : -1} disabled={item.disabled} onMouseEnter={() => setActiveIndex(absoluteIndex)} onClick={() => selectItem(item)} style={itemStyle(state, active, item.disabled)}><span>{label}</span><span style={{ color: active ? "#020617" : state.muted, fontSize: 12 }}>{item.hasSubmenu ? "Submenu" : state.showShortcuts ? item.shortcut : ""}</span></button>;
                  }

                  if (item.role === "menuitemradio") {
                    return <button key={item.id} type="button" role="menuitemradio" aria-checked={item.checked} aria-disabled={item.disabled || undefined} aria-haspopup={item.hasSubmenu ? "menu" : undefined} aria-expanded={item.hasSubmenu ? active : undefined} tabIndex={active ? 0 : -1} disabled={item.disabled} onMouseEnter={() => setActiveIndex(absoluteIndex)} onClick={() => selectItem(item)} style={itemStyle(state, active, item.disabled)}><span>{label}</span><span style={{ color: active ? "#020617" : state.muted, fontSize: 12 }}>{item.hasSubmenu ? "Submenu" : state.showShortcuts ? item.shortcut : ""}</span></button>;
                  }

                  return <button key={item.id} type="button" role="menuitem" aria-disabled={item.disabled || undefined} aria-haspopup={item.hasSubmenu ? "menu" : undefined} aria-expanded={item.hasSubmenu ? active : undefined} tabIndex={active ? 0 : -1} disabled={item.disabled} onMouseEnter={() => setActiveIndex(absoluteIndex)} onClick={() => selectItem(item)} style={itemStyle(state, active, item.disabled)}><span>{label}</span><span style={{ color: active ? "#020617" : state.muted, fontSize: 12 }}>{item.hasSubmenu ? "Submenu" : state.showShortcuts ? item.shortcut : ""}</span></button>;
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      <p style={{ margin: 0, color: state.muted, fontSize: state.bodySize }}>
        {state.helper} Keyboard: Enter/Space opens, Arrow keys move, Home/End jump, Escape closes. Placement {state.side}/{state.align}, offset {offset}px.
      </p>
    </section>
  );
}
`;
}
