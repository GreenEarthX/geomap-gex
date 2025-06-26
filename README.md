# Geomap GEX 🌍

A Next.js app for visualizing renewable energy infrastructure using interactive maps (Leaflet).

##  Setup

### 1. Clone the repository

```bash
git clone https://github.com/GreenEarthX/geomap-gex.git
cd geomap-gex
```
### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server
```bash
npm run dev
```
Then visit: http://localhost:3000



## Python utilities

A helper script is provided in `scripts/pipeline_ml.py` to convert GeoJSON or
shapefiles to a simplified PipelineML XML representation and back. It also
demonstrates downloading the hydrogen pipeline layer from the EU Transparency
Platform and displaying the result on an OpenStreetMap basemap using Folium.

### Usage

1. Install Python dependencies (requires `geopandas`, `requests`, `shapely`, and
   `folium`).
2. Run the script:

```bash
python scripts/pipeline_ml.py
```

This will download the EU pipeline layer, write `eu_pipeline.geojson`, convert it
to `eu_pipeline.xml`, load it back, and create `map.html` showing the pipelines
as an overlay.
