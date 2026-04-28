import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ControlAttributionComponent,
  ControlScaleLineComponent,
  ControlZoomComponent,
  DefaultInteractionComponent,
  LayerTileComponent,
  MapComponent,
  SourceOsmComponent,
  ViewComponent,
} from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-individual-imports',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MapComponent,
    ViewComponent,
    LayerTileComponent,
    SourceOsmComponent,
    DefaultInteractionComponent,
    ControlScaleLineComponent,
    ControlZoomComponent,
    ControlAttributionComponent,
  ],
  templateUrl: './individual-imports.html',
  styleUrl: './individual-imports.less',
})
export class IndividualImports {
  readonly zoom = signal(7);
  readonly center = signal<Coordinate>([-871993.618677, 7062781.41355]);

  readonly usedComponents: readonly string[] = [
    'MapComponent',
    'ViewComponent',
    'LayerTileComponent',
    'SourceOsmComponent',
    'DefaultInteractionComponent',
    'ControlScaleLineComponent',
    'ControlZoomComponent',
    'ControlAttributionComponent',
  ];
}
