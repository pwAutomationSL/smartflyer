const { spawn } = require('child_process');

process.env.ENVIRONMENT = 'stage';

const commands = [
  ['chromium-air-request', ['playwright', 'test', '--project=chromium-air-request', '--workers=1']],
  [
    'chromium-client-FAQs-GlobalSearch',
    ['playwright', 'test', '--project=chromium-client-FAQs-GlobalSearch', '--workers=1'],
  ],
  [
    'chromium-RolesAndPermissions-Trainings-Toolkit-Tasks-SV-1-Bugs-Login',
    [
      'playwright',
      'test',
      '--project=chromium-RolesAndPermissions-Trainings-Toolkit-Tasks-SV-1-Bugs-Login',
      '--workers=1',
    ],
  ],
];

const runCommand = (name, args) =>
  new Promise((resolve) => {
    console.log(`\n🚀 Starting ${name}...`);

    const child = spawn('npx', args, {
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });

    child.on('exit', (code) => {
      resolve({
        name,
        code: code ?? 1,
        success: code === 0,
      });
    });
  });

Promise.all(commands.map(([name, args]) => runCommand(name, args)))
  .then((results) => {
    const failed = results.filter((r) => !r.success);

    console.log('\n📊 Playwright execution summary:');
    results.forEach((r) => {
      console.log(`- ${r.name}: ${r.success ? '✅ passed' : `❌ failed (code ${r.code})`}`);
    });

    if (failed.length > 0) {
      console.log(
        '\n⚠️ Some Playwright projects failed, but pipeline will continue so report/Slack can still be sent.',
      );
    } else {
      console.log('\n✅ All Playwright projects finished successfully.');
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Unexpected error while running Playwright projects.');
    console.error(err);
    process.exit(0);
  });
