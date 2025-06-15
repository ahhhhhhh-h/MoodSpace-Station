import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CelestialBody, Flower } from '../types';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const MoonContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
`;

const MoonSphere = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(145deg, #e1e1e1, #b4b4b4);
  box-shadow: inset -25px -25px 40px rgba(0,0,0,0.3);
  animation: ${rotate} 60s linear infinite;
  position: relative;
`;

const CelestialBodyContainer = styled.div<{ x: number; y: number; type: string }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

interface MoonProps {
  celestialBodies: CelestialBody[];
  flowers?: Flower[];
}

export const Moon: React.FC<MoonProps> = ({ celestialBodies, flowers = [] }) => {
  const renderCelestialBody = (body: CelestialBody) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 200; // 轨道半径
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return (
      <CelestialBodyContainer
        key={body.id}
        x={x}
        y={y}
        type={body.type}
        title={body.content}
      >
        {body.type === 'positive' ? '⭐' : body.type === 'negative' ? '☄️' : '🌟'}
      </CelestialBodyContainer>
    );
  };

  return (
    <MoonContainer>
      <MoonSphere>
        {flowers.map(flower => (
          <div
            key={flower.id}
            style={{
              position: 'absolute',
              left: flower.position.x,
              top: flower.position.y,
            }}
          >
            🌸
          </div>
        ))}
      </MoonSphere>
      {celestialBodies.map(renderCelestialBody)}
    </MoonContainer>
  );
}; 