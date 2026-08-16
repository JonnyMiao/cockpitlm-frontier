import type { Playbook } from "./playbooks";

const zhPlaybooks: Record<string, Omit<Playbook, "slug">> = {
  "fine-tuning-general-vlm": {
    title: "面向智能座舱微调通用 VLM", summary: "优先选择最小可训练模块缩小领域差距，只有证据表明不足时才逐步解冻更多模块。",
    problem: "通用 VLM 在舱内视角、细粒度乘员状态、车载 HMI 元素和时序意图线索上往往表现不足。",
    decisionTree: ["先运行冻结骨干的线性探针或连接器探针。", "若感知足够而语言行为不匹配，采用 LLM LoRA / SFT。", "若视觉定位较弱，训练连接器与视觉编码器上层。", "仅在数据足够多样且具备回归评测时进行联合微调。"],
    pipeline: ["构建乘员与场景隔离的数据划分", "运行冻结基线", "仅适配连接器", "LLM LoRA / QLoRA", "选择性解冻视觉模块", "联合评测任务、时延与能力回退"],
    tradeoffs: [
      { choice: "仅 LLM SFT", when: "感知特征足够，但输出策略或词汇不匹配。", risk: "无法弥补缺失的视觉区分能力。" },
      { choice: "仅连接器", when: "配对领域数据较少，主要差距在模态对齐。", risk: "可能形成容量瓶颈。" },
      { choice: "连接器 + LLM", when: "同时需要领域定位与输出适配。", risk: "可能造成语言能力漂移。" },
      { choice: "解冻视觉模块", when: "舱内成像或细粒度状态未被充分表征。", risk: "数据需求高且可能灾难性遗忘。" },
    ],
    failureModes: ["乘员身份泄漏导致状态识别准确率虚高", "合成指令风格压过真实查询", "单摄像头收益无法迁移到多摄像头部署", "任务分数提升但预填充时延不可接受"],
    experiments: ["在固定 Token 预算下比较仅连接器与连接器 + LoRA", "评估未见乘员和未见车型", "测量安全关键负例上的校准表现"], relatedTopics: ["VLM 微调", "多模态融合"],
  },
  "cockpit-dataset-construction": {
    title: "智能座舱数据集构建", summary: "围绕场景覆盖、身份泄漏控制和时序负例设计数据，而不是只追求原始帧数。",
    problem: "舱内数据集容易对乘员、车型、摄像头位置和重复场景过拟合，同时缺少困难负例。",
    decisionTree: ["在标注前先定义任务和失败成本。", "根据因果上下文确定片段长度，而非存储便利。", "按乘员、车辆和场景族划分数据。", "加入外观相似但意图不同的困难负例。"],
    pipeline: ["场景分类", "采集矩阵", "隐私审查", "分层标注", "防泄漏划分", "质量审计", "版本化发布"],
    tradeoffs: [{ choice: "稠密标注", when: "需要时序定位和错误诊断。", risk: "成本高且标注一致性难控制。" }, { choice: "弱标注", when: "用于大规模预训练。", risk: "任务边界存在噪声。" }],
    failureModes: ["同一乘员出现在不同划分", "相邻片段泄漏同一场景", "手势采集只有正样本", "音视频时钟未对齐"],
    experiments: ["比较乘员隔离与随机划分的差距", "困难负例消融", "片段长度与采样率扫描"], relatedTopics: ["视频 VLM", "多模态融合"],
  },
  "multimodal-fusion": {
    title: "摄像头 + 音频 + 车辆状态融合", summary: "保留各类信号的结构和时序，不要默认把所有非视觉信号都序列化成文本。",
    problem: "座舱系统需要融合不同采样率和可靠性的摄像头、麦克风、CAN、HMI、视线、座椅状态与用户上下文。",
    decisionTree: ["稀疏且人类可读的状态可采用文本序列化。", "稠密连续信号采用独立编码器。", "当时序和条件相关性重要时采用交叉注意力。", "只有在控制规模和缺失模态行为后再考虑统一 Token。"],
    pipeline: ["时间戳归一化", "各模态质量门控", "独立嵌入", "融合掩码与缺失信号策略", "任务头 / 语言解码器", "时延与故障注入"],
    tradeoffs: [{ choice: "文本序列化", when: "稀疏状态与快速原型。", risk: "损失精度与时序信息。" }, { choice: "交叉注意力", when: "稠密异步信号。", risk: "计算与对齐复杂度高。" }, { choice: "统一 Token", when: "具备大规模语料并追求通用模型。", risk: "Token 竞争且调试成本高。" }],
    failureModes: ["时间戳漂移", "模型把过期车辆状态当作当前状态", "训练中未覆盖模态缺失", "融合增加时延却没有可测收益"],
    experiments: ["晚期融合与交叉注意力融合对比", "缺失模态压力测试", "CAN 序列化精度扫描"], relatedTopics: ["多模态融合", "原生全模态模型"],
  },
  "knowledge-distillation": {
    title: "面向座舱 VLM 的知识蒸馏", summary: "让教学信号匹配学生模型的瓶颈和部署任务，尤其要处理 Token 数与隐藏维度不一致。",
    problem: "大型 VLM 教师超出座舱算力预算，异构学生模型又无法直接匹配所有隐藏特征和 Token。",
    decisionTree: ["架构差异较大时使用输出 / Logit 蒸馏。", "语义层兼容时加入投影后的特征匹配。", "Token 数不同时先池化或对齐再匹配。", "对安全关键任务样本单独加权。"],
    pipeline: ["教师模型审计", "定义学生瓶颈", "Logit 目标", "特征投影", "Token 对齐", "任务感知损失", "时延感知验证"],
    tradeoffs: [{ choice: "Logit 蒸馏", when: "师生架构差异大。", risk: "主要迁移输出偏好，表征能力有限。" }, { choice: "隐藏特征蒸馏", when: "层间语义可比。", risk: "维度与层级不匹配。" }, { choice: "Token 级蒸馏", when: "需要局部知识。", risk: "Token 对应关系不稳定。" }],
    failureModes: ["学生复制教师幻觉", "特征损失压过任务损失", "Token 对齐偏向背景", "压缩报告忽略前后处理成本"],
    experiments: ["比较仅 Logit 与特征 + Logit", "任务感知样本加权", "测量端到端时延而非只看 FLOPs"], relatedTopics: ["知识蒸馏", "端侧 VLM"],
  },
  "on-device-deployment": {
    title: "端侧 VLM 部署", summary: "优化完整请求链路，包括视觉 Token、预填充、KV Cache、解码和流式处理，而不只是权重大小。",
    problem: "座舱 VLM 必须在多摄像头流式负载下满足时延、内存、热设计与可靠性约束。",
    decisionTree: ["分别分析预填充和解码。", "在盲目缩小语言模型前先减少视觉 Token。", "建立准确率和校准套件后再量化。", "长上下文使用流式记忆而非无限增长 Token。"],
    pipeline: ["硬件画像", "基线链路追踪", "视觉 Token 缩减", "权重 / KV 量化", "知识蒸馏", "流式缓存策略", "热与长尾时延测试"],
    tradeoffs: [{ choice: "量化", when: "受权重或带宽限制。", risk: "对校准集敏感。" }, { choice: "Token 压缩", when: "视觉预填充占主导。", risk: "可能丢失微小安全关键线索。" }, { choice: "蒸馏", when: "需要结构性缩小模型。", risk: "训练成本与教师偏差。" }],
    failureModes: ["平均时延掩盖 p99 峰值", "图像预处理仍停留在 CPU", "量化校准集缺少夜间场景", "压缩移除视线或手—物线索"],
    experiments: ["Token 预算与小目标召回率", "按场景评估 INT8 / INT4 校准", "流式记忆跨度扫描"], relatedTopics: ["端侧 VLM", "视频 VLM"],
  },
  "omni-model-training": {
    title: "OMNI 模型训练", summary: "先完成模态对齐，再进行统一生成，并在整个训练过程中保留各模态质量门控。",
    problem: "原生多模态系统需要对齐视觉、音频与语言，同时避免模态坍塌和过度 Token 竞争。",
    decisionTree: ["座舱数据有限时从预训练编码器开始。", "先分别将各模态与语言对齐。", "再引入音视频配对目标。", "只有模态能力稳定后才采用统一下一 Token 训练。"],
    pipeline: ["模态编码器", "两两对齐", "交错预训练", "指令微调", "偏好 / 安全微调", "缺失模态评测"],
    tradeoffs: [{ choice: "模块化编码器", when: "数据有限且需要可调试性。", risk: "接口可能成为瓶颈。" }, { choice: "原生统一架构", when: "具备大规模多样语料并追求任意模态互转。", risk: "计算量高且模态平衡不稳定。" }],
    failureModes: ["视觉容易时模型忽略音频", "文本占据大部分 Token 预算", "合成语音伪影泄漏标签", "任意模态互转目标降低任务准确率"],
    experiments: ["模态 Dropout", "独立与共享 Tokenizer 对比", "音视频同步扰动"], relatedTopics: ["原生全模态模型", "多模态融合"],
  },
};

export function localizePlaybook(playbook: Playbook, locale: "zh" | "en"): Playbook {
  return locale === "zh" ? { slug: playbook.slug, ...zhPlaybooks[playbook.slug] } : playbook;
}

