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
const reportFileName = `Regression_${dd}_${mm}_${yyyy}.html`;

console.log(`Generating Allure report for run: ${runId}`);

execSync('npx allure generate allure-results --clean --single-file', {
  stdio: 'inherit',
});

const root = process.cwd();
const allureReportRoot = path.join(root, 'allure-report');
const generatedIndex = path.join(allureReportRoot, 'index.html');
const namedReportPath = path.join(allureReportRoot, reportFileName);

if (!fs.existsSync(generatedIndex)) {
  throw new Error(`Allure report was not generated: ${generatedIndex} not found`);
}

// Rename Allure's default index.html to your desired filename
if (fs.existsSync(namedReportPath)) {
  fs.unlinkSync(namedReportPath);
}
fs.renameSync(generatedIndex, namedReportPath);
console.log(`✔ Report saved as: ${namedReportPath}`);

// Prepare Pages site
const pagesRoot = path.join(root, 'site');
const reportsRoot = path.join(pagesRoot, 'reports');
const runFolder = path.join(reportsRoot, runId);

fs.mkdirSync(runFolder, { recursive: true });

// Keep the same named file in the run folder
const targetNamedReport = path.join(runFolder, reportFileName);
fs.copyFileSync(namedReportPath, targetNamedReport);

// Also create index.html inside the Pages run folder only,
// so GitHub Pages can open /reports/<runId>/ directly
const targetIndex = path.join(runFolder, 'index.html');
fs.copyFileSync(namedReportPath, targetIndex);

console.log(`✔ Pages report saved to: ${targetNamedReport}`);

// Build history page
const reportDirs = fs.existsSync(reportsRoot)
  ? fs
      .readdirSync(reportsRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()
      .reverse()
  : [];

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
      reportFileName,
      reportUrlPath: `/reports/${runId}/`,
      reportTitle,
    },
    null,
    2,
  ),
);

console.log(`✔ Pages site prepared in: ${pagesRoot}`);
