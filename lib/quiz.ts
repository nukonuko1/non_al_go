export interface QuizQuestion {
  question: string
  options: string[]
  answer: number   // index
  explanation: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'ビール500ml・5%の純アルコール量は？',
    options: ['約10g', '約20g', '約30g'],
    answer: 1,
    explanation: '計算式：500ml × 5% × 0.8 = 20g。これは「節度ある飲酒」の1日の上限量です。',
  },
  {
    question: 'お酒を飲んだ夜に起きやすいことは？',
    options: ['睡眠が深くなる', '睡眠の質が下がる', '睡眠に影響しない'],
    answer: 1,
    explanation: 'アルコールは入眠を助けますが、深い眠り（ノンレム睡眠）を妨げます。後半の睡眠が浅くなりがちです。',
  },
  {
    question: 'アルコール1gのカロリーは？',
    options: ['4kcal（糖質と同じ）', '7kcal', '9kcal（脂質と同じ）'],
    answer: 1,
    explanation: 'アルコールは1gあたり7kcal。糖質（4kcal）より高く、脂質（9kcal）に次ぐ高カロリーです。',
  },
  {
    question: '厚生労働省の「節度ある飲酒」の目安（純アルコール量/日）は？',
    options: ['10g', '20g', '40g'],
    answer: 1,
    explanation: '純アルコール20g＝ビール500ml1本・日本酒1合・ワイン2杯程度。これが健康リスクの目安です。',
  },
  {
    question: 'お酒をやめると最初に現れやすい体の変化は？',
    options: ['体重が増える', '睡眠の質が改善する', '集中力が下がる'],
    answer: 1,
    explanation: '断酒・節酒から数日〜2週間で睡眠の質が改善します。翌朝のすっきり感が違います。',
  },
  {
    question: '飲酒後に食欲が増える主な理由は？',
    options: ['胃が刺激されるから', '血糖値が下がるから', '両方の影響がある'],
    answer: 2,
    explanation: 'アルコールは胃液分泌を促進し食欲を高め、さらに低血糖状態を引き起こして甘い物・脂っこい物への欲求が増します。',
  },
  {
    question: '純アルコール20gが体から分解されるまでの目安は？',
    options: ['約1時間', '約2〜3時間', '約6時間以上'],
    answer: 1,
    explanation: '体重60kgの成人で約2〜3時間が目安。個人差がありますが、「飲んだら翌朝まで残る」は珍しくありません。',
  },
]

export function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return [...questions].sort(() => Math.random() - 0.5)
}
