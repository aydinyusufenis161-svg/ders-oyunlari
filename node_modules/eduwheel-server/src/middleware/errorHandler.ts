import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const anyErr: any = err as any;

  // Axios-style error normalization (useful for debugging proxy/provider issues)
  const axiosStatus: number | undefined = anyErr?.response?.status;
  const axiosUrl: string | undefined = anyErr?.config?.url;
  const axiosMessage: unknown =
    anyErr?.response?.data?.error?.message ||
    anyErr?.response?.data?.message ||
    anyErr?.response?.data?.error ||
    anyErr?.message;

  const statusCode = anyErr?.statusCode || axiosStatus || 500;

  const details = [
    axiosStatus ? `HTTP ${axiosStatus}` : null,
    axiosUrl ? `URL: ${axiosUrl}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  const messageBase = String(axiosMessage || 'Sunucu hatası oluştu.');
  const message = details ? `${messageBase} (${details})` : messageBase;

  console.error('[Error]', message);
  res.status(statusCode).json({ error: message });
}
