const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const OLD_DIR = path.resolve(ROOT_DIR, '.cache/awesome-components');
const NEW_DIR = path.resolve(ROOT_DIR, 'community-assets');

console.log('=== Migrating Community Assets from .cache to community-assets ===\n');

if (!fs.existsSync(NEW_DIR)) {
  fs.mkdirSync(NEW_DIR, { recursive: true });
}

// 1. Copy metadata files
const metaFiles = ['LICENSE', 'README.md', 'CONTRIBUTING.md', 'package.json', 'push.sh'];
for (const f of metaFiles) {
  const src = path.join(OLD_DIR, f);
  const dest = path.join(NEW_DIR, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${f} to community-assets/`);
  }
}

// 2. Add ElementraUI provenance and documentation README
const provenanceReadme = `# Community Assets Dataset

This directory contains 6,591 community-contributed UI component assets indexed by ElementraUI.

## Dataset Structure

- \`components/\`: 6,591 component directories organized by alphanumeric buckets (\`0-9/\`, \`a/\`, \`b/\`, etc.).
  Each component directory contains:
  - \`rendered.html\`: Sandboxed offline HTML DOM snapshot for isolated iframe previews.
  - \`screenshot.png\`: Rendered visual reference image.
  - \`prompt.md\`: Component description and AI blueprint instructions.
- \`data/components.json\`: Source index manifest of all community records.
- \`LICENSE\`: Original upstream permissive MIT license.
- \`README.md\`: Upstream repository documentation.

## Provenance & Attribution

- **Upstream Repository:** [wundercorp/awesome-components](https://github.com/wundercorp/awesome-components)
- **License:** MIT License (see \`LICENSE\` file in this directory).
- **Authors:** All components are credited to their respective open-source creators. Attribution metadata is preserved in \`public/data/awesome-catalogue.json\`.

## Why This Directory Is Included in the Full Distribution

ElementraUI is designed to be **100% offline-capable**. Including these pre-rendered snapshots ensures that:
1. All 6,591 components can be previewed immediately after downloading and extracting the repository without requiring internet access or third-party servers.
2. Users in air-gapped, corporate, or offline environments have access to the full component discovery catalog.

## Technical Feasibility of a Smaller Distribution

For environments prioritizing minimum download size over full offline previews:
- **Core-Only Distribution:** A lightweight distribution omitting \`community-assets/components/\` is ~15 MB.
- **On-Demand Hydration:** Developers using the Core distribution can re-hydrate community assets at any time by running:
  \`\`\`bash
  npm run import:awesome
  \`\`\`
`;

fs.writeFileSync(path.join(NEW_DIR, 'DATASET_INFO.md'), provenanceReadme, 'utf8');
console.log('✓ Created community-assets/DATASET_INFO.md');

// 3. Copy or move data/
const oldData = path.join(OLD_DIR, 'data');
const newData = path.join(NEW_DIR, 'data');
if (fs.existsSync(oldData)) {
  if (!fs.existsSync(newData)) {
    fs.mkdirSync(newData, { recursive: true });
  }
  for (const f of fs.readdirSync(oldData)) {
    fs.copyFileSync(path.join(oldData, f), path.join(newData, f));
  }
  console.log('✓ Copied community-assets/data/');
}

// 4. Move components/ if not already in community-assets
const oldComponents = path.join(OLD_DIR, 'components');
const newComponents = path.join(NEW_DIR, 'components');

if (fs.existsSync(oldComponents) && !fs.existsSync(newComponents)) {
  console.log('Moving components/ to community-assets/components/ (fast NTFS move)...');
  fs.renameSync(oldComponents, newComponents);
  console.log('✓ Moved components/ to community-assets/components/');
} else if (fs.existsSync(newComponents)) {
  console.log('✓ community-assets/components/ already exists.');
}

// 5. Also keep a directory junction in .cache for any legacy tools if needed
const junctionPath = path.join(OLD_DIR, 'components');
if (!fs.existsSync(junctionPath)) {
  try {
    execSync(`cmd /c mklink /J "${junctionPath}" "${newComponents}"`, { stdio: 'pipe' });
    console.log('✓ Created backwards-compatible directory junction at .cache/awesome-components/components');
  } catch (err) {
    console.log('Note: junction not created (not strictly required):', err.message);
  }
}

console.log('\nMigration complete.');
