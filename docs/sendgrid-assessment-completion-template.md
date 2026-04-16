# SendGrid dynamic template: test completion

Sent when a student **finishes** (or auto-submits). This email is a **confirmation only** — it does **not** include scores or results. Set the template ID in your environment:

```bash
SENDGRID_ASSESSMENT_COMPLETION_TEMPLATE_ID=dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The app sends **dynamic template data** (Handlebars `{{variable}}` in SendGrid).

## Fields provided by MADAlgos

| Variable | Description |
|----------|-------------|
| `testTitle` | Assessment title |
| `submittedAtIso` | ISO 8601 timestamp (support / reference) |
| `submittedAtDisplay` | Locale-formatted date/time |
| `baseUrl` | Site base URL (for links) |
| `studentName` | Name from profile, if any (may be empty) |

There are **no** `totalScore`, `maxScore`, or `status` fields in the payload.

## Sample HTML (paste into SendGrid → Design → Code editor)

Premium dark layout with logo — **completion message only** (no score block). Logo: `https://madalgos.in/logo.png`.

**Preheader** (hidden inbox preview): no scores.

```html
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{testTitle}} — MADAlgos</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#030712;opacity:0;">
    ✅ Test submitted · {{testTitle}} · {{submittedAtDisplay}}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#030712;background-image:linear-gradient(180deg,#0f172a 0%,#030712 45%,#020617 100%);">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;border-radius:24px;background:linear-gradient(135deg,rgba(45,212,191,0.35) 0%,rgba(15,23,42,0.9) 40%,rgba(234,179,8,0.12) 100%);padding:1px;">
          <tr>
            <td style="border-radius:23px;background-color:#050508;padding:0;box-shadow:0 25px 80px rgba(0,0,0,0.55);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#0d9488 0%,#2dd4bf 35%,#eab308 100%);border-radius:23px 23px 0 0;"></td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
                <tr>
                  <td style="padding:32px 32px 20px;text-align:center;">
                    <img src="https://madalgos.in/logo.png" alt="MADAlgos" width="160" height="auto" style="display:block;margin:0 auto 20px;max-width:160px;border:0;" />
                    <p style="margin:0 0 8px;font-size:44px;line-height:1;" aria-hidden="true">✅</p>
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#5eead4;">TestPortal</p>
                    <h1 style="margin:0;font-size:26px;font-weight:800;line-height:1.25;color:#f8fafc;letter-spacing:-0.02em;">Test complete</h1>
                    <p style="margin:14px 0 0;font-size:15px;line-height:1.65;color:#94a3b8;">
                      Hi{{#if studentName}} <span style="color:#e2e8f0;font-weight:600;">{{studentName}}</span>{{else}} there{{/if}}, thank you. We’ve received your submission for
                      <span style="color:#f1f5f9;font-weight:600;">{{testTitle}}</span>.
                    </p>
                    <p style="margin:18px 0 0;font-size:13px;color:#64748b;">Recorded {{submittedAtDisplay}}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 28px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:14px;background:rgba(15,23,42,0.55);border:1px solid rgba(51,65,85,0.6);">
                      <tr>
                        <td style="padding:16px 20px;text-align:center;">
                          <p style="margin:0;font-size:12px;color:#64748b;">Reference ID</p>
                          <p style="margin:6px 0 0;font-size:11px;font-family:ui-monospace,Menlo,Consolas,monospace;color:#94a3b8;word-break:break-all;">{{submittedAtIso}}</p>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">
                      <tr>
                        <td align="center">
                          <a href="{{baseUrl}}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;color:#020617;background:linear-gradient(135deg,#2dd4bf 0%,#14b8a6 100%);box-shadow:0 12px 32px rgba(45,212,191,0.28);border:1px solid rgba(167,243,208,0.35);">
                            Visit MADAlgos
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:22px 0 0;font-size:12px;line-height:1.65;color:#64748b;text-align:center;">
                      Need help? Reply to this email or go to
                      <a href="{{baseUrl}}" style="color:#5eead4;text-decoration:none;font-weight:600;">madalgos.in</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px 28px;border-top:1px solid rgba(51,65,85,0.45);text-align:center;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#475569;">Algorithms · System design · Interview readiness</p>
                    <p style="margin:10px 0 0;font-size:11px;color:#334155;">© MADAlgos · This message confirms your test was submitted.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Design notes

- **No scores** in template or app payload — if you see old `{{totalScore}}` fields in SendGrid, remove them from your designer.
- **Logo**: HTTPS URL; change `src` if you use another host.
- **Gradients**: many clients support; others still render a solid dark background.

## Subject line (in SendGrid template settings)

Use plain, normal wording. **Recommended** (same as the app fallback when no template is set):

`Test completed: {{testTitle}} | MADAlgos`

Alternatives:

- `Assessment completed: {{testTitle}} | MADAlgos`
- `Your test has been submitted — {{testTitle}} | MADAlgos`

If no template ID is set, the app sends the fallback HTML email with subject **`Test completed: … | MADAlgos`** (also without scores).
