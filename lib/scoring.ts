import { GROUPS, QUESTION_BANK, QUESTION_BY_ID, type HollandCode } from '@/lib/server/question-bank'
import type { PublicAssessmentResult } from '@/lib/types'

export type PrivateGroupResult = {
  code: HollandCode
  groupNo: number
  name: string
  shortName: string
  score: number
  max: number
}

export type SelectedByGroup = {
  groupNo: number
  shortName: string
  items: string[]
}

export type ScoreResult = {
  publicResult: PublicAssessmentResult
  privateGroups: PrivateGroupResult[]
  topCodes: HollandCode[]
  topNames: string[]
  selectedByGroup: SelectedByGroup[]
}

export function scoreAssessment(selectedQuestionIds: string[]): ScoreResult {
  const validIds = new Set(
    selectedQuestionIds.filter((id) => QUESTION_BY_ID.has(id)),
  )

  const scores: Record<HollandCode, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  }

  const maxScores: Record<HollandCode, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  }

  const selectedTexts: Record<HollandCode, string[]> = {
    R: [],
    I: [],
    A: [],
    S: [],
    E: [],
    C: [],
  }

  for (const question of QUESTION_BANK) {
    maxScores[question.group] += 1
    if (validIds.has(question.id)) {
      scores[question.group] += 1
      selectedTexts[question.group].push(question.text)
    }
  }

  const codes = Object.keys(GROUPS) as HollandCode[]
  const privateGroups = codes
    .map((code) => ({
      code,
      groupNo: GROUPS[code].publicNo,
      name: GROUPS[code].name,
      shortName: GROUPS[code].shortName,
      score: scores[code],
      max: maxScores[code],
    }))
    .sort((a, b) => a.groupNo - b.groupNo)

  const selectedByGroup: SelectedByGroup[] = privateGroups.map((g) => ({
    groupNo: g.groupNo,
    shortName: g.shortName,
    items: selectedTexts[g.code],
  }))

  const highest = Math.max(...privateGroups.map((g) => g.score))
  const topCodes = privateGroups.filter((g) => g.score === highest).map((g) => g.code)
  const topNames = topCodes.map((code) => GROUPS[code].shortName)
  const topGroupNos = topCodes.map((code) => GROUPS[code].publicNo)

  return {
    privateGroups,
    topCodes,
    topNames,
    selectedByGroup,
    publicResult: {
      groups: privateGroups.map(({ groupNo, score, max }) => ({ groupNo, score, max })),
      topGroupNos,
      selectedCount: validIds.size,
      totalQuestions: QUESTION_BANK.length,
    },
  }
}
