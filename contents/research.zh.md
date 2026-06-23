<div class="research-stories">

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">运行智能 · Energy · 2026</p>
    <h2>从原始 BMS 数据到可执行建筑模型</h2>
    <p class="story-lead">AutoModelling 连接杂乱运行数据与可用于数字孪生的仿真模型，把语义点位映射、数据质控、稳态筛选、候选模型辨识、Modelica 代码生成和仿真验证整合为一条可复现流程。</p>
    <ul class="evidence-list" aria-label="关键证据">
      <li><strong>22</strong><span>台冷水机组进入筛选</span></li>
      <li><strong>15</strong><span>台机组生成模型</span></li>
      <li><strong>98.5%</strong><span>最复杂站点建模工作量降幅</span></li>
    </ul>
    <details class="story-details">
      <summary>了解更多 <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>方法。</strong>流程对比 Modelica Buildings Library 中两类 Energy Input Ratio 模型，根据每台机组的数据支持度选择更合适的结构，而不是对所有设备强制采用同一模型。</p>
        <p><strong>结果。</strong>15 台保留机组中，13 台满足功率误差标准，10 台满足 COP 标准，9 台同时满足两项标准；不合规设备及其数据准备问题也被明确报告。</p>
        <p><strong>边界。</strong>当前验证对象为水冷离心式冷水机组和准稳态运行数据，系统级耦合及更多设备类型仍需扩展。</p>
        <p><a href="https://doi.org/10.1016/j.energy.2026.141700">阅读 <em>Energy</em> 论文</a></p>
      </div>
    </details>
  </div>
  <figure class="story-figure">
    <img src="/static/assets/img/research/automodelling-workflow.png" alt="AutoModelling 从异构 BMS 输入，经预处理、稳态筛选、候选模型拟合、Modelica 仿真到模型排序的完整流程" loading="lazy">
    <figcaption>AutoModelling 端到端流程。图 2，Jin &amp; Wang，<em>Energy</em> 360（2026）。</figcaption>
  </figure>
</article>

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">性能驱动设计 · Energy · 2025</p>
    <h2>让气候响应型中庭设计具备实时决策速度</h2>
    <p class="story-lead">元样本框架把大规模参数化建筑模型库转化为面向建筑师的快速决策层，在保留完整仿真统计结构的同时，揭示中庭参数对供暖、制冷和照明能耗的影响。</p>
    <ul class="evidence-list" aria-label="关键证据">
      <li><strong>39,202</strong><span>种中庭参数组合</span></li>
      <li><strong>87.6%</strong><span>计算量节省</span></li>
      <li><strong>40.29%</strong><span>年总能耗最大降幅</span></li>
    </ul>
    <details class="story-details">
      <summary>了解更多 <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>方法。</strong>通过 Rhino/Grasshopper 自动建模和 EnergyPlus 仿真建立基准模型库，再采用基于 MCMC 的元样本方法重构其统计分布，最大输出误差仅为 0.35%。</p>
        <p><strong>设计发现。</strong>中庭面积和内部开敞度是制冷与供暖需求的关键影响因素；南向中庭表现更稳定，西向布置会显著增加能耗。</p>
        <p><strong>应用。</strong>降阶后的模型支持早期方案实时探索，但仍以物理仿真为基础，不把机器学习预测包装成物理模型的替代品。</p>
        <p><a href="https://doi.org/10.1016/j.energy.2025.137501">阅读 <em>Energy</em> 论文</a></p>
      </div>
    </details>
  </div>
  <figure class="story-figure">
    <img src="/static/assets/img/research/meta-sampling-framework.png" alt="连接参数化中庭设计、EnergyPlus 仿真、源模型库、敏感性分析和节能潜力的元样本研究框架" loading="lazy">
    <figcaption>基于元样本的中庭性能优化框架。图 1，Jin 等，<em>Energy</em> 333（2025）。</figcaption>
  </figure>
</article>

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">现场实证 · Energy and Buildings · 2025</p>
    <h2>把室内外热响应作为一个系统来识别</h2>
    <p class="story-lead">研究对两个大型公共建筑中庭开展长期监测，并以聚类和回归替代单纯日均统计，分离重复出现的运行状态，解释不同中庭形态为什么受到不同室外因素控制。</p>
    <ul class="evidence-list" aria-label="关键证据">
      <li><strong>0.9555</strong><span>过渡型中庭热响应 R²</span></li>
      <li><strong>+33.8%</strong><span>相较传统分析的 R² 提升</span></li>
      <li><strong>−62.11%</strong><span>残差平方和降幅</span></li>
    </ul>
    <details class="story-details">
      <summary>了解更多 <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>方法。</strong>CAMLR 将 K-means 聚类与多元线性回归结合，对比室内结果驱动的分类与传统室外条件驱动的分类。</p>
        <p><strong>发现。</strong>过渡型中庭主要受室外温度控制，30°C 是室内持续蓄热的重要阈值；传统中庭则更受太阳辐射影响，温度波动更快。</p>
        <p><strong>设计启示。</strong>围护结构、遮阳、通风与运行控制应针对具体中庭的热响应机制设计，而不能套用统一的大空间策略。</p>
        <p><a href="https://doi.org/10.1016/j.enbuild.2024.115175">阅读 <em>Energy and Buildings</em> 论文</a> · <a href="https://doi.org/10.1016/j.csite.2024.104058">相关中庭诊断研究</a></p>
      </div>
    </details>
  </div>
  <div class="story-figures">
    <figure class="story-figure">
      <img src="/static/assets/img/research/thermal-response-method.png" alt="CAMLR 热响应研究设计：对比室内结果驱动分析与室外环境驱动的传统分析" loading="lazy">
      <figcaption>CAMLR 研究逻辑。图 2，Jin 等，<em>Energy and Buildings</em> 328（2025）。</figcaption>
    </figure>
    <figure class="story-figure story-figure--secondary">
      <img src="/static/assets/img/research/atrium-thermal-response.png" alt="中庭温度、室外温度、过热指标、风速和太阳辐射监测结果，并划分为 A、B 两类时段" loading="lazy">
      <figcaption>中庭式公共建筑的实测热响应状态。图 11，Jin 等，<em>Case Studies in Thermal Engineering</em> 54（2024）。</figcaption>
    </figure>
  </div>
</article>

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">物理引导 HVAC 分析 · Sustainable Cities and Society · 2023</p>
    <h2>用气候与负荷构成解释制冷节能潜力</h2>
    <p class="story-lead">热力学模型把设备完善度、显热与潜热负荷以及当地气象条件连接起来，解释同一台热泵为何会在不同气候区呈现完全不同的全年性能与节能潜力。</p>
    <ul class="evidence-list" aria-label="关键证据">
      <li><strong>0.52151</strong><span>COP 与潜热负荷相关系数</span></li>
      <li><strong>45–80%</strong><span>对应较高 COP 的潜热负荷比例</span></li>
      <li><strong>&gt;5%</strong><span>广州相对武汉的节能潜力增幅</span></li>
    </ul>
    <details class="story-details">
      <summary>了解更多 <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>方法。</strong>将经过验证的热泵热力学模型与建筑瞬态传热模型耦合，比较广州、武汉和酒泉三种气候条件。</p>
        <p><strong>发现。</strong>热泵年均 COP 在湿热广州达到 3.3，在寒冷干燥的酒泉为 2.03。潜热负荷高的地区通过提升除湿效率或采用温湿度独立控制，可以获得更大的节能收益。</p>
        <p><strong>相关贡献。</strong>热力学完善度指标可用于预估制冷节能潜力，同时说明循环完善度更高并不必然意味着全年运行效果更好。</p>
        <p><a href="https://doi.org/10.1016/j.scs.2023.104942">阅读除湿负荷研究</a> · <a href="https://doi.org/10.1080/13467581.2022.2109645">阅读热力学完善度研究</a></p>
      </div>
    </details>
  </div>
  <figure class="story-figure">
    <img src="/static/assets/img/research/dehumidification-energy-saving.png" alt="武汉和广州在不同除湿效率下的能耗、制冷系数及节能率变化" loading="lazy">
    <figcaption>除湿性能与节能潜力的关系。图 13，Jin 等，<em>Sustainable Cities and Society</em> 99（2023）。</figcaption>
  </figure>
</article>

</div>
