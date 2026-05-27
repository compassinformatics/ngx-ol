# @compassinformatics/ngx-ol

Angular wrappers for OpenLayers.

For full documentation, examples, and the source repository, see:

https://github.com/compassinformatics/ngx-ol

## Installation

```bash
npm install @compassinformatics/ngx-ol
```

## Import

```ts
import { Component } from '@angular/core';
import { AngularOpenlayersModule } from '@compassinformatics/ngx-ol';

@Component({
  imports: [AngularOpenlayersModule],
  templateUrl: './app.html',
})
export class App {}
```

## Basic map

```html
<aol-map [width]="'500px'" [height]="'300px'">
  <aol-view [zoom]="9" [center]="[-907904, 7065770]"></aol-view>
  <aol-layer-tile>
    <aol-source-osm></aol-source-osm>
  </aol-layer-tile>
</aol-map>
```

## v22 breaking changes

Version 22 normalizes output names. The `ol` prefix is only used for outputs that would otherwise conflict with common native/browser event names or be too generic: `olChange`, `olClick`, `olError`, and `olSelect`.

Rename affected template bindings:

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
