# @compassinformatics/ngx-ol

## Demo

TODO

## Installation

To install this library, run:

```bash
npm install @compassinformatics/ngx-ol --save
```

## Example

Here is a "minimal" map example that fetches tiles from OpenStreetMap and center the map in Meylan (France):

```html
<aol-map [width]="'500px'" [height]="'300px'">
  <aol-view [zoom]="9" [center]="[-907904, 7065770]"></aol-view>
  <aol-layer-tile>
    <aol-source-osm></aol-source-osm>
  </aol-layer-tile>
</aol-map>
```

## Documentation

See `/src/app` for examples

## Sub Modules

The library also exposes smaller grouped modules so an app does not need to import `AngularOpenlayersModule` for every demo or feature.

### Available grouped modules

- `AngularOpenlayersMapModule`
  Includes `MapComponent`, `ViewComponent`, all control components, and the map-level interaction components.
- `AngularOpenlayersControlsModule`
  Includes the control components only.
- `AngularOpenlayersMapInteractionsModule`
  Includes map navigation and viewport interactions only.
- `AngularOpenlayersFeatureInteractionsModule`
  Includes `DragAndDropInteractionComponent`, `DrawInteractionComponent`, `SelectInteractionComponent`, `ModifyInteractionComponent`, `SnapInteractionComponent`, and `TranslateInteractionComponent`.
- `AngularOpenlayersTileLayersModule`
  Includes `LayerGroupComponent`, `LayerTileComponent`, tiled source components, and tile grid helpers.
- `AngularOpenlayersImageLayersModule`
  Includes `LayerGroupComponent`, `LayerImageComponent`, `SourceImageStaticComponent`, and `SourceImageWMSComponent`.
- `AngularOpenlayersArcGisModule`
  Includes `LayerGroupComponent`, `LayerImageComponent`, and `SourceImageArcGISRestComponent`.
- `AngularOpenlayersVectorLayersModule`
  Includes vector layer components, vector source components, `FeatureComponent`, format components, geometry components, style components, and feature interaction components.
- `AngularOpenlayersGeometryStylesModule`
  Includes template-based geometry and style components only.
- `AngularOpenlayersOverlayModule`
  Includes `OverlayComponent`, `ContentComponent`, `AttributionsComponent`, and `AttributionComponent`.

### Not included in grouped modules

These remain direct exports and are not included in the grouped modules because they are abstract base building blocks:

- `LayerComponent`
- `SourceComponent`
- `SimpleGeometryComponent`

### Example

```ts
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
} from '@compassinformatics/ngx-ol';

@Component({
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './basic-map.html',
})
export class BasicMap {}
```

## Development

TODO

Live example will be viewable at locahost:4200

## Publish

```
npm version <update_type> (major, minor, patch) --prefix projects/ngx-ol
npm run build:lib
cd dist/ngx-ol
npm publish --access public
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request and enjoy! :D
