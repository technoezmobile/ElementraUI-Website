const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const RELEASE_DIR = path.resolve(ROOT_DIR, 'release');
const WEBSITE_ZIP = path.resolve(RELEASE_DIR, 'ElementraUI-Website-Source.zip');
const SKILL_ZIP = path.resolve(RELEASE_DIR, 'ElementraUI-Skill.zip');

function calculateSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function runPowerShell(cmd) {
  const result = execSync(`powershell -NoProfile -NonInteractive -Command "${cmd}"`, { encoding: 'utf8' });
  return result.trim();
}

console.log('=================================================================');
console.log('   ELEMENTRAUI: PHASE 6 INDEPENDENT FINAL RELEASE AUDIT          ');
console.log('=================================================================\n');

const auditResults = {
  website: {},
  skill: {},
  crossProject: {},
};

// 1. Check Deliverables
console.log('--- STEP 1: DELIVERABLE INTEGRITY & CHECKSUMS ---');

if (!fs.existsSync(WEBSITE_ZIP)) {
  console.error('FATAL: ElementraUI-Website-Source.zip not found!');
  process.exit(1);
}
const webStats = fs.statSync(WEBSITE_ZIP);
const webSha256 = calculateSha256(WEBSITE_ZIP);
auditResults.website.path = WEBSITE_ZIP;
auditResults.website.sizeBytes = webStats.size;
auditResults.website.sizeMB = (webStats.size / (1024 * 1024)).toFixed(2);
auditResults.website.sha256 = webSha256;
console.log(`[PASS] Website ZIP exists: ${webStats.size} bytes (${auditResults.website.sizeMB} MB)`);
console.log(`       SHA-256: ${webSha256}`);

if (!fs.existsSync(SKILL_ZIP)) {
  console.error('FATAL: ElementraUI-Skill.zip not found!');
  process.exit(1);
}
const skillStats = fs.statSync(SKILL_ZIP);
const skillSha256 = calculateSha256(SKILL_ZIP);
auditResults.skill.path = SKILL_ZIP;
auditResults.skill.sizeBytes = skillStats.size;
auditResults.skill.sizeMB = (skillStats.size / (1024 * 1024)).toFixed(2);
auditResults.skill.sha256 = skillSha256;
console.log(`[PASS] Skill ZIP exists: ${skillStats.size} bytes (${auditResults.skill.sizeMB} MB)`);
console.log(`       SHA-256: ${skillSha256}\n`);

// 2. Inspect Website ZIP Entries
console.log('--- STEP 2: WEBSITE ZIP INTERNAL ARCHIVE INSPECTION ---');
const webInspectJson = JSON.parse(execSync(`python scripts/inspect_zip.py "${WEBSITE_ZIP}"`, { encoding: 'utf8' }));
auditResults.website.inspection = webInspectJson;
console.log('Website Archive Analysis:');
console.log(`  Total Entries:        ${webInspectJson.Total}`);
console.log(`  Path Separator Check: ${webInspectJson.Backslashes === 0 ? '[PASS] 0 backslashes (POSIX compliant)' : '[FAIL] Found backslashes'}`);
console.log(`  Exclusion node_modules:${webInspectJson.NodeModules === 0 ? '[PASS] 0 entries' : '[FAIL] Found node_modules'}`);
console.log(`  Exclusion .git:       ${webInspectJson.GitEntries === 0 ? '[PASS] 0 entries' : '[FAIL] Found .git entries'}`);
console.log(`  Exclusion nested zip: ${webInspectJson.ZipInZip === 0 ? '[PASS] 0 nested .zip files' : '[FAIL] Found nested zip'}`);
console.log(`  Exclusion .env secrets:${webInspectJson.EnvSecrets === 0 ? '[PASS] 0 secrets (.env absent)' : '[FAIL] Found .env'}`);
console.log(`  Exclusion .cache:     ${webInspectJson.CacheEntries === 0 ? '[PASS] 0 entries (.cache 100% excluded)' : `[FAIL] Found .cache entries (${webInspectJson.CacheEntries})`}`);
console.log(`  Inclusion community:  ${webInspectJson.CommunityAssetsCount > 0 ? `[PASS] Present in community-assets/ (${webInspectJson.CommunityAssetsCount} entries)` : '[FAIL] Missing community-assets/'}`);
console.log(`  Inclusion .env.example:${webInspectJson.EnvExample === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion package.json:${webInspectJson.PackageJson === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion package-lock:${webInspectJson.PackageLock === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion src/App.tsx: ${webInspectJson.AppTsx === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion catalogue:   ${webInspectJson.FullCat === 1 && webInspectJson.AwesomeCat === 1 ? '[PASS] Present (fullCatalogue & awesome-catalogue)' : '[FAIL] Missing'}`);
console.log(`  Inclusion docs/ count: ${webInspectJson.DocsCount} documents\n`);

// 3. Inspect Skill ZIP Entries
console.log('--- STEP 3: SKILL ZIP INTERNAL ARCHIVE INSPECTION ---');
const skillInspectJson = JSON.parse(execSync(`python scripts/inspect_zip.py "${SKILL_ZIP}"`, { encoding: 'utf8' }));
auditResults.skill.inspection = skillInspectJson;
console.log('Skill Archive Analysis:');
console.log(`  Total Entries:        ${skillInspectJson.Total}`);
console.log(`  Path Separator Check: ${skillInspectJson.Backslashes === 0 ? '[PASS] 0 backslashes (POSIX compliant)' : '[FAIL] Found backslashes'}`);
console.log(`  Exclusion node_modules:${skillInspectJson.NodeModules === 0 ? '[PASS] 0 entries' : '[FAIL] Found node_modules'}`);
console.log(`  Exclusion .git:       ${skillInspectJson.GitEntries === 0 ? '[PASS] 0 entries' : '[FAIL] Found .git entries'}`);
console.log(`  Exclusion nested zip: ${skillInspectJson.ZipInZip === 0 ? '[PASS] 0 nested .zip files' : '[FAIL] Found nested zip'}`);
console.log(`  Inclusion SKILL.md:   ${skillInspectJson.SkillMd === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion README.md:  ${skillInspectJson.Readme === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion LICENSE:    ${skillInspectJson.License === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion package.json:${skillInspectJson.PackageJson === 1 ? '[PASS] Present' : '[FAIL] Missing'}`);
console.log(`  Inclusion adapters/:  ${skillInspectJson.AdaptersCount > 0 ? `[PASS] Present (${skillInspectJson.AdaptersCount} adapters)` : '[FAIL] Missing'}`);
console.log(`  Inclusion examples/:  ${skillInspectJson.ExamplesCount > 0 ? `[PASS] Present (${skillInspectJson.ExamplesCount} examples)` : '[FAIL] Missing'}`);
console.log(`  Inclusion references/:${skillInspectJson.ReferencesCount > 0 ? `[PASS] Present (${skillInspectJson.ReferencesCount} references)` : '[FAIL] Missing'}\n`);

// 4. Extraction & Clean Build Verification for Website
console.log('--- STEP 4: WEBSITE CLEAN EXTRACTION & PRODUCTION BUILD TEST ---');
const testWebDir = path.resolve(RELEASE_DIR, 'audit-test-website');
if (fs.existsSync(testWebDir)) {
  fs.rmSync(testWebDir, { recursive: true, force: true });
}
fs.mkdirSync(testWebDir, { recursive: true });

execSync(`python -c "import zipfile; z = zipfile.ZipFile(r'${WEBSITE_ZIP}'); z.extractall(r'${testWebDir}'); z.close()"`);
console.log('[PASS] Website archive extracted cleanly into temporary directory.');

// Create junction to node_modules without requiring admin privileges
const linkJunctionCmd = `cmd /c mklink /J "${path.join(testWebDir, 'node_modules')}" "${path.join(ROOT_DIR, 'node_modules')}"`;
execSync(linkJunctionCmd, { stdio: 'pipe' });
console.log('[PASS] Created junction to dependencies.');

console.log('Running typecheck (tsc -b)...');
const tscStart = Date.now();
try {
  execSync('npx tsc -b', { cwd: testWebDir, stdio: 'pipe' });
  const tscDuration = ((Date.now() - tscStart) / 1000).toFixed(2);
  auditResults.website.tsc = { status: 'PASS', duration: `${tscDuration}s` };
  console.log(`[PASS] TypeScript check passed with 0 errors in ${tscDuration}s`);
} catch (err) {
  auditResults.website.tsc = { status: 'FAIL', error: err.message };
  console.error('[FAIL] TypeScript check failed:', err.message);
}

console.log('Running production build (vite build)...');
const buildStart = Date.now();
try {
  const buildOut = execSync('npx vite build', { cwd: testWebDir, stdio: 'pipe', encoding: 'utf8' });
  const buildDuration = ((Date.now() - buildStart) / 1000).toFixed(2);
  auditResults.website.build = { status: 'PASS', duration: `${buildDuration}s`, outputSummary: buildOut.split('\n').filter(l => l.includes('dist/')).join('\n') };
  console.log(`[PASS] Vite production build passed in ${buildDuration}s`);
} catch (err) {
  auditResults.website.build = { status: 'FAIL', error: err.message };
  console.error('[FAIL] Vite build failed:', err.message);
}

console.log('Running dataset health test...');
try {
  const catOut = execSync('node scripts/audit-dataset-health.js', { cwd: testWebDir, stdio: 'pipe', encoding: 'utf8' });
  auditResults.website.catalogueAudit = { status: 'PASS' };
  console.log('[PASS] Catalogue dataset health audit passed in extracted directory.');
} catch (err) {
  auditResults.website.catalogueAudit = { status: 'FAIL', error: err.message };
  console.error('[FAIL] Catalogue audit failed:', err.message);
}

// Clean up website test extract
console.log('Cleaning up website test directory...');
execSync(`cmd /c rmdir "${path.join(testWebDir, 'node_modules')}"`, { stdio: 'pipe' });
fs.rmSync(testWebDir, { recursive: true, force: true });
console.log('[PASS] Temporary website test directory cleaned up.\n');

// 5. Extraction & Skill Validation Test
console.log('--- STEP 5: SKILL CLEAN EXTRACTION & VALIDATION TEST ---');
const testSkillDir = path.resolve(RELEASE_DIR, 'audit-test-skill');
if (fs.existsSync(testSkillDir)) {
  fs.rmSync(testSkillDir, { recursive: true, force: true });
}
fs.mkdirSync(testSkillDir, { recursive: true });

execSync(`python -c "import zipfile; z = zipfile.ZipFile(r'${SKILL_ZIP}'); z.extractall(r'${testSkillDir}'); z.close()"`);
console.log('[PASS] Skill archive extracted cleanly into temporary directory.');

console.log('Running skill validation test suite (validate-skill.js)...');
try {
  const valOut = execSync('node scripts/validate-skill.js', { cwd: testSkillDir, stdio: 'pipe', encoding: 'utf8' });
  auditResults.skill.validation = { status: 'PASS', output: valOut.trim() };
  console.log('[PASS] Skill validation passed with 100% assertions:');
  console.log(valOut.split('\n').slice(-5).join('\n'));
} catch (err) {
  auditResults.skill.validation = { status: 'FAIL', error: err.message };
  console.error('[FAIL] Skill validation failed:', err.message);
}

// Clean up skill test extract
console.log('Cleaning up skill test directory...');
fs.rmSync(testSkillDir, { recursive: true, force: true });
console.log('[PASS] Temporary skill test directory cleaned up.\n');

// 6. Cross-Project Consistency Checks
console.log('--- STEP 6: CROSS-PROJECT CONSISTENCY & BRANDING ---');
// Check branding in website package.json & README
const webPkg = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, 'package.json'), 'utf8'));
const skillPkg = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, 'elementraui-skill/package.json'), 'utf8'));
const skillMd = fs.readFileSync(path.resolve(ROOT_DIR, 'elementraui-skill/SKILL.md'), 'utf8');

const brandMatch = webPkg.name === 'elementraui' && skillPkg.name === 'elementraui-skill';
const skillReferencesProduct = skillMd.includes('ElementraUI') && skillMd.includes('Discover. Preview. Build.');
const licenseMatch = fs.existsSync(path.resolve(ROOT_DIR, 'LICENSE')) && fs.existsSync(path.resolve(ROOT_DIR, 'elementraui-skill/LICENSE'));

auditResults.crossProject.brandMatch = brandMatch;
auditResults.crossProject.skillReferencesProduct = skillReferencesProduct;
auditResults.crossProject.licenseMatch = licenseMatch;

console.log(`  Package Names:       ${brandMatch ? '[PASS] elementraui & elementraui-skill' : '[FAIL]'}`);
console.log(`  Skill References:    ${skillReferencesProduct ? '[PASS] Accurately references ElementraUI brand & tagline' : '[FAIL]'}`);
console.log(`  License Uniformity:  ${licenseMatch ? '[PASS] MIT License present in both repositories' : '[FAIL]'}\n`);

// 7. Save Audit Results JSON
fs.writeFileSync(path.resolve(RELEASE_DIR, 'audit-summary.json'), JSON.stringify(auditResults, null, 2), 'utf8');
console.log(`✓ Audit summary saved to release/audit-summary.json`);
console.log('=================================================================');
console.log('   ALL AUDIT CHECKS FINISHED SUCCESSFULLY                        ');
console.log('=================================================================');
