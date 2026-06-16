"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Slider from "@/components/shared/input/Slider";
import type { DropdownMenuState } from "../types";

type Props = { state: DropdownMenuState; update: <K extends keyof DropdownMenuState>(key: K, value: DropdownMenuState[K]) => void };

export default function MetadataSection({ state, update }: Props) {
  return <SectionCard title="Metadata" subtitle="Metadata controls for native dropdown generation.">
      <div className="space-y-4"><Input label="id" value={state.id} onChange={(value) => update("id", value)} />
<Input label="aria-label" value={state.ariaLabel} onChange={(value) => update("ariaLabel", value)} />
<div className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Role is fixed to <strong style={{ color: "var(--text)" }}>{state.role}</strong>; dropdown items use menuitem, menuitemcheckbox, and menuitemradio where applicable.</div>
<Slider label="tabIndex" value={state.tabIndex} min={0} max={4} step={1} onChange={(value) => update("tabIndex", value)} /></div>
    </SectionCard>;
}
