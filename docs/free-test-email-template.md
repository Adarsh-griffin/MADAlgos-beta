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

## Suggested Subject

`Your Free Test Score: {{testTitle}}`

## Suggested HTML (paste in SendGrid)

```html
<div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #070b18; color: #dbe7ff; border-radius: 18px; border: 1px solid #1c2845;">
  <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #22d3ee;">MADAlgos Free Test</p>
  <h1 style="margin: 0 0 8px; font-size: 24px; color: #fff;">Your score is ready</h1>
  <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.5;">
    {{#if studentName}}Hi {{studentName}},{{else}}Hi,{{/if}}
    we recorded your result for <strong>{{testTitle}}</strong>.
  </p>
  <div style="background: #0d1530; border: 1px solid #22325d; border-radius: 14px; padding: 16px; margin: 12px 0 14px;">
    <p style="margin: 0; font-size: 13px; color: #9fb5df;">Score</p>
    <p style="margin: 6px 0 0; font-size: 28px; line-height: 1.1; font-weight: 800; color: #22d3ee;">
      {{totalScore}} / {{maxScore}}
    </p>
    <p style="margin: 6px 0 0; font-size: 13px; color: #c4d3f3;">{{percentage}}% • {{statusLabel}}</p>
  </div>
  <p style="margin: 0; font-size: 12px; color: #9fb5df;">Submitted at: {{submittedAtDisplay}}</p>
  <p style="margin: 14px 0 0; font-size: 12px; color: #7f95c0;">This is an automated result email.</p>
</div>
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

