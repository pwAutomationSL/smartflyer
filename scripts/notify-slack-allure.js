const fs = require('fs');
const path = require('path');
const https = require('https');

function getAllureStats(resultsDir) {
  if (!fs.existsSync(resultsDir)) {
    throw new Error(`allure-results folder not found: ${resultsDir}`);
  }

  const files = fs.readdirSync(resultsDir).filter((file) => file.endsWith('-result.json'));

  const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    broken: 0,
    skipped: 0,
    unknown: 0,
  };

  for (const file of files) {
    const filePath = path.join(resultsDir, file);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const status = json.status || 'unknown';

    stats.total += 1;

    if (status === 'passed') stats.passed += 1;
    else if (status === 'failed') stats.failed += 1;
    else if (status === 'broken') stats.broken += 1;
    else if (status === 'skipped') stats.skipped += 1;
    else stats.unknown += 1;
  }

  return stats;
}

function postToSlack(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`Slack request failed: ${res.statusCode} ${body}`));
          }
        });
      },
    );

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function main() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Missing SLACK_WEBHOOK_URL');
  }

  const repo = process.env.GITHUB_REPOSITORY || 'unknown-repo';
  const branch = process.env.GITHUB_REF_NAME || 'unknown-branch';
  const runId = process.env.GITHUB_RUN_ID;
  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';

  const runUrl = `${serverUrl}/${repo}/actions/runs/${runId}`;

  const resultsDir = path.join(process.cwd(), 'allure-results');
  const stats = getAllureStats(resultsDir);

  const hasFailures = stats.failed > 0 || stats.broken > 0;
  const statusEmoji = hasFailures ? '❌' : '✅';
  const statusText = hasFailures ? 'FAILED' : 'PASSED';

  const payload = {
    text: `${statusEmoji} Playwright Stage Results - ${statusText}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${statusEmoji} *Playwright Stage Results — ${statusText}*`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Repository:*\n${repo}`,
          },
          {
            type: 'mrkdwn',
            text: `*Branch:*\n${branch}`,
          },
          {
            type: 'mrkdwn',
            text: `*Total:*\n${stats.total}`,
          },
          {
            type: 'mrkdwn',
            text: `*Passed:*\n${stats.passed}`,
          },
          {
            type: 'mrkdwn',
            text: `*Failed:*\n${stats.failed}`,
          },
          {
            type: 'mrkdwn',
            text: `*Broken:*\n${stats.broken}`,
          },
          {
            type: 'mrkdwn',
            text: `*Skipped:*\n${stats.skipped}`,
          },
          {
            type: 'mrkdwn',
            text: `*Unknown:*\n${stats.unknown}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Report / Run:*\n<${runUrl}|Open GitHub Actions run>`,
        },
      },
    ],
  };

  await postToSlack(webhookUrl, payload);
  console.log('Slack notification sent successfully');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
