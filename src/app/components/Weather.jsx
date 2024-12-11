import React from "react";
import Rain from "./Weather/Rain";
import Snow from "./Weather/Snow";
import Fog from "./Weather/Fog";

const Weather = ({ weatherType, intensity, windSpeed, radius }) => {

  const desiredCoverageRadius = 2.5; 
  
  return (
    <group>
      {weatherType === "rainy" && (
        <Rain 
          radius={radius} 
          intensity={intensity} 
          windSpeed={windSpeed} 
          coverageRadius={desiredCoverageRadius}
        />
      )}
      {weatherType === "snowy" && (
        <Snow radius={radius} intensity={intensity} windSpeed={windSpeed} />
      )}
      {weatherType === "foggy" && <Fog radius={radius} intensity={intensity} />}
      {/* if we want more weathers we can add.  */}
    </group>
  );
};

export default Weather;