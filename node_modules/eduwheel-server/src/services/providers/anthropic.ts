import axios from 'axios';
import { BaseProvider } from './base.js';
import type { ChatParams } from '../../types/provider.js';
import { normalizeBaseUrl } from '../../utils/normalizeBaseUrl.js';

export class AnthropicProvider extends BaseProvider {
  readonly name = 'anthropic';
  readonly baseUrl = 'https://api.anthropic.com';

  async chat(params: ChatParams): Promise<string> {
    const baseUrl = normalizeBaseUrl(params.baseUrl || this.baseUrl, 'anthropic');
    const response = await axios.post(
      `${baseUrl}/v1/messages`,
      {
        model: params.model,
        system: params.systemPrompt,
        messages: [{ role: 'user', content: params.userPrompt }],
        max_tokens: params.maxTokens ?? 4096,
        temperature: params.temperature ?? 0.7,
      },
      {
        headers: {
          'x-api-key': params.apiKey,
          Authorization: `Bearer ${params.apiKey}`,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    return response.data.content[0].text;
  }
}
