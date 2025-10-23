import React from "react";
import "./layerControl.scss";

interface LayerControlProps {
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  activeLayer,
  setActiveLayer,
}) => {
  return (
    <div className="layer_control">
      <div>
        <input
          type="radio"
          id="stations"
          name="layer"
          value="stations"
          checked={activeLayer === "stations"}
          onChange={(e) => setActiveLayer(e.target.value)}
        />
        <label htmlFor="stations">Bike Stations</label>
      </div>
      <div>
        <input
          type="radio"
          id="none"
          name="layer"
          value="none"
          checked={activeLayer === "none"}
          onChange={(e) => setActiveLayer(e.target.value)}
        />
        <label htmlFor="none">None</label>
      </div>
    </div>
  );
};

export default LayerControl;
