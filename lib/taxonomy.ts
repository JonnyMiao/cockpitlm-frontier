import type { CockpitMatch, SourcePaper, TaxonomyMatch } from "@/types/research";

type Rule = { slug: string; name: string; keywords: string[]; description?: string; group?: string; rationale?: string };

export const TOPIC_RULES: Rule[] = [
  { slug: "multimodal-fusion", name: "Multimodal Fusion", keywords: ["multimodal fusion", "cross attention", "modality fusion", "audio visual", "sensor fusion"] },
  { slug: "video-vlm", name: "Video VLM", keywords: ["video language", "video-language", "video understanding", "temporal reasoning", "long video"] },
  { slug: "native-omni", name: "Native OMNI", keywords: ["omni-modal", "omnimodal", "native multimodal", "speech vision language", "any-to-any"] },
  { slug: "vlm-fine-tuning", name: "VLM Fine-tuning", keywords: ["fine-tuning", "finetuning", "instruction tuning", "lora", "qlora", "parameter-efficient"] },
  { slug: "distillation", name: "Distillation", keywords: ["distillation", "teacher student", "teacher-student", "knowledge transfer"] },
  { slug: "edge-vlm", name: "Edge VLM", keywords: ["efficient vlm", "on-device", "edge deployment", "quantization", "token compression", "visual token pruning", "low latency"] },
  { slug: "world-model", name: "World Model", keywords: ["world model", "video generation", "future prediction", "action-conditioned", "latent dynamics"] },
  { slug: "multimodal-agent", name: "Multimodal Agent", keywords: ["multimodal agent", "vision-language agent", "gui agent", "tool use", "function calling", "computer use"] },
  { slug: "multimodal-reasoning", name: "Multimodal Reasoning", keywords: ["multimodal reasoning", "visual reasoning", "spatial reasoning", "chain-of-thought", "reasoning"] },
];

export const TECHNIQUE_RULES: Rule[] = [
  { slug: "vision-encoder", name: "Vision Encoder", keywords: ["vision encoder", "visual encoder", "vit", "siglip", "clip encoder"] },
  { slug: "connector", name: "Connector / Projector", keywords: ["projector", "connector", "q-former", "qformer", "resampler", "query tokens"] },
  { slug: "cross-attention", name: "Cross Attention", keywords: ["cross-attention", "cross attention"] },
  { slug: "unified-transformer", name: "Unified Transformer", keywords: ["unified transformer", "single transformer", "unified autoregressive"] },
  { slug: "temporal-modeling", name: "Temporal Modeling", keywords: ["temporal", "long video", "memory bank", "streaming video"] },
  { slug: "instruction-tuning", name: "Instruction Tuning", keywords: ["instruction tuning", "instruction data", "supervised fine-tuning", "sft"] },
  { slug: "peft", name: "LoRA / QLoRA / PEFT", keywords: ["lora", "qlora", "peft", "parameter-efficient"] },
  { slug: "synthetic-data", name: "Synthetic Data", keywords: ["synthetic data", "data synthesis", "generated instruction"] },
  { slug: "token-compression", name: "Token Compression", keywords: ["token compression", "token pruning", "token merging", "visual token reduction"] },
  { slug: "quantization", name: "Quantization", keywords: ["quantization", "low-bit", "int4", "int8"] },
  { slug: "knowledge-distillation", name: "Knowledge Distillation", keywords: ["distillation", "teacher-student", "teacher student"] },
  { slug: "tool-use", name: "Tool Use / Function Calling", keywords: ["tool use", "function calling", "api calling", "gui agent"] },
];

export const COCKPIT_RULES: Rule[] = [
  { slug: "occupant-perception", name: "Occupant & Object Perception", group: "Perception", keywords: ["human object", "object detection", "scene understanding", "egocentric"], rationale: "Cabin perception benefits from robust human–object and scene grounding." },
  { slug: "multi-camera", name: "Multi-camera Association", group: "Perception", keywords: ["multi-camera", "multi camera", "multi-view", "multiview"], rationale: "Multi-view association transfers to coordinated cabin and exterior camera understanding." },
  { slug: "driver-state", name: "Driver / Occupant State", group: "Driver / Occupant State", keywords: ["gaze", "head pose", "emotion", "drowsiness", "fatigue", "distraction", "attention", "posture"], rationale: "The observed state signals directly match driver and occupant monitoring tasks." },
  { slug: "behavior-event", name: "Behavior & Event Understanding", group: "Behavior / Event", keywords: ["action recognition", "behavior", "event understanding", "temporal event", "activity recognition", "long video"], rationale: "Temporal modeling can represent multi-step cabin behaviors and events." },
  { slug: "intention-prediction", name: "Intention & Future Prediction", group: "Intention / Reasoning", keywords: ["intention", "future action", "future prediction", "risk prediction", "anticipation", "world model"], rationale: "Predictive representations can support occupant intent and risk anticipation." },
  { slug: "multimodal-interaction", name: "Voice + Vision Interaction", group: "Interaction", keywords: ["audio visual", "speech vision", "multimodal dialogue", "voice", "grounded dialogue", "omni-modal"], rationale: "Joint audio-visual reasoning is central to natural in-cabin interaction." },
  { slug: "cockpit-agent", name: "Cockpit Agent & HMI Control", group: "Agent / Execution", keywords: ["gui agent", "tool use", "function calling", "planning", "multimodal agent", "computer use"], rationale: "Tool-use and GUI grounding transfer to safe vehicle function and HMI execution." },
  { slug: "edge-deployment", name: "Edge Deployment", group: "Deployment", keywords: ["on-device", "edge", "quantization", "distillation", "token compression", "low latency", "efficient inference", "streaming"], rationale: "Efficiency techniques reduce cockpit latency, memory and accelerator load." },
];

const MODALITY_RULES = [
  ["Vision", ["image", "vision", "visual", "video"]],
  ["Video", ["video", "temporal", "frame"]],
  ["Audio", ["audio", "speech", "voice"]],
  ["Text", ["language", "text", "instruction"]],
  ["Action", ["action", "control", "robot"]],
] as const;

function searchableText(paper: SourcePaper): string {
  return `${paper.title} ${paper.abstract} ${paper.comment ?? ""} ${paper.categories.join(" ")}`.toLowerCase();
}

function matchRules(text: string, rules: Rule[]): TaxonomyMatch[] {
  return rules.flatMap((rule) => {
    const evidence = rule.keywords.filter((keyword) => text.includes(keyword));
    if (!evidence.length) return [];
    return [{ slug: rule.slug, name: rule.name, confidence: evidence.length >= 2 ? "high" : "medium", evidence } satisfies TaxonomyMatch];
  });
}

export function classifyTopics(paper: SourcePaper): TaxonomyMatch[] {
  const matches = matchRules(searchableText(paper), TOPIC_RULES);
  return matches.length ? matches : [{ slug: "multimodal-foundation", name: "Multimodal Foundations", confidence: "low", evidence: [paper.primaryCategory] }];
}

export function classifyTechniques(paper: SourcePaper): TaxonomyMatch[] {
  return matchRules(searchableText(paper), TECHNIQUE_RULES);
}

export function classifyCockpitTasks(paper: SourcePaper): CockpitMatch[] {
  const text = searchableText(paper);
  return COCKPIT_RULES.flatMap((rule) => {
    const evidence = rule.keywords.filter((keyword) => text.includes(keyword));
    if (!evidence.length) return [];
    return [{
      slug: rule.slug,
      name: rule.name,
      group: rule.group!,
      confidence: evidence.length >= 2 ? "high" : "medium",
      evidence,
      rationale: rule.rationale!,
    } satisfies CockpitMatch];
  });
}

export function classifyModalities(paper: SourcePaper): string[] {
  const text = searchableText(paper);
  return MODALITY_RULES.filter(([, terms]) => terms.some((term) => text.includes(term))).map(([name]) => name);
}

export function classifyTrainingStages(paper: SourcePaper): string[] {
  const text = searchableText(paper);
  const stages: string[] = [];
  if (/pretrain|pre-train|foundation model/.test(text)) stages.push("Pretraining");
  if (/instruction tun|supervised fine|\bsft\b/.test(text)) stages.push("SFT");
  if (/lora|qlora|parameter-efficient|\bpeft\b/.test(text)) stages.push("PEFT");
  if (/preference|\bdpo\b|reinforcement learning|\brlhf\b/.test(text)) stages.push("Preference / RL");
  return stages.length ? stages : ["Not reported"];
}
