import type { KnowledgeEntity } from "@/types/research";

export const models: KnowledgeEntity[] = [
  {
    id: "qwen2-5-vl", name: "Qwen2.5-VL", kind: "model", organization: "Qwen Team / Alibaba Cloud", released: "2025",
    description: "Open-weight vision-language model family for image and video understanding, visual localization and structured outputs.",
    modalities: ["Image", "Video", "Text"],
    attributes: { Weights: "Open", License: "Apache 2.0 for listed checkpoints", Architecture: "Vision encoder + language model", Parameters: "3B / 7B / 72B" },
    topics: ["Video VLM", "Multimodal Reasoning"], cockpitSuitability: "Strong candidate for domain adaptation; smaller checkpoints support deployment experiments.", sourceUrl: "https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct",
  },
  {
    id: "llava-onevision", name: "LLaVA-OneVision", kind: "model", organization: "LMMs-Lab", released: "2024",
    description: "A family trained to transfer across single-image, multi-image and video scenarios.", modalities: ["Image", "Multi-image", "Video", "Text"],
    attributes: { Weights: "Open", License: "See checkpoint", Architecture: "SigLIP + projector + Qwen2", Context: "Checkpoint dependent" },
    topics: ["Video VLM", "VLM Fine-tuning"], cockpitSuitability: "Useful reference for unifying cabin snapshots, camera groups and temporal clips.", sourceUrl: "https://arxiv.org/abs/2408.03326",
  },
  {
    id: "internvl2-5", name: "InternVL 2.5", kind: "model", organization: "OpenGVLab", released: "2024",
    description: "Open multimodal model family emphasizing dynamic-resolution vision and broad benchmark coverage.", modalities: ["Image", "Video", "Text"],
    attributes: { Weights: "Open", License: "See repository", Architecture: "InternViT + MLP projector + LLM", Parameters: "Multiple sizes" },
    topics: ["Multimodal Reasoning", "VLM Fine-tuning"], cockpitSuitability: "Broad size range is useful for teacher–student and scaling studies.", sourceUrl: "https://huggingface.co/OpenGVLab/InternVL2_5-8B",
  },
  {
    id: "minicpm-v-2-6", name: "MiniCPM-V 2.6", kind: "model", organization: "OpenBMB", released: "2024",
    description: "Compact open vision-language model with image, multi-image and video support.", modalities: ["Image", "Video", "Text"],
    attributes: { Weights: "Open", License: "See repository", Parameters: "8B", Deployment: "Mobile-oriented community tooling" },
    topics: ["Edge VLM", "Video VLM"], cockpitSuitability: "Relevant baseline for memory- and latency-constrained prototypes.", sourceUrl: "https://huggingface.co/openbmb/MiniCPM-V-2_6",
  },
  {
    id: "phi-3-5-vision", name: "Phi-3.5-vision-instruct", kind: "model", organization: "Microsoft", released: "2024",
    description: "Compact multimodal instruction model supporting visual reasoning over one or more images.", modalities: ["Image", "Text"],
    attributes: { Weights: "Open", License: "MIT", Parameters: "4.2B", Context: "128K" },
    topics: ["Edge VLM", "Multimodal Reasoning"], cockpitSuitability: "Compact baseline for local inference and connector adaptation.", sourceUrl: "https://huggingface.co/microsoft/Phi-3.5-vision-instruct",
  },
  {
    id: "smolvlm", name: "SmolVLM", kind: "model", organization: "Hugging Face", released: "2024",
    description: "Small open vision-language model family designed for efficient inference.", modalities: ["Image", "Text"],
    attributes: { Weights: "Open", License: "Apache 2.0", Parameters: "Multiple compact sizes", Deployment: "Resource-efficient" },
    topics: ["Edge VLM"], cockpitSuitability: "Appropriate for early on-device latency and quantization experiments.", sourceUrl: "https://huggingface.co/HuggingFaceTB/SmolVLM-Instruct",
  },
];

export const datasets: KnowledgeEntity[] = [
  {
    id: "ego4d", name: "Ego4D", kind: "dataset", organization: "Meta AI and academic consortium", released: "2021",
    description: "Large-scale egocentric video dataset spanning daily activities and episodic tasks.", modalities: ["Egocentric video", "Audio", "Text annotations"],
    attributes: { Scale: "3,670 hours reported", Temporal: "Long-form", Annotation: "Multiple benchmark suites", Availability: "Application required" },
    topics: ["Video", "Egocentric", "Behavior"], cockpitSuitability: "Transfers to occupant activity, interaction and long-horizon event understanding.", sourceUrl: "https://ego4d-data.org/",
  },
  {
    id: "nuscenes", name: "nuScenes", kind: "dataset", organization: "Motional", released: "2020",
    description: "Autonomous-driving dataset with synchronized cameras, lidar, radar, maps and vehicle state.", modalities: ["Multi-camera", "LiDAR", "Radar", "CAN", "Maps"],
    attributes: { Scale: "1,000 scenes reported", Temporal: "20-second scenes", MultiCamera: "6 cameras", License: "Non-commercial terms" },
    topics: ["Driving", "Multi-camera", "Sensor Fusion"], cockpitSuitability: "Useful for exterior context and heterogeneous vehicle-signal fusion, not cabin monitoring.", sourceUrl: "https://www.nuscenes.org/",
  },
  {
    id: "waymo-open", name: "Waymo Open Dataset", kind: "dataset", organization: "Waymo", released: "2019",
    description: "Autonomous-driving perception and motion dataset with multi-sensor sequences.", modalities: ["Multi-camera", "LiDAR", "Maps"],
    attributes: { Scale: "Dataset-version dependent", Temporal: "Sequences", Annotation: "Perception and motion", Availability: "Open under dataset terms" },
    topics: ["Driving", "Multi-camera", "Motion"], cockpitSuitability: "Provides exterior scene and motion context for cockpit reasoning research.", sourceUrl: "https://waymo.com/open/",
  },
  {
    id: "drivelm", name: "DriveLM", kind: "dataset", organization: "DriveLM contributors", released: "2023",
    description: "Driving graph visual question answering dataset linking perception, prediction and planning reasoning.", modalities: ["Multi-camera images", "Language", "Driving graph"],
    attributes: { Scale: "See official release", Annotation: "Graph VQA", Temporal: "Keyframes and sequences", Availability: "Project release" },
    topics: ["Driving", "Reasoning", "VQA"], cockpitSuitability: "Relevant to grounded vehicle-context explanations and action recommendations.", sourceUrl: "https://github.com/OpenDriveLab/DriveLM",
  },
  {
    id: "llava-instruct", name: "LLaVA-Instruct-150K", kind: "dataset", organization: "LLaVA contributors", released: "2023",
    description: "Visual instruction-following data generated from COCO images for multimodal instruction tuning.", modalities: ["Image", "Text"],
    attributes: { Scale: "158K examples reported", Annotation: "Conversation / description / reasoning", Temporal: "No", Availability: "Open" },
    topics: ["Instruction", "General VLM"], cockpitSuitability: "A template for constructing cabin instruction data, not a cockpit dataset itself.", sourceUrl: "https://huggingface.co/datasets/liuhaotian/LLaVA-Instruct-150K",
  },
  {
    id: "visual-genome", name: "Visual Genome", kind: "dataset", organization: "Stanford University", released: "2017",
    description: "Dense image annotations including objects, attributes, relationships, regions and question answering.", modalities: ["Image", "Scene graph", "Text"],
    attributes: { Scale: "108K images reported", Annotation: "Dense regions and relationships", Temporal: "No", Availability: "Open under dataset terms" },
    topics: ["Grounding", "Scene Graph", "VQA"], cockpitSuitability: "Useful for designing dense cabin scene graphs and spatial grounding labels.", sourceUrl: "https://visualgenome.org/",
  },
];

export const benchmarks: KnowledgeEntity[] = [
  {
    id: "mmmu", name: "MMMU", kind: "benchmark", organization: "MMMU contributors", released: "2023",
    description: "Multi-discipline multimodal understanding and reasoning benchmark built from college-level problems.", modalities: ["Image", "Text"],
    attributes: { Focus: "Expert knowledge and reasoning", Split: "Validation / test", Limitation: "Not temporal or cockpit-specific", Ranking: "Not reproduced here" },
    topics: ["Reasoning", "General Multimodal"], cockpitSuitability: "Tests general reasoning, but does not measure safety, latency or cabin domain shift.", sourceUrl: "https://mmmu-benchmark.github.io/",
  },
  {
    id: "video-mme", name: "Video-MME", kind: "benchmark", organization: "Video-MME contributors", released: "2024",
    description: "Video multimodal evaluation spanning short, medium and long videos with diverse domains.", modalities: ["Video", "Audio subset", "Text"],
    attributes: { Focus: "Video understanding", Duration: "Short to long", Limitation: "Limited cockpit coverage", Ranking: "Not reproduced here" },
    topics: ["Video", "Temporal Reasoning"], cockpitSuitability: "Useful transfer screen for long-horizon video understanding before cabin evaluation.", sourceUrl: "https://video-mme.github.io/home_page.html",
  },
  {
    id: "mvbench", name: "MVBench", kind: "benchmark", organization: "OpenGVLab", released: "2023",
    description: "Multi-task video understanding benchmark designed for multimodal large language models.", modalities: ["Video", "Text"],
    attributes: { Focus: "Temporal tasks", Tasks: "20 reported", Limitation: "Multiple-choice format", Ranking: "Not reproduced here" },
    topics: ["Video", "Temporal Reasoning"], cockpitSuitability: "Covers temporal primitives relevant to event and behavior understanding.", sourceUrl: "https://github.com/OpenGVLab/Ask-Anything/tree/main/video_chat2/MVBench",
  },
  {
    id: "egoschema", name: "EgoSchema", kind: "benchmark", organization: "EgoSchema contributors", released: "2023",
    description: "Long-form egocentric video question-answering benchmark requiring temporal understanding.", modalities: ["Egocentric video", "Text"],
    attributes: { Focus: "Long video QA", Scale: "5K questions reported", Limitation: "Multiple-choice and egocentric-only", Ranking: "Not reproduced here" },
    topics: ["Egocentric", "Long Video"], cockpitSuitability: "Good proxy for occupant-perspective event memory; lacks vehicle state signals.", sourceUrl: "https://egoschema.github.io/",
  },
  {
    id: "mmbench", name: "MMBench", kind: "benchmark", organization: "OpenCompass", released: "2023",
    description: "Circular-evaluation benchmark for broad multimodal capabilities.", modalities: ["Image", "Text"],
    attributes: { Focus: "Perception and reasoning", Format: "Multiple-choice", Limitation: "Static images", Ranking: "Not reproduced here" },
    topics: ["General Multimodal", "Reasoning"], cockpitSuitability: "Broad capability gate only; insufficient for temporal, safety and deployment decisions.", sourceUrl: "https://github.com/open-compass/MMBench",
  },
  {
    id: "mme", name: "MME", kind: "benchmark", organization: "MME contributors", released: "2023",
    description: "Perception and cognition evaluation suite for multimodal large language models.", modalities: ["Image", "Text"],
    attributes: { Focus: "Perception and cognition", Format: "Yes/no", Limitation: "Static and prompt-sensitive", Ranking: "Not reproduced here" },
    topics: ["Perception", "Reasoning"], cockpitSuitability: "Can expose basic perception gaps but not cabin task readiness.", sourceUrl: "https://github.com/BradyFU/Awesome-Multimodal-Large-Language-Models/tree/Evaluation",
  },
];
