import geopandas as gpd
import requests
import xml.etree.ElementTree as ET
from shapely.geometry import LineString
import folium


def fetch_arcgis_geojson(url: str, out_path: str) -> gpd.GeoDataFrame:
    """Download a GeoJSON layer from an ArcGIS REST endpoint."""
    r = requests.get(url)
    r.raise_for_status()
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(r.text)
    return gpd.read_file(out_path)


def xlsx_to_geojson(xlsx_path: str, out_path: str) -> gpd.GeoDataFrame:
    """Load an XLSX table with WKT geometry and export to GeoJSON."""
    df = gpd.read_file(xlsx_path)
    if df.crs is None:
        df.set_crs(4326, inplace=True)
    df.to_file(out_path, driver='GeoJSON')
    return df


def geodataframe_to_pipelinexml(gdf: gpd.GeoDataFrame, out_path: str) -> None:
    """Convert a GeoDataFrame of LineString geometries to a simple PipelineML XML."""
    root = ET.Element('PipelineML')
    segments = ET.SubElement(root, 'PipelineSegments')

    for idx, row in gdf.iterrows():
        seg = ET.SubElement(segments, 'PipelineSegment', id=str(idx))
        geom = ET.SubElement(seg, 'Geometry')
        if isinstance(row.geometry, LineString):
            for x, y in row.geometry.coords:
                ET.SubElement(geom, 'pos').text = f"{x},{y}"
        for col, val in row.items():
            if col != 'geometry' and val is not None:
                ET.SubElement(seg, col).text = str(val)

    tree = ET.ElementTree(root)
    tree.write(out_path, encoding='utf-8', xml_declaration=True)


def pipelinexml_to_geodataframe(xml_path: str) -> gpd.GeoDataFrame:
    """Parse a simplified PipelineML XML back into a GeoDataFrame."""
    tree = ET.parse(xml_path)
    root = tree.getroot()
    features = []
    for seg in root.findall('.//PipelineSegment'):
        coords = []
        for pos in seg.find('Geometry').findall('pos'):
            x, y = map(float, pos.text.split(','))
            coords.append((x, y))
        props = {child.tag: child.text for child in seg if child.tag != 'Geometry'}
        features.append({'geometry': LineString(coords), **props})
    gdf = gpd.GeoDataFrame(features, geometry='geometry', crs='EPSG:4326')
    return gdf


def display_on_map(gdf: gpd.GeoDataFrame, out_html: str = 'map.html') -> None:
    """Create a Leaflet map using Folium with the GeoDataFrame layer."""
    center = gdf.geometry.unary_union.centroid
    m = folium.Map(location=[center.y, center.x], zoom_start=5)
    folium.GeoJson(gdf.__geo_interface__).add_to(m)
    m.save(out_html)
    print(f"Map saved to {out_html}")


if __name__ == '__main__':
    # Example workflow using the EU Transparency Platform pipeline layer
    url = (
        'https://webgate.ec.europa.eu/getis/rest/services/Energy/TP_HYDROGEN/MapServer/5/query'
        '?where=OBJECTID>=0&outFields=*&returnGeometry=true&f=geojson'
    )
    geojson_path = 'eu_pipeline.geojson'
    xml_path = 'eu_pipeline.xml'
    gdf = fetch_arcgis_geojson(url, geojson_path)
    geodataframe_to_pipelinexml(gdf, xml_path)
    restored = pipelinexml_to_geodataframe(xml_path)
    display_on_map(restored)
