export interface Playbook {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  decisionTree: string[];
  pipeline: string[];
  tradeoffs: Array<{ choice: string; when: string; risk: string }>;
  failureModes: string[];
  experiments: string[];
  relatedTopics: string[];
}

export const playbooks: Playbook[] = [
  {
    slug: "fine-tuning-general-vlm", title: "Fine-tuning a General VLM for Cockpit", summary: "Choose the smallest trainable surface that can close the domain gap, then unlock more modules only when evidence demands it.",
    problem: "General VLMs underperform on cabin viewpoints, subtle occupant states, vehicle-specific HMI elements and temporal intent cues.",
    decisionTree: ["Start with a frozen-backbone linear or connector probe.", "If language behavior is wrong but perception is adequate, use LLM LoRA/SFT.", "If grounding is weak, train connector + upper vision blocks.", "Use joint fine-tuning only with sufficient diverse data and regression evaluation."],
    pipeline: ["Build subject- and scenario-disjoint splits", "Run frozen baseline", "Connector-only adaptation", "LLM LoRA / QLoRA", "Selective vision unfreezing", "Joint evaluation: task, latency, regressions"],
    tradeoffs: [
      { choice: "LLM-only SFT", when: "Perception features are adequate; output policy or vocabulary is wrong.", risk: "Cannot repair missing visual distinctions." },
      { choice: "Connector-only", when: "Small paired domain set; modality alignment is the main gap.", risk: "Capacity bottleneck." },
      { choice: "Connector + LLM", when: "Need domain grounding and output adaptation.", risk: "Language capability drift." },
      { choice: "Vision unfreezing", when: "Cabin optics or fine-grained states are not represented.", risk: "High data need and catastrophic forgetting." },
    ],
    failureModes: ["Subject leakage inflates state-recognition accuracy", "Synthetic instruction style dominates natural queries", "Single-camera gains fail under multi-camera deployment", "Task score improves while prefill latency becomes unacceptable"],
    experiments: ["Compare connector-only vs connector + LoRA with fixed token budget", "Evaluate unseen occupants and vehicle platforms", "Measure calibration on safety-relevant negative cases"], relatedTopics: ["VLM Fine-tuning", "Multimodal Fusion"],
  },
  {
    slug: "cockpit-dataset-construction", title: "Cockpit Dataset Construction", summary: "Design data around scenario coverage, identity leakage control and temporal negatives—not raw frame count.",
    problem: "Cabin datasets easily overfit occupants, vehicles, camera placement and repeated scenarios while missing hard negatives.",
    decisionTree: ["Define task and failure cost before labels.", "Choose clip length from causal context, not storage convenience.", "Split by subject, vehicle and scenario family.", "Add hard negatives that share appearance but differ in intent."],
    pipeline: ["Scenario taxonomy", "Capture matrix", "Privacy review", "Hierarchical annotation", "Leakage-safe split", "Quality audit", "Versioned release"],
    tradeoffs: [{ choice: "Dense labels", when: "Need temporal localization and diagnosis.", risk: "High cost and annotator inconsistency." }, { choice: "Weak labels", when: "Large-scale pretraining.", risk: "Noisy task boundaries." }],
    failureModes: ["Same occupant appears across splits", "Adjacent clips leak a scenario", "Positive-only gesture collection", "Audio and video clocks are misaligned"],
    experiments: ["Subject-disjoint vs random split gap", "Hard-negative ablation", "Clip-length and sampling-rate sweep"], relatedTopics: ["Video VLM", "Multimodal Fusion"],
  },
  {
    slug: "multimodal-fusion", title: "Camera + Audio + Vehicle-state Fusion", summary: "Preserve structure and timing of each signal; do not serialize every non-visual signal into text by default.",
    problem: "Cabin systems combine cameras, microphones, CAN, HMI state, gaze, seat state and user context at different rates and reliability levels.",
    decisionTree: ["Use text serialization for sparse, human-readable state.", "Use independent encoders for dense continuous signals.", "Use cross-attention when timing and conditional relevance matter.", "Use unified tokens only after controlling scale and missing-modality behavior."],
    pipeline: ["Timestamp normalization", "Per-modality quality gates", "Independent embeddings", "Fusion mask and missing-signal policy", "Task heads / language decoder", "Latency and fault injection"],
    tradeoffs: [{ choice: "Text serialization", when: "Sparse state and fast prototype.", risk: "Precision and timing loss." }, { choice: "Cross-attention", when: "Dense asynchronous signals.", risk: "Compute and alignment complexity." }, { choice: "Unified tokens", when: "Large training corpus and generalist goal.", risk: "Token competition and debugging cost." }],
    failureModes: ["Timestamp drift", "Model treats stale vehicle state as current", "Missing modality not represented in training", "Fusion adds latency without measurable gain"],
    experiments: ["Late vs cross-attention fusion", "Missing-modality stress test", "CAN serialization precision sweep"], relatedTopics: ["Multimodal Fusion", "Native OMNI"],
  },
  {
    slug: "knowledge-distillation", title: "Knowledge Distillation for Cockpit VLMs", summary: "Align the teaching signal to the student bottleneck and the deployed task, especially when token counts and hidden dimensions differ.",
    problem: "Large VLM teachers exceed cockpit compute budgets; heterogeneous students cannot directly match every hidden feature or token.",
    decisionTree: ["Use output/logit distillation for architecture mismatch.", "Add projected feature matching for compatible semantic layers.", "Pool or align tokens before matching different token counts.", "Weight safety-critical task examples separately."],
    pipeline: ["Teacher audit", "Student bottleneck definition", "Logit targets", "Feature projection", "Token alignment", "Task-aware loss", "Latency-aware validation"],
    tradeoffs: [{ choice: "Logit", when: "Teacher/student differ strongly.", risk: "Transfers output bias but limited representation." }, { choice: "Hidden feature", when: "Layers are semantically comparable.", risk: "Dimension and layer mismatch." }, { choice: "Token-level", when: "Need localized knowledge.", risk: "Token correspondence is unstable." }],
    failureModes: ["Student copies teacher hallucinations", "Feature loss overwhelms task loss", "Token alignment rewards background", "Reported compression ignores pre/post-processing"],
    experiments: ["Logit-only vs feature + logit", "Task-aware sample weighting", "Measure end-to-end latency, not model FLOPs only"], relatedTopics: ["Distillation", "Edge VLM"],
  },
  {
    slug: "on-device-deployment", title: "On-device VLM Deployment", summary: "Optimize the whole request path—visual tokens, prefill, KV cache, decode and streaming—not only weight size.",
    problem: "Cockpit VLMs must satisfy latency, memory, thermal and reliability limits under multi-camera streaming workloads.",
    decisionTree: ["Profile prefill and decode separately.", "Reduce visual tokens before shrinking the language model blindly.", "Quantize after establishing an accuracy and calibration suite.", "Use streaming memory for long context rather than unbounded token growth."],
    pipeline: ["Hardware profile", "Baseline trace", "Visual token reduction", "Weight / KV quantization", "Distillation", "Streaming cache policy", "Thermal and tail-latency test"],
    tradeoffs: [{ choice: "Quantization", when: "Weight or bandwidth bound.", risk: "Calibration-sensitive degradation." }, { choice: "Token compression", when: "Vision prefill dominates.", risk: "Drops small safety-critical cues." }, { choice: "Distillation", when: "Need structural size reduction.", risk: "Training cost and teacher bias." }],
    failureModes: ["Average latency hides p99 spikes", "Image preprocessing stays on CPU", "Quantization set misses night scenes", "Compression removes gaze or hand-object cues"],
    experiments: ["Token budget vs small-object recall", "INT8/INT4 calibration by scenario", "Streaming memory horizon sweep"], relatedTopics: ["Edge VLM", "Video VLM"],
  },
  {
    slug: "omni-model-training", title: "OMNI Model Training", summary: "Stage alignment before unified generation, and preserve modality-specific quality gates throughout training.",
    problem: "Native multimodal systems must align vision, audio and language while avoiding modality collapse and excessive token competition.",
    decisionTree: ["Begin with pretrained encoders when cockpit data is limited.", "Align each modality to language separately.", "Introduce paired audio-visual objectives.", "Use unified next-token training only after stable modality competence."],
    pipeline: ["Modality encoders", "Pairwise alignment", "Interleaved pretraining", "Instruction tuning", "Preference / safety tuning", "Missing-modality evaluation"],
    tradeoffs: [{ choice: "Modular encoders", when: "Limited data and need debuggability.", risk: "Interface bottlenecks." }, { choice: "Native unified", when: "Large diverse corpus and any-to-any goal.", risk: "High compute and unstable balance." }],
    failureModes: ["Audio is ignored when vision is easy", "Text dominates token allocation", "Synthetic speech artifacts leak labels", "Any-to-any objective reduces task accuracy"],
    experiments: ["Modality dropout", "Separate vs shared tokenizer", "Audio-visual synchrony perturbation"], relatedTopics: ["Native OMNI", "Multimodal Fusion"],
  },
];
