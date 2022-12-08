import { useRef, useEffect, useState } from "react";
import { useWindowSize } from "react-use";

import { CanvasContext } from "./hooks/useCanvas";
import Wave from "./Wave";

const Canvas = () => {
  const canvasRef = useRef(null);
  const { width } = useWindowSize();
  const [context, setContext] = useState();

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext("2d");
    if (ctx) setContext(ctx);
  }, []);

  return (
    <CanvasContext.Provider value={{ context }}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={width}
        height={220}
        style={{ maxWidth: "100%" }}
      ></canvas>
      <Wave />
    </CanvasContext.Provider>
  );
};

export default Canvas;
