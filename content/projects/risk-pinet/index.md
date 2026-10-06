---
title: "RISK-PiNET"
description: "A GIS-based risk assessment modelling tool for water distribution systems, helping identify and prioritise infrastructure vulnerabilities."
date: 2021-06-01
image: "/assets/images/risk-pinet-qgis"
tags: ["GIS Risk Modelling", "QGIS", "Water Infrastructure", "Decision Support"]
featured: true
official_url: "https://riskpinet.wordpress.com/"
documentary_url: "https://www.youtube.com/watch?v=_wOkgtaXMxM&t=7s"
github_url: ""
live_url: ""
project_status: "Completed"
---

## The Question

Water distribution networks fail in places that are hard to predict from pipe age or material alone — vulnerability and contamination risk depend on where a pipe sits in the network, what's around it, and how a failure there would ripple outward. RISK-PiNET asked: can a GIS-based decision support tool rank pipe segments by combined vulnerability and contamination hazard, so utilities can prioritise inspection and replacement with limited budgets?

## Context

Developed during my time as a Project Associate at the **National Environmental Engineering and Research Institute (NEERI)**, a CSIR laboratory, as part of a project team working on environmentally sustainable infrastructure solutions.

## Approach

RISK-PiNET combines spatial infrastructure data — pipe network geometry, material, and age — with contextual risk layers into a single, map-based vulnerability and contamination-hazard score per pipe segment. The workflow was delivered as a **QGIS-based application**, structured as a sequence of assessment modules (Utility, Pipe Condition Assessment, Sewer Hazard, Drain Hazard, Cluster, General Conditions, Risk, and Cost) that walk a user from raw spatial inputs through to a prioritised, map-first risk output — rather than a static spreadsheet ranking.

## My Role

I contributed to the GIS-based risk assessment workflow within the project team, working on the spatial analysis and QGIS application layer that turned the underlying vulnerability and contamination-hazard framework into a usable, map-based decision support tool.

{{< project-figure src="/assets/images/risk-pinet-qgis" alt="RISK-PiNET QGIS application showing the Input tab's data-availability checklist, with Utility, Pipe Condition Assessment, Sewer Hazard, Drain Hazard, Cluster, General Conditions, Risk, and Cost module tabs across the top" caption="RISK-PiNET QGIS application — the interface through which the geospatial assessment workflow was operationalized." size="small" >}}

## Outcome / Impact

The work was later formalised and submitted as a peer-reviewed preprint, **"Integrated Risk Assessment of Water Distribution Systems: A Decision Support Framework for Pipe Vulnerability and Contamination Hazard"** (Sharma, Lodhi, **Purohit**, Mopati, Patil, Nasim & Sargaonkar, 2026), currently under journal review on Research Square.

*Source code and detailed implementation materials cannot be shared due to organisational confidentiality requirements.*

## Links

- [Read the preprint on Research Square →](https://doi.org/10.21203/rs.3.rs-8786519/v1)
