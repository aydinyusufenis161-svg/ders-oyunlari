import axios from 'axios';
import { BaseProvider } from './base.js';
import type { ChatParams } from '../../types/provider.js';
import { normalizeBaseUrl } from '../../utils/normalizeBaseUrl.js';

export class GeminiProvider extends BaseProvider {
  readonly name = 'gemini';
  readonly baseUrl = 'https://generativelanguage.googleapis.com';

  async chat(params: ChatParams): Promise<string> {
    const baseUrl = normalizeBaseUrl(params.baseUrl || this.baseUrl, 'gemini');
    const url = `${baseUrl}/v1beta/models/${params.model}:generateContent?key=${params.apiKey}`;
    const response = await axios.post(
      url,
      {
        systemInstruction: { parts: [{ text: params.systemPrompt }] },
        contents: [{ parts: [{ text: params.userPrompt }] }],
        generationConfig: {
          temperature: params.temperature ?? 0.7,
          maxOutputTokens: params.maxTokens ?? 4096,
        },
      },
      {
        headers: {
          // Some Gemini-compatible proxies accept key via headers too.
          'x-goog-api-key': params.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  }
}
