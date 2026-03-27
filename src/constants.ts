import { QuizQuestion } from './types';

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "담배 연기에는 4,000여 종의 화학 물질이 들어있다.",
    answer: true,
    explanation: "담배 연기에는 타르, 니코틴, 일산화탄소를 포함하여 약 4,000여 종의 화학 물질과 70여 종의 발암 물질이 포함되어 있습니다.",
    order: 1
  },
  {
    question: "전자담배는 일반 담배보다 건강에 해롭지 않다.",
    answer: false,
    explanation: "전자담배 역시 니코틴을 포함하고 있으며, 다양한 유해 성분이 포함되어 있어 일반 담배만큼이나 건강에 해롭습니다.",
    order: 2
  },
  {
    question: "간접흡연은 직접흡연보다 독성이 약하다.",
    answer: false,
    explanation: "간접흡연 시 노출되는 부류연(담배 끝에서 타오르는 연기)은 직접흡연 시 마시는 주류연보다 일부 유해 성분 농도가 더 높을 수 있습니다.",
    order: 3
  },
  {
    question: "금연 후 20분이 지나면 혈압과 맥박이 정상으로 돌아온다.",
    answer: true,
    explanation: "금연 직후부터 우리 몸은 회복을 시작하며, 20분만 지나도 혈압과 맥박이 정상 수치로 떨어지기 시작합니다.",
    order: 4
  },
  {
    question: "세계 금연의 날은 매년 5월 31일이다.",
    answer: true,
    explanation: "세계보건기구(WHO)는 담배 없는 환경을 만들기 위해 매년 5월 31일을 세계 금연의 날로 지정했습니다.",
    order: 5
  }
];

export const REGIONS = [
  "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", 
  "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", 
  "양구군", "인제군", "고성군", "양양군"
];
