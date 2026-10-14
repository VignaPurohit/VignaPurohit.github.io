import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
import mapclassify
from fpdf import FPDF, FontFace
from fpdf.enums import XPos, YPos
from pathlib import Path
from PIL import Image

# Run this script from the project root (same folder as the notebooks) --
# it reads ./data and writes charts + the final PDF back into this folder.
PROJECT_DIR = Path(__file__).resolve().parent
DATA_DIR = PROJECT_DIR / "data"
OUT_DIR = PROJECT_DIR

plt.rcParams.update({
    "font.size": 10, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.alpha": 0.25, "figure.dpi": 150,
})

# ---------------------------------------------------------------- load data
buildings = gpd.read_file(DATA_DIR / "tallinn_livability_base.gpkg", layer="buildings_final_score")
CATEGORIES = ["transit", "grocery", "gym", "greenblue"]
CATEGORY_COLORS = {"Very Low": "#d73027", "Low": "#fc8d59", "Medium": "#d9a441",
                    "High": "#91cf60", "Very High": "#1a9850"}
if "district" not in buildings.columns:
    buildings["district"] = buildings["taisaadress"].str.split(", ").str[2]

score = buildings["final_score_geomean"].to_numpy()
classifier = mapclassify.NaturalBreaks(score, k=5)
bins = classifier.bins
labels = ["Very Low", "Low", "Medium", "High", "Very High"]

# ---------------------------------------------------------------- chart 1: final score distribution + categories
fig, ax = plt.subplots(figsize=(6.8, 2.9))
ax.hist(score, bins=40, color="#c9c4b6", edgecolor="white")
lo = 0
for b, lbl in zip(bins, labels):
    ax.axvspan(lo, b, color=CATEGORY_COLORS[lbl], alpha=0.15)
    lo = b
ax.set_xlabel("final livability score (0 to 100)")
ax.set_ylabel("buildings")
ax.set_title("Final score distribution, colored by livability category")
plt.tight_layout()
plt.savefig(OUT_DIR / "chart_final_dist.png", bbox_inches="tight")
plt.close()

# ---------------------------------------------------------------- chart 2: simple sensitivity check (plain language)
dist = buildings[[f"{c}_dist_m" for c in CATEGORIES]].to_numpy()
baseline_bins = np.array(bins)
baseline_cat = np.digitize(score, baseline_bins[:-1], right=True)
BASE_THRESHOLDS_M = np.array([400, 900, 1000, 600])

def winsor_minmax(x):
    lo_, hi_ = np.percentile(x, 5), np.percentile(x, 95)
    if hi_ == lo_:
        return np.full_like(x, 50.0)
    return np.clip((x - lo_) / (hi_ - lo_) * 100, 0, 100)

def plain_minmax(x):
    lo_, hi_ = x.min(), x.max()
    if hi_ == lo_:
        return np.full_like(x, 50.0)
    return np.clip((x - lo_) / (hi_ - lo_) * 100, 0, 100)

def percentile_rank(x):
    return pd.Series(x).rank(pct=True).to_numpy() * 100

NORM_METHODS = {"winsor_minmax": winsor_minmax, "plain_minmax": plain_minmax, "percentile_rank": percentile_rank}

def run_sweep(M, weight_alpha, k_range, threshold_pct, allow_norm_variation, seed):
    rng = np.random.default_rng(seed)
    n = len(buildings)
    matches = np.zeros(n)
    method_names = list(NORM_METHODS)
    for i in range(M):
        w = rng.dirichlet(np.full(4, weight_alpha))
        k = rng.uniform(*k_range)
        c = BASE_THRESHOLDS_M * rng.uniform(1 - threshold_pct, 1 + threshold_pct, size=4)
        norm_fn = NORM_METHODS[method_names[rng.integers(0, 3)]] if allow_norm_variation else winsor_minmax
        decay = 1 / (1 + np.exp(k * (dist - c) / c))
        normed = np.column_stack([norm_fn(decay[:, j]) for j in range(4)])
        normed = np.clip(normed, 1, None)
        s = np.exp((w * np.log(normed)).sum(axis=1))
        cat_i = np.digitize(s, baseline_bins[:-1], right=True)
        matches += (cat_i == baseline_cat)
    return (matches / M).mean()

small_change_stability = run_sweep(300, 20.0, (4.5, 5.5), 0.10, False, 11)
big_change_stability = run_sweep(300, 1.0, (3, 7), 0.25, True, 7)

# ---------------------------------------------------------------- combined validation figure (district + sensitivity)
district_summary = buildings.groupby("district")["final_score_geomean"].mean().sort_values()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9.4, 3.1))

ax1.barh(district_summary.index, district_summary.values, color="#5b8ea6")
ax1.set_xlabel("mean livability score", fontsize=9)
ax1.set_title("Mean score by district", fontsize=10)
ax1.tick_params(labelsize=8)

vals = [big_change_stability * 100, small_change_stability * 100]
bars = ax2.barh(["Large changes\nto assumptions", "Small changes\nto assumptions"], vals,
                 color=["#c0504d", "#5b8ea6"])
ax2.set_xlim(0, 100)
ax2.set_xlabel("buildings that keep\nthe same category (%)", fontsize=9)
ax2.set_title("Result stability check", fontsize=10)
ax2.tick_params(labelsize=8)
for b, v in zip(bars, vals):
    ax2.text(v + 2, b.get_y() + b.get_height()/2, f"{v:.0f}%", va="center", fontsize=9)

plt.tight_layout()
plt.savefig(OUT_DIR / "chart_validation.png", bbox_inches="tight")
plt.close()

print(f"Small changes: {small_change_stability:.1%} | Large changes: {big_change_stability:.1%}")


# ================================================================== PDF
FONT_DIR = "/System/Library/Fonts/Supplemental"
INK = (28, 32, 36)
MUTED = (90, 90, 85)
ACCENT = (14, 107, 99)
LINE = (219, 213, 199)

class Report(FPDF):
    def header(self):
        pass
    def footer(self):
        self.set_y(-13)
        self.set_font("Arial", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 8, f"Tallinn Apartment Livability Score, Methodology Summary. Page {self.page_no()}", align="C")

pdf = Report(format="A4")
pdf.add_font("Arial", "", f"{FONT_DIR}/Arial.ttf")
pdf.add_font("Arial", "B", f"{FONT_DIR}/Arial Bold.ttf")
pdf.add_font("Arial", "I", f"{FONT_DIR}/Arial Italic.ttf")
pdf.set_auto_page_break(auto=True, margin=16)
pdf.set_margins(18, 15, 18)

def h2(text, num=None):
    pdf.ln(2)
    pdf.set_font("Arial", "B", 13)
    pdf.set_text_color(*ACCENT)
    prefix = f"{num}  " if num else ""
    pdf.multi_cell(0, 7.5, prefix + text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(*LINE)
    pdf.set_line_width(0.3)
    y = pdf.get_y() + 0.5
    pdf.line(18, y, 192, y)
    pdf.ln(3.5)

def body(text):
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*INK)
    pdf.multi_cell(0, 5.3, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(1.5)

def bullet(text):
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*INK)
    pdf.set_x(18)
    pdf.cell(5, 5.3, chr(8226))
    pdf.multi_cell(169, 5.3, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

def caption(text):
    pdf.set_font("Arial", "I", 8.5)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(0, 4.3, text, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(1.5)

def image_centered(path, w=170):
    x = (210 - w) / 2
    pdf.image(str(path), x=x, w=w)
    pdf.ln(1.5)

def stat_row(items):
    n = len(items)
    w = 174 / n
    y0 = pdf.get_y()
    for i, (val, lbl) in enumerate(items):
        pdf.set_xy(18 + i * w, y0)
        pdf.set_text_color(*ACCENT)
        pdf.set_font("Arial", "B", 14)
        pdf.cell(w, 7, val, align="C")
    pdf.ln(8)
    for i, (val, lbl) in enumerate(items):
        pdf.set_xy(18 + i * w, pdf.get_y())
        pdf.set_font("Arial", "", 7.5)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(w, 3.6, lbl, align="C", new_x=XPos.LMARGIN, new_y=YPos.TOP)
    pdf.ln(5)

# ================================================================== PAGE 1
pdf.add_page()
pdf.set_font("Arial", "B", 20)
pdf.set_text_color(*INK)
pdf.multi_cell(0, 10, "Tallinn Apartment Livability Score", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font("Arial", "", 11.5)
pdf.set_text_color(*MUTED)
pdf.multi_cell(0, 6, "Methodology summary", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(2)

stat_row([
    ("7,842", "apartment buildings scored"),
    ("4", "proximity factors, equal weighted"),
    ("5", "livability categories"),
])

h2("Data sources", "1")
table_data = [
    ["Source", "Provides", "Count in Tallinn"],
    ["ETAK", "Building footprints", "7,842 buildings"],
    ["EHR", "Energy class (energiamärgis), address", "3,807 with energy data"],
    ["ETAK", "Green and blue space polygons", "3,128 polygons"],
    ["OpenStreetMap", "Street network for walking routes", "277,733 nodes"],
    ["Ühistranspordiregister", "Transit stops, GTFS feed", "1,319 stops"],
    ["OpenStreetMap (Overpass)", "Grocery and gym locations", "236 / 56"],
]
pdf.set_font("Arial", "", 8.5)
with pdf.table(
    table_data, col_widths=(40, 74, 60), text_align=("LEFT", "LEFT", "LEFT"),
    cell_fill_color=239, cell_fill_mode="ROWS",
    headings_style=FontFace(family="Arial", emphasis="BOLD", size_pt=8.7, fill_color=(213, 207, 191)),
    line_height=3.9, padding=(1.0, 1.8),
) as pdf_table:
    pass
pdf.ln(1.5)
body("ETAK (Eesti topograafia andmekogu, the Estonian Topographic Database) and EHR (Ehitisregister, the Estonian Building Register) are maintained by the Estonian Land and Spatial Development Board (Maa- ja Ruumiamet); building footprints and energy class are delivered together through its etak_ehr_hooned WFS service, which joins the two registers upstream. Ühistranspordiregister is the Estonian Public Transport Register. Buildings are limited to apartment buildings with 3 or more units and clipped to the Tallinn city boundary; the transit and amenity counts above are also clipped to that boundary.")

h2("How the score is generated", "2")
bullet("Network distance: the shortest walking route on the real street network to the nearest transit stop, grocery, gym, and green or blue space.")
bullet("Distance decay: closer amenities score higher, using a smooth curve rather than a hard cutoff. A location right at the typical walking threshold for that amenity type scores exactly halfway.")
bullet("Normalize: each factor is rescaled to a common 0 to 100 range.")
bullet("Combine: the four scores are combined using a method where a very poor result on one factor cannot be fully offset by strong results on the others.")
pdf.ln(1)
body("Note on energy score: Estonia's building energy certificate (A to H) and renovation history were both considered as scoring factors. Neither is used in the final score. Only about half of buildings have a certificate on file, and no reliable renovation date exists for any building. Energy class is still shown on the map for reference, it just does not affect the score or category.")

image_centered(OUT_DIR / "chart_final_dist.png", w=95)
caption("Final score distribution across all buildings, shaded by the resulting category.")

# ================================================================== PAGE 2
pdf.add_page()
h2("Validation", "3")
body("After the score was calculated, it was checked three ways: manually reviewing the highest and lowest scoring buildings, comparing average scores across districts against what is generally known about the city, and testing how much the results change if the underlying assumptions change.")

bullet("Manual review caught a real error: about 2 percent of buildings were being scored as if they had no nearby amenities at all, because of a gap in the street network data. This has been fixed, and every building now routes correctly.")
bullet("District averages line up with expectations: busier, well connected districts such as Lasnamäe and Põhja-Tallinna score highest, while the quieter, more spread out Pirita district scores lowest.")
bullet("Sensitivity testing: using a Monte Carlo simulation, the score was recalculated 300 times with varied assumptions. Small, reasonable changes barely move the results. Large, unrealistic changes move them a lot, which is expected and is part of why the simpler, equal weighted approach was chosen.")

image_centered(OUT_DIR / "chart_validation.png", w=172)
caption("Left: average score by district. Right: share of buildings that keep the same category when the scoring assumptions are changed a little versus a lot.")

h2("Example: the map in practice", "4")
_screenshot = PROJECT_DIR / "Screenshot 2026-08-11 at 16.12.52.png"
_img = Image.open(_screenshot)
_w, _h = _img.size
_cropped = _img.crop((0, 0, _w, int(_h * 0.90)))  # trim the empty strip near the bottom-right zoom control
_cropped_path = OUT_DIR / "screenshot_cropped.png"
_cropped.save(_cropped_path)
image_centered(str(_cropped_path), w=98)
caption("A sample area of central Tallinn, buildings colored by livability category. A dashed outline means no energy certificate is on file for that building; this is shown for reference only and does not change its score.")

pdf.output(str(OUT_DIR / "tallinn_livability_methodology.pdf"))
print("PDF saved.")
