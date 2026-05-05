/*
 * Public API Surface of ngx-ol
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleGeometryComponent } from './lib/geom/simplegeometry.component';
import { SourceComponent } from './lib/sources/source.component';
import { ViewComponent } from './lib/view.component';
import { GraticuleComponent } from './lib/graticule.component';
import { LayerGroupComponent } from './lib/layers/layergroup.component';
import { LayerImageComponent } from './lib/layers/layerimage.component';
import { LayerTileComponent } from './lib/layers/layertile.component';
import { MapComponent } from './lib/map.component';
import { LayerHeatmapComponent } from './lib/layers/layerheatmap.component';
import { LayerWebGLTileComponent } from './lib/layers/layerwebgltile.component';
import { LayerVectorComponent } from './lib/layers/layervector.component';
import { LayerVectorTileComponent } from './lib/layers/layervectortile.component';
import { LayerVectorImageComponent } from './lib/layers/layervectorimage.component';
import { SourceOsmComponent } from './lib/sources/osm.component';
import { SourceBingmapsComponent } from './lib/sources/bingmaps.component';
import { SourceClusterComponent } from './lib/sources/cluster.component';
import { SourceVectorComponent } from './lib/sources/vector.component';
import { SourceXYZComponent } from './lib/sources/xyz.component';
import { SourceTileWMTSComponent } from './lib/sources/tilewmts.component';
import { SourceVectorTileComponent } from './lib/sources/vectortile.component';
import { SourceTileWMSComponent } from './lib/sources/tilewms.component';
import { SourceTileJSONComponent } from './lib/sources/tilejson.component';
import { SourceTileArcGISRestComponent } from './lib/sources/tilearcgisrest.component';
import { SourceImageTileComponent } from './lib/sources/imagetile.component';
import { SourceIIIFComponent } from './lib/sources/iiif.component';
import { SourceZoomifyComponent } from './lib/sources/zoomify.component';
import { SourceGeoJSONComponent } from './lib/sources/geojson.component';
import { SourceImageStaticComponent } from './lib/sources/imagestatic.component';
import { SourceImageWMSComponent } from './lib/sources/imagewms.component';
import { SourceImageArcGISRestComponent } from './lib/sources/imagearcgisrest.component';
import { SourceRasterComponent } from './lib/sources/raster.component';
import { FeatureComponent } from './lib/feature.component';
import { GeometryCircleComponent } from './lib/geom/geometrycircle.component';
import { GeometryLinestringComponent } from './lib/geom/geometrylinestring.component';
import { GeometryMultiLinestringComponent } from './lib/geom/geometrymultilinestring.component';
import { GeometryMultiPointComponent } from './lib/geom/geometrymultipoint.component';
import { GeometryMultiPolygonComponent } from './lib/geom/geometrymultipolygon.component';
import { GeometryPointComponent } from './lib/geom/geometrypoint.component';
import { GeometryPolygonComponent } from './lib/geom/geometrypolygon.component';
import { GeometryCollectionComponent } from './lib/geom/geometrycollection.component';
import { CoordinateComponent } from './lib/coordinate.component';
import { CollectionCoordinatesComponent } from './lib/collectioncoordinates.component';
import { StyleComponent } from './lib/styles/style.component';
import { StyleCircleComponent } from './lib/styles/circle.component';
import { StyleStrokeComponent } from './lib/styles/stroke.component';
import { StyleIconComponent } from './lib/styles/icon.component';
import { StyleFillComponent } from './lib/styles/fill.component';
import { StyleRegularShapeComponent } from './lib/styles/regularshape.component';
import { StyleTextComponent } from './lib/styles/text.component';
import { DefaultControlComponent } from './lib/controls/default.component';
import { ControlComponent } from './lib/controls/control.component';
import { ControlAttributionComponent } from './lib/controls/attribution.component';
import { ControlFullScreenComponent } from './lib/controls/fullscreen.component';
import { ControlMousePositionComponent } from './lib/controls/mouseposition.component';
import { ControlOverviewMapComponent } from './lib/controls/overviewmap.component';
import { ControlRotateComponent } from './lib/controls/rotate.component';
import { ControlScaleLineComponent } from './lib/controls/scaleline.component';
import { ControlZoomComponent } from './lib/controls/zoom.component';
import { ControlZoomSliderComponent } from './lib/controls/zoomslider.component';
import { ControlZoomToExtentComponent } from './lib/controls/zoomtoextent.component';
import { FormatMVTComponent } from './lib/formats/mvt.component';
import { TileGridComponent } from './lib/tilegrid.component';
import { TileGridWMTSComponent } from './lib/tilegridwmts.component';
import { DefaultInteractionComponent } from './lib/interactions/default.component';
import { DoubleClickZoomInteractionComponent } from './lib/interactions/doubleclickzoom.component';
import { DragAndDropInteractionComponent } from './lib/interactions/draganddrop.component';
import { DragBoxInteractionComponent } from './lib/interactions/dragbox.component';
import { DragPanInteractionComponent } from './lib/interactions/dragpan.component';
import { DragRotateInteractionComponent } from './lib/interactions/dragrotate.component';
import { DragRotateAndZoomInteractionComponent } from './lib/interactions/dragrotateandzoom.component';
import { DragZoomInteractionComponent } from './lib/interactions/dragzoom.component';
import { MouseWheelZoomInteractionComponent } from './lib/interactions/mousewheelzoom.component';
import { DblClickDragZoomInteractionComponent } from './lib/interactions/dblclickdragzoom.component';
import { PinchRotateInteractionComponent } from './lib/interactions/pinchrotate.component';
import { PinchZoomInteractionComponent } from './lib/interactions/pinchzoom.component';
import { ExtentInteractionComponent } from './lib/interactions/extent.component';
import { LinkInteractionComponent } from './lib/interactions/link.component';
import { DrawInteractionComponent } from './lib/interactions/draw.component';
import { KeyboardPanInteractionComponent } from './lib/interactions/keyboardpan.component';
import { KeyboardZoomInteractionComponent } from './lib/interactions/keyboardzoom.component';
import { SelectInteractionComponent } from './lib/interactions/select.component';
import { ModifyInteractionComponent } from './lib/interactions/modify.component';
import { SnapInteractionComponent } from './lib/interactions/snap.component';
import { TranslateInteractionComponent } from './lib/interactions/translate.component';
import { OverlayComponent } from './lib/overlay.component';
import { ContentComponent } from './lib/content.component';
import { AttributionsComponent } from './lib/attributions.component';
import { AttributionComponent } from './lib/attribution.component';
import { SourceUTFGridComponent } from './lib/sources/utfgrid.component';
import { LayerComponent } from './lib/layers/layer.component';
import { SourceOGCMapTileComponent } from './lib/sources/ogcmaptile.component';
import { SourceOGCVectorTileComponent } from './lib/sources/ogcvectortile.component';
import { FormatGeoJSONComponent } from './lib/formats/geojson.component';

export {
  MapComponent,
  ViewComponent,
  GraticuleComponent,
  LayerComponent,
  LayerGroupComponent,
  LayerImageComponent,
  LayerTileComponent,
  LayerHeatmapComponent,
  LayerWebGLTileComponent,
  LayerVectorComponent,
  LayerVectorTileComponent,
  LayerVectorImageComponent,
  SourceComponent,
  SourceOsmComponent,
  SourceBingmapsComponent,
  SourceClusterComponent,
  SourceUTFGridComponent,
  SourceVectorComponent,
  SourceXYZComponent,
  SourceVectorTileComponent,
  SourceTileWMSComponent,
  SourceTileWMTSComponent,
  SourceTileJSONComponent,
  SourceTileArcGISRestComponent,
  SourceImageTileComponent,
  SourceIIIFComponent,
  SourceZoomifyComponent,
  SourceGeoJSONComponent,
  SourceImageStaticComponent,
  SourceImageWMSComponent,
  SourceRasterComponent,
  SourceImageArcGISRestComponent,
  SourceOGCMapTileComponent,
  SourceOGCVectorTileComponent,
  SimpleGeometryComponent,
  FeatureComponent,
  GeometryLinestringComponent,
  GeometryMultiLinestringComponent,
  GeometryMultiPointComponent,
  GeometryMultiPolygonComponent,
  GeometryPointComponent,
  GeometryPolygonComponent,
  GeometryCircleComponent,
  GeometryCollectionComponent,
  CoordinateComponent,
  CollectionCoordinatesComponent,
  StyleComponent,
  StyleCircleComponent,
  StyleFillComponent,
  StyleIconComponent,
  StyleRegularShapeComponent,
  StyleStrokeComponent,
  StyleTextComponent,
  DefaultControlComponent,
  ControlComponent,
  ControlAttributionComponent,
  ControlFullScreenComponent,
  ControlMousePositionComponent,
  ControlOverviewMapComponent,
  ControlRotateComponent,
  ControlScaleLineComponent,
  ControlZoomComponent,
  ControlZoomSliderComponent,
  ControlZoomToExtentComponent,
  FormatMVTComponent,
  FormatGeoJSONComponent,
  TileGridComponent,
  TileGridWMTSComponent,
  DefaultInteractionComponent,
  DoubleClickZoomInteractionComponent,
  DragAndDropInteractionComponent,
  DragBoxInteractionComponent,
  DragPanInteractionComponent,
  DragRotateInteractionComponent,
  DragRotateAndZoomInteractionComponent,
  DragZoomInteractionComponent,
  MouseWheelZoomInteractionComponent,
  DblClickDragZoomInteractionComponent,
  PinchRotateInteractionComponent,
  PinchZoomInteractionComponent,
  ExtentInteractionComponent,
  LinkInteractionComponent,
  DrawInteractionComponent,
  KeyboardPanInteractionComponent,
  KeyboardZoomInteractionComponent,
  SelectInteractionComponent,
  ModifyInteractionComponent,
  SnapInteractionComponent,
  TranslateInteractionComponent,
  OverlayComponent,
  ContentComponent,
  AttributionsComponent,
  AttributionComponent,
};

const MAP_COMPONENTS = [MapComponent, ViewComponent];

const CONTROL_COMPONENTS = [
  DefaultControlComponent,
  ControlComponent,
  ControlAttributionComponent,
  ControlFullScreenComponent,
  ControlMousePositionComponent,
  ControlOverviewMapComponent,
  ControlRotateComponent,
  ControlScaleLineComponent,
  ControlZoomComponent,
  ControlZoomSliderComponent,
  ControlZoomToExtentComponent,
];

const MAP_INTERACTION_COMPONENTS = [
  DefaultInteractionComponent,
  DoubleClickZoomInteractionComponent,
  DragBoxInteractionComponent,
  DragPanInteractionComponent,
  DragRotateInteractionComponent,
  DragRotateAndZoomInteractionComponent,
  DragZoomInteractionComponent,
  MouseWheelZoomInteractionComponent,
  DblClickDragZoomInteractionComponent,
  PinchRotateInteractionComponent,
  PinchZoomInteractionComponent,
  LinkInteractionComponent,
  KeyboardPanInteractionComponent,
  KeyboardZoomInteractionComponent,
];

const FEATURE_INTERACTION_COMPONENTS = [
  DragAndDropInteractionComponent,
  DrawInteractionComponent,
  ExtentInteractionComponent,
  SelectInteractionComponent,
  ModifyInteractionComponent,
  SnapInteractionComponent,
  TranslateInteractionComponent,
];

const TILE_LAYER_COMPONENTS = [
  LayerGroupComponent,
  LayerTileComponent,
  LayerWebGLTileComponent,
  SourceOsmComponent,
  SourceBingmapsComponent,
  SourceUTFGridComponent,
  SourceXYZComponent,
  SourceTileWMSComponent,
  SourceTileWMTSComponent,
  SourceTileJSONComponent,
  SourceTileArcGISRestComponent,
  SourceImageTileComponent,
  SourceIIIFComponent,
  SourceZoomifyComponent,
  SourceOGCMapTileComponent,
  TileGridComponent,
  TileGridWMTSComponent,
];

const IMAGE_LAYER_COMPONENTS = [
  LayerGroupComponent,
  LayerImageComponent,
  SourceImageStaticComponent,
  SourceImageWMSComponent,
];

const ARC_GIS_COMPONENTS = [
  LayerGroupComponent,
  LayerImageComponent,
  LayerTileComponent,
  SourceImageArcGISRestComponent,
  SourceTileArcGISRestComponent,
];

const VECTOR_LAYER_COMPONENTS = [
  GraticuleComponent,
  LayerGroupComponent,
  LayerHeatmapComponent,
  LayerVectorComponent,
  LayerVectorImageComponent,
  LayerVectorTileComponent,
  SourceClusterComponent,
  SourceVectorComponent,
  SourceVectorTileComponent,
  SourceGeoJSONComponent,
  SourceRasterComponent,
  SourceOGCVectorTileComponent,
  FeatureComponent,
  FormatGeoJSONComponent,
  FormatMVTComponent,
];

const GEOMETRY_STYLE_COMPONENTS = [
  GeometryLinestringComponent,
  GeometryMultiLinestringComponent,
  GeometryMultiPointComponent,
  GeometryMultiPolygonComponent,
  GeometryPointComponent,
  GeometryPolygonComponent,
  GeometryCircleComponent,
  GeometryCollectionComponent,
  CoordinateComponent,
  CollectionCoordinatesComponent,
  StyleComponent,
  StyleCircleComponent,
  StyleFillComponent,
  StyleIconComponent,
  StyleRegularShapeComponent,
  StyleStrokeComponent,
  StyleTextComponent,
];

const OVERLAY_COMPONENTS = [
  OverlayComponent,
  ContentComponent,
  AttributionsComponent,
  AttributionComponent,
];

const COMPONENTS = [
  ...MAP_COMPONENTS,
  GraticuleComponent,

  LayerGroupComponent,
  LayerImageComponent,
  LayerTileComponent,
  LayerHeatmapComponent,
  LayerWebGLTileComponent,
  LayerVectorComponent,
  LayerVectorTileComponent,
  LayerVectorImageComponent,

  SourceOsmComponent,
  SourceBingmapsComponent,
  SourceClusterComponent,
  SourceUTFGridComponent,
  SourceVectorComponent,
  SourceXYZComponent,
  SourceVectorTileComponent,
  SourceTileWMSComponent,
  SourceTileWMTSComponent,
  SourceTileJSONComponent,
  SourceTileArcGISRestComponent,
  SourceImageTileComponent,
  SourceIIIFComponent,
  SourceZoomifyComponent,
  SourceGeoJSONComponent,
  SourceImageStaticComponent,
  SourceImageWMSComponent,
  SourceImageArcGISRestComponent,
  SourceRasterComponent,
  SourceOGCMapTileComponent,
  SourceOGCVectorTileComponent,

  FeatureComponent,
  GeometryLinestringComponent,
  GeometryMultiLinestringComponent,
  GeometryMultiPointComponent,
  GeometryMultiPolygonComponent,
  GeometryPointComponent,
  GeometryPolygonComponent,
  GeometryCircleComponent,
  GeometryCollectionComponent,
  CoordinateComponent,
  CollectionCoordinatesComponent,

  StyleComponent,
  StyleCircleComponent,
  StyleFillComponent,
  StyleIconComponent,
  StyleRegularShapeComponent,
  StyleStrokeComponent,
  StyleTextComponent,

  DefaultControlComponent,
  ControlComponent,
  ControlAttributionComponent,
  ControlFullScreenComponent,
  ControlMousePositionComponent,
  ControlOverviewMapComponent,
  ControlRotateComponent,
  ControlScaleLineComponent,
  ControlZoomComponent,
  ControlZoomSliderComponent,
  ControlZoomToExtentComponent,

  FormatMVTComponent,
  FormatGeoJSONComponent,
  TileGridComponent,
  TileGridWMTSComponent,

  DefaultInteractionComponent,
  DoubleClickZoomInteractionComponent,
  DragAndDropInteractionComponent,
  DragBoxInteractionComponent,
  DragPanInteractionComponent,
  DragRotateInteractionComponent,
  DragRotateAndZoomInteractionComponent,
  DragZoomInteractionComponent,
  MouseWheelZoomInteractionComponent,
  DblClickDragZoomInteractionComponent,
  PinchRotateInteractionComponent,
  PinchZoomInteractionComponent,
  ExtentInteractionComponent,
  LinkInteractionComponent,
  DrawInteractionComponent,
  KeyboardPanInteractionComponent,
  KeyboardZoomInteractionComponent,
  SelectInteractionComponent,
  ModifyInteractionComponent,
  SnapInteractionComponent,
  TranslateInteractionComponent,

  OverlayComponent,
  ContentComponent,
  AttributionsComponent,
  AttributionComponent,
];

@NgModule({
  imports: [CommonModule, ...MAP_COMPONENTS, ...CONTROL_COMPONENTS, ...MAP_INTERACTION_COMPONENTS],
  exports: [...MAP_COMPONENTS, ...CONTROL_COMPONENTS, ...MAP_INTERACTION_COMPONENTS],
})
export class AngularOpenlayersMapModule {}

@NgModule({
  imports: [CommonModule, ...CONTROL_COMPONENTS],
  exports: CONTROL_COMPONENTS,
})
export class AngularOpenlayersControlsModule {}

@NgModule({
  imports: [CommonModule, ...MAP_INTERACTION_COMPONENTS],
  exports: MAP_INTERACTION_COMPONENTS,
})
export class AngularOpenlayersMapInteractionsModule {}

@NgModule({
  imports: [CommonModule, ...FEATURE_INTERACTION_COMPONENTS],
  exports: FEATURE_INTERACTION_COMPONENTS,
})
export class AngularOpenlayersFeatureInteractionsModule {}

@NgModule({
  imports: [CommonModule, ...TILE_LAYER_COMPONENTS],
  exports: TILE_LAYER_COMPONENTS,
})
export class AngularOpenlayersTileLayersModule {}

@NgModule({
  imports: [CommonModule, ...IMAGE_LAYER_COMPONENTS],
  exports: IMAGE_LAYER_COMPONENTS,
})
export class AngularOpenlayersImageLayersModule {}

@NgModule({
  imports: [CommonModule, ...ARC_GIS_COMPONENTS],
  exports: ARC_GIS_COMPONENTS,
})
export class AngularOpenlayersArcGisModule {}

@NgModule({
  imports: [
    CommonModule,
    ...VECTOR_LAYER_COMPONENTS,
    ...GEOMETRY_STYLE_COMPONENTS,
    ...FEATURE_INTERACTION_COMPONENTS,
  ],
  exports: [...VECTOR_LAYER_COMPONENTS, ...GEOMETRY_STYLE_COMPONENTS, ...FEATURE_INTERACTION_COMPONENTS],
})
export class AngularOpenlayersVectorLayersModule {}

@NgModule({
  imports: [CommonModule, ...GEOMETRY_STYLE_COMPONENTS],
  exports: GEOMETRY_STYLE_COMPONENTS,
})
export class AngularOpenlayersGeometryStylesModule {}

@NgModule({
  imports: [CommonModule, ...OVERLAY_COMPONENTS],
  exports: OVERLAY_COMPONENTS,
})
export class AngularOpenlayersOverlayModule {}

@NgModule({
  imports: [CommonModule, ...COMPONENTS],
  exports: COMPONENTS,
})
export class AngularOpenlayersModule {}
