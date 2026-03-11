
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
import json
import asyncio
import sys
import os

# Add parent directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from config import settings
from client_service.client_service import client

router = APIRouter(prefix="")


@router.get("/")
async def root():
    return {"status": "ok", "message": "HR Assistant API"}


@router.post("/api/analyze")
async def analyze_question(data: dict):
    """Анализирует вопрос HR и возвращает рекомендацию"""
    question = data.get("question", "")
    context = data.get("context", "")

    if not question:
        return {"error": "Question is required"}

    prompt = f"""{settings.SYSTEM_PROMPT}

Контекст предыдущих вопросов: {context}

Вопрос от HR: {question}

Дай краткий и профессиональный ответ на этот вопрос. 
Отвечай на русском языке."""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return {
            "answer": response.text if response.text else "Нет ответа",
            "question": question
        }
    except Exception as e:
        return {"error": f"API Error: {str(e)}"}


@router.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    """WebSocket для real-time анализа вопросов"""
    print("New WebSocket connection")
    await websocket.accept()
    print("WebSocket accepted")

    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=60)
            except asyncio.TimeoutError:
                await websocket.send_json({"type": "ping"})
                continue
            except Exception as e:
                print(f"Receive error: {e}")
                break

            json_data = json.loads(data)

            question = json_data.get("question", "")
            context = json_data.get("context", "")

            print(f"Received question: {question}")

            if question:
                prompt = f"""{settings.SYSTEM_PROMPT}

Контекст: {context}

Вопрос HR: {question}

Дай краткий профессиональный ответ (2-3 предложения)."""

                print(f"Sending to Gemini...")
                try:
                    response = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=prompt,
                    )
                    response_text = response.text if response.text else "Нет ответа"
                    print(f"Got response: {response_text[:100]}...")

                    await websocket.send_json({
                        "answer": response_text,
                        "question": question
                    })
                except Exception as e:
                    print(f"Gemini API error: {e}")
                    await websocket.send_json({
                        "answer": "Ошибка при генерации ответа. Попробуйте ещё раз.",
                        "question": question
                    })

    except WebSocketDisconnect:
        print("Client disconnected normally")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        print("WebSocket closed")
