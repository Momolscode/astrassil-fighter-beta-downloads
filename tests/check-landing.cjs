'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'android-stable.json'), 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML ids');
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'Exactly one page title is required');
assert.ok(html.includes('lang="fr"'), 'French page language');
assert.ok(html.includes('name="viewport"'), 'Mobile viewport');
assert.ok(html.includes(manifest.sha256), 'Displayed checksum must match the Android manifest');
assert.ok(html.includes(manifest.apkURL), 'APK download must use the manifest URL');
assert.ok(html.includes('https://play.google.com/apps/testing/com.unum.astrassil'), 'Closed-test link');
assert.ok(html.includes('test fermé'), 'Closed test must not be advertised as a public release');
assert.ok(html.includes('13 ans et plus'), 'Confirmed audience must be retained');
assert.ok(!html.includes('<form'), 'Static landing must not collect credentials');
assert.ok(!html.includes('Inscription ouverte'), 'Do not advertise registration before backend qualification');
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
  assert.ok(fs.existsSync(path.resolve(root, match[1])), `Missing local resource: ${match[1]}`);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
}
for (const match of html.matchAll(/href="([^"]+)"/g)) {
  assert.ok(/^(https:\/\/|\.\/|#|mailto:)/.test(match[1]), `Unsupported link scheme: ${match[1]}`);
}
assert.ok(ids.includes('support-monthly') && ids.includes('support-once') && ids.includes('soutien'), 'Keep existing optional-support script contract');
console.log('PASS: structure, links, anchors, checksum, downloads, age and access notices.');
console.log('Scope: static checks only. Authentication, signup, Android install and gameplay require separate tests.');
