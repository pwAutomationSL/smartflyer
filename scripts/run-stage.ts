const { execSync } = require('child_process');

process.env.ENVIRONMENT = 'stage';

try {
  execSync(
    'npx playwright test AR-003-AirRequest-Step2-Scenarios9-10-11-12-13-14-15-16-17.spec.ts --project=chromium',
    {
      stdio: 'inherit',
    },
  );
} catch (err) {
  // Do NOT print giant stack trace
  console.error('\n❌ Playwright reported a failure.');
}
