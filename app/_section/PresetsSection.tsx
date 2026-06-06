"use client";

import { useMemo, useState } from "react";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import { DROPDOWNMENU_PRESETS } from "../_data/DropdownMenuPresets";
import type { StudioPreset } from "../types";

const PAGE_SIZE = 8;

export default function PresetsSection({ activePresetId, onApply }: { activePresetId: string | null; onApply: (preset: StudioPreset) => void }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [size, setSize] = useState("all");
  const [page, setPage] = useState(0);
  const [surpriseStep, setSurpriseStep] = useState(0);
  const families = useMemo(() => ["all", ...Array.from(new Set(DROPDOWNMENU_PRESETS.map((preset) => preset.family)))], []);
  const sizes = useMemo(() => ["all", ...Array.from(new Set(DROPDOWNMENU_PRESETS.map((preset) => preset.size)))], []);
  const filtered = DROPDOWNMENU_PRESETS.filter((preset) => [preset.family, preset.archetype, preset.variant, preset.size, ...preset.tags].join(" ").toLowerCase().includes(query.toLowerCase()) && (family === "all" || preset.family === family) && (size === "all" || preset.size === size));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const surpriseSource = filtered.length ? filtered : DROPDOWNMENU_PRESETS;
  const surpriseKey = `${query}|${family}|${size}|${currentPage}|${surpriseStep}`;
  const surpriseIndex = Array.from(surpriseKey).reduce((sum, char) => sum + char.charCodeAt(0), 0) % surpriseSource.length;
  const resetFilters = () => {
    setQuery("");
    setFamily("all");
    setSize("all");
    setPage(0);
  };
  const applySurprise = () => {
    onApply(surpriseSource[surpriseIndex]);
    setSurpriseStep((value) => value + 1);
  };

  return <SectionCard title="Presets" subtitle={`${DROPDOWNMENU_PRESETS.length} structured full-state presets with paged browsing.`}><div className="grid gap-3 sm:grid-cols-3"><Input label="Search presets" value={query} onChange={(value) => { setQuery(value); setPage(0); }} /><Select label="Family" value={family} options={families} onChange={(value) => { setFamily(value); setPage(0); }} /><Select label="Size" value={size} options={sizes} onChange={(value) => { setSize(value); setPage(0); }} /></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={applySurprise} className="rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Surprise me</button><button type="button" onClick={resetFilters} className="rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Reset filters</button></div><div className="mt-3 text-xs" style={{ color: "var(--muted)" }}>{filtered.length} matches / page {currentPage + 1} of {pageCount}</div><div className="mt-3 grid gap-3">{visible.map((preset) => <button key={preset.id} type="button" onClick={() => onApply(preset)} className="rounded-2xl border p-4 text-left" style={{ borderColor: activePresetId === preset.id ? "var(--primary)" : "var(--border)", background: activePresetId === preset.id ? "color-mix(in oklab, var(--primary) 20%, transparent)" : "color-mix(in oklab, var(--card) 65%, transparent)", color: "var(--text)" }}><strong>{preset.archetype}</strong><span className="ml-2 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{preset.variant} / {preset.size}</span><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{preset.tags.join(", ")}</p></button>)}{visible.length === 0 ? <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>No presets match these filters. Use Reset filters or Surprise me.</div> : null}</div><div className="mt-3 flex items-center justify-between gap-3"><button type="button" disabled={currentPage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Previous</button><button type="button" disabled={currentPage >= pageCount - 1} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Next</button></div></SectionCard>;
}
