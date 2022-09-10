import Drawable from "./drawable.ts";

interface DrawableManager {
  get drawables(): Drawable[];
}

export default DrawableManager;
