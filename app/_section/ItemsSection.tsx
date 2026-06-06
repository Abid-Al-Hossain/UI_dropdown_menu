"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import type { DropdownMenuState } from "../types";

type Props = { state: DropdownMenuState; update: <K extends keyof DropdownMenuState>(key: K, value: DropdownMenuState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Items controls for native dropdown generation."><Slider label="Item count" value={state.itemCount} min={1} max={14} step={1} onChange={(value) => update("itemCount", value)} />
<Slider label="Groups" value={state.groupCount} min={1} max={8} step={1} onChange={(value) => update("groupCount", value)} />
<Slider label="Submenus" value={state.submenuCount} min={0} max={4} step={1} onChange={(value) => update("submenuCount", value)} />
<Switch label="Checkbox/radio items" checked={state.checkableItems} onChange={(value) => update("checkableItems", value)} />
<Switch label="Show shortcuts" checked={state.showShortcuts} onChange={(value) => update("showShortcuts", value)} /></SectionCard>;
}
