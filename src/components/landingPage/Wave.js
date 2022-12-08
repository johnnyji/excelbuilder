import hexRgb from "hex-rgb";
import { useWindowSize } from "react-use";
import { useCanvasContext } from "./hooks/useCanvas";
import useTheme from "@mui/material/styles/useTheme";
import WaveObj from "./utils/wave";

const Wave = () => {
  const { context } = useCanvasContext();
  const { width } = useWindowSize();
  const theme = useTheme();
  const height = 600;
  let frequency = 0.013;
  const color1 = hexRgb(theme.palette.primary.main, { alpha: 0.2 });
  const color2 = hexRgb(theme.palette.primary.light, { alpha: 0.1 });
  const waves = {
    frontWave: new WaveObj(
      [0.0211, 0.028, 0.015],
      `rgba(${color1.red}, ${color1.green}, ${color1.blue}, ${color1.alpha})`
    ),
    backWave: new WaveObj(
      [0.0122, 0.018, 0.005],
      `rgba(${color2.red}, ${color2.green}, ${color2.blue}, ${color2.alpha})`
    )
  };

  const render = () => {
    context?.clearRect(0, 0, width, height);
    Object.entries(waves).forEach(([, wave]) => {
      wave.draw(context, width, height, frequency);
    });
    frequency += 0.013;
    requestAnimationFrame(render);
  };
  if (context) render();
  return null;
};

export default Wave;
