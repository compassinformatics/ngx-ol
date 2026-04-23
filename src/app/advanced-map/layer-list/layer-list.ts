import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { MapLayer } from '../layers';

@Component({
  selector: 'app-layer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './layer-list.html',
  styleUrl: './layer-list.less',
})
export class LayerList {
  readonly layers = model.required<MapLayer[]>();
  protected readonly sortedLayers = computed(() => this.sortLayersByZIndex(this.layers()));
  protected readonly draggedLayerId = signal<MapLayer['id'] | null>(null);
  protected readonly dropTargetLayerId = signal<MapLayer['id'] | null>(null);

  protected setLayerVisibility(layerId: MapLayer['id'], isVisible: boolean): void {
    this.layers.update((layers) =>
      layers.map((layer) => (layer.id === layerId ? { ...layer, isVisible } : layer)),
    );
  }

  protected setLayerOpacity(layerId: MapLayer['id'], opacity: number): void {
    this.layers.update((layers) =>
      layers.map((layer) => (layer.id === layerId ? { ...layer, opacity } : layer)),
    );
  }

  protected formatOpacity(opacity: number): string {
    return `${Math.round(opacity * 100)}%`;
  }

  protected startDragging(event: DragEvent, layerId: MapLayer['id']): void {
    this.draggedLayerId.set(layerId);
    this.dropTargetLayerId.set(layerId);

    event.dataTransfer?.setData('text/plain', String(layerId));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  protected allowDrop(event: DragEvent, layerId: MapLayer['id']): void {
    event.preventDefault();
    if (this.draggedLayerId() !== layerId) {
      this.dropTargetLayerId.set(layerId);
    }
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  protected dropLayer(event: DragEvent, targetLayerId: MapLayer['id']): void {
    event.preventDefault();

    const draggedLayerId = this.draggedLayerId();
    if (draggedLayerId === null || draggedLayerId === targetLayerId) {
      this.resetDragState();
      return;
    }

    this.layers.update((layers) => this.reorderLayers(layers, draggedLayerId, targetLayerId));
    this.resetDragState();
  }

  protected endDragging(): void {
    this.resetDragState();
  }

  private reorderLayers(
    layers: MapLayer[],
    draggedLayerId: MapLayer['id'],
    targetLayerId: MapLayer['id'],
  ): MapLayer[] {
    const currentLayers = this.sortLayersByZIndex(layers);
    const draggedIndex = currentLayers.findIndex((layer) => layer.id === draggedLayerId);
    const targetIndex = currentLayers.findIndex((layer) => layer.id === targetLayerId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return layers;
    }

    const [draggedLayer] = currentLayers.splice(draggedIndex, 1);
    currentLayers.splice(targetIndex, 0, draggedLayer);

    const highestZIndex = currentLayers.length;

    return currentLayers.map((layer, index) => ({
      ...layer,
      zIndex: highestZIndex - index,
    }));
  }

  private sortLayersByZIndex(layers: MapLayer[]): MapLayer[] {
    return [...layers].sort((left, right) => right.zIndex - left.zIndex);
  }

  private resetDragState(): void {
    this.draggedLayerId.set(null);
    this.dropTargetLayerId.set(null);
  }
}
