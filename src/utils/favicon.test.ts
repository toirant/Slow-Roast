/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('favicon.svg exists and contains signature Slow Roast brand elements', () => {
  const svgPath = path.resolve(process.cwd(), 'public/favicon.svg');
  assert.equal(fs.existsSync(svgPath), true, 'public/favicon.svg must exist');

  const content = fs.readFileSync(svgPath, 'utf8');
  assert.match(content, /<svg[^>]+viewBox="0 0 64 64"/, 'SVG must declare 64x64 viewBox');
  assert.match(content, /#24493A/i, 'Favicon must contain signature deep green #24493A');
  assert.match(content, /#D9633B/i, 'Favicon must contain terracotta accent #D9633B');
  assert.match(content, /#E69A3B/i, 'Favicon must contain warm amber #E69A3B');
  assert.match(content, /rx="1[0-9]"/, 'Favicon should have squircle rounded corners');
});

test('raster favicon and touch icon files exist with valid non-empty byte sizes', () => {
  const expectedFiles = [
    { file: 'public/favicon.ico', minBytes: 1000 },
    { file: 'public/apple-touch-icon.png', minBytes: 1000 },
    { file: 'public/favicon-32x32.png', minBytes: 500 },
    { file: 'public/favicon-16x16.png', minBytes: 200 },
  ];

  for (const { file, minBytes } of expectedFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    assert.equal(fs.existsSync(fullPath), true, `${file} must exist`);
    const stats = fs.statSync(fullPath);
    assert.ok(stats.size >= minBytes, `${file} size (${stats.size}) should be >= ${minBytes} bytes`);
  }
});

test('index.html links to all required favicon types and social thumbnail', () => {
  const indexPath = path.resolve(process.cwd(), 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  assert.match(indexHtml, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg" \/>/);
  assert.match(indexHtml, /<link rel="alternate icon" type="image\/png" sizes="32x32" href="\/favicon-32x32\.png" \/>/);
  assert.match(indexHtml, /<link rel="alternate icon" type="image\/png" sizes="16x16" href="\/favicon-16x16\.png" \/>/);
  assert.match(indexHtml, /<link rel="shortcut icon" href="\/favicon\.ico" \/>/);
  assert.match(indexHtml, /<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png" \/>/);
  assert.match(indexHtml, /<link rel="manifest" href="\/site\.webmanifest" \/>/);
  assert.match(indexHtml, /<meta name="theme-color" content="#24493A" \/>/);
  assert.match(indexHtml, /<meta property="og:image" content="\/assets\/aistudio\/Thumbnail_for_slowroast_5cb48c09\.png" \/>/);
});

test('site.webmanifest is valid JSON and declares icons correctly', () => {
  const manifestPath = path.resolve(process.cwd(), 'public/site.webmanifest');
  assert.equal(fs.existsSync(manifestPath), true, 'public/site.webmanifest must exist');

  const raw = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  assert.equal(manifest.name, 'Slow Roast Coffee Club');
  assert.equal(manifest.theme_color, '#24493A');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);
  assert.ok(manifest.icons.some((i: { src: string }) => i.src === '/favicon.svg'));
  assert.ok(manifest.icons.some((i: { src: string }) => i.src === '/apple-touch-icon.png'));
});
