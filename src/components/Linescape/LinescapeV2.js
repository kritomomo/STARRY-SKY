/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { gsap } from "gsap"
import { KONAMI_CODE, AUDIO2 } from "../../const"

const LinescapeV2 = ({ cellSize = 20, proximityRatio = 0.25 }) => {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);
  const linesRef = React.useRef(null);
  const codeRef = React.useRef([]);
  const partyRef = React.useRef(null);
  const offsetRef = React.useRef(null);
  const saturationMapperRef = React.useRef(null);
  const alphaMapperRef = React.useRef(null);
  const thicknessMapperRef = React.useRef(null);
  const vminRef = React.useRef(null);

  const isPartying = () =>
    partyRef.current &&
    partyRef.current.progress() !== 0 &&
    partyRef.current.progress() !== 1;

  React.useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    // In load, we work out how many lines to show and where. We can offset based on the viewport dimensions
    const LOAD = () => {
      vminRef.current = Math.min(window.innerHeight, window.innerWidth);
      const CELLS_X = window.innerWidth / cellSize;
      const CELLS_Y = window.innerHeight / cellSize;
      const SAFE_CELLS_X = Math.ceil(CELLS_X);
      const SAFE_CELLS_Y = Math.ceil(CELLS_Y);
      // Calculate offset by doing some subtraction
      offsetRef.current = {
        x: (SAFE_CELLS_X - CELLS_X) * 0.5,
        y: (SAFE_CELLS_Y - CELLS_Y) * 0.5
      };
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      saturationMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        100,
        50
      );
      alphaMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        1,
        0.2
      );
      thicknessMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        4,
        0
      );

      linesRef.current = new Array(SAFE_CELLS_X * SAFE_CELLS_Y)
        .fill()
        .map((_, index) => {
          return {
            index,
            width: gsap.utils.random(0.1, 3, 0.1),
            thickness: 0,
            alpha: 0.2,
            saturation: 50,
            angle: 0,
            hue: gsap.utils.random(0, 359),
            x: index % SAFE_CELLS_X,
            y: Math.floor(index / SAFE_CELLS_X)
          };
        });
    };
    const RENDER = () => {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      linesRef.current.forEach((line) => {
        const X = line.x * cellSize - offsetRef.current.x * cellSize;
        const Y = line.y * cellSize - offsetRef.current.y * cellSize;
        // Line is going to be 80 percent of the height
        const MID = {
          x: X + cellSize * 0.5,
          y: Y
        };
        contextRef.current.lineWidth = line.width + line.thickness;
        contextRef.current.strokeStyle = `hsla(${line.hue}, ${line.saturation}%, 75%, ${line.alpha})`;
        contextRef.current.beginPath();
        contextRef.current.translate(MID.x, MID.y + cellSize * 0.5);
        contextRef.current.rotate(line.angle * (Math.PI / 180));
        contextRef.current.translate(-0, -cellSize * 0.5);
        contextRef.current.moveTo(0, cellSize * 0.1);
        contextRef.current.lineTo(0, cellSize * 0.9);
        contextRef.current.stroke();
        contextRef.current.closePath();
        // Reset the translations
        contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
      });
    };

    const UPDATE = ({ x, y }) => {
      if (!isPartying()) {
        linesRef.current.forEach((LINE) => {
          const CENTER_X = LINE.x * cellSize + cellSize * 0.5;
          const CENTER_Y = LINE.y * cellSize + cellSize * 0.5;
          const DISTANCE = Math.sqrt(
            Math.pow(CENTER_X - x, 2) + Math.pow(CENTER_Y - y, 2)
          );
          let angle =
            (Math.abs(Math.atan2(CENTER_Y - y, CENTER_X - x)) * 180) / Math.PI -
            270;
          angle = angle + 360 / 360;
          const saturation = saturationMapperRef.current(
            Math.min(DISTANCE, vminRef.current * proximityRatio)
          );
          const alpha = alphaMapperRef.current(
            Math.min(DISTANCE, vminRef.current * proximityRatio)
          );
          const thickness = thicknessMapperRef.current(
            Math.min(DISTANCE, vminRef.current * proximityRatio)
          );

          gsap.to(LINE, {
            angle,
            saturation,
            alpha,
            thickness
          });
        });
      }
    };

    const EXIT = () => {
      gsap.to(linesRef.current, {
        saturation: 50,
        alpha: 0.2,
        thickness: 0
      });
    };

    LOAD();
    gsap.ticker.fps(24);
    gsap.ticker.add(RENDER);

    // Set up event handling
    window.addEventListener("resize", LOAD);
    document.addEventListener("pointermove", UPDATE);
    document.addEventListener("pointerleave", EXIT);
    return () => {
      window.removeEventListener("resize", LOAD);
      document.removeEventListener("pointermove", UPDATE);
      document.removeEventListener("pointerleave", EXIT);
      gsap.ticker.remove(RENDER);
    };
  }, []);

  React.useEffect(() => {
    const handleCode = (e) => {
      codeRef.current = [...codeRef.current, e.code].slice(
        codeRef.current.length > 9 ? codeRef.current.length - 9 : 0
      );
      if (
        codeRef.current.join(",").toLowerCase() === KONAMI_CODE &&
        !isPartying()
      ) {
        codeRef.current.length = 0;
        partyRef.current = gsap.timeline().to(linesRef.current, {
          thickness: 0,
          alpha: 0.2,
          duration: 0.25,
          onComplete: () => AUDIO2.play()
        });
        for (let l = 0; l < linesRef.current.length; l++) {
          partyRef.current.to(
            linesRef.current[l],
            {
              angle: "+=360",
              duration: 0.5,
              onStart: () =>
                gsap.set(linesRef.current[l], { alpha: 1, thickness: 2 }),
              onComplete: () =>
                gsap.set(linesRef.current[l], { alpha: 0.2, thickness: 0 })
            },
            l * 0.0005 + 0.25
          );
        }
      }
    };
    window.addEventListener("keyup", handleCode);
    return () => {
      window.removeEventListener("keyup", handleCode);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default LinescapeV2
