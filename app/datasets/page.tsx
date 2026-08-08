import type { Metadata } from "next";
import { EntityDatabase } from "@/components/EntityDatabase";
import { PageHeader } from "@/components/PageHeader";
import { datasets } from "@/data/entities";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "数据集", "Datasets"), description: t(locale, "面向座舱研究的多模态、第一视角、驾驶与指令数据集。", "Multimodal, egocentric, driving and instruction datasets for cockpit research.") }; }

export default async function DatasetsPage() {
  const locale = await getLocale();
  return <><PageHeader eyebrow={t(locale, "知识实体数据库", "Knowledge entity database")} title={t(locale, "数据集", "Datasets")} description={t(locale, "从规模、模态、时序结构、多摄像头覆盖、标注、可用性和微调适用性理解数据集。", "Scale, modalities, temporal structure, multi-camera coverage, annotation, availability and fine-tuning suitability.")} meta={<><span>{t(locale, `${datasets.length} 个维护中的档案`, `${datasets.length} maintained profiles`)}</span><span>{t(locale, "通用 + 视频 + 驾驶", "General + video + driving")}</span><span>{t(locale, "使用前须核验许可", "License verification required")}</span></>} /><section className="section"><div className="container-wide"><EntityDatabase entities={datasets} locale={locale} /></div></section></>;
}
