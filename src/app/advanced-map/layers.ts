import { Extent } from 'ol/extent';
import { ServerType } from 'ol/source/wms';

export enum LayerType {
  TileWMS,
  ImageWMS,
  //   BBoxWFS,
  //   TileWMS,
  //   ImageWMS,
  //   WMTS,
  //   Selection,
  OSM,
  //   MapGenieWMTS,
  //   PointExclusions,
  //   WMSVectorTile,
}

interface MapLayerBase {
  id: number | string;
  name: string;
  description?: string;
  type: LayerType;
  attributions?: string[];
  extent?: Extent;
  zIndex: number;
  isVisible: boolean;
  isSelected?: boolean;
  opacity: number;
  maxZoom?: number;
  minZoom?: number;
  capabilitiesUrl?: string;
}

export interface MapLayerGeneric extends MapLayerBase {
  type: LayerType.OSM;
}

export interface MapLayerTileWMS extends MapLayerBase {
  url: string;
  params: Record<string, any>;
  serverType: ServerType;
  type: LayerType.TileWMS;
}

export interface MapLayerImageWMS extends MapLayerBase {
  url: string;
  params: Record<string, any>;
  serverType: ServerType;
  type: LayerType.ImageWMS;
}

export type MapLayer = MapLayerTileWMS | MapLayerGeneric | MapLayerImageWMS;

// https://gis.epa.ie/geoserver/EPA/wms?service=WMS&request=GetCapabilities

export const layers: MapLayer[] = [
  {
    id: 'osm',
    name: 'osm',
    description: '',
    type: LayerType.OSM,
    zIndex: 1,
    isVisible: true,
    opacity: 1,
  },
  {
    id: 'EPA:ADMIN_County',
    name: 'EPA:ADMIN_County',
    description: '',
    type: LayerType.ImageWMS,
    url: 'https://gis.epa.ie/geoserver/EPA/wms',
    params: {
      LAYERS: 'EPA:ADMIN_County',
      FORMAT: 'image/png',
    },
    serverType: 'geoserver',
    zIndex: 2,
    isVisible: false,
    opacity: 1,
    extent: [-970000, 6830000, -690000, 7110000],
  },
  {
    id: 'EPA:WFD_RIVERWATERBODIES_CYCLE3',
    name: 'EPA:WFD_RIVERWATERBODIES_CYCLE3',
    description: '',
    type: LayerType.TileWMS,
    url: 'https://gis.epa.ie/geoserver/EPA/wms',
    params: {
      LAYERS: 'EPA:WFD_RIVERWATERBODIES_CYCLE3',
      FORMAT: 'image/png',
      TILED: true,
    },
    serverType: 'geoserver',
    zIndex: 3,
    isVisible: false,
    opacity: 1,
  },
];
