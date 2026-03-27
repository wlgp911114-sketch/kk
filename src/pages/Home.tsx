import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Trophy, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700]/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-sm font-bold mb-6 border border-[#FFD700]/20">
              5월 31일 세계 금연의 날 기념
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
              담배 없는 강원,<br />
              <span className="text-[#FFD700]">건강한 미래</span>를 위해
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              강원금연지원센터와 함께하는 세계 금연의 날 OX 퀴즈 이벤트!<br />
              금연 상식도 배우고 푸짐한 경품의 기회도 놓치지 마세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/quiz" className="accent-button w-full sm:w-auto flex items-center justify-center gap-2">
                이벤트 참여하기 <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="outline-button w-full sm:w-auto">
                금연 지원 서비스 안내
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#050505] border-y border-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8 text-[#FFD700]" />}
              title="OX 퀴즈 참여"
              description="금연에 관한 5가지 퀴즈를 풀고 나의 금연 상식을 확인해보세요."
            />
            <FeatureCard 
              icon={<Trophy className="w-8 h-8 text-[#FFD700]" />}
              title="푸짐한 경품"
              description="참여자 중 추첨을 통해 기프티콘 등 다양한 선물을 드립니다."
            />
            <FeatureCard 
              icon={<Heart className="w-8 h-8 text-[#FFD700]" />}
              title="금연 상담 지원"
              description="전문 상담사와 함께하는 맞춤형 금연 지원 서비스를 무료로 받아보세요."
            />
          </div>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="luxury-card flex flex-col lg:flex-row items-center gap-12 overflow-hidden p-0">
            <div className="flex-1 p-8 lg:p-16">
              <h2 className="text-4xl font-bold mb-6">강원금연지원센터는<br />여러분의 금연을 응원합니다.</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                혼자서는 힘든 금연, 전문가와 함께라면 가능합니다. 
                찾아가는 금연지원서비스, 금연캠프 등 다양한 프로그램을 통해 
                강원도민의 건강한 삶을 지원합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                  <span>국가 지원 무료 금연 상담</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                  <span>맞춤형 금연 보조제 지원</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                  <span>6개월 사후 관리 서비스</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full h-[400px] lg:h-full relative">
              <img 
                src="https://picsum.photos/seed/smoking/800/600" 
                alt="Anti-smoking campaign" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 lg:from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="luxury-card hover:border-[#FFD700]/50 transition-colors group">
      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
