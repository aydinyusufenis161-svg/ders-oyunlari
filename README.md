# EduWheel

React + Node.js tabanlı minimalist eğitim oyun platformu.

## Stack

- Frontend: React 18 + Vite + TypeScript + Tailwind CSS + Zustand + Framer Motion
- Backend: Node.js + Express.js (TypeScript)

## Klasör yapısı

- `client/`: Frontend uygulaması (Vite)
- `server/`: Backend API (Express)

## Hızlı başlatma

Node 18+ önerilir.

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Health: `http://localhost:3001/api/health`

## Ortam değişkenleri

Backend için örnek dosya: `server/.env.example`

```bash
copy server\.env.example server\.env
```

## Notlar

- Kullanıcı API key’i (OpenAI/Claude/Gemini/Groq vb.) **kullanıcının tarayıcısında** saklanacak şekilde tasarlanmıştır.
- Backend, seçilen provider’a istekleri proxy’ler ve soru üretimini yönetir.

