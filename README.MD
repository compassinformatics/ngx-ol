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
2. Create and push a new tag with the version number, for example `v21.1.0`.
3. Create a GitHub release from that tag.

Publishing to npm is then handled by the GitHub Actions workflow.

To publish manually:

```bash
npm run build:lib
cd dist/ngx-ol
npm publish --access public
```
