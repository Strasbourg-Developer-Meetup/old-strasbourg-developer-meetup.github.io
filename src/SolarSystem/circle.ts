import Drawable from "./drawable.ts";

abstract class Circle implements Drawable {
  #radius: number;
  #color: string;

  constructor(
    radius: number,
    color: string,
  ) {
    this.#radius = radius;
    this.#color = color;
  }

  update(_timestamp: number): void {
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.#color;
    context.strokeStyle = this.#color;
    context.beginPath();
    context.arc(0, 0, this.#radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  }
}

export default Circle;
