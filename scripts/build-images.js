/*
 * One-off / re-runnable image pipeline.
 * Reads large source photos from ../portfolio_material and produces
 * cropped, resized, WebP+JPG pairs into src/assets/images/.
 *
 * Run with: npm run images
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "..", "portfolio_material");
const OUT_IMG = path.join(__dirname, "..", "src", "assets", "images");
const OUT_GALLERY = path.join(OUT_IMG, "gallery");
const OUT_ASSETS = path.join(__dirname, "..", "src", "assets");
const OUT_NOTEBOOKS = path.join(OUT_ASSETS, "notebooks");

fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_GALLERY, { recursive: true });
fs.mkdirSync(OUT_NOTEBOOKS, { recursive: true });

async function emit(inputBuffer, outBaseNoExt, { width, quality = 82 } = {}) {
  let pipeline = sharp(inputBuffer);
  if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
  const jpgPath = outBaseNoExt + ".jpg";
  const webpPath = outBaseNoExt + ".webp";
  await pipeline.clone().jpeg({ quality, mozjpeg: true }).toFile(jpgPath);
  await pipeline.clone().webp({ quality }).toFile(webpPath);
  console.log("wrote", path.relative(process.cwd(), jpgPath), "+ webp");
}

async function main() {
  // --- Hero art band: crop out of the mockup, below the text label ---
  const mockupPath = path.join(SRC, "site front.png");
  const mockup = sharp(mockupPath);
  const heroBand = await mockup
    .clone()
    .extract({ left: 0, top: 905, width: 1024, height: 631 })
    .toBuffer();
  await emit(heroBand, path.join(OUT_IMG, "hero-band"), { width: 1024, quality: 85 });

  // --- Hero collage photo 1: main portrait ---
  const profilePath = path.join(SRC, "profile.png");
  await emit(fs.readFileSync(profilePath), path.join(OUT_IMG, "hero-profile"), {
    width: 800,
    quality: 85,
  });

  // --- Hero collage photo 2: speaking with mic (striped sweater) ---
  const speakingSrc = path.join(SRC, "SSS_5806.jpg");
  const speakingCrop = await sharp(speakingSrc)
    .extract({ left: 2260, top: 1010, width: 900, height: 1050 })
    .toBuffer();
  await emit(speakingCrop, path.join(OUT_IMG, "hero-speaking"), { width: 700, quality: 82 });

  // --- Hero collage photo 3: laptop / grey jacket ---
  const laptopSrc = path.join(SRC, "about.png");
  const laptopCrop = await sharp(laptopSrc)
    .extract({ left: 2680, top: 1780, width: 950, height: 1340 })
    .toBuffer();
  await emit(laptopCrop, path.join(OUT_IMG, "hero-laptop"), { width: 700, quality: 82 });

  // --- Workshop / conference gallery (Experience page) ---
  const galleryFiles = [
    "about.png",
    "SSS_5806.jpg",
    "SSS_5807.jpg",
    "[000063].jpg",
    "[000066].jpg",
    "[000069].jpg",
    "[000091].jpg",
    "[000104].jpg",
    "[000125].jpg",
    "[000137].jpg",
    "[000199].jpg",
  ];
  let i = 1;
  for (const file of galleryFiles) {
    const p = path.join(SRC, file);
    if (!fs.existsSync(p)) {
      console.warn("skip missing", file);
      continue;
    }
    const outBase = path.join(OUT_GALLERY, `workshop-${String(i).padStart(2, "0")}`);
    await emit(fs.readFileSync(p), outBase, { width: 1100, quality: 78 });
    i++;
  }

  // --- CV + notebooks passthrough ---
  fs.copyFileSync(path.join(SRC, "Vigna-CV.pdf"), path.join(OUT_ASSETS, "Vigna-CV.pdf"));
  fs.copyFileSync(
    path.join(SRC, "DuckDB_Geospatial.ipynb"),
    path.join(OUT_NOTEBOOKS, "DuckDB_Geospatial.ipynb")
  );
  fs.copyFileSync(
    path.join(SRC, "interactiveMap_geonames.ipynb"),
    path.join(OUT_NOTEBOOKS, "interactiveMap_geonames.ipynb")
  );

  console.log("\nImage pipeline complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
