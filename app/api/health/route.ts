import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    database: 'not-used',
    googleSheetConfigured: Boolean(process.env.GOOGLE_APPS_SCRIPT_URL?.trim()),
    message: process.env.GOOGLE_APPS_SCRIPT_URL?.trim()
      ? 'Website đã sẵn sàng gửi kết quả sang Google Sheet.'
      : 'Website chạy được, nhưng chưa cấu hình Google Sheet.',
  })
}
