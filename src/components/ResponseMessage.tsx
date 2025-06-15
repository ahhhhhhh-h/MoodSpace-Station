import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%);
  }
`;

const MessageContainer = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  animation: ${fadeInOut} 6s ease-in-out forwards;

  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.97);
  font-size: 16px;
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


interface ResponseMessageProps {
  onAnimationEnd: () => void;
  type?: 'reply' | 'radio' | 'starNotEnough';
  message?: string;
}

export const ResponseMessage: React.FC<ResponseMessageProps> = ({ onAnimationEnd, type, message }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  let msg = '你的回应，正随着微光，穿越宇宙飞向他人💫';
  if (type === 'radio') {
    msg = '电台已开启📻，准备接收来自宇宙深处的心声';
  } else if (type === 'starNotEnough') {
    msg = '星星数量不足，继续积攒光点吧！';
  }

  return (
    <MessageContainer>
      {message || msg}
    </MessageContainer>
  );
}; 