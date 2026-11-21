# Solvo web (dne-frontend)

Next.js app for **Solvo**: an AI chat that finds the service providers and
product suppliers in your province (Costa Rica first) and lets you contact
them directly. Bilingual (Spanish default, English), works without an account.

- How it works: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Working on it with Claude (design rules included): [CLAUDE.md](CLAUDE.md)
- API: `../dne-backend`

## Run locally

```bash
npm install
# create .env.local (see below)
npm run dev                        # http://localhost:3000 (API must run on :5000)
```

`.env.local`:

| Var | What |
|---|---|
| `NEXT_PUBLIC_API_URL` | API origin, e.g. `http://localhost:5000` |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | NextAuth (social login) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | same Google client as the API |
| `GITHUB_ID`, `GITHUB_SECRET` | GitHub OAuth app |
| `SENTRY_*` | optional |

## Scripts

| Command | What |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `start` | production build / run (`output: 'standalone'`, see `Dockerfile`) |
| `npm run generate-graphql-schema` | regenerate `src/shared/generated` from the running API |
| `npm test` | unit tests |
| `npx tsc --noEmit` | type-check |
