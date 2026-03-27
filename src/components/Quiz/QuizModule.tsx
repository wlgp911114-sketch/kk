import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowRight, Trophy, MapPin, Phone, Calendar, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { QuizQuestion, Participant } from '../../types';
import { DEFAULT_QUIZ_QUESTIONS, REGIONS } from '../../constants';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const userSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다.'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)'),
  phone: z.string().regex(/^\d{3}-\d{3,4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다. (010-0000-0000)'),
  region: z.string().min(1, '지역을 선택해주세요.'),
});

type UserFormData = z.infer<typeof userSchema>;

export default function QuizModule() {
  const [step, setStep] = useState<'info' | 'quiz' | 'result'>('info');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'quiz_questions'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setQuestions(DEFAULT_QUIZ_QUESTIONS);
        } else {
          setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizQuestion)));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions(DEFAULT_QUIZ_QUESTIONS);
      }
    };
    fetchQuestions();
  }, []);

  const onInfoSubmit = (data: UserFormData) => {
    if (questions.length === 0) {
      toast.error('퀴즈 문항을 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }
    setUserData(data);
    setStep('quiz');
  };

  const handleAnswer = (answer: boolean) => {
    setAnswers([...answers, answer]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitResult(answers);
    }
  };

  const submitResult = async (finalAnswers: boolean[]) => {
    if (!userData || questions.length === 0) return;
    setLoading(true);
    
    let score = 0;
    finalAnswers.forEach((ans, idx) => {
      if (questions[idx] && ans === questions[idx].answer) score++;
    });

    const participant: Participant = {
      ...userData,
      score,
      answers: finalAnswers,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'participants'), participant);
      setStep('result');
    } catch (error) {
      console.error('Error submitting result:', error);
      toast.error('결과 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {step === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="luxury-card"
          >
            <h2 className="text-3xl font-bold mb-2 text-[#FFD700]">참여자 정보 입력</h2>
            <p className="text-gray-400 mb-8">이벤트 참여를 위해 정보를 입력해주세요.</p>
            
            <form onSubmit={handleSubmit(onInfoSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FFD700]" /> 이름
                </label>
                <input {...register('name')} className="input-field w-full" placeholder="홍길동" />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FFD700]" /> 생년월일
                </label>
                <input {...register('dob')} className="input-field w-full" placeholder="1990-01-01" />
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FFD700]" /> 핸드폰번호
                </label>
                <input {...register('phone')} className="input-field w-full" placeholder="010-1234-5678" />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FFD700]" /> 지역
                </label>
                <select {...register('region')} className="input-field w-full">
                  <option value="">지역 선택</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.region && <p className="text-red-500 text-xs">{errors.region.message}</p>}
              </div>

              <button type="submit" className="accent-button w-full flex items-center justify-center gap-2">
                퀴즈 시작하기 <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 'quiz' && currentQuestion && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="luxury-card min-h-[400px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-[#FFD700] font-bold">Q{currentIndex + 1}</span>
              <div className="flex-1 mx-4 h-2 bg-[#222] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#FFD700]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-gray-500 text-sm">{currentIndex + 1}/{questions.length}</span>
            </div>

            <div className="flex-1 flex flex-col justify-center text-center">
              <h3 className="text-2xl font-bold leading-relaxed mb-12">
                {currentQuestion.question}
              </h3>

              <AnimatePresence mode="wait">
                {!showExplanation ? (
                  <motion.div 
                    key="options"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center gap-8"
                  >
                    <button 
                      onClick={() => handleAnswer(true)}
                      className="quiz-option quiz-option-o"
                    >
                      O
                    </button>
                    <button 
                      onClick={() => handleAnswer(false)}
                      className="quiz-option quiz-option-x"
                    >
                      X
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="explanation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className={cn(
                      "inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold text-lg",
                      answers[currentIndex] === currentQuestion.answer 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "bg-red-500/20 text-red-400"
                    )}>
                      {answers[currentIndex] === currentQuestion.answer ? (
                        <><Check className="w-6 h-6" /> 정답입니다!</>
                      ) : (
                        <><X className="w-6 h-6" /> 오답입니다.</>
                      )}
                    </div>

                    <div className="bg-[#111] border border-[#222] p-6 rounded-2xl text-left">
                      <p className="text-[#FFD700] font-bold mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" /> 해설
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>

                    <button 
                      onClick={handleNext}
                      className="accent-button w-full flex items-center justify-center gap-2"
                    >
                      {currentIndex < questions.length - 1 ? '다음 문제' : '결과 확인하기'} <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-card text-center py-12"
          >
            <div className="w-24 h-24 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-[#FFD700]" />
            </div>
            <h2 className="text-4xl font-black mb-4">참여 완료!</h2>
            <p className="text-gray-400 mb-8">
              {userData?.name}님, 세계 금연의 날 이벤트에 참여해주셔서 감사합니다.<br />
              금연은 나 자신과 사랑하는 사람들을 위한 최고의 선물입니다.
            </p>
            
            <div className="bg-[#111] rounded-2xl p-6 mb-8 inline-block min-w-[200px]">
              <span className="text-gray-500 text-sm block mb-1">나의 점수</span>
              <span className="text-5xl font-black text-[#FFD700]">
                {answers.reduce((acc, curr, idx) => (questions[idx] && curr === questions[idx].answer) ? acc + 1 : acc, 0)}
                <span className="text-2xl text-gray-500 ml-1">/ {questions.length}</span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="accent-button"
              >
                홈으로 돌아가기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
