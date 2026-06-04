"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import type { DropdownMenuState } from "../types";

type Props = { state: DropdownMenuState; update: <K extends keyof DropdownMenuState>(key: K, value: DropdownMenuState[K]) => void };

export default function PlacementSection({ state, update }: Props) {
  return <SectionCard title="Placement" subtitle="Placement controls for native dropdown generation."><Select label="Side" value={state.side} options={[
  "top",
  "right",
  "bottom",
  "left"
]} onChange={(value) => update("side", value)} />
<Select label="Align" value={state.align} options={[
  "start",
  "center",
  "end"
]} onChange={(value) => update("align", value)} /></SectionCard>;
}
