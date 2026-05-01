import type { Request, Response, NextFunction } from 'express';
import { generateQuestions } from '../services/questionGenerator.js';
import { getProvider } from '../services/providerFactory.js';
import type { ProviderType } from '../types/provider.js';

export async function handleGenerateQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const { provider, baseUrl, apiKey, model, topic, questionCount, difficulty, mode } = req.body;

    if (!provider || !apiKey || !model || !topic || !questionCount) {
      res.status(400).json({ error: 'Eksik parametreler.' });
      return;
    }

    const questions = await generateQuestions(
      provider as ProviderType,
      apiKey,
      model,
      typeof baseUrl === 'string' && baseUrl.trim() ? baseUrl.trim() : undefined,
      topic,
      questionCount,
      difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard' || difficulty === 'mixed'
        ? difficulty
        : 'mixed',
      (mode as any) || 'wheel'
    );

    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

export async function handleTestConnection(req: Request, res: Response, next: NextFunction) {
  try {
    const { provider, baseUrl, apiKey, model } = req.body;

    if (!provider || !apiKey || !model) {
      res.status(400).json({ success: false, message: 'Eksik parametreler.' });
      return;
    }

    const ai = getProvider(provider as ProviderType);
    const resolvedBaseUrl = typeof baseUrl === 'string' && baseUrl.trim() ? baseUrl.trim() : undefined;

    // Provider'ların testConnection() metodu bilinçli olarak hataları yutuyor (bool dönüyor).
    // Kullanıcıya gerçek sebebi gösterebilmek için burada minimal bir chat çağrısı yapıyoruz.
    await ai.chat({
      apiKey,
      model,
      baseUrl: resolvedBaseUrl,
      systemPrompt: 'Sen bir test asistanısın.',
      userPrompt: 'Sadece "OK" yaz.',
      maxTokens: 10,
      temperature: 0,
    });

    res.json({
      success: true,
      message: 'Bağlantı başarılı!',
    });
  } catch (err: any) {
    const status = err?.response?.status;
    const requestUrl = err?.config?.url;
    const message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Bağlantı testi başarısız.';
    const details = [
      status ? `HTTP ${status}` : null,
      requestUrl ? `URL: ${requestUrl}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    res.json({
      success: false,
      message: details ? `${String(message)} (${details})` : String(message),
    });
  }
}
