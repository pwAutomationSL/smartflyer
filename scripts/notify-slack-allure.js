const fs = require('fs');
const path = require('path');
const https = require('https');

function getAllureStats(resultsDir) {
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
    const json = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
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
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(body);
          else reject(new Error(`Slack request failed: ${res.statusCode} ${body}`));
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
  if (!webhookUrl) throw new Error('Missing SLACK_WEBHOOK_URL');

  const repo = process.env.GITHUB_REPOSITORY || 'unknown-repo';
  const branch = process.env.GITHUB_REF_NAME || 'unknown-branch';
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`;

  const stats = getAllureStats(path.join(process.cwd(), 'allure-results'));

  const meta = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'report-meta.json'), 'utf8'));

  const baseUrl = process.env.ALLURE_REPORT_BASE_URL;
  const reportUrl = `${baseUrl}${meta.reportUrlPath}`;

  const hasFailures = stats.failed > 0 || stats.broken > 0;
  const statusEmoji = hasFailures ? '❌' : '✅';
  const statusText = hasFailures ? 'FAILED' : 'PASSED';

  const payload = {
    text: `${statusEmoji} Playwright Stage Results — ${statusText}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            `✅ *${stats.passed} passed*  •  ` +
            `❌ *${stats.failed} failed*  •  ` +
            `🐞 *${stats.broken} bugs*  •  ` +
            `⏭️ *${stats.skipped} skipped*`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            `The latest testing suite run is now completed. ` +
            `The run included *${stats.total} tests*.\n\n` +
            `*Repository:* ${repo}\n` +
            `*Branch:* ${branch}`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Detailed Report',
              emoji: true,
            },
            style: 'primary',
            url: reportUrl,
          },
        ],
      },
    ],
  };

  await postToSlack(webhookUrl, payload);
  console.log('Slack notification sent successfully');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
