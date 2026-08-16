import { cookies } from "next/headers";
import type { CockpitMatch, EnrichedPaper, KnowledgeEntity, TaxonomyMatch } from "@/types/research";

export type Locale = "zh" | "en";

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("cockpitlm_locale")?.value === "en" ? "en" : "zh";
}

export function t(locale: Locale, zh: string, en: string): string {
  return locale === "zh" ? zh : en;
}

const topicZh: Record<string, string> = {
  "multimodal-fusion": "多模态融合",
  "video-vlm": "视频 VLM",
  "native-omni": "原生全模态模型",
  "vlm-fine-tuning": "VLM 微调",
  distillation: "知识蒸馏",
  "edge-vlm": "端侧 VLM",
  "world-model": "世界模型",
  "multimodal-agent": "多模态智能体",
  "multimodal-reasoning": "多模态推理",
  "multimodal-foundation": "多模态基础模型",
};

const techniqueZh: Record<string, string> = {
  "vision-encoder": "视觉编码器",
  connector: "连接器 / 投影器",
  "cross-attention": "交叉注意力",
  "unified-transformer": "统一 Transformer",
  "temporal-modeling": "时序建模",
  "instruction-tuning": "指令微调",
  peft: "LoRA / QLoRA / PEFT",
  "synthetic-data": "合成数据",
  "token-compression": "Token 压缩",
  quantization: "量化",
  "knowledge-distillation": "知识蒸馏",
  "tool-use": "工具调用 / 函数调用",
};

const cockpitZh: Record<string, { name: string; group: string; rationale: string }> = {
  "occupant-perception": { name: "乘员与物体感知", group: "感知", rationale: "稳健的人—物关系与场景定位能力可直接支持舱内感知。" },
  "multi-camera": { name: "多摄像头关联", group: "感知", rationale: "多视角关联能力可迁移到舱内外摄像头的协同理解。" },
  "driver-state": { name: "驾驶员 / 乘员状态", group: "驾驶员 / 乘员状态", rationale: "视线、头姿、情绪、疲劳与注意力等信号直接对应驾乘监测任务。" },
  "behavior-event": { name: "行为与事件理解", group: "行为 / 事件", rationale: "时序建模可表示多步骤舱内行为与事件。" },
  "intention-prediction": { name: "意图与未来预测", group: "意图 / 推理", rationale: "预测式表征可支持乘员意图识别和风险预判。" },
  "multimodal-interaction": { name: "语音 + 视觉交互", group: "交互", rationale: "音视频联合推理是自然舱内交互的核心能力。" },
  "cockpit-agent": { name: "座舱智能体与 HMI 控制", group: "智能体 / 执行", rationale: "工具调用与 GUI 定位能力可迁移到安全的车辆功能和 HMI 执行。" },
  "edge-deployment": { name: "端侧部署", group: "部署", rationale: "高效推理技术可降低座舱时延、内存占用与加速器负载。" },
};

const modalityZh: Record<string, string> = {
  Vision: "视觉", Video: "视频", Audio: "音频", Text: "文本", Action: "动作",
  Image: "图像", "Multi-image": "多图像", "Multi-camera": "多摄像头", LiDAR: "激光雷达",
  Radar: "毫米波雷达", CAN: "CAN 总线", Maps: "地图", Language: "语言",
  "Egocentric video": "第一视角视频", "Audio subset": "音频子集", "Text annotations": "文本标注",
  "Scene graph": "场景图", "Driving graph": "驾驶图谱", "Multi-camera images": "多摄像头图像",
};

const statusZh: Record<string, string> = {
  Emerging: "新兴", Rising: "上升", Active: "活跃", Mature: "成熟", "Insufficient sample": "样本不足",
};

export function topicName(locale: Locale, item: Pick<TaxonomyMatch, "slug" | "name">): string {
  return locale === "zh" ? topicZh[item.slug] ?? item.name : item.name;
}

export function techniqueName(locale: Locale, item: Pick<TaxonomyMatch, "slug" | "name">): string {
  return locale === "zh" ? techniqueZh[item.slug] ?? item.name : item.name;
}

export function cockpitName(locale: Locale, item: Pick<CockpitMatch, "slug" | "name">): string {
  return locale === "zh" ? cockpitZh[item.slug]?.name ?? item.name : item.name;
}

export function cockpitGroup(locale: Locale, item: Pick<CockpitMatch, "slug" | "group">): string {
  return locale === "zh" ? cockpitZh[item.slug]?.group ?? item.group : item.group;
}

export function cockpitRationale(locale: Locale, item: Pick<CockpitMatch, "slug" | "rationale">): string {
  return locale === "zh" ? cockpitZh[item.slug]?.rationale ?? item.rationale : item.rationale;
}

export function modalityName(locale: Locale, name: string): string {
  return locale === "zh" ? modalityZh[name] ?? name : name;
}

export function trainingStageName(locale: Locale, name: string): string {
  if (locale === "en") return name;
  return ({ Pretraining: "预训练", SFT: "监督微调（SFT）", PEFT: "参数高效微调（PEFT）", "Preference / RL": "偏好优化 / 强化学习", "Not reported": "未报告" } as Record<string, string>)[name] ?? name;
}

export function trendStatus(locale: Locale, status: string): string {
  return locale === "zh" ? statusZh[status] ?? status : status;
}

export function scoreLabel(locale: Locale, label: string): string {
  if (locale === "en") return label;
  return ({ Low: "低", Moderate: "中等", Notable: "较高", High: "高", Leading: "领先" } as Record<string, string>)[label] ?? label;
}

export function localizedPaperIntelligence(locale: Locale, paper: EnrichedPaper) {
  if (locale === "en") return paper.intelligence;
  const topics = paper.topics.slice(0, 2).map((item) => topicName(locale, item)).join("、") || "多模态基础模型";
  const methods = paper.techniques.slice(0, 2).map((item) => techniqueName(locale, item)).join("、") || "核心方法";
  const tasks = paper.cockpitTasks.slice(0, 3).map((item) => cockpitName(locale, item)).join("、");
  return {
    ...paper.intelligence,
    summary: `该研究聚焦${topics}，主要涉及${methods}。具体实验结论请以原论文为准。`,
    problem: paper.abstract,
    contribution: `从已索引的来源元数据看，论文围绕${topics}提出了新的方法或系统。请阅读原文核验架构细节与实验结论。`,
    whyItMatters: `这项工作对${topics}研究具有参考价值，并呈现了可进一步验证的方法信号。`,
    whatCanWeBorrow: `建议先独立评估“${methods}”设计，再决定是否复现完整训练方案。`,
    cockpitTransfer: tasks ? `可重点评估其对${tasks}等座舱任务的迁移价值。` : "当前元数据未检测到直接座舱任务映射，仍建议由领域专家复核。",
    recommendedExperiment: `在固定数据划分、时延和显存预算下复现最小可验证组件，并与强基线开展座舱域消融对比。`,
    strengths: ["来源记录可追溯", `与${topics}技术方向相关`, "可形成明确的复现实验假设"],
    limitations: ["当前情报基于来源元数据生成", "定量结果尚未由平台独立复核", "座舱迁移价值需要领域数据验证"],
  };
}

export function entityKind(locale: Locale, kind: KnowledgeEntity["kind"]): string {
  if (locale === "en") return kind;
  return { model: "模型", dataset: "数据集", benchmark: "基准" }[kind];
}

export function attributeName(locale: Locale, name: string): string {
  if (locale === "en") return name;
  return ({ Weights: "权重", License: "许可证", Architecture: "架构", Parameters: "参数规模", Context: "上下文", Deployment: "部署", Scale: "规模", Temporal: "时序", Annotation: "标注", Availability: "可用性", MultiCamera: "多摄像头", Focus: "评测重点", Split: "数据划分", Limitation: "局限", Ranking: "排名", Duration: "时长", Tasks: "任务", Format: "形式" } as Record<string, string>)[name] ?? name;
}

export const cockpitGroupAnchors: Record<string, string> = {
  Perception: "perception",
  "Driver / Occupant State": "driver-state",
  "Behavior / Event": "behavior-event",
  "Intention / Reasoning": "intention-reasoning",
  Interaction: "interaction",
  "Agent / Execution": "agent",
  Deployment: "deployment",
};

