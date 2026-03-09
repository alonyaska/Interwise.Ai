import { useState, useRef, useEffect } from 'react'
import './App.css'


function App() {
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [answer, setAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [wsConnected, setWsConnected] = useState(false)
    
    const recognitionRef = useRef(null)
    const wsRef = useRef(null)
    const canvasRef = useRef(null)


    useEffect(() => {
        initStars()
        connectWebSocket()
        initSpeechRecognition()
        
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])


    const initStars = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        let stars = []
        let W = window.innerWidth
        let H = window.innerHeight
        
        const resize = () => {
            W = canvas.width = window.innerWidth
            H = canvas.height = window.innerHeight
        }
        
        const initStarsArray = () => {
            stars = Array.from({ length: 260 }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.3 + 0.15,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                alpha: Math.random() * 0.65 + 0.1,
                phase: Math.random() * Math.PI * 2,
                speed: 0.007 + Math.random() * 0.011,
            }))
        }
        
        const tick = () => {
            ctx.clearRect(0, 0, W, H)
            for (const s of stars) {
                s.phase += s.speed
                const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase))
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
                ctx.fill()
                s.x += s.vx
                s.y += s.vy
                if (s.x < -2) s.x = W + 2
                if (s.x > W + 2) s.x = -2
                if (s.y < -2) s.y = H + 2
                if (s.y > H + 2) s.y = -2
            }
            requestAnimationFrame(tick)
        }
        
        window.addEventListener('resize', () => { resize(); initStarsArray() })
        resize()
        initStarsArray()
        tick()
    }


    const connectWebSocket = () => {
        wsRef.current = new WebSocket('ws://localhost:8000/ws/analyze')
        
        wsRef.current.onopen = () => {
            setWsConnected(true)
            console.log('WebSocket connected!')
        }
        
        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.answer) {
                setAnswer(data.answer)
                setIsLoading(false)
                setHistory(prev => [
                    { question: data.question, answer: data.answer },
                    ...prev.slice(0, 5)
                ])
            }
        }
        
        wsRef.current.onclose = () => {
            setWsConnected(false)
            setTimeout(connectWebSocket, 3000)
        }
    }


    const initSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        
        if (!SpeechRecognition) {
            alert('Браузер не поддерживает распознавание речи!')
            return
        }

        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'ru-RU'

        recognitionRef.current.onresult = (event) => {
            let interimTranscript = ''
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += result + ' '
                } else {
                    interimTranscript += result
                }
            }

            if (finalTranscript) {
                setTranscript(finalTranscript.trim())
                getAnswer(finalTranscript.trim())
            } else if (interimTranscript) {
                setTranscript(interimTranscript)
            }
        }

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
            if (isRecording) {
                setIsRecording(false)
            }
        }
    }


    const getAnswer = (text) => {
        if (!text || !wsRef.current) return
        if (wsRef.current.readyState !== WebSocket.OPEN) {
            console.log('WebSocket not ready')
            return
        }

        setIsLoading(true)
        const context = history.slice(0, 3).map(h => h.question).join(' | ')
        
        wsRef.current.send(JSON.stringify({
            question: text,
            context: context
        }))
    }


    const toggleListening = () => {
        if (isRecording) {
            stopListening()
        } else {
            startListening()
        }
    }


    const startListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start()
            setIsRecording(true)
            setTranscript('')
            setAnswer('')
        }
    }


    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsRecording(false)
        }
    }


    return (
        <>
            <canvas ref={canvasRef} className="star-canvas"></canvas>
            
            <div className="panel">
                <div className="header">
                    <div className="header-left">
                        <div className="logo-icon" style={{ background: 'white', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <svg width="30" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                                <path d="M12 2C9.791 2 8 3.791 8 6v6a4 4 0 0 0 8 0V6c0-2.209-1.791-4-4-4z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                <line x1="12" y1="19" x2="12" y2="22"/>
                                <line x1="9" y1="22" x2="15" y2="22"/>
                            </svg>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <g clipPath="url(#clip0_1_71)">
                                    <path d="M15.3333 4L9 10.3333L5.66667 7L0.666667 12M15.3333 4H11.3333M15.3333 4L15.3333 8" stroke="#5A884E" strokeOpacity="0.76" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_71">
                                        <rect width="16" height="16" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <h1>INTERWISE.AI</h1>
                    </div>
                    <div className={`badge ${wsConnected ? '' : 'offline'}`}>
                        <div className="badge-dot"></div>
                        {wsConnected ? 'Онлайн' : 'Оффлайн'}
                    </div>
                </div>

                <div className="divider"></div>

                <div className="voice-block">
                    <div className="mic-outer">
                        <div className="mic-ring"></div>
                        <div className="mic-ring2"></div>
                        <button 
                            className={`voice-btn ${isRecording ? 'listening' : ''}`} 
                            onClick={toggleListening}
                        >
                            <svg className="mic-svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2C9.791 2 8 3.791 8 6v6a4 4 0 0 0 8 0V6c0-2.209-1.791-4-4-4z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                <line x1="12" y1="19" x2="12" y2="22"/>
                                <line x1="9" y1="22" x2="15" y2="22"/>
                            </svg>
                        </button>
                    </div>

                    <div className={`waveform ${isRecording ? 'active' : ''}`}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                    <div className="voice-hint">
                        {isRecording ? 'слушаю...' : 'нажмите для записи'}
                    </div>
                </div>

                <div className="card">
                    <div className="card-label">
                        Что сказал HR
                        <div className="card-line"></div>
                    </div>
                    <div className={`transcript-text ${!transcript ? 'empty' : ''}`}>
                        {transcript || 'Ожидание голосового ввода...'}
                    </div>
                </div>

                <div className="card">
                    <div className="card-label">
                        Рекомендуемый ответ
                        <div className="card-line"></div>
                    </div>
                    <div className={`answer-text ${!answer ? 'empty' : ''}`}>
                        {isLoading ? 'генерирую ответ...' : (answer || 'Ответ появится здесь после вопроса...')}
                    </div>
                </div>

                <div className="card">
                    <div className="card-label">
                        История
                        <div className="card-line"></div>
                    </div>
                    <div className="history-list">
                        {history.length === 0 ? (
                            <div className="empty-history">— история пуста —</div>
                        ) : (
                            history.map((item, index) => (
                                <div key={index} className="history-item">
                                    <div className="history-q">Q — {item.question}</div>
                                    <div className="history-a">A — {item.answer}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}


export default App
