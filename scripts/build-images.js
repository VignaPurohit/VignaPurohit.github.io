/*
 * One-off / re-runnable image pipeline.
 * Reads large source photos from ../portfolio_material (organized into
 * a site-assets/ folder plus one subfolder per project, each with its
 * own images/reports/code) and produces cropped, resized, WebP+JPG
 * pairs into static/assets/. This is a Node/sharp helper script,
 * separate from Hugo itself — Hugo doesn't need it to build or serve
 * the site, only to regenerate these pre-built images from the
 * original source photos.
 *
 * Run with: npm run images
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "..", "portfolio_material");
const SITE_SRC = path.join(SRC, "site-assets");
const GALLERY_SRC = path.join(SITE_SRC, "gallery");
const RISK_PINET_SRC = path.join(SRC, "risk-pinet", "images");
const NCPOR_SRC = path.join(SRC, "antarctic-sea-ice-variability", "images");
const NCPOR_REPORTS_SRC = path.join(SRC, "antarctic-sea-ice-variability", "reports");
const TALLINN_SRC = path.join(SRC, "tallinn-livability-analysis", "images");
const TALLINN_REPORTS_SRC = path.join(SRC, "tallinn-livability-analysis", "reports");
const TALLINN_OUTPUT_SRC = path.join(SRC, "tallinn-livability-analysis", "output");
const TEMP_ANOMALY_SRC = path.join(SRC, "temperature-anomaly-europe", "images");
const TEMP_ANOMALY_REPORTS_SRC = path.join(SRC, "temperature-anomaly-europe", "reports");
const TEMP_ANOMALY_OUTPUT_SRC = path.join(SRC, "temperature-anomaly-europe", "output");

const OUT_IMG = path.join(__dirname, "..", "static", "assets", "images");
const OUT_GALLERY = path.join(OUT_IMG, "gallery");
const OUT_ASSETS = path.join(__dirname, "..", "static", "assets");
const OUT_REPORTS = path.join(OUT_ASSETS, "reports");

fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_GALLERY, { recursive: true });
fs.mkdirSync(OUT_REPORTS, { recursive: true });

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
  const mockupPath = path.join(SITE_SRC, "site front.png");
  const mockup = sharp(mockupPath);
  const heroBand = await mockup
    .clone()
    .extract({ left: 0, top: 905, width: 1024, height: 631 })
    .toBuffer();
  await emit(heroBand, path.join(OUT_IMG, "hero-band"), { width: 1024, quality: 85 });

  // --- Hero collage photo 1: main portrait ---
  const profilePath = path.join(SITE_SRC, "profile.png");
  await emit(fs.readFileSync(profilePath), path.join(OUT_IMG, "hero-profile"), {
    width: 800,
    quality: 85,
  });

  // --- Hero collage photo 2: speaking with mic (striped sweater) ---
  const speakingSrc = path.join(SITE_SRC, "SSS_5806.jpg");
  const speakingCrop = await sharp(speakingSrc)
    .extract({ left: 2260, top: 1010, width: 900, height: 1050 })
    .toBuffer();
  await emit(speakingCrop, path.join(OUT_IMG, "hero-speaking"), { width: 700, quality: 82 });

  // --- Hero collage photo 3: laptop / grey jacket ---
  const laptopSrc = path.join(SITE_SRC, "about.png");
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
    const inSiteAssets = path.join(SITE_SRC, file);
    const inGallery = path.join(GALLERY_SRC, file);
    const p = fs.existsSync(inSiteAssets) ? inSiteAssets : inGallery;
    if (!fs.existsSync(p)) {
      console.warn("skip missing", file);
      continue;
    }
    const outBase = path.join(OUT_GALLERY, `workshop-${String(i).padStart(2, "0")}`);
    await emit(fs.readFileSync(p), outBase, { width: 1100, quality: 78 });
    i++;
  }

  // --- RISK-PiNET QGIS application screenshot (full UI, not cropped) ---
  const riskPinetSrc = path.join(RISK_PINET_SRC, "risk-pinet.png");
  if (fs.existsSync(riskPinetSrc)) {
    await emit(fs.readFileSync(riskPinetSrc), path.join(OUT_IMG, "risk-pinet-qgis"), {
      width: 1400, // native is 1494px wide; keep text crisp, don't crop
      quality: 92, // higher than photo quality - this is UI text, not a photo
    });
  }

  // --- RISK-PiNET project logo (transparent PNG - keep as PNG, don't
  //     run through the lossy JPEG pipeline above, which would flatten
  //     the transparency onto a white/black background) ---
  const riskPinetLogoSrc = path.join(RISK_PINET_SRC, "risk-pinet-logo-200.png");
  if (fs.existsSync(riskPinetLogoSrc)) {
    fs.copyFileSync(riskPinetLogoSrc, path.join(OUT_IMG, "risk-pinet-logo.png"));
    console.log("wrote", "static/assets/images/risk-pinet-logo.png");
  }

  // --- NCPOR Antarctic sea-ice internship: figures extracted from the
  //     report (charts/maps with fine text, so re-encode at higher
  //     quality than the photo pipeline above to keep labels crisp) ---
  const ncporFigures = [
    "ncpor-bathymetry",
    "ncpor-polynya-area-chart",
    "ncpor-polynya-photo",
    "ncpor-wind-pressure",
    "ncpor-chlorophyll",
    "ncpor-sea-ice-extent",
    "ncpor-sensible-heat-polynyas",
    "ncpor-latent-heat-polynyas",
    "ncpor-reprojection",
    "ncpor-heat-flux-anomaly",
    "ncpor-extreme-values",
    "ncpor-chlorophyll-log",
    "ncpor-primary-production",
    "ncpor-sea-ice-drift",
    "ncpor-adt",
    "ncpor-sst",
    "ncpor-upwelling-windstress",
    "ncpor-ocean-current",
    "ncpor-graphs-analysis",
    "ncpor-sea-ice-climatology",
  ];
  for (const name of ncporFigures) {
    const p = path.join(NCPOR_SRC, name + ".png");
    if (fs.existsSync(p)) {
      await emit(fs.readFileSync(p), path.join(OUT_IMG, name), { width: 1400, quality: 90 });
    }
  }
  const ncporReport = path.join(NCPOR_REPORTS_SRC, "internship_report.pdf");
  if (fs.existsSync(ncporReport)) {
    fs.copyFileSync(ncporReport, path.join(OUT_REPORTS, "NCPOR-Antarctic-Sea-Ice-Internship-Report.pdf"));
    console.log("wrote", "static/assets/reports/NCPOR-Antarctic-Sea-Ice-Internship-Report.pdf");
  }

  // --- Tallinn livability: report figures, screenshot, and the
  //     full-size interactive Folium/Leaflet map + methodology PDF ---
  const tallinnFigures = [
    { src: "screenshot_cropped.png", out: "tallinn-livability-map-detail", width: 1400, quality: 88 },
    { src: "chart_final_dist.png", out: "tallinn-score-distribution", width: 1400, quality: 90 },
    { src: "chart_validation.png", out: "tallinn-validation", width: 1400, quality: 90 },
    { src: "screenshot-2.png", out: "tallinn-illustration", width: 900, quality: 88 },
  ];
  for (const fig of tallinnFigures) {
    const p = path.join(TALLINN_SRC, fig.src);
    if (fs.existsSync(p)) {
      await emit(fs.readFileSync(p), path.join(OUT_IMG, fig.out), { width: fig.width, quality: fig.quality });
    }
  }
  const tallinnPdf = path.join(TALLINN_REPORTS_SRC, "tallinn_livability_methodology.pdf");
  if (fs.existsSync(tallinnPdf)) {
    fs.copyFileSync(tallinnPdf, path.join(OUT_REPORTS, "Tallinn-Livability-Methodology.pdf"));
    console.log("wrote", "static/assets/reports/Tallinn-Livability-Methodology.pdf");
  }
  const tallinnMap = path.join(TALLINN_OUTPUT_SRC, "tallinn_livability_map_searchable.html");
  if (fs.existsSync(tallinnMap)) {
    fs.copyFileSync(tallinnMap, path.join(OUT_ASSETS, "tallinn-livability-map.html"));
    console.log("wrote", "static/assets/tallinn-livability-map.html");
  }

  // --- European city temperature anomaly: report figures, the interactive
  //     per-city Folium map, and the climate analysis report PDF ---
  const tempAnomalyFigures = [
    { src: "temperature-anomaly-map-2024.png", out: "temperature-anomaly-map-2024", width: 1400, quality: 90 },
    { src: "temperature-anomaly-distribution.png", out: "temperature-anomaly-distribution", width: 1400, quality: 90 },
    { src: "temperature-anomaly-top-cities.png", out: "temperature-anomaly-top-cities", width: 1400, quality: 90 },
    { src: "temperature-anomaly-validation.png", out: "temperature-anomaly-validation", width: 1400, quality: 90 },
  ];
  for (const fig of tempAnomalyFigures) {
    const p = path.join(TEMP_ANOMALY_SRC, fig.src);
    if (fs.existsSync(p)) {
      await emit(fs.readFileSync(p), path.join(OUT_IMG, fig.out), { width: fig.width, quality: fig.quality });
    }
  }
  const tempAnomalyPdf = path.join(TEMP_ANOMALY_REPORTS_SRC, "European-City-Temperature-Anomaly-Report.pdf");
  if (fs.existsSync(tempAnomalyPdf)) {
    fs.copyFileSync(tempAnomalyPdf, path.join(OUT_REPORTS, "European-City-Temperature-Anomaly-Report.pdf"));
    console.log("wrote", "static/assets/reports/European-City-Temperature-Anomaly-Report.pdf");
  }
  const tempAnomalyMap = path.join(TEMP_ANOMALY_OUTPUT_SRC, "europe_temperature_anomaly_cities_map.html");
  if (fs.existsSync(tempAnomalyMap)) {
    fs.copyFileSync(tempAnomalyMap, path.join(OUT_ASSETS, "europe-temperature-anomaly-map.html"));
    console.log("wrote", "static/assets/europe-temperature-anomaly-map.html");
  }

  // --- CV passthrough ---
  fs.copyFileSync(path.join(SITE_SRC, "Vigna-CV.pdf"), path.join(OUT_ASSETS, "Vigna-CV.pdf"));

  console.log("\nImage pipeline complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
