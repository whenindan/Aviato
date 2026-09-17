Map geometry: US state GeoJSON from PublicaMundi MappingAPI:
https://github.com/PublicaMundi/MappingAPI/blob/master/data/geojson/us-states.json

Airport names, coordinates and elevation: datasets/airport-codes, derived from OurAirports:
https://github.com/datasets/airport-codes
https://ourairports.com/data/

Retrieved September 14, 2026. The map renders the contiguous US in an Albers
equal-area conic projection with standard parallels 29.5 and 45.5 degrees.
Both state polygons and airport markers use the same projection. Distances
use the haversine formula and a mean Earth radius of 3440.065 nautical miles.

Aircraft figures, weather indicators, flight estimates, airspace study content,
and debriefs are illustrative product previews, not operational flight data.

Sectional chart tiles: FAA VFR Sectional raster tile service, served via
ArcGIS (`https://tiles.arcgis.com/tiles/ssFJjBXIUyZDrSYZ/arcgis/rest/services/VFR_Sectional/MapServer`).
Rendered client-side with Leaflet. Airport runway lengths/widths and radio
frequencies in `src/data/airports.js` are drawn from FAA Chart Supplement
values retrieved around September 2026 — for preview only, verify with the
current Chart Supplement before any real-world use. NOTAM/TFR items shown in
the mock briefing are deterministically generated per route and are not real
NOTAMs.

MOA boundaries and hours in `src/data/moas.js` (used for the KPRC ↔ KHII demo
route) are simplified/mock polygons and schedules, not sourced from a current
sectional chart or the Chart Supplement — for illustrating the hot/cold check
only. The Cessna 172S weight & balance figures added to `src/data/aircraft.js`
(`wb`) approximate a published C172S POH and, with the 190 lb average-adult
assumption in `src/data/weightBalance.js`, are illustrative for this passenger
demo — not for real flight planning.
