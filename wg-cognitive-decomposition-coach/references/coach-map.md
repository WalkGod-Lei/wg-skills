# 内部教练地图

教练地图用于先完整审视问题，再选择渐进教学路线。它是简洁的结构化工作状态，不是逐字思维过程，也不是用户必须猜中的标准答案。

## 建图原则

1. **先广后窄**：先覆盖主要解释空间，再选择当轮一个相邻动作。
2. **候选而非定论**：事实未核验前标记不确定；隐藏动机一律先作为假设。
3. **动态更新**：用户提出新变量、反例或更强机制时，更新地图并重新排序训练路线。
4. **不诱导猜答案**：问题用于帮助用户生成和比较，不用于把用户带到 AI 预设结论。
5. **来源可区分**：标明哪些是用户提出、提示后发现、AI 补充或尚未覆盖。
6. **地图默认隐藏**：只输出当前训练所需的局部；用户明确要求查看或进入完整总结时才展开。

## 最小结构

```yaml
central_question: 真正要解释或判断什么
user_model:
  conclusion: 用户当前结论
  causal_chain: 用户当前因果链
  confidence: 用户明示的确信程度；未明示则 unknown
known_facts: []
uncertain_facts: []
key_concepts: []
stakeholders: []
motives: []
mechanisms: []
triggers: []
objective_functions_or_beneficiaries: []
omitted_variables: []
alternative_explanations: []
possible_results:
  short_term: []
  long_term: []
counterexamples_and_boundaries: []
evidence_status:
  direct: []
  indirect: []
  missing: []
  distinguishing_tests: []
hypothesis_ladder:
  strong: 有意设计或专门创造
  medium: 后来利用、维持或选择性强化
  weak: 自然形成但客观有利或降低成本
recommended_training_route: []
current_bottleneck: reasoning_gap | method_gap | knowledge_gap | evidence_gap | expression_gap
```

不必机械填满所有字段。字段为空本身可能提示知识或证据缺口。

## 覆盖状态

为重要节点标记来源和学习状态：

- `discovered_by_user`：用户未受提示独立提出；
- `discovered_after_hint`：AI 给方向后由用户完成；
- `ai_supplied`：AI 直接补充的概念、变量、机制或证据；
- `user_new_variable`：用户提出而初始地图遗漏的有效变量；
- `not_covered`：地图已有，但训练尚未推进；
- `needs_recheck`：新信息出现后需要重审。

用户提出 `user_new_variable` 时，不要立刻为初始地图辩护。先判断它是否改变其他节点、解释排序或下一步问题。

## 教练路线选择

从地图中选择距离用户最近、又能最大幅度提升模型的一步：

- 用户已有变量但关系混乱：整理一条机制链；
- 用户只有单一解释：生成竞争解释；
- 用户明确想不到：给 2—4 个候选入口；
- 用户已有多个解释：比较预测和证据；
- 用户模型过强：比较强、中、弱版本；
- 用户意思清楚但说不出：提供句式骨架并让其重述。

每轮结束后更新覆盖状态和瓶颈。若连续一轮没有新发现且用户在重复防守，优先检查是否应从提问切换到脚手架，而不是继续加压。

## 研究与未公开信息

遇到现实世界的可变事实，先标出待核验项。能公开研究的，由 AI 使用可用工具获取；只能由内部资料证明的动机，保留为假设，并设计间接预测。不要用“无法证伪”提升假设可信度，也不要用“没有公开承认”直接否定假设。

研究所得可先进入地图，但对用户的可见输出仍按训练进度分批提供。若运行环境要求说明工具使用，应如实说明正在核查，不必提前公布研究结论。

## 当前会话与长期状态

- 当前会话：在上下文中维护完整的临时地图。
- 跨会话：只有用户授权并存在指定训练日志时，保存紧凑摘要；不要保存逐字内部推理。
- 未完成主题可保存：中心问题、用户当前模型、已覆盖节点、AI 已补充内容、未决候选和下一步。
- “隐藏”指不在训练中一次性展示；记录文件归用户所有，用户可以随时查看。
- 公开仓库只保存本方法和字段规范，不保存任何用户的地图或训练历史。

