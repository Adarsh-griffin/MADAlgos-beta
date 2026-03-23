# SendGrid dynamic templates

## Email verification (mentor apply)

**File:** `email-verification.html`

1. In SendGrid: **Email API** → **Dynamic Templates** → **Create** → **Code Editor**.
2. Paste the HTML from `email-verification.html`.
3. Set **Subject** (required — avoids “(no subject)” in Gmail), e.g.  
   `Verify your email — {{company_name}}`
4. In **Test Data**, use:

```json
{
  "company_name": "MAD Algos",
  "first_name": "Alex",
  "user_name": "Alex",
  "name": "Alex",
  "user_email": "alex@example.com",
  "verify_url": "https://your-site.com/api/auth/verify-email?token=sample-token",
  "verification_link": "https://your-site.com/api/auth/verify-email?token=sample-token"
}
```

The template uses `{{first_name}}` (same value as username from the API). The verification link is valid **48 hours** (matches `src/app/api/auth/mentor/apply/route.ts`).

5. Copy the template ID into `.env` / Azure:

```env
SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID=d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The app sends the same placeholders from `src/lib/mentor-application-emails.ts` (`sendEmailVerificationMail`).

If `SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID` is **not** set, the API sends a plain HTML fallback instead.
