declare module 'node-nlp' {
  export class SentimentAnalyzer {
    constructor(options?: { language?: string });
    getSentiment(text: string): Promise<{
      score: number;
      numWords: number;
      comparative: number;
      vote: string;
      tokens: string[];
      words: string[];
      positive: string[];
      negative: string[];
    }>;
  }
} 