import React, { useState } from 'react';
import styled from 'styled-components';

interface ReplyBoxProps {
  content: string;
  replies: string[];
  onClose: () => void;
  onSubmit: (reply: string) => void;
}

const ReplyBoxContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 8, 20, 0.85);
  padding: 20px;
  border-radius: 15px;
  width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 5px;
`;

const Content = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 15px;
  backdrop-filter: blur(4px);
`;

const RepliesList = styled.div`
  margin-bottom: 15px;
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const Reply = styled.div`
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  backdrop-filter: blur(4px);
`;

const Input = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  resize: none;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props => props.$primary ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ReplyBox: React.FC<ReplyBoxProps> = ({ content, replies, onClose, onSubmit }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = () => {
    if (replyText.trim()) {
      onSubmit(replyText.trim());
      setReplyText('');
    }
  };

  return (
    <ReplyBoxContainer>
      <Title>回复消息</Title>
      <Content>{content}</Content>
      <RepliesList>
        {replies.map((reply, index) => (
          <Reply key={index}>{reply}</Reply>
        ))}
      </RepliesList>
      <Input
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="输入回复内容..."
      />
      <ButtonGroup>
        <Button onClick={onClose}>取消</Button>
        <Button $primary onClick={handleSubmit}>发送</Button>
      </ButtonGroup>
    </ReplyBoxContainer>
  );
}; 