# Benjamin Guy Live — Static Site

A lightweight Vite + React + Tailwind build that renders your single-page site.

## Quick Start
1. Install: `npm install`
2. Run dev server: `npm run dev`
3. Build static files: `npm run build`
4. Preview locally: `npm run preview`

The production build outputs to `dist/` which you can deploy on:
- Netlify (drag-drop the `dist/` folder or connect repo)
- Vercel (set **Framework**: Vite; **Build**: `npm run build`; **Output**: `dist`)
- GitHub Pages (push and use Pages from `dist/`)
- Any static host (S3/CloudFront, Firebase Hosting, etc.)

## Notes
- Tailwind is preconfigured via `tailwind.config.js` and `postcss.config.js`.
- The component file lives at `src/BenjaminGuyLiveHome.jsx` and is imported by `src/App.jsx`.
- The "Features" titles are bold & theme-colored; and the copy reads "Acoustic Covers • 50s–Today".
