# Samvit Quality Dashboard

Health Check, Workers and Quality Dimensions for Samvit's screening data, read from
`public/dashboard.json` and `public/map.json` (written by `dqs dashboard export`;
DASHBOARD.md describes every field).

Built with Next.js (static export), shadcn/ui components styled with the Figma tokens in
`tailwind.config.ts` / `src/lib/tokens.ts`, Recharts (via shadcn Chart) for the worker's
score chart, Apache ECharts for the taluk map, and Material Symbols (weight 300) for icons.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm start        # serves out/
npm run lint     # type-check
```

Set `NEXT_PUBLIC_BASE_PATH` (for example `/dashboard`) to serve the site from a sub-folder.
The data files must sit at the site's root, beside the pages.
