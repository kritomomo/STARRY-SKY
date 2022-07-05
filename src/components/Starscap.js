import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

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
  const vminRef = useRef(null)
  const scaleMapperRef = useRef(null)
  const alphaMapperRef = useRef(null)

  const LOAD = () => {
    vminRef.current = Math.min(window.innerHeight, window.innerWidth)
    const STAR_COUNT = Math.floor(vminRef.current * densityRatio)
    scaleMapperRef.current = gsap.utils.mapRange(0, vminRef.current * proximityRatio, scaleLimit, 1);
    alphaMapperRef.current = gsap.utils.mapRange(0, vminRef.current * proximityRatio, 1, defaultAlpha);
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
    starsRef.current = new Array(STAR_COUNT).fill().map(() => ({
      x: gsap.utils.random(0, window.innerWidth, 1),
      y: gsap.utils.random(0, window.innerHeight, 1),
      size: gsap.utils.random(1, sizeLimit, 1),
      scale: 1,
      alpha: gsap.utils.random(0.1, defaultAlpha, 0.1),
    }))
  }
  const RENDER = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    starsRef.current.forEach(star => {
      contextRef.current.fillStyle = `hsla(0, 100%, 100%, ${star.alpha})`
      contextRef.current.beginPath()
      contextRef.current.arc(star.x, star.y, (star.size / 2) * star.scale, 0, Math.PI * 2)
      contextRef.current.fill()
    })
  }
  
  const UPDATE = ({ x, y }) => {
    starsRef.current.forEach(STAR => {
      const DISTANCE = Math.sqrt(Math.pow(STAR.x - x, 2) + Math.pow(STAR.y - y, 2));
      gsap.to(STAR, {
        scale: scaleMapperRef.current(
          Math.min(DISTANCE, vminRef.current * proximityRatio)
        ),
        alpha: alphaMapperRef.current(
          Math.min(DISTANCE, vminRef.current * proximityRatio)
        )
      });
    })
  };

  const EXIT = () => {
    gsap.to(starsRef.current, {
      scale: 1,
      alpha: defaultAlpha,
    })
  }

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext('2d')
    LOAD()
    gsap.ticker.fps(60)
    gsap.ticker.add(RENDER)
    
    // Set up event handling
    window.addEventListener('resize', LOAD)
    document.addEventListener('pointermove', UPDATE)
    document.addEventListener('pointerleave', EXIT)
    return () => {
      window.removeEventListener('resize', LOAD)
      document.removeEventListener('pointermove', UPDATE)
      document.removeEventListener('pointerleave', EXIT)
      gsap.ticker.remove(RENDER)
    }

  }, [])
  
  return  <canvas ref={canvasRef} />
}

export default Starscape
