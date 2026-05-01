export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dataDir: new URL('../../data/games', import.meta.url).pathname,
};
