import React from 'react';
import Starscape from './components/Starscap';

const App = () => {
  const DEFAULT_DENSITY = 0.75;
  const DEFAULT_SIZE = 10;
  const DEFAULT_SCALE = 15;
  const DEFAULT_PROXIMITY = 0.2;

  return (
    <Starscape
      densityRatio={DEFAULT_DENSITY}
      sizeLimit={DEFAULT_SIZE}
      scaleLimit={DEFAULT_SCALE}
      proximityRatio={DEFAULT_PROXIMITY}
    />
  );
}

export default App;
