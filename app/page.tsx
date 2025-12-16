"use client";

import React, { useState } from "react";
import { 
  Lock, CheckCircle, Trash2, Key, DollarSign, BookOpen, FileText, 
  User, Image as ImageIcon, Upload, Wand2, Monitor, Smartphone, 
  Grid, Film, Settings, ChevronDown, Check, ScanFace, 
  ArrowRight, ArrowLeft, MoreHorizontal, Sparkles 
} from "lucide-react";

export default function Home() {
  // === State 관리 ===
  
  // 1. API 키 (파랑)
  const [apiKey, setApiKey] = useState("");
  const [saveKey, setSaveKey] = useState(true);

  // 2. 페르소나 (보라)
  const [personaText, setPersonaText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("실사 극대화");
  const [selectedVibe, setSelectedVibe] = useState("모던");
  const [customPrompt, setCustomPrompt] = useState(""); // 2-2 추가된 커스텀 프롬프트

  // 3. 영상 소스 (초록)
  const [scriptText, setScriptText] = useState("");
  const [imageCount, setImageCount] = useState(5);
  const [useSubtitle, setUseSubtitle] = useState(false);

  // 4. 구도 확장 (주황)
  const [selectedAngles, setSelectedAngles] = useState({
    front: true, right: true, left: true, back: true, full: true, closeup: true
  });
  const [expandRatio, setExpandRatio] = useState("16:9");

  // 토글 핸들러
  const toggleAngle = (key: keyof typeof selectedAngles) => {
    setSelectedAngles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-4 md:p-8 font-sans pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* === [Header] 타이틀 영역 === */}
        <header className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            유튜브 롱폼 이미지 생성기
          </h1>
          <p className="text-gray-400 text-lg">
            스크립트를 입력하고 일관된 캐릭터와 영상 소스 이미지를 생성하세요!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition">
              <BookOpen size={16} /> API 키 발급 가이드
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition">
              <FileText size={16} /> 사용법 가이드
            </button>
          </div>
        </header>

        {/* === [Section 1] API 키 입력 (파랑) === */}
        <section className="border border-blue-500/30 bg-[#1a1d2d] rounded-xl p-6 shadow-lg shadow-blue-900/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded">1</div>
            <h2 className="text-xl font-bold text-blue-100">API 키 입력</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="password"
              placeholder="API 키를 입력하세요 (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-[#0f111a] border border-blue-500/50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 text-white placeholder-gray-600 tracking-widest"
            />
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap">
                <CheckCircle size={18} /> 확인
              </button>
              <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap">
                🔑 발급 방법
              </button>
            </div>
          </div>

          <hr className="border-gray-700 my-5" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border rounded flex items-center justify-center transition ${saveKey ? 'bg-blue-600 border-blue-600' : 'border-gray-500'}`}>
                  {saveKey && <CheckCircle size={14} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={saveKey} onChange={() => setSaveKey(!saveKey)}/>
                <div className="text-sm">
                  <p className="font-bold text-gray-200">API 키 기억하기</p>
                  <p className="text-gray-500 text-xs">브라우저에 암호화 저장됨</p>
                </div>
              </label>
              <button className="text-red-400 text-sm hover:underline flex items-center gap-1">저장된 키 삭제</button>
            </div>

            <div className="bg-[#151824] p-4 rounded-lg border-l-4 border-yellow-500/50">
              <h3 className="text-yellow-500 font-bold flex items-center gap-2 mb-2 text-sm"><Lock size={16} /> 보안 안내</h3>
              <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                <li>API 키는 암호화되어 브라우저에만 저장되며, 외부 서버로 전송되지 않습니다</li>
                <li>공용 컴퓨터를 사용하는 경우 "기억하기"를 체크하지 마세요</li>
              </ul>
            </div>
            
            <div className="bg-[#151824] p-4 rounded-lg border-l-4 border-blue-500/50">
              <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-2 text-sm"><DollarSign size={16} /> API 비용 안내</h3>
              <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                <li>Gemini API 무료 등급에서 이미지 생성 기능 제공</li>
                <li>분당 요청 수만 지키면 <span className="text-blue-400 underline cursor-pointer">무료로 사용 가능</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* === [Section 2] 페르소나 생성 (보라) === */}
        <section className="border border-purple-500/30 bg-[#1a1d2d] rounded-xl p-6 shadow-lg shadow-purple-900/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded">2</div>
            <h2 className="text-xl font-bold text-purple-100">페르소나 생성</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6 pl-8">구체적인 인물 묘사를 입력하거나, 대본을 넣으면 등장인물들을 자동으로 분석하여 생성합니다.</p>

          <div className="bg-[#262136] border border-purple-500/20 p-4 rounded-lg mb-4">
            <p className="font-bold text-purple-300 text-sm mb-2">입력 예시:</p>
            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
              <li>인물 묘사: "20대 중반 여성, 긴 흑발, 밝은 미소, 캐주얼한 옷차림"</li>
              <li>대본 입력: 전체 스토리 대본을 넣으면 등장인물 자동 추출</li>
            </ul>
          </div>

          <textarea
            className="w-full bg-[#0f111a] border border-gray-700 rounded-lg p-4 h-32 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 mb-6"
            placeholder="인물 묘사나 대본을 입력하세요..."
            value={personaText}
            onChange={(e) => setPersonaText(e.target.value)}
          ></textarea>

          <div className="border border-purple-500/20 rounded-lg p-4 mb-6">
            <h3 className="flex items-center gap-2 font-bold text-purple-200 mb-4"><Wand2 size={18} /> 이미지 스타일 선택</h3>
            <div className="mb-4">
               <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">👤 인물 스타일</span>
                <button className="text-xs border border-gray-600 px-2 py-1 rounded hover:bg-gray-700">직접 입력</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['실사 극대화', '애니메이션', '동물', '웹툰'].map((style) => (
                  <button key={style} onClick={() => setSelectedStyle(style)} className={`py-2 text-sm rounded transition ${selectedStyle === style ? 'bg-purple-600 text-white font-bold' : 'bg-[#2a2d3d] text-gray-400 hover:bg-[#353849]'}`}>{style}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">🏙️ 배경/분위기 스타일</span>
                <button className="text-xs border border-gray-600 px-2 py-1 rounded hover:bg-gray-700">직접 입력</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['감성 멜로', '서부극', '공포 스릴러', '사이버펑크', '판타지', '미니멀', '빈티지', '모던'].map((vibe) => (
                  <button key={vibe} onClick={() => setSelectedVibe(vibe)} className={`py-2 text-sm rounded transition ${selectedVibe === vibe ? 'bg-purple-600 text-white font-bold' : 'bg-[#2a2d3d] text-gray-400 hover:bg-[#353849]'}`}>{vibe}</button>
                ))}
              </div>
            </div>
          </div>

          {/* 2-2 이미지: 사진 설정 & 참조 이미지 */}
           <div className="border border-purple-500/20 rounded-lg p-4 mb-6">
             <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={18} className="text-purple-300"/>
                <span className="font-bold text-purple-200">사진 설정</span>
             </div>
             <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">사진 구도</label>
                    <select className="w-full bg-[#0f111a] border border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-purple-500">
                        <option>정면 (기본)</option>
                        <option>측면</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">이미지 비율</label>
                    <select className="w-full bg-[#0f111a] border border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-purple-500">
                        <option>🖥️ 16:9 - 데스크톱 가로</option>
                        <option>📱 9:16 - 모바일 세로</option>
                    </select>
                </div>
             </div>
          </div>

          <div className="border border-purple-500/20 rounded-lg p-4 mb-6">
            <h3 className="flex items-center gap-2 font-bold text-purple-200 mb-2">🖼️ 스타일 참조 이미지 (선택사항)</h3>
            <p className="text-xs text-gray-400 mb-4">원하는 스타일의 사진을 업로드하면 해당 스타일을 참고하여 페르소나를 생성합니다.</p>
            <div className="border-2 border-dashed border-purple-500/30 bg-[#262136]/50 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-[#262136] transition group">
                <Upload className="text-gray-400 group-hover:text-purple-400 mb-2" size={24} />
                <span className="text-sm font-bold text-gray-300">참조 이미지 업로드</span>
                <span className="text-xs text-gray-500">클릭하여 이미지 선택 (JPG, PNG)</span>
            </div>
          </div>
          
          {/* 2-2 이미지: 커스텀 프롬프트 */}
          <div className="border border-purple-500/20 rounded-lg p-4 mb-6 bg-[#1a1d2d]">
             <div className="flex justify-between items-center mb-2">
                <h3 className="flex items-center gap-2 font-bold text-purple-200 text-sm">⚡ 커스텀 이미지 프롬프트 (선택사항)</h3>
                <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
                   🎯 내가 원하는 이미지 200% 뽑는 노하우
                </button>
             </div>
             <textarea
                className="w-full bg-[#0f111a] border border-gray-700 rounded-lg p-3 h-24 text-sm focus:border-purple-500 focus:outline-none text-white placeholder-gray-500"
                placeholder="고급 사용자용: AI에게 전달할 구체적인 이미지 프롬프트를 직접 입력하세요 (영어 권장)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
             ></textarea>
             <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                💡 이 필드는 고급 사용자를 위한 기능입니다. 비워두면 자동으로 최적화된 프롬프트가 생성됩니다.
             </p>
          </div>

          <button className="w-full py-4 bg-[#3a3f55] hover:bg-[#4a4f66] rounded-lg font-bold text-gray-300 transition hover:text-white flex items-center justify-center gap-2">
             페르소나 생성
          </button>
        </section>

        {/* === [Section 3] 영상 소스 생성 (초록) === */}
        <section className="border border-green-500/30 bg-[#1a1d2d] rounded-xl p-6 shadow-lg shadow-green-900/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded">3</div>
            <h2 className="text-xl font-bold text-green-100">영상 소스 생성</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6 pl-8">위에서 생성한 페르소나를 활용하여 영상 소스를 만듭니다.</p>

           <div className="bg-[#151f1a] border border-green-500/20 p-4 rounded-lg mb-4">
            <p className="font-bold text-green-300 text-sm mb-2">입력 방법:</p>
            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
              <li>전체 대본: 완전한 스크립트나 스토리를 입력</li>
              <li>시퀀스별 장면: 각 줄에 하나씩 장면 설명을 입력</li>
            </ul>
          </div>

          <div className="border border-green-500/20 rounded-lg p-4 mb-6">
             <h3 className="flex items-center gap-2 font-bold text-green-200 mb-2">🎨 일관성 유지 (선택사항)</h3>
             <p className="text-xs text-gray-400 mb-4">참조 이미지를 업로드하면 해당 이미지의 스타일과 일관성을 유지하며 생성합니다.</p>
             <div className="border-2 border-dashed border-green-500/30 bg-[#1f2937]/50 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1f2937] transition group">
                <Upload className="text-gray-400 group-hover:text-green-400 mb-2" size={24} />
                <span className="text-sm font-bold text-gray-300">참조 이미지 업로드</span>
             </div>
          </div>

          <textarea
            className="w-full bg-[#0f111a] border border-gray-700 rounded-lg p-4 h-40 focus:border-green-500 focus:outline-none text-white placeholder-gray-600 mb-6"
            placeholder="대본 전체를 넣으세요. 또는 시퀀스별 원하는 장면을 넣으세요."
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          ></textarea>

          <div className="bg-[#151824] border border-green-500/20 rounded-lg p-4 mb-6">
             <div className="flex items-center gap-2 mb-4 font-bold text-green-100 text-sm">
                <Settings size={16} /> 생성 옵션 설정
             </div>
             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                   <label className="text-xs text-gray-400 block mb-2">🗨️ 자막 설정</label>
                   <select className="w-full bg-[#0f111a] border border-gray-600 rounded px-3 py-2 text-sm outline-none text-gray-300">
                      <option>🚫 자막 OFF (기본값)</option>
                      <option>✅ 자막 ON</option>
                   </select>
                </div>
                <div className="flex-1">
                   <div className="flex justify-between mb-2">
                     <label className="text-xs text-gray-400">생성할 이미지 수: <span className="text-green-400 font-bold">{imageCount}</span></label>
                   </div>
                   <input type="range" min="1" max="20" value={imageCount} onChange={(e) => setImageCount(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                </div>
             </div>
          </div>

          <button className="bg-[#3a3f55] hover:bg-[#3f4560] w-full py-4 rounded-lg font-bold text-gray-300 flex items-center justify-center gap-2">영상 소스 생성</button>
        </section>

        {/* === [Section 4] 사진 구도 확장 (주황) === */}
        <section className="border border-orange-500/30 bg-[#1a1d2d] rounded-xl p-6 shadow-lg shadow-orange-900/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-orange-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded">4</div>
            <h2 className="text-xl font-bold text-orange-100">사진 구도 확장 (최대 6가지 앵글)</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6 pl-8">원하는 앵글을 선택하여 다양한 구도의 이미지를 생성합니다.</p>

          <div className="bg-[#1c2236] border border-blue-500/30 p-4 rounded-lg mb-6">
             <h3 className="text-blue-300 font-bold text-sm mb-2 flex items-center gap-2">🎬 작동 방식</h3>
             <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>1단계: Gemini Vision AI가 업로드한 이미지를 상세히 분석</li>
                <li>2단계: 분석 결과를 바탕으로 선택한 앵글별로 이미지 재생성</li>
                <li>목표: 동일한 피사체를 다양한 카메라 각도에서 표현</li>
             </ul>
          </div>

          <div className="border border-orange-500/20 rounded-lg p-4 mb-6">
             <h3 className="flex items-center gap-2 font-bold text-orange-200 mb-2">📷 분석할 원본 이미지 업로드</h3>
             <div className="border-2 border-dashed border-orange-500/30 bg-[#2d2620]/50 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-[#2d2620] transition group">
                <Film className="text-gray-400 group-hover:text-orange-400 mb-2" size={32} />
                <span className="text-lg font-bold text-gray-300">원본 이미지 업로드</span>
                <span className="text-sm text-gray-500">클릭하여 이미지를 선택하세요</span>
             </div>
          </div>

          <div className="border border-orange-500/20 rounded-lg p-4 mb-6">
             <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-green-500"/>
                <span className="text-sm text-gray-300 font-bold">생성할 앵글 선택 (6/6)</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'front', label: '정면', icon: <User size={16}/> },
                  { id: 'right', label: '오른쪽 측면', sub: '(왼쪽을 바라봄)', icon: <ArrowRight size={16}/> },
                  { id: 'left', label: '왼쪽 측면', sub: '(오른쪽을 바라봄)', icon: <ArrowLeft size={16}/> },
                  { id: 'back', label: '뒷모습', icon: <MoreHorizontal size={16}/> },
                  { id: 'full', label: '전신', icon: <ScanFace size={16}/> },
                  { id: 'closeup', label: '얼굴 근접', icon: <ScanFace size={16}/> },
                ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => toggleAngle(item.id as any)}
                      className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition ${selectedAngles[item.id as keyof typeof selectedAngles] ? 'bg-orange-900/20 border-orange-500 text-orange-200' : 'bg-[#151824] border-gray-700 text-gray-500'}`}
                    >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedAngles[item.id as keyof typeof selectedAngles] ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>
                           {selectedAngles[item.id as keyof typeof selectedAngles] && <Check size={12} className="text-white"/>}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm flex items-center gap-2">{item.icon} {item.label}</span>
                           {item.sub && <span className="text-[10px] opacity-70">{item.sub}</span>}
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* 4-2 이미지 비율 선택 */}
          <div className="mb-6">
              <h3 className="text-orange-200 font-bold text-sm mb-2 flex items-center gap-2">📐 이미지 비율 선택</h3>
              <p className="text-xs text-gray-500 mb-3">생성할 이미지의 비율을 선택하세요. 용도에 맞는 비율을 선택하면 더 효과적입니다.</p>
              <div className="grid grid-cols-3 gap-3">
                  {[
                      { id: '9:16', label: '9:16', desc: '모바일 세로', sub: '세로형 (인스타그램 스토리, 유튜브 쇼츠)', icon: <Smartphone size={18}/> },
                      { id: '16:9', label: '16:9', desc: '데스크톱 가로', sub: '가로형 (유튜브 일반, 영화)', icon: <Monitor size={18}/> },
                      { id: '1:1', label: '1:1', desc: '정사각형', sub: '정사각형 (인스타그램 피드)', icon: <Grid size={18}/> },
                  ].map((ratio) => (
                      <div 
                        key={ratio.id} 
                        onClick={() => setExpandRatio(ratio.id)}
                        className={`cursor-pointer rounded-lg p-4 border relative transition hover:bg-[#252836] ${expandRatio === ratio.id ? 'border-blue-500 bg-[#1c2236]' : 'border-gray-700 bg-[#151824]'}`}
                      >
                          {expandRatio === ratio.id && <div className="absolute top-2 right-2 text-blue-500"><Check size={16}/></div>}
                          <div className={`mb-2 ${expandRatio === ratio.id ? 'text-blue-400' : 'text-gray-500'}`}>{ratio.icon}</div>
                          <div className={`font-bold text-sm ${expandRatio === ratio.id ? 'text-white' : 'text-gray-400'}`}>{ratio.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{ratio.desc}</div>
                          <div className="text-[10px] text-gray-600 mt-1">{ratio.sub}</div>
                      </div>
                  ))}
              </div>
          </div>

          <button className="w-full py-4 bg-[#3a3f55] rounded-lg font-bold text-gray-400 flex items-center justify-center gap-2 cursor-not-allowed">
             <Film size={18} /> 선택한 6가지 앵글 생성하기
          </button>
        </section>

      </div>
    </div>
  );
}