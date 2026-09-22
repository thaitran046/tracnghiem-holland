import { NextResponse } from 'next/server'
import { QUESTION_BANK } from '@/lib/server/question-bank'
import type { PublicQuestion } from '@/lib/types'

export const dynamic = 'force-static'

export async function GET() {
  const questions: PublicQuestion[] = QUESTION_BANK.map(({ id, text, section, displayOrder }) => ({
    id,
    text,
    section,
    displayOrder,
  }))

  return NextResponse.json(
    { questions },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
