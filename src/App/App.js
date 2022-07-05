import React from 'react';
import "./App.css"
import Starscape from '../components/Starscap/Starscap';
import Linescape from "../components/Linescape/Linescape"
import LinescapeV2 from "../components/Linescape/LinescapeV2"

const App = () => {
  const DEFAULT_DENSITY = 0.75;
  const DEFAULT_SIZE = 10;
  const DEFAULT_SCALE = 15;
  const DEFAULT_PROXIMITY = 0.2;

  const DEFAULT_CELL = 20;

  return (
    <>
      {/* <Starscape
        densityRatio={DEFAULT_DENSITY}
        sizeLimit={DEFAULT_SIZE}
        scaleLimit={DEFAULT_SCALE}
        proximityRatio={DEFAULT_PROXIMITY}
      /> */}
      {/* <Linescape
      cellSize={DEFAULT_CELL}
      /> */}
      <LinescapeV2 cellSize={DEFAULT_CELL} />
    </>
  );
}

export default App;
