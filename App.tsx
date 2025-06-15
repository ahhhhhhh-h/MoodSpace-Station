import React, { useState } from 'react';
import styled from 'styled-components';
import { Moon } from './components/Moon';
import { InputSection } from './components/InputSection';
import { ControlPanel } from './components/ControlPanel';
import { CelestialBody } from './types';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000814;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #001233 0%, #000814 100%);
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const App: React.FC = () => {
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
  const [starCount, setStarCount] = useState(0);
  const [isRadioOn, setIsRadioOn] = useState(false);

  const handleEmotionSubmit = (text: string, visibility: 'private' | 'friends' | 'broadcast', isStarred: boolean) => {
    // 处理情绪提交的逻辑
    console.log('Emotion submitted:', { text, visibility, isStarred });
  };

  return (
    <AppContainer>
      <Background />
      <ContentWrapper>
        <ControlPanel 
          starCount={starCount}
          isRadioOn={isRadioOn}
          onRadioToggle={() => setIsRadioOn(!isRadioOn)}
          onPlantFlower={() => console.log('Plant flower')}
          onExport={() => console.log('Export')}
          onClear={() => setCelestialBodies([])}
        />
        <Moon celestialBodies={celestialBodies} />
        <InputSection onSubmit={handleEmotionSubmit} />
      </ContentWrapper>
    </AppContainer>
  );
};

export default App; 