const fs = require('fs');
const path = require('path');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getStatusEmoji(failed) {
  return failed > 0 ? '❌' : '✅';
}

function main() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Missing SLACK_WEBHOOK_URL');
  }

  const summaryPath = path.join(process.cwd(), 'allure-report', 'widgets', 'summary.json');
  const summary = safeReadJson(summaryPath);

  const stat = summary.statistic || {};
  const passed = stat.passed || 0;
  const failed = stat.failed || 0;
  const broken = stat.broken || 0;
  const skipped = stat.skipped || 0;
  const total = stat.total || 0;

  const repo = process.env.GITHUB_REPOSITORY || 'unknown-repo';
  const branch = process.env.GITHUB_REF_NAME || 'unknown-branch';
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;

  // Use this if you later publish the HTML report somewhere public
  const allureReportUrl = process.env.ALLURE_REPORT_URL || runUrl;

  const statusEmoji = getStatusEmoji(failed + broken);

  const payload = {
    text: `${statusEmoji} Playwright Stage Results`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${statusEmoji} *Playwright Stage Results*`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Repository:*\n${repo}` },
          { type: 'mrkdwn', text: `*Branch:*\n${branch}` },
          { type: 'mrkdwn', text: `*Total:*\n${total}` },
          { type: 'mrkdwn', text: `*Passed:*\n${passed}` },
          { type: 'mrkdwn', text: `*Failed:*\n${failed}` },
          { type: 'mrkdwn', text: `*Broken:*\n${broken}` },
          { type: 'mrkdwn', text: `*Skipped:*\n${skipped}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Links:*\n• <${runUrl}|GitHub workflow run>\n• <${allureReportUrl}|Allure report>`,
        },
      },
    ],
  };

  const https = require('https');
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
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Slack notification sent successfully');
        } else {
          console.error(`Slack notification failed: ${res.statusCode} ${body}`);
          process.exit(1);
        }
      });
    },
  );

  req.on('error', (err) => {
    console.error('Slack request error:', err);
    process.exit(1);
  });

  req.write(JSON.stringify(payload));
  req.end();
}

main();
