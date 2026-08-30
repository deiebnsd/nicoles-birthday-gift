# Nicole's birthday gift

Nicole's birthday gift is a responsive vegetarian recipe matcher. Mark ingredients you have, rule out ingredients you do not, sort recipes by pantry match, open complete recipes with substitutions, or let the app choose dinner for you.

## Run locally

```bash
npm ci
npm run dev
```

## Publish on GitHub Pages

1. Push this project to a GitHub repository on the `main` branch.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The included workflow builds and publishes the static site on every push to `main`.

The static build uses relative asset URLs, so it works both on a user site and under a repository subpath.

To test the Pages build locally:

```bash
npm run build:pages
npx vite preview --outDir github-pages-dist
```

All recipe data currently lives in `app/page.tsx`, so adding another recipe does not require a database.
