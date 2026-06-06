# SOP — Test Strategy Template (Layer 1)

> Parent tool: `tools/testStrategy.js` (`SCHEMA_HINT`, `DEFAULT_*`, `renderMarkdown`).
> Source of truth for sections: `TEST_STRATEGY_TEMPLATE.md` (this folder) /
> `qa-brain/qa-skills/TEST_STRATEGY_TEMPLATE.md`.

## The 21 sections (schema key → render style)
1. **Document Control** — `documentControl` (key/value table) + `revisionHistory[]` (table)
2. **Introduction / Background** — `introduction{featureSummary, requirementSource, whyItMatters}`
3. **Objective** — `objective` (prose)
4. **Scope** — `scope{inScope[], outOfScope[]}`
5. **Test Levels & Types** — `testLevels[]` (level + description)
6. **Focus Areas / Quality Attributes** — `focusAreas[]`
7. **Test Approach** — `testApproach[]`
8. **Test Environment(s)** — `testEnvironments[]` (table)
9. **Test Data Management** — `testDataManagement[]`
10. **Tools & Technology** — `tools[]` (category/tool table)
11. **Roles & Responsibilities** — `roles{teamSize, durationMonths, entries[]}` (table)
12. **Schedule & Milestones** — `schedule{items[], milestones[], buffer, estimationBasis}`
13. **Deliverables** — `deliverables[]`
14. **Entry, Exit, Suspension & Resumption Criteria** — `criteria{entry[], exit[], suspension[], resumption[]}`
15. **Defect Management** — `defectManagement{lifecycle, severity[], priority[], triageCadence, sla, tracker}`
16. **Test Metrics & KPIs** — `metrics[]`
17. **Risks & Mitigation** — `risks[]` (risk/likelihood/impact/mitigation/owner table)
18. **Assumptions & Dependencies** — `assumptionsDependencies{assumptions[], dependencies[]}`
19. **Communication & Reporting** — `communication[]`
20. **Domain-Specific Considerations** — `domainConsiderations[]`
21. **Approval & Sign-off** — `approvals[]` (role/name/signature/date table)

## Rules
- Keep `SCHEMA_HINT`, `generateStrategy` normalization, `renderMarkdown`, and
  `src/components/TestStrategyView.jsx` in **lockstep** — a key added in one must be added in all.
- Governance sections default to standard QA values (`DEFAULT_*`); feature-specific blanks → `TBD`.
- If the template changes (sections added/removed/reordered), update this SOP first, then the four
  lockstep locations above.
