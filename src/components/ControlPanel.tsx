import React from 'react';
import styled from 'styled-components';
import { exportIcon, clearIcon } from '../assets';

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
  width: 32px;
  height: 32px;
  cursor: pointer;
  padding: 0;
  border-radius: 10px;
  transition: all 0.3s;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  
  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const StarCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #FFD700;
  font-size: 20px;
`;

const ExportButton = styled(Button)`
  background-image: url(${exportIcon});
`;

const ClearButton = styled(Button)`
  background-image: url(${clearIcon});
`;

interface ControlPanelProps {
  starCount: number;
  onExport: () => void;
  onClear: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  starCount,
  onExport,
  onClear,
}) => {
  return (
    <Panel>
      <StarCount>
        <span>✨</span>
        <span>{starCount}</span>
      </StarCount>
      <ExportButton onClick={onExport} title="导出" />
      <ClearButton onClick={onClear} title="清除" />
    </Panel>
  );
}; 