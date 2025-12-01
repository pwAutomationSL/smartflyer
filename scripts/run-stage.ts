const { execSync } = require("child_process");

process.env.ENVIRONMENT = "stage";

try {
  execSync("npx playwright test --project=chromium", {
    stdio: "inherit",
  });
} catch (err) {
  // Do NOT print giant stack trace
  console.error("\n❌ Playwright reported a failure.");
}
