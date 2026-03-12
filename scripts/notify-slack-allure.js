const fs = require('fs');
const path = require('path');
const https = require('https');

function readJsonIfExists(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function getMergedStatsFromAllureResults(resultsDir) {
  const fallback = {
    total: 0,
    passed: 0,
    failed: 0,
    broken: 0,
    skipped: 0,
    unknown: 0,
    flaky: 0,
  };

  if (!fs.existsSync(resultsDir)) return fallback;

  const files = fs.readdirSync(resultsDir).filter((file) => file.endsWith('-result.json'));

  const grouped = new Map();

  for (const file of files) {
    const filePath = path.join(resultsDir, file);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const key = json.historyId || json.testCaseId || json.fullName || json.name || file;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key).push(json);
  }

  const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    broken: 0,
    skipped: 0,
    unknown: 0,
    flaky: 0,
  };

  for (const [, attempts] of grouped.entries()) {
    stats.total += 1;

    const statuses = attempts.map((a) => a.status || 'unknown');
    const hasPassed = statuses.includes('passed');
    const hasFailed = statuses.includes('failed');
    const hasBroken = statuses.includes('broken');
    const hasSkipped = statuses.includes('skipped');

    // If it passed in any retry, treat final outcome as passed.
    if (hasPassed) {
      stats.passed += 1;

      // Mark as flaky when it had a failed/broken attempt before passing.
      if (hasFailed || hasBroken) {
        stats.flaky += 1;
      }
      continue;
    }

    if (hasFailed) {
      stats.failed += 1;
      continue;
    }

    if (hasBroken) {
      stats.broken += 1;
      continue;
    }

    if (hasSkipped) {
      stats.skipped += 1;
      continue;
    }

    stats.unknown += 1;
  }

  return stats;
}

async function main() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Missing SLACK_WEBHOOK_URL');
  }

  const repo = process.env.GITHUB_REPOSITORY || 'unknown-repo';
  const branch = process.env.GITHUB_REF_NAME || 'unknown-branch';
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`;

  const stats = getMergedStatsFromAllureResults(path.join(process.cwd(), 'allure-results'));

  const meta = readJsonIfExists(path.join(process.cwd(), 'report-meta.json'), {
    reportUrlPath: '/',
  });

  const baseUrl = (process.env.ALLURE_REPORT_BASE_URL || '').replace(/\/$/, '');
  const reportPath = (meta.reportUrlPath || '/').startsWith('/')
    ? meta.reportUrlPath
    : `/${meta.reportUrlPath}`;
  const reportUrl = `${baseUrl}${reportPath}`;

  const hasFailures = Number(stats.failed) > 0 || Number(stats.broken) > 0;
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
            `🔁 *${stats.flaky} flaky*  •  ` +
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
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            `*Links:*\n` +
            `• <${reportUrl}|View Detailed Report>\n` +
            `• <${runUrl}|Open GitHub Run>`,
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
