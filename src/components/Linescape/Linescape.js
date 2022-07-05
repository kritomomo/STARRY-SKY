/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import useLine from "./hooks/useLine"
import usePartying from "../../hooks/usePartying"
import { KONAMI_CODE } from "../../const"

const Linescape = ({
  cellSize = 20,
  proximityRatio = 0.25,
}) => {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const codeRef = useRef([]);

  const { isPartying } = usePartying()
  const { LOAD, RENDER, UPDATE, EXIT} = useLine({ contextRef,cellSize, canvasRef, proximityRatio, isPartying })

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    // In load, we work out how many lines to show and where. We can offset based on the viewport dimensions
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

  useEffect(() => {
    const handleCode = (e) => {
      codeRef.current = [...codeRef.current, e.code].slice(
        codeRef.current.length > 9 ? codeRef.current.length - 9 : 0
      );
      if (
        codeRef.current.join(",").toLowerCase() === KONAMI_CODE &&
        !isPartying()
      ) {
        codeRef.current.length = 0;
      }
    };
    window.addEventListener("keyup", handleCode);
    return () => {
      window.removeEventListener("keyup", handleCode);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};


export default Linescape
