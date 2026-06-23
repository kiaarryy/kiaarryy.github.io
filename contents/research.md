<div class="research-stories">

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">Operational intelligence · Energy · 2026</p>
    <h2>From raw BMS data to executable building models</h2>
    <p class="story-lead">AutoModelling closes the gap between messy operational records and simulation-ready digital twins. The workflow connects semantic point mapping, data quality control, steady-state screening, candidate-model identification, Modelica generation, and simulation-based validation.</p>
    <ul class="evidence-list" aria-label="Key evidence">
      <li><strong>22</strong><span>chillers screened</span></li>
      <li><strong>15</strong><span>models generated</span></li>
      <li><strong>98.5%</strong><span>less modelling effort at the most demanding site</span></li>
    </ul>
    <details class="story-details">
      <summary>Learn more <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>Method.</strong> The pipeline compares two Energy Input Ratio model families from the Modelica Buildings Library and selects the better-supported structure for each chiller instead of imposing one model everywhere.</p>
        <p><strong>Result.</strong> Thirteen of the fifteen retained chillers met the power criterion, ten met the COP criterion, and nine met both. The work also makes non-compliant units visible rather than hiding poor data readiness.</p>
        <p><strong>Boundary.</strong> Validation currently covers water-cooled centrifugal chillers and quasi-steady operation; plant-level interactions and additional equipment classes remain future work.</p>
        <p><a href="https://doi.org/10.1016/j.energy.2026.141700">Read the paper in <em>Energy</em></a></p>
      </div>
    </details>
  </div>
  <figure class="story-figure">
    <img src="/static/assets/img/research/automodelling-workflow.png" alt="AutoModelling workflow from heterogeneous BMS inputs through preprocessing, steady-state screening, candidate model fitting, Modelica simulation, and model ranking" loading="lazy">
    <figcaption>End-to-end AutoModelling workflow. Figure 2, Jin &amp; Wang, <em>Energy</em> 360 (2026).</figcaption>
  </figure>
</article>

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">Performance-driven design · Energy · 2025</p>
    <h2>Climate-responsive atria at design speed</h2>
    <p class="story-lead">A meta-sampling framework turns a large parametric building library into a fast decision layer for architects. It preserves the statistical structure of full simulation while exposing which atrium choices change heating, cooling, and lighting demand.</p>
    <ul class="evidence-list" aria-label="Key evidence">
      <li><strong>39,202</strong><span>atrium configurations</span></li>
      <li><strong>87.6%</strong><span>computational savings</span></li>
      <li><strong>40.29%</strong><span>maximum annual energy reduction</span></li>
    </ul>
    <details class="story-details">
      <summary>Learn more <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>Method.</strong> Automated Rhino/Grasshopper modelling and EnergyPlus simulation generated the benchmark library. MCMC-based meta-sampling then reproduced its distributions with a maximum output error of 0.35%.</p>
        <p><strong>Design insight.</strong> Atrium area and internal openness were the strongest levers for cooling and heating demand. South-facing atria performed consistently better, while west-facing configurations increased demand.</p>
        <p><strong>Use.</strong> The reduced model supports real-time early-stage exploration without presenting machine-learning predictions as a substitute for physical simulation.</p>
        <p><a href="https://doi.org/10.1016/j.energy.2025.137501">Read the paper in <em>Energy</em></a></p>
      </div>
    </details>
  </div>
  <figure class="story-figure">
    <img src="/static/assets/img/research/meta-sampling-framework.png" alt="Meta-sampling research framework linking parametric atrium design, EnergyPlus simulation, a source model library, sensitivity analysis, and energy-saving potential" loading="lazy">
    <figcaption>Meta-sample-based performance optimization framework. Figure 1, Jin et al., <em>Energy</em> 333 (2025).</figcaption>
  </figure>
</article>

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">Field evidence · Energy and Buildings · 2025</p>
    <h2>Reading indoor–outdoor thermal response as a system</h2>
    <p class="story-lead">Long-term measurements from two large public atria were analyzed with clustering and regression rather than daily averages alone. The approach separates recurring operating regimes and reveals why different atrium forms respond to different outdoor drivers.</p>
    <ul class="evidence-list" aria-label="Key evidence">
      <li><strong>0.9555</strong><span>R² for transitional-atrium response</span></li>
      <li><strong>+33.8%</strong><span>R² versus conventional analysis</span></li>
      <li><strong>−62.11%</strong><span>residual sum of squares</span></li>
    </ul>
    <details class="story-details">
      <summary>Learn more <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>Method.</strong> CAMLR combines K-means clustering with multiple linear regression, comparing indoor result-driven groupings against traditional outdoor-condition groupings.</p>
        <p><strong>Finding.</strong> Outdoor temperature dominated the transitional atrium, with a 30°C threshold associated with prolonged heat retention. Solar radiation played the larger role in the traditional atrium and drove faster fluctuations.</p>
        <p><strong>Design implication.</strong> Envelope, shading, ventilation, and operational control must respond to the thermal mechanism of each atrium type instead of relying on one generic large-space strategy.</p>
        <p><a href="https://doi.org/10.1016/j.enbuild.2024.115175">Read the paper in <em>Energy and Buildings</em></a> · <a href="https://doi.org/10.1016/j.csite.2024.104058">Related atrium diagnosis study</a></p>
      </div>
    </details>
  </div>
  <div class="story-figures">
    <figure class="story-figure">
      <img src="/static/assets/img/research/thermal-response-method.png" alt="CAMLR thermal-response study design comparing indoor result-driven analysis with outdoor environment-driven conventional analysis" loading="lazy">
      <figcaption>CAMLR research logic. Figure 2, Jin et al., <em>Energy and Buildings</em> 328 (2025).</figcaption>
    </figure>
    <figure class="story-figure story-figure--secondary">
      <img src="/static/assets/img/research/atrium-thermal-response.png" alt="Measured atrium temperatures, outdoor temperature, overheating index, wind speed, and solar radiation separated into Class A and Class B periods" loading="lazy">
      <figcaption>Measured thermal-response regimes in an atrium-centered public building. Figure 11, Jin et al., <em>Case Studies in Thermal Engineering</em> 54 (2024).</figcaption>
    </figure>
  </div>
</article>

<article class="research-story">
  <div class="story-copy">
    <p class="story-meta">Physics-guided HVAC analysis · Sustainable Cities and Society · 2023</p>
    <h2>Explaining cooling savings through climate and load composition</h2>
    <p class="story-lead">Thermodynamic models connect equipment perfection, sensible and latent loads, and local weather. The result is a physics-based explanation of why the same heat pump can have very different annual performance and energy-saving potential across climates.</p>
    <ul class="evidence-list" aria-label="Key evidence">
      <li><strong>0.52151</strong><span>COP–latent-load correlation</span></li>
      <li><strong>45–80%</strong><span>latent-load range linked to high COP</span></li>
      <li><strong>&gt;5%</strong><span>higher saving potential in Guangzhou than Wuhan</span></li>
    </ul>
    <details class="story-details">
      <summary>Learn more <span aria-hidden="true">↘</span></summary>
      <div class="story-details__body">
        <p><strong>Method.</strong> A validated heat-pump thermodynamic model was coupled with transient building heat transfer and evaluated across Guangzhou, Wuhan, and Jiuquan.</p>
        <p><strong>Finding.</strong> Annual COP reached 3.3 in hot-humid Guangzhou and 2.03 in cold-dry Jiuquan. In high latent-load climates, better dehumidification efficiency or independent temperature-humidity control offers substantially larger savings.</p>
        <p><strong>Related contribution.</strong> A thermodynamic perfection index provides a pre-estimation method for cooling energy-saving potential while showing that higher cycle perfection does not automatically mean better annual performance.</p>
        <p><a href="https://doi.org/10.1016/j.scs.2023.104942">Read the dehumidification study</a> · <a href="https://doi.org/10.1080/13467581.2022.2109645">Read the thermodynamic-perfection study</a></p>
      </div>
    </details>
  </div>
  <figure class="story-figure">
    <img src="/static/assets/img/research/dehumidification-energy-saving.png" alt="Energy consumption, cooling coefficients, and energy-saving ratios as dehumidifier efficiency changes in Wuhan and Guangzhou" loading="lazy">
    <figcaption>Energy-saving potential versus dehumidification performance. Figure 13, Jin et al., <em>Sustainable Cities and Society</em> 99 (2023).</figcaption>
  </figure>
</article>

</div>
