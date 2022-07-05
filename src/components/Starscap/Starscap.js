import React, { useRef, useEffect } from 'react';
import "./Starscap.css"
import { gsap } from 'gsap';
import useStar from './hooks/useStar';
import useKonami from './hooks/useKonami';
import usePartying from './hooks/usePartying';

// x:星星在 x 轴上的位置
// y:星星在 y 轴上的位置
// size:星星的大小，以像素为单位
// scale：星星的比例，当我们与组件交互时会发挥作用
// alpha:星星的 alpha 值，或opacity，它也会在交互过程中发挥作用
// scale: 星星的放大倍数
// ratio: 星星闪烁的范围

const Starscape = ({ densityRatio = 0.5, sizeLimit = 5, defaultAlpha = 0.5, scaleLimit = 2,
  proximityRatio = 0.1 }) => {
  
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const starsRef = useRef(null)
  
  const { isPartying } = usePartying()
  const { LOAD, RENDER, UPDATE, EXIT } = useStar({ canvasRef, contextRef, starsRef, densityRatio, proximityRatio, scaleLimit, defaultAlpha, sizeLimit, isPartying })
  const { handleCode } = useKonami({isPartying, starsRef, defaultAlpha })

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    LOAD();
    gsap.ticker.fps(24);
    gsap.ticker.add(RENDER);

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
    window.addEventListener("keyup", handleCode);
    return () => {
      window.removeEventListener("keyup", handleCode);
    };
  }, []);
  
  return  <canvas ref={canvasRef} />
}

export default Starscape
