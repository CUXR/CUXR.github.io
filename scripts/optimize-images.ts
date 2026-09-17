import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';
import { imageUrl, imageWidths, type ImageFormat, type ImagePreset } from '../src/lib/image';

const jobs: { src: string; preset: ImagePreset }[] = [
  { src: '/media/team-photo.webp', preset: 'photo' },
  { src: '/media/info-session.webp', preset: 'photo' },
  ...[1, 3, 4, 6].map((page) => ({ src: `/media/sponsor/packet-${page}.webp`, preset: 'packet' as const })),
  ...(await readdir('public/team/headshots')).filter((name) => name.endsWith('.webp'))
    .map((name) => ({ src: `/team/headshots/${name}`, preset: 'portrait' as const })),
];
const cachePath = 'node_modules/.cache/cuxr-images.json';
const cache: Record<string, string> = JSON.parse(await readFile(cachePath, 'utf8').catch(() => '{}'));
const encoder = await readFile(new URL(import.meta.url));
let generated = 0;
for (const { src, preset } of jobs) {
  const input = await readFile(`public${src}`);
  const signature = createHash('sha256').update(input).update(encoder)
    .update(JSON.stringify(imageWidths[preset])).update(sharp.versions.sharp).digest('hex');
  const outputs = imageWidths[preset].flatMap((width) =>
    (['avif', 'webp', 'jpg'] as ImageFormat[]).map((format) => ({ width, format, path: `public${imageUrl(src, width, format)}` })));
  if (cache[src] === signature && (await Promise.all(outputs.map(({ path }) => stat(path).catch(() => null)))).every(Boolean)) continue;
  await mkdir(dirname(outputs[0].path), { recursive: true });
  for (const { width, format, path } of outputs) {
    const image = sharp(input).rotate().resize({ width, withoutEnlargement: true });
    if (format === 'avif') await image.avif({ quality: 55, effort: 4 }).toFile(path);
    else if (format === 'webp') await image.webp({ quality: 80 }).toFile(path);
    else await image.jpeg({ quality: 82, mozjpeg: true }).toFile(path);
  }
  cache[src] = signature;
  generated++;
}
await mkdir('public/optimized/media', { recursive: true });
await sharp('public/media/bear-poster.png').resize({ width: 1072 }).webp({ quality: 85 }).toFile('public/optimized/media/bear-poster.webp');
await mkdir(dirname(cachePath), { recursive: true });
await writeFile(cachePath, JSON.stringify(cache));
console.log(`Optimized ${generated} photo sources; ${jobs.length - generated} cached.`);
