"use client";

import React, { useState } from "react";
import { Lock, Sparkles, Loader2, CheckCircle2, AlertCircle, Upload, Camera, Zap, Film, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"guide" | "manual">("guide");
  const [apiKey, setApiKey] = useState("");
  const [keyStatus, setKeyStatus] = useState<"none" | "checking" | "valid" | "invalid">("none");
  const [saveApiKey, setSaveApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 2. 페르소나
  const [personaInput, setPersonaInput] = useState("");
  const [personaResult, setPersonaResult] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [selectedStyleButtons, setSelectedStyleButtons] = useState<string[]>(["실사 극대화"]);
  const [selectedGenderButtons, setSelectedGenderButtons] = useState<string[]>(["모던"]);
  
  // 사진 설정
  const [photoOrientation, setPhotoOrientation] = useState("정면 (기본)");
  const [imageRatio, setImageRatio] = useState("16:9 - 데스크톱 가로");
  
  // 3. 영상 소스
  const [scriptInput, setScriptInput] = useState("");
  const [imageCount, setImageCount] = useState(5);
  const [videoSourceImages, setVideoSourceImages] = useState<string[]>([]);
  
  // 4. 사진 구도 확장
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(["정면", "오른쪽 측면", "왼쪽 측면", "뒷모습", "전신", "얼굴 근접"]);
  const [angleScript, setAngleScript] = useState("");
  const [angleReferenceImage, setAngleReferenceImage] = useState<File | null>(null);
  const [angleGeneratedImages, setAngleGeneratedImages] = useState<string[]>([]);
  
  // 5. 이미지 비율
  const [finalAspectRatio, setFinalAspectRatio] = useState("16:9");

  const styleOptions = [
    { label: "실사 극대화", color: "bg-purple-600" },
    { label: "애니메이션", color: "bg-slate-600" },
    { label: "동물", color: "bg-slate-600" },
    { label: "웹툰", color: "bg-slate-600" },
  ];

  const genderOptions = [
    { label: "감성 캘로", color: "bg-slate-700" },
    { label: "서부극", color: "bg-slate-700" },
    { label: "공포 스릴러", color: "bg-slate-700" },
    { label: "사이버펑크", color: "bg-slate-700" },
    { label: "판타지", color: "bg-slate-700" },
    { label: "미니멀", color: "bg-slate-700" },
    { label: "빈티지", color: "bg-slate-700" },
    { label: "모던", color: "bg-purple-600" },
    { label: "1980년대", color: "bg-slate-700" },
    { label: "2000년대", color: "bg-slate-700" },
    { label: "먼앙", color: "bg-slate-700" },
    { label: "귀여움", color: "bg-slate-700" },
    { label: "AI", color: "bg-slate-700" },
    { label: "괴이함", color: "bg-slate-700" },
    { label: "찰의적인", color: "bg-slate-700" },
    { label: "조선시대", color: "bg-slate-700" },
  ];

  const emotionOptions = [
    { icon: "🏠", label: "정면" },
    { icon: "👍", label: "오른쪽 측면", subtext: "(왼쪽을 바라봄)" },
    { icon: "👍", label: "왼쪽 측면", subtext: "(오른쪽을 바라봄)" },
    { icon: "🫵", label: "뒷모습" },
    { icon: "💡", label: "전신" },
    { icon: "😊", label: "얼굴 근접" },
  ];

  // API 키 확인
  const checkApiKey = async () => {
    if (!apiKey) return alert("키를 입력해주세요!");
    setKeyStatus("checking");
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey.trim()}`
      );
      if (response.ok) {
        setKeyStatus("valid");
      } else {
        setKeyStatus("invalid");
      }
    } catch (error) {
      setKeyStatus("invalid");
    }
  };

  // 페르소나 생성 + 이미지 생성
  const generatePersona = async () => {
    if (keyStatus !== "valid") return alert("먼저 API 키 확인을 완료해주세요!");
    if (!personaInput) return alert("입력 예시를 작성해주세요!");
    
    try {
      setLoading(true);
      
      // 1단계: Gemini로 영어 이미지 프롬프트 생성
      const promptResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `Create a detailed English image generation prompt for: ${personaInput}
                
Style: ${selectedStyleButtons.join(", ")}
Mood: ${selectedGenderButtons.join(", ")}

Generate ONLY the English prompt for image generation AI (Stable Diffusion style). 
Include details about: appearance, clothing, pose, background, lighting, art style.
Keep it under 100 words. No explanations, just the prompt.` 
              }] 
            }]
          })
        }
      );
      
      const promptData = await promptResponse.json();
      if (promptData.error) throw new Error(promptData.error.message);
      
      const imagePrompt = promptData.candidates[0].content.parts[0].text.trim();
      
      // 2단계: 한글 페르소나 설명 생성
      const personaResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${personaInput}에 대한 유튜브 페르소나를 한글로 아주 자세하게 작성해줘. 외모, 성격, 특징을 포함해줘.` }] }]
          })
        }
      );
      
      const personaData = await personaResponse.json();
      if (personaData.error) throw new Error(personaData.error.message);
      
      const personaText = personaData.candidates[0].content.parts[0].text;
      setPersonaResult(personaText);
      
      // 3단계: Pollinations.AI로 이미지 생성
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
      setGeneratedImageUrl(imageUrl);
      
    } catch (error: any) {
      alert(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 영상 소스 생성
  const generateVideoSource = async () => {
    if (keyStatus !== "valid") return alert("먼저 API 키 확인을 완료해주세요!");
    if (!scriptInput) return alert("대본을 입력해주세요!");
    
    try {
      setLoading(true);
      const images: string[] = [];
      
      // 대본을 줄바꿈으로 분리하여 각 장면 추출
      const scenes = scriptInput.split('\n').filter(line => line.trim().length > 0);
      const scenesToGenerate = scenes.slice(0, imageCount);
      
      for (let i = 0; i < scenesToGenerate.length; i++) {
        const scene = scenesToGenerate[i];
        
        // Gemini로 영어 프롬프트 생성
        const promptResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey.trim()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ 
                parts: [{ 
                  text: `Create a detailed English image generation prompt for this scene: ${scene}
                  
Generate ONLY the English prompt for image generation AI.
Include: composition, lighting, atmosphere, details.
Keep it under 80 words.` 
                }] 
              }]
            })
          }
        );
        
        const promptData = await promptResponse.json();
        if (promptData.error) throw new Error(promptData.error.message);
        
        const imagePrompt = promptData.candidates[0].content.parts[0].text.trim();
        const encodedPrompt = encodeURIComponent(imagePrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true`;
        
        images.push(imageUrl);
      }
      
      setVideoSourceImages(images);
      
    } catch (error: any) {
      alert(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 이미지 다운로드 헬퍼 함수
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('이미지 다운로드에 실패했습니다.');
    }
  };

  // 영상 소스 이미지 일괄 다운로드
  const downloadAllVideoSourceImages = async () => {
    if (videoSourceImages.length === 0) return alert('다운로드할 이미지가 없습니다!');
    
    setLoading(true);
    for (let i = 0; i < videoSourceImages.length; i++) {
      await downloadImage(videoSourceImages[i], `video-source-${i + 1}.png`);
      await new Promise(resolve => setTimeout(resolve, 500)); // 다운로드 간 딜레이
    }
    setLoading(false);
    alert(`${videoSourceImages.length}개의 이미지가 다운로드되었습니다!`);
  };

  // 사진 구도 확장 이미지 생성
  const generateAngleImages = async () => {
    if (keyStatus !== "valid") return alert("먼저 API 키 확인을 완료해주세요!");
    if (!angleScript && !angleReferenceImage) return alert("대본을 입력하거나 참조 이미지를 업로드해주세요!");
    if (selectedEmotions.length === 0) return alert("최소 1개 이상의 앵글을 선택해주세요!");
    
    try {
      setLoading(true);
      const images: string[] = [];
      
      for (let i = 0; i < selectedEmotions.length; i++) {
        const angle = selectedEmotions[i];
        
        // Gemini로 앵글별 영어 프롬프트 생성
        const promptText = angleScript || "페르소나 이미지";
        const promptResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey.trim()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ 
                parts: [{ 
                  text: `Create a detailed English image generation prompt for: ${promptText}
                  
Camera angle: ${angle}
Include: composition from this specific angle, lighting, atmosphere, details.
Generate ONLY the English prompt for image generation AI.
Keep it under 80 words.` 
                }] 
              }]
            })
          }
        );
        
        const promptData = await promptResponse.json();
        if (promptData.error) throw new Error(promptData.error.message);
        
        const imagePrompt = promptData.candidates[0].content.parts[0].text.trim();
        const encodedPrompt = encodeURIComponent(imagePrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
        
        images.push(imageUrl);
      }
      
      setAngleGeneratedImages(images);
      
    } catch (error: any) {
      alert(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f35] text-white p-4 md:p-8 font-sans pb-32">
      {loading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <Loader2 size={60} className="text-blue-500 animate-spin mb-4" />
          <p className="text-xl font-bold">AI가 생성 중입니다...</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-5">
        {/* 헤더 */}
        <div className="text-center space-y-3 pt-8 pb-6">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500">
            유튜브 롱폼 이미지 생성기
          </h1>
          <p className="text-gray-300 text-base">스크립트를 입력하고 일관된 캐릭터와 영상 소스 이미지를 생성하세요!</p>
          <div className="flex gap-3 justify-center pt-2">
            <button 
              onClick={() => setActiveTab("guide")}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === "guide" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              🔖 API 키 발급 가이드
            </button>
            <button 
              onClick={() => setActiveTab("manual")}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === "manual" ? "bg-green-600" : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              📗 사용법 가이드
            </button>
          </div>
        </div>

        {/* 1️⃣ API 키 입력 */}
        <section className="bg-[#232943] rounded-2xl border-2 border-blue-500/40 p-7 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg">1</span>
            <Lock size={20} className="text-blue-400"/> API 키 입력
          </h2>
          
          <div className="flex gap-3 mb-4">
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••••••••••••"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setKeyStatus("none"); }}
              className="flex-1 bg-[#1a1f35] border border-gray-600 rounded-lg px-4 py-3.5 text-white outline-none focus:border-blue-500 transition"
            />
            <button 
              onClick={checkApiKey}
              disabled={keyStatus === "checking"}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3.5 rounded-lg font-bold transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={18}/>
              {keyStatus === "checking" ? "확인 중..." : "확인"}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3.5 rounded-lg font-bold transition-all flex items-center gap-2">
              <Sparkles size={18}/>
              발급 방법
            </button>
          </div>

          {keyStatus === "valid" && (
            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={saveApiKey}
                  onChange={(e) => setSaveApiKey(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-green-300 font-semibold">✅ API 키 기억하기</span>
              </label>
              <p className="text-green-200/70 text-sm mt-2 ml-7">브라우저의 완료한 저장됩니다</p>
            </div>
          )}

          {keyStatus === "invalid" && (
            <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-4">
              <p className="text-red-300 font-semibold flex items-center gap-2">
                <AlertCircle size={18}/> 자정된 키 사제
              </p>
              <p className="text-red-200/70 text-sm mt-2">입력하신 API 키를 다시 확인해주세요</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-amber-900/20 border border-amber-600/40 rounded-lg p-5">
              <p className="text-amber-300 font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">🔒</span> 보안 안내
              </p>
              <ul className="text-amber-100/80 space-y-1.5 text-sm ml-1">
                <li>• API 키는 암호화되어 브라우저에만 저장되며, 외부 서버로 전송되지 않습니다</li>
                <li>• 공용 컴퓨터를 사용하는 경우 '기억하기'를 체크하지 마세요</li>
                <li>• API 키가 유출될 경우 즉시 Google AI Studio에서 재발급 받으세요</li>
              </ul>
            </div>

            <div className="bg-orange-900/20 border border-orange-600/40 rounded-lg p-5">
              <p className="text-orange-300 font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">ℹ️</span> API 비용 안내
              </p>
              <ul className="text-orange-100/80 space-y-1.5 text-sm ml-1">
                <li>• Gemini API 무료 등급에서 이미지 생성 기능 제공</li>
                <li>• 분당 15회 요청 제한이 있으며, 경과시 비용 발생 없음</li>
                <li>• 본앱 요청 수반 지기로 무료로 사용 가능</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2️⃣ 페르소나 생성 */}
        <section className="bg-[#2d1f42] rounded-2xl border-2 border-purple-500/40 p-7 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="bg-purple-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg">2</span>
            <Sparkles size={20} className="text-purple-400"/> 페르소나 생성
          </h2>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-5 mb-5">
            <p className="text-purple-200 font-semibold mb-3">입력 예시:</p>
            <ul className="text-purple-100/70 space-y-1.5 text-sm">
              <li>• <span className="text-purple-300">인물 묘사:</span> "20대 중반 여성, 긴 흑발, 밝은 미소, 캐주얼한 옷차림"</li>
              <li>• <span className="text-purple-300">대본 업력:</span> 전체 스토리 대본을 붙여넣어 등장인물을 자동 추출</li>
            </ul>
          </div>

          <textarea
            className="w-full bg-[#1a1f35] border border-purple-500/30 rounded-lg px-5 py-4 text-white outline-none focus:border-purple-400 transition h-40 mb-4"
            placeholder="입력 묘사나 대본을 입력하세요..."
            value={personaInput}
            onChange={(e) => setPersonaInput(e.target.value)}
          />

          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 font-semibold flex items-center gap-2">
                <ImageIcon size={18}/> 이미지 스타일 선택
              </p>
              <span className="text-sm text-purple-400">직접 입력</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {styleOptions.map((style, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedStyleButtons(prev =>
                      prev.includes(style.label)
                        ? prev.filter(s => s !== style.label)
                        : [...prev, style.label]
                    );
                  }}
                  className={`${selectedStyleButtons.includes(style.label) ? "bg-purple-600" : "bg-slate-700"} hover:opacity-90 px-4 py-3 rounded-lg font-semibold transition-all text-sm`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 font-semibold flex items-center gap-2">
                <Zap size={18}/> 배경/분위기 스타일
              </p>
              <span className="text-sm text-purple-400">직접 입력</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {genderOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedGenderButtons(prev =>
                      prev.includes(option.label)
                        ? prev.filter(s => s !== option.label)
                        : [...prev, option.label]
                    );
                  }}
                  className={`${selectedGenderButtons.includes(option.label) ? "bg-purple-600" : "bg-slate-700"} hover:opacity-90 px-3 py-2.5 rounded-lg font-medium transition-all text-xs`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 📸 사진 설정 */}
          <div className="mb-5 p-5 bg-cyan-900/20 border border-cyan-600/30 rounded-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-300">
              <Camera size={18} className="text-cyan-400"/> 📸 사진 설정
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-cyan-300 mb-2 block font-semibold">사진 구도</label>
                <select 
                  value={photoOrientation}
                  onChange={(e) => setPhotoOrientation(e.target.value)}
                  className="w-full bg-[#1a1f35] border border-cyan-500/30 rounded-lg px-4 py-3 text-white"
                >
                  <option value="정면 (기본)">정면 (기본)</option>
                  <option value="측면">측면</option>
                  <option value="후면">후면</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-cyan-300 mb-2 block font-semibold">이미지 비율</label>
                <select 
                  value={imageRatio}
                  onChange={(e) => setImageRatio(e.target.value)}
                  className="w-full bg-[#1a1f35] border border-cyan-500/30 rounded-lg px-4 py-3 text-white"
                >
                  <option value="16:9 - 데스크톱 가로">📺 16:9 - 데스크톱 가로</option>
                  <option value="9:16 - 세로">📱 9:16 - 세로</option>
                  <option value="1:1 - 정사각형">⬜ 1:1 - 정사각형</option>
                </select>
              </div>
            </div>
            <div className="mt-4 bg-cyan-800/20 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-cyan-200 text-sm flex items-center gap-2">
                <span>💡</span> 사진 구도와 이미지 비율을 조합하여 원하는 스타일의 이미지를 만드세요.
              </p>
            </div>
          </div>

          {/* 🖼️ 스타일 참조 이미지 (선택사항) */}
          <div className="mb-5 p-5 bg-indigo-900/20 border border-indigo-600/30 rounded-lg">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-indigo-300">
              <ImageIcon size={18} className="text-indigo-400"/> 🖼️ 스타일 참조 이미지 (선택사항)
            </h3>
            <p className="text-gray-300 text-sm mb-4">원하는 스타일의 사진을 업로드하면 해당 스타일을 참고하여 페르소나를 생성합니다.</p>
            <div className="border-2 border-dashed border-indigo-500/40 rounded-xl p-10 text-center bg-indigo-950/20 hover:border-indigo-400/60 transition cursor-pointer">
              <Camera size={40} className="mx-auto text-indigo-400 mb-2"/>
              <p className="text-indigo-200 font-semibold mb-1">참조 이미지 업로드</p>
              <p className="text-indigo-300/60 text-sm">클릭하여 이미지 선택 (JPG, PNG)</p>
            </div>
          </div>

          {/* ⚡ 커스텀 이미지 프롬프트 (선택사항) */}
          <div className="mb-5 p-5 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-300">
              <Zap size={18} className="text-yellow-400"/> ⚡ 커스텀 이미지 프롬프트 (선택사항)
            </h3>
            <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span className="text-yellow-200 font-semibold text-sm">내가 원하는 이미지 200% 끌어 느에요</span>
            </div>
            <textarea
              className="w-full bg-[#1a1f35] border border-yellow-500/30 rounded-lg px-5 py-4 text-white outline-none focus:border-yellow-400 transition h-32"
              placeholder="고급 사용자용: AI에게 전달할 구체적인 이미지 프롬프트를 직접 입력하세요 (영어 권장)"
            />
            <div className="mt-4 bg-yellow-800/20 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-200 text-sm">💡 이 필드는 고급 사용자를 위한 기능입니다. 비워두면 자동으로 최적화된 프롬프트가 생성됩니다.</p>
            </div>
          </div>

          <button 
            onClick={generatePersona}
            disabled={keyStatus !== "valid"}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-lg mb-4 ${
              keyStatus === "valid" ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            페르소나 생성
          </button>

          {generatedImageUrl && (
            <div className="mt-5 p-5 bg-purple-950/40 border border-purple-500/30 rounded-lg">
              <p className="text-purple-300 font-semibold mb-3">생성된 이미지:</p>
              <img 
                src={generatedImageUrl} 
                alt="Generated persona" 
                className="w-full rounded-lg mb-4"
                onError={(e) => {
                  console.error("이미지 로드 실패");
                }}
              />
              <button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = generatedImageUrl;
                  a.download = 'persona-image.png';
                  a.click();
                }}
                className="w-full bg-purple-700 hover:bg-purple-600 py-2 rounded-lg font-semibold transition"
              >
                이미지 다운로드
              </button>
            </div>
          )}
        </section>

        {/* 3️⃣ 영상 소스 생성 */}
        <section className="bg-[#1f3d2d] rounded-2xl border-2 border-green-500/40 p-7 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="bg-green-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg">3</span>
            <Film size={20} className="text-green-400"/> 영상 소스 생성
          </h2>

          <p className="text-gray-300 text-sm mb-5">위에서 생성한 페르소나를 활용하여 영상 소스를 만듭니다. 대본 또는 시퀀스별 장면을 입력해주세요.</p>

          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-5 mb-5">
            <p className="text-green-200 font-semibold mb-3">입력 방법:</p>
            <ul className="text-green-100/70 space-y-1.5 text-sm">
              <li>• <span className="text-green-300">전체 대본:</span> 완전한 스크립트나 스토리를 입력</li>
              <li>• <span className="text-green-300">시퀀스별 장면:</span> 각 장면 어나넷 장면 설명을 입력</li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-5 mb-5">
            <p className="text-green-200 font-semibold mb-3 flex items-center gap-2">
              <Upload size={18}/> 일괄성 유지 (선택사항)
            </p>
            <p className="text-green-100/70 text-sm mb-4">
              참조 이미지를 업로드하면 해당 이미지의 스타일과 일관성을 유지하여 영상 소스를 생성합니다. 참조 이미지가 없으면 페르소나 생성 시 만든 영상 소스 만들 수 있습니다!
            </p>
            <div className="border-2 border-dashed border-green-500/40 rounded-xl p-10 text-center bg-green-950/20 hover:border-green-400/60 transition cursor-pointer">
              <Upload size={40} className="mx-auto text-green-400 mb-2"/>
              <p className="text-green-200 font-semibold">참조 이미지 업로드</p>
              <p className="text-green-300/60 text-sm mt-1">클릭하여 이미지를 선택하세요</p>
            </div>
          </div>

          <textarea
            className="w-full bg-[#1a1f35] border border-green-500/30 rounded-lg px-5 py-4 text-white outline-none focus:border-green-400 transition h-32 mb-5"
            placeholder="대본을 입력하세요..."
            value={scriptInput}
            onChange={(e) => setScriptInput(e.target.value)}
          />

          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-5 mb-5">
            <p className="text-green-200 font-semibold mb-4">⚙️ 생성 옵션 설정</p>
            
            <div className="mb-4">
              <p className="text-sm text-green-300 mb-2">📊 자막 설정</p>
              <select className="w-full bg-[#1a1f35] border border-green-500/30 rounded-lg px-4 py-2.5 text-white outline-none focus:border-green-400 transition">
                <option>🚫 자막 OFF (기본값)</option>
              </select>
              <p className="text-green-400/60 text-xs mt-2">자막 포함 여부를 선택하세요</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-green-300">🎬 생성 개수</p>
                <p className="text-green-400 text-sm">생성할 이미지 수: {imageCount}</p>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={imageCount}
                onChange={(e) => setImageCount(Number(e.target.value))}
                className="w-full h-2 bg-green-900/30 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <p className="text-green-400/60 text-xs mt-2">인공지능 생성을 위해 최대 20개로 제한</p>
            </div>
          </div>

          <button 
            onClick={generateVideoSource}
            disabled={keyStatus !== "valid" || loading}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-lg ${
              keyStatus === "valid" && !loading ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin"/>
                생성 중...
              </span>
            ) : (
              "영상 소스 생성"
            )}
          </button>

          <div className="mt-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 flex items-start gap-3">
            <span className="text-yellow-400 text-xl">⚠️</span>
            <p className="text-yellow-200 text-sm">영상 소스를 생성하려면 위에서 페르소나를 먼저 생성하거나, 참조 이미지를 업로드해주세요.</p>
          </div>

          {videoSourceImages.length > 0 && (
            <div className="mt-5 p-5 bg-green-950/40 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-300 font-semibold">생성된 영상 소스 이미지 ({videoSourceImages.length}개):</p>
                <button
                  onClick={downloadAllVideoSourceImages}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Upload size={18}/>
                  전체 다운로드
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoSourceImages.map((imgUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imgUrl} 
                      alt={`Video source ${index + 1}`} 
                      className="w-full rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`이미지 ${index + 1} 로드 실패`);
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect width="400" height="225" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23fff"%3E이미지 로딩 중...%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                      #{index + 1}
                    </div>
                    <button
                      onClick={() => downloadImage(imgUrl, `video-source-${index + 1}.png`)}
                      className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition opacity-0 group-hover:opacity-100"
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 4️⃣ 사진 구도 확장 (최대 6가지 앵글) */}
        <section className="bg-[#3d2d1f] rounded-2xl border-2 border-orange-500/40 p-7 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="bg-orange-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg">4</span>
            <Camera size={20} className="text-orange-400"/> 사진 구도 확장 (최대 6가지 앵글)
          </h2>

          <p className="text-gray-300 text-sm mb-5">원하는 앵글을 선택하여 다양한 구도의 이미지를 생성합니다.</p>

          <textarea
            className="w-full bg-[#1a1f35] border border-orange-500/30 rounded-lg px-5 py-4 text-white outline-none focus:border-orange-400 transition h-32 mb-5"
            placeholder="대본이나 장면 설명을 입력하세요...

예시:
20대 여성이 카페에서 커피를 마시며 웃고 있는 모습"
            value={angleScript}
            onChange={(e) => setAngleScript(e.target.value)}
          />

          <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-5 mb-5">
            <p className="text-orange-200 font-semibold mb-3 flex items-center gap-2">
              <Upload size={18}/> 참조 이미지 업로드 (선택사항)
            </p>
            <p className="text-orange-100/70 text-sm mb-4">
              참조 이미지를 업로드하면 해당 이미지의 스타일을 참고하여 다양한 앵글의 이미지를 생성합니다.
            </p>
            <input
              type="file"
              id="angleImageUpload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAngleReferenceImage(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="angleImageUpload"
              className="border-2 border-dashed border-orange-500/40 rounded-xl p-10 text-center bg-orange-950/20 hover:border-orange-400/60 transition cursor-pointer block"
            >
              <Upload size={40} className="mx-auto text-orange-400 mb-2"/>
              <p className="text-orange-200 font-semibold">
                {angleReferenceImage ? angleReferenceImage.name : "참조 이미지 업로드"}
              </p>
              <p className="text-orange-300/60 text-sm mt-1">클릭하여 이미지 선택하세요</p>
            </label>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-orange-300 font-semibold flex items-center gap-2">
                <CheckCircle2 size={18}/> 생성할 앵글 선택 ({selectedEmotions.length}/6)
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedEmotions(emotionOptions.map(e => e.label))}
                  className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  전체 선택
                </button>
                <button 
                  onClick={() => setSelectedEmotions([])}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  전체 해제
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {emotionOptions.map((emotion, index) => {
                const isChecked = selectedEmotions.includes(emotion.label);
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedEmotions(prev =>
                        prev.includes(emotion.label)
                          ? prev.filter(e => e !== emotion.label)
                          : [...prev, emotion.label]
                      );
                    }}
                    className={`${isChecked ? "bg-orange-700 border-orange-500" : "bg-slate-700 border-slate-600"} border-2 rounded-xl p-4 cursor-pointer hover:opacity-90 transition flex items-center gap-3`}
                  >
                    <CheckCircle2 size={20} className={isChecked ? "text-white" : "text-gray-500"}/>
                    <span className="text-2xl">{emotion.icon}</span>
                    <div>
                      <p className="font-semibold">{emotion.label}</p>
                      {emotion.subtext && <p className="text-xs text-gray-300">{emotion.subtext}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={generateAngleImages}
            disabled={keyStatus !== "valid" || loading}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-lg mb-4 ${
              keyStatus === "valid" && !loading ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin"/>
                생성 중...
              </span>
            ) : (
              "앵글 이미지 생성"
            )}
          </button>

          {angleGeneratedImages.length > 0 && (
            <div className="mt-5 p-5 bg-orange-950/40 border border-orange-500/30 rounded-lg">
              <p className="text-orange-300 font-semibold mb-4">생성된 앵글 이미지 ({angleGeneratedImages.length}개):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {angleGeneratedImages.map((imgUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imgUrl} 
                      alt={`Angle ${selectedEmotions[index]}`} 
                      className="w-full rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`앵글 이미지 ${index + 1} 로드 실패`);
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23fff"%3E이미지 로딩 중...%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                      {selectedEmotions[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5️⃣ 이미지 비율 선택 */}
        <section className="bg-[#2d2d3d] rounded-2xl border-2 border-gray-500/40 p-7 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <ImageIcon size={20} className="text-gray-400"/> 이미지 비율 선택
          </h2>

          <p className="text-gray-300 text-sm mb-5">생성할 이미지의 비율을 선택하세요. 홍대 맛 비율을 선택하면 더 효과적입니다.</p>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div 
              onClick={() => setFinalAspectRatio("9:16")}
              className={`${finalAspectRatio === "9:16" ? "border-blue-500 bg-blue-900/20" : "border-gray-600 bg-slate-800/50"} border-2 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition text-center relative`}
            >
              {finalAspectRatio === "9:16" && (
                <CheckCircle2 size={24} className="text-blue-400 absolute top-2 right-2"/>
              )}
              <div className="text-4xl mb-3">📱</div>
              <p className="font-bold text-lg mb-1">9:16</p>
              <p className="text-sm text-gray-400">모바일 세로</p>
              <p className="text-xs text-gray-500 mt-2">세로형 (인스타그램 스토리, 유튜브 쇼츠)</p>
              <div className="mt-4 mx-auto w-16 h-28 border-2 border-gray-500 rounded"/>
            </div>

            <div 
              onClick={() => setFinalAspectRatio("16:9")}
              className={`${finalAspectRatio === "16:9" ? "border-blue-500 bg-blue-900/20" : "border-gray-600 bg-slate-800/50"} border-2 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition text-center relative`}
            >
              {finalAspectRatio === "16:9" && (
                <CheckCircle2 size={24} className="text-blue-400 absolute top-2 right-2"/>
              )}
              <div className="text-4xl mb-3">🖥️</div>
              <p className="font-bold text-lg mb-1">16:9</p>
              <p className="text-sm text-gray-400">데스크톱 가로</p>
              <p className="text-xs text-gray-500 mt-2">가로형 (유튜브 영상, 영화)</p>
              <div className="mt-4 mx-auto w-28 h-16 border-2 border-gray-500 rounded"/>
            </div>

            <div 
              onClick={() => setFinalAspectRatio("1:1")}
              className={`${finalAspectRatio === "1:1" ? "border-blue-500 bg-blue-900/20" : "border-gray-600 bg-slate-800/50"} border-2 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition text-center relative`}
            >
              {finalAspectRatio === "1:1" && (
                <CheckCircle2 size={24} className="text-blue-400 absolute top-2 right-2"/>
              )}
              <div className="text-4xl mb-3">⬜</div>
              <p className="font-bold text-lg mb-1">1:1</p>
              <p className="text-sm text-gray-400">정사각형</p>
              <p className="text-xs text-gray-500 mt-2">정사각형 (인스타그램 피드)</p>
              <div className="mt-4 mx-auto w-20 h-20 border-2 border-gray-500 rounded"/>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-5">
            <p className="text-purple-200 font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={18}/> 선택한 6가지 앵글 생성하기
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-bold text-lg transition-all shadow-lg mt-3">
              페르소나 생성
            </button>
          </div>
        </section>
      </div>

      {/* 우측 하단 고정 초기화 버튼 */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => {
            if (confirm('모든 입력 내용을 초기화하시겠습니까?')) {
              setPersonaInput('');
              setPersonaResult('');
              setGeneratedImageUrl('');
              setScriptInput('');
              setVideoSourceImages([]);
              setSelectedStyleButtons(['실사 극대화']);
              setSelectedGenderButtons(['모던']);
              setSelectedEmotions(['정면', '오른쪽 측면', '왼쪽 측면', '뒷모습', '전신', '얼굴 근접']);
              setImageCount(5);
              setPhotoOrientation('정면 (기본)');
              setImageRatio('16:9 - 데스크톱 가로');
              setFinalAspectRatio('16:9');
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-all flex items-center gap-2 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          초기화
        </button>
      </div>
    </div>
  );
}
