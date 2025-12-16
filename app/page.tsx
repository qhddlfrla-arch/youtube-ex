"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Lock, CheckCircle, BookOpen, FileText, 
  Wand2, Film, Sparkles, Loader2 
} from "lucide-react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [personaText, setPersonaText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("실사 극대화");
  const [selectedVibe, setSelectedVibe] = useState("모던");
  const [scriptText, setScriptText] = useState("");
  const [imageCount, setImageCount] = useState(5);

  // === AI 실행 함수 ===
  const runGemini = async (prompt: string, targetSetter: (text: string) => void) => {
    if (!apiKey) {
      alert("1번 섹션에 API 키를 먼저 입력해주세요!");
      return;
    }

    try {
      setLoading(true);
      const cleanKey = apiKey.trim(); 
      const genAI = new GoogleGenerativeAI(cleanKey);
      
      // [중요] 가장 호환성이 좋은 1.5-flash-8b 모델로 설정했습니다.
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      targetSetter(text);
    } catch (error: any) {
      console.error("에러 발생:", error);
      // 에러 메시지를 더 구체적으로 보여주도록 수정했습니다.
      alert(`🚫 오류 발생!\n내용: ${error.message}\n\n팁: API 키가 youtube-ai 프로젝트의 것이 맞는지, 결제 계정이 연결되었는지 다시 확인해주세요.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-4 md:p-8 font-sans pb-32">
      {loading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <Loader2 size={60} className="text-blue-500 animate-spin mb-4" />
          <p className="text-2xl font-bold animate-pulse">AI가 응답을 생성 중입니다...</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4 mb-10 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            유튜브 AI 콘텐츠 생성기
          </h1>
          <p className="text-gray-400">API 키 하나로 페르소나와 영상 소스를 한 번에 만드세요.</p>
        </header>

        {/* 1. API 키 입력 */}
        <section className="border border-blue-500/30 bg-[#1a1d2d] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-blue-100 mb-4 flex items-center gap-2">
            <Lock size={20} className="text-blue-500" /> 1. API 키 설정
          </h2>
          <input
            type="password"
            placeholder="AIza... 로 시작하는 키를 입력하세요"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-[#0f111a] border border-blue-500/50 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-400 text-white"
          />
        </section>

        {/* 2. 페르소나 생성 */}
        <section className="border border-purple-500/30 bg-[#1a1d2d] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" /> 2. 페르소나 생성
          </h2>
          <textarea
            className="w-full bg-[#0f111a] border border-gray-700 rounded-xl p-4 h-32 mb-4 focus:border-purple-500 focus:outline-none"
            placeholder="캐릭터 설명을 입력하세요 (예: 20대 여행 유튜버)"
            value={personaText}
            onChange={(e) => setPersonaText(e.target.value)}
          />
          <button 
            onClick={() => runGemini(`${personaText}에 대한 구체적인 외모와 성격 페르소나를 작성해줘`, setPersonaText)}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition shadow-lg shadow-purple-900/20"
          >
            AI 페르소나 생성하기
          </button>
        </section>

        {/* 3. 영상 소스 생성 */}
        <section className="border border-green-500/30 bg-[#1a1d2d] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-green-100 mb-4 flex items-center gap-2">
            <Film size={20} className="text-green-500" /> 3. 영상 프롬프트 생성
          </h2>
          <textarea
            className="w-full bg-[#0f111a] border border-gray-700 rounded-xl p-4 h-40 mb-4 focus:border-green-500 focus:outline-none"
            placeholder="영상 대본을 입력하세요"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          />
          <button 
            onClick={() => runGemini(`${scriptText} 대본을 바탕으로 이미지 생성을 위한 영어 프롬프트 5개를 작성해줘`, setScriptText)}
            className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition shadow-lg shadow-green-900/20"
          >
            AI 장면 프롬프트 생성하기
          </button>
        </section>
      </div>
    </div>
  );
}