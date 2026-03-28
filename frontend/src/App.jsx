import { useState, useRef, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8000'

function StarsCanvas({ canvasRef }) {
    useEffect(() => {
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
    }, [canvasRef])
    
    return <canvas ref={canvasRef} className="star-canvas"></canvas>
}

function Auth({ onLogin }) {
    const [activeTab, setActiveTab] = useState('login')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [showPassword, setShowPassword] = useState({ login: false, register: false })
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const canvasRef = useRef(null)

    useEffect(() => {
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
    }, [])

    const handleLogin = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API_URL}/auth/Login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
                credentials: 'include'
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                throw new Error(data.detail || 'Ошибка входа')
            }
            onLogin()
        } catch (err) {
            // Retry once
            await new Promise(r => setTimeout(r, 1000))
            try {
                const res = await fetch(`${API_URL}/auth/Login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: loginEmail, password: loginPassword }),
                    credentials: 'include'
                })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    throw new Error(data.detail || 'Ошибка входа')
                }
                onLogin()
            } catch (err2) {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        if (!agreeTerms) {
            setError('Примите условия использования')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API_URL}/auth/Register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registerEmail, password: registerPassword }),
                credentials: 'include'
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                throw new Error(data.detail || 'Ошибка регистрации')
            }
            // Ждём 2 секунды чтобы данные сохранились в БД
            await new Promise(r => setTimeout(r, 2000))
            setActiveTab('login')
            setError('')
        } catch (err) {
            // Retry once
            await new Promise(r => setTimeout(r, 1000))
            try {
                const res = await fetch(`${API_URL}/auth/Register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: registerEmail, password: registerPassword }),
                    credentials: 'include'
                })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    throw new Error(data.detail || 'Ошибка регистрации')
                }
                // Ждём 2 секунды чтобы данные сохранились в БД
                await new Promise(r => setTimeout(r, 2000))
                setActiveTab('login')
                setError('')
            } catch (err2) {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <canvas ref={canvasRef} className="star-canvas"></canvas>
            <div className="auth-card">
                <div className="logo">
                    <div className="logo-mark">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2C9.79 2 8 3.79 8 6v6a4 4 0 0 0 8 0V6c0-2.21-1.79-4-4-4z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="22"/>
                            <line x1="9" y1="22" x2="15" y2="22"/>
                        </svg>
                    </div>
                    <div className="logo-name">Interwise<span>.ai</span></div>
                </div>

                <div className={`tabs ${activeTab === 'register' ? 'register' : ''}`}>
                    <div className="tab-indicator"></div>
                    <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Войти</button>
                    <button className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Регистрация</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {activeTab === 'login' ? (
                    <div className="form-panel active">
                        <div className="form-heading">
                            <h2>Добро пожаловать</h2>
                            <p>Войдите в свой аккаунт</p>
                        </div>

                        <div className="field">
                            <label>Email</label>
                            <div className="input-wrap">
                                <input type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="m2 7 10 7 10-7"/>
                                </svg>
                            </div>
                        </div>

                        <div className="field field-pass">
                            <label>Пароль</label>
                            <div className="input-wrap">
                                <input type={showPassword.login ? 'text' : 'password'} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <button className="eye-btn" onClick={() => setShowPassword(p => ({ ...p, login: !p.login }))}>
                                    {showPassword.login ? (
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className="btn-submit" onClick={handleLogin} disabled={loading}>
                            {loading ? '...' : 'Войти'}
                        </button>

                        <div className="or-divider">или</div>

                        <button className="btn-oauth">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Войти через Google
                        </button>
                    </div>
                ) : (
                    <div className="form-panel active">
                        <div className="form-heading">
                            <h2>Создать аккаунт</h2>
                            <p>Начните работу с Interwise.ai</p>
                        </div>

                        <div className="field">
                            <label>Email</label>
                            <div className="input-wrap">
                                <input type="email" placeholder="you@example.com" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} />
                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="m2 7 10 7 10-7"/>
                                </svg>
                            </div>
                        </div>

                        <div className="field field-pass">
                            <label>Пароль</label>
                            <div className="input-wrap">
                                <input type={showPassword.register ? 'text' : 'password'} placeholder="Минимум 8 символов" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <button className="eye-btn" onClick={() => setShowPassword(p => ({ ...p, register: !p.register }))}>
                                    {showPassword.register ? (
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className="check-row">
                            <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                            Я согласен с условиями использования
                        </label>

                        <button className="btn-submit" onClick={handleRegister} disabled={loading}>
                            {loading ? '...' : 'Создать аккаунт'}
                        </button>

                        <div className="or-divider">или</div>

                        <button className="btn-oauth">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Зарегистрироваться через Google
                        </button>
                    </div>
                )}

                <div className="form-footer">
                    {activeTab === 'login' ? (
                        <>Нет аккаунта? <a onClick={() => setActiveTab('register')}>Зарегистрироваться</a></>
                    ) : (
                        <>Уже есть аккаунт? <a onClick={() => setActiveTab('login')}>Войти</a></>
                    )}
                </div>
            </div>
        </>
    )
}

function MyLove() {
    const [loveData, setLoveData] = useState(null)
    const [loading, setLoading] = useState(true)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        let hearts = []
        let W = window.innerWidth
        let H = window.innerHeight
        
        const resize = () => {
            W = canvas.width = window.innerWidth
            H = canvas.height = window.innerHeight
        }
        
        const initHearts = () => {
            hearts = Array.from({ length: 30 }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 15 + 8,
                speedY: Math.random() * 1 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.3,
                pulse: Math.random() * Math.PI * 2
            }))
        }
        
        const drawHeart = (x, y, size, alpha, pulse) => {
            const s = size + Math.sin(pulse) * 3
            ctx.save()
            ctx.globalAlpha = alpha
            ctx.fillStyle = '#ff6b9d'
            ctx.beginPath()
            ctx.moveTo(x, y + s / 4)
            ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4)
            ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.7, x, y + s)
            ctx.bezierCurveTo(x, y + s * 0.7, x + s / 2, y + s / 2, x + s / 2, y + s / 4)
            ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4)
            ctx.fill()
            ctx.restore()
        }
        
        const tick = () => {
            ctx.clearRect(0, 0, W, H)
            for (const h of hearts) {
                h.pulse += 0.03
                h.y -= h.speedY
                h.x += h.speedX
                
                if (h.y < -50) {
                    h.y = H + 50
                    h.x = Math.random() * W
                }
                
                drawHeart(h.x, h.y, h.size, h.alpha, h.pulse)
            }
            requestAnimationFrame(tick)
        }
        
        window.addEventListener('resize', () => { resize(); initHearts() })
        resize()
        initHearts()
        tick()
        
        fetch(`${API_URL}/auth/mylove`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setLoveData(data))
            .finally(() => setLoading(false))
    }, [])

    return (
        <>
            <canvas ref={canvasRef} className="star-canvas"></canvas>
            <div className="love-container">
                {loading ? (
                    <div className="love-loading">
                        <div className="love-spinner"></div>
                        <p>Загрузка любви...</p>
                    </div>
                ) : (
                    <div className="love-card">
                        <div className="love-icon">💕</div>
                        <h1 className="love-title">Моя Любовь</h1>
                        <div className="love-heart">
                            <svg viewBox="0 0 24 24" fill="#ff6b9d">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <p className="love-message">{loveData?.['ur Love']}</p>
                        <div className="love-decoration">
                            <span className="star">✨</span>
                            <span className="star">💖</span>
                            <span className="star">✨</span>
                        </div>
                        <p className="love-subtitle">Навсегда в моём сердце</p>
                    </div>
                )}
            </div>
        </>
    )
}

function MainApp({ onNavigate }) {
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [answer, setAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [wsConnected, setWsConnected] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [profileEmail, setProfileEmail] = useState('')
    const [profileId, setProfileId] = useState(null)
    
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

    const fetchWithRetry = async (url, opts, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const res = await fetch(url, opts)
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data.detail || res.statusText || 'Network error')
                }
                return res
            } catch (e) {
                if (i < retries - 1) {
                    await new Promise(r => setTimeout(r, delay))
                    delay *= 2
                } else {
                    throw e
                }
            }
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

    const openProfile = async () => {
        setProfileOpen(true)
        try {
            const res = await fetchWithRetry(`${API_URL}/auth/me`, { credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                setProfileEmail(data.email || '')
                if (data.id !== undefined) setProfileId(data.id)
            }
        } catch { /* ignore */ }
    }

    const saveProfile = async () => {
        try {
            const res = await fetchWithRetry(`${API_URL}/auth/me`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: profileId, email: profileEmail }),
                credentials: 'include'
            })
            if (res.ok) {
                setProfileOpen(false)
                await new Promise(r => setTimeout(r, 400))
            } else {
                const d = await res.json().catch(() => ({}))
                console.error(d.detail || 'Update failed')
            }
        } catch (e) {
            console.error(e)
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
            if (recognitionRef.current) recognitionRef.current.stop()
            setIsRecording(false)
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.start()
                setIsRecording(true)
                setTranscript('')
                setAnswer('')
            }
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/auth/Logout`, {
                method: 'POST',
                credentials: 'include'
            })
        } catch (e) {
            console.error('Logout error:', e)
        }
        window.location.reload()
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
                        <button className="profile-btn" onClick={openProfile} title="Профиль" aria-label="Профиль">Профиль</button>
                    </div>
                    <div className="header-right">
                        <button className="love-nav-btn" onClick={() => onNavigate('love')}>
                            💕
                        </button>
                        <div className={`badge ${wsConnected ? '' : 'offline'}`}>
                            <div className="badge-dot"></div>
                            {wsConnected ? 'Онлайн' : 'Оффлайн'}
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
                    </div>
                </div>

                {profileOpen && (
                    <div className="profile-overlay" onClick={() => setProfileOpen(false)}>
                        <div className="profile-panel" onClick={e => e.stopPropagation()}>
                            <div className="profile-title">Профиль</div>
                            <label>Email</label>
                            <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                            <div className="profile-actions" style={{ display:'flex', gap:8, marginTop:10 }}>
                                <button className="btn-submit" onClick={saveProfile}>Сохранить</button>
                                <button className="btn-oauth" onClick={() => setProfileOpen(false)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                )}

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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentPage, setCurrentPage] = useState('main')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include'
            })
            if (res.ok) {
                setIsAuthenticated(true)
            }
        } catch (e) {
            // Retry once after 1 second if first attempt fails
            await new Promise(r => setTimeout(r, 1000))
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    credentials: 'include'
                })
                if (res.ok) {
                    setIsAuthenticated(true)
                }
            } catch (e2) {
                console.log('Not authenticated')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Auth onLogin={() => setIsAuthenticated(true)} />
    }

    if (currentPage === 'love') {
        return <MyLove />
    }

    return <MainApp onNavigate={(page) => setCurrentPage(page)} />
}

export default App
