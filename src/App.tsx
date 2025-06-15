import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Moon } from './components/Moon';
import { InputSection } from './components/InputSection';
import { ControlPanel } from './components/ControlPanel';
import { FlowerSelector } from './components/FlowerSelector';
import { ResponseMessage } from './components/ResponseMessage';
import { CelestialBody, Flower, EmotionType } from './types';
import { backgroundImage, plantButtonIcon, radioIcon } from './assets';
import { EmotionAnalyzer } from './utils/EmotionAnalyzer';
import { toPng } from 'html-to-image';
import { EmotionChart } from './components/EmotionChart';

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
  background: url(${backgroundImage}) no-repeat center center fixed;
  background-size: cover;
  z-index: 0;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(0, 18, 51, 0.7) 0%, rgba(0, 8, 20, 0.9) 100%);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const welcomeFadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%);
  }
`;

const WelcomeFloat = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  animation: ${welcomeFadeInOut} 5s ease-in-out forwards;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.97);
  font-size: 18px;
  letter-spacing: 1px;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 0 16px rgba(255,255,255,0.7), 0 0 32px #7ecfff88;
  background: rgba(30, 40, 80, 0.45);
  border-radius: 18px;
  border: 1.5px solid rgba(255,255,255,0.18);
  box-shadow: 0 8px 32px 0 rgba(30, 80, 180, 0.25), 0 0 24px 4px #7ecfff55;
  backdrop-filter: blur(12px);
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(126, 207, 255, 0.12) 0%,
      rgba(255, 255, 255, 0) 80%
    );
    z-index: -1;
    pointer-events: none;
    filter: blur(2px);
  }
`;

// 独立的种花按钮
const PlantFlowerButton = styled.button`
  position: absolute;
  top: 100px;
  right: 20px;
  width: 110px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1) url(${plantButtonIcon}) no-repeat center center;
  background-size: 110px 40px;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const RadioButton = styled.button<{ isOn: boolean }>`
  position: absolute;
  top: 150px;
  right: 20px;
  width: 110px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1) url(${radioIcon}) no-repeat center center;
  background-size: 110px 40px;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
  opacity: ${props => props.isOn ? 1 : 0.5};
  
  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const App: React.FC = () => {
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([
    {
      id: 'external-1',
      type: 'positive',
      content: '今天真是个好天气！',
      timestamp: Date.now() - 3600000, // 1小时前
      isStarred: false,
      visibility: 'broadcast',
      sender: '小明',
      isExternal: true,
      replies: new Set<string>()
    },
    {
      id: 'external-2',
      type: 'negative',
      content: '下雨天好烦啊...',
      timestamp: Date.now() - 1800000, // 30分钟前
      isStarred: false,
      visibility: 'broadcast',
      sender: '小红',
      isExternal: true,
      replies: new Set<string>()
    }
  ]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [starCount, setStarCount] = useState(0);
  const [isRadioOn, setIsRadioOn] = useState(false);
  const [showFlowerSelector, setShowFlowerSelector] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showResponseMessage, setShowResponseMessage] = useState(false);
  const [responseType, setResponseType] = useState<'reply' | 'radio' | 'starNotEnough' | undefined>(undefined);
  const [customMessage, setCustomMessage] = useState<string | undefined>(undefined);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  const handleEmotionSubmit = async (text: string, visibility: 'private' | 'friends' | 'broadcast', isStarred: boolean) => {
    const emotionAnalyzer = EmotionAnalyzer.getInstance();
    const emotionType = await emotionAnalyzer.analyzeEmotion(text);
    
    const newCelestialBody: CelestialBody = {
      id: Date.now().toString(),
      type: emotionType,
      content: text,
      timestamp: Date.now(),
      isStarred,
      visibility,
      isNew: true,
      replies: new Set<string>()
    };

    setCelestialBodies(prev => [...prev, newCelestialBody]);

    if (emotionType === 'positive') {
      setStarCount(count => count + 1);
    }

    // 5秒后移除新星体的标记
    setTimeout(() => {
      setCelestialBodies(prev =>
        prev.map(body =>
          body.id === newCelestialBody.id
            ? { ...body, isNew: false }
            : body
        )
      );
    }, 5000);
  };

  const handlePlantFlower = () => {
    if (starCount < 3) {
      // 星星不足时点击不弹提示
      return;
    }
    setShowFlowerSelector(true);
  };

  const handlePlantFlowerHover = () => {
    if (starCount < 3) {
      setCustomMessage('星星数量不足，继续积攒光点吧！');
      setResponseType('starNotEnough');
      setShowResponseMessage(true);
    }
  };

  const handlePlantFlowerLeave = () => {
    if (showResponseMessage && responseType === 'starNotEnough') {
      setShowResponseMessage(false);
      setResponseType(undefined);
      setCustomMessage(undefined);
    }
  };

  const plantFlowerOnMoon = (flower: Flower) => {
    if (starCount < 3) {
      alert('你需要至少 3 颗星星才能种花 🌟');
      return;
    }
    setFlowers(prev => [...prev, flower]);
    setStarCount(prev => prev - 3);
  };

  const closeFlowerSelector = () => {
    setShowFlowerSelector(false);
  };

  const handleClear = () => {
    // 过滤出星标内容
    const starredBodies = celestialBodies.filter(body => body.isStarred);
    setCelestialBodies(starredBodies);
    setFlowers([]);
    
    // 计算星标内容中的正面情绪数量
    const positiveStarredCount = starredBodies.filter(body => body.type === 'positive').length;
    setStarCount(positiveStarredCount);
  };

  const handleExport = () => {
    setShowChart(false);
  };

  const handlePreviewChart = () => {
    setShowChart(true);
  };

  const handleRadioToggle = () => {
    setIsRadioOn(prev => {
      const next = !prev;
      if (next) {
        setResponseType('radio');
        setShowResponseMessage(true);
      }
      return next;
    });
  };

  return (
    <AppContainer>
      <Background />
      <ContentWrapper>
        {showWelcome && (
          <WelcomeFloat>
            你的每一个小情绪，都会在这里找到属于它的位置
          </WelcomeFloat>
        )}
        <ControlPanel 
          starCount={starCount}
          onExport={handlePreviewChart}
          onClear={handleClear}
        />
        
        {/* 独立的种花按钮和电台按钮 */}
        <PlantFlowerButton 
          onClick={handlePlantFlower} 
          title="种花" 
          style={{ opacity: starCount < 3 ? 0.5 : 1 }}
          onMouseEnter={handlePlantFlowerHover}
          onMouseLeave={handlePlantFlowerLeave}
        />
        
        <RadioButton 
          onClick={handleRadioToggle}
          isOn={isRadioOn}
          title="电台"
        />
        
        <Moon 
          celestialBodies={celestialBodies}
          setCelestialBodies={setCelestialBodies}
          flowers={flowers}
          isRadioOn={isRadioOn}
        />
        <InputSection onSubmit={handleEmotionSubmit} />
        
        {showFlowerSelector && (
          <FlowerSelector
            onPlantFlower={plantFlowerOnMoon}
            onClose={closeFlowerSelector}
          />
        )}
        
        {showChart && (
          <EmotionChart
            celestialBodies={celestialBodies}
            onClose={() => setShowChart(false)}
            onExport={handleExport}
          />
        )}

        {showResponseMessage && (
          <ResponseMessage
            onAnimationEnd={() => {
              setShowResponseMessage(false);
              setResponseType(undefined);
              setCustomMessage(undefined);
            }}
            type={responseType}
            message={customMessage}
          />
        )}
      </ContentWrapper>
    </AppContainer>
  );
};

export default App; 