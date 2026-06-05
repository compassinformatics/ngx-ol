# @compassinformatics/ngx-ol

Angular wrappers for [OpenLayers](https://openlayers.org/).

`ngx-ol` mirrors the OpenLayers object model with Angular components, so maps, views, layers, sources, features, styles, controls, overlays, and interactions can be declared in templates.

## Examples

Browse the live examples: https://compassinformatics.github.io/ngx-ol

Includes links to the source code for each example

## Installation

```bash
npm install @compassinformatics/ngx-ol
```

or

```bash
yarn add @compassinformatics/ngx-ol
```

## Usage
```ts
import { Component } from '@angular/core';
import { AngularOpenlayersModule } from '@compassinformatics/ngx-ol';

@Component({
  imports: [AngularOpenlayersModule],
  templateUrl: './app.html',
})
export class App {}
```

```html
<aol-map [width]="'500px'" [height]="'300px'">
  <aol-view [zoom]="9" [center]="[-907904, 7065770]"></aol-view>
  <aol-layer-tile>
    <aol-source-osm></aol-source-osm>
  </aol-layer-tile>
</aol-map>
```

## Component reference

Detailed component-by-component reference, including Angular inputs and outputs can be found here: [documentation/README.md](documentation/README.md).

## v22 breaking changes

Version 22 normalizes output names. The `ol` prefix is now only used where the unprefixed output would conflict with a common native/browser event name or be too generic: `olChange`, `olClick`, `olError`, and `olSelect`.

Update templates as follows:

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

`olPostRender` has been removed. Use the existing `(postRender)` output.

Programmatic access to wrapper component inputs, outputs, and queries now uses Angular's signal APIs. Template bindings are unchanged, but code that reads wrapper inputs directly must call them as signals, for example `view.zoom()` instead of `view.zoom`.

Components now rely on Angular 22's default `OnPush` change detection behavior. Applications should update state through signals, bindings, or other Angular change-detection notifications.

`aol-map` now defaults `runOutsideAngular` to `true`, so OpenLayers map event handling runs outside Angular's zone unless explicitly disabled with `[runOutsideAngular]="false"`.

## Development

Useful commands:

```bash
npm start
npm run build:lib
npm test
```

## Publishing

To prepare a release, update both package versions:

```bash
npm version patch --prefix projects/ngx-ol --no-git-tag-version
npm version patch --no-git-tag-version
```

Use `minor` or `major` instead of `patch` as needed.

To publish automatically:

1. Commit the version change.
2. Create and push a new tag with the version number, for example `v22.0.0`.
3. Create a GitHub release from that tag.

Publishing to npm is then handled by the GitHub Actions workflow.

To publish manually:

```bash
npm run build:lib
cd dist/ngx-ol
npm publish --access public
```
