import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { AIModel } from '../config/config';

export function createAIClient(model: AIModel, modelName: string, temperature: number = 0.7) {
  if (model === 'openai') {
    return new ChatOpenAI({
      modelName,
    //   temperature, // some models don't support temperature
    });
  } else {
    return new ChatAnthropic({
      modelName,
      temperature,
    });
  }
} 