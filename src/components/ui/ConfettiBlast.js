import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactCanvasConfetti from "react-canvas-confetti";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  transform: "translateY(50%)",
  top: 0,
  left: 0
};

export default function ConfettiBlast({ fire }) {
  const refAnimationInstance = useRef(null);

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio)
      });
  }, []);

  useEffect(() => {
    if (fire) {
      makeShot(0.25, {
        spread: 26,
        startVelocity: 55
      });

      makeShot(0.2, {
        spread: 60
      });

      makeShot(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });

      makeShot(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });

      makeShot(0.1, {
        spread: 120,
        startVelocity: 45
      });
    }
  }, [fire, makeShot]);

  return <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />;
}

ConfettiBlast.propTypes = { fire: PropTypes.bool.isRequired };
