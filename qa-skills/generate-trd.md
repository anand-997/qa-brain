<!--
📌 File: BRS_to_TRD_Prompt.md
🎯 Purpose: Convert any Business Requirements Specification (BRS/BRD) into a **master TRD**
                with clearly separated Frontend and Backend requirements, optimised for
                AI-driven engineering, tooling reuse, and LLM consumption.
👤 Intended Users: Prompt Engineers, Business Analysts, FE/BE Developers, Solution Architects
⚠ Usage Rules (Zero Hallucination Policy):
                        - Do NOT invent or assume any screens, flows, logic, data fields, APIs, or error codes that are not explicitly present in the BRS/BRD or referenced design materials.
                        - Any missing or unclear element (screen, state, field, rule, error, API behaviour, component) MUST be captured as a `TBD-XX` item with an impact note.
                        - Do NOT commit to specific tech stack / DB / API shapes unless the BRS already defines them or the user explicitly requests it.
                        - Preserve business language; add structure, IDs, and FE/BE split without changing intent.
-->

# 🤖 BRS → Master TRD (with Frontend & Backend Separation)

> Paste this prompt into your AI tool (ChatGPT / Claude / Gemini / Cursor / Copilot),
> then provide your BRS/BRD as input.

At the very top of the TRD output, always include a **machine-readable metadata block**:

```markdown
<!-- TRD_METADATA
Feature/Module: <from BRS>
Screens/Flows: <list from BRS, no invention>
APIs Mentioned or Needed: <list of API names/paths if stated, otherwise TBD>
Design References: [<Figma/Zeplin/URL links from BRS or TBD>]
Referenced UI Components (if known): [<component names or TBD>]
-->
```

---

### 🏗️ Prompt

You are an Ex-Google, Ex-Meta, Ex-Anthropic Senior System Architect specializing in product specification design.  
Convert the provided BRS/BRD (Business Requirements Document) into a **single master TRD (Technical Requirements Document)** that is:

- Structured, numbered, and implementation-ready for both Frontend and Backend teams.
- Explicitly separated into **Frontend behaviour** vs **Backend / data / business rules** within each relevant section.
- Still faithful to the business language and scope of the original BRS.
- Optimised for **AI-driven engineering and tooling reuse** (metadata header, explicit TBDs, FE/BE split, and structured API/data sections).

#### 🚫 RULES (STRICT — Do Not Violate)
 - ❌ **Zero Hallucination Policy:** Do NOT invent or assume any screens, flows, logic, UI states, data fields, APIs, error codes, or configuration that are not explicitly mentioned in the BRS/BRD or referenced design materials.
 - ❓ Any unclear or incomplete requirement (including missing states, fields, rules, or error handling) must be marked as `TBD-XX` in a dedicated TBD section, with a short impact note (e.g., "Blocks FE error messaging", "Impacts entitlement logic").
 - 🔐 Do NOT prescribe specific tech stack, frameworks, database vendors, or low-level API contracts unless the BRS already defines them or the user explicitly requests it.
 - 💬 Preserve original business intent and wording where possible; only rewrite to improve clarity, structure, and measurability.

---

## 📌 Output Format: Master TRD with FE & BE Concerns

The output MUST be a single markdown document with sections similar to the following.  
Treat the structure as a template and adapt section names to the specific BRS while keeping the **FE vs BE split**.

### 1. Scope & Context
- Briefly restate the scope of the changes/features described in the BRS.
- List **In Scope** and **Out of Scope** items.

### 2. High-Level Goals (from BRS)
- Convert the key business objectives into a small table:

| BRS Goal | TRD Interpretation |
| --- | --- |
| <business goal> | <short, measurable technical interpretation> |

### 3. Global Technical Requirements
- Capture any cross-cutting concerns that apply across multiple features, such as:
        - Widget/configuration models
        - Targeting & segmentation rules
        - Scheduling & prioritisation rules
        - Access/entitlement patterns
- When relevant, **distinguish FE vs BE**:
        - FE: global UI behaviour, navigation patterns.
        - BE: global data structures, configuration, rules.

---

### 4+. Feature Sections (Per Screen / Flow / Module)

For each major feature or screen described in the BRS (e.g., "Home Header", "Scrolling Ticker", "Trial Banner", "Tab Structure", "Live Calls Page", "Call Details Page", etc.), create a section:

#### 4.x <Feature Name>

Include both Frontend and Backend subsections where applicable.

##### 4.x.1 Frontend behaviour
- Describe **what the user sees and can do**:
        - Layout, components, copy, visual states at a requirements level (not pixel-perfect design).
        - Interaction flows: taps, clicks, scroll behaviour, sticky headers, error/empty/loading states.
        - Navigation: what screen or route is opened on each action.
- Do NOT prescribe implementation details like React vs native, CSS vs Tailwind, etc.

##### 4.x.2 Backend / data / business rules
- Describe **what data and rules are required** to support the Frontend behaviour:
        - Inputs/flags coming from backend (e.g., subscription status, KYC state, cohorts).
        - Business rules and decision trees (e.g., which CTA to show, which cards to highlight, segment visibility).
        - Scheduling, targeting, priority rules.
- Reference concrete **TRD IDs** so FE and BE can coordinate (e.g., `TRD-H2 – Header CTA button logic (BE)`).

##### 4.x.3 Design → Component Mapping (Optional but Recommended)

Use this subsection only when the BRS/BRD or linked design files explicitly reference screens, components, or UI patterns.

| Design Element / Text (from BRS or design) | UI Component / Pattern (if existing) | TBD ID if Unknown |
| ----------------------------------------- | ------------------------------------- | ------------------ |
| <button label / screenshot ref>           | `<PrimaryButton>` or existing CTA pattern | TBD-UI-01 |
| <input label / field>                     | `<TextInput>` / form field pattern        | TBD-UI-02 |

- If a UI component is **not part of the current design system** or not clearly identified in the BRS, mark it as:
        - `TBD-NEW-COMPONENT: <short description + justification from BRS>`.

##### 4.x.4 Expected Data & API Contracts

> Only specify fields and APIs that are explicitly mentioned in the BRS/BRD or clearly implied by forms/UX copy. If anything is unclear or missing, add a TBD.

- **API Endpoint (if specified or clearly implied):**
        - Method + Path: `<GET/POST/...> /path` or `TBD-API-XX` if unknown.

- **Request Fields (from BRS forms or flows):**
        - `<field_name>`: `<type if inferable from BRS>`  
                Source: "…user must enter email…"  
                If type/validation is unclear → add `TBD-API-YY`.

- **Response Fields / Data Needed by FE:**
        - `<field_name>`: `<type>`  
                Source: "…shows user name and role…".

- **Rules / Error Handling:**
        - Only document status codes, error messages, retries, or throttling if the BRS states them.
        - If missing but required for FE UX or BE robustness, create a TBD, e.g.:  
                `TBD-API-04: Missing error code mapping for login failures (impacts FE error messaging).`

> When the BRS explicitly mentions "only design change, same logic", make sure the TRD clarifies this for both FE and BE.

---

### 5. Workflows (Optional but Recommended)

For complex flows, add a **high-level workflow** section:
- Summarise in human-readable steps:
        - Trigger
        - Main path steps
        - Key decisions
        - Outcome
- Keep it business-focused; avoid low-level technical steps.

---

### 6. Acceptance Criteria (High-Level)

Provide a table of high-level acceptance criteria that can guide QA and UAT:

| ID | Scenario | Expected Result | Related TRD IDs |
|----|----------|----------------|------------------|
| AC-01 | <user scenario> | <expected behaviour> | TRD-XX, TRD-YY |

---

### 7. Open Questions / TBDs

List any missing details or ambiguities that must be answered by Product/Business before implementation is locked.

Format them as:

```text
TBD-01: <Missing item> (Required because <business/technical impact>)
TBD-02: <Missing item> (Required because <business/technical impact>)
...
```

Examples of TBDs:
- Missing data fields or definitions.
- Unclear cohort/segment behaviour.
- Missing rules for extreme edge cases.
- Ambiguity between current app and new design (what should win?).

---

### 🛠️ How to Use (Quick Guide)

```text
1. Paste this entire prompt into your AI tool.
2. Paste the BRS/BRD text for the feature(s) you are working on.
3. Ask the AI to generate the **master TRD** in this structure.
4. Review the "Open Questions / TBDs" section with Product/BA.
5. Once clarified, update the TRD and mark resolved TBDs as answered.
```

---

### 📌 Quality Rules (To Keep Output Useful)

> - Must be specific enough that FE & BE can create user stories and tasks from it.  
> - Must not introduce new fields/features without explicit justification or BRS support.  
> - Must keep Frontend vs Backend responsibilities clearly separated.  
> - All uncertainties must remain `TBD-XX` until confirmed and then be updated.  

---

📌 **End of File**
