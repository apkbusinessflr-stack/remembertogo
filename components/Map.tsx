import { useEffect, useRef, useState } from "react";
}});


map.addLayer({ id: layerClusterCount, type: "symbol", source: srcId, filter: ["has", "point_count"], layout: {
"text-field": ["get", "point_count_abbreviated"],
"text-size": 12,
}, paint: { "text-color": "#fff" }});


map.addLayer({ id: layerUnclustered, type: "circle", source: srcId, filter: ["!has", "point_count"], paint: {
"circle-radius": 6,
"circle-color": "#ef4444",
"circle-stroke-color": "#fff",
"circle-stroke-width": 1,
}});


map.on("click", layerUnclustered, (e) => {
const f = e.features?.[0];
if (!f) return;
const coords = f.geometry.type === "Point" ? (f.geometry.coordinates as [number, number]) : [0, 0];
const { title, description } = (f.properties || {}) as any;
new maplibregl.Popup({ closeButton: true }).setLngLat(coords as LngLatLike).setHTML(`
<div style="max-width:220px">
<div style="font-weight:600;margin-bottom:4px">${escapeHtml(title || "(untitled)")}</div>
<div style="font-size:12px;opacity:0.8">${escapeHtml(description || "")}</div>
</div>`).addTo(map);
});


map.on("click", layerCluster, (e) => {
const src = map.getSource(srcId) as GeoJSONSource;
const f = e.features?.[0];
if (!f) return;
const clusterId = (f.properties as any)["cluster_id"];
src.getClusterExpansionZoom(clusterId, (err, zoom) => {
if (err) return;
const [x, y] = (f.geometry as any).coordinates;
map.easeTo({ center: [x, y], zoom });
});
});
} else {
const src = map.getSource(srcId) as GeoJSONSource;
src.setData(fc);
}
}


function toGeoJSON(items: Place[]): GeoJSON.FeatureCollection<GeoJSON.Point, any> {
return {
type: "FeatureCollection",
features: items.map((p) => ({
type: "Feature",
geometry: { type: "Point", coordinates: [p.lng, p.lat] },
properties: { id: p.id, title: p.title, description: p.description, country: p.country_code },
})),
};
}


function escapeHtml(s: string) {
return s
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}
