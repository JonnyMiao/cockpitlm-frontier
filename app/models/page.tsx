import type { Metadata } from "next";
import { EntityDatabase } from "@/components/EntityDatabase";
import { PageHeader } from "@/components/PageHeader";
import { models } from "@/data/entities";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "模型", "Models"), description: t(locale, "来源可追溯的多模态模型档案与座舱适用性分析。", "Source-linked multimodal model profiles and cockpit suitability.") }; }

export default async function ModelsPage() {
  const locale = await getLocale();
  return <><PageHeader eyebrow={t(locale, "知识实体数据库", "Knowledge entity database")} title={t(locale, "模型", "Models")} description={t(locale, "集中呈现架构、模态、权重、许可证、规模与部署适用性；未知字段不做猜测。", "Architecture, modalities, weights, licenses, scale and deployment suitability—without filling unknown fields by guesswork.")} meta={<><span>{t(locale, `${models.length} 个维护中的档案`, `${models.length} maintained profiles`)}</span><span>{t(locale, "来源可追溯", "Source-linked")}</span><span>{t(locale, "以具体检查点条款为准", "Checkpoint terms take precedence")}</span></>} /><section className="section"><div className="container-wide"><EntityDatabase entities={models} locale={locale} /></div></section></>;
}
