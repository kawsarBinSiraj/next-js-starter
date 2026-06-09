/*
 * Why this file exists:
 * TypeScript does not read CSS files as code, so an import like
 * `import "./globals.css";` can appear invalid to the type checker even
 * though Next.js can bundle and apply the CSS correctly.
 *
 * How this is used:
 * The declaration below tells TypeScript that any `*.css` import is valid.
 * Because `tsconfig.json` includes TypeScript files throughout the project,
 * this `.d.ts` file is loaded automatically across the app. No manual import
 * is needed.
 */
declare module "*.css";
