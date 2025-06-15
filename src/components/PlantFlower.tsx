import React, { useState } from 'react';
import styled from 'styled-components';
import { Flower } from '../types';
import { flower1Icon, flower2Icon, flower3Icon } from '../assets';

const PlantFlowerContainer = styled.div`
  position: absolute;
  top: 70px;
  right: 10px;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlantButton = styled.button`
  background: rgba(20, 20, 40, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 8px 15px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(40, 40, 80, 0.8);
    transform: translateY(-2px);
  }
`;

interface FlowerSelectionPanelProps {
  visible: boolean;
}

const FlowerSelectionPanel = styled.div<FlowerSelectionPanelProps>`
  display: ${props => props.visible ? 'flex' : 'none'};
  margin-top: 10px;
  background: rgba(20, 20, 40, 0.8);
  border-radius: 10px;
  padding: 10px;
  justify-content: space-around;
  width: 100%;
`;

const FlowerOption = styled.div`
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.2);
  }
`;

interface DraggableFlowerProps {
  x: number;
  y: number;
  flowerStyle: string;
  isDragging: boolean;
}

const DraggableFlower = styled.div<DraggableFlowerProps>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${props => {
    switch (props.flowerStyle) {
      case 'flower1': return `url(${flower1Icon})`;
      case 'flower2': return `url(${flower2Icon})`;
      case 'flower3': return `url(${flower3Icon})`;
      default: return `url(${flower1Icon})`;
    }
  }};
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  z-index: ${props => props.isDragging ? 1000 : 5};
  opacity: ${props => props.isDragging ? 0.8 : 1};
`;

interface PlantFlowerProps {
  onPlantFlower: (flower: Flower) => void;
}

export const PlantFlower: React.FC<PlantFlowerProps> = ({ onPlantFlower }) => {
  const [showSelection, setShowSelection] = useState(false);
  const [draggingFlower, setDraggingFlower] = useState<{
    id: string;
    style: 'flower1' | 'flower2' | 'flower3';
    position: { x: number; y: number };
    isDragging: boolean;
  } | null>(null);

  const handlePlantClick = () => {
    setShowSelection(!showSelection);
  };

  const handleFlowerSelect = (style: 'flower1' | 'flower2' | 'flower3') => {
    // 创建一个可拖拽的花
    const newFlower = {
      id: `flower-${Date.now()}`,
      style,
      position: { x: 150, y: 150 },
      isDragging: false
    };
    
    setDraggingFlower(newFlower);
    setShowSelection(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggingFlower) return;
    
    setDraggingFlower({
      ...draggingFlower,
      isDragging: true
    });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (draggingFlower) {
        setDraggingFlower({
          ...draggingFlower,
          position: {
            x: moveEvent.clientX - 16, // 半宽度
            y: moveEvent.clientY - 16  // 半高度
          },
          isDragging: true
        });
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (draggingFlower) {
        // 创建最终的花朵并通知父组件
        const finalFlower: Flower = {
          id: draggingFlower.id,
          style: draggingFlower.style,
          position: {
            x: upEvent.clientX - 16,
            y: upEvent.clientY - 16
          }
        };
        
        onPlantFlower(finalFlower);
        setDraggingFlower(null);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <PlantFlowerContainer>
      <PlantButton onClick={handlePlantClick}>种花</PlantButton>
      
      <FlowerSelectionPanel visible={showSelection}>
        <FlowerOption 
          style={{ backgroundImage: `url(${flower1Icon})` }}
          onClick={() => handleFlowerSelect('flower1')}
        />
        <FlowerOption 
          style={{ backgroundImage: `url(${flower2Icon})` }}
          onClick={() => handleFlowerSelect('flower2')}
        />
        <FlowerOption 
          style={{ backgroundImage: `url(${flower3Icon})` }}
          onClick={() => handleFlowerSelect('flower3')}
        />
      </FlowerSelectionPanel>

      {draggingFlower && (
        <DraggableFlower
          x={draggingFlower.position.x}
          y={draggingFlower.position.y}
          flowerStyle={draggingFlower.style}
          isDragging={draggingFlower.isDragging}
          onMouseDown={handleMouseDown}
        />
      )}
    </PlantFlowerContainer>
  );
}; 