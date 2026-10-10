/*
 * One-off / re-runnable image pipeline.
 * Reads large source photos from ../portfolio_material and produces
 * cropped, resized, WebP+JPG pairs into static/assets/images/.
 * This is a Node/sharp helper script, separate from Hugo itself —
 * Hugo doesn't need it to build or serve the site, only to regenerate
 * these pre-built images from the original source photos.
 *
 * Run with: npm run images
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "..", "portfolio_material");
const OUT_IMG = path.join(__dirname, "..", "static", "assets", "images");
const OUT_GALLERY = path.join(OUT_IMG, "gallery");
const OUT_ASSETS = path.join(__dirname, "..", "static", "assets");
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

  // --- RISK-PiNET QGIS application screenshot (full UI, not cropped) ---
  const riskPinetSrc = path.join(SRC, "risk-pinet.png");
  if (fs.existsSync(riskPinetSrc)) {
    await emit(fs.readFileSync(riskPinetSrc), path.join(OUT_IMG, "risk-pinet-qgis"), {
      width: 1400, // native is 1494px wide; keep text crisp, don't crop
      quality: 92, // higher than photo quality - this is UI text, not a photo
    });
  }

  // --- RISK-PiNET project logo (transparent PNG - keep as PNG, don't
  //     run through the lossy JPEG pipeline above, which would flatten
  //     the transparency onto a white/black background) ---
  const riskPinetLogoSrc = path.join(SRC, "risk-pinet-logo-200.png");
  if (fs.existsSync(riskPinetLogoSrc)) {
    fs.copyFileSync(riskPinetLogoSrc, path.join(OUT_IMG, "risk-pinet-logo.png"));
    console.log("wrote", "static/assets/images/risk-pinet-logo.png");
  }

  // --- NCPOR Antarctic sea-ice internship: figures extracted from the
  //     report (charts/maps with fine text, so re-encode at higher
  //     quality than the photo pipeline above to keep labels crisp) ---
  const ncporFigures = [
    { src: "ncpor-bathymetry.png", out: "ncpor-bathymetry" },
    { src: "ncpor-polynya-area-chart.png", out: "ncpor-polynya-area-chart" },
    { src: "ncpor-polynya-photo.png", out: "ncpor-polynya-photo" },
    { src: "ncpor-wind-pressure.png", out: "ncpor-wind-pressure" },
    { src: "ncpor-chlorophyll.png", out: "ncpor-chlorophyll" },
  ];
  for (const fig of ncporFigures) {
    const p = path.join(SRC, fig.src);
    if (fs.existsSync(p)) {
      await emit(fs.readFileSync(p), path.join(OUT_IMG, fig.out), { width: 1400, quality: 90 });
    }
  }

  // --- CV + notebooks + reports passthrough ---
  fs.copyFileSync(path.join(SRC, "Vigna-CV.pdf"), path.join(OUT_ASSETS, "Vigna-CV.pdf"));
  fs.copyFileSync(
    path.join(SRC, "DuckDB_Geospatial.ipynb"),
    path.join(OUT_NOTEBOOKS, "DuckDB_Geospatial.ipynb")
  );
  fs.copyFileSync(
    path.join(SRC, "interactiveMap_geonames.ipynb"),
    path.join(OUT_NOTEBOOKS, "interactiveMap_geonames.ipynb")
  );
  const OUT_REPORTS = path.join(OUT_ASSETS, "reports");
  fs.mkdirSync(OUT_REPORTS, { recursive: true });
  fs.copyFileSync(
    path.join(SRC, "internship_report.pdf"),
    path.join(OUT_REPORTS, "NCPOR-Antarctic-Sea-Ice-Internship-Report.pdf")
  );

  console.log("\nImage pipeline complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
