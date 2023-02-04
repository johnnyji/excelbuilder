import { createContext, useContext } from "react";

export const CanvasContext = createContext({
  context: undefined
});

export const useCanvasContext = () => {
  return useContext(CanvasContext);
};
