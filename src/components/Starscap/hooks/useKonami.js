import { useRef } from 'react';
import { gsap } from 'gsap';
import { KONAMI_CODE, AUDIO } from '../../../const';

const useKonami = (props) => {
  const {isPartying, starsRef, defaultAlpha, partyRef } = props
  
  const codeRef = useRef([]);

  const handleCode = (e) => {
    codeRef.current = [...codeRef.current, e.code].slice(
      codeRef.current.length > 9 ? codeRef.current.length - 9 : 0
    );
    if (
      codeRef.current.join(",").toLowerCase() === KONAMI_CODE &&
      !isPartying()
    ) {
      codeRef.current.length = 0;
      partyRef.current = gsap.timeline().to(starsRef.current, {
        scale: 1,
        alpha: defaultAlpha,
        onComplete: () => AUDIO.play(),
      });
      const STAGGER = 0.01;

      for (let s = 0; s < starsRef.current.length; s++) {
        partyRef.current
          .to(
          starsRef.current[s],
          {
            onStart: () => {
              gsap.set(starsRef.current[s], {
                hue: gsap.utils.random(0, 360),
                saturation: 80,
                lightness: 60,
                alpha: 1,
              })
            },
            onComplete: () => {
              gsap.set(starsRef.current[s], {
                saturation: 0,
                lightness: 100,
                alpha: defaultAlpha,
              })
            },
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            duration: 0.3
          },
          s * STAGGER
        );
      }
    }
  };

  return { handleCode}
}

export default useKonami
