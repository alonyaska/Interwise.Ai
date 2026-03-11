# 💡 INTERWISE.AI - Твой помощник на собеседованиях

<p align="center">
  <img width="130" height="59" alt="Interwise AI" src="https://github.com/user-attachments/assets/94e142a3-055c-492c-8cc6-46a956497506" />
</p>

Приложение для **real-time помощи на собеседованиях** - слушает вопросы HR через микрофон и предлагает профессиональные ответы с помощью AI.

## ✨ Особенности

- 🎤 **Голосовой ввод** - распознаёт речь через Web Speech API
- 🤖 **AI-ответы** - генерирует рекомендации с помощью Gemini API
- 📊 **История сессий** - сохраняет вопросы и ответы
- 🔐 **Аутентификация** - регистрация и вход в аккаунт
- 🌐 **Real-time** - мгновенные ответы через WebSocket

## 🛠 Технологии

### Backend
- **FastAPI** - высокопроизводительный веб-фреймворк
- **Python** - основной язык разработки
- **SQLAlchemy** - ORM для работы с базой данных
- **JWT** - аутентификация через токены
- **Bcrypt** - безопасное хеширование паролей
- **Gemini API** - AI для генерации ответов

### Frontend
- **React** - библиотека для UI
- **Vite** - сборщик проекта
- **WebSocket** - real-time коммуникация
- **Web Speech API** - распознавание речи

## 📋 Требования

- Python 3.10+
- Node.js 18+
- Chrome, Edge или Safari (для распознавания речи)
- Микрофон

## 🚀 Быстрый старт

### 1. Клонирование

```bash
git clone https://github.com/alonyaska/Interwise.Ai.git
cd Interwise.Ai
```

### 2. Настройка переменных окружения

Создай файл `backend/.env`:

```env
GEMINI_API_KEY=твой_ключ_здесь
SECRET_KEY=твой_секретный_ключ
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Получить Gemini API ключ: https://aistudio.google.com/app/apikey

### 3. Установка зависимостей

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 4. Запуск

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Использование

1. Открой http://localhost:5173
2. Зарегистрируйся / войди
3. Нажми на микрофон
4. HR задаёт вопрос - приложение:
   - Распознаёт речь
   - Отправляет в Gemini API
   - Показывает рекомендуемый ответ

## 📁 Структура проекта

```
repai.ai/
├── backend/
│   ├── main.py          # Точка входа FastAPI
│   ├── api/             # API роутеры
│   ├── Users/           # Модуль пользователей
│   ├── config.py        # Конфигурация
│   ├── client_service/  # Gemini клиент
│   └── requirements.txt  # Зависимости
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Главный компонент
│   │   └── App.css     # Стили
│   └── package.json
└── README.md
```

## 🔄 Планы развития

- [ ] Интеграция Whisper для лучшего распознавания
- [ ] Поддержка подписки (монетизация)
- [ ] Деплой в интернет
- [ ] Мобильное приложение

## 📝 Автор

**Роман** (@alonyaska)
- Студент ВШЭ НИУ ВШЭ (Business Informatics)
- Backend-разработчик
- Создатель Skins-Marketplace, FastCut

## 📄 Лицензия

MIT License

---

*Делай собеседования с уверенностью! 🚀*
