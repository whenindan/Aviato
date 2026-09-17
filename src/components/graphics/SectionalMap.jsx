import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { airports } from '../../data/airports.js';

const TILE_URL = 'https://tiles.arcgis.com/tiles/ssFJjBXIUyZDrSYZ/arcgis/rest/services/VFR_Sectional/MapServer/tile/{z}/{y}/{x}';
// The ArcGIS VFR_Sectional service only publishes tiles for zoom levels 8-13
// (per its /MapServer?f=json tileInfo). Zooming out past 8 requests tiles the
// service doesn't have, which fires tileerror and surfaces as a broken map —
// so the map itself is clamped to that range.
const MIN_ZOOM = 8;
const MAX_ZOOM = 13;

// Real FAA VFR sectional tiles rendered through Leaflet, wrapped by hand
// (no react-leaflet) so it can share the app's own +/-/fit control cluster.
export default function SectionalMap({ departure, destination, waypoints = [], moas = [], focus = 'route', interactive = true, height }) {
  const el = useRef(null);
  const map = useRef(null);
  const layers = useRef({});
  const tilesLoadedOnce = useRef(false);
  const lastFitKey = useRef(null);
  const userAdjustedView = useRef(false);
  const [tilesFailed, setTilesFailed] = useState(false);
  const [zoom, setZoom] = useState(null);

  const from = airports.find(a => a.code === departure);
  const to = airports.find(a => a.code === destination);

  useLayoutEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, {
      zoomControl: false, attributionControl: true, dragging: interactive,
      scrollWheelZoom: interactive, doubleClickZoom: interactive, touchZoom: interactive,
      boxZoom: interactive, keyboard: interactive,
      minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM,
    }).setView([39, -96], MIN_ZOOM);
    const tiles = L.tileLayer(TILE_URL, {
      maxNativeZoom: MAX_ZOOM, maxZoom: MAX_ZOOM, minZoom: MIN_ZOOM,
      attribution: 'FAA VFR Sectional · ArcGIS',
    });
    // At the edges of the sectional's coverage (min zoom, or near the
    // coast/border) some tiles simply don't exist on the service and 404 —
    // that's expected, not a failure. Only show the fallback if tiles never
    // loaded at all (a real outage); once we've loaded at least one batch,
    // ignore stray errors so a missing edge tile doesn't blank the whole map.
    tiles.on('load', () => { tilesLoadedOnce.current = true; });
    tiles.on('tileerror', () => { if (!tilesLoadedOnce.current) setTilesFailed(true); });
    tiles.addTo(m);
    map.current = m;
    // React Strict Mode remounts effects in development. The refs survive that
    // simulated remount, but this is a new Leaflet map, so it must fit its
    // initial route again rather than retaining the previous map's fit key.
    lastFitKey.current = null;
    layers.current.route = L.layerGroup().addTo(m);
    // Establish a valid route viewport before Leaflet projects vector layers.
    // In development Strict Mode, the later route effect can belong to the
    // discarded first mount; starting this instance on the route prevents the
    // surviving map from clipping every route point outside its viewport.
    if (focus === 'route' && from && to) {
      m.fitBounds(L.latLngBounds([[from.lat, from.lon], [to.lat, to.lon]]), {
        padding: [40, 40], maxZoom: 9,
      });
    }
    setZoom(m.getZoom());
    m.on('zoomend', () => setZoom(m.getZoom()));

    // This map lives in a flex/grid panel that can receive its final size
    // after this effect runs (and after the console's entrance animation).
    // Leaflet caches its size at construction; if that cache is 0 × 0, all
    // vector layers are projected to M0 0 even though the tile layer later
    // becomes visible. Keep Leaflet's cached viewport in sync with the host.
    const syncSize = () => m.invalidateSize({ pan: false, debounceMoveend: true });
    const frame = requestAnimationFrame(syncSize);
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(syncSize);
    resizeObserver?.observe(el.current);
    // A zoom/drag the user starts themselves means "leave my view alone" —
    // the data effect below should stop re-fitting the map after that,
    // otherwise an unrelated re-render (new waypoints/moas array identity
    // with the same route) snaps the zoom right back.
    m.on('zoomstart dragstart', () => { userAdjustedView.current = true; });
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const m = map.current;
    if (!m) return;
    const group = layers.current.route;
    group.clearLayers();
    const magenta = '#c2185b';
    if (focus === 'route' && from && to) {
      const line = waypoints.length > 1 ? waypoints.map(w => [w.lat, w.lon]) : [[from.lat, from.lon], [to.lat, to.lon]];
      L.polyline(line, { color: magenta, weight: 2.5, opacity: 0.9 }).addTo(group);
      L.circleMarker([from.lat, from.lon], { radius: 6, color: magenta, weight: 2, fillColor: '#fff', fillOpacity: 1 }).bindTooltip(from.code, { permanent: true, direction: 'top', className: 'sectional-tip' }).addTo(group);
      L.circleMarker([to.lat, to.lon], { radius: 6, color: magenta, weight: 2, fillColor: '#fff', fillOpacity: 1 }).bindTooltip(to.code, { permanent: true, direction: 'top', className: 'sectional-tip' }).addTo(group);
      waypoints.slice(1, -1).forEach(w => {
        L.circleMarker([w.lat, w.lon], { radius: 3.5, color: magenta, weight: 1.5, fillColor: magenta, fillOpacity: 0.5 }).addTo(group);
      });
      moas.forEach(moa => {
        L.polygon(moa.polygon, { color: moa.hot ? '#d6603f' : '#6b7f6e', weight: 1.5, dashArray: '4 3', fillOpacity: 0.06 })
          .bindTooltip(moa.name, { permanent: false, className: 'sectional-tip' })
          .addTo(group);
      });
      // Only re-fit when the route itself changed (by value), not merely
      // because the caller re-rendered and passed a new waypoints/moas array
      // for the same route — and never once the user has manually zoomed.
      const fitKey = `route:${departure}:${destination}:${line.map(p => p.join(',')).join('|')}`;
      if (fitKey !== lastFitKey.current && !userAdjustedView.current) {
        m.fitBounds(L.latLngBounds(line), { padding: [40, 40], maxZoom: 9 });
      }
      lastFitKey.current = fitKey;
    } else if (typeof focus === 'string' && focus !== 'route') {
      const a = airports.find(x => x.code === focus);
      if (a) {
        L.circleMarker([a.lat, a.lon], { radius: 7, color: magenta, weight: 2, fillColor: '#fff', fillOpacity: 1 }).addTo(group);
        const fitKey = `airport:${focus}`;
        if (fitKey !== lastFitKey.current && !userAdjustedView.current) {
          m.setView([a.lat, a.lon], 12);
        }
        lastFitKey.current = fitKey;
      }
    }
  }, [departure, destination, focus, waypoints, moas]);

  const fit = () => {
    const m = map.current;
    if (!m || !from || !to) return;
    if (focus === 'route') {
      const line = waypoints.length > 1 ? waypoints.map(w => [w.lat, w.lon]) : [[from.lat, from.lon], [to.lat, to.lon]];
      userAdjustedView.current = false;
      m.fitBounds(L.latLngBounds(line), { padding: [40, 40], maxZoom: 9 });
    }
  };

  return <div className="sectional-map" style={height ? { height } : undefined}>
    <div ref={el} className="sectional-map__canvas" role="img" aria-label={`Sectional chart, ${departure} to ${destination}`} />
    {tilesFailed && <div className="sectional-map__fallback"><span>Sectional tiles unavailable</span></div>}
    {interactive && <div className="geo-controls sectional-map__controls">
      <button aria-label="Zoom in" disabled={zoom >= MAX_ZOOM} onClick={() => map.current?.zoomIn()}>+</button>
      <button aria-label="Zoom out" disabled={zoom <= MIN_ZOOM} onClick={() => map.current?.zoomOut()}>−</button>
      <button aria-label="Fit route" onClick={fit}>⌖</button>
    </div>}
  </div>;
}
