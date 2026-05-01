import type { ChatParams } from '../../types/provider.js';

export abstract class BaseProvider {
  abstract readonly name: string;
  abstract readonly baseUrl: string;

  abstract chat(params: ChatParams): Promise<string>;

  async testConnection(apiKey: string, model: string, baseUrl?: string): Promise<boolean> {
    try {
      await this.chat({
        apiKey,
        model,
        systemPrompt: 'Sen bir test asistanısın.',
        userPrompt: 'Merhaba, sadece "OK" yaz.',
        baseUrl,
        maxTokens: 10,
      });
      return true;
    } catch {
      return false;
    }
  }
}
