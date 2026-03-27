import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { Participant, QuizQuestion, CMSContent } from '../../types';
import { formatDate, cn } from '../../lib/utils';
import { Users, FileText, Settings as SettingsIcon, LogOut, Trash2, Edit, Plus, ChevronRight, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'participants' | 'quiz' | 'cms'>('participants');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [cmsContent, setCmsContent] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Check if admin (simple check for now, rules handle security)
        if (u.email === 'wlgp911114@gmail.com') {
          fetchData();
        } else {
          toast.error('관리자 권한이 없습니다.');
          signOut(auth);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pSnap = await getDocs(query(collection(db, 'participants'), orderBy('createdAt', 'desc')));
      const qSnap = await getDocs(query(collection(db, 'quiz_questions'), orderBy('order', 'asc')));
      const cSnap = await getDocs(collection(db, 'cms_content'));
      
      setParticipants(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Participant)));
      setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() } as QuizQuestion)));
      setCmsContent(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as CMSContent)));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인에 실패했습니다.');
    }
  };

  const logout = () => signOut(auth);

  const deleteParticipant = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'participants', id));
      setParticipants(participants.filter(p => p.id !== id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const exportToCsv = () => {
    const headers = ['이름', '생년월일', '전화번호', '지역', '점수', '참여일시'];
    const rows = participants.map(p => [
      p.name, p.dob, p.phone, p.region, p.score, formatDate(p.createdAt)
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `participants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="luxury-card max-w-md w-full text-center">
          <ShieldIcon className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
          <p className="text-gray-400 mb-8">관리자 계정으로 로그인하여 데이터를 관리하세요.</p>
          <button onClick={login} className="accent-button w-full">
            구글로 로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('participants')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === 'participants' ? "bg-[#FFD700] text-black font-bold" : "text-gray-400 hover:bg-[#111]"
            )}
          >
            <Users className="w-5 h-5" /> 참여자 관리
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === 'quiz' ? "bg-[#FFD700] text-black font-bold" : "text-gray-400 hover:bg-[#111]"
            )}
          >
            <FileText className="w-5 h-5" /> 퀴즈 관리
          </button>
          <button 
            onClick={() => setActiveTab('cms')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === 'cms' ? "bg-[#FFD700] text-black font-bold" : "text-gray-400 hover:bg-[#111]"
            )}
          >
            <SettingsIcon className="w-5 h-5" /> 콘텐츠 관리
          </button>
          <div className="pt-8">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all">
              <LogOut className="w-5 h-5" /> 로그아웃
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'participants' && (
            <div className="luxury-card overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">참여자 목록 ({participants.length})</h2>
                <button onClick={exportToCsv} className="outline-button py-2 px-4 flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> CSV 내보내기
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#222] text-gray-500 text-sm">
                      <th className="pb-4 font-medium">이름</th>
                      <th className="pb-4 font-medium">생년월일</th>
                      <th className="pb-4 font-medium">연락처</th>
                      <th className="pb-4 font-medium">지역</th>
                      <th className="pb-4 font-medium">점수</th>
                      <th className="pb-4 font-medium">참여일시</th>
                      <th className="pb-4 font-medium">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {participants.map(p => (
                      <tr key={p.id} className="text-sm hover:bg-[#111] transition-colors">
                        <td className="py-4 font-medium">{p.name}</td>
                        <td className="py-4 text-gray-400">{p.dob}</td>
                        <td className="py-4 text-gray-400">{p.phone}</td>
                        <td className="py-4 text-gray-400">{p.region}</td>
                        <td className="py-4">
                          <span className="bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded font-bold">
                            {p.score}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{formatDate(p.createdAt)}</td>
                        <td className="py-4">
                          <button onClick={() => deleteParticipant(p.id!)} className="text-gray-600 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {participants.length === 0 && (
                  <div className="py-20 text-center text-gray-600">참여자가 없습니다.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="luxury-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">퀴즈 관리</h2>
                <button className="accent-button py-2 px-4 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> 문제 추가
                </button>
              </div>
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-[#111] border border-[#222] p-4 rounded-xl flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#FFD700] font-bold">Q{idx + 1}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded font-bold", q.answer ? "bg-blue-500/20 text-blue-500" : "bg-red-500/20 text-red-500")}>
                          {q.answer ? 'O' : 'X'}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{q.question}</p>
                      <p className="text-xs text-gray-500">{q.explanation}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-white"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="space-y-8">
              <div className="luxury-card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">콘텐츠 관리 (CMS)</h2>
                  <button className="accent-button py-2 px-4 text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> 새 포스트
                  </button>
                </div>
                <div className="space-y-4">
                  {cmsContent.length === 0 ? (
                    <div className="py-12 text-center text-gray-600">등록된 콘텐츠가 없습니다.</div>
                  ) : (
                    cmsContent.map(content => (
                      <div key={content.id} className="bg-[#111] border border-[#222] p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{content.title}</h3>
                          <p className="text-xs text-gray-500">{content.section} | {formatDate(content.updatedAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-500 hover:text-white"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="luxury-card">
                <h2 className="text-xl font-bold mb-6">사이트 설정 (커스터마이징)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">메인 포인트 컬러</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#FFD700" className="w-12 h-12 rounded bg-transparent border border-[#333]" />
                      <input type="text" defaultValue="#FFD700" className="input-field flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">폰트 스타일</label>
                    <select className="input-field w-full">
                      <option>Inter (Sans-serif)</option>
                      <option>Roboto</option>
                      <option>Noto Sans KR</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400">메인 배너 이미지 URL</label>
                    <input type="text" placeholder="https://..." className="input-field w-full" />
                  </div>
                </div>
                <div className="mt-8">
                  <button className="accent-button w-full md:w-auto">설정 저장하기</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShieldIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
