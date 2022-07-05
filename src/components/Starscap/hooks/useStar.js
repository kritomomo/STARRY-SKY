import { useRef } from 'react';
import { gsap } from 'gsap';

const useStar = (props) => {
  const { canvasRef, contextRef, starsRef, densityRatio, proximityRatio, scaleLimit, defaultAlpha, sizeLimit, isPartying } = props
  
  const vminRef = useRef(null)
  const scaleMapperRef = useRef(null)
  const alphaMapperRef = useRef(null)

  const LOAD = () => {
    vminRef.current = Math.min(window.innerHeight, window.innerWidth);
    const STAR_COUNT = Math.floor(vminRef.current * densityRatio);
    scaleMapperRef.current = gsap.utils.mapRange(
      0,
      vminRef.current * proximityRatio,
      scaleLimit,
      1
    );
    alphaMapperRef.current = gsap.utils.mapRange(
      0,
      vminRef.current * proximityRatio,
      1,
      defaultAlpha
    );
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    starsRef.current = new Array(STAR_COUNT).fill().map(() => ({
      hue: 0,
      saturation: 0,
      lightness: 100,
      x: gsap.utils.random(0, window.innerWidth, 1),
      y: gsap.utils.random(0, window.innerHeight, 1),
      size: gsap.utils.random(1, sizeLimit, 1),
      scale: 1,
      alpha: defaultAlpha
    }));
  }

  const RENDER = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    starsRef.current.forEach((star) => {
      contextRef.current.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${star.lightness}%, ${star.alpha})`;
      contextRef.current.beginPath();
      contextRef.current.arc(
        star.x,
        star.y,
        (star.size / 2) * star.scale,
        0,
        Math.PI * 2
      );
      contextRef.current.fill();
    });
  };

  const UPDATE = ({ x, y }) => {
    if (!isPartying()) {
      starsRef.current.forEach((STAR) => {
        const DISTANCE = Math.sqrt(
          Math.pow(STAR.x - x, 2) + Math.pow(STAR.y - y, 2)
        );
        gsap.to(STAR, {
          scale: scaleMapperRef.current(
            Math.min(DISTANCE, vminRef.current * proximityRatio)
          ),
          alpha: alphaMapperRef.current(
            Math.min(DISTANCE, vminRef.current * proximityRatio)
          )
        });
      });
    }
  };

  const EXIT = () => {
    gsap.to(starsRef.current, {
      scale: 1,
      alpha: defaultAlpha
    });
  };

  return {
    LOAD,
    RENDER,
    UPDATE,
    EXIT
  }
}

export default useStar;
