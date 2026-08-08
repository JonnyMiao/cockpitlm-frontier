import type { KnowledgeEntity } from "@/types/research";

const zh: Record<string, Pick<KnowledgeEntity, "description" | "cockpitSuitability">> = {
  "qwen2-5-vl": { description: "面向图像与视频理解、视觉定位和结构化输出的开源权重视觉语言模型系列。", cockpitSuitability: "适合领域适配；较小检查点可用于端侧部署实验。" },
  "llava-onevision": { description: "面向单图、多图和视频场景迁移而训练的多模态模型系列。", cockpitSuitability: "可作为统一处理舱内快照、多摄像头图组与时序片段的参考。" },
  "internvl2-5": { description: "强调动态分辨率视觉处理和广泛基准覆盖的开放多模态模型系列。", cockpitSuitability: "丰富的模型尺寸适合教师—学生与规模效应研究。" },
  "minicpm-v-2-6": { description: "支持图像、多图和视频的紧凑型开放视觉语言模型。", cockpitSuitability: "适合作为内存与时延受限原型的基线。" },
  "phi-3-5-vision": { description: "支持单图或多图视觉推理的紧凑型多模态指令模型。", cockpitSuitability: "适合作为本地推理和连接器适配的紧凑基线。" },
  smolvlm: { description: "面向高效推理设计的小型开放视觉语言模型系列。", cockpitSuitability: "适合早期端侧时延与量化实验。" },
  ego4d: { description: "覆盖日常活动和阶段性任务的大规模第一视角视频数据集。", cockpitSuitability: "可迁移到乘员活动、交互与长时事件理解。" },
  nuscenes: { description: "包含同步摄像头、激光雷达、毫米波雷达、地图和车辆状态的自动驾驶数据集。", cockpitSuitability: "适合外部环境与异构车辆信号融合，不等同于舱内监测数据。" },
  "waymo-open": { description: "包含多传感器序列的自动驾驶感知与运动数据集。", cockpitSuitability: "可为座舱推理研究提供外部场景与运动上下文。" },
  drivelm: { description: "连接感知、预测与规划推理的驾驶图谱视觉问答数据集。", cockpitSuitability: "与车辆上下文定位、解释和动作建议相关。" },
  "llava-instruct": { description: "基于 COCO 图像生成、用于多模态指令微调的视觉指令数据。", cockpitSuitability: "可作为构建舱内指令数据的模板，但本身不是座舱数据集。" },
  "visual-genome": { description: "包含物体、属性、关系、区域和问答的稠密图像标注数据集。", cockpitSuitability: "适合设计稠密舱内场景图与空间定位标签。" },
  mmmu: { description: "由大学水平题目构建的跨学科多模态理解与推理基准。", cockpitSuitability: "可测试通用推理，但不能衡量安全、时延或舱内域偏移。" },
  "video-mme": { description: "覆盖多领域短、中、长视频的视频多模态评测。", cockpitSuitability: "可在舱内评测前作为长时视频理解的迁移筛选。" },
  mvbench: { description: "面向多模态大模型设计的多任务视频理解基准。", cockpitSuitability: "覆盖与事件和行为理解相关的时序基础能力。" },
  egoschema: { description: "需要长时序理解的第一视角视频问答基准。", cockpitSuitability: "可作为乘员视角事件记忆的代理评测，但缺少车辆状态信号。" },
  mmbench: { description: "面向广泛多模态能力的循环评测基准。", cockpitSuitability: "只能作为通用能力门槛，不足以支撑时序、安全和部署决策。" },
  mme: { description: "面向多模态大模型的感知与认知评测套件。", cockpitSuitability: "可暴露基础感知缺口，但不能证明座舱任务已具备工程就绪度。" },
};

export function localizeEntity(entity: KnowledgeEntity, locale: "zh" | "en"): KnowledgeEntity {
  return locale === "zh" && zh[entity.id] ? { ...entity, ...zh[entity.id] } : entity;
}

