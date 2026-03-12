const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');

const yyyy = now.getFullYear();
const mm = pad(now.getMonth() + 1);
const dd = pad(now.getDate());
const hh = pad(now.getHours());
const mi = pad(now.getMinutes());
const ss = pad(now.getSeconds());

const runId = `${yyyy}-${mm}-${dd}-${hh}${mi}${ss}`;
const reportTitle = `Regression ${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;

console.log(`Generating Allure report for run: ${runId}`);

execSync('npx allure generate allure-results --clean --single-file', {
  stdio: 'inherit',
});

const root = process.cwd();
const pagesRoot = path.join(root, 'site');
const reportsRoot = path.join(pagesRoot, 'reports');
const runFolder = path.join(reportsRoot, runId);

fs.mkdirSync(runFolder, { recursive: true });

const sourceIndex = path.join(root, 'allure-report', 'index.html');
const targetIndex = path.join(runFolder, 'index.html');

fs.copyFileSync(sourceIndex, targetIndex);
console.log(`✔ Report saved to: ${targetIndex}`);

// Create/update a simple homepage with links to all reports
const reportDirs = fs
  .readdirSync(reportsRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()
  .reverse();

const links = reportDirs
  .map(
    (dir) =>
      `<li><a href="./reports/${dir}/" target="_blank" rel="noopener noreferrer">${dir}</a></li>`,
  )
  .join('\n');

const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Allure Reports</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.5; }
    h1 { margin-bottom: 8px; }
    p { color: #555; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
    a { text-decoration: none; color: #0969da; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Allure Report History</h1>
  <p>Latest run: <strong>${reportTitle}</strong></p>
  <ul>
    ${links}
  </ul>
</body>
</html>`;

fs.mkdirSync(pagesRoot, { recursive: true });
fs.writeFileSync(path.join(pagesRoot, 'index.html'), indexHtml, 'utf8');

fs.writeFileSync(
  path.join(root, 'report-meta.json'),
  JSON.stringify(
    {
      runId,
      reportUrlPath: `/reports/${runId}/`,
      reportTitle,
    },
    null,
    2,
  ),
);

console.log(`✔ Pages site prepared in: ${pagesRoot}`);
