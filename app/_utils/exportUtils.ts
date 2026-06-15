import type { DropdownMenuState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: DropdownMenuState, fileName = "dropdown-menu"): ExportPayload {
  return { fileName: `${fileName || "dropdown-menu"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: DropdownMenuState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};
function resolveFont(s) { return s.fontBucket === "google" ? '"' + s.googleFontFamily + '", sans-serif' : "inherit"; }
function buildShadow(s) { if (!s.shadowEnabled) return "none"; var hex = Math.round(s.shadowOpacity * 255).toString(16).padStart(2, "0"); return s.shadowX + "px " + s.shadowY + "px " + s.shadowBlur + "px " + s.shadowSpread + "px " + s.shadowColor + hex; }


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

function itemStyle(model, isCursor, isSelected, disabled) {
  const background = disabled ? "transparent" : isSelected ? model.itemActiveBg : isCursor ? model.itemHoverBg : model.itemBg;
  const color = disabled ? model.itemDisabledColor : isSelected ? model.itemActiveText : isCursor ? model.itemHoverText : model.itemText;
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: 0,
    minHeight: model.itemHeight,
    borderRadius: model.itemRadius,
    padding: "0 " + model.itemPadding + "px",
    background,
    color,
    cursor: disabled ? model.disabledCursor : "pointer",
    textAlign: "left",
    transition: model.transitionDuration > 0 ? "background 150ms ease, color 150ms ease" : "none",
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
        border: state.borderWidth + "px " + state.borderStyle + " " + (state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border),
        boxShadow: buildShadow(state),
        background: state.background,
        color: state.foreground,
        fontFamily: resolveFont(state),
        opacity: state.disabled ? (state.disabledOpacity ?? 0.5) : 1,
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
          color: state.previewState === "active" ? state.actionText : state.foreground,
          fontWeight: 700,
          cursor: state.disabled ? state.disabledCursor : "pointer",
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
            borderRadius: state.menuRadius,
            border: "1px solid " + state.menuBorder,
            padding: state.sectionPaddingY,
            background: state.menuBg,
            boxShadow: state.menuShadow,
            backdropFilter: "blur(16px)",
            outline: 0,
          }}
        >
          {Array.from({ length: groupCount }, (_, groupIndex) => {
            const groupItems = items.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize);
            if (!groupItems.length) return null;

            return (
              <div key={groupIndex} role="group" aria-label={"Group " + (groupIndex + 1)} style={{ display: "grid", gap: 4 }}>
                {groupIndex > 0 ? <div role="separator" style={{ height: 1, margin: "4px 0", background: state.separatorColor }} /> : null}
                <div style={{ padding: "4px 12px" }}>
                  <p style={{ margin: 0, color: state.groupHeaderColor, fontSize: state.groupHeaderSize, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>{"Group " + (groupIndex + 1)}</p>
                  <div style={{ height: 1, marginTop: 4, background: state.groupDividerColor }} />
                </div>
                {groupItems.map((item, itemIndex) => {
                  const absoluteIndex = groupIndex * groupSize + itemIndex;
                  const isCursor = absoluteIndex === activeIndex;
                  const isSelected = state.previewState === "selected";

                  return (
                    <button key={item.id} type="button" role={item.role} aria-checked={item.role === "menuitem" ? undefined : item.checked} aria-disabled={item.disabled || undefined} aria-haspopup={item.hasSubmenu ? "menu" : undefined} aria-expanded={item.hasSubmenu ? isCursor || isSelected : undefined} tabIndex={isCursor || isSelected ? 0 : -1} disabled={item.disabled} onMouseEnter={() => setActiveIndex(absoluteIndex)} onClick={() => selectItem(item)} style={itemStyle(state, isCursor, isSelected, item.disabled)}>
                      {item.role === "menuitemcheckbox" ? (
                        <svg aria-hidden="true" width={state.iconSize} height={state.iconSize} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="1" y="1" width="12" height="12" rx="3" stroke={state.iconColor} strokeWidth="1.5" fill={item.checked ? state.iconColor : "none"} />
                          {item.checked ? <path d="M3.5 7l2.5 2.5 4.5-5" stroke={item.disabled ? state.itemDisabledColor : state.checkmarkColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
                        </svg>
                      ) : item.role === "menuitemradio" ? (
                        <svg aria-hidden="true" width={state.iconSize} height={state.iconSize} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="7" cy="7" r="6" stroke={state.iconColor} strokeWidth="1.5" />
                          {item.checked ? <circle cx="7" cy="7" r="3" fill={state.checkmarkColor} /> : null}
                        </svg>
                      ) : null}
                      <span>{item.label}</span>
                      {item.hasSubmenu ? (
                        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: "auto", flexShrink: 0 }}>
                          <path d="M4.5 2.5L8 6l-3.5 3.5" stroke={state.submenuIndicatorColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : state.showShortcuts ? (
                        <span style={{ marginLeft: "auto", color: state.shortcutColor, fontSize: 12 }}>{item.shortcut}</span>
                      ) : null}
                    </button>
                  );
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
