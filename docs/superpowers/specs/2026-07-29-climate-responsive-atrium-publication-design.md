# Climate-Responsive Atrium Publication Update Design

## Goal

Publish the accepted bibliographic record and a dedicated editorial introduction for “Climate-responsive atrium geometry in large public buildings: meta-sample modelling and robust energy-saving ranges across five climates” across the existing Publications, Research, and News pages in both English and Chinese.

## Confirmed Direction

- Use the existing editorial research-story pattern selected as option A.
- Do not add a new route or framework.
- Preserve the Markdown-driven static GitHub Pages architecture.
- Place the new paper first among published journal papers and first among the Research and News feature cards.
- Keep the related 2025 *Energy* meta-sampling paper as a separate story because the new paper contributes a distinct multi-climate robustness analysis.

## Source of Truth

The local author copy at `E:\GITHUB\PERSONAL_INFORMATION\paper\Climate-responsive atrium geometry in large public buildings meta-sample modelling and robust energy-saving ranges across five climates.pdf` supplies the publication metadata, abstract, findings, design ranges, limitations, and figures.

The final citation is:

> Jin, Zhineng, Hongli Sun*, Junkang Song, Wenke Zhong, Zishuang Xia, Hanjie Zheng, Changqi Wen, Bin Xu, and Borong Lin. “Climate-responsive atrium geometry in large public buildings: meta-sample modelling and robust energy-saving ranges across five climates.” *Energy & Buildings* 369 (2026): 117980. https://doi.org/10.1016/j.enbuild.2026.117980

## Publications

Remove the former submitted record and its obsolete working title. Add the final citation as the first item under Published in `contents/publications.md` and `contents/publications.zh.md`. Link the Paper action to the DOI.

If the submitted section becomes empty, remove its heading so the page does not show an empty status group.

## Research Story

Add a new first `research-story` to both Research content files.

- Metadata: climate-responsive design, *Energy & Buildings*, 2026.
- Editorial title: “Robust atrium geometry across five climates” and a natural Chinese equivalent.
- Lead: explain that a measurement-informed benchmark, 39,202 simulated configurations per climate, and distribution-preserving meta-sampling produce practical early-stage design ranges.
- Evidence: five climates; 75% lower simulation demand; the robust 240–360 m² atrium-area range.
- Expanded method: calibrated benchmark, EnergyPlus across Guangzhou, Chengdu, Guiyang, Tianjin, and Harbin, plus meta-sample and Sobol’ sensitivity analysis.
- Expanded result: atrium area, external facade exposure, and east-facing openings form the climate-robust control triad.
- Expanded design guidance: one to three atria and 500–1500 m² external atrium facade area, with local recalibration before project-level use.
- Link: final DOI.

The research card uses a web-optimized crop of Figure 1, which communicates the parametric model library and five-climate workflow. It will be stored at `static/assets/img/research/climate-responsive-atrium-five-climates.png` with descriptive alt text and a source caption.

## News Story

Add a new first `news-feature` to both News content files.

- Metadata: July 2026, *Energy & Buildings*, publication.
- Headline: emphasize turning five climates into robust atrium design ranges.
- Lead: state the paper’s practical contribution rather than repeat the title.
- Key result: the 240–360 m², one-to-three-atrium, 500–1500 m² external-facade design window.
- Expanded copy: summarize the 39,202-configuration library, 75% simulation reduction, sensitivity triad, and typology-level limitation.
- Reuse the same Figure 1 crop and DOI.

Add a July 2026 publication milestone at the top of the existing academic timeline.

## Rendering and Accessibility

No new CSS is required unless browser validation reveals a layout defect. The existing `research-story`, `news-feature`, `evidence-list`, `story-details`, and figure classes supply responsive behavior and keyboard-accessible progressive disclosure.

English and Chinese receive equivalent information, not literal word-for-word duplication. Image alt text will describe the workflow and five climate cities. The Figure 1 caption will identify the source as Jin et al., *Energy & Buildings* 369 (2026), 117980.

## Verification and Delivery

- Update structure tests from four to five Research stories and from three to four News features.
- Assert the new DOI, image path, and publication metadata in both languages.
- Run the Node test suite.
- Serve the site locally and inspect Publications, Research, and News at desktop and mobile widths in English and Chinese.
- Confirm the DOI link and image load successfully and check the browser console for errors.
- Commit the implementation to `main` and push it to `origin/main`, allowing GitHub Pages to publish the update.

