const { spawn } = require('child_process');

process.env.ENVIRONMENT = 'stage';

const commands = [
  ['npx', ['playwright', 'test', '--project=chromium-air-request', '--workers=1']],
  ['npx', ['playwright', 'test', '--project=chromium-client-FAQs-GlobalSearch', '--workers=1']],
  [
    'npx',
    [
      'playwright',
      'test',
      '--project=chromium-RolesAndPermissions-Trainings-Toolkit-Tasks-SV-1-Bugs-Login',
      '--workers=1',
    ],
  ],
];

const children = commands.map(([cmd, args]) =>
  spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  }),
);

Promise.all(
  children.map(
    (child) =>
      new Promise((resolve, reject) => {
        child.on('exit', (code) => {
          if (code === 0) resolve(code);
          else reject(new Error(`Process exited with code ${code}`));
        });
      }),
  ),
)
  .then(() => {
    console.log('\n✅ All Playwright projects finished successfully.');
  })
  .catch((err) => {
    console.error('\n❌ One or more Playwright projects failed.');
    process.exit(1);
  });
