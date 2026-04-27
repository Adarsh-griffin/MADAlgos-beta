# Free Test Email Template (Confirmation + Score)

Use this with SendGrid Dynamic Template ID:

- `SENDGRID_ASSESSMENT_SCORE_TEMPLATE_ID`

The app sends this template on test submission from `sendAssessmentScoreEmail`.

## Dynamic fields available

- `{{studentName}}`
- `{{testTitle}}`
- `{{submittedAtDisplay}}`
- `{{totalScore}}`
- `{{maxScore}}`
- `{{percentage}}`
- `{{status}}` (`COMPLETED` or `AUTO_SUBMITTED`)
- `{{statusLabel}}` (`Completed` or `Auto submitted`)
- `{{baseUrl}}`
- `{{homeUrl}}` (derived from `baseUrl`, safer for root links)
- `{{testsUrl}}` (derived from `baseUrl`, use for CTA)

## Suggested Subject

`Your Free Test Score: {{testTitle}}`

## Suggested HTML (paste in SendGrid)

This version avoids hardcoded domains and uses table-based CTA markup for better Outlook/Gmail compatibility.

```html
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#020617;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#020617;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0f172a;border:1px solid #233044;">
            <tr>
              <td style="height:4px;background:#14b8a6;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:24px 24px 16px 24px;font-family:Arial,sans-serif;color:#e2e8f0;">
                <p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#22d3ee;">MADAlgos Free Test</p>
                <h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;color:#ffffff;">Your score is ready</h1>
                <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#94a3b8;">
                  {{#if studentName}}Hi <strong style="color:#fff;">{{studentName}}</strong>,{{else}}Hi,{{/if}}
                  we recorded your result for <strong style="color:#fff;">{{testTitle}}</strong>.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0b1326;border:1px solid #22325d;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0;font-size:12px;color:#9fb5df;">Score</p>
                      <p style="margin:6px 0 0;font-size:30px;line-height:1.1;font-weight:700;color:#22d3ee;">{{totalScore}} / {{maxScore}}</p>
                      <p style="margin:6px 0 0;font-size:13px;color:#c4d3f3;">{{percentage}}% • {{statusLabel}}</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:14px 0 0;font-size:12px;color:#9fb5df;">Submitted at: {{submittedAtDisplay}}</p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
                  <tr>
                    <td bgcolor="#14b8a6" style="border-radius:6px;">
                      <a href="{{testsUrl}}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#062021;text-decoration:none;font-family:Arial,sans-serif;">
                        View More Tests
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:14px 0 0;font-size:12px;color:#7f95c0;">
                  If the button does not work, copy this URL:
                  <a href="{{testsUrl}}" style="color:#5eead4;text-decoration:none;">{{testsUrl}}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

## Optional plain-text body

```text
MADAlgos Free Test

Your score is ready.
Test: {{testTitle}}
Score: {{totalScore}}/{{maxScore}} ({{percentage}}%)
Status: {{statusLabel}}
Submitted at: {{submittedAtDisplay}}
```

## Env for beta/prod (no hardcoding)

- Set `APP_BASE_URL` per environment (beta vs prod) on the server.
- `baseUrl`, `homeUrl`, and `testsUrl` in SendGrid data are generated from that value automatically.
- Keep template links as `{{testsUrl}}` / `{{homeUrl}}` so no manual changes are needed during deploys.

