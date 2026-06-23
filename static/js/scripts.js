const contentDir = '/contents/';
const configFile = 'config.yml';
const pageSectionMap = {
    home: ['home'],
    research: ['research'],
    publications: ['publications'],
    news: ['news'],
    awards: ['awards']
};
const currentPage = document.body?.dataset.page || 'home';
const githubUser = 'kiaarryy';
const requestedLang = new URLSearchParams(window.location.search).get('lang');
const contributionRefreshMs = 5 * 60 * 1000;

const storedLang = localStorage.getItem('site-language');
let currentLang = ['en', 'zh'].includes(requestedLang)
    ? requestedLang
    : ['en', 'zh'].includes(storedLang) ? storedLang : '';
if (['en', 'zh'].includes(requestedLang)) {
    localStorage.setItem('site-language', requestedLang);
}
let contributionRefreshTimer = null;

const i18n = {
    en: {
        title: "Zhineng Jin's Homepage",
        pageTitles: {
            home: 'Zhineng Jin | Academic Homepage',
            research: 'Research | Zhineng Jin',
            publications: 'Publications | Zhineng Jin',
            news: 'News | Zhineng Jin',
            awards: 'Awards | Zhineng Jin'
        },
        languageGatewayCopy: 'Academic homepage for building energy, HVAC intelligence, smart building design, and thermal comfort research.',
        navHome: 'Home',
        navProfile: 'Profile',
        navGithub: 'GitHub',
        navResearch: 'Research',
        navPublications: 'Publications',
        navNews: 'News',
        navAwards: 'Awards',
        navCv: 'CV',
        heroKicker: 'Academic Portfolio',
        heroRole: 'PhD Student, Hong Kong University of Science and Technology',
        heroSummary: 'Researching energy and carbon modeling for buildings and cities, HVAC system intelligence, smart building design, and thermal comfort in large public buildings.',
        heroPrimaryLink: 'Publications',
        heroSecondaryLink: 'Contact',
        topSectionBgText: 'Climate-responsive buildings, HVAC intelligence, and urban energy modeling',
        profileLabel: 'Profile',
        codingLabel: 'Official GitHub Activity',
        codingHeading: 'Small proofs, stacked every day.',
        codingDaysLabel: 'coding days',
        codingTitle: 'Coding',
        codingYearLabel: 'Year',
        codingLessLabel: 'Less',
        codingMoreLabel: 'More',
        githubLabel: 'Official GitHub Activity',
        githubKicker: 'Synchronized from GitHub public data',
        githubTitle: 'Open-source work and recent repository activity',
        githubProfileCta: 'View GitHub',
        githubHeatmapLabel: 'Contribution Calendar',
        githubLiveBadge: 'Live',
        researchLabel: 'Research Highlights',
        researchHeading: 'Research',
        researchIntro: 'Building physics, operational intelligence, and reproducible modelling for low-carbon built environments.',
        publicationsLabel: 'Selected Publications',
        publicationsHeading: 'Publications',
        publicationsIntro: 'Peer-reviewed journal articles and conference presentations.',
        newsLabel: 'News & Updates',
        newsHeading: 'News',
        newsIntro: 'Publications, presentations, collaborations, and academic milestones.',
        awardsLabel: 'Honors & Awards',
        awardsHeading: 'Awards',
        awardsIntro: 'Honors recognizing research, academic performance, and professional development.',
        footerNote: 'Built on GitHub Pages',
        lastUpdated: 'Last updated: June 2026',
        statsRepos: 'Repos',
        statsFollowers: 'Followers',
        statsUpdated: 'Updated',
        repoFallback: 'GitHub activity could not be loaded right now. Open the profile directly.',
        publicationLabels: {
            highlight: 'Highlight',
            abstract: 'Abstract',
            citation: 'Recommended citation',
            details: 'Details'
        }
    },
    zh: {
        title: '金治能的个人主页',
        pageTitles: {
            home: '金治能 | 个人学术主页',
            research: '研究方向 | 金治能',
            publications: '论文发表 | 金治能',
            news: '最新动态 | 金治能',
            awards: '荣誉奖励 | 金治能'
        },
        languageGatewayCopy: '建筑能源、HVAC 智能化、智慧建筑设计与热舒适方向的学术主页。',
        navHome: '主页',
        navProfile: '简介',
        navGithub: 'GitHub',
        navResearch: '研究',
        navPublications: '论文',
        navNews: '动态',
        navAwards: '荣誉',
        navCv: '简历',
        heroKicker: '学术主页',
        heroRole: '香港科技大学博士研究生',
        heroSummary: '研究建筑与城市能源碳建模、HVAC 系统智能化、智慧建筑设计以及大型公共建筑热舒适。',
        heroPrimaryLink: '查看论文',
        heroSecondaryLink: '联系方式',
        topSectionBgText: '气候响应型建筑、HVAC 智能化与城市能源建模',
        profileLabel: '个人简介',
        codingLabel: 'GitHub 官方贡献',
        codingHeading: '日积跬步，持续构建。',
        codingDaysLabel: '个编程日',
        codingTitle: '编程活动',
        codingYearLabel: '年份',
        codingLessLabel: '较少',
        codingMoreLabel: '较多',
        githubLabel: 'GitHub 官方贡献',
        githubKicker: '同步自 GitHub 公开数据',
        githubTitle: '开源工作与近期仓库更新',
        githubProfileCta: '打开 GitHub',
        githubHeatmapLabel: '贡献热力图',
        githubLiveBadge: '实时',
        researchLabel: '研究方向',
        researchHeading: '研究',
        researchIntro: '面向低碳建成环境的建筑物理、运行智能与可复现建模研究。',
        publicationsLabel: '代表论文',
        publicationsHeading: '论文发表',
        publicationsIntro: '同行评审期刊论文与学术会议报告。',
        newsLabel: '最新动态',
        newsHeading: '动态',
        newsIntro: '论文发表、学术报告、科研合作与阶段进展。',
        awardsLabel: '荣誉奖励',
        awardsHeading: '荣誉',
        awardsIntro: '科研、学业表现与专业发展相关荣誉。',
        footerNote: '基于 GitHub Pages 构建',
        lastUpdated: '最后更新：2026 年 6 月',
        statsRepos: '仓库',
        statsFollowers: '关注者',
        statsUpdated: '更新',
        repoFallback: '暂时无法加载 GitHub 动态，请直接打开个人主页查看。',
        publicationLabels: {
            highlight: '亮点',
            abstract: '摘要',
            citation: '推荐引用',
            details: '展开详情'
        }
    }
};

const publicationDetails = [
    {
        match: 'AutoModelling: From BMS Operational Data',
        journal: 'Energy',
        year: '2026',
        cover: 'static/assets/img/journals/energy.jpg',
        en: {
            highlight: 'Developed AutoModelling, a reproducible pipeline from BMS operational data to validated executable Modelica chiller models.',
            abstract: 'Generating executable chiller models from raw Building Management System (BMS) data remains difficult in practice because operational datasets are heterogeneous, incomplete, noisy, and rarely organised for model identification. This study develops AutoModelling, a standardised and reproducible automated workflow that transforms raw BMS operational data into validated, executable Modelica chiller models at the device level within a single pipeline, integrating semantic point mapping, operational data preprocessing, moving-window steady-state screening, EIR-family model identification, rule-based Modelica file generation, automated simulation, and quantitative validation.',
            citation: 'Jin, Z. and Wang, Z. AutoModelling: From BMS Operational Data to Validated Modelica Models for Chillers. Energy, 141700, 2026.'
        },
        zh: {
            highlight: '提出 AutoModelling：从 BMS 运行数据到可验证 Modelica 冷机模型的自动化流程。',
            abstract: 'Generating executable chiller models from raw Building Management System (BMS) data remains difficult in practice because operational datasets are heterogeneous, incomplete, noisy, and rarely organised for model identification. This study develops AutoModelling, a standardised and reproducible automated workflow that transforms raw BMS operational data into validated, executable Modelica chiller models at the device level within a single pipeline, integrating semantic point mapping, operational data preprocessing, moving-window steady-state screening, EIR-family model identification, rule-based Modelica file generation, automated simulation, and quantitative validation.',
            citation: 'Jin, Z. and Wang, Z. AutoModelling: From BMS Operational Data to Validated Modelica Models for Chillers. Energy, 141700, 2026.'
        }
    },
    {
        match: 'Towards Climate-Responsive Atrium Design',
        journal: 'Under Review',
        year: 'Under Review',
        en: {
            highlight: 'A climate-responsive parametric study for atrium-centered public buildings.',
            abstract: 'This under-review manuscript investigates atrium design across multiple climate settings using meta-sample modeling, focusing on how geometry and climate interact to shape energy and environmental performance.',
            citation: 'Jin, Z. et al. Towards Climate-Responsive Atrium Design: A Parametric Multi-Climate Analysis Using Meta-Sample Modeling. Under Review.'
        },
        zh: {
            highlight: '面向中庭式公共建筑的气候响应型参数化研究。',
            abstract: '该投稿论文利用元样本建模开展多气候区中庭设计分析，关注几何参数与气候条件如何共同影响建筑能耗和室内环境表现。',
            citation: 'Jin, Z. 等. Towards Climate-Responsive Atrium Design: A Parametric Multi-Climate Analysis Using Meta-Sample Modeling. Under Review.'
        }
    },
    {
        match: 'Novel integrated meta-sampling approach',
        journal: 'Energy',
        year: '2025',
        cover: 'static/assets/img/journals/energy.jpg',
        en: {
            highlight: 'Built a 39,202-case atrium model library and reduced computation by 87.6% while keeping the maximum output error at 0.35%.',
            abstract: 'This paper develops a parametric optimization framework that combines automated modeling, large-scale simulation, and meta-sample analysis to evaluate eight atrium design parameters. The workflow identifies atrium area and internal openness as dominant factors and demonstrates up to 40.29% annual energy demand reduction.',
            citation: 'Jin, Z., Sun, H., Song, J., Zheng, Y., Zheng, H., Zhang, M., and Lin, B. Novel integrated meta-sampling approach for smart building design: real-time data analytics and energy performance optimization practice. Energy, 333, 137501, 2025.'
        },
        zh: {
            highlight: '构建 39,202 个中庭模型样本库，在最大输出误差 0.35% 的条件下节省 87.6% 计算量。',
            abstract: '论文提出融合自动化建模、大规模模拟与元样本分析的参数化优化框架，用于评估八类中庭设计参数。结果识别出中庭面积和内部开敞度等关键因素，并实现最高 40.29% 的年总能耗降低。',
            citation: 'Jin, Z., Sun, H., Song, J., Zheng, Y., Zheng, H., Zhang, M., and Lin, B. Novel integrated meta-sampling approach for smart building design: real-time data analytics and energy performance optimization practice. Energy, 333, 137501, 2025.'
        }
    },
    {
        match: 'Indoor-outdoor interactive thermal response',
        journal: 'Energy and Buildings',
        year: '2025',
        cover: 'static/assets/img/journals/energy-and-buildings.jpg',
        en: {
            highlight: 'Used onsite monitoring and clustering to classify indoor-outdoor thermal response patterns in public buildings.',
            abstract: 'This study collects field data from large public buildings and applies clustering to describe how indoor thermal environments respond to outdoor conditions, air-conditioning operation, and space characteristics. The results support thermal diagnosis and operation strategies for complex public spaces.',
            citation: 'Jin, Z., Zhang, Y., Sun, H., Han, M., Zheng, Y., Zhao, Y., Han, W., Zhang, M., Xu, B., Zhang, Z., and Lin, B. Indoor-outdoor interactive thermal response in public building: onsite data collection and classification through cluster algorithm. Energy and Buildings, 328, 115175, 2025.'
        },
        zh: {
            highlight: '利用现场监测和聚类算法识别公共建筑室内外交互热响应模式。',
            abstract: '研究采集大型公共建筑现场数据，并通过聚类方法描述室内热环境对室外气候、空调运行和空间特征的响应。结果可支撑复杂公共空间的热环境诊断与运行优化。',
            citation: 'Jin, Z., Zhang, Y., Sun, H., Han, M., Zheng, Y., Zhao, Y., Han, W., Zhang, M., Xu, B., Zhang, Z., and Lin, B. Indoor-outdoor interactive thermal response in public building: onsite data collection and classification through cluster algorithm. Energy and Buildings, 328, 115175, 2025.'
        }
    },
    {
        match: 'Indoor thermal nonuniformity',
        journal: 'Case Studies in Thermal Engineering',
        year: '2024',
        cover: 'static/assets/img/journals/case-studies-in-thermal-engineering.jpg',
        en: {
            highlight: 'Diagnosed courtyard overheating, localized cooling, and vertical temperature gradients in atrium-centered public buildings.',
            abstract: 'This paper evaluates air flow and indoor thermal environments in a science museum and library designed around atrium-centered natural ventilation. Field tests reveal courtyard thermal nonuniformity and vertical gradients, indicating where courtyard form and operation should be adjusted for comfort and energy saving.',
            citation: 'Jin, Z., Zhang, Y., Sun, H., Han, M., Zheng, Y., Zhao, Y., Han, W., and Zhang, M. Indoor thermal nonuniformity of atrium-centered public building: Monitoring and diagnosis for energy saving. Case Studies in Thermal Engineering, 54, 104058, 2024.'
        },
        zh: {
            highlight: '诊断中庭式公共建筑中的庭院过热、局部过冷和垂直温度梯度问题。',
            abstract: '论文面向以中庭自然通风为核心的科技馆与图书馆，结合现场测试评估气流和室内热环境。结果揭示了庭院热不均匀性和垂直温差，为中庭形态调整与节能运行提供依据。',
            citation: 'Jin, Z., Zhang, Y., Sun, H., Han, M., Zheng, Y., Zhao, Y., Han, W., and Zhang, M. Indoor thermal nonuniformity of atrium-centered public building: Monitoring and diagnosis for energy saving. Case Studies in Thermal Engineering, 54, 104058, 2024.'
        }
    },
    {
        match: 'Dehumidification load ratio',
        journal: 'Sustainable Cities and Society',
        year: '2023',
        cover: 'static/assets/img/journals/sustainable-cities-and-society.jpg',
        en: {
            highlight: 'Found that heat-pump COP stays high when the unit handles roughly 45%-80% of latent heat load.',
            abstract: 'This paper combines a validated heat-pump thermodynamic model with transient building heat-transfer simulation for hot and humid climate zones. It quantifies how latent heat load and humidity affect COP and cooling energy-saving potential, providing guidance for air-conditioning design in dehumidification-dominant regions.',
            citation: 'Jin, Z., Zheng, Y., Huang, D., Zhang, Y., Lv, S., and Sun, H. Dehumidification load ratio: influence mechanism on air conditioning and energy saving potential analysis for building cooling. Sustainable Cities and Society, 99, 104942, 2023.'
        },
        zh: {
            highlight: '发现热泵承担约 45%-80% 潜热负荷时 COP 能维持较高水平。',
            abstract: '论文结合经验证的热泵热力学模型与建筑瞬态传热模型，分析湿热气候区潜热负荷和湿度对 COP 及制冷节能潜力的影响，为高除湿需求地区的空调系统设计提供参考。',
            citation: 'Jin, Z., Zheng, Y., Huang, D., Zhang, Y., Lv, S., and Sun, H. Dehumidification load ratio: influence mechanism on air conditioning and energy saving potential analysis for building cooling. Sustainable Cities and Society, 99, 104942, 2023.'
        }
    },
    {
        match: 'A novel method for building air conditioning energy saving potential',
        journal: 'Journal of Asian Architecture and Building Engineering',
        year: '2023',
        cover: 'static/assets/img/journals/journal-of-asian-architecture-and-building-engineering.jfif',
        en: {
            highlight: 'Introduced a thermodynamic perfectness index to pre-estimate air-conditioning energy-saving potential across climate zones.',
            abstract: 'This work builds a thermodynamic model of refrigeration equipment and links it with dynamic office-building cooling loads in five Chinese climate zones. The results show that cooling demand and energy consumption do not follow a simple one-to-one relation, highlighting the need to evaluate equipment performance and climate adaptability together.',
            citation: 'Jin, Z., Zheng, Y., and Zhang, Y. A novel method for building air conditioning energy saving potential pre-estimation based on thermodynamic perfection index for space cooling. Journal of Asian Architecture and Building Engineering, 22(4), 2348-2364, 2023.'
        },
        zh: {
            highlight: '提出基于热力学完善度指标的空调节能潜力预估方法，并进行多气候区分析。',
            abstract: '研究建立制冷设备热力学模型，并结合五个典型气候区办公建筑动态冷负荷模拟。结果表明，冷负荷需求与空调能耗并非简单单值关系，需要综合评估设备热力性能与气候适应性。',
            citation: 'Jin, Z., Zheng, Y., and Zhang, Y. A novel method for building air conditioning energy saving potential pre-estimation based on thermodynamic perfection index for space cooling. Journal of Asian Architecture and Building Engineering, 22(4), 2348-2364, 2023.'
        }
    },
    {
        match: 'Human-centric dynamic accessibility measurement',
        journal: 'Developments in the Built Environment',
        year: '2025',
        cover: 'static/assets/img/journals/developments-in-the-built-environment.jpg',
        en: {
            highlight: 'Linked evacuation time with age, heart-rate dynamics, and psychological stress in a high-altitude remote village.',
            abstract: 'This study evaluates emergency evacuation in Jiangdong Village, Ruoergai County, using human-centered dynamic accessibility measurement. Data from 77 villagers show that age and psychological stress significantly affect evacuation time, while heart-rate response reveals differences in physiological adaptability.',
            citation: 'Han, M., Jin, Z., Tian, Z., Zhao, Y., Zhang, Y., Xiong, J., and Zhang, Y. Human-centric dynamic accessibility measurement for emergency evacuation: testing and modeling in remote village in China. Developments in the Built Environment, 100668, 2025.'
        },
        zh: {
            highlight: '揭示高海拔偏远村落中疏散时间与年龄、心率动态及心理压力之间的关系。',
            abstract: '研究以若尔盖县江冬村为对象，采用以人为中心的动态可达性测度方法评估应急疏散。77 名村民数据表明，年龄和心理压力显著影响疏散时间，心率响应则反映了不同群体的生理适应差异。',
            citation: 'Han, M., Jin, Z., Tian, Z., Zhao, Y., Zhang, Y., Xiong, J., and Zhang, Y. Human-centric dynamic accessibility measurement for emergency evacuation: testing and modeling in remote village in China. Developments in the Built Environment, 100668, 2025.'
        }
    },
    {
        match: 'Novel modular PCM wall board',
        journal: 'Applied Thermal Engineering',
        year: '2024',
        cover: 'static/assets/img/journals/applied-thermal-engineering.jpg',
        en: {
            highlight: 'Designed and tested a modular PCM thermal-storage heating terminal for plateau building applications.',
            abstract: 'This study proposes a photovoltaic-thermal-coupled modular phase-change wall-board terminal for low-carbon heating in the Tibetan Plateau. Laboratory tests compare six sample structures and placements, showing how orientation and structure affect melting, solidification, heat storage, and heat release.',
            citation: 'Zhang, M., Zheng, Y., He, Y., Jin, Z., Zhang, Y., and Shi, L. Novel modular PCM wall board for building heating energy efficiency: Material preparation, manufacture and dynamic thermal testing. Applied Thermal Engineering, 256, 124168, 2024.'
        },
        zh: {
            highlight: '设计并测试面向高原建筑供暖的模块化相变蓄热终端。',
            abstract: '研究提出与光伏光热系统耦合的模块化相变墙板供暖终端，服务于青藏高原低碳供暖。实验比较六组不同结构和摆放方式，揭示朝向与结构对熔化、凝固、蓄热和放热性能的影响。',
            citation: 'Zhang, M., Zheng, Y., He, Y., Jin, Z., Zhang, Y., and Shi, L. Novel modular PCM wall board for building heating energy efficiency: Material preparation, manufacture and dynamic thermal testing. Applied Thermal Engineering, 256, 124168, 2024.'
        }
    },
    {
        match: 'Indoor Thermal Environment Evaluation for Emergency Medical Tents',
        journal: 'Atmosphere',
        year: '2024',
        cover: 'static/assets/img/journals/atmosphere.webp',
        en: {
            highlight: 'Measured vertical and horizontal temperature nonuniformity in heated emergency medical tents.',
            abstract: 'This paper tests the standard tent used by the China International Medical Team in winter conditions. Eleven temperature sensors capture horizontal and vertical gradients, showing that a 2500 W electric heater improves the tent environment but creates uneven spatial temperature distribution related to heater position and external conditions.',
            citation: 'Han, M., Jin, Z., Zhao, Y., Zhang, Y., Han, W., and Zhang, M. Indoor Thermal Environment Evaluation for Emergency Medical Tents in Heating Season: Onsite Testing and Case Study in China. Atmosphere, 15(3), 388, 2024.'
        },
        zh: {
            highlight: '现场测试供暖季应急医疗帐篷内的水平与垂直温度不均匀性。',
            abstract: '论文以中国国际医疗队标准帐篷为对象开展冬季现场测试，布置 11 个温度传感器捕捉水平和垂直温差。结果显示约 2500 W 电暖器可改善帐篷内部环境，但受设备位置和外部条件影响，空间温度分布明显不均匀。',
            citation: 'Han, M., Jin, Z., Zhao, Y., Zhang, Y., Han, W., and Zhang, M. Indoor Thermal Environment Evaluation for Emergency Medical Tents in Heating Season: Onsite Testing and Case Study in China. Atmosphere, 15(3), 388, 2024.'
        }
    },
    {
        match: 'Building Energy Efficiency for Indoor Heating Temperature Set-Point',
        journal: 'Buildings',
        year: '2023',
        cover: 'static/assets/img/journals/buildings.png',
        en: {
            highlight: 'Separated heating set-point savings into temperature-difference saving hours and behavioral saving hours.',
            abstract: 'This paper studies eight globally representative cities to explain how lowering heating temperature set-points saves energy under different climates, construction years, and internal heat sources. It distinguishes temperature-difference and behavioral mechanisms, offering a method for heating energy-saving potential assessment.',
            citation: 'Qi, X., Zhang, Y., and Jin, Z. Building Energy Efficiency for Indoor Heating Temperature Set-Point: Mechanism and Case Study of Mid-Rise Apartment. Buildings, 13(5), 1189, 2023.'
        },
        zh: {
            highlight: '将采暖设定温度节能机制拆分为温差节能时段和行为节能时段。',
            abstract: '论文选取八个全球代表性城市，分析不同气候、建成年代和内热源条件下降低采暖设定温度的节能机制。研究区分温差机制与行为机制，为采暖节能潜力评估提供方法。',
            citation: 'Qi, X., Zhang, Y., and Jin, Z. Building Energy Efficiency for Indoor Heating Temperature Set-Point: Mechanism and Case Study of Mid-Rise Apartment. Buildings, 13(5), 1189, 2023.'
        }
    },
    {
        match: 'Study on the Effect of Radiant Insulation Panel',
        journal: 'Buildings',
        year: '2022',
        cover: 'static/assets/img/journals/buildings.png',
        en: {
            highlight: 'Showed that radiant insulation panels in aluminum-frame cavities can reduce frame U-factor by more than 7.43%.',
            abstract: 'This paper proposes inserting radiant insulation panels into broken-bridge aluminum window-frame cavities. A validated heat-transfer model and THERM simulations quantify how panel position, width, quantity, and emissivity affect cavity radiation and frame U-factor, offering a practical window-frame optimization strategy.',
            citation: 'Zheng, Y., Si, P., Zhang, Y., Shi, L., Huang, C., Huang, D., and Jin, Z. Study on the Effect of Radiant Insulation Panel in Cavity on the Thermal Performance of Broken-Bridge Aluminum Window Frame. Buildings, 13(1), 58, 2022.'
        },
        zh: {
            highlight: '证明在断桥铝窗框腔体中加入辐射隔热板可使窗框 U 值降低超过 7.43%。',
            abstract: '论文提出在断桥铝窗框腔体中加入辐射隔热板，并通过经验证的传热模型和 THERM 仿真，量化隔热板位置、宽度、数量和发射率对腔体辐射换热及窗框 U 值的影响，为窗框热工优化提供可实施方案。',
            citation: 'Zheng, Y., Si, P., Zhang, Y., Shi, L., Huang, C., Huang, D., and Jin, Z. Study on the Effect of Radiant Insulation Panel in Cavity on the Thermal Performance of Broken-Bridge Aluminum Window Frame. Buildings, 13(1), 58, 2022.'
        },
    }
];

const publicationRecords = [
    {
        match: 'Steady-State Detection for Chiller Modelling',
        title: 'Steady-State Detection for Chiller Modelling: A task-grounded benchmark using Modelica-based validation residuals',
        authors: 'Jin, Zhineng; Si Wu; Zhe Wang',
        firstAffiliation: 'Department of Civil and Environmental Engineering, The Hong Kong University of Science and Technology, Hong Kong, China',
        journal: 'Building Simulation BAS 2026',
        year: '2026',
        cover: 'static/assets/img/conferences/bas2026-hkust-campus.png',
        en: {
            highlights: [
                'Presented an oral conference paper at Building Simulation BAS 2026.',
                'Benchmarked steady-state detection methods by downstream Modelica validation residuals.',
                'Used real water-cooled chiller BMS data from May 2024 to April 2025.',
                'Found regression-slope SSD with K-of-P voting delivered the lowest validation error.'
            ],
            abstract: 'This oral presentation develops a task-grounded benchmark for steady-state detection in chiller modelling. Instead of ranking detectors only by internal strictness, the study evaluates how each detector improves downstream Modelica validation residuals. The case study uses real Site A water-cooled chiller BMS data and shows that the optimal detector is the one that best rejects slow drift while retaining useful modelling samples.',
            citation: 'Jin, Zhineng, Si Wu, and Zhe Wang. "Steady-State Detection for Chiller Modelling: A task-grounded benchmark using Modelica-based validation residuals." Oral presentation, Building Simulation BAS 2026, Hong Kong SAR, China, June 11-13, 2026.'
        },
        zh: {
            highlights: [
                '在 Building Simulation BAS 2026 会议作口头报告。',
                '以 Modelica 下游验证残差作为稳态检测方法的任务导向评价指标。',
                '使用 2024 年 5 月至 2025 年 4 月真实水冷冷机 BMS 数据。',
                '结果显示回归斜率 SSD 结合 K-of-P 投票可取得最低验证误差。'
            ],
            abstract: '该口头报告提出面向冷机建模任务的稳态检测基准，不仅根据检测器自身严格程度排序，而是评估不同稳态检测方法对下游 Modelica 验证残差的改善。案例使用真实 Site A 水冷冷机 BMS 数据，结果表明最优检测器应能有效排除慢漂移，同时保留足够有用的建模样本。',
            citation: 'Jin, Zhineng, Si Wu, and Zhe Wang. "Steady-State Detection for Chiller Modelling: A task-grounded benchmark using Modelica-based validation residuals." Oral presentation, Building Simulation BAS 2026, Hong Kong SAR, China, June 11-13, 2026.'
        }
    },
    {
        match: 'AutoModelling: From BMS Operational Data',
        title: 'AutoModelling: From BMS Operational Data to Validated Modelica Models for Chillers',
        authors: 'Jin, Zhineng; Zhe Wang',
        firstAffiliation: 'Department of Civil and Environmental Engineering, The Hong Kong University of Science and Technology, Hong Kong, China',
        journal: 'Energy',
        year: '2026',
        cover: 'static/assets/img/journals/energy.jpg',
        en: {
            highlights: [
                'Developed AutoModelling: a pipeline from BMS data to Modelica chiller models.',
                'Six-step pipeline: semantic mapping, screening, fitting, simulation, validation.',
                'Demonstrated on 22 chillers in three real Hong Kong cooling plants.',
                '13 of 15 chillers (87%) meet ASHRAE GL14 on power across three real plants.',
                'Cut manual modelling effort by 98.5%: 272.5 to 4.11 person-hours per site.'
            ],
            abstract: 'Generating executable chiller models from raw Building Management System (BMS) data remains difficult in practice because operational datasets are heterogeneous, incomplete, noisy, and rarely organised for model identification. This study develops AutoModelling, a standardised and reproducible automated workflow that transforms raw BMS operational data into validated, executable Modelica chiller models at the device level within a single pipeline, integrating semantic point mapping, operational data preprocessing, moving-window steady-state screening, EIR-family model identification, rule-based Modelica file generation, automated simulation, and quantitative validation. Rather than imposing one predefined structure, the workflow applies a candidate-model strategy that selects the better-supported variant per chiller from two Energy Input Ratio (EIR) family models in the Modelica Buildings Library--ElectricReformulatedEIR (EEIR) and ElectricEIR (EIR)--which differ in whether the condenser-side performance curves use the leaving or entering condenser-water temperature. The workflow is evaluated on three real cooling plants in Hong Kong, representing a data centre, a commercial complex, and a university campus. Among 22 chillers, 15 provide sufficient complete and steady-state data for identification; EEIR is selected for 11 units and EIR for 4 units. The selected models satisfy the adopted ASHRAE Guideline 14 thresholds for compressor power in 13 of the 15 retained chillers and for coefficient of performance in 10, with 9 chillers meeting both criteria simultaneously. A central finding is that modelling readiness is governed not by nominal sensor availability alone but by key-variable completeness, retained steady-state sample count, operating-range coverage, and measurement consistency: the cleanest site achieves compliant fits from informative data, whereas the others reveal how limited operating coverage or measurement anomalies degrade validation quality. Relative to a conservative manual baseline, the workflow reduces modelling effort by 98.5% for the most demanding site, while transparently reporting both compliant and non-compliant retained units.',
            citation: 'Jin, Zhineng and Zhe Wang. "AutoModelling: From BMS Operational Data to Validated Modelica Models for Chillers." Energy (2026): 141700. https://doi.org/10.1016/j.energy.2026.141700.'
        },
        zh: {
            highlights: [
                '提出 AutoModelling：从 BMS 数据生成 Modelica 冷机模型的流程。',
                '流程覆盖语义映射、数据筛选、参数拟合、仿真与验证。',
                '在香港三个真实冷站的 22 台冷机上进行验证。',
                '15 台保留冷机中有 13 台在功率指标上满足 ASHRAE GL14。',
                '将单站人工建模工作量从 272.5 人时降至 4.11 人时，减少 98.5%。'
            ],
            abstract: 'Generating executable chiller models from raw Building Management System (BMS) data remains difficult in practice because operational datasets are heterogeneous, incomplete, noisy, and rarely organised for model identification. This study develops AutoModelling, a standardised and reproducible automated workflow that transforms raw BMS operational data into validated, executable Modelica chiller models at the device level within a single pipeline, integrating semantic point mapping, operational data preprocessing, moving-window steady-state screening, EIR-family model identification, rule-based Modelica file generation, automated simulation, and quantitative validation. Rather than imposing one predefined structure, the workflow applies a candidate-model strategy that selects the better-supported variant per chiller from two Energy Input Ratio (EIR) family models in the Modelica Buildings Library--ElectricReformulatedEIR (EEIR) and ElectricEIR (EIR)--which differ in whether the condenser-side performance curves use the leaving or entering condenser-water temperature. The workflow is evaluated on three real cooling plants in Hong Kong, representing a data centre, a commercial complex, and a university campus. Among 22 chillers, 15 provide sufficient complete and steady-state data for identification; EEIR is selected for 11 units and EIR for 4 units. The selected models satisfy the adopted ASHRAE Guideline 14 thresholds for compressor power in 13 of the 15 retained chillers and for coefficient of performance in 10, with 9 chillers meeting both criteria simultaneously. A central finding is that modelling readiness is governed not by nominal sensor availability alone but by key-variable completeness, retained steady-state sample count, operating-range coverage, and measurement consistency: the cleanest site achieves compliant fits from informative data, whereas the others reveal how limited operating coverage or measurement anomalies degrade validation quality. Relative to a conservative manual baseline, the workflow reduces modelling effort by 98.5% for the most demanding site, while transparently reporting both compliant and non-compliant retained units.',
            citation: 'Jin, Zhineng and Zhe Wang. "AutoModelling: From BMS Operational Data to Validated Modelica Models for Chillers." Energy (2026): 141700. https://doi.org/10.1016/j.energy.2026.141700.'
        }
    },
    {
        match: 'Towards Climate-Responsive Atrium Design',
        title: 'Towards Climate-Responsive Atrium Design: A Parametric Multi-Climate Analysis Using Meta-Sample Modeling',
        authors: 'Jin, Zhineng; Hongli Sun; Junkang Song; Wenke Zhong; Zishuang Xia; Hanjie Zheng; Changqi Wen; Bin Xu; Borong Lin',
        firstAffiliation: 'Department of Civil and Environmental Engineering, The Hong Kong University of Science and Technology, Hong Kong, China',
        journal: 'Under Review',
        year: 'Under Review',
        cover: '',
        en: {
            highlights: [
                'Develops a parametric multi-climate analysis workflow for atrium-centered public buildings.',
                'Uses meta-sample modeling to connect design parameters with climate-responsive performance.',
                'Focuses on the interaction between atrium geometry, climate conditions, and energy behavior.',
                'Provides early-stage design evidence for optimizing atrium form across climatic contexts.'
            ],
            abstract: 'This under-review manuscript investigates atrium design across multiple climate settings using meta-sample modeling, focusing on how geometry and climate interact to shape energy and environmental performance.',
            citation: 'Jin, Z. et al. Towards Climate-Responsive Atrium Design: A Parametric Multi-Climate Analysis Using Meta-Sample Modeling. Under Review.'
        },
        zh: {
            highlights: [
                '建立面向中庭式公共建筑的多气候区参数化分析流程。',
                '使用元样本建模连接设计参数与气候响应性能。',
                '关注中庭几何、气候条件与能耗表现之间的相互作用。',
                '为不同气候背景下的中庭形态优化提供早期设计证据。'
            ],
            abstract: '该投稿论文利用元样本建模开展多气候区中庭设计分析，关注几何参数与气候条件如何共同影响建筑能耗和室内环境表现。',
            citation: 'Jin, Z. 等. Towards Climate-Responsive Atrium Design: A Parametric Multi-Climate Analysis Using Meta-Sample Modeling. Under Review.'
        }
    },
    {
        match: 'Novel integrated meta-sampling approach',
        title: 'Novel integrated meta-sampling approach for smart building design: real-time data analytics and energy performance optimization practice',
        authors: 'Jin, Zhineng; Hongli Sun; Junkang Song; Yanhong Zheng; Hanjie Zheng; Menglong Zhang; Borong Lin',
        firstAffiliation: 'College of Architecture and Environment, Sichuan University, Chengdu 610065, China',
        journal: 'Energy',
        year: '2025',
        cover: 'static/assets/img/journals/energy.jpg',
        en: {
            highlights: [
                'Integrates automated modeling, large-scale simulation, and meta-sample analysis for atrium design.',
                'Builds a benchmark model library of 39,202 atrium configurations.',
                'Identifies atrium area and internal openness as key drivers of cooling and heating demand.',
                'Achieves 87.6% computational savings with a maximum output error of 0.35%.'
            ],
            abstract: 'Atrium design significantly influences the energy performance of public buildings, especially in climate-sensitive regions. This study develops a parametric optimization framework integrating automated modeling, large-scale simulation, and meta-sample analysis to evaluate the impact of eight atrium design parameters on energy use. A benchmark model library of 39,202 atrium configurations was constructed to assess heating, cooling, and lighting energy consumption. Sensitivity analysis revealed that atrium area and internal openness are the most influential factors for cooling and heating demand. South-facing atriums consistently showed lower annual cooling energy demand (CEUI) and annual heating energy demand (HEUI). One actionable strategy is reducing internal openness (Int) and increasing external openness (Out) to significantly lower energy use. Multi-objective optimization demonstrated up to 40.29% reduction in annual total energy demand (EUI). The meta-sample model, validated against full-sample statistics, achieved 87.6% computational savings with maximum output error of only 0.35%. These findings provide quantitative design guidance for early-stage atrium optimization and enable fast integration with parametric BIM workflows.',
            citation: 'Jin, Zhineng, Hongli Sun, Junkang Song, Yanhong Zheng, Hanjie Zheng, Menglong Zhang, and Borong Lin. "Novel integrated meta-sampling approach for smart building design: real-time data analytics and energy performance optimization practice." Energy (2025): 137501.'
        },
        zh: {
            highlights: [
                '融合自动化建模、大规模模拟与元样本分析用于中庭设计优化。',
                '构建包含 39,202 个中庭构型的基准模型库。',
                '识别中庭面积和内部开敞度是冷热需求的关键影响因素。',
                '在最大输出误差 0.35% 的条件下实现 87.6% 的计算节省。'
            ],
            abstract: 'Atrium design significantly influences the energy performance of public buildings, especially in climate-sensitive regions. This study develops a parametric optimization framework integrating automated modeling, large-scale simulation, and meta-sample analysis to evaluate the impact of eight atrium design parameters on energy use. A benchmark model library of 39,202 atrium configurations was constructed to assess heating, cooling, and lighting energy consumption. Sensitivity analysis revealed that atrium area and internal openness are the most influential factors for cooling and heating demand. South-facing atriums consistently showed lower annual cooling energy demand (CEUI) and annual heating energy demand (HEUI). One actionable strategy is reducing internal openness (Int) and increasing external openness (Out) to significantly lower energy use. Multi-objective optimization demonstrated up to 40.29% reduction in annual total energy demand (EUI). The meta-sample model, validated against full-sample statistics, achieved 87.6% computational savings with maximum output error of only 0.35%. These findings provide quantitative design guidance for early-stage atrium optimization and enable fast integration with parametric BIM workflows.',
            citation: 'Jin, Zhineng, Hongli Sun, Junkang Song, Yanhong Zheng, Hanjie Zheng, Menglong Zhang, and Borong Lin. "Novel integrated meta-sampling approach for smart building design: real-time data analytics and energy performance optimization practice." Energy (2025): 137501.'
        }
    },
    {
        match: 'Indoor-outdoor interactive thermal response',
        title: 'Indoor-outdoor interactive thermal response in public building: onsite data collection and classification through cluster algorithm',
        authors: 'Jin, Zhineng; Yin Zhang; Hongli Sun; Meng Han; Yanhong Zheng; Ying Zhao; Wenyang Han; Menglong Zhang; Bin Xu; Zequn Zhang; Borong Lin',
        firstAffiliation: 'College of Architecture and Environment, Sichuan University, Chengdu 610065, China',
        journal: 'Energy and Buildings',
        year: '2025',
        cover: 'static/assets/img/journals/energy-and-buildings.jpg',
        en: {
            highlights: [
                'Combines K-means clustering and multiple linear regression for atrium thermal analysis.',
                'Analyzes extensive thermal data from transitional and traditional atria in Suining, China.',
                'Finds a strong outdoor-indoor temperature relationship in the transitional atrium.',
                'Establishes CAMLR as a faster and more visual tool for complex public-building thermal studies.'
            ],
            abstract: 'Efficient thermal environment control in large public buildings with atria is critical for reducing energy consumption and carbon emissions. This study investigates the indoor thermal environments of two distinct atria in Suining, China, within a Hot Summer and Cold Winter (HSCW) climate zone. A novel methodology combining K-means clustering algorithms and multiple linear regression (CAMLR) was employed to analyze extensive thermal data from a transitional atrium and a traditional atrium. CAMLR significantly outperformed Traditional Building Thermal environment analysis Methods (TBTM), achieving a 33.8% higher R2 and reducing the residual sum of squares by 62.11%. Key findings include: 1) A strong correlation (R2 = 0.9555) between outdoor temperature and indoor thermal conditions in the transitional atrium, highlighting a critical outdoor temperature threshold of 30 C that leads to prolonged indoor heat retention. 2) Solar radiation plays a dominant role in the traditional atrium (R2 = 0.5584), influencing rapid temperature fluctuations. These insights underscore the critical role of atrium design in optimizing thermal performance and energy efficiency. Compared to TBTM, CAMLR provides faster, more accurate, and highly visualized data analysis, making it particularly suitable for complex thermal environment studies. This study establishes CAMLR as a robust tool for advancing thermal management strategies in large public buildings, offering practical guidance for energy-efficient architectural designs in similar climate zones.',
            citation: 'Jin, Zhineng, Yin Zhang, Hongli Sun, Meng Han, Yanhong Zheng, Ying Zhao, Wenyang Han, Menglong Zhang, Bin Xu, Zequn Zhang, and Borong Lin. "Indoor-outdoor interactive thermal response in public building: onsite data collection and classification through cluster algorithm." Energy and Buildings 328 (2025): 115175.'
        },
        zh: {
            highlights: [
                '结合 K-means 聚类与多元线性回归分析中庭热环境。',
                '分析中国遂宁过渡型中庭与传统中庭的大量实测热环境数据。',
                '发现过渡型中庭室外温度与室内热环境之间存在强相关关系。',
                '证明 CAMLR 适用于复杂公共建筑热环境的快速可视化分析。'
            ],
            abstract: 'Efficient thermal environment control in large public buildings with atria is critical for reducing energy consumption and carbon emissions. This study investigates the indoor thermal environments of two distinct atria in Suining, China, within a Hot Summer and Cold Winter (HSCW) climate zone. A novel methodology combining K-means clustering algorithms and multiple linear regression (CAMLR) was employed to analyze extensive thermal data from a transitional atrium and a traditional atrium. CAMLR significantly outperformed Traditional Building Thermal environment analysis Methods (TBTM), achieving a 33.8% higher R2 and reducing the residual sum of squares by 62.11%. Key findings include: 1) A strong correlation (R2 = 0.9555) between outdoor temperature and indoor thermal conditions in the transitional atrium, highlighting a critical outdoor temperature threshold of 30 C that leads to prolonged indoor heat retention. 2) Solar radiation plays a dominant role in the traditional atrium (R2 = 0.5584), influencing rapid temperature fluctuations. These insights underscore the critical role of atrium design in optimizing thermal performance and energy efficiency. Compared to TBTM, CAMLR provides faster, more accurate, and highly visualized data analysis, making it particularly suitable for complex thermal environment studies. This study establishes CAMLR as a robust tool for advancing thermal management strategies in large public buildings, offering practical guidance for energy-efficient architectural designs in similar climate zones.',
            citation: 'Jin, Zhineng, Yin Zhang, Hongli Sun, Meng Han, Yanhong Zheng, Ying Zhao, Wenyang Han, Menglong Zhang, Bin Xu, Zequn Zhang, and Borong Lin. "Indoor-outdoor interactive thermal response in public building: onsite data collection and classification through cluster algorithm." Energy and Buildings 328 (2025): 115175.'
        }
    },
    {
        match: 'Indoor thermal nonuniformity',
        title: 'Indoor thermal nonuniformity of atrium-centered public building: Monitoring and diagnosis for energy saving',
        authors: 'Jin, Zhineng; Yin Zhang; Hongli Sun; Meng Han; Yanhong Zheng; Ying Zhao; Wenyang Han; Menglong Zhang',
        firstAffiliation: 'College of Architecture and Environment, Sichuan University, Chengdu 610065, China',
        journal: 'Case Studies in Thermal Engineering',
        year: '2024',
        cover: 'static/assets/img/journals/case-studies-in-thermal-engineering.jpg',
        en: {
            highlights: [
                'Monitors atrium-centered public buildings with natural ventilation considerations.',
                'Diagnoses overheating, localized cooling, and vertical temperature gradients in courtyards.',
                'Proposes roof design models and refined air-conditioning control strategies.',
                'Shows architectural optimization can achieve a maximum energy-saving rate of 46.54%.'
            ],
            abstract: 'Heating ventilation and air conditioning system accounts for over one third of building energy usage, especially for public buildings due to large indoor heat source and high ventilation and thermal comfort requirement compared to residential buildings. Natural ventilation shows high application potentials in public buildings because of its high-efficient ventilation effect and energy saving potential for indoor heat dissipation. In this paper, the building design is conducted for a science museum and library with atrium-centered natural ventilation consideration. The floor layout, building orientation and internal structure are optimized to make full use of natural ventilation for space cooling under local climatic conditions. A natural ventilation model is established through building field tests to evaluate the air flow and thermal environment under indoor and outdoor pressure differences. The preliminary results show that Building A\'s courtyard exhibited overheating issues, likely attributed to outdoor solar radiation, whereas Building B\'s courtyard experienced localized cooling, possibly due to indoor air conditioning system controls. Addressing these concerns necessitates modifications in courtyard design and structure. Moreover, both courtyards displayed vertical temperature gradients, emphasizing the need for effective management of outdoor heat influx and enhancements in indoor ventilation and shading strategies. To mitigate these issues, the study proposed three distinct roof design models and more refined indoor air conditioning system control strategies. The optimization of architectural design can achieve a maximum energy-saving rate of 46.54%. Furthermore, aligning functional zones with thermal comfort areas was recommended to enhance overall building thermal comfort. The findings and proposed solutions from this study are anticipated to contribute to the enhancement of thermal comfort, energy efficiency, and vertical temperature distribution in large public buildings, catering to user requirements while reducing energy consumption.',
            citation: 'Jin, Zhineng, Yin Zhang, Hongli Sun, Meng Han, Yanhong Zheng, Ying Zhao, Wenyang Han, and Menglong Zhang. "Indoor thermal nonuniformity of atrium-centered public building: Monitoring and diagnosis for energy saving." Case Studies in Thermal Engineering 54 (2024): 104058.'
        },
        zh: {
            highlights: [
                '监测以自然通风为核心的中庭式公共建筑。',
                '诊断庭院过热、局部过冷和垂直温度梯度问题。',
                '提出屋顶设计模型和更精细的空调系统控制策略。',
                '显示建筑设计优化最高可实现 46.54% 的节能率。'
            ],
            abstract: 'Heating ventilation and air conditioning system accounts for over one third of building energy usage, especially for public buildings due to large indoor heat source and high ventilation and thermal comfort requirement compared to residential buildings. Natural ventilation shows high application potentials in public buildings because of its high-efficient ventilation effect and energy saving potential for indoor heat dissipation. In this paper, the building design is conducted for a science museum and library with atrium-centered natural ventilation consideration. The floor layout, building orientation and internal structure are optimized to make full use of natural ventilation for space cooling under local climatic conditions. A natural ventilation model is established through building field tests to evaluate the air flow and thermal environment under indoor and outdoor pressure differences. The preliminary results show that Building A\'s courtyard exhibited overheating issues, likely attributed to outdoor solar radiation, whereas Building B\'s courtyard experienced localized cooling, possibly due to indoor air conditioning system controls. Addressing these concerns necessitates modifications in courtyard design and structure. Moreover, both courtyards displayed vertical temperature gradients, emphasizing the need for effective management of outdoor heat influx and enhancements in indoor ventilation and shading strategies. To mitigate these issues, the study proposed three distinct roof design models and more refined indoor air conditioning system control strategies. The optimization of architectural design can achieve a maximum energy-saving rate of 46.54%. Furthermore, aligning functional zones with thermal comfort areas was recommended to enhance overall building thermal comfort. The findings and proposed solutions from this study are anticipated to contribute to the enhancement of thermal comfort, energy efficiency, and vertical temperature distribution in large public buildings, catering to user requirements while reducing energy consumption.',
            citation: 'Jin, Zhineng, Yin Zhang, Hongli Sun, Meng Han, Yanhong Zheng, Ying Zhao, Wenyang Han, and Menglong Zhang. "Indoor thermal nonuniformity of atrium-centered public building: Monitoring and diagnosis for energy saving." Case Studies in Thermal Engineering 54 (2024): 104058.'
        }
    },
    {
        match: 'Dehumidification load ratio',
        title: 'Dehumidification load ratio: influence mechanism on air conditioning and energy saving potential analysis for building cooling',
        authors: 'Jin, Zhineng; Yanhong Zheng; Dongsheng Huang; Yin Zhang; Siqiang Lv; Hongli Sun',
        firstAffiliation: 'College of Architecture and Environment, Sichuan University, Chengdu 610065, China',
        journal: 'Sustainable Cities and Society',
        year: '2023',
        cover: 'static/assets/img/journals/sustainable-cities-and-society.jpg',
        en: {
            highlights: [
                'Combines a validated heat-pump model with transient building heat-transfer modeling.',
                'Studies Guangzhou, Wuhan, and Jiuquan as representative hot and humid climate zones.',
                'Finds a positive correlation between COP and latent heat load.',
                'Shows heat-pump COP remains high when handling 45% to 80% of latent heat load.'
            ],
            abstract: 'The construction energy consumption (EC) makes up around 35% of the total energy used. Half of this energy is used for air-conditioning to cool spaces. The effectiveness of cooling relates to various factors, particularly the dynamic thermal performance of air-conditioners (AC) in different conditions. Studying heat pumps in diverse hot and humid climates, especially where dehumidification matters in summer AC, reveals efficiency. Examining the connection between coefficient of performance (COP) and heat removal aids in lowering building energy usage and improving cooling systems. To achieve this, a validated thermodynamic model of heat pumps and a specific transient building heat transfer model were combined. The study focused on three distinct hot and humid climate zones: Guangzhou, Wuhan, and Jiuquan. Simulations of heat pump performance were conducted throughout the year to analyze variations in COP, relative humidity (RH), and latent heat load (LHL). Key findings indicate that the COP of heat pumps is notably influenced by the practical amount of dehumidification required. A positive correlation (correlation coefficient: 0.52151) exists between COP and LHL, emphasizing the importance of addressing dehumidification needs. The research highlights that the COP remains consistently high when the heat pump manages between 45% to 80% of the LHL. Practically, these findings have crucial implications for heat pump applications and building EC reduction, particularly in regions with pronounced dehumidification requirements during the cooling season. By understanding the interplay between heat pump efficiency, humidity, and heat load, practitioners can optimize heat pump performance to achieve energy savings. This research provides a valuable reference for designing and implementing cooling systems in various hot and humid climates, facilitating energy-efficient practices and environmentally friendly building operations.',
            citation: 'Jin, Zhineng, Yanhong Zheng, Dongsheng Huang, Yin Zhang, Siqiang Lv, and Hongli Sun. "Dehumidification load ratio: influence mechanism on air conditioning and energy saving potential analysis for building cooling." Sustainable Cities and Society 99 (2023): 104942.'
        },
        zh: {
            highlights: [
                '结合经验证的热泵模型与建筑瞬态传热模型。',
                '选取广州、武汉和酒泉作为典型湿热气候区案例。',
                '发现 COP 与潜热负荷之间存在正相关关系。',
                '表明热泵承担 45% 到 80% 潜热负荷时 COP 保持较高水平。'
            ],
            abstract: 'The construction energy consumption (EC) makes up around 35% of the total energy used. Half of this energy is used for air-conditioning to cool spaces. The effectiveness of cooling relates to various factors, particularly the dynamic thermal performance of air-conditioners (AC) in different conditions. Studying heat pumps in diverse hot and humid climates, especially where dehumidification matters in summer AC, reveals efficiency. Examining the connection between coefficient of performance (COP) and heat removal aids in lowering building energy usage and improving cooling systems. To achieve this, a validated thermodynamic model of heat pumps and a specific transient building heat transfer model were combined. The study focused on three distinct hot and humid climate zones: Guangzhou, Wuhan, and Jiuquan. Simulations of heat pump performance were conducted throughout the year to analyze variations in COP, relative humidity (RH), and latent heat load (LHL). Key findings indicate that the COP of heat pumps is notably influenced by the practical amount of dehumidification required. A positive correlation (correlation coefficient: 0.52151) exists between COP and LHL, emphasizing the importance of addressing dehumidification needs. The research highlights that the COP remains consistently high when the heat pump manages between 45% to 80% of the LHL. Practically, these findings have crucial implications for heat pump applications and building EC reduction, particularly in regions with pronounced dehumidification requirements during the cooling season. By understanding the interplay between heat pump efficiency, humidity, and heat load, practitioners can optimize heat pump performance to achieve energy savings. This research provides a valuable reference for designing and implementing cooling systems in various hot and humid climates, facilitating energy-efficient practices and environmentally friendly building operations.',
            citation: 'Jin, Zhineng, Yanhong Zheng, Dongsheng Huang, Yin Zhang, Siqiang Lv, and Hongli Sun. "Dehumidification load ratio: influence mechanism on air conditioning and energy saving potential analysis for building cooling." Sustainable Cities and Society 99 (2023): 104942.'
        }
    },
    {
        match: 'A novel method for building air conditioning energy saving potential',
        title: 'A novel method for building air conditioning energy saving potential pre-estimation based on thermodynamic perfection index for space cooling',
        authors: 'Jin, Zhineng; Yanhong Zheng; Yin Zhang',
        firstAffiliation: 'College of Architecture and Environment, Sichuan University, Chengdu, China',
        journal: 'Journal of Asian Architecture and Building Engineering',
        year: '2023',
        cover: 'static/assets/img/journals/journal-of-asian-architecture-and-building-engineering.jfif',
        en: {
            highlights: [
                'Establishes a thermodynamic model of refrigeration equipment using thermodynamic perfectness.',
                'Connects refrigeration-cycle deviation with building cooling energy-saving potential.',
                'Simulates annual office-building cooling energy consumption across five climate zones.',
                'Shows cooling demand and cooling energy consumption do not follow a simple one-to-one relationship.'
            ],
            abstract: 'The construction energy consumption (CEC) is about 35% of entire energy consumption (EC), of which 50% is for cooler air-conditioner. The practical cooling EC is relevant to the dynamic thermal performance of cooler air-conditioner. Analyzing the difference in cooling efficiency and energy-saving potential (ESP) of the same equipment is significant to cutting down building EC. Using the concept of thermodynamic perfectness, a thermal model of refrigeration equipment is established to analyze the deviation from the ideal refrigeration cycle. At the same time, to explore the internal connection between its energy conservation and climate adaptability, five typical cities in different thermal climate zones were selected. Dynamic load model of an office building is established and the cooling EC throughout the year of each city is simulated separately. Preliminary research results show that the thermodynamic perfectness does not have a single-valued function relationship with their cooling efficiency; Guangzhou has the highest cooling demand, with a total cooling load 14.3% higher than Wuhan, and its cooling EC is lower than Wuhan. Through the establishment of a thermodynamic model and preliminary application, the calculation of the cooling ESP in different climatic regions in Chinese summer is greatly important to the usage of air conditioner.',
            citation: 'Jin, Zhineng, Yanhong Zheng, and Yin Zhang. "A novel method for building air conditioning energy saving potential pre-estimation based on thermodynamic perfection index for space cooling." Journal of Asian Architecture and Building Engineering 22, no. 4 (2023): 2348-2364.'
        },
        zh: {
            highlights: [
                '基于热力学完善度建立制冷设备热力学模型。',
                '连接制冷循环偏差与建筑空调节能潜力。',
                '模拟五个气候区办公建筑全年制冷能耗。',
                '表明冷负荷需求与制冷能耗并非简单单值关系。'
            ],
            abstract: 'The construction energy consumption (CEC) is about 35% of entire energy consumption (EC), of which 50% is for cooler air-conditioner. The practical cooling EC is relevant to the dynamic thermal performance of cooler air-conditioner. Analyzing the difference in cooling efficiency and energy-saving potential (ESP) of the same equipment is significant to cutting down building EC. Using the concept of thermodynamic perfectness, a thermal model of refrigeration equipment is established to analyze the deviation from the ideal refrigeration cycle. At the same time, to explore the internal connection between its energy conservation and climate adaptability, five typical cities in different thermal climate zones were selected. Dynamic load model of an office building is established and the cooling EC throughout the year of each city is simulated separately. Preliminary research results show that the thermodynamic perfectness does not have a single-valued function relationship with their cooling efficiency; Guangzhou has the highest cooling demand, with a total cooling load 14.3% higher than Wuhan, and its cooling EC is lower than Wuhan. Through the establishment of a thermodynamic model and preliminary application, the calculation of the cooling ESP in different climatic regions in Chinese summer is greatly important to the usage of air conditioner.',
            citation: 'Jin, Zhineng, Yanhong Zheng, and Yin Zhang. "A novel method for building air conditioning energy saving potential pre-estimation based on thermodynamic perfection index for space cooling." Journal of Asian Architecture and Building Engineering 22, no. 4 (2023): 2348-2364.'
        }
    },
    {
        match: 'Human-centric dynamic accessibility measurement',
        title: 'Human-centric dynamic accessibility measurement for emergency evacuation: testing and modeling in remote village in China',
        authors: 'Meng Han; Zhineng Jin; Zexuan Tian; Ying Zhao; Yin Zhang; Jianwu Xiong; Yifan Zhang',
        firstAffiliation: 'School of Architecture, Southwest Minzu University, Chengdu 610225, China',
        journal: 'Developments in the Built Environment',
        year: '2025',
        cover: 'static/assets/img/journals/developments-in-the-built-environment.jpg',
        en: {
            highlights: [
                'Measures evacuation behavior in a high-altitude remote village using human-centered dynamic accessibility.',
                'Analyzes evacuation data from 77 villagers with psychological and physiological indicators.',
                'Finds age and evacuation time are significantly positively correlated.',
                'Shows psychological stress and heart-rate dynamics are key factors in evacuation efficiency.'
            ],
            abstract: 'Emergency evacuation is a critical component of disaster management, particularly in high-altitude remote areas where limited infrastructure, complex terrain, and extreme environments significantly increase evacuation challenges. However, most existing studies focus on urban or low-altitude regions, with limited research on evacuation behavior in high-altitude settings. This study examines Jiangdong Village in Ruoergai County, Sichuan Province, using a human-centered dynamic accessibility measurement approach to assess the impact of high-altitude environments on evacuation efficiency through psychological-physiological data analysis. By analyzing evacuation data from 77 villagers, we constructed a multiple linear regression model (R2 = 0.846), which revealed a significant positive correlation between age and evacuation time (regression coefficient 0.93, P = 0.006). Younger participants exhibited better physiological adaptability (mean heart rate 106.07 bpm at 50s), whereas older individuals showed a slower heart rate response (mean heart rate 74.14 bpm at 50s) and delayed recovery. Psychological stress was also significantly correlated with evacuation time (correlation coefficient 0.64, P < 0.001), with high-stress individuals evacuating in 229.33s on average, compared to 142.89s for low-stress participants. The findings indicate that psychological stress and heart rate dynamics are key factors influencing evacuation efficiency. This study provides empirical insights for emergency management in high-altitude ethnic villages and proposes optimized evacuation strategies, including real-time physiological monitoring, enhanced psychological support, and tailored evacuation plans for different populations to improve disaster response in high-altitude regions.',
            citation: 'Han, Meng, Zhineng Jin, Zexuan Tian, Ying Zhao, Yin Zhang, Jianwu Xiong, and Yifan Zhang. "Human-centric dynamic accessibility measurement for emergency evacuation: testing and modelling in remote village in China." Developments in the Built Environment (2025): 100668.'
        },
        zh: {
            highlights: [
                '使用以人为中心的动态可达性测度高海拔偏远村落疏散行为。',
                '结合心理和生理指标分析 77 名村民的疏散数据。',
                '发现年龄与疏散时间显著正相关。',
                '表明心理压力和心率动态是影响疏散效率的关键因素。'
            ],
            abstract: 'Emergency evacuation is a critical component of disaster management, particularly in high-altitude remote areas where limited infrastructure, complex terrain, and extreme environments significantly increase evacuation challenges. However, most existing studies focus on urban or low-altitude regions, with limited research on evacuation behavior in high-altitude settings. This study examines Jiangdong Village in Ruoergai County, Sichuan Province, using a human-centered dynamic accessibility measurement approach to assess the impact of high-altitude environments on evacuation efficiency through psychological-physiological data analysis. By analyzing evacuation data from 77 villagers, we constructed a multiple linear regression model (R2 = 0.846), which revealed a significant positive correlation between age and evacuation time (regression coefficient 0.93, P = 0.006). Younger participants exhibited better physiological adaptability (mean heart rate 106.07 bpm at 50s), whereas older individuals showed a slower heart rate response (mean heart rate 74.14 bpm at 50s) and delayed recovery. Psychological stress was also significantly correlated with evacuation time (correlation coefficient 0.64, P < 0.001), with high-stress individuals evacuating in 229.33s on average, compared to 142.89s for low-stress participants. The findings indicate that psychological stress and heart rate dynamics are key factors influencing evacuation efficiency. This study provides empirical insights for emergency management in high-altitude ethnic villages and proposes optimized evacuation strategies, including real-time physiological monitoring, enhanced psychological support, and tailored evacuation plans for different populations to improve disaster response in high-altitude regions.',
            citation: 'Han, Meng, Zhineng Jin, Zexuan Tian, Ying Zhao, Yin Zhang, Jianwu Xiong, and Yifan Zhang. "Human-centric dynamic accessibility measurement for emergency evacuation: testing and modelling in remote village in China." Developments in the Built Environment (2025): 100668.'
        }
    },
    {
        match: 'Novel modular PCM wall board',
        title: 'Novel modular PCM wall board for building heating energy efficiency: Material preparation, manufacture and dynamic thermal testing',
        authors: 'Menglong Zhang; Yanhong Zheng; Yufei He; Zhineng Jin; Yin Zhang; Lijun Shi',
        firstAffiliation: 'School of Architecture, Southwest Minzu University, Chengdu 610225, China',
        journal: 'Applied Thermal Engineering',
        year: '2024',
        cover: 'static/assets/img/journals/applied-thermal-engineering.jpg',
        en: {
            highlights: [
                'Proposes a modular phase-change thermal-storage electric heating terminal.',
                'Targets low-carbon heating applications in Tibetan Plateau buildings.',
                'Tests six sample groups with different structures and placement modes.',
                'Shows orientation and structure strongly affect melting, solidification, and heat release.'
            ],
            abstract: 'With the comprehensive implementation of China\'s "dual carbon" goals, the building heating sector, characterized by high energy consumption and emissions, urgently requires low-carbon transformation. However, energy-saving measures for plateau regions are scarce and face challenges due to harsh climates. This study proposes an innovative heating method utilizing composite phase change materials. A new modular phase change thermal storage electric heating terminal integrated with a photovoltaic thermal system has been designed to address issues of high building energy consumption and problems related to heating system freezing and leakage in the Tibetan Plateau (Qinghai-Xizang Plateau). Laboratory tests were conducted on six groups of samples with different structures and placements to examine their heat storage and release characteristics. Results indicate: The system\'s temperature stabilization time totals 14.6 h; Horizontally placing the terminal reduces melting time by up to 2.7 h, enhancing heat storage performance; Structure three shortens solidification time by up to 2.2 h compared to structure one, improving heat release performance; Vertically placed terminals have better heat release performance than horizontally placed ones, resulting in more effective indoor heating. This study proposes a modular design for phase change heat storage electric heating walls, simplifying installation and maintenance while maintaining aesthetic appeal. Detailed temperature measurements of different wall surfaces revealed excellent cyclic heat storage and release performance. The developed phase change heat storage electric heating terminal is expected to significantly reduce heating energy consumption in the Tibetan Plateau (Qinghai-Xizang Plateau), enhancing building energy efficiency and providing valuable insights for further applications of phase change materials in building design.',
            citation: 'Zhang, Menglong, Yanhong Zheng, Yufei He, Zhineng Jin, Yin Zhang, and Lijun Shi. "Novel modular PCM wall board for building heating energy efficiency: Material preparation, manufacture and dynamic thermal testing." Applied Thermal Engineering 256 (2024): 124168.'
        },
        zh: {
            highlights: [
                '提出模块化相变蓄热电供暖终端。',
                '面向青藏高原建筑低碳供暖应用场景。',
                '测试六组不同结构和摆放方式的样品。',
                '表明摆放方向和结构显著影响熔化、凝固与放热性能。'
            ],
            abstract: 'With the comprehensive implementation of China\'s "dual carbon" goals, the building heating sector, characterized by high energy consumption and emissions, urgently requires low-carbon transformation. However, energy-saving measures for plateau regions are scarce and face challenges due to harsh climates. This study proposes an innovative heating method utilizing composite phase change materials. A new modular phase change thermal storage electric heating terminal integrated with a photovoltaic thermal system has been designed to address issues of high building energy consumption and problems related to heating system freezing and leakage in the Tibetan Plateau (Qinghai-Xizang Plateau). Laboratory tests were conducted on six groups of samples with different structures and placements to examine their heat storage and release characteristics. Results indicate: The system\'s temperature stabilization time totals 14.6 h; Horizontally placing the terminal reduces melting time by up to 2.7 h, enhancing heat storage performance; Structure three shortens solidification time by up to 2.2 h compared to structure one, improving heat release performance; Vertically placed terminals have better heat release performance than horizontally placed ones, resulting in more effective indoor heating. This study proposes a modular design for phase change heat storage electric heating walls, simplifying installation and maintenance while maintaining aesthetic appeal. Detailed temperature measurements of different wall surfaces revealed excellent cyclic heat storage and release performance. The developed phase change heat storage electric heating terminal is expected to significantly reduce heating energy consumption in the Tibetan Plateau (Qinghai-Xizang Plateau), enhancing building energy efficiency and providing valuable insights for further applications of phase change materials in building design.',
            citation: 'Zhang, Menglong, Yanhong Zheng, Yufei He, Zhineng Jin, Yin Zhang, and Lijun Shi. "Novel modular PCM wall board for building heating energy efficiency: Material preparation, manufacture and dynamic thermal testing." Applied Thermal Engineering 256 (2024): 124168.'
        }
    },
    {
        match: 'Indoor Thermal Environment Evaluation for Emergency Medical Tents',
        title: 'Indoor Thermal Environment Evaluation for Emergency Medical Tents in Heating Season: Onsite Testing and Case Study in China',
        authors: 'Meng Han; Zhineng Jin; Ying Zhao; Yin Zhang; Wenyang Han; Menglong Zhang',
        firstAffiliation: 'School of Architecture, Southwest Minzu University, Chengdu 610225, China',
        journal: 'Atmosphere',
        year: '2024',
        cover: 'static/assets/img/journals/atmosphere.webp',
        en: {
            highlights: [
                'Uses the standard tent of the China International Medical Team as the test object.',
                'Arranges 11 temperature sensors to measure horizontal and vertical temperature distribution.',
                'Shows a 2500 W electric heater can raise the internal tent temperature to 16.7 C.',
                'Provides guidance for heater placement, medical equipment layout, and insulation material development.'
            ],
            abstract: 'In this study, the standard tent used by the China International Medical Team (Sichuan) was used as the research object to study the internal temperature change in medical tents in a low-temperature environment relying on heating equipment. Method: Four temperature sensors were arranged along the horizontal direction at a 1.2 m height in the medical tent, and more sensors were installed at heights of 0.1, 0.2, 0.6, 1.2, 1.8, 2.4, and 2.5 m. A total of 11 temperature sensors were set. Temperature tests were conducted in January and February 2021 in Chengdu, Sichuan Province. During the test, the running time of the heating equipment was controlled in real time according to the temperature change trend. A Kolmogorov-Smirnov(K-S) test was used to verify the reliability of the experimental data. The temperature change trend was used to characterize the influence of the heating and cooling equipment on the temperature change inside the tent. Results: Due to the position angle of the heating equipment and the influence of the external environment, the spatial distribution of the ambient temperature inside the medical tent was obviously uneven. In winter, an electric heater with a heating power of about 2500 W can increase the internal temperature of the tent to 16.7 C, significantly improving the internal thermal environment of the medical tent. The ambient temperature in the medical tent is positively correlated with the height and the installation position of the heating equipment. Conclusion: Medical tents can maintain the ambient temperature well to meet medical needs with the support of heating equipment with sufficient power. The temperature distribution law of medical tents in this experiment has good guiding significance for the placement angle of heating equipment and the configuration position of medical equipment and provides a reference for the development of thermal insulation materials for medical tents.',
            citation: 'Han, Meng, Zhineng Jin, Ying Zhao, Yin Zhang, Wenyang Han, and Menglong Zhang. "Indoor Thermal Environment Evaluation for Emergency Medical Tents in Heating Season: Onsite Testing and Case Study in China." Atmosphere 15, no. 3 (2024): 388.'
        },
        zh: {
            highlights: [
                '以中国国际医疗队标准帐篷为测试对象。',
                '布置 11 个温度传感器测量水平与垂直温度分布。',
                '显示 2500 W 电暖器可将帐篷内部温度提升至 16.7 C。',
                '为加热器摆放、医疗设备布置和保温材料开发提供依据。'
            ],
            abstract: 'In this study, the standard tent used by the China International Medical Team (Sichuan) was used as the research object to study the internal temperature change in medical tents in a low-temperature environment relying on heating equipment. Method: Four temperature sensors were arranged along the horizontal direction at a 1.2 m height in the medical tent, and more sensors were installed at heights of 0.1, 0.2, 0.6, 1.2, 1.8, 2.4, and 2.5 m. A total of 11 temperature sensors were set. Temperature tests were conducted in January and February 2021 in Chengdu, Sichuan Province. During the test, the running time of the heating equipment was controlled in real time according to the temperature change trend. A Kolmogorov-Smirnov(K-S) test was used to verify the reliability of the experimental data. The temperature change trend was used to characterize the influence of the heating and cooling equipment on the temperature change inside the tent. Results: Due to the position angle of the heating equipment and the influence of the external environment, the spatial distribution of the ambient temperature inside the medical tent was obviously uneven. In winter, an electric heater with a heating power of about 2500 W can increase the internal temperature of the tent to 16.7 C, significantly improving the internal thermal environment of the medical tent. The ambient temperature in the medical tent is positively correlated with the height and the installation position of the heating equipment. Conclusion: Medical tents can maintain the ambient temperature well to meet medical needs with the support of heating equipment with sufficient power. The temperature distribution law of medical tents in this experiment has good guiding significance for the placement angle of heating equipment and the configuration position of medical equipment and provides a reference for the development of thermal insulation materials for medical tents.',
            citation: 'Han, Meng, Zhineng Jin, Ying Zhao, Yin Zhang, Wenyang Han, and Menglong Zhang. "Indoor Thermal Environment Evaluation for Emergency Medical Tents in Heating Season: Onsite Testing and Case Study in China." Atmosphere 15, no. 3 (2024): 388.'
        }
    },
    {
        match: 'Building Energy Efficiency for Indoor Heating Temperature Set-Point',
        title: 'Building Energy Efficiency for Indoor Heating Temperature Set-Point: Mechanism and Case Study of Mid-Rise Apartment',
        authors: 'Xingyu Qi; Yin Zhang; Zhineng Jin',
        firstAffiliation: 'School of Public Administration, Southwest Minzu University, Chengdu 610225, China',
        journal: 'Buildings',
        year: '2023',
        cover: 'static/assets/img/journals/buildings.png',
        en: {
            highlights: [
                'Investigates lowering heating temperature set-point across eight globally typical cities.',
                'Separates savings into temperature-difference saving hours and behavioral saving hours.',
                'Shows meaningful energy-saving effects can occur even in relatively warm-winter cities.',
                'Provides a method for evaluating heating energy-saving potential and behavioral standards.'
            ],
            abstract: 'Space heating accounts for a large part of building energy consumption. Lowering the heating temperature set-point (Tsp) is expected to be a feasible approach for energy efficiency. In this paper, eight globally typical cities are selected, and the energy-saving mechanism and variation trends of lowering heating Tsp are investigated under different working conditions (climate conditions, construction completion year and inner heat sources). The results show that significant energy-saving effects even appear in the relatively warm-winter cities. The energy-saving mechanism is dominated by two different categories of heating hours including the temperature-difference saving (TDS) hours and the behavioral saving (BS) hours. The contribution of TDS and BS to the whole annual heating energy saving amount (HSA) depends on the reducing level of heating hours. The HSA of lowing Tsp is mainly affected by TDS influence. After coupling the consideration of different factors, with the decreasing annual HSA of buildings, the dominance of the TDS influence mechanism shrinks gradually while the annual heating energy saving ratio (HSR) increases. This work provides the analysis method for building heating energy saving potential evaluation and reference for the establishment of standards and residents\' behavioral energy saving in different climatic zones.',
            citation: 'Qi, Xingyu, Yin Zhang, and Zhineng Jin. "Building Energy Efficiency for Indoor Heating Temperature Set-Point: Mechanism and Case Study of Mid-Rise Apartment." Buildings 13, no. 5 (2023): 1189.'
        },
        zh: {
            highlights: [
                '在八个全球典型城市中研究降低采暖设定温度的影响。',
                '将节能机制拆分为温差节能时段和行为节能时段。',
                '表明相对暖冬城市中也可能出现显著节能效果。',
                '为采暖节能潜力评估和行为节能标准制定提供方法。'
            ],
            abstract: 'Space heating accounts for a large part of building energy consumption. Lowering the heating temperature set-point (Tsp) is expected to be a feasible approach for energy efficiency. In this paper, eight globally typical cities are selected, and the energy-saving mechanism and variation trends of lowering heating Tsp are investigated under different working conditions (climate conditions, construction completion year and inner heat sources). The results show that significant energy-saving effects even appear in the relatively warm-winter cities. The energy-saving mechanism is dominated by two different categories of heating hours including the temperature-difference saving (TDS) hours and the behavioral saving (BS) hours. The contribution of TDS and BS to the whole annual heating energy saving amount (HSA) depends on the reducing level of heating hours. The HSA of lowing Tsp is mainly affected by TDS influence. After coupling the consideration of different factors, with the decreasing annual HSA of buildings, the dominance of the TDS influence mechanism shrinks gradually while the annual heating energy saving ratio (HSR) increases. This work provides the analysis method for building heating energy saving potential evaluation and reference for the establishment of standards and residents\' behavioral energy saving in different climatic zones.',
            citation: 'Qi, Xingyu, Yin Zhang, and Zhineng Jin. "Building Energy Efficiency for Indoor Heating Temperature Set-Point: Mechanism and Case Study of Mid-Rise Apartment." Buildings 13, no. 5 (2023): 1189.'
        }
    },
    {
        match: 'Study on the Effect of Radiant Insulation Panel',
        title: 'Study on the Effect of Radiant Insulation Panel in Cavity on the Thermal Performance of Broken-Bridge Aluminum Window Frame',
        authors: 'Yanhong Zheng; Pengfei Si; Yin Zhang; Lijun Shi; Changjiajin Huang; Dongsheng Huang; Zhineng Jin',
        firstAffiliation: 'College of Architecture and Environment, Sichuan University, Chengdu 610065, China',
        journal: 'Buildings',
        year: '2022',
        cover: 'static/assets/img/journals/buildings.png',
        en: {
            highlights: [
                'Optimizes broken-bridge aluminum window frames by adding radiant insulation panels.',
                'Uses theoretical heat-transfer analysis and THERM finite element simulation.',
                'Compares radiant insulation panels, insulation filling, and low-emissivity surfaces.',
                'Shows radiant insulation panels can reduce frame U-factor by more than 7.43%.'
            ],
            abstract: 'Windows have a great impact on building energy consumption, and the thermal performance of window frames directly affects its energy-saving potential. In this paper, a novel method is proposed to optimize the thermal performance of commercially available broken-bridge aluminum window frames, by incorporating radiant insulation panels (RIPs) into the window frame cavity. A typical aluminum alloy window frame heat transfer model is theoretically analyzed and validated, and the effects of key design parameters on the equivalent thermal conductivity (ETC) of the cavity radiation heat transfer and the heat transfer coefficient (U-factor) of window frames are quantitatively analyzed by a finite element simulation method using the THERM software. Moreover, the RIP, the insulation material filling, and low surface emissivity on the thermal performance of the window frame are compared and analyzed. The results show that the RIP is better placed in the middle, the width and quantity of RIPs are negatively correlated with the U-factor, while the surface emissivity of RIPs is positively correlated with the U-factor. Adding RIPs in the cavity can reduce the U-factor of the window frame by more than 7.43%, slightly lower than 8.97% for the filling type, but significantly higher than 0.81% for the low-emissivity type. Inserting RIPs is a simple and effective way to reduce the U-factor of the window frame and have a great potential of use.',
            citation: 'Zheng, Yanhong, Pengfei Si, Yin Zhang, Lijun Shi, Changjiajin Huang, Dongsheng Huang, and Zhineng Jin. "Study on the Effect of Radiant Insulation Panel in Cavity on the Thermal Performance of Broken-Bridge Aluminum Window Frame." Buildings 13, no. 1 (2022): 58.'
        },
        zh: {
            highlights: [
                '通过加入辐射隔热板优化断桥铝窗框热工性能。',
                '结合理论传热分析和 THERM 有限元模拟。',
                '比较辐射隔热板、保温材料填充和低发射率表面的效果。',
                '表明辐射隔热板可使窗框 U 值降低超过 7.43%。'
            ],
            abstract: 'Windows have a great impact on building energy consumption, and the thermal performance of window frames directly affects its energy-saving potential. In this paper, a novel method is proposed to optimize the thermal performance of commercially available broken-bridge aluminum window frames, by incorporating radiant insulation panels (RIPs) into the window frame cavity. A typical aluminum alloy window frame heat transfer model is theoretically analyzed and validated, and the effects of key design parameters on the equivalent thermal conductivity (ETC) of the cavity radiation heat transfer and the heat transfer coefficient (U-factor) of window frames are quantitatively analyzed by a finite element simulation method using the THERM software. Moreover, the RIP, the insulation material filling, and low surface emissivity on the thermal performance of the window frame are compared and analyzed. The results show that the RIP is better placed in the middle, the width and quantity of RIPs are negatively correlated with the U-factor, while the surface emissivity of RIPs is positively correlated with the U-factor. Adding RIPs in the cavity can reduce the U-factor of the window frame by more than 7.43%, slightly lower than 8.97% for the filling type, but significantly higher than 0.81% for the low-emissivity type. Inserting RIPs is a simple and effective way to reduce the U-factor of the window frame and have a great potential of use.',
            citation: 'Zheng, Yanhong, Pengfei Si, Yin Zhang, Lijun Shi, Changjiajin Huang, Dongsheng Huang, and Zhineng Jin. "Study on the Effect of Radiant Insulation Panel in Cavity on the Thermal Performance of Broken-Bridge Aluminum Window Frame." Buildings 13, no. 1 (2022): 58.'
        }
    }
];

function getLang() {
    return currentLang === 'zh' ? 'zh' : 'en';
}

function toIdKey(id) {
    return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function setConfigValue(key, value) {
    if (key.endsWith('-href')) {
        const target = document.getElementById(key.replace(/-href$/, ''));
        const href = typeof value === 'string' && value.startsWith('static/') ? `/${value}` : value;
        if (target) target.setAttribute('href', href);
        return;
    }

    const target = document.getElementById(key);
    if (!target) return;

    if (key === 'title') document.title = value;
    target.innerHTML = value;
}

function setTextById(id, value) {
    const target = document.getElementById(id);
    if (target) target.textContent = value;
}

function applyStaticTranslations() {
    const lang = getLang();
    const copy = i18n[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    Object.keys(copy).forEach((key) => {
        if (typeof copy[key] === 'string') {
            const id = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
            setTextById(id, copy[key]);
        }
    });

    setTextById('nav-home', copy.navHome);
    setTextById('nav-research', copy.navResearch);
    setTextById('nav-publications', copy.navPublications);
    setTextById('nav-news', copy.navNews);
    setTextById('nav-awards', copy.navAwards);
    setTextById('nav-cv', copy.navCv);
    setTextById('language-gateway-copy', copy.languageGatewayCopy);
    document.title = copy.pageTitles[currentPage] || copy.title;

    document.querySelectorAll('.lang-toggle').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.setLang === lang);
    });
}

function decorateExternalLinks(section) {
    section.querySelectorAll('a[href^="http"]').forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

function decorateListItems(section, className) {
    section.querySelectorAll(':scope > ul > li, :scope > ol > li').forEach((item, index) => {
        item.classList.add(className, 'spotlight-card');
        item.style.setProperty('--reveal-delay', `${Math.min(index * 55, 420)}ms`);
    });
}

function cleanText(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function getPublicationMeta(text) {
    return publicationRecords.find((item) => text.includes(item.match));
}

function getPublicationLabels() {
    return getLang() === 'zh'
        ? {
            authors: '作者',
            highlights: '亮点',
            abstract: '摘要',
            citation: '推荐引用',
        }
        : {
            authors: 'Authors',
            highlights: 'Highlights',
            abstract: 'Abstract',
            citation: 'Recommended citation',
        };
}

function renderPublicationPanel(label, content, options = {}) {
    const open = options.open ? ' open' : '';
    const body = options.html
        ? content
        : Array.isArray(content)
        ? `<ul class="publication-highlights">${content.map((item) => `<li>${item}</li>`).join('')}</ul>`
        : `<p>${content}</p>`;

    return `
        <details class="publication-panel"${open}>
            <summary><span>${label}</span><i class="bi-plus"></i></summary>
            <div class="publication-panel__content">${body}</div>
        </details>
    `;
}

function formatPublicationAuthors(meta, fallbackText) {
    const rawAuthors = meta ? meta.authors : fallbackText.replace(/\s+".*$/, '');
    const authorNames = rawAuthors.split(';').map((name) => cleanText(name)).filter(Boolean);
    const authorLine = authorNames.map((name, index) => {
        const isSelf = /^(Jin,\s*Zhineng|Zhineng\s+Jin)$/i.test(name);
        const displayName = isSelf ? `<strong class="self-author">${name}</strong>` : name;
        return `${displayName}${index === 0 && meta && meta.firstAffiliation ? '<sup>a</sup>' : ''}`;
    }).join(', ');
    const affiliation = meta && meta.firstAffiliation
        ? `<span class="publication-affiliation"><strong>a</strong> ${meta.firstAffiliation}</span>`
        : '';

    return `<div class="publication-authors">${authorLine}</div>${affiliation}`;
}

function createPublicationDetail(meta, fallbackText) {
    const labels = getPublicationLabels();
    const localized = meta ? meta[getLang()] : null;
    const highlights = localized && localized.highlights ? localized.highlights : [
        getLang() === 'zh' ? '与建筑能源、热环境或公共空间运行相关。' : 'Related to building energy, thermal environment, or public-space operation.',
        getLang() === 'zh' ? '保留原始论文信息和 DOI 链接。' : 'Keeps the original publication record and DOI link.',
        getLang() === 'zh' ? '可用于进一步阅读和引用。' : 'Supports further reading and citation.',
        getLang() === 'zh' ? '后续可继续补充完整论文信息。' : 'Can be expanded with complete paper metadata later.'
    ];
    const abstract = localized ? localized.abstract : (getLang() === 'zh' ? '该条目保留原始论文信息，并提供 DOI 或论文链接以便进一步阅读。' : 'This entry keeps the original publication record and provides a DOI or paper link for further reading.');
    const citation = localized ? localized.citation : fallbackText;
    const authors = formatPublicationAuthors(meta, fallbackText);

    return `
        <div class="publication-panels">
            ${renderPublicationPanel(labels.authors, authors, { open: true, html: true })}
            ${renderPublicationPanel(labels.highlights, highlights)}
            ${renderPublicationPanel(labels.abstract, abstract)}
            ${renderPublicationPanel(labels.citation, citation)}
        </div>
    `;
}

function enhancePublications(section) {
    section.querySelectorAll('li.publication-item').forEach((item) => {
        const originalHtml = item.innerHTML;
        const originalText = cleanText(item.textContent);
        const meta = getPublicationMeta(originalText);
        const strongs = Array.from(item.querySelectorAll('strong')).map((node) => cleanText(node.textContent));
        const journal = meta ? meta.journal : strongs[stringsLastIndex(strongs)] || 'Publication';
        const yearMatch = originalText.match(/\b(2026|2025|2024|2023|2022)\b/);
        const year = meta ? meta.year : (yearMatch ? yearMatch[1] : 'Paper');
        const title = meta ? meta.title : originalText.replace(/^.*?"([^"]+)".*$/, '$1');
        const paperLink = item.querySelector('a[href]')?.outerHTML || '';
        const journalInitials = journal.split(/\s+/).slice(0, 3).map((word) => word[0]).join('');
        const coverSrc = meta && meta.cover
            ? (meta.cover.startsWith('/') ? meta.cover : `/${meta.cover}`)
            : '';
        const coverContent = coverSrc
            ? `<img src="${coverSrc}" alt="${journal} cover" />`
            : `<span>${journalInitials}</span><strong>${year}</strong>`;
        const coverClasses = [
            'publication-cover',
            meta && meta.cover ? 'publication-cover--image' : '',
            meta && meta.cover && meta.cover.includes('/conferences/') ? 'publication-cover--landscape' : ''
        ].filter(Boolean).join(' ');

        item.classList.add('publication-card');
        item.innerHTML = `
            <div class="publication-card__top">
                <div class="publication-card__copy">
                    <div class="publication-journal">${journal} · ${year}</div>
                    <h3>${title}</h3>
                    <div class="publication-original">${paperLink}</div>
                </div>
                <div class="${coverClasses}">
                    ${coverContent}
                </div>
            </div>
            <div class="publication-record">
                ${createPublicationDetail(meta, originalText)}
            </div>
        `;
    });
}

function stringsLastIndex(values) {
    return values.length > 1 ? values.length - 1 : 0;
}

function decorateMarkdownSection(name) {
    const section = document.getElementById(`${name}-md`);
    if (!section) return;

    decorateExternalLinks(section);

    if (name === 'publications') {
        decorateListItems(section, 'publication-item');
        enhancePublications(section);
    }

    if (name === 'awards') decorateListItems(section, 'award-item');
    if (name === 'research') decorateListItems(section, 'research-item');
    if (name === 'news') decorateListItems(section, 'news-item');
}

function markdownHasMath(markdown) {
    return /(^|[^\\])\$\$|\\\[|\\\(|(^|[^\\])\$[^$\n]+\$/m.test(markdown);
}

function ensureMathJaxLoaded() {
    if (window.MathJax && MathJax.typesetPromise) return Promise.resolve();
    if (document.getElementById('MathJax-script')) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'MathJax-script';
        script.async = true;
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function typesetMath(markdown) {
    if (!markdownHasMath(markdown)) return;
    await ensureMathJaxLoaded();
    if (window.MathJax && MathJax.typesetPromise) await MathJax.typesetPromise();
}

async function loadConfig() {
    const response = await fetch(contentDir + configFile);
    if (!response.ok) throw new Error(`Cannot load ${configFile}: ${response.status}`);

    const text = await response.text();
    const yml = jsyaml.load(text);
    Object.keys(yml).forEach((key) => setConfigValue(key, yml[key]));
}

async function fetchMarkdown(name) {
    const lang = getLang();
    const localized = lang === 'zh' ? `${contentDir}${name}.zh.md` : `${contentDir}${name}.md`;
    const fallback = `${contentDir}${name}.md`;
    let response = await fetch(localized);

    if (!response.ok && localized !== fallback) response = await fetch(fallback);
    if (!response.ok) throw new Error(`Cannot load ${name}.md: ${response.status}`);

    return response.text();
}

async function loadMarkdown(name) {
    const target = document.getElementById(`${name}-md`);
    if (!target) return;

    const markdown = await fetchMarkdown(name);
    target.innerHTML = marked.parse(markdown);
    decorateMarkdownSection(name);
    setupSpotlightCards(target);
    setupReveals(target);
    await typesetMath(markdown);
}

async function loadPageMarkdown() {
    const names = pageSectionMap[currentPage] || [];
    await Promise.all(names.map(async (name) => {
        try {
            await loadMarkdown(name);
        } catch (error) {
            const target = document.getElementById(`${name}-md`);
            if (target) {
                target.innerHTML = `<p class="content-error">${getLang() === 'zh' ? '内容暂时无法加载，请稍后重试。' : 'This content could not be loaded. Please try again later.'}</p>`;
            }
        }
    }));
}

function formatDate(value) {
    if (!value) return '--';
    const date = new Date(value);
    return date.toLocaleDateString(getLang() === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatRefreshTime(value) {
    return value.toLocaleTimeString(getLang() === 'zh' ? 'zh-CN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function refreshContributionChart() {
    const chart = document.getElementById('github-contribution-chart');
    if (!chart) return;

    const refreshedAt = new Date();
    const base = chart.dataset.chartBase || `https://ghchart.rshah.org/007f7a/${githubUser}`;
    const url = new URL(base, window.location.href);
    url.searchParams.set('refresh', String(refreshedAt.getTime()));
    chart.src = url.toString();
    chart.alt = getLang() === 'zh'
        ? `${githubUser} 的 GitHub 贡献热力图，刷新于 ${formatRefreshTime(refreshedAt)}`
        : `GitHub contribution chart for ${githubUser}, refreshed at ${formatRefreshTime(refreshedAt)}`;

    const badge = document.getElementById('github-live-badge');
    if (badge) {
        badge.textContent = `${i18n[getLang()].githubLiveBadge} · ${formatRefreshTime(refreshedAt)}`;
        badge.title = getLang() === 'zh'
            ? '贡献图已绕过浏览器缓存重新请求'
            : 'Contribution chart re-requested with cache busting';
    }
}

function setupContributionRefresh() {
    refreshContributionChart();
    if (!contributionRefreshTimer) {
        contributionRefreshTimer = window.setInterval(refreshContributionChart, contributionRefreshMs);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) refreshContributionChart();
        });
    }
}

function renderGithubStats(user) {
    const labels = i18n[getLang()];
    const stats = [
        [labels.statsRepos, user.public_repos],
        [labels.statsFollowers, user.followers],
        [labels.statsUpdated, formatDate(user.updated_at)]
    ];

    document.getElementById('github-stats').innerHTML = stats.map(([label, value]) => `
        <div class="github-stat spotlight-card">
            <span>${label}</span>
            <strong>${value}</strong>
        </div>
    `).join('');
}

function renderRepos(repos) {
    const visibleRepos = repos
        .filter((repo) => !repo.fork)
        .slice(0, 4);

    document.getElementById('repo-list').innerHTML = visibleRepos.map((repo) => `
        <a class="repo-card spotlight-card" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            <span>${repo.language || 'Repo'}</span>
            <strong>${repo.name}</strong>
            <p>${repo.description || (getLang() === 'zh' ? '近期更新的公开仓库。' : 'Recently updated public repository.')}</p>
            <small>${formatDate(repo.updated_at)} · ★ ${repo.stargazers_count}</small>
        </a>
    `).join('');
}

async function loadGithubActivity() {
    setupContributionRefresh();

    try {
        const [userResponse, repoResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${githubUser}`),
            fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=8`)
        ]);

        if (!userResponse.ok || !repoResponse.ok) throw new Error('GitHub API response failed');
        renderGithubStats(await userResponse.json());
        renderRepos(await repoResponse.json());
    } catch (error) {
        console.log(error);
        document.getElementById('repo-list').innerHTML = `
            <a class="repo-card spotlight-card" href="https://github.com/${githubUser}" target="_blank" rel="noopener noreferrer">
                <strong>github.com/${githubUser}</strong>
                <p>${i18n[getLang()].repoFallback}</p>
            </a>
        `;
    }

    setupSpotlightCards(document);
    setupReveals(document);
}

function setupSpotlightCards(scope) {
    scope.querySelectorAll('.spotlight-card').forEach((card) => {
        if (card.dataset.spotlightReady) return;
        card.dataset.spotlightReady = 'true';
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
            card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
        });
    });
}

function setupReveals(scope) {
    const targets = scope.querySelectorAll ? scope.querySelectorAll('.content-section, .publication-item, .news-item, .research-item, .award-item, .repo-card, .github-stat') : [];

    if (!('IntersectionObserver' in window)) {
        targets.forEach((target) => target.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach((target) => observer.observe(target));
}

async function setLanguage(lang) {
    currentLang = lang === 'zh' ? 'zh' : 'en';
    localStorage.setItem('site-language', currentLang);
    document.getElementById('language-gateway')?.classList.add('is-hidden');
    applyStaticTranslations();
    await loadPageMarkdown();
    window.dispatchEvent(new CustomEvent('site-language-change', { detail: { lang: currentLang } }));
}

function setupLanguageControls() {
    document.querySelectorAll('[data-set-lang]').forEach((button) => {
        button.addEventListener('click', () => setLanguage(button.dataset.setLang));
    });

    if (!currentLang) {
        document.getElementById('language-gateway')?.classList.remove('is-hidden');
        currentLang = 'en';
    } else {
        document.getElementById('language-gateway')?.classList.add('is-hidden');
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = Array.from(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.forEach((responsiveNavItem) => {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    marked.use({ mangle: false, headerIds: false });
    setupLanguageControls();
    await loadConfig().catch((error) => console.log(error));
    applyStaticTranslations();
    await loadPageMarkdown();
    setupSpotlightCards(document);
    setupReveals(document);
    window.dispatchEvent(new CustomEvent('site-language-change', { detail: { lang: currentLang } }));
});
