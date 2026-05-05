/**
 * Gera os assets de ícone do app a partir do SVG da logo TEA.
 * Uso: node scripts/generate-icons.mjs
 */

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, '../assets/images');

mkdirSync(ASSETS, { recursive: true });

function render(svgStr, outputPath) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'original' } });
  const png = resvg.render();
  writeFileSync(outputPath, png.asPng());
  console.log('✓', outputPath.replace(resolve(__dirname, '..') + '/', ''));
}

// ── SVGs ────────────────────────────────────────────────────────────────────

// icon.png  →  1024×1024, fundo branco com cantos arredondados (iOS + fallback)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <rect width="1024" height="1024" rx="230" fill="white"/>
  <g transform="translate(512,512) scale(21.333) translate(-16,-16)">
    <path d="M13 22V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H15.5V22H13Z" fill="#1D54D3"/>
    <circle cx="10" cy="10" r="1.5" fill="#10B981"/>
  </g>
</svg>`;

// android-icon-foreground.png  →  1024×1024, fundo transparente
// A logo ocupa a safe zone central de 66% (174px de padding em cada lado)
// Em termos do viewBox 32×32: padding = 5.44 unidades por lado → novo viewBox "-5.44 -5.44 42.88 42.88"
const svgForeground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5.44 -5.44 42.88 42.88" width="1024" height="1024" fill="none">
  <path d="M13 22V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H15.5V22H13Z" fill="#1D54D3"/>
  <circle cx="10" cy="10" r="1.5" fill="#10B981"/>
</svg>`;

// android-icon-background.png  →  1024×1024, branco sólido
const svgBackground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="white"/>
</svg>`;

// splash-icon.png  →  200×200, logo completa (Expo centraliza no splash)
const svgSplash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="200" height="200" fill="none">
  <rect width="32" height="32" rx="8" fill="white"/>
  <path d="M13 22V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H15.5V22H13Z" fill="#1D54D3"/>
  <circle cx="10" cy="10" r="1.5" fill="#10B981"/>
</svg>`;

// favicon.png  →  48×48 para web
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="48" height="48" fill="none">
  <rect width="32" height="32" rx="8" fill="#1D54D3"/>
  <path d="M13 22V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H15.5V22H13Z" fill="white"/>
  <circle cx="10" cy="10" r="1.5" fill="#10B981"/>
</svg>`;

// ── Render ───────────────────────────────────────────────────────────────────

render(svgIcon,       join(ASSETS, '../..', 'assets/images/icon.png'));
render(svgForeground, join(ASSETS, 'android-icon-foreground.png'));
render(svgBackground, join(ASSETS, 'android-icon-background.png'));
render(svgSplash,     join(ASSETS, 'splash-icon.png'));
render(svgFavicon,    join(ASSETS, 'favicon.png'));

console.log('\nDone! Rebuild the app to aplicar os novos ícones.');
