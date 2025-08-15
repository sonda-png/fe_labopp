import { Code, Star, Trophy } from 'lucide-react'

export type ProgressKey = 'Total LOC' | 'Ranking' | 'Assignment'
export interface AchievementCondition {
  check: (current: number, target: number) => boolean
  title: string
  description: string
}
export interface AchievementRule {
  key: ProgressKey
  icon: React.ComponentType<{ className?: string }>
  conditions: AchievementCondition[]
}
export const achievementRules: AchievementRule[] = [
  {
    key: 'Total LOC',
    icon: Code,
    conditions: [
      {
        check: current => current >= 1000,
        title: '10k LOC',
        description: 'Achieved 1,000 lines of code',
      },
      {
        check: current => current >= 750,
        title: 'LOC Pass',
        description: 'Passed 750 lines of code',
      },
    ],
  },
  {
    key: 'Ranking',
    icon: Trophy,
    conditions: [
      {
        check: current => current <= 10,
        title: 'Top 10',
        description: 'Ranking in top 10',
      },
      {
        check: (current, target) => current <= target,
        title: 'Ranking Pass',
        description: 'Ranking target achieved',
      },
    ],
  },
  {
    key: 'Assignment',
    icon: Star,
    conditions: [
      {
        check: (current, target) => current >= target,
        title: 'Perfect Assignment',
        description: 'You have completed all assignments perfectly',
      },
    ],
  },
]
