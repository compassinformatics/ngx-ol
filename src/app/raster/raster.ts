import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

type RasterData = {
  brightness: number;
  contrast: number;
};

type RasterSourceRef = {
  instance: {
    refresh(): void;
  };
};

type LayerKind = 'osm' | 'imagery';

type RasterEvent = {
  data: RasterData;
};

@Component({
  selector: 'app-raster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './raster.html',
  styleUrl: './raster.less',
})
export class Raster {
  private readonly rasterSource = viewChild.required<RasterSourceRef>('rasterSource');

  readonly center = signal<Coordinate>(transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(14);
  readonly brightness = signal(0);
  readonly contrast = signal(0);
  readonly selectedLayer = signal<LayerKind>('osm');
  readonly operation = rasterOperation;

  protected beforeOperations(event: RasterEvent): void {
    event.data.brightness = this.brightness();
    event.data.contrast = this.contrast();
  }

  protected setSelectedLayer(layer: LayerKind): void {
    this.selectedLayer.set(layer);
  }

  protected setContrast(value: number): void {
    this.contrast.set(value);
    this.rasterSource().instance.refresh();
  }

  protected setBrightness(value: number): void {
    this.brightness.set(value);
    this.rasterSource().instance.refresh();
  }
}

export function rasterOperation(imageDatas: ImageData[] | number[][], data: RasterData): ImageData {
  const imageData = imageDatas[0] as ImageData;
  const pixels = imageData.data;
  const factor = (259 * (data.contrast + 255)) / (255 * (259 - data.contrast));

  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] += data.brightness;
    pixels[index + 1] += data.brightness;
    pixels[index + 2] += data.brightness;

    pixels[index] = factor * (pixels[index] - 128) + 128;
    pixels[index + 1] = factor * (pixels[index + 1] - 128) + 128;
    pixels[index + 2] = factor * (pixels[index + 2] - 128) + 128;
  }

  return imageData;
}
