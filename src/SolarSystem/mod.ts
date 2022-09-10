import CanvasManager from "../SolarSystem/canvasManager.ts";
import SolarSystemManager from "../SolarSystem/solarSystemManager.ts";

const getSize = () => {
  return Math.min(self.innerWidth, self.innerHeight);
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
  const solarSystemManager = new SolarSystemManager(getSize());
  const canvasManager = new CanvasManager(
    context,
    solarSystemManager,
    { width: self.innerWidth, height: self.innerHeight },
  );
  const resize = (onlyCanvas = true) => {
    const { innerWidth, innerHeight } = self;
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    if (onlyCanvas) {
      return;
    }

    canvasManager.dimensions = {
      width: self.innerWidth,
      height: self.innerHeight,
    };
    solarSystemManager.size = getSize();
  };

  resize();
  self.addEventListener("resize", () => resize(false));

  canvasManager.start();
};

export default init;
