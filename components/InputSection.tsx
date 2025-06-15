import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { Visibility } from '../types';

const InputContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
`;

const StarButton = styled.button<{ isStarred: boolean }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.isStarred ? '#FFD700' : '#666'};
  transition: color 0.3s;
  
  &:hover {
    color: #FFD700;
  }
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  border: none;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 16px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const VisibilitySelect = styled.select`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 15px;
  padding: 10px;
  color: white;
  cursor: pointer;
  
  option {
    background: #1a1a1a;
    color: white;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4a9eff;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

interface InputSectionProps {
  onSubmit: (text: string, visibility: Visibility, isStarred: boolean) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>('private');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text, visibility, isStarred);
      setText('');
      setIsStarred(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <InputContainer>
      <StarButton
        isStarred={isStarred}
        onClick={() => setIsStarred(!isStarred)}
      >
        ⭐
      </StarButton>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="今天想说些什么？"
      />
      <VisibilitySelect
        value={visibility}
        onChange={(e) => setVisibility(e.target.value as Visibility)}
      >
        <option value="private">仅自己可见</option>
        <option value="friends">好友可见</option>
        <option value="broadcast">匿名广播</option>
      </VisibilitySelect>
      <SendButton onClick={handleSubmit}>🚀</SendButton>
    </InputContainer>
  );
}; 