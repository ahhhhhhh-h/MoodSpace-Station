declare module 'sentiment' {
  // 情感分析结果接口
  export interface SentimentResult {
    /** 情感得分，正数表示积极，负数表示消极 */
    score: number;
    
    /** 标准化的比较得分（得分/词数） */
    comparative: number;
    
    /** 每个词语的得分计算详情 */
    calculation: Array<{ [token: string]: number }>;
    
    /** 分词后的结果 */
    tokens: string[];
    
    /** 识别到的情感词 */
    words: string[];
    
    /** 积极词语列表 */
    positive: string[];
    
    /** 消极词语列表 */
    negative: string[];
  }

  // 语言配置接口
  export interface LanguageLabels {
    [word: string]: number;
  }

  export interface LanguageNegators {
    [word: string]: number;
  }

  export interface LanguageDefinition {
    labels?: LanguageLabels;
    negators?: LanguageNegators;
  }

  // Sentiment 类
  export default class Sentiment {
    constructor();
    
    /** 分析文本的情感 */
    analyze(phrase: string, options?: { language?: string }): SentimentResult;
    
    /** 注册新的语言支持 */
    registerLanguage(languageCode: string, language: LanguageDefinition): void;
  }
} 