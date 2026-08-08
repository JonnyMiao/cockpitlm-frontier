import type { Metadata } from "next";
import { EntityDatabase } from "@/components/EntityDatabase";
import { PageHeader } from "@/components/PageHeader";
import { benchmarks } from "@/data/entities";
export const metadata: Metadata = { title: "Benchmarks", description: "Benchmark capability boundaries for multimodal and cockpit evaluation." };
export default function BenchmarksPage(){return <><PageHeader eyebrow="Knowledge entity database" title="Benchmarks" description="Understand what an evaluation measures—and what it cannot establish—before treating a leaderboard as engineering evidence." meta={<><span>{benchmarks.length} capability profiles</span><span>No copied leaderboard scores</span><span>Cockpit boundary noted</span></>} /><section className="section"><div className="container-wide"><EntityDatabase entities={benchmarks}/></div></section></>}
