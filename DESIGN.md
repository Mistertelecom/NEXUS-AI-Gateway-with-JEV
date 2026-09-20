# NEXUS Design System

## 1. Identity

NEXUS is an intelligence control plane built around one recognizable relationship: a scarce,
high-capability **Lead**, an economical **Worker**, and **JEV** at the junction where work is
classified, constrained, and escalated.

The signature is the **Crosspoint**: two distinct lanes converge at a central decision node and
leave as one governed result. It replaces generic gateway, hexagon, shield, and Web3 imagery.

Product principles:

- **Judgment where it matters.** The Lead plans and checks; it is not burned on repetitive work.
- **Throughput where it helps.** The Worker performs the high-volume execution.
- **Measured truth.** Health, cost, savings, latency, and availability are shown only when observed.
- **Operator clarity.** Configuration and runtime evidence stay visually distinct.
- **Inherited engine, original product.** OmniRoute attribution belongs in About and compatibility
  documentation, never as the primary NEXUS interface.

Voice is calm, direct, and technical. Prefer “configured”, “observed”, “unavailable”, and
“not measured” over promotional superlatives. Never promise zero cost, fixed savings, or a model
that was not returned by runtime discovery.

## 2. Token palette

NEXUS uses mineral ink surfaces rather than pure black. Role color is semantic, not decorative.

| Token                  | Dark      | Light     | Meaning                  |
| ---------------------- | --------- | --------- | ------------------------ |
| `--nexus-ink`          | `#0b1013` | `#f4f6f4` | Canvas                   |
| `--nexus-panel`        | `#11191d` | `#ffffff` | Primary surface          |
| `--nexus-panel-raised` | `#172228` | `#eaf0ed` | Raised/selected surface  |
| `--nexus-line`         | `#2b3a40` | `#ccd8d3` | Hairlines and structure  |
| `--nexus-lead`         | `#f0b35a` | `#9a5c00` | Lead model/judgment      |
| `--nexus-worker`       | `#55c7b7` | `#08796c` | Worker model/execution   |
| `--nexus-jev`          | `#b6a0f5` | `#6649b8` | JEV policy/junction      |
| `--nexus-result`       | `#e9f1ed` | `#17211e` | Governed output          |
| `--color-success`      | `#60c990` | `#137a48` | Verified healthy/success |
| `--color-warning`      | `#e4a853` | `#925400` | Degraded/attention       |
| `--color-error`        | `#ef7b72` | `#b52b25` | Failed/blocked           |

Role colors must not be used as a substitute for status. A Lead card may be amber while its health
is unknown; a separate status label communicates that fact.

## 3. Typography

- Interface and narrative: the existing sans stack (`--font-sans`).
- Telemetry, model IDs, versions, commands, and short labels: the existing mono stack.
- Do not set whole pages, paragraphs, or navigation in monospace.
- Display headings use compact line height and sentence case. Uppercase is limited to labels of
  twelve characters or fewer.
- Minimum body size is 14px; auxiliary metadata may use 12px when contrast remains AA.

## 4. Spacing and layout

- Base spacing unit: 4px. Preferred rhythm: 8, 12, 16, 24, 32, 48, 64.
- Main application content caps at 1440px for decision surfaces. Dense data tables may expand.
- The Pair Studio uses an asymmetric 7/5 desktop split: configuration first, contract/evidence
  second. It collapses to one column below 1024px.
- The Lead–JEV–Worker relationship remains legible at every breakpoint. On narrow screens it is a
  vertical sequence, not a squeezed desktop diagram.
- Cards use 16px internal padding on compact screens and 20–24px on desktop.

## 5. Reusable primitives and states

- **Crosspoint mark:** two role lanes, one JEV junction, one output.
- **Role card:** role color rail, human label, provider/model ID, and independent health state.
- **Evidence chip:** `Observed`, `Configured`, `Unknown`, `Unavailable`, or `Not measured`.
- **Contract step:** numbered action in the execution sequence; never implies completion.
- **Engine note:** quiet attribution or compatibility information separated from product identity.
- **Empty state:** explains the missing prerequisite and gives one next action.
- **Loading state:** neutral skeleton or text; never a pulsing green “live” indicator.
- **Error state:** concise cause plus recovery action; no raw stack or upstream secret.

## 6. Motion

- Default transition: 160ms ease-out for color, border, opacity, and small transforms.
- Crosspoint paths may reveal once on page entry, 320ms maximum. They do not loop.
- No decorative ping, fake live pulse, glowing border, floating card, or perpetual routing animation.
- Respect `prefers-reduced-motion`; all non-essential movement is removed.

## 7. Depth

- Depth comes from surface contrast, 1px lines, and restrained shadows, not neon glow.
- Base panels: no shadow. Raised panels: `--shadow-soft`. Menus/modals: `--shadow-elevated`.
- Border radius: 12–16px for panels, 8–10px for controls, full radius only for status chips.
- A selected role or policy uses a stronger line and tinted surface; it never scales up.

## 8. Accessibility and debt

- Text and controls must meet WCAG AA contrast in both themes.
- Every role color is paired with text or an icon. Status is never color-only.
- Focus rings use `--nexus-jev` with at least 2px visible offset.
- Interactive targets are at least 40px high; destructive controls retain explicit labels.
- The public name is NEXUS. Legacy `@omniroute/*`, `OMNIROUTE_*`, `X-OmniRoute-*`, storage paths,
  and CLI aliases are compatibility debt and must be migrated through aliases/dual reads, not a
  global text replacement.
- Legacy dashboard routes remain available behind advanced/debug navigation until NEXUS-owned
  wrappers exist for provider setup, compression, API keys, health, and diagnostics.
- JEV currently exposes classification and policy primitives but does not own every chat execution
  path. The interface must state that boundary until runtime evidence proves otherwise.
