/* Recompress everything under public/assets/images in place.
   Originals are copied to .image-originals/ (git-ignored, never served) first.
   Also emits a <dir>/thumb/<file> variant for certificates so the grid
   loads ~40 small files instead of ~40 multi-megabyte scans.

   Run: node scripts/optimize-images.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'assets', 'images');
const BACKUP = path.join(ROOT, '.image-originals');

const MAX_W = 1600;
const THUMB_W = 640;
const EXT = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'thumb') continue;
      walk(p, out);
    } else if (EXT.has(path.extname(e.name).toLowerCase())) {
      out.push(p);
    }
  }
  return out;
}

function encode(pipeline, ext) {
  return ext === '.png'
    ? pipeline.png({ compressionLevel: 9, palette: true, quality: 80 })
    : pipeline.jpeg({ quality: 72, mozjpeg: true, progressive: true });
}

(async () => {
  const files = walk(SRC);
  let before = 0;
  let after = 0;

  for (const file of files) {
    const rel = path.relative(SRC, file);
    const ext = path.extname(file).toLowerCase();
    const size = fs.statSync(file).size;
    before += size;

    const backup = path.join(BACKUP, rel);
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);

    const meta = await sharp(backup).metadata();

    const full = await encode(
      sharp(backup).rotate().resize({ width: Math.min(MAX_W, meta.width || MAX_W), withoutEnlargement: true }),
      ext,
    ).toBuffer();
    if (full.length < size) fs.writeFileSync(file, full);
    after += Math.min(full.length, size);

    if (rel.split(path.sep)[0] === 'certificates') {
      const thumbDir = path.join(path.dirname(file), 'thumb');
      fs.mkdirSync(thumbDir, { recursive: true });
      const thumb = await encode(
        sharp(backup).rotate().resize({ width: THUMB_W, withoutEnlargement: true }),
        ext,
      ).toBuffer();
      fs.writeFileSync(path.join(thumbDir, path.basename(file)), thumb);
    }
  }

  const mb = (n) => (n / 1048576).toFixed(1);
  console.log(`${files.length} images: ${mb(before)}MB -> ${mb(after)}MB`);
})();
