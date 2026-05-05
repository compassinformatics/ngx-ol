export type Demo = {
  path: string;
  label: string;
  description: string;
  keywords: readonly string[];
  sourceUrl: string;
};

type DemoDefinition = Omit<Demo, 'sourceUrl'>;

const GITHUB_SOURCE_BASE = 'https://github.com/compassinformatics/ngx-ol/blob/main/';

const SOURCE_PATH_OVERRIDES: Readonly<Record<string, string>> = {
  '/basic': 'src/app/basic-map/basic-map.ts',
  '/advanced': 'src/app/advanced-map/advanced-map.ts',
  '/utf-grid': 'src/app/utfgrid/utfgrid.ts',
};

function buildSourceUrl(path: string): string {
  const override = SOURCE_PATH_OVERRIDES[path];

  if (override) {
    return `${GITHUB_SOURCE_BASE}${override}`;
  }

  const segment = path.replace(/^\//, '');

  return `${GITHUB_SOURCE_BASE}src/app/${segment}/${segment}.ts`;
}

const DEMO_DEFINITIONS: readonly DemoDefinition[] = [
  // Core maps and navigation
  {
    path: '/basic',
    label: 'Basic',
    description: 'A minimal map with an OSM base layer and standard controls.',
    keywords: ['osm', 'tile', 'view', 'controls'],
  },
  {
    path: '/sub-modules',
    label: 'Sub Modules',
    description:
      'Shows how to replace AngularOpenlayersModule with smaller grouped NgModules such as map and tile layers.',
    keywords: ['modules', 'imports', 'ngmodule', 'subset', 'bundle'],
  },
  {
    path: '/individual-imports',
    label: 'Individual Imports',
    description:
      'Shows how to import standalone ngx-ol components directly when you only need a minimal set.',
    keywords: ['imports', 'standalone', 'components', 'bundle', 'explicit'],
  },
  {
    path: '/advanced',
    label: 'Advanced',
    description: 'A larger demo with layer visibility, opacity, and ordering controls.',
    keywords: ['layers', 'visibility', 'opacity', 'zindex', 'wms'],
  },
  {
    path: '/map-interactions',
    label: 'Map Interactions',
    description:
      'Toggle map navigation and gesture interactions such as drag pan, drag zoom, and rotate.',
    keywords: ['interaction', 'drag', 'zoom', 'rotate', 'pan'],
  },
  {
    path: '/dbl-click-drag-zoom',
    label: 'DblClickDragZoom',
    description: 'Double-click, hold, and drag up or down to zoom around a chosen point.',
    keywords: ['interaction', 'double-click', 'drag', 'zoom', 'gesture'],
  },
  {
    path: '/pinch-rotate',
    label: 'Pinch Rotate',
    description:
      'Use two-finger touch rotation and tune the gesture threshold and animation duration.',
    keywords: ['interaction', 'touch', 'rotate', 'gesture', 'pinch'],
  },
  {
    path: '/link-interaction',
    label: 'Link Interaction',
    description: 'Synchronizes the map center, zoom, and rotation with URL query parameters.',
    keywords: ['interaction', 'url', 'link', 'state', 'history'],
  },
  {
    path: '/map-position',
    label: 'Map Position',
    description: 'Move the map and watch the live center and zoom values update.',
    keywords: ['position', 'center', 'zoom', 'forms'],
  },
  {
    path: '/cursor-position',
    label: 'Cursor Position',
    description: 'Move your pointer over the map to see its current coordinate.',
    keywords: ['cursor', 'pointer', 'coordinate', 'mouse'],
  },
  {
    path: '/overlay',
    label: 'Overlay',
    description: 'Shows HTML overlays on the map, including a GetFeatureInfo popup.',
    keywords: ['overlay', 'popup', 'html', 'getfeatureinfo', 'wms'],
  },

  // Feature rendering
  {
    path: '/marker',
    label: 'Marker',
    description: 'Displays a single styled marker feature on top of the base map.',
    keywords: ['marker', 'icon', 'style', 'feature'],
  },
  {
    path: '/display-geometry',
    label: 'Display Geometry',
    description: 'Loads GeoJSON features and renders them using OpenLayers feature bindings.',
    keywords: ['geojson', 'features', 'geometry', 'vector'],
  },
  {
    path: '/geometry-components',
    label: 'Geometry Components',
    description: 'Demonstrates every template-based geometry component exposed by ngx-ol.',
    keywords: ['geometry', 'template', 'point', 'polygon', 'line'],
  },
  {
    path: '/geometry-collection',
    label: 'Geometry Collection',
    description: 'Renders a single feature that contains multiple geometry types together.',
    keywords: ['geometrycollection', 'feature', 'vector', 'line', 'polygon', 'point'],
  },
  {
    path: '/display-geojson-source',
    label: 'GeoJSON Source',
    description: 'Loads a GeoJSON source directly and lets OpenLayers render the features.',
    keywords: ['geojson', 'source', 'vector', 'features'],
  },
  {
    path: '/cluster',
    label: 'Cluster',
    description: 'Adjust the cluster distance slider to regroup the point features.',
    keywords: ['cluster', 'points', 'distance', 'source'],
  },
  {
    path: '/heatmap',
    label: 'Heatmap',
    description: 'Uses weighted point features to render a vector heatmap layer.',
    keywords: ['heatmap', 'layer', 'vector', 'weight', 'points'],
  },
  {
    path: '/color-select-hover',
    label: 'Color Select Hover',
    description:
      'Hover polygons for a highlight, then click to select them with interaction styling.',
    keywords: ['hover', 'select', 'style', 'polygon'],
  },
  {
    path: '/regular-shape',
    label: 'Regular Shape',
    description: 'Styles point features with aol-style-regularshape as polygons or stars.',
    keywords: ['regularshape', 'style', 'star', 'polygon', 'marker'],
  },

  // Feature drawing and editing
  {
    path: '/draw-box',
    label: 'Draw Box',
    description: 'Toggle draw mode, drag on the map, and inspect the resulting box geometry.',
    keywords: ['draw', 'box', 'interaction', 'geometry'],
  },
  {
    path: '/extent-interaction',
    label: 'Extent Interaction',
    description: 'Draws and edits a rectangular extent directly on the map.',
    keywords: ['extent', 'interaction', 'draw', 'edit', 'box'],
  },
  {
    path: '/modify-polygon',
    label: 'Modify Polygon',
    description: 'Select the polygon and drag its vertices to edit it on the map.',
    keywords: ['modify', 'polygon', 'select', 'vertices', 'interaction'],
  },
  {
    path: '/select-interaction',
    label: 'Select Interaction',
    description: 'Click the marker to test the select interaction against a filtered layer.',
    keywords: ['select', 'interaction', 'marker', 'filter'],
  },

  // Image, tile, and service sources
  {
    path: '/image-wms',
    label: 'Image WMS',
    description: 'Renders a single-image WMS layer with reactive request params.',
    keywords: ['wms', 'image', 'params', 'loading'],
  },
  {
    path: '/image-static',
    label: 'Image Static',
    description: 'Places a static image on the map using a known extent.',
    keywords: ['image', 'static', 'extent', 'projection'],
  },
  {
    path: '/arcgis-image',
    label: 'ArcGIS Image',
    description: 'Displays an ArcGIS image service layer and its loading lifecycle.',
    keywords: ['arcgis', 'image', 'rest', 'loading'],
  },
  {
    path: '/arcgis-tiled',
    label: 'ArcGIS Tiled',
    description: 'Uses a tiled ArcGIS REST MapServer source and shows its tile loading status.',
    keywords: ['arcgis', 'tile', 'xyz', 'loading'],
  },
  {
    path: '/tile-arcgis-rest',
    label: 'Tile ArcGIS REST',
    description: 'Displays a tiled ArcGIS REST source through aol-source-tilearcgisrest.',
    keywords: ['arcgis', 'tile', 'rest', 'source', 'mapserver'],
  },
  {
    path: '/webgl-tile',
    label: 'WebGL Tile',
    description: 'Renders image tiles with WebGLTile and ImageTile wrappers.',
    keywords: ['webgl', 'tile', 'imagetile', 'source', 'performance'],
  },
  {
    path: '/iiif',
    label: 'IIIF',
    description: 'Displays a tiled IIIF image service with aol-source-iiif.',
    keywords: ['iiif', 'image', 'tile', 'source'],
  },
  {
    path: '/geotiff',
    label: 'GeoTIFF',
    description: 'Displays Cloud Optimized GeoTIFF bands through a WebGL tile layer.',
    keywords: ['geotiff', 'cog', 'webgl', 'raster', 'tile'],
  },
  {
    path: '/zoomify',
    label: 'Zoomify',
    description: 'Displays a deep-zoom image source with tiled Zoomify metadata.',
    keywords: ['zoomify', 'image', 'tile', 'deep-zoom'],
  },
  {
    path: '/xyz-esri',
    label: 'XYZ Esri',
    description: 'Uses an ArcGIS tile service through an XYZ source and tracks tile load events.',
    keywords: ['xyz', 'esri', 'arcgis', 'tiles'],
  },
  {
    path: '/vector-esri',
    label: 'Vector Esri',
    description:
      'Loads ArcGIS REST features for the visible extent and shows their land-use attributes on hover.',
    keywords: ['esri', 'arcgis', 'vector', 'features'],
  },
  {
    path: '/tile-json',
    label: 'Tile JSON',
    description: 'Loads a TileJSON source and shows the resolved tileset details.',
    keywords: ['tilejson', 'tiles', 'source', 'config'],
  },
  {
    path: '/tile-json-dynamic',
    label: 'Tile JSON Dynamic',
    description: 'Creates a TileJSON source in TypeScript and binds it directly to the tile layer.',
    keywords: ['tilejson', 'dynamic', 'source', 'typescript'],
  },
  {
    path: '/ogc-map-tile',
    label: 'OGC Map Tile',
    description:
      'Loads local OGC API Tiles metadata that resolves to a public raster tile service.',
    keywords: ['ogc', 'map', 'tiles', 'raster'],
  },
  {
    path: '/ogc-vector-tile',
    label: 'OGC Vector Tile',
    description: 'Loads vector tiles from an OGC API Tiles endpoint.',
    keywords: ['ogc', 'vector', 'tiles', 'mvt'],
  },
  {
    path: '/utf-grid',
    label: 'UTF Grid',
    description: 'Hover the map to inspect UTFGrid-based feature information.',
    keywords: ['utfgrid', 'hover', 'tiles', 'metadata'],
  },
  {
    path: '/raster',
    label: 'Raster',
    description: 'Applies raster operations so you can see derived image output update live.',
    keywords: ['raster', 'operation', 'brightness', 'contrast'],
  },

  // Map utilities and comparison
  {
    path: '/view-projection-update',
    label: 'View Projection Update',
    description: 'Switch the view projection and compare how geometry-based overlays respond.',
    keywords: ['projection', 'view', 'epsg', 'coordinate'],
  },
  {
    path: '/graticule',
    label: 'Graticule',
    description: 'Displays a graticule overlay to visualize map coordinates.',
    keywords: ['graticule', 'coordinates', 'overlay', 'labels'],
  },
  {
    path: '/overview',
    label: 'Overview',
    description: 'Adds an overview map control so you can track context while navigating.',
    keywords: ['overview', 'control', 'minimap'],
  },
  {
    path: '/side-by-side',
    label: 'Side By Side',
    description: 'Two synchronized maps share a single view so you can compare layers.',
    keywords: ['sync', 'compare', 'view', 'maps'],
  },
  {
    path: '/swipe',
    label: 'Swipe',
    description: 'Use the swipe control to reveal one layer against another.',
    keywords: ['swipe', 'compare', 'layers', 'clip'],
  },
];

export const DEMOS: readonly Demo[] = DEMO_DEFINITIONS.map((demo) => ({
  ...demo,
  sourceUrl: buildSourceUrl(demo.path),
}));
