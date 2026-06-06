"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Switch from "@/components/shared/input/Switch";
import type { DropdownMenuState } from "../types";

type Props = { state: DropdownMenuState; update: <K extends keyof DropdownMenuState>(key: K, value: DropdownMenuState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return <SectionCard title="Behavior" subtitle="Behavior controls for native dropdown generation."><Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} />
<Switch label="Dismiss on select" checked={state.dismissOnSelect ?? true} onChange={(value) => update("dismissOnSelect", value)} />
<Switch label="Loop keyboard navigation" checked={state.loopNavigation ?? true} onChange={(value) => update("loopNavigation", value)} /></SectionCard>;
}
