import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { CelestialBody, Flower, EmotionType } from '../types';
import {
  moonImage,
  starIcon,
  meteorIcon,
  flower1Icon,
  flower2Icon,
  flower3Icon,
  othersIcon
} from '../assets';
import { ReplyBox } from './ReplyBox';
import { ResponseMessage } from './ResponseMessage';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const fadeAway = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(100px, -100px) scale(0.1);
    opacity: 0;
  }
`;

const MoonContainer = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 360px; height: 360px;
  pointer-events: none;
`;

const MoonSphere = styled.div`
  width: 100%; height: 100%;
  border-radius: 50%;
  background: url(${moonImage}) no-repeat center center;
  background-size: cover;
  animation: ${rotate} 60s linear infinite;
  box-shadow: inset -25px -25px 40px rgba(0,0,0,0.3);
`;

const FlowerOverlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: auto;
`;

interface FlowerDotProps {
  $x: number;
  $y: number;
  flowerType: 'flower1' | 'flower2' | 'flower3';
}
const FlowerDot = styled.div<FlowerDotProps>`
  position: absolute;
  left: ${p => p.$x}px;
  top: ${p => p.$y}px;
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${p =>
    p.flowerType === 'flower1'
      ? `url(${flower1Icon})`
      : p.flowerType === 'flower2'
      ? `url(${flower2Icon})`
      : `url(${flower3Icon})`};
`;

const CelestialBodyContainer = styled.div<{
  type: EmotionType;
  x: number;
  y: number;
  isExternal?: boolean;
  isReplied?: boolean;
}>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 48px;
  height: 48px;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  animation: ${props => {
    if (props.isExternal && props.isReplied) {
      return css`${fadeAway} 8s ease-in-out forwards`;
    }
    return css`${float} 5s ease-in-out infinite`;
  }};

  &.disappearing {
    animation: ${fadeAway} 0.8s ease-in-out forwards !important;
  }

  ${props => {
    if (props.isExternal) {
      return `background-image: url(${othersIcon});`;
    }
    switch (props.type) {
      case 'positive':
        return `background-image: url(${starIcon});`;
      case 'negative':
        return `background-image: url(${meteorIcon});`;
      case 'received':
        return `background-image: url(${starIcon});`;
      default:
        return '';
    }
  }}

  &:hover {
    transform: scale(1.2);
    z-index: 10;
  }

  &:hover div {
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 50%;
  top: -40px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: pre-wrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 100;
  min-width: 120px;
  max-width: 200px;
  text-align: center;

  .content {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.15);
    border-left: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(6px);
  }
`;

const PositionWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  div {
    pointer-events: auto;
  }
`;

interface MoonProps {
  celestialBodies: CelestialBody[];
  setCelestialBodies: React.Dispatch<React.SetStateAction<CelestialBody[]>>;
  flowers?: Flower[];
  isRadioOn?: boolean;
}

export const Moon: React.FC<MoonProps> = ({
  celestialBodies,
  setCelestialBodies,
  flowers = [],
  isRadioOn = false
}) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedCelestialBody, setSelectedCelestialBody] = useState<CelestialBody | null>(null);
  const [repliedBodies, setRepliedBodies] = useState<Set<string>>(new Set());
  const [showResponseMessage, setShowResponseMessage] = useState(false);
  const [disappearingId, setDisappearingId] = useState<string | null>(null);
  const [showMeteorMessage, setShowMeteorMessage] = useState(false);
  const meteorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const moonCenter = useMemo(() => {
    const topOffset = 120;
    const bottomOffset = 180;
    return {
      x: window.innerWidth / 2,
      y: (window.innerHeight - topOffset - bottomOffset) / 2 + topOffset
    };
  }, []);

useEffect(() => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const moonR = 150;
  const celestialSize = 48;

  const moonX = moonCenter.x;
  const moonY = moonCenter.y;

  const topMargin = 120;
  const bottomMargin = 180;
  const sideMargin = 100;

  const minX = sideMargin;
  const maxX = w - sideMargin - celestialSize;
  const minY = topMargin;
  const maxY = h - bottomMargin - celestialSize;

  const safeDistance = moonR + 80;

  const newPos: Record<string, { x: number; y: number }> = {};

  celestialBodies.forEach(body => {
    if (positions[body.id]) {
      newPos[body.id] = positions[body.id];
    } else {
      let x: number, y: number, distToMoon: number, cnt = 0;
      do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        distToMoon = Math.hypot(x - moonX, y - moonY); // ✅ 每次新算一次

        cnt++;
      } while (
        cnt < 100 && (
          distToMoon < safeDistance ||
          Object.values(newPos).some(pos => Math.hypot(x - pos.x, y - pos.y) < celestialSize * 1.5)
        )
      );

      newPos[body.id] = { x, y };
    }
  });

  setPositions(newPos);
}, [celestialBodies, moonCenter]);


  const handleCelestialBodyClick = (body: CelestialBody) => {
    if (body.isExternal && isRadioOn) {
      setSelectedCelestialBody(body);
    }
  };

  const handleReplySubmit = (replyText: string) => {
    if (selectedCelestialBody && replyText.trim()) {
      const updatedReplies = new Set([...Array.from(selectedCelestialBody.replies), replyText]);
      const updatedCelestialBodies = celestialBodies.map(body => {
        if (body.id === selectedCelestialBody.id) {
          return { ...body, replies: updatedReplies };
        }
        return body;
      });
      setCelestialBodies(updatedCelestialBodies);
      if (selectedCelestialBody.isExternal) {
        setShowResponseMessage(true);
        setTimeout(() => {
          setShowResponseMessage(false);
        }, 6000);
      }
      setSelectedCelestialBody(null);
      setRepliedBodies(prev => new Set([...prev, selectedCelestialBody.id]));
    }
  };

  const handleReplyClose = () => {
    setSelectedCelestialBody(null);
  };

  const visibleBodies = celestialBodies.filter(
    body => !body.isExternal || (body.isExternal && isRadioOn)
  );

  return (
    <PositionWrapper>
      <MoonContainer>
        <MoonSphere />
        <FlowerOverlay>
          {flowers.map(flower => (
            <FlowerDot
              key={flower.id}
              $x={flower.position.x}
              $y={flower.position.y}
              flowerType={flower.style}
            />
          ))}
        </FlowerOverlay>
      </MoonContainer>

      {visibleBodies.map(body => {
        const pos = positions[body.id];
        if (!pos) return null;
        const isReplied = repliedBodies.has(body.id);
        const isDisappearing = disappearingId === body.id;

        // 仅为消极情绪陨石添加长按事件
        const isMeteor = body.type === 'negative';
        let pressTimer: NodeJS.Timeout | null = null;

        const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
          if (!isMeteor) return;
          e.stopPropagation();
          pressTimer = setTimeout(() => {
            setDisappearingId(body.id);
            setTimeout(() => {
              setDisappearingId(null);
              setShowMeteorMessage(true);
              setCelestialBodies(prev => prev.filter(b => b.id !== body.id));
              setTimeout(() => setShowMeteorMessage(false), 5000);
            }, 800);
          }, 800);
          meteorTimerRef.current = pressTimer;
        };
        const handlePressEnd = () => {
          if (pressTimer) clearTimeout(pressTimer);
          if (meteorTimerRef.current) clearTimeout(meteorTimerRef.current);
        };

        return (
          <CelestialBodyContainer
            key={body.id}
            type={body.type}
            x={pos.x}
            y={pos.y}
            isExternal={body.isExternal}
            isReplied={isReplied && body.isExternal}
            className={isDisappearing ? 'disappearing' : ''}
            onMouseDown={handlePressStart}
            onTouchStart={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchEnd={handlePressEnd}
            onClick={() => handleCelestialBodyClick(body)}
          >
            <Tooltip>
              {body.isExternal ? (
                <>
                  <div className="content">{body.content}</div>
                  <div className="meta">
                    来自：{body.sender}
                    <br />
                    {new Date(body.timestamp).toLocaleString('zh-CN', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </>
              ) : (
                <div>{body.content}</div>
              )}
            </Tooltip>
          </CelestialBodyContainer>
        );
      })}

      {selectedCelestialBody && (
        <ReplyBox
          content={selectedCelestialBody.content}
          onSubmit={handleReplySubmit}
          onClose={handleReplyClose}
          replies={Array.from(selectedCelestialBody.replies)}
        />
      )}

      {showResponseMessage && (
        <ResponseMessage onAnimationEnd={() => setShowResponseMessage(false)} />
      )}

      {showMeteorMessage && (
        <ResponseMessage
          onAnimationEnd={() => setShowMeteorMessage(false)}
          message="情绪已归于宇宙，未来将更加闪耀"
        />
      )}
    </PositionWrapper>
  );
};
