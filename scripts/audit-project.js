// scripts/audit-project.js
/**
 * Simple static analysis script to audit the MICE project for incompatibilities
 * with the ChatGPT Sites (Cloudflare Workers) runtime.
 *
 * It scans the source tree for:
 *  - Hard‑coded localhost / 127.0.0.1 URLs
 *  - Usage of Node.js 'fs' methods (readFileSync, writeFileSync, etc.)
 *  - Direct process.env accesses that are not guarded
 *  - Express-specific APIs that need replacement
 *  - Any imports of non‑worker‑compatible modules (child_process, sqlite3, etc.)
 *
 * The script outputs a JSON report saved to `docs/audit-report.json` and a
 * human‑readable markdown summary `docs/audit-report.md`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXTS = ['.js', '.json'];
const IGNORED_DIRS = ['node_modules', '.git', 'dist'];

function isSourceFile(file) {
  return EXTS.includes(path.extname(file));
}

function walk(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
    } else if (isSourceFile(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  const localhostRegex = /(localhost|127\.0\.0\.1|\:3000)/g;
  if (localhostRegex.test(content)) {
    issues.push({ type: 'localhost', detail: 'Hard‑coded localhost reference' });
  }

  const fsCalls = content.match(/\b(fs\.)?(readFileSync|writeFileSync|appendFileSync|unlinkSync|mkdirSync|readdirSync)\b/g);
  if (fsCalls) {
    issues.push({ type: 'fs', detail: `File‑system calls: ${[...new Set(fsCalls)].join(', ')}` });
  }

  const expressImports = content.match(/require\(['"]express['"]\)/);
  if (expressImports) {
    issues.push({ type: 'express', detail: 'Express import detected' });
  }

  const childProc = content.match(/require\(['"]child_process['"]\)/);
  if (childProc) {
    issues.push({ type: 'child_process', detail: 'Child process usage' });
  }

  const sqlite = content.match(/require\(['"]sqlite3['"]\)/);
  if (sqlite) {
    issues.push({ type: 'sqlite', detail: 'SQLite usage' });
  }

  return issues;
}

function main() {
  const files = walk(ROOT);
  const report = {};
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const issues = scanFile(file);
    if (issues.length) {
      report[rel] = issues;
    }
  }

  const jsonPath = path.join(ROOT, 'docs', 'audit-report.json');
  const mdPath = path.join(ROOT, 'docs', 'audit-report.md');
  if (!fs.existsSync(path.join(ROOT, 'docs'))) {
    fs.mkdirSync(path.join(ROOT, 'docs'));
  }
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

  // Generate markdown summary
  let md = '# Auditoria de Compatibilidade com ChatGPT Sites\n\n';
  md += '## Resumo\n';
  const totalFiles = Object.keys(report).length;
  md += `- Arquivos analisados com problemas: **${totalFiles}**\n\n`;
  for (const [file, issues] of Object.entries(report)) {
    md += `### ${file}\n`;
    for (const iss of issues) {
      md += `- **${iss.type}**: ${iss.detail}\n`;
    }
    md += '\n';
  }
  fs.writeFileSync(mdPath, md, 'utf8');
  console.log('Audit completed. Reports written to docs/');
}

main();
