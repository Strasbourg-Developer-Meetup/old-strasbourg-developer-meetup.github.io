import Coordinates from "./coordinates.ts";
import DrawableManager from "./drawableManager.ts";

interface Dimensions {
  width: number;
  height: number;
}

class CanvasManager {
  #drawableManager: DrawableManager;
  #context: CanvasRenderingContext2D;
  #running: boolean;
  #origin: Coordinates;
  #dimensions: Dimensions;

  constructor(
    context: CanvasRenderingContext2D,
    drawableManager: DrawableManager,
    dimensions: Dimensions,
  ) {
    this.#context = context;
    this.#drawableManager = drawableManager;
    this.#running = false;
    this.#origin = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };
    this.#dimensions = dimensions;
  }

  set dimensions(dimensions: Dimensions) {
    this.#dimensions = dimensions;
    this.#origin = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };
  }

  #tick(timestamp: number) {
    this.#context.clearRect(
      0,
      0,
      this.#dimensions.width,
      this.#dimensions.height,
    );
    this.#context.translate(this.#origin.x, this.#origin.y);
    const { drawables } = this.#drawableManager;

    for (const drawable of drawables) {
      drawable.update(timestamp);
    }
    for (const drawable of drawables) {
      drawable.draw(this.#context);
    }
    requestAnimationFrame(this.#tick.bind(this));
    this.#context.resetTransform();
  }

  start() {
    if (this.#running) {
      return;
    }
    this.#running = true;
    this.#tick(0);
  }
}

export default CanvasManager;
