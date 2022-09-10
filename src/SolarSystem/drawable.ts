interface Drawable {
  update(timestamp: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export default Drawable;
