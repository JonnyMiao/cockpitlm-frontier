import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { COCKPIT_RULES } from "@/lib/taxonomy";
import { cockpitGroup, cockpitGroupAnchors, cockpitName, cockpitRationale, getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "智能座舱情报", "Cockpit Intelligence"), description: t(locale, "面向多模态研究迁移的座舱任务分类与技术地图。", "Cockpit task taxonomy and technical map for multimodal research transfer.") }; }

const stages = [
  ["01", "Sensing", "Camera · microphone · CAN · radar · HMI"], ["02", "Representation", "Vision · audio · state encoders"], ["03", "Fusion", "Cross-attention · tokens · query modules"],
  ["04", "Understanding", "Objects · occupants · behavior · events"], ["05", "Reasoning", "Intent · risk · future actions"], ["06", "Interaction", "Voice · vision · gesture · dialogue"],
  ["07", "Agent", "Planning · tool use · GUI grounding"], ["08", "Execution", "Vehicle functions · safety validation"], ["09", "Edge", "Streaming · compression · deployment"],
];

export default async function CockpitPage() {
  const locale = await getLocale();
  const groups = [...new Set(COCKPIT_RULES.map((task) => task.group).filter((group): group is string => Boolean(group)))];
  const localizedStages = locale === "zh" ? [
    ["01", "感知输入", "摄像头 · 麦克风 · CAN · 雷达 · HMI"], ["02", "表征", "视觉 · 音频 · 状态编码器"], ["03", "融合", "交叉注意力 · Token · 查询模块"],
    ["04", "理解", "物体 · 乘员 · 行为 · 事件"], ["05", "推理", "意图 · 风险 · 未来动作"], ["06", "交互", "语音 · 视觉 · 手势 · 对话"],
    ["07", "智能体", "规划 · 工具调用 · GUI 定位"], ["08", "执行", "车辆功能 · 安全校验"], ["09", "端侧", "流式推理 · 压缩 · 部署"],
  ] : stages;
  return (
    <>
      <PageHeader eyebrow={t(locale, "智能座舱情报", "Cockpit intelligence")} title={t(locale, "将通用多模态研究转化为车辆工程决策", "Translate general multimodal research into vehicle decisions")} description={t(locale, "以任务为中心，构建覆盖舱内感知、乘员理解、交互、智能体与端侧部署的分类体系和技术地图。", "A task-first taxonomy and technical map for cabin perception, occupant understanding, interaction, agents and edge deployment.")} meta={<><span>{t(locale, "多摄像头是一等能力", "Multi-camera is first-class")}</span><span>{t(locale, "保留非视觉信号结构", "Non-visual signals keep their structure")}</span><span>{t(locale, "安全校验独立于模型置信度", "Safety validation stays outside model confidence")}</span></>} />
      <section className="section technical-map"><div className="container-wide"><div className="section-heading"><div><span className="eyebrow">{t(locale, "端到端地图", "End-to-end map")}</span><h2>{t(locale, "座舱技术地图", "Cockpit technical map")}</h2><p>{t(locale, "每个阶段均可关联方法、论文、模型和数据集。", "Methods, papers, models and datasets can attach to every stage.")}</p></div></div><div className="map-track">{localizedStages.map(([number,title,text],index)=><div key={title}><span>{number}</span><strong>{title}</strong><small>{text}</small>{index<localizedStages.length-1&&<i>→</i>}</div>)}</div></div></section>
      <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">{t(locale, "任务图谱", "Task graph")}</span><h2>{t(locale, "座舱任务分类", "Cockpit taxonomy")}</h2><p>{t(locale, "一篇论文可依据明确证据和理由映射到多个任务。", "A paper can map to multiple tasks with explicit evidence and rationale.")}</p></div></div><div className="taxonomy-groups">{groups.map((group) => { const groupTasks = COCKPIT_RULES.filter((task)=>task.group===group); const first = groupTasks[0]; return <section id={cockpitGroupAnchors[group] ?? group.toLowerCase().replaceAll(" ", "-")} key={group}><h3>{first ? cockpitGroup(locale, first as Parameters<typeof cockpitGroup>[1]) : group}</h3><div>{groupTasks.map((task)=><Link href={`/papers?cockpit=${task.slug}&sort=cockpit`} key={task.slug}><strong>{cockpitName(locale, task as Parameters<typeof cockpitName>[1])}</strong><p>{cockpitRationale(locale, task as Parameters<typeof cockpitRationale>[1])}</p><span>{t(locale, "浏览映射论文", "Browse mapped papers")} <ArrowRight size={12} /></span></Link>)}</div></section>; })}</div></div></section>
      <section className="section signal-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">{t(locale, "融合原则", "Fusion principles")}</span><h2>{t(locale, "异构信号不只是文本", "Heterogeneous signals are not just text")}</h2></div></div><div className="signal-grid">{(locale === "zh" ? ["多摄像头","麦克风阵列","语音","车辆状态","CAN 总线","HMI 状态","视线","手势","座椅状态","雷达","用户历史","导航上下文"] : ["Multi-camera","Microphone array","Speech","Vehicle state","CAN","HMI state","Gaze","Gesture","Seat state","Radar","User history","Navigation context"]).map((signal)=><span key={signal}>{signal}</span>)}</div><div className="principle-note"><strong>{t(locale, "设计原则", "Design principle")}</strong><p>{t(locale, "对于稀疏、可读状态可按需序列化；当任务依赖连续时序、不确定性或几何关系时，应通过专用编码器或结构化 Token 保留这些信息。", "Serialize sparse human-readable state when useful, but preserve continuous timing, uncertainty and geometry through dedicated encoders or structured tokens when the task depends on them.")}</p></div></div></section>
    </>
  );
}
