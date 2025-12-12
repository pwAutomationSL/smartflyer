const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const now = new Date();
const pad = (n) => n.toString().padStart(2, "0");

const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const hour = pad(now.getHours());
const minute = pad(now.getMinutes());

const fileName = `Regression_${month}_${day}_${hour}_${minute}.html`;

console.log(`Generating Allure report: ${fileName}`);

execSync("npx allure generate allure-results --clean --single-file", {
  stdio: "inherit",
});

const source = path.join("allure-report", "index.html");
const targetFolder = path.join("allure-report");
const target = path.join(targetFolder, fileName);

try {
  fs.renameSync(source, target);
  console.log(`✔ Report saved as: ${fileName}`);
} catch (err) {
  console.error("❌ Failed to rename report:", err);
}
