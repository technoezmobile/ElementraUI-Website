# Community Assets Dataset

This directory contains 6,591 community-contributed UI component assets indexed by ElementraUI.

## Dataset Structure

- `components/`: 6,591 component directories organized by alphanumeric buckets (`0-9/`, `a/`, `b/`, etc.).
  Each component directory contains:
  - `rendered.html`: Sandboxed offline HTML DOM snapshot for isolated iframe previews.
  - `screenshot.png`: Rendered visual reference image.
  - `prompt.md`: Component description and AI blueprint instructions.
- `data/components.json`: Source index manifest of all community records.
- `LICENSE`: Original upstream permissive MIT license.
- `README.md`: Upstream repository documentation.

## Provenance & Attribution

- **Upstream Repository:** [wundercorp/awesome-components](https://github.com/wundercorp/awesome-components)
- **License:** MIT License (see `LICENSE` file in this directory).
- **Authors:** All components are credited to their respective open-source creators. Attribution metadata is preserved in `public/data/awesome-catalogue.json`.

## Why This Directory Is Included in the Full Distribution

ElementraUI is designed to be **100% offline-capable**. Including these pre-rendered snapshots ensures that:
1. All 6,591 components can be previewed immediately after downloading and extracting the repository without requiring internet access or third-party servers.
2. Users in air-gapped, corporate, or offline environments have access to the full component discovery catalog.

## Technical Feasibility of a Smaller Distribution

For environments prioritizing minimum download size over full offline previews:
- **Core-Only Distribution:** A lightweight distribution omitting `community-assets/components/` is ~15 MB.
- **On-Demand Hydration:** Developers using the Core distribution can re-hydrate community assets at any time by running:
  ```bash
  npm run import:awesome
  ```
