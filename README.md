<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1z-I8CNjnsswR1c3ogAu4UghtH4zOEt9W

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the source.
3. Add a repository secret named `GEMINI_API_KEY` with your Gemini API key.
4. Push to `main` (or run the workflow manually). The site will deploy to:
   `https://<your-org>.github.io/<your-repo>/`

The workflow in `.github/workflows/deploy.yml` builds the Vite app, adds a `404.html` SPA fallback for GitHub Pages, and publishes the `dist/` folder. The Vite config detects the repository name during GitHub Actions builds so assets resolve correctly on Pages.
