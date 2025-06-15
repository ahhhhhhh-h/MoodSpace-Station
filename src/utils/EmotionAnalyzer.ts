import { EmotionType } from '../types';

export class EmotionAnalyzer {
  private static instance: EmotionAnalyzer;

  // ✅ 这里填你的 DeepSeek 真实 API Key
  private apiKey: string = 'sk-b7d7e06604e44a5e965959754c904de5';

  // ✅ DeepSeek的标准接口地址（基本和OpenAI一样）
  private apiUrl: string = 'https://api.deepseek.com/v1/chat/completions';

  private constructor() {}

  public static getInstance(): EmotionAnalyzer {
    if (!EmotionAnalyzer.instance) {
      EmotionAnalyzer.instance = new EmotionAnalyzer();
    }
    return EmotionAnalyzer.instance;
  }

  public async analyzeEmotion(text: string): Promise<EmotionType> {
    try {
      if (!text.trim()) {
        return 'received';
      }

      const prompt = `
请判断下列中文内容的情绪类别，只返回以下三种英文结果：
- positive（积极）
- negative（消极）
- received（中性）

不要输出多余文字，只返回其中一个词即可。

文本内容：
"${text}"
`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',  // DeepSeek使用的基础对话模型
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,         // 让回答更稳定，不要乱说
          max_tokens: 20             // 控制返回内容短一点
        }),
      });

      if (!response.ok) {
        console.error('DeepSeek情绪识别API HTTP错误:', response.status, response.statusText);
        return 'received';
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim().toLowerCase();

      // 根据DeepSeek返回的文本，判断情绪类型
      if (reply?.includes('positive')) {
        return 'positive';
      }
      if (reply?.includes('negative')) {
        return 'negative';
      }
      return 'received';
    } catch (error) {
      console.error('DeepSeek情绪识别出错:', error);
      return 'received';
    }
  }
}
