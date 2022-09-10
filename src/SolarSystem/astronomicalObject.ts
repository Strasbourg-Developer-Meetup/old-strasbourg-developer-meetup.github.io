import Circle from "./circle.ts";
import Coordinates from "./coordinates.ts";
import Entity from "./entity.ts";

interface Orbit {
  radius: number;
  speed: number;
}

interface AOParams {
  radius: number;
  orbit: Orbit;
  direction: -1 | 1;
}

class AstronomicalObject extends Circle implements Entity {
  #orbit: Orbit;
  #coordinates: Coordinates;
  #moons: AstronomicalObject[];
  #direction: -1 | 1;

  constructor(params: AOParams) {
    super(params.radius, "#d4b404");
    this.#orbit = structuredClone(params.orbit);
    this.#coordinates = { x: 0, y: 0 };
    this.#moons = [];
    this.#direction = params.direction;
  }

  addMoon(moon: AstronomicalObject) {
    this.#moons.push(moon);
  }

  get coordinates(): Coordinates {
    return this.#coordinates;
  }

  update(timestamp: number): void {
    const angle = this.#direction *
      ((timestamp % this.#orbit.speed) / this.#orbit.speed * (2 * Math.PI));

    this.#coordinates.x = this.#orbit.radius * Math.cos(angle);
    this.#coordinates.y = this.#orbit.radius * Math.sin(angle);
    super.update(timestamp);

    for (const moon of this.#moons) {
      moon.update(timestamp);
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.#coordinates.x, this.#coordinates.y);
    super.draw(context);
    for (const moon of this.#moons) {
      moon.draw(context);
    }
    context.restore();
  }
}

export default AstronomicalObject;
