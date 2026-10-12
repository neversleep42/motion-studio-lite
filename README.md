# Motion Studio Lite

A small local Remotion playground: edit code, preview an animation, export MP4.

## Included

- A plain React/Remotion code editor.
- Three original examples: title, shapes, counter.
- A six-second, 1280 × 720, 30 fps preview and MP4 export.
- No account, subscription integration, AI provider or API key required.

This edition deliberately has no editing timeline, agent, assistant, research workflow, private prompt library, advanced presets or project database. It does not contain any private studio projects or assets.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5418. Ports 5418, 5419 and 5420 must be free. First export may download Remotion's headless Chrome runtime. Use Ctrl+C to stop.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Edit `Composition.tsx` in the page, choose **Actualiser l’aperçu**, then **Exporter MP4**. Changing code makes the previous preview stale; refresh before exporting. An export always uses the exact compiled preview source. The code editor allows only React and Remotion imports; external assets and package installation are outside this edition.

## Storage and boundaries

Compiled snapshots and exports stay under `.runtime/` (gitignored). Reloading the page resets the editor; keep your own source copy. This is a trusted local code playground, not a sandbox for hostile code or a multi-user hosting service. Servers bind to loopback. Do not expose them to a public network. Preview scripts use a separate origin with a restrictive content policy.

## License

The original application code and examples are MIT licensed. Dependencies retain their own licenses. Remotion has its own licensing terms, including conditions for company use: https://www.remotion.dev/license. An MIT license for this wrapper does not relicense Remotion or promise free use in every commercial scenario.
