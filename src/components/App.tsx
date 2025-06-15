import React, { useState } from 'react';
import { Moon } from './Moon';
import { PlantFlower } from './PlantFlower';
import { CelestialBody, Flower } from '../types';

export const App: React.FC = () => {
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  
  const handlePlantFlower = (flower: Flower) => {
    setFlowers(prev => [...prev, flower]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#001', position: 'relative', overflow: 'hidden' }}>
      <Moon 
        celestialBodies={celestialBodies}
        setCelestialBodies={setCelestialBodies}
        flowers={flowers}
      />
      <PlantFlower onPlantFlower={handlePlantFlower} />
    </div>
  );
}; 