import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  padding: 8px 12px;
  border-radius: 10px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StarCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #FFD700;
  font-size: 20px;
`;

const RadioButton = styled(Button)<{ isOn: boolean }>`
  color: ${props => props.isOn ? '#4CAF50' : '#666'};
`;

interface ControlPanelProps {
  starCount: number;
  isRadioOn: boolean;
  onRadioToggle: () => void;
  onPlantFlower: () => void;
  onExport: () => void;
  onClear: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  starCount,
  isRadioOn,
  onRadioToggle,
  onPlantFlower,
  onExport,
  onClear,
}) => {
  return (
    <Panel>
      <StarCount>
        <span>✨</span>
        <span>{starCount}</span>
      </StarCount>
      <Button onClick={onPlantFlower} title="种花">
        🌸
      </Button>
      <RadioButton onClick={onRadioToggle} isOn={isRadioOn} title="电台">
        📻
      </RadioButton>
      <Button onClick={onExport} title="导出">
        💾
      </Button>
      <Button onClick={onClear} title="清除">
        🗑️
      </Button>
    </Panel>
  );
}; 