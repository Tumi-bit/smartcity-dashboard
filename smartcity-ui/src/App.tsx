import React, { useState } from "react";
import "./App.scss";
import MapLayer from "./components/MapLayer.tsx";
import LayerControl from "./components/LayerControl.tsx";

const App: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>("stations");
  return (
    <div className="app">
      <MapLayer activeLayer={activeLayer} />
      <LayerControl activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
    </div>
  );
};

export default App;
