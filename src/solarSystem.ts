interface Drawable {
  update(timestamp: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

interface Origin {
  x: number;
  y: number;
}

type Orbit = Origin;

interface Dimensions {
  width: number;
  height: number;
}

interface PlanetParams {
  radius: number;
  orbit: Orbit;
  orbitRadius: number;
  color: string;
  orbitSpeed: number;
}

class Planet implements Drawable {
  #radius: number;
  #color: string;
  #x!: number;
  #y!: number;
  #orbit: Orbit;
  #orbitRadius: number;
  #orbitSpeed: number; // miliseconds

  constructor(params: PlanetParams) {
    this.#radius = params.radius;
    this.#color = params.color;
    this.#orbit = params.orbit;
    this.#orbitRadius = params.orbitRadius;
    this.#orbitSpeed = params.orbitSpeed;
  }

  update(timestamp: number): void {
    const angle =
      ((timestamp % this.#orbitSpeed) / this.#orbitSpeed * (2 * Math.PI));
    this.#x = this.#orbit.x + this.#orbitRadius * Math.cos(angle);
    this.#y = this.#orbit.y + this.#orbitRadius * Math.sin(angle);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.#color;
    context.strokeStyle = this.#color;
    context.beginPath();
    context.arc(this.#x, this.#y, this.#radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  }

  get position() {
    return {
      x: this.#x,
      y: this.#y,
    };
  }
}

class CanvasManager {
  #drawables: Drawable[];
  #context: CanvasRenderingContext2D;
  #running: boolean;
  #origin: Origin;
  dimensions: Dimensions;

  constructor(
    context: CanvasRenderingContext2D,
    drawables: Drawable[],
    origin: Origin,
    dimensions: Dimensions,
  ) {
    this.#context = context;
    this.#drawables = drawables ?? [];
    this.#running = false;
    this.#origin = origin;
    this.dimensions = dimensions;
  }

  #tick(timestamp: number) {
    this.#context.clearRect(
      0,
      0,
      this.dimensions.width,
      this.dimensions.height,
    );
    this.#context.translate(this.#origin.x, this.#origin.y);
    for (const drawable of this.#drawables) {
      drawable.update(timestamp);
    }
    for (const drawable of this.#drawables) {
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

const getSolarSystem = (universeSize: number) => {
  return [
    new Planet({
      radius: universeSize * 0.02,
      orbit: { x: 0, y: 0 },
      orbitRadius: universeSize * 0.1,
      orbitSpeed: 10000,
      color: "green",
    }),
  ];
};

const init = (canvasId: string) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    console.error("[SolarSystem] Could not find canvas, aborting.");
    return;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("[SolarSystem] Could not find context, aborting.");
    return;
  }
  const maxSize = Math.min(self.innerWidth, self.innerHeight);
  const canvasManager = new CanvasManager(
    context,
    getSolarSystem(maxSize),
    { x: maxSize / 2, y: maxSize / 2 },
    { width: self.innerWidth, height: self.innerHeight },
  );
  const resize = () => {
    const { innerWidth, innerHeight } = self;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvasManager.dimensions = {
      width: self.innerWidth,
      height: self.innerHeight,
    };
  };

  resize();
  self.addEventListener("resize", resize);

  canvasManager.start();
};

export default init;
