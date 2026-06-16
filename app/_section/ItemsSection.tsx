"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import Input from "@/components/shared/input/Input";
import type { DropdownMenuState } from "../types";

type Props = { state: DropdownMenuState; update: <K extends keyof DropdownMenuState>(key: K, value: DropdownMenuState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Items" subtitle="Items controls for native dropdown generation.">
      <div className="space-y-4">
        <Slider label="Item count" value={state.itemCount} min={1} max={14} step={1} onChange={(value) => update("itemCount", value)} />
        <Slider label="Groups" value={state.groupCount} min={1} max={8} step={1} onChange={(value) => update("groupCount", value)} />
        <Slider label="Submenus" value={state.submenuCount} min={0} max={4} step={1} onChange={(value) => update("submenuCount", value)} />
        <Switch label="Checkbox/radio items" checked={state.checkableItems} onChange={(value) => update("checkableItems", value)} />
        <Switch label="Show shortcuts" checked={state.showShortcuts} onChange={(value) => update("showShortcuts", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Item geometry" subtitle="Per-item sizing and spacing.">
      <div className="space-y-4">
        <Slider label="Item height" value={state.itemHeight} min={28} max={64} step={1} onChange={(value) => update("itemHeight", value)} />
        <Slider label="Item padding" value={state.itemPadding} min={4} max={32} step={1} onChange={(value) => update("itemPadding", value)} />
        <Slider label="Item radius" value={state.itemRadius} min={0} max={24} step={1} onChange={(value) => update("itemRadius", value)} />
        <Slider label="Group header size" value={state.groupHeaderSize} min={8} max={18} step={1} onChange={(value) => update("groupHeaderSize", value)} />
        <Slider label="Icon size" value={state.iconSize} min={10} max={24} step={1} onChange={(value) => update("iconSize", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Panel geometry" subtitle="Dropdown panel sizing and elevation.">
      <div className="space-y-4">
        <Slider label="Menu radius" value={state.menuRadius} min={0} max={32} step={1} onChange={(value) => update("menuRadius", value)} />
        <Slider label="Panel padding" value={state.sectionPaddingY} min={0} max={24} step={1} onChange={(value) => update("sectionPaddingY", value)} />
        <Input label="Menu shadow (CSS)" value={state.menuShadow} onChange={(value: string) => update("menuShadow", value)} placeholder="0 18px 40px rgba(2,6,23,0.45)" />
      </div>
    </SectionCard>
    </div>
  );
}
