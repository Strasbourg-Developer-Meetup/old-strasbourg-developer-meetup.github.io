// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class CanvasManager {
    #drawableManager;
    #context;
    #running;
    #origin;
    #dimensions;
    constructor(context, drawableManager, dimensions){
        this.#context = context;
        this.#drawableManager = drawableManager;
        this.#running = false;
        this.#origin = {
            x: dimensions.width / 2,
            y: dimensions.height / 2
        };
        this.#dimensions = dimensions;
    }
    set dimensions(dimensions) {
        this.#dimensions = dimensions;
        this.#origin = {
            x: dimensions.width / 2,
            y: dimensions.height / 2
        };
    }
    #tick(timestamp) {
        this.#context.clearRect(0, 0, this.#dimensions.width, this.#dimensions.height);
        this.#context.translate(this.#origin.x, this.#origin.y);
        const { drawables  } = this.#drawableManager;
        for (const drawable of drawables){
            drawable.update(timestamp);
        }
        for (const drawable1 of drawables){
            drawable1.draw(this.#context);
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
class Circle {
    #radius;
    #color;
    constructor(radius, color){
        this.#radius = radius;
        this.#color = color;
    }
    update(_timestamp) {}
    draw(context) {
        context.fillStyle = this.#color;
        context.strokeStyle = this.#color;
        context.beginPath();
        context.arc(0, 0, this.#radius, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
    }
}
class AstronomicalObject extends Circle {
    #orbit;
    #coordinates;
    #moons;
    #direction;
    constructor(params){
        super(params.radius, "#d4b404");
        this.#orbit = structuredClone(params.orbit);
        this.#coordinates = {
            x: 0,
            y: 0
        };
        this.#moons = [];
        this.#direction = params.direction;
    }
    addMoon(moon) {
        this.#moons.push(moon);
    }
    get coordinates() {
        return this.#coordinates;
    }
    update(timestamp) {
        const angle = this.#direction * (timestamp % this.#orbit.speed / this.#orbit.speed * (2 * Math.PI));
        this.#coordinates.x = this.#orbit.radius * Math.cos(angle);
        this.#coordinates.y = this.#orbit.radius * Math.sin(angle);
        super.update(timestamp);
        for (const moon of this.#moons){
            moon.update(timestamp);
        }
    }
    draw(context) {
        context.save();
        context.translate(this.#coordinates.x, this.#coordinates.y);
        super.draw(context);
        for (const moon of this.#moons){
            moon.draw(context);
        }
        context.restore();
    }
}
const __default = JSON.parse(`[
  {
    "distance": 0.10,
    "radius": 0.04,
    "direction": 1,
    "speed": 310942,
    "moons": [
      {
        "distance": 0.10,
        "radius": 0.005,
        "direction": -1,
        "speed": 2389,
        "moons": []
      }
    ]
  },
  {
    "distance": 0.40,
    "radius": 0.10,
    "direction": -1,
    "speed": 124091,
    "moons": [
      {
        "distance": 0.15,
        "radius": 0.02,
        "direction": -1,
        "speed": 10000,
        "moons": []
      }
    ]
  },
  {
    "distance": 0.700,
    "radius": 0.09,
    "direction": 1,
    "speed": 12911256,
    "moons": [
      {
        "distance": 0.20,
        "radius": 0.04,
        "direction": -1,
        "speed": 389210,
        "moons": [
          {
            "distance": 0.05,
            "radius": 0.002,
            "direction": 1,
            "speed": 1234,
            "moons": []
          }
        ]
      }
    ]
  },
  {
    "distance": 1,
    "radius": 0.05,
    "direction": 1,
    "speed": 100000,
    "moons": [
      {
        "distance": 0.10,
        "radius": 0.005,
        "direction": -1,
        "speed": 1213,
        "moons": [
          {
            "distance": 0.20,
            "radius": 0.005,
            "direction": 1,
            "speed": 1240,
            "moons": []
          }
        ]
      },
      {
        "distance": 0.20,
        "radius": 0.01,
        "direction": 1,
        "speed": 4120,
        "moons": []
      }
    ]
  },
  {
    "distance": 1.5,
    "radius": 0.25,
    "direction": 1,
    "speed": 91029241,
    "moons": [
      {
        "distance": 0.40,
        "radius": 0.015,
        "direction": -1,
        "speed": 121301,
        "moons": [
          {
            "distance": 0.05,
            "radius": 0.010,
            "direction": 1,
            "speed": 3240,
            "moons": [
              {
                "distance": 0.025,
                "radius": 0.006,
                "direction": -1,
                "speed": 1240,
                "moons": []
              }
            ]
          }
        ]
      },
      {
        "distance": 0.60,
        "radius": 0.01,
        "direction": 1,
        "speed": 90120,
        "moons": [
          {
            "distance": 0.04,
            "radius": 0.006,
            "direction": -1,
            "speed": 400,
            "moons": []
          }
        ]
      }
    ]
  }
]
`);
class SolarSystemManager {
    #astronomicalObjects;
    #size;
    constructor(size){
        this.#astronomicalObjects = [];
        this.#size = size;
        this.load();
    }
    set size(s) {
        this.#size = s;
        this.load();
    }
    load() {
        this.#astronomicalObjects = __default.map(this.#buildAstronmicalObject.bind(this));
    }
    get drawables() {
        return this.#astronomicalObjects;
    }
    #buildAstronmicalObject(rawAstronmicalObject) {
        const astronmicalObject = new AstronomicalObject({
            radius: Math.max(rawAstronmicalObject.radius * this.#size / 2, 1),
            direction: rawAstronmicalObject.direction,
            orbit: {
                speed: rawAstronmicalObject.speed,
                radius: rawAstronmicalObject.distance * this.#size / 2
            }
        });
        if (rawAstronmicalObject.moons) {
            for (const moon of rawAstronmicalObject.moons){
                astronmicalObject.addMoon(this.#buildAstronmicalObject(moon));
            }
        }
        return astronmicalObject;
    }
}
const getSize = ()=>{
    return Math.min(self.innerWidth, self.innerHeight);
};
const init = (canvasId)=>{
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error("[SolarSystem] Could not find canvas, aborting.");
        return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
        console.error("[SolarSystem] Could not find context, aborting.");
        return;
    }
    const solarSystemManager = new SolarSystemManager(getSize());
    const canvasManager = new CanvasManager(context, solarSystemManager, {
        width: self.innerWidth,
        height: self.innerHeight
    });
    const resize = (onlyCanvas = true)=>{
        const { innerWidth , innerHeight  } = self;
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        if (onlyCanvas) {
            return;
        }
        canvasManager.dimensions = {
            width: self.innerWidth,
            height: self.innerHeight
        };
        solarSystemManager.size = getSize();
    };
    resize();
    self.addEventListener("resize", ()=>resize(false));
    canvasManager.start();
};
const textArc = (id)=>{
    const ele = document.getElementById(id);
    if (!ele) {
        console.warn(`Could not find element with id ${id}`);
        return;
    }
    const elements = ele?.textContent?.trim()?.split("").map((c)=>`<span>${c}</span>`) ?? [];
    ele.innerHTML = elements.join("");
    const offset = -135;
    const halfCircleDegrees = 360 / elements.length / 2;
    ele.querySelectorAll("span").forEach((span, i)=>span.style.transform = `rotate(${offset + i * halfCircleDegrees}deg)`);
};
init("canvas");
textArc("slogan");
