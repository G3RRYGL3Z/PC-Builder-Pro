This repo ships a Vite + React app. Use any of the following quick ways to get a shareable URL for recruiters and users.

1) Vercel (recommended)
- Go to https://vercel.com/new
- Select your Git provider and repo.
- Set Framework Preset: "Vite"
- Build Command: npm run build:prod
- Output Directory: dist
- Environment: leave default
- Click Deploy. Vercel will give you a shareable URL like `https://your-app.vercel.app`.

2) Netlify
- Drag & drop: Build the project locally using `npm run build:prod` and upload the `dist/` folder to Netlify Drop: https://app.netlify.com/drop
- Or connect via Git: Create a new site from Git and use build command `npm run build:prod` and publish directory `dist`.

Automated Netlify deploy via GitHub Actions
- A workflow ` .github/workflows/netlify-deploy.yml` is included. To use it you must add the following repository secrets in GitHub:
	- `NETLIFY_AUTH_TOKEN` — a personal access token (from Netlify user settings)
	- `NETLIFY_SITE_ID` — your Netlify site ID (found in Site settings → General → Site details)
	- (optional) `NETLIFY_SITE_URL` — your site URL (e.g. https://your-site.netlify.app) which the workflow will print after deploy

After you push to `main` the workflow will build and deploy the `dist/` folder to the site specified by `NETLIFY_SITE_ID` and the logs will indicate the deployed URL.

3) GitHub Pages (quick static)
- Install gh-pages: `npm i -D gh-pages rimraf`
- Run `npm run deploy:gh-pages`
- The site will be published at `https://<your-username>.github.io/<repo-name>/` (depending on repository settings).

Notes:
- This project uses relative paths (homepage: ./) so it works on subpaths like GitHub Pages.
- If you use Vercel or Netlify, they will give you a transient preview URL and a production URL after deployment.

Commands to run locally before deploying:

```powershell
npm install
npm run build:prod
npm run preview
```

Automatic deploys to GitHub Pages are enabled:

- A GitHub Actions workflow (.github/workflows/gh-pages-deploy.yml) is included and will run on push to `main`.
- The workflow builds the app and deploys the `dist/` folder to GitHub Pages using `peaceiris/actions-gh-pages`.
- After deployment the workflow runs `npm run print-deploy-url` and prints the final URL in the action logs. Look for the action step "Print deploy URL" in the workflow run to see the exact URL.

If you'd like, I can also:
- Update your repository README automatically with the deployed URL after a successful deploy.
- Switch the workflow to deploy to Netlify or Vercel instead, if you prefer those providers.
