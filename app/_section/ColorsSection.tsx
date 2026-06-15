"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { DropdownMenuState } from "../types";

type Props = { state: DropdownMenuState; update: <K extends keyof DropdownMenuState>(key: K, value: DropdownMenuState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Base container colors.">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </SectionCard>
      <SectionCard title="Action" subtitle="Primary button and call-to-action text.">
        <ColorControl label="Action text" value={state.actionText} onChange={(v) => update("actionText", v)} />
      </SectionCard>
      <SectionCard title="Menu panel" subtitle="Dropdown panel surface.">
        <ColorControl label="Menu background" value={state.menuBg} onChange={(v) => update("menuBg", v)} />
        <ColorControl label="Menu border" value={state.menuBorder} onChange={(v) => update("menuBorder", v)} />
      </SectionCard>
      <SectionCard title="Items" subtitle="Menu item color states.">
        <ColorControl label="Item background" value={state.itemBg} onChange={(v) => update("itemBg", v)} />
        <ColorControl label="Item text" value={state.itemText} onChange={(v) => update("itemText", v)} />
        <ColorControl label="Item hover background" value={state.itemHoverBg} onChange={(v) => update("itemHoverBg", v)} />
        <ColorControl label="Item hover text" value={state.itemHoverText} onChange={(v) => update("itemHoverText", v)} />
        <ColorControl label="Item active background" value={state.itemActiveBg} onChange={(v) => update("itemActiveBg", v)} />
        <ColorControl label="Item active text" value={state.itemActiveText} onChange={(v) => update("itemActiveText", v)} />
        <ColorControl label="Item disabled text" value={state.itemDisabledColor} onChange={(v) => update("itemDisabledColor", v)} />
      </SectionCard>
      <SectionCard title="Structure" subtitle="Separators, group headers, and item details.">
        <ColorControl label="Separator" value={state.separatorColor} onChange={(v) => update("separatorColor", v)} />
        <ColorControl label="Group header" value={state.groupHeaderColor} onChange={(v) => update("groupHeaderColor", v)} />
        <ColorControl label="Group divider" value={state.groupDividerColor} onChange={(v) => update("groupDividerColor", v)} />
        <ColorControl label="Shortcut" value={state.shortcutColor} onChange={(v) => update("shortcutColor", v)} />
        <ColorControl label="Icon" value={state.iconColor} onChange={(v) => update("iconColor", v)} />
        <ColorControl label="Checkmark" value={state.checkmarkColor} onChange={(v) => update("checkmarkColor", v)} />
        <ColorControl label="Submenu indicator" value={state.submenuIndicatorColor} onChange={(v) => update("submenuIndicatorColor", v)} />
      </SectionCard>
    </div>
  );
}
