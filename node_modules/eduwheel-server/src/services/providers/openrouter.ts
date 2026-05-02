import axios from 'axios';
import { BaseProvider } from './base.js';
import type { ChatParams } from '../../types/provider.js';
import { normalizeBaseUrl } from '../../utils/normalizeBaseUrl.js';

export class OpenRouterProvider extends BaseProvider {
  readonly name = 'openrouter';
  readonly baseUrl = 'https://openrouter.ai/api';

  async chat(params: ChatParams): Promise<string> {
    const baseUrl = normalizeBaseUrl(params.baseUrl || this.baseUrl, 'openai-compatible');
    const response = await axios.post(
      `${baseUrl}/v1/chat/completions`,
      {
        model: params.model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
      },
      {
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ders-oyunlari.vercel.app/', // Recommended by OpenRouter
          'X-Title': 'EduWheel', // Recommended by OpenRouter
        },
      }
    );
    return response.data.choices[0].message.content;
  }
}
