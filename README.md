# 🎯 INTERWISE.AI - Твой помощник на Собеседованиях

Приложение для real-time помощи на собеседованиях - слушает вопросы HR и предлагает ответы.

## Архитектура

```
┌─────────────┐      Web Speech API    ┌─────────────────┐
│  Микрофон   │ ──────────────────────► │   FastAPI      │
│  (браузер)  │        text             │   Backend      │
└─────────────┘                         │   + Gemini     │
                                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │    React       │
                                         │    Frontend    │
                                         └────────────────┘
```

## Установка

### 1. Получи API ключ Gemini

1. Перейди на https://aistudio.google.com/app/apikey
2. Создай API ключ
3. Вставь в `backend/.env`:

```
GEMINI_API_KEY=твой_ключ_здесь
```

### 2. Установи зависимости

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## Запуск

Открой 2 терминала:

**Терминал 1 - FastAPI Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Терминал 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Использование

1. Открой http://localhost:5173 в браузере (Chrome/Edge рекомендуется)
2. Нажми "🎤 Начать слушать"
3. Дай разрешение на микрофон
4. HR задаёт вопрос - приложение:
   - Распознаёт речь через Web Speech API
   - Отправит текст в Gemini
   - Покажет рекомендуемый ответ

## Требования

- Python 3.10+
- Node.js 18+
- Chrome, Edge или Safari (для распознавания речи)
- Микрофон

## Примечание

Приложение использует встроенное в браузер распознавание речи (Web Speech API). 
Это работает в Chrome/Edge/Safari. Качество распознавания зависит от браузера.
