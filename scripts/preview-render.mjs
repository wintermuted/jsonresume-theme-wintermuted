import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const inputPath = path.join(rootDir, 'examples', 'resume.sample.json');
const outputPath = path.join(rootDir, 'examples', 'preview.html');

const resume = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
const html = render(resume);

fs.writeFileSync(outputPath, html, 'utf-8');
console.log(`Wrote preview HTML to ${outputPath}`);
