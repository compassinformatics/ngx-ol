# ngx-ol component reference

OpenLayers API reference: https://openlayers.org/en/latest/apidoc/

## v22 output name changes

Version 22 normalizes output names. The `ol` prefix is only used where the unprefixed output would conflict with a common native/browser event name or be too generic: `olChange`, `olClick`, `olError`, and `olSelect`.

Migration table:

| Before | After |
| --- | --- |
| `(olChangeLayerGroup)` | `(changeLayerGroup)` |
| `(olChangeSize)` | `(changeSize)` |
| `(olChangeTarget)` | `(changeTarget)` |
| `(olChangeView)` | `(changeView)` |
| `(olPostCompose)` | `(postCompose)` |
| `(olPreCompose)` | `(preCompose)` |
| `(olPropertyChange)` | `(propertyChange)` |
| `(olChangeActive)` | `(changeActive)` |
| `(olDrawAbort)` | `(drawAbort)` |
| `(olModifyStart)` | `(modifyStart)` |
| `(olModifyEnd)` | `(modifyEnd)` |
| `(olSnap)` | `(snap)` |

`olPostRender` has been removed. Use `(postRender)`.

## Table of contents

- [v22 output name changes](#v22-output-name-changes)
- [Modules](#modules)
- [Map setup](#map-setup)
- [Layer groups](#layer-groups)
- [Tile layers and tiled sources](#tile-layers-and-tiled-sources)
- [Image layers and image sources](#image-layers-and-image-sources)
- [Vector layers, vector sources, and formats](#vector-layers-vector-sources-and-formats)
- [Features and geometry](#features-and-geometry)
- [Styles](#styles)
- [Attributions](#attributions)
- [Controls](#controls)
- [Overlays](#overlays)
- [Interactions](#interactions)

## Modules

The library exports the full `AngularOpenlayersModule` as well as grouped modules:

- `AngularOpenlayersMapModule`
- `AngularOpenlayersControlsModule`
- `AngularOpenlayersMapInteractionsModule`
- `AngularOpenlayersFeatureInteractionsModule`
- `AngularOpenlayersTileLayersModule`
- `AngularOpenlayersImageLayersModule`
- `AngularOpenlayersArcGisModule`
- `AngularOpenlayersVectorLayersModule`
- `AngularOpenlayersGeometryStylesModule`
- `AngularOpenlayersOverlayModule`

Example:

```ts
import { Component } from '@angular/core';
import { AngularOpenlayersModule } from '@compassinformatics/ngx-ol';

@Component({
  imports: [AngularOpenlayersModule],
  templateUrl: './app.html',
})
export class App {}
```

## Map setup

```html
<aol-map [width]="'100%'" [height]="'400px'">
  <aol-view [zoom]="9" [center]="[-907904, 7065770]"></aol-view>
</aol-map>
```

### aol-map

`aol-map` is the root component and wraps `ol/Map`.

Inputs:

- `width`
- `height`
- `pixelRatio`
- `keyboardEventTarget`
- `maxTilesLoading`
- `moveTolerance`
- `runOutsideAngular`

Outputs:

- `olChange`
- `changeLayerGroup`
- `changeSize`
- `changeTarget`
- `changeView`
- `olClick`
- `dblClick`
- `olError`
- `loadEnd`
- `loadStart`
- `moveEnd`
- `moveStart`
- `pointerDrag`
- `pointerMove`
- `postCompose`
- `preCompose`
- `postRender`
- `propertyChange`
- `singleClick`

### aol-view

`aol-view` wraps `ol/View`.

Inputs:

- `constrainRotation`
- `enableRotation`
- `extent`
- `maxResolution`
- `minResolution`
- `maxZoom`
- `minZoom`
- `resolution`
- `resolutions`
- `rotation`
- `zoom`
- `zoomFactor`
- `center`
- `projection`
- `constrainOnlyCenter`
- `smoothExtentConstraint`
- `constrainResolution`
- `smoothResolutionConstraint`
- `showFullExtent`
- `multiWorld`
- `padding`
- `zoomAnimation`

Outputs:

- `olChange`
- `changeCenter`
- `changeResolution`
- `changeRotation`
- `olError`
- `propertyChange`

## Layer groups

```html
<aol-layer-group>
  <aol-layer-tile>
    <aol-source-osm></aol-source-osm>
  </aol-layer-tile>
</aol-layer-group>
```

### aol-layer-group

`aol-layer-group` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`

## Tile layers and tiled sources

```html
<aol-layer-tile>
  <aol-source-osm></aol-source-osm>
</aol-layer-tile>
```

### aol-layer-tile

`aol-layer-tile` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `preload`
- `useInterimTilesOnError`
- `cacheSize`
- `source`

### aol-source-osm

`aol-source-osm` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `interpolate`
- `maxZoom`
- `reprojectionErrorThreshold`
- `tileLoadFunction`
- `transition`
- `url`
- `wrapX`
- `zDirection`

Outputs:

- `tileLoadStart`
- `tileLoadEnd`
- `tileLoadError`

### aol-source-bingmaps

`aol-source-bingmaps` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `hidpi`
- `culture`
- `key`
- `imagerySet`
- `maxZoom`
- `reprojectionErrorThreshold`
- `tileLoadFunction`
- `wrapX`
- `interpolate`
- `placeholderTiles`
- `transition`
- `zDirection`

### aol-source-xyz

`aol-source-xyz` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `gutter`
- `interpolate`
- `projection`
- `reprojectionErrorThreshold`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `tileGrid`
- `tileLoadFunction`
- `tilePixelRatio`
- `tileSize`
- `tileUrlFunction`
- `transition`
- `url`
- `urls`
- `wrapX`
- `zDirection`

Outputs:

- `tileLoadStart`
- `tileLoadEnd`
- `tileLoadError`

### aol-source-tilejson

`aol-source-tilejson` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `interpolate`
- `jsonp`
- `reprojectionErrorThreshold`
- `tileJSON`
- `tileLoadFunction`
- `tileSize`
- `url`
- `wrapX`
- `transition`
- `zDirection`

### aol-source-tilewms

`aol-source-tilewms` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `gutter`
- `hidpi`
- `interpolate`
- `params`
- `projection`
- `reprojectionErrorThreshold`
- `serverType`
- `tileClass`
- `tileGrid`
- `tileLoadFunction`
- `url`
- `urls`
- `wrapX`
- `transition`
- `zDirection`

### aol-source-tilewmts

`aol-source-tilewmts` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `interpolate`
- `tileGrid`
- `projection`
- `reprojectionErrorThreshold`
- `requestEncoding`
- `layer`
- `style`
- `tileClass`
- `tilePixelRatio`
- `version`
- `format`
- `matrixSet`
- `dimensions`
- `url`
- `tileLoadFunction`
- `urls`
- `wrapX`
- `transition`
- `zDirection`

Outputs:

- `tileLoadStart`
- `tileLoadEnd`
- `tileLoadError`

### aol-source-tilearcgisrest

`aol-source-tilearcgisrest` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `interpolate`
- `params`
- `hidpi`
- `tileGrid`
- `projection`
- `reprojectionErrorThreshold`
- `tileLoadFunction`
- `url`
- `wrapX`
- `transition`
- `urls`
- `zDirection`

### aol-source-ogcmaptile

`aol-source-ogcmaptile` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `url`
- `context`
- `mediaType`
- `projection`
- `cacheSize`
- `crossOrigin`
- `interpolate`
- `reprojectionErrorThreshold`
- `tileLoadFunction`
- `wrapX`
- `transition`
- `collections`

### aol-source-imagetile

`aol-source-imagetile` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `url`
- `loader`
- `maxZoom`
- `minZoom`
- `tileSize`
- `gutter`
- `maxResolution`
- `projection`
- `tileGrid`
- `state`
- `wrapX`
- `transition`
- `interpolate`
- `crossOrigin`

### aol-source-iiif

`aol-source-iiif` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `extent`
- `format`
- `interpolate`
- `projection`
- `quality`
- `reprojectionErrorThreshold`
- `resolutions`
- `size`
- `sizes`
- `state`
- `supports`
- `tilePixelRatio`
- `tileSize`
- `transition`
- `url`
- `version`
- `zDirection`

### aol-source-zoomify

`aol-source-zoomify` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `crossOrigin`
- `interpolate`
- `projection`
- `tilePixelRatio`
- `reprojectionErrorThreshold`
- `url`
- `tierSizeCalculation`
- `size`
- `extent`
- `transition`
- `tileSize`
- `zDirection`

## Image layers and image sources

```html
<aol-layer-image>
  <aol-source-imagewms
    [url]="'https://example.com/geoserver/wms'"
    [params]="{ LAYERS: 'workspace:layer' }">
  </aol-source-imagewms>
</aol-layer-image>
```

### aol-layer-image

`aol-layer-image` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `source`

### aol-source-imagestatic

`aol-source-imagestatic` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `projection`
- `imageExtent`
- `url`
- `crossOrigin`
- `imageLoadFunction`
- `interpolate`

Outputs:

- `imageLoadStart`
- `imageLoadEnd`
- `imageLoadError`

### aol-source-imagewms

`aol-source-imagewms` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `crossOrigin`
- `hidpi`
- `serverType`
- `imageLoadFunction`
- `interpolate`
- `params`
- `projection`
- `ratio`
- `resolutions`
- `url`

Outputs:

- `imageLoadStart`
- `imageLoadEnd`
- `imageLoadError`

### aol-source-imagearcgisrest

`aol-source-imagearcgisrest` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `projection`
- `url`
- `crossOrigin`
- `hidpi`
- `imageLoadFunction`
- `interpolate`
- `params`
- `ratio`
- `resolutions`

Outputs:

- `imageLoadStart`
- `imageLoadEnd`
- `imageLoadError`

## Vector layers, vector sources, and formats

```html
<aol-layer-vectortile [renderMode]="'vector'">
  <aol-source-vectortile [tileUrlFunction]="tileUrlFn">
    <aol-format-mvt></aol-format-mvt>
    <aol-tilegrid [resolutions]="resolutions"></aol-tilegrid>
  </aol-source-vectortile>
</aol-layer-vectortile>
```

### aol-layer-vector

`aol-layer-vector` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `renderOrder`
- `renderBuffer`
- `style`
- `updateWhileAnimating`
- `updateWhileInteracting`
- `declutter`
- `background`
- `source`

### aol-layer-vectorimage

`aol-layer-vectorimage` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `renderBuffer`
- `style`
- `declutter`
- `background`
- `imageRatio`
- `source`

### aol-layer-vectortile

`aol-layer-vectortile` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `renderBuffer`
- `renderMode`
- `renderOrder`
- `style`
- `background`
- `updateWhileAnimating`
- `updateWhileInteracting`
- `source`

### aol-layer-heatmap

`aol-layer-heatmap` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `gradient`
- `radius`
- `blur`
- `weight`
- `source`

### aol-layer-webgltile

`aol-layer-webgltile` wraps the corresponding OpenLayers layer.

Inputs:

- `id`
- `className`
- `opacity`
- `visible`
- `extent`
- `zIndex`
- `minResolution`
- `maxResolution`
- `minZoom`
- `maxZoom`
- `render`
- `properties`
- `prerender`
- `postrender`
- `style`
- `preload`
- `source`
- `sources`
- `map`
- `useInterimTilesOnError`
- `cacheSize`

### aol-source-vector

`aol-source-vector` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `overlaps`
- `features`
- `useSpatialIndex`
- `wrapX`
- `loader`
- `url`
- `format`
- `strategy`

### aol-source-cluster

`aol-source-cluster` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `distance`
- `minDistance`
- `geometryFunction`
- `wrapX`
- `createCluster`

### aol-source-geojson

`aol-source-geojson` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `defaultDataProjection`
- `featureProjection`
- `geometryName`
- `url`

### aol-source-vectortile

`aol-source-vectortile` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `cacheSize`
- `extent`
- `overlaps`
- `projection`
- `state`
- `tileClass`
- `maxZoom`
- `minZoom`
- `tileSize`
- `maxResolution`
- `tileUrlFunction`
- `tileLoadFunction`
- `url`
- `urls`
- `transition`
- `wrapX`
- `zDirection`
- `format`

### aol-source-ogcvectortile

`aol-source-ogcvectortile` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `url`
- `context`
- `mediaType`
- `cacheSize`
- `overlaps`
- `projection`
- `tileClass`
- `transition`
- `wrapX`
- `zDirection`
- `collections`
- `format`

### aol-source-raster

`aol-source-raster` wraps the corresponding OpenLayers source.

Inputs:

- `attributions`
- `attributionsCollapsible`
- `operation`
- `threads`
- `lib`
- `operationType`
- `resolutions`

Outputs:

- `beforeOperations`
- `afterOperations`

### aol-format-geojson

`aol-format-geojson` wraps the corresponding OpenLayers format.

Inputs:

- `featureClass`
- `geometryName`
- `dataProjection`
- `featureProjection`
- `extractGeometryName`

### aol-format-mvt

`aol-format-mvt` wraps the corresponding OpenLayers format.

Inputs:

- `featureClass`
- `geometryName`
- `layerName`
- `layers`
- `idProperty`

### aol-graticule

`aol-graticule` wraps the OpenLayers graticule overlay.

Inputs:

- `strokeStyle`
- `showLabels`
- `lonLabelPosition`
- `latLabelPosition`

## Features and geometry

```html
<aol-layer-vector>
  <aol-source-vector>
    <aol-feature>
      <aol-geometry-point>
        <aol-coordinate [x]="5" [y]="45" [srid]="'EPSG:4326'"></aol-coordinate>
      </aol-geometry-point>
    </aol-feature>
  </aol-source-vector>
</aol-layer-vector>
```

### aol-feature

`aol-feature` wraps `ol/Feature`.

Inputs:

- `id`
- `properties`
- `feature`
- `clickable`

Outputs:

- `olClick`
- `singleClick`
- `dblClick`

### aol-coordinate

`aol-coordinate` is the single coordinate helper component.

Inputs:

- `x`
- `y`
- `srid`

### aol-collection-coordinates

`aol-collection-coordinates` is the coordinate collection helper component.

Inputs:

- `coordinates`
- `srid`

### aol-geometry-point

`aol-geometry-point` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`
- `coordinates`
- `layout`

### aol-geometry-circle

`aol-geometry-circle` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`
- `center`
- `layout`
- `radius`

### aol-geometry-linestring

`aol-geometry-linestring` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`

### aol-geometry-polygon

`aol-geometry-polygon` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`

### aol-geometry-multipoint

`aol-geometry-multipoint` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`

### aol-geometry-multilinestring

`aol-geometry-multilinestring` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`

### aol-geometry-multipolygon

`aol-geometry-multipolygon` wraps the corresponding OpenLayers geometry.

Inputs:

- `srid`

### aol-geometry-collection

`aol-geometry-collection` wraps the corresponding OpenLayers geometry.

Inputs:

- `geometries`

## Styles

```html
<aol-style>
  <aol-style-circle [radius]="10">
    <aol-style-stroke [color]="'black'" [width]="2"></aol-style-stroke>
    <aol-style-fill [color]="'green'"></aol-style-fill>
  </aol-style-circle>
</aol-style>
```

### aol-style

`aol-style` wraps the corresponding OpenLayers style.

Inputs:

- `geometry`
- `fill`
- `image`
- `renderer`
- `hitDetectionRenderer`
- `stroke`
- `text`
- `zIndex`

### aol-style-circle

`aol-style-circle` wraps the corresponding OpenLayers style.

Inputs:

- `fill`
- `radius`
- `stroke`
- `displacement`
- `scale`
- `rotation`
- `rotateWithView`
- `declutterMode`

### aol-style-fill

`aol-style-fill` wraps the corresponding OpenLayers style.

Inputs:

- `color`

### aol-style-icon

`aol-style-icon` wraps the corresponding OpenLayers style.

Inputs:

- `anchor`
- `anchorXUnits`
- `anchorYUnits`
- `anchorOrigin`
- `color`
- `crossOrigin`
- `img`
- `displacement`
- `offset`
- `offsetOrigin`
- `opacity`
- `width`
- `height`
- `scale`
- `declutterMode`
- `rotateWithView`
- `rotation`
- `size`
- `src`

### aol-style-regularshape

`aol-style-regularshape` wraps the corresponding OpenLayers style.

Inputs:

- `fill`
- `points`
- `radius`
- `radius2`
- `angle`
- `displacement`
- `stroke`
- `rotation`
- `rotateWithView`
- `scale`
- `declutterMode`

### aol-style-stroke

`aol-style-stroke` wraps the corresponding OpenLayers style.

Inputs:

- `color`
- `lineCap`
- `lineDash`
- `lineDashOffset`
- `lineJoin`
- `miterLimit`
- `width`

### aol-style-text

`aol-style-text` wraps the corresponding OpenLayers style.

Inputs:

- `font`
- `maxAngle`
- `offsetX`
- `offsetY`
- `overflow`
- `placement`
- `repeat`
- `scale`
- `rotateWithView`
- `rotation`
- `text`
- `textAlign`
- `justify`
- `textBaseline`
- `fill`
- `stroke`
- `backgroundFill`
- `backgroundStroke`
- `padding`
- `declutterMode`

## Attributions

```html
<aol-attributions>
  <aol-attribution>&copy; Example data provider</aol-attribution>
</aol-attributions>
```

### aol-attributions

`aol-attributions` is the attributions container component.

### aol-attribution

`aol-attribution` is the attribution item component.

## Controls

```html
<aol-control>
  <aol-content>
    <div class="ol-unselectable ol-control">
      <button type="button">Custom control</button>
    </div>
  </aol-content>
</aol-control>
```

### aol-content

`aol-content` is the projected content helper component.

### aol-control

`aol-control` wraps a custom OpenLayers control container.

### aol-control-defaults

`aol-control-defaults` wraps the default OpenLayers control set.

Inputs:

- `attribution`
- `attributionOptions`
- `rotate`
- `rotateOptions`
- `zoom`
- `zoomOptions`

### aol-control-attribution

`aol-control-attribution` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `collapsible`
- `collapsed`
- `tipLabel`
- `label`
- `expandClassName`
- `collapseLabel`
- `collapseClassName`
- `render`

### aol-control-fullscreen

`aol-control-fullscreen` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `label`
- `labelActive`
- `activeClassName`
- `inactiveClassName`
- `tipLabel`
- `keys`
- `target`
- `source`

### aol-control-mouseposition

`aol-control-mouseposition` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `coordinateFormat`
- `projection`
- `render`
- `placeholder`
- `wrapX`

### aol-control-overviewmap

`aol-control-overviewmap` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `collapsed`
- `collapseLabel`
- `collapsible`
- `label`
- `layers`
- `render`
- `rotateWithView`
- `target`
- `tipLabel`
- `view`

### aol-control-rotate

`aol-control-rotate` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `label`
- `tipLabel`
- `compassClassName`
- `duration`
- `autoHide`
- `render`
- `resetNorth`
- `target`

### aol-control-scaleline

`aol-control-scaleline` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `minWidth`
- `maxWidth`
- `render`
- `target`
- `units`
- `bar`
- `steps`
- `text`
- `dpi`

### aol-control-zoom

`aol-control-zoom` wraps the corresponding OpenLayers control.

Inputs:

- `duration`
- `className`
- `zoomInClassName`
- `zoomOutClassName`
- `zoomInLabel`
- `zoomOutLabel`
- `zoomInTipLabel`
- `zoomOutTipLabel`
- `delta`
- `target`

### aol-control-zoomslider

`aol-control-zoomslider` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `duration`
- `render`
- `target`

### aol-control-zoomtoextent

`aol-control-zoomtoextent` wraps the corresponding OpenLayers control.

Inputs:

- `className`
- `target`
- `label`
- `tipLabel`
- `extent`

## Overlays

```html
<aol-overlay [position]="[-907904, 7065770]">
  <aol-content>
    <div class="my-overlay-class">
      Overlay content
    </div>
  </aol-content>
</aol-overlay>
```

### aol-overlay

`aol-overlay` wraps `ol/Overlay`.

Inputs:

- `id`
- `offset`
- `positioning`
- `stopEvent`
- `insertFirst`
- `autoPan`
- `position`
- `className`

### aol-content

`aol-content` is the projected content helper component.

## Interactions

```html
<aol-map>
  <aol-interaction-default></aol-interaction-default>
  <aol-interaction-draw [type]="'Polygon'"></aol-interaction-draw>
</aol-map>
```

### aol-interaction-default

`aol-interaction-default` wraps the default OpenLayers interaction set.

Inputs:

- `altShiftDragRotate`
- `onFocusOnly`
- `doubleClickZoom`
- `keyboard`
- `mouseWheelZoom`
- `shiftDragZoom`
- `dragPan`
- `pinchRotate`
- `pinchZoom`
- `zoomDelta`
- `zoomDuration`

### aol-interaction-doubleclickzoom

`aol-interaction-doubleclickzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`
- `delta`

### aol-interaction-dblclickdragzoom

`aol-interaction-dblclickdragzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`
- `delta`
- `stopDown`

### aol-interaction-draganddrop

`aol-interaction-draganddrop` wraps the corresponding OpenLayers interaction.

Inputs:

- `formatConstructors`
- `projection`
- `target`

### aol-interaction-dragbox

`aol-interaction-dragbox` wraps the corresponding OpenLayers interaction.

Inputs:

- `className`
- `condition`
- `boxEndCondition`

### aol-interaction-dragpan

`aol-interaction-dragpan` wraps the corresponding OpenLayers interaction.

Inputs:

- `condition`
- `kinetic`

### aol-interaction-dragrotate

`aol-interaction-dragrotate` wraps the corresponding OpenLayers interaction.

Inputs:

- `condition`
- `duration`

### aol-interaction-dragrotateandzoom

`aol-interaction-dragrotateandzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `condition`
- `duration`

### aol-interaction-dragzoom

`aol-interaction-dragzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `className`
- `condition`
- `duration`
- `out`

### aol-interaction-draw

`aol-interaction-draw` wraps the corresponding OpenLayers interaction.

Inputs:

- `clickTolerance`
- `features`
- `source`
- `dragVertexDelay`
- `snapTolerance`
- `stopClick`
- `type`
- `maxPoints`
- `minPoints`
- `finishCondition`
- `style`
- `geometryFunction`
- `geometryName`
- `condition`
- `freehandCondition`
- `freehand`
- `trace`
- `traceSource`
- `wrapX`
- `geometryLayout`

Outputs:

- `olChange`
- `changeActive`
- `drawAbort`
- `drawEnd`
- `drawStart`
- `olError`
- `propertyChange`

### aol-interaction-extent

`aol-interaction-extent` wraps the corresponding OpenLayers interaction.

Inputs:

- `condition`
- `extent`
- `boxStyle`
- `pixelTolerance`
- `pointerStyle`
- `wrapX`

Outputs:

- `extentChanged`

### aol-interaction-keyboardpan

`aol-interaction-keyboardpan` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`
- `pixelDelta`

### aol-interaction-keyboardzoom

`aol-interaction-keyboardzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`
- `delta`

### aol-interaction-link

`aol-interaction-link` wraps the corresponding OpenLayers interaction.

Inputs:

- `animate`
- `params`
- `replace`
- `prefix`

### aol-interaction-modify

`aol-interaction-modify` wraps the corresponding OpenLayers interaction.

Inputs:

- `condition`
- `deleteCondition`
- `insertVertexCondition`
- `pixelTolerance`
- `style`
- `features`
- `wrapX`
- `source`
- `hitDetection`
- `snapToPointer`

Outputs:

- `olChange`
- `changeActive`
- `olError`
- `modifyEnd`
- `modifyStart`
- `propertyChange`

### aol-interaction-mousewheelzoom

`aol-interaction-mousewheelzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`
- `timeout`
- `useAnchor`

### aol-interaction-pinchrotate

`aol-interaction-pinchrotate` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`
- `threshold`

### aol-interaction-pinchzoom

`aol-interaction-pinchzoom` wraps the corresponding OpenLayers interaction.

Inputs:

- `duration`

### aol-interaction-select

`aol-interaction-select` wraps the corresponding OpenLayers interaction.

Inputs:

- `addCondition`
- `condition`
- `layers`
- `style`
- `removeCondition`
- `toggleCondition`
- `multi`
- `features`
- `filter`
- `hitTolerance`

Outputs:

- `olChange`
- `changeActive`
- `olError`
- `propertyChange`
- `olSelect`

### aol-interaction-snap

`aol-interaction-snap` wraps the corresponding OpenLayers interaction.

Inputs:

- `features`
- `edge`
- `vertex`
- `pixelTolerance`
- `source`

Outputs:

- `olChange`
- `changeActive`
- `olError`
- `propertyChange`
- `snap`

### aol-interaction-translate

`aol-interaction-translate` wraps the corresponding OpenLayers interaction.

Inputs:

- `condition`
- `features`
- `layers`
- `filter`
- `hitTolerance`

Outputs:

- `olChange`
- `changeActive`
- `olError`
- `propertyChange`
- `translateEnd`
- `translateStart`
- `translating`
