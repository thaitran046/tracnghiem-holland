export type QuestionSection = 'self' | 'can' | 'like'

export type PublicQuestion = {
  id: string
  text: string
  section: QuestionSection
  displayOrder: number
}

export type PublicGroupResult = {
  groupNo: number
  score: number
  max: number
}

export type PublicAssessmentResult = {
  groups: PublicGroupResult[]
  topGroupNos: number[]
  selectedCount: number
  totalQuestions: number
}

export type StudentInfo = {
  fullName: string
  phone: string
  email: string
  grade: string
  school: string
}

export type SyncStatus = {
  configured: boolean
  synced: boolean
  message: string
}
