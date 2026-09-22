export type SelectedGroupSummary = {
  groupNo: number
  shortName: string
  score: number
  max: number
  items: string[]
}

export type GoogleSheetSummary = {
  submittedAt: string
  fullName: string
  phone: string
  email: string
  grade: string
  school: string
  group1: string
  group2: string
  group3: string
  group4: string
  group5: string
  group6: string
  dominantGroup: string
  dominantGroupInternal: string
  secondGroup: string
  secondGroupInternal: string
  thirdGroup: string
  thirdGroupInternal: string
  selectedCount: number
  totalQuestions: number
  /** Tóm tắt đáp án đã chọn theo từng nhóm — dùng cho email tư vấn viên */
  selectedByGroup: SelectedGroupSummary[]
  token?: string
}

export async function sendToGoogleSheet(summary: GoogleSheetSummary) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL?.trim()
  const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN?.trim()

  if (!url) {
    return {
      configured: false,
      synced: false,
      message: 'Chưa cấu hình Google Sheet. Kết quả vẫn được chấm bình thường.',
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...summary, token: token || '' }),
      redirect: 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })

    const text = await response.text()
    let payload: { ok?: boolean; error?: string; emailSent?: boolean } | null = null
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }

    if (!response.ok || payload?.ok === false) {
      return {
        configured: true,
        synced: false,
        message: payload?.error || `Google Sheet trả về HTTP ${response.status}.`,
      }
    }

    const emailNote = payload?.emailSent
      ? ' Đã gửi email cho tư vấn viên.'
      : ''

    return {
      configured: true,
      synced: true,
      message: `Kết quả đã được gửi về Google Sheet.${emailNote}`,
    }
  } catch (error) {
    return {
      configured: true,
      synced: false,
      message: error instanceof Error ? error.message : 'Không thể gửi dữ liệu về Google Sheet.',
    }
  }
}
