import { useRef } from 'react';
import { gsap } from 'gsap';

const useLine = (props) => {
  const { contextRef, cellSize, canvasRef, proximityRatio,isPartying } = props

  const linesRef = useRef(null);
  const offsetRef = useRef(null)
  const saturationMapperRef = useRef(null);
  const alphaMapperRef = useRef(null);
  const vminRef = useRef(null)

  const LOAD = () => {
    vminRef.current = Math.min(window.innerHeight, window.innerWidth);
    const CELLS_X = window.innerWidth / cellSize
    const CELLS_Y = window.innerHeight / cellSize
    const SAFE_CELLS_X = Math.ceil(CELLS_X)
    const SAFE_CELLS_Y = Math.ceil(CELLS_Y)
    // Calculate offset by doing some subtraction
    offsetRef.current = {
      x: (SAFE_CELLS_X - CELLS_X) * 0.5,
      y: (SAFE_CELLS_Y - CELLS_Y) * 0.5,
    }
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
    
    linesRef.current = new Array(SAFE_CELLS_X * SAFE_CELLS_Y).fill().map((_, index) => {
      return {
        index,
        alpha: 0.2,
        width: gsap.utils.random(0.1, 3, 0.1),
        saturation: 50,
        angle: gsap.utils.random(0, 360),
        hue: gsap.utils.random(0, 359),
        x: index % SAFE_CELLS_X,
        y: Math.floor(index / SAFE_CELLS_X)
      }
    })
  };

  const RENDER = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    linesRef.current.forEach((line) => {
      const X = (line.x * cellSize) - (offsetRef.current.x * cellSize)
      const Y = (line.y * cellSize) - (offsetRef.current.y * cellSize)
      // Line is going to be 80 percent of the height
      const MID = {
        x: X + (cellSize * 0.5),
        y: Y,
      }
      contextRef.current.lineWidth = line.width
      contextRef.current.strokeStyle = `hsla(${line.hue}, ${line.saturation}%, 75%, ${line.alpha})`
      contextRef.current.beginPath()
      contextRef.current.translate(MID.x, MID.y + cellSize * 0.5)
      contextRef.current.rotate(line.angle * (Math.PI / 180))
      contextRef.current.translate(-0, -cellSize * 0.5)
      contextRef.current.moveTo(0, cellSize * 0.1)
      contextRef.current.lineTo(0, cellSize * 0.9)
      contextRef.current.stroke()
      contextRef.current.closePath()
      // Reset the translations          
      contextRef.current.setTransform(1, 0, 0, 1, 0, 0)
    });
  };

  const UPDATE = ({ x, y }) => {
    if (!isPartying()) {
      linesRef.current.forEach((LINE) => {
        const DISTANCE = Math.sqrt(
          Math.pow(((LINE.x * cellSize) + (cellSize * 0.5)) - x, 2) + Math.pow(((LINE.y * cellSize) + (cellSize * 0.5)) - y, 2)
        );
        const saturation = saturationMapperRef.current(Math.min(DISTANCE, vminRef.current * proximityRatio))
        const alpha = alphaMapperRef.current(Math.min(DISTANCE, vminRef.current * proximityRatio))
        
        gsap.to(LINE, {
          saturation,
          alpha,
        });
      });
    }
  };

  const EXIT = () => {
    gsap.to(linesRef.current, {
      saturation: 50,
      alpha: 0.2
    });
  };

  return {
    LOAD,
    RENDER,
    UPDATE,
    EXIT
  }
}

export default useLine;
