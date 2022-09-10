import AstronomicalObject from "./astronomicalObject.ts";
import solarSystem from "./solarSystem.json" assert { type: "json" };
import DrawableManager from "./drawableManager.ts";

interface RawAstronomicalObject {
  distance: number; // 0.0 to 1.0
  speed: number; // milliseconds
  direction: -1 | 1; // orbit direciton
  radius: number; // 0.1 to 1.0
  moons: RawAstronomicalObject[];
}

class SolarSystemManager implements DrawableManager {
  #astronomicalObjects: AstronomicalObject[];
  #size: number;
  constructor(size: number) {
    this.#astronomicalObjects = [];
    this.#size = size;
    this.load();
  }

  set size(s: number) {
    this.#size = s;
    this.load();
  }

  load() {
    this.#astronomicalObjects = (solarSystem as RawAstronomicalObject[]).map(
      this.#buildAstronmicalObject.bind(this),
    );
  }

  get drawables() {
    return this.#astronomicalObjects;
  }

  #buildAstronmicalObject(
    rawAstronmicalObject: RawAstronomicalObject,
  ): AstronomicalObject {
    const astronmicalObject = new AstronomicalObject({
      radius: Math.max(rawAstronmicalObject.radius * this.#size / 2, 1),
      direction: rawAstronmicalObject.direction,
      orbit: {
        speed: rawAstronmicalObject.speed,
        radius: rawAstronmicalObject.distance * this.#size / 2,
      },
    });

    if (rawAstronmicalObject.moons) {
      for (const moon of rawAstronmicalObject.moons) {
        astronmicalObject.addMoon(this.#buildAstronmicalObject(moon));
      }
    }

    return astronmicalObject;
  }
}

export default SolarSystemManager;
