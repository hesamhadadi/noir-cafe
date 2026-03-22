# NOIR CAFÉ — Scroll-Driven 3D Coffee Experience

## ⚠️ Node.js Version Requirement

**Use Node.js 22 LTS (not 23, 24, or 25)**

Node.js 25 introduced a broken `localStorage` proxy (see [nodejs/node#60303](https://github.com/nodejs/node/issues/60303))
that causes `TypeError: localStorage.getItem is not a function` in SSR frameworks.
This project includes a polyfill that fixes this, but the safest option is Node.js 22 LTS.

```bash
# Check your version
node --version   # should be v22.x.x

# Switch with nvm
nvm install 22
nvm use 22
```

## Stack

| Package | Version |
|---------|---------|
| Next.js | 15.3.0 |
| React | 19.1.0 |
| Three.js | 0.175.0 |
| Tailwind CSS | 4.1.4 |
| TypeScript | 5.8.3 |
| ESLint | 9.25.0 |

## Getting Started

```bash
# 1. Install (Node.js 22 LTS recommended)
npm install

# 2. Run dev (Turbopack)
npm run dev

# 3. If you still get localStorage errors, try webpack mode:
npm run dev:webpack

# 4. Open
open http://localhost:3000
```

## How the localStorage Fix Works

Three layers of protection:

**1. `serverExternalPackages: ["three"]` in `next.config.ts`**
Tells Next.js/Turbopack to never bundle `three` for the server. Three.js code is only loaded client-side.

**2. `src/instrumentation.ts`**
Next.js 15 server hook that runs before anything else. Unconditionally replaces the broken Node.js 25 `localStorage` proxy with a working in-memory implementation using `Object.defineProperty`.

**3. Dynamic imports inside `useEffect`**
All Three.js components use `import("three")` inside `useEffect`, which only runs in the browser. The three.js module never touches the server bundle.

## Project Structure

```
src/
├── app/
│   ├── globals.css          ← Tailwind v4 @import + @theme{}
│   ├── layout.tsx
│   └── page.tsx             ← dynamic() imports for all Three.js components
├── instrumentation.ts       ← localStorage polyfill (Node.js 25 fix)
├── types/index.ts
├── lib/
│   ├── products.ts
│   └── three-scenes.ts      ← All Three.js scene builders
└── components/
    ├── HeroSection.tsx       ← import("three") inside useEffect
    ├── ProductCard.tsx       ← import("three") inside useEffect
    ├── JourneyCanvas.tsx     ← import("three") inside useEffect
    ├── JourneySection.tsx    ← scroll tracker
    ├── JourneyPanel.tsx      ← text steps
    ├── ProductsSection.tsx
    ├── OrderBar.tsx
    ├── Nav.tsx
    ├── Footer.tsx
    └── Cursor.tsx
```

## Build

```bash
npm run build && npm start
```
