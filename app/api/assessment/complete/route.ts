import { NextRequest, NextResponse } from 'next/server'
import { scoreAssessment } from '@/lib/scoring'
import { sendToGoogleSheet } from '@/lib/server/google-sheet'
import type { StudentInfo } from '@/lib/types'

function clean(value: unknown, maxLength = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const studentRaw = (body?.student || {}) as Partial<StudentInfo>
    const student: StudentInfo = {
      fullName: clean(studentRaw.fullName, 120),
      phone: clean(studentRaw.phone, 30),
      email: clean(studentRaw.email, 160),
      grade: clean(studentRaw.grade, 80),
      school: clean(studentRaw.school, 180),
    }

    if (!student.fullName || !student.phone) {
      return NextResponse.json(
        { error: 'Vui lòng nhập họ tên và số điện thoại.' },
        { status: 400 },
      )
    }

    const selectedQuestionIds = Array.isArray(body?.selectedQuestionIds)
      ? body.selectedQuestionIds.filter((id: unknown): id is string => typeof id === 'string')
      : []

    const scored = scoreAssessment(selectedQuestionIds)
    const ranked = [...scored.privateGroups].sort(
      (a, b) => b.score - a.score || a.groupNo - b.groupNo,
    )

    const groupText = (groupNo: number) => {
      const g = scored.privateGroups.find((item) => item.groupNo === groupNo)
      return g ? `${g.score}/${g.max}` : '0/0'
    }

    const dominantPublic = scored.publicResult.topGroupNos.map((n) => `Nhóm ${n}`).join(' & ')
    const dominantInternal = scored.topNames.join(' & ')

    const selectedByGroup = scored.selectedByGroup.map((g) => {
      const privateG = scored.privateGroups.find((p) => p.groupNo === g.groupNo)
      return {
        groupNo: g.groupNo,
        shortName: g.shortName,
        score: privateG?.score ?? g.items.length,
        max: privateG?.max ?? 18,
        items: g.items,
      }
    })

    const sync = await sendToGoogleSheet({
      submittedAt: new Date().toISOString(),
      fullName: student.fullName,
      phone: student.phone,
      email: student.email,
      grade: student.grade,
      school: student.school,
      group1: groupText(1),
      group2: groupText(2),
      group3: groupText(3),
      group4: groupText(4),
      group5: groupText(5),
      group6: groupText(6),
      dominantGroup: dominantPublic,
      dominantGroupInternal: dominantInternal,
      secondGroup: ranked[1] ? `Nhóm ${ranked[1].groupNo} (${ranked[1].score}/${ranked[1].max})` : '',
      secondGroupInternal: ranked[1]?.shortName || '',
      thirdGroup: ranked[2] ? `Nhóm ${ranked[2].groupNo} (${ranked[2].score}/${ranked[2].max})` : '',
      thirdGroupInternal: ranked[2]?.shortName || '',
      selectedCount: scored.publicResult.selectedCount,
      totalQuestions: scored.publicResult.totalQuestions,
      selectedByGroup,
    })

    return NextResponse.json({
      result: scored.publicResult,
      sync,
    })
  } catch (error) {
    console.error('Assessment complete error:', error)
    return NextResponse.json(
      { error: 'Không thể chấm kết quả. Vui lòng thử lại.' },
      { status: 500 },
    )
  }
}
