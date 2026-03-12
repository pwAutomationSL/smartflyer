const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');

const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());

const fileName = `Regression_${month}_${day}.html`;

console.log(`Generating Allure report: ${fileName}`);

execSync('npx allure generate allure-results --clean --single-file', {
  stdio: 'inherit',
});

const reportFolder = path.join('allure-report');
const indexFile = path.join(reportFolder, 'index.html');
const datedFile = path.join(reportFolder, fileName);

try {
  fs.copyFileSync(indexFile, datedFile);
  console.log(`✔ Report also saved as: ${fileName}`);
} catch (err) {
  console.error('❌ Failed to copy report:', err);
}
