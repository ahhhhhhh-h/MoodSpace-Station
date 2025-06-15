import React, { useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { CelestialBody } from '../types';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background: rgba(0, 8, 20, 0.95);
  padding: 20px;
  border-radius: 15px;
  width: 800px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
  background: rgba(0, 8, 20, 0.95);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 10px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${props => props.$primary ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface EmotionChartProps {
  celestialBodies: CelestialBody[];
  onClose: () => void;
  onExport: () => void;
}

export const EmotionChart: React.FC<EmotionChartProps> = ({
  celestialBodies,
  onClose,
  onExport: propOnExport
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // 按时间排序并处理数据
  const sortedBodies = [...celestialBodies].sort((a, b) => a.timestamp - b.timestamp);
  
  // 转换时间戳为可读格式
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 准备图表数据
  const data: ChartData<'line'> = {
    labels: sortedBodies.map(body => formatTime(body.timestamp)),
    datasets: [
      {
        label: '情绪曲线',
        data: sortedBodies.map(body => body.type === 'positive' ? 1 : -1),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4,
        pointBackgroundColor: (context: any) => {
          const value = context.raw;
          return value === 1 ? '#FFD700' : '#FF6B6B';
        },
        pointRadius: 6
      }
    ]
  };

  // 图表配置
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -1.5,
        max: 1.5,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value) {
            if (value === 1) return '正面';
            if (value === -1) return '负面';
            return '';
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '情绪变化曲线',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16
        }
      }
    }
  };

  const handleExport = useCallback(() => {
    if (chartRef.current) {
      // 获取 canvas 元素
      const canvas = chartRef.current.canvas;
      
      // 创建一个新的 canvas
      const exportCanvas = document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // 设置导出 canvas 的尺寸
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;

      // 绘制背景
      ctx.fillStyle = '#000814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 将原图表绘制到新 canvas 上
      ctx.drawImage(canvas, 0, 0);

      // 导出为图片
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `情绪曲线-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    }
    propOnExport();
  }, [propOnExport]);

  return (
    <ChartContainer>
      <ChartWrapper>
        <Line ref={chartRef} data={data} options={options} />
      </ChartWrapper>
      <ButtonContainer className="button-container">
        <Button onClick={onClose}>取消</Button>
        <Button $primary onClick={handleExport}>确认导出</Button>
      </ButtonContainer>
    </ChartContainer>
  );
}; 