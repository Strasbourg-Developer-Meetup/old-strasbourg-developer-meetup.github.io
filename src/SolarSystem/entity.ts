import Coordinates from "./coordinates.ts";

interface Entity {
  get coordinates(): Coordinates;
  update(timestamp: number): void;
}

export default Entity;
