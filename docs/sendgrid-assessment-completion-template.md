# SendGrid dynamic template: assessment completion

Use this when a student finishes (or auto-submits) and their attempt is graded. Set the template ID in your environment:

```bash
SENDGRID_ASSESSMENT_COMPLETION_TEMPLATE_ID=dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The app sends **dynamic template data** (same keys as Handlebars `{{variable}}` in the SendGrid designer).

## Fields provided by MADAlgos

| Variable | Description |
|----------|-------------|
| `testTitle` | Assessment title |
| `totalScore` | Points earned (number) |
| `maxScore` | Maximum points (number) |
| `status` | `COMPLETED` or `AUTO_SUBMITTED` |
| `statusLabel` | Human-readable: “Submitted” or “Auto-submitted (time up)” |
| `submittedAtIso` | ISO 8601 timestamp |
| `submittedAtDisplay` | Locale-formatted date/time for display |
| `baseUrl` | Site base URL (for links) |
| `studentName` | Name from profile, if any (may be empty) |

## Sample HTML (paste into SendGrid → Design → Code editor)

Dark styling matches TestPortal; adjust brand colors as needed.

```html
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellspacing="0" cellpadding="0" style="max-width:520px;background:#050505;border:1px solid #27272a;border-radius:16px;padding:28px 24px;font-family:system-ui,-apple-system,sans-serif;">
          <tr>
            <td style="color:#94a3b8;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">MADAlgos TestPortal</td>
          </tr>
          <tr><td style="height:12px;"></td></tr>
          <tr>
            <td style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Assessment received</td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td style="color:#cbd5e1;font-size:15px;line-height:1.55;">
              Hi{{#if studentName}} {{studentName}}{{else}} there{{/if}}, we’ve saved your submission for <strong style="color:#fff;">{{testTitle}}</strong>.
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          <tr>
            <td style="background:#0f172a;border-radius:12px;padding:16px;border:1px solid #1e293b;">
              <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#e2e8f0;">
                <tr>
                  <td style="padding:6px 0;color:#94a3b8;">Score</td>
                  <td align="right" style="font-weight:700;">{{totalScore}} / {{maxScore}}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#94a3b8;">Status</td>
                  <td align="right">{{statusLabel}}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#94a3b8;">Submitted</td>
                  <td align="right">{{submittedAtDisplay}}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          <tr>
            <td style="color:#64748b;font-size:12px;line-height:1.5;">
              Visit <a href="{{baseUrl}}" style="color:#2dd4bf;text-decoration:none;">{{baseUrl}}</a> for more from MADAlgos.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Subject line (in SendGrid template settings)

Example: `Submission received: {{testTitle}} | MADAlgos`

If no template ID is set, the app sends a simple fallback HTML email without a designer template.
