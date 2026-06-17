---
title: Murugan Lab Research
year: 2025
summary: A bioinformatics analysis tool that processes FASTQ or raw sequence data and reports mutation positions, types, counts, alignment quality, and statistical summaries.
tags: [Python, Bioinformatics, Sequence Analysis, Research]
project_url: https://github.com/Jiang6082/Murugan-Lab-Research
image: /assets/images/projects/murugan-lab/mutation-analysis.svg
image_alt: Scientific dashboard showing a sequence alignment and mutation distributions
metrics:
  - label: Inputs
    value: FASTQ / SEQ / text
  - label: Analysis
    value: Alignment + QC
  - label: Outputs
    value: Plots + summary
---

Developed for research in the Murugan Lab, this Python tool turns sequencing reads into interpretable mutation summaries. It accepts FASTQ files, plain sequence snippets, and `.seq` files, then produces mutation-position, mutation-type, mutation-count, and Poisson plots alongside a concise text report.

## Handling ambiguous reads

The analysis can inspect reverse complements when a read exceeds a configurable mutation threshold. Its `try`, `record`, and `filter` modes let a researcher rescue plausible reverse-oriented reads, retain only high-mutation observations for review, or remove them from the final output.

<div class="process-flow science-flow" aria-label="Sequence analysis pipeline">
  <span>Sequence reads</span><b>&rarr;</b><span>Alignment + identity check</span><b>&rarr;</b><span>Mutation classification</span><b>&rarr;</b><span>Plots + statistics</span>
</div>

## Quality-aware analysis

Later iterations introduced a percent-identity threshold so mutation calls are only counted when the underlying alignment is credible. The reverse-complement path was also tightened: a transformed read is accepted only if it falls below the mutation threshold; otherwise it is filtered rather than adding noisy counts.

## Research-facing outputs

The plotting workflow limits extreme positional counts using a configurable percentile, adds a Poisson view of mutation frequencies, and writes a summary text file for quick interpretation. The result bridges raw sequencing files and the figures a researcher needs to inspect experimental patterns.

