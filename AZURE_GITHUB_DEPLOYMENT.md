# Azure + GitHub Deployment for MADAlgos Next.js

This document explains how to deploy the project to Azure App Service using GitHub.
It includes the required GitHub secrets, Azure App Service configuration, and the recommended flow for connecting the repo to Azure.

> Important: do not commit `.env.local` or any secret values into the repository. Use GitHub secrets and Azure App Service environment variables instead.

## 1. Push all code to GitHub

1. Create a GitHub repository for this project.
2. Ensure the Next.js app code is in the repo and pushed to `main`.
3. If the app lives in a subfolder, preserve that structure and use the correct path when Azure asks for the folder.

## 2. Add environment variables

### 2.1 GitHub secrets

In GitHub repo: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`.
Add the secrets your app needs at build and deploy time.

Recommended secrets:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `SendGridDevKey`
- `SENDGRID_API_KEY`
- `SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID`
- `SENDGRID_MENTOR_APPLY_TEMPLATE_ID`
- `SENDGRID_MENTOR_ACCEPTED_TEMPLATE_ID`
- `SENDGRID_MENTOR_PROFILE_SUBMITTED_TEMPLATE_ID`
- `SENDGRID_MENTOR_PROFILE_LIVE_TEMPLATE_ID`
- `MAIL_FROM`
- `MONGODB_URI`
- `JWT_SECRET`
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_BROCHURE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_WEBAPP_PUBLISH_PROFILE` (if using a manual custom workflow)

> Use the values from your production environment. GitHub secrets are encrypted and not visible in the repo.

### 2.2 Azure App Service environment variables

In Azure Portal: open your App Service → `Settings` → `Configuration` → `Application settings`.
Add the same runtime values that the app requires.

Recommended App Service settings:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `SendGridDevKey`
- `SENDGRID_API_KEY`
- `SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID`
- `SENDGRID_MENTOR_APPLY_TEMPLATE_ID`
- `SENDGRID_MENTOR_ACCEPTED_TEMPLATE_ID`
- `SENDGRID_MENTOR_PROFILE_SUBMITTED_TEMPLATE_ID`
- `SENDGRID_MENTOR_PROFILE_LIVE_TEMPLATE_ID`
- `MAIL_FROM`
- `MONGODB_URI`
- `JWT_SECRET`
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_BROCHURE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING`

> `NEXT_PUBLIC_...` vars are exposed to the browser. Only add the values that your public pages really need.

## 3. Delete any existing GitHub workflow file first

If the repo already contains an old workflow file in `.github/workflows/`, delete it before connecting the repo to Azure.

Steps:
1. In GitHub, go to `.github/workflows/`.
2. Delete any old YAML files that were created by a previous Azure connect or old CI.
3. Commit the deletion to `main`.

This prevents duplicate or conflicting workflow files when Azure creates a new one.

## 4. Connect GitHub repo to Azure Deployment Center

1. Open Azure Portal and select your App Service.
2. In the App Service menu, select `Deployment Center`.
3. Under `Source`, choose `GitHub`.
4. Authenticate with GitHub if needed.
5. Select the correct GitHub organization, repository, and branch: `main`.
6. Select the build provider. For most Next.js deployments, choose `GitHub Actions`.
7. Confirm and finish the wizard.

Azure will then create a workflow file automatically in your GitHub repo under `.github/workflows/`.

> If Azure Deployment Center does not create the workflow automatically, you can still add a custom workflow file manually.

## 5. Add or review the workflow file

### Option A: Azure creates the workflow automatically

- After connecting, Azure should add a new workflow file like `.github/workflows/azure_webapps.yml`.
- Go to GitHub `Actions` and verify the workflow exists.
- The workflow should run when you push to `main`.

### Option B: Use a custom workflow file

If you want a custom GitHub Actions pipeline, create a file such as `.github/workflows/azure-deploy.yml`.

Example workflow:

```yaml
name: Azure Web App Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY: ${{ secrets.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }}
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          NEXT_PUBLIC_BROCHURE_URL: ${{ secrets.NEXT_PUBLIC_BROCHURE_URL }}

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v4
        with:
          app-name: '<YOUR_AZURE_APP_NAME>'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: '.'
```

1. Replace `<YOUR_AZURE_APP_NAME>` with your App Service name.
2. Add `AZURE_WEBAPP_PUBLISH_PROFILE` as a GitHub secret by downloading the publish profile from Azure Portal.
3. Commit the workflow file to `main`.

## 6. Commit and push

- After deleting the old workflow and/or adding the new workflow, commit the changes.
- Push to `main`.
- GitHub Actions will start a new deployment run.

## 7. Check GitHub Actions and website

1. In GitHub, open the `Actions` tab.
2. Find the workflow run from the new commit.
3. Confirm `build` and `deploy` both succeed.
4. Open your Azure App Service URL to verify the live website.

## 8. Notes and troubleshooting

- If Azure creates a workflow automatically, the file will usually be placed in `.github/workflows/`.
- If the app is inside a subfolder, configure the workflow or Deployment Center path accordingly.
- Make sure secrets are present in both GitHub and Azure Portal.
- If the website does not update, inspect the GitHub Actions logs and the Azure App Service deployment logs.

## 9. Quick checklist

- [ ] Repo code pushed to GitHub
- [ ] Old `.github/workflows` files deleted
- [ ] GitHub secrets added
- [ ] Azure App Service settings added
- [ ] GitHub repo connected in Azure Deployment Center
- [ ] Workflow file created or custom workflow committed
- [ ] `main` branch pushed
- [ ] GitHub Actions pass
- [ ] Website updated
