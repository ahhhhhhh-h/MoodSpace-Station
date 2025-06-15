import React, { useState } from 'react';
import styled from 'styled-components';
import { Flower } from '../types';
import { flower1Icon, flower2Icon, flower3Icon } from '../assets';

const FlowerSelectPanel = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(20,20,40,0.8);
  border-radius: 15px;
  padding: 20px;
  display: flex; flex-direction: column; gap: 15px;
  z-index: 1000;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.3);
`;

const Title = styled.h3`
  color: white; text-align: center; margin: 0 0 10px; font-size: 18px;
`;

const FlowerOptions = styled.div`
  display: flex; justify-content: space-around; gap: 15px;
`;

const FlowerOption = styled.div<{
  selected: boolean;
  flowerType: 'flower1' | 'flower2' | 'flower3';
}>`
  width: 60px; height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${p =>
    p.flowerType === 'flower1'
      ? `url(${flower1Icon})`
      : p.flowerType === 'flower2'
      ? `url(${flower2Icon})`
      : `url(${flower3Icon})`
  };
  cursor: pointer;
  border-radius: 10px;
  padding: 10px;
  border: ${p => (p.selected ? '2px solid #fff' : '2px solid transparent')};
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(255,255,255,0.1);
  }
`;

const Description = styled.div`
  text-align: center;
  color: white;
  font-size: 14px;
`;

interface FlowerSelectorProps {
  onPlantFlower: (flower: Flower) => void;
  onClose: () => void;
}

export const FlowerSelector: React.FC<FlowerSelectorProps> = ({
  onPlantFlower,
  onClose
}) => {
  const [selectedFlower, setSelectedFlower] =
    useState<'flower1' | 'flower2' | 'flower3'>('flower1');

  const handleSelectAndPlant = (
    style: 'flower1' | 'flower2' | 'flower3'
  ) => {
    setSelectedFlower(style);

    const moonSize = 360; // 月球容器的大小
    const flowerSize = 32;
    const centerOffset = moonSize / 2; // 月球中心点
    const moonRadius = moonSize / 2; // 月球半径

    // 在月球表面生成位置
    const angle = Math.random() * Math.PI * 2;
    const minDist = 20;  // 距离月球中心至少20px
    const maxDist = moonRadius * 0.68; // 只使用月球半径的70%，确保不会太靠近边缘
    const distance = minDist + Math.random() * (maxDist - minDist);

    // 计算相对于月球容器左上角的坐标，并确保花朵完全在月球内
    const x = Math.round(centerOffset + Math.cos(angle) * distance - flowerSize/2);
    const y = Math.round(centerOffset + Math.sin(angle) * distance - flowerSize/2);

    const newFlower: Flower = {
      id: `flower-${Date.now()}`,
      style,
      position: { x, y }
    };

    onPlantFlower(newFlower);
    onClose();
  };

  return (
    <FlowerSelectPanel>
      <Title>选择要种植的花朵</Title>
      <FlowerOptions>
        {(['flower1', 'flower2', 'flower3'] as const).map(f => (
          <FlowerOption
            key={f}
            flowerType={f}
            selected={selectedFlower === f}
            onClick={() => handleSelectAndPlant(f)}
          />
        ))}
      </FlowerOptions>
      <Description>点击花朵即可种植到月球上</Description>
    </FlowerSelectPanel>
  );
};
