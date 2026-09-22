'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  PublicAssessmentResult,
  PublicQuestion,
  QuestionSection,
  StudentInfo,
  SyncStatus,
} from '@/lib/types'

type Phase = 'landing' | 'form' | 'instructions' | 'quiz' | 'result'

type CompleteResponse = {
  result: PublicAssessmentResult
  sync: SyncStatus
}

type PersistedState = {
  phase: Phase
  form: StudentInfo
  selected: string[]
  pageIndex: number
  questions?: PublicQuestion[]
}

const STORAGE_KEY = 'holland-assessment-v1'

const EMPTY_FORM: StudentInfo = {
  fullName: '',
  phone: '',
  email: '',
  grade: '',
  school: '',
}

const SECTION_META: Record<QuestionSection, { eyebrow: string; title: string; hint: string }> = {
  self: {
    eyebrow: 'Phần 1 · Đặc điểm bản thân',
    title: 'Tôi là người…',
    hint: 'Chọn những mô tả mà bạn cảm thấy giống mình.',
  },
  can: {
    eyebrow: 'Phần 2 · Khả năng',
    title: 'Tôi có thể…',
    hint: 'Chọn những việc bạn cảm thấy mình có thể làm hoặc có khả năng thực hiện.',
  },
  like: {
    eyebrow: 'Phần 3 · Sở thích',
    title: 'Tôi thích…',
    hint: 'Chọn những hoạt động bạn thực sự thấy hứng thú.',
  },
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

function loadPersisted(): PersistedState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedState
    if (!data || typeof data !== 'object') return null
    return data
  } catch {
    return null
  }
}

function savePersisted(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / private mode
  }
}

function clearPersisted() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 12
}

type ThemeMode = 'light' | 'dark'

function getExitEncouragement(progress: number) {
  const p = Math.max(0, Math.min(100, Math.round(progress)))

  if (p <= 5) {
    return 'Bạn chỉ vừa bắt đầu thôi. Dành thêm vài phút để khám phá bản thân nhé!'
  }

  if (p <= 10) {
    return 'Khởi đầu luôn là bước quan trọng nhất. Tiếp tục thêm một chút nhé!'
  }

  if (p <= 20) {
    return 'Bạn đang làm rất tốt. Những lựa chọn đầu tiên đang dần tạo nên bức tranh về bạn.'
  }

  if (p <= 30) {
    return 'Bạn đã đi được gần một phần ba hành trình rồi. Đừng dừng lại lúc này!'
  }

  if (p <= 40) {
    return 'Xu hướng sở thích của bạn đang dần được hình thành. Tiếp tục nhé!'
  }

  if (p <= 50) {
    return 'Gần nửa chặng đường rồi! Chỉ cần thêm một chút nữa thôi.'
  }

  if (p <= 60) {
    return 'Bạn đã vượt qua nửa hành trình. Kết quả đang ngày càng rõ hơn!'
  }

  if (p <= 70) {
    return 'Hơn nửa bài trắc nghiệm đã hoàn thành. Bạn đang tiến rất tốt!'
  }

  if (p <= 80) {
    return 'Bạn đang rất gần kết quả. Đừng bỏ lỡ những gì mình đã hoàn thành nhé!'
  }

  if (p <= 90) {
    return 'Chỉ còn một đoạn ngắn nữa thôi. Nhóm nổi trội của bạn sắp được hé lộ!'
  }

  if (p <= 95) {
    return 'Gần tới đích rồi! Chỉ còn vài lựa chọn nữa để khám phá kết quả của bạn.'
  }

  return 'Bạn gần như đã hoàn thành! Đừng rời đi khi kết quả chỉ còn cách vài bước cuối.'
}








export default function AssessmentApp() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [form, setForm] = useState<StudentInfo>(EMPTY_FORM)
  const [questions, setQuestions] = useState<PublicQuestion[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pageIndex, setPageIndex] = useState(0)
  const [emptyWarning, setEmptyWarning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<PublicAssessmentResult | null>(null)
  const [sync, setSync] = useState<SyncStatus | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [themeReady, setThemeReady] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [allowExit, setAllowExit] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [hasResume, setHasResume] = useState(false)
  const submittingRef = useRef(false)

  useEffect(() => {
    const saved = loadPersisted()
    if (saved) {
      if (saved.form) setForm({ ...EMPTY_FORM, ...saved.form })
      if (Array.isArray(saved.selected)) setSelected(new Set(saved.selected))
      if (typeof saved.pageIndex === 'number') setPageIndex(Math.max(0, saved.pageIndex))
      if (Array.isArray(saved.questions) && saved.questions.length === 108) {
        setQuestions(saved.questions)
      }
      if (saved.phase && saved.phase !== 'result' && saved.phase !== 'landing') {
        setHasResume(true)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('holland-theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }

    setThemeReady(true)
  }, [])

  useEffect(() => {
    if (!themeReady) return

    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('holland-theme', theme)
  }, [theme, themeReady])


  useEffect(() => {
    if (phase !== 'quiz') return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowExit) return

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [phase, allowExit])



  useEffect(() => {
    if (!hydrated) return
    if (phase === 'result' || phase === 'landing') return
    savePersisted({
      phase,
      form,
      selected: Array.from(selected),
      pageIndex,
      questions: questions.length === 108 ? questions : undefined,
    })
  }, [hydrated, phase, form, selected, pageIndex, questions])


  const pages = useMemo(() => {
    const order: QuestionSection[] = ['self', 'can', 'like']
    return order.flatMap((section) =>
      chunk(
        questions.filter((q) => q.section === section),
        6,
      ),
    )
  }, [questions])

  const currentPage = pages[pageIndex] || []
  const currentSection: QuestionSection = currentPage[0]?.section || 'self'
  const meta = SECTION_META[currentSection]
  const progress = pages.length ? Math.round(((pageIndex + 1) / pages.length) * 100) : 0
  const selectedCount = selected.size

  const themeToggle = (
  <button
    type="button"
    className="theme-toggle"
    aria-label={
      theme === 'light'
        ? 'Chuyển sang chế độ tối'
        : 'Chuyển sang chế độ sáng'
    }
    title={
      theme === 'light'
        ? 'Chế độ tối'
        : 'Chế độ sáng'
    }
    onClick={() => {
      setTheme((current) =>
        current === 'light' ? 'dark' : 'light'
      )
    }}
  >
    {theme === 'light' ? '🌙' : '☀️'}
  </button>
)

  const openExitModal = () => {
    if (phase !== 'quiz') return

    setShowExitModal(true)
  }

  

  const updateForm = useCallback((field: keyof StudentInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const resume = () => {
    const saved = loadPersisted()
    if (saved?.phase === 'quiz' || saved?.phase === 'instructions' || saved?.phase === 'form') {
      setAllowExit(false)
      setShowExitModal(false)
      setPhase(saved.phase)
      setHasResume(false)
      window.scrollTo({ top: 0 })
    }
  }

  const startFresh = () => {
    clearPersisted()
    setForm(EMPTY_FORM)
    setSelected(new Set())
    setPageIndex(0)
    setQuestions([])
    setResult(null)
    setSync(null)
    setError('')
    setEmptyWarning(false)
    setHasResume(false)
    setShowExitModal(false)
    setAllowExit(false)
    setPhase('form')
    window.scrollTo({ top: 0 })
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!form.fullName.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại.')
      return
    }
    if (!isValidPhone(form.phone)) {
      setError('Số điện thoại chưa hợp lệ (cần 9–12 chữ số).')
      return
    }

    setLoading(true)
    try {
      if (!questions.length) {
        const response = await fetch('/api/questions', { cache: 'force-cache' })
        const payload = await response.json()
        if (!response.ok || !Array.isArray(payload.questions)) {
          throw new Error(payload.error || 'Không thể tải câu hỏi.')
        }
        if (payload.questions.length !== 108) {
          throw new Error(`Bộ câu hỏi chưa đủ 108 mệnh đề (${payload.questions.length}/108).`)
        }
        setQuestions(payload.questions)
      }
      setPhase('instructions')
      window.scrollTo({ top: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải bài trắc nghiệm.')
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setEmptyWarning(false)
  }

  const moveNext = async () => {
    const selectedOnPage = currentPage.some((q) => selected.has(q.id))
    if (!selectedOnPage && !emptyWarning) {
      setEmptyWarning(true)
      return
    }

    setEmptyWarning(false)
    setError('')

    if (pageIndex < pages.length - 1) {
      setPageIndex((index) => index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (submittingRef.current) return
    submittingRef.current = true
    setLoading(true)
    try {
      const response = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: form,
          selectedQuestionIds: Array.from(selected),
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Không thể chấm kết quả.')

      const data = payload as CompleteResponse
      setResult(data.result)
      setSync(data.sync)
      clearPersisted()
      setPhase('result')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể chấm kết quả.')
    } finally {
      setLoading(false)
      submittingRef.current = false
    }
  }

  if (!hydrated) {
    return (
      <main className="center-shell">
        <div className="loading-box">Đang tải…</div>
      </main>
    )
  }

  if (phase === 'landing') {
    return (
      <main className="site-shell">
        {themeToggle}
        <section className="hero container">
          <div className="hero-copy">
            <span className="pill">TRẮC NGHIỆM SỞ THÍCH HOLLAND</span>
            <h1>Khám phá nhóm sở thích nổi trội của bạn</h1>
            <p className="hero-lead">
              Đủ 108 mệnh đề, nhưng mỗi màn hình chỉ hiển thị 6 mô tả để bạn dễ đọc và chọn đúng với bản thân.
            </p>
            <div className="hero-actions">
              {hasResume ? (
                <>
                  <button className="button primary large" onClick={resume}>
                    Tiếp tục bài đang làm
                  </button>
                  <button className="button ghost large" onClick={startFresh}>
                    Làm mới từ đầu
                  </button>
                </>
              ) : (
                <button className="button primary large" onClick={() => setPhase('form')}>
                  Bắt đầu trắc nghiệm
                </button>
              )}
              <span className="microcopy">Khoảng 15 phút · Không có đáp án đúng hoặc sai</span>
            </div>
            <div className="benefit-grid">
              <div>
                <strong>108/108</strong>
                <span>Mệnh đề được giữ đầy đủ</span>
              </div>
              <div>
                <strong>18 màn hình</strong>
                <span>Mỗi màn hình chỉ 6 mô tả</span>
              </div>
              <div>
                <strong>6 nhóm</strong>
                <span>Tự động tổng hợp điểm</span>
              </div>
            </div>
          </div>
          <div className="hero-card" aria-hidden="true">
            <div className="mock-window">
              <div className="mock-top">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mock-progress">
                <i></i>
              </div>
              <p>TÔI LÀ NGƯỜI…</p>
              <div className="mock-option active">✓ Yêu thích vận động</div>
              <div className="mock-option">Thích sự cụ thể, rõ ràng</div>
              <div className="mock-option active">✓ Có khả năng quan sát tốt</div>
              <div className="mock-option">Gọn gàng và ngăn nắp</div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (phase === 'form') {
    return (
      <main className="center-shell">
        {themeToggle}
        <section className="panel form-panel">
          <button className="back-link" onClick={() => setPhase('landing')}>
            ← Quay lại
          </button>
          <span className="pill">BƯỚC 1 / 3</span>
          <h2>Thông tin của bạn</h2>
          <p className="muted">
            Thông tin chỉ được gửi một lần cùng kết quả sau khi bạn hoàn thành bài trắc nghiệm.
          </p>
          <form onSubmit={submitForm} className="lead-form">
            <label>
              Họ và tên *
              <input
                required
                value={form.fullName}
                onChange={(e) => updateForm('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </label>
            <div className="field-row">
              <label>
                Số điện thoại *
                <input
                  required
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="09xxxxxxxx"
                  autoComplete="tel"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </label>
            </div>
            <div className="field-row">
              <label>
                Lớp
                <input
                  value={form.grade}
                  onChange={(e) => updateForm('grade', e.target.value)}
                  placeholder="Ví dụ: 12A1"
                />
              </label>
              <label>
                Trường
                <input
                  value={form.school}
                  onChange={(e) => updateForm('school', e.target.value)}
                  placeholder="Tên trường"
                />
              </label>
            </div>
            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}
            <button className="button primary full" disabled={loading}>
              {loading ? 'Đang tải câu hỏi…' : 'Tiếp tục'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  if (phase === 'instructions') {
    return (
      <main className="center-shell">
        {themeToggle}
        <section className="panel instruction-panel">
          <span className="pill">BƯỚC 2 / 3</span>
          <h2>Cách làm rất đơn giản</h2>
          <div className="instruction-list">
            <div>
              <b>1</b>
              <p>
                Bài có <strong>108 mệnh đề</strong>, chia thành <strong>18 màn hình</strong>, mỗi màn
                hình 6 mô tả.
              </p>
            </div>
            <div>
              <b>2</b>
              <p>
                Chỉ tick những mô tả <strong>phù hợp với bạn</strong>. Không phù hợp thì để trống.
              </p>
            </div>
            <div>
              <b>3</b>
              <p>
                Mỗi ô được tick = <strong>1 điểm</strong>. Điểm cao không có nghĩa là giỏi hơn.
              </p>
            </div>
            <div>
              <b>4</b>
              <p>
                Nếu một màn hình không có mô tả nào phù hợp, bạn có thể xác nhận và tiếp tục.
              </p>
            </div>
          </div>
          <div className="notice">
            Đừng suy nghĩ quá lâu. Hãy chọn theo cảm nhận đầu tiên và đúng với bản thân nhất.
          </div>
          <button className="button primary full" onClick={() => setPhase('quiz')}>
            Tôi đã hiểu — Bắt đầu
          </button>
        </section>
      </main>
    )
  }

  if (phase === 'quiz') {
  return (
    <main className="quiz-shell">
      {themeToggle}

      {showExitModal && (
        <div
          className="exit-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <div className="exit-modal">

            <h2 id="exit-modal-title">
              Bạn đã đi được {progress}% chặng đường rồi!
            </h2>

            <p className="exit-encouragement">
              {getExitEncouragement(progress)}
            </p>

            <p className="exit-question">
              Bạn có chắc chắn muốn rời đi và bỏ lỡ kết quả không?
            </p>

            <button
              type="button"
              className="exit-continue"
              onClick={() => setShowExitModal(false)}
            >
              Tiếp tục làm bài
            </button>

            <button
              type="button"
              className="exit-leave"
              onClick={() => {
                savePersisted({
                  phase: 'quiz',
                  form,
                  selected: Array.from(selected),
                  pageIndex,
                  questions: questions.length === 108 ? questions : undefined,
                })

                setAllowExit(true)
                setShowExitModal(false)
                setHasResume(true)
                setPhase('landing')
                window.scrollTo({ top: 0 })
              }}
            >
              Rời đi
            </button>

            <p className="exit-save-note">
              Tiến độ hiện tại đã được lưu trên thiết bị này.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={openExitModal}
        style={{
          position: 'fixed',
          left: '10px',
          bottom: '10px',
          zIndex: 9998,
        }}
      >
        TEST EXIT
      </button>




      <header className="quiz-header">
          <div className="container quiz-header-inner">
            <span className="quiz-brand">HOLLAND</span>
            <div className="quiz-meta">
              <span className="quiz-counter">
                {pageIndex + 1}/{pages.length} màn hình
              </span>
              <span className="quiz-selected" title="Số mô tả đã chọn">
                Đã chọn: {selectedCount}
              </span>
            </div>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </header>

        <section className="quiz-card">
          <div className="section-head">
            <span className="eyebrow">{meta.eyebrow}</span>
            <h2>{meta.title}</h2>
            <p>
              {meta.hint} <strong>Không cần chọn tất cả.</strong>
            </p>
          </div>

          <div className="choice-list" role="group" aria-label={meta.title}>
            {currentPage.map((question) => {
              const checked = selected.has(question.id)
              return (
                <button
                  type="button"
                  key={question.id}
                  className={`choice-card ${checked ? 'selected' : ''}`}
                  aria-pressed={checked}
                  onClick={() => toggle(question.id)}
                >
                  <span className="checkmark" aria-hidden="true">
                    {checked ? '✓' : ''}
                  </span>
                  <span>{question.text}</span>
                </button>
              )
            })}
          </div>

          {emptyWarning && (
            <div className="empty-warning" role="status">
              <strong>Chưa có mô tả nào được chọn ở màn hình này.</strong>
              <span>
                Nếu đúng là không có nội dung nào phù hợp, bấm “Tiếp tục” thêm một lần để xác nhận.
              </span>
            </div>
          )}
          {error && (
            <div className="error-box quiz-error" role="alert">
              {error}
            </div>
          )}

          <div className="quiz-actions">
            <button
              className="button ghost"
              disabled={pageIndex === 0 || loading}
              onClick={() => {
                setPageIndex((i) => Math.max(0, i - 1))
                setEmptyWarning(false)
                setError('')
              }}
            >
              ← Quay lại
            </button>
            <button className="button primary" disabled={loading} onClick={moveNext}>
              {loading ? 'Đang tổng hợp…' : pageIndex === pages.length - 1 ? 'Hoàn thành' : 'Tiếp tục →'}
            </button>
          </div>
          <p className="page-note">Tiến độ là số nội dung đã xem, không phải số ô đã tick.</p>
        </section>
      </main>
    )
  }

  if (phase === 'result' && result) {
    const topLabel = result.topGroupNos.map((n) => `Nhóm ${n}`).join(' & ')
    return (
      <main className="result-shell">
         {themeToggle}
        <section className="result-card">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>
          <span className="pill">HOÀN THÀNH</span>
          <h2>Kết quả của bạn</h2>
          <p className="muted">
            Bạn đã xem đủ 108 mệnh đề. Điểm dưới đây là số lựa chọn phù hợp với bạn ở từng nhóm.
          </p>

          <div className="result-bars">
            {result.groups.map((group) => {
              const width = group.max ? Math.round((group.score / group.max) * 100) : 0
              const isTop = result.topGroupNos.includes(group.groupNo)
              return (
                <div className={`result-row ${isTop ? 'top' : ''}`} key={group.groupNo}>
                  <div className="result-row-title">
                    <strong>Nhóm {group.groupNo}</strong>
                    <span>
                      {group.score}/{group.max}
                    </span>
                  </div>
                  <div className="score-track">
                    <span style={{ width: `${width}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="top-result">
            <span>Nhóm nổi trội</span>
            <strong>{topLabel}</strong>
          </div>

          <div className="result-note">
            <strong>Kết quả này có ý nghĩa gì?</strong>
            <p>
              Chuyên viên sẽ dựa trên nhóm nổi trội và sự kết hợp giữa các nhóm để giải thích xu
              hướng sở thích, sau đó đối chiếu với ngành học và mục tiêu của bạn.
            </p>
          </div>

          {sync?.synced ? (
            <div className="contact-box success">
              Kết quả đã được ghi nhận. Chuyên viên có thể liên hệ để tư vấn kết quả 1–1.
            </div>
          ) : (
            <div className="contact-box warning">
              Bài đã được chấm thành công. Hệ thống lưu kết quả hiện chưa kết nối hoặc gửi chưa
              thành công.
            </div>
          )}

          <div className="result-actions">
            <button className="button ghost full" onClick={startFresh}>
              Làm lại trắc nghiệm
            </button>
          </div>
        </section>
      </main>
    )
  }

  return null
}
