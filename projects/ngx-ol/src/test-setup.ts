class ResizeObserverStub {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

class WorkerStub {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  addEventListener(): void {}

  removeEventListener(): void {}

  dispatchEvent(): boolean {
    return true;
  }

  postMessage(): void {}

  terminate(): void {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
globalThis.PointerEvent ??= MouseEvent as unknown as typeof PointerEvent;
globalThis.Worker ??= WorkerStub as unknown as typeof Worker;

HTMLCanvasElement.prototype.getContext = (() =>
  ({
    canvas: document.createElement('canvas'),
    createLinearGradient: () => ({
      addColorStop(): void {},
    }),
    fillRect(): void {},
    clearRect(): void {},
    drawImage(): void {},
    getImageData: () => ({
      data: new Uint8ClampedArray(4),
    }),
  }) as unknown as RenderingContext) as typeof HTMLCanvasElement.prototype.getContext;
