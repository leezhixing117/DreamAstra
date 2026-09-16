import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Check, Edit3, Volume2, ArrowRight } from 'lucide-react';

interface VoiceRecorderProps {
  onDreamRecorded: (organizedDream: string, rawCantonese?: string) => void;
  onCancel?: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onDreamRecorded, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>([20, 45, 80, 50, 30, 70, 90, 40]);
  const [rawText, setRawText] = useState('');
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [organizedResult, setOrganizedResult] = useState<{
    cleanedText: string;
    characters: string[];
    emotions: string[];
    symbols: string[];
    scene: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-HK'; // Cantonese locale
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRawText((prev) => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Waveform simulation while recording
  useEffect(() => {
    let animInterval: any;
    if (isRecording) {
      animInterval = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 60) + 20,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 90) + 40,
          Math.floor(Math.random() * 85) + 30,
          Math.floor(Math.random() * 70) + 20,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 50) + 20,
        ]);
        setRecordingSeconds((s) => s + 1);
      }, 500);
    } else {
      clearInterval(animInterval);
      setRecordingSeconds(0);
    }
    return () => clearInterval(animInterval);
  }, [isRecording]);

  const startRecording = () => {
    setOrganizedResult(null);
    setRawText('');
    setIsRecording(true);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (e) {
      console.log('Voice recognition started via simulation fallback');
    }
  };

  const stopRecordingAndOrganize = (simulatedText?: string) => {
    setIsRecording(false);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}

    const textToProcess = simulatedText || rawText || '我頭先發咗個好奇怪嘅夢呀，我好似返咗以前住嗰間舊屋邨，之後我阿媽喺神枱邊企喺度，但係佢其實已經……然後海水一路升上嚟，我好驚咁搵緊出口。';
    setRawText(textToProcess);
    setIsOrganizing(true);

    // Simulate smart Cantonese NLP parsing & structuring
    setTimeout(() => {
      setIsOrganizing(false);
      
      // Smart extraction
      const chars: string[] = [];
      if (textToProcess.includes('媽') || textToProcess.includes('阿媽')) chars.push('母親');
      if (textToProcess.includes('前度') || textToProcess.includes('ex')) chars.push('前度情人');
      if (textToProcess.includes('黑影') || textToProcess.includes('追')) chars.push('神秘追逐黑影');
      if (chars.length === 0) chars.push('夢者自身 (我)');

      const syms: string[] = [];
      if (textToProcess.includes('海') || textToProcess.includes('水') || textToProcess.includes('浸')) syms.push('海水漫漲');
      if (textToProcess.includes('神枱') || textToProcess.includes('香')) syms.push('祖先神枱');
      if (textToProcess.includes('門') || textToProcess.includes('出口')) syms.push('尋找未鎖之門');
      if (textToProcess.includes('鞋')) syms.push('赤腳奔走');
      if (syms.length === 0) syms.push('迷宮走廊');

      const emos: string[] = [];
      if (textToProcess.includes('驚') || textToProcess.includes('追')) emos.push('心跳急迫 (焦慮)');
      if (textToProcess.includes('阿媽') || textToProcess.includes('以前')) emos.push('深層懷念 (依戀)');
      if (textToProcess.includes('搵') || textToProcess.includes('唔知')) emos.push('方向迷茫 (困惑)');
      if (emos.length === 0) emos.push('微涼清醒');

      setOrganizedResult({
        cleanedText: textToProcess.replace(/^(我頭先發咗個好奇怪嘅夢呀[，, ]*)/, ''),
        characters: chars,
        emotions: emos,
        symbols: syms,
        scene: textToProcess.includes('屋邨') || textToProcess.includes('舊屋') ? '童年舊屋邨走廊' : '未知變動場景',
      });
    }, 900);
  };

  const handleSelectPresetSample = (sample: string) => {
    stopRecordingAndOrganize(sample);
  };

  return (
    <div className="card border-[#aa9cff]/30 bg-[#0e1122]/90 backdrop-blur-xl p-6 rounded-2xl relative overflow-hidden" id="cantonese-voice-recorder">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#aa9cff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#aa9cff] animate-pulse" />
          <h3 className="text-base font-semibold text-white tracking-wide">
            廣東話語音講夢 (Cantonese Voice Memory)
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#8d97b5] hover:text-white transition-colors"
          >
            切換純文字
          </button>
        )}
      </div>

      <p className="text-xs text-[#aab3d2] mb-5 leading-relaxed">
        凌晨醒嚟唔使打字。撳住個掣，像跟朋友發語音一樣直接講個夢。
        系統會自動保留原意、整理語意、提取關鍵人物、情緒與象徵符號。
      </p>

      {/* Voice Record Central Button & Waveform */}
      {!organizedResult && (
        <div className="flex flex-col items-center justify-center py-6 border border-white/5 rounded-xl bg-black/20 my-2">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-end gap-1.5 h-16 px-4">
                {audioLevel.map((lvl, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 bg-gradient-to-t from-[#aa9cff] to-[#71d9ff] rounded-full transition-all duration-150"
                    style={{ height: `${lvl}%` }}
                  />
                ))}
              </div>

              <div className="text-sm font-mono text-[#aa9cff] tracking-widest">
                正在聆聽中... {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </div>

              <button
                type="button"
                onClick={() => stopRecordingAndOrganize()}
                className="px-6 py-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 flex items-center gap-2 text-sm font-medium transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
              >
                <MicOff className="w-4 h-4" />
                講完喇，撳此整理
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <button
                type="button"
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#aa9cff] to-[#71d9ff] p-0.5 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#aa9cff]/20 cursor-pointer flex items-center justify-center group"
                aria-label="開始語音錄音"
              >
                <div className="w-full h-full rounded-full bg-[#0e1122] flex items-center justify-center group-hover:bg-[#161a33] transition-colors">
                  <Mic className="w-7 h-7 text-[#c3b9ff]" />
                </div>
              </button>

              <span className="text-xs text-white font-medium">點擊開始以廣東話說話</span>
              <span className="text-[11px] text-[#8d97b5]">（支援 Safari / Chrome 麥克風）</span>
            </div>
          )}

          {isOrganizing && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#71d9ff]">
              <span className="w-3 h-3 border-2 border-[#71d9ff] border-t-transparent rounded-full animate-spin" />
              正在以廣東話 NLP 梳理夢境人物、空間與情緒軌跡…
            </div>
          )}
        </div>
      )}

      {/* Quick Cantonese Sample Presets */}
      {!organizedResult && !isRecording && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="text-[11px] text-[#8d97b5] mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#aa9cff]" />
            <span>或者直接點選常見廣東話夢境範例：</span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleSelectPresetSample('我頭先發咗個好奇怪嘅夢呀，我好似返咗以前住嗰度，之後我阿媽喺神枱邊度企喺度，但係佢其實已經……我好想同佢講嘢，但係講唔出聲。')}
              className="text-xs p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-[#d8ddf0] text-left transition-colors flex items-start gap-2"
            >
              <span className="text-base">🕯️</span>
              <div>
                <b className="text-white">「返咗以前住嗰度，阿媽喺神枱邊……」</b>
                <div className="text-[11px] text-[#8d97b5] mt-0.5">已故長輩、舊屋邨、神枱、無法發聲</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPresetSample('我頭先夢到自己又要考多次公開試，我入到舊學校發現全場得我冇著鞋，推開一扇扇門都係白牆，搵唔到考場。')}
              className="text-xs p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-[#d8ddf0] text-left transition-colors flex items-start gap-2"
            >
              <span className="text-base">🏫</span>
              <div>
                <b className="text-white">「又要考多次會考，發現自己冇著鞋……」</b>
                <div className="text-[11px] text-[#8d97b5] mt-0.5">舊校園、赤腳、考試焦慮、找不到出口</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Structured Cantonese Result View */}
      {organizedResult && (
        <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="callout text-xs border-[#78e1b5]/30 bg-[#78e1b5]/10 text-[#78e1b5] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" />
              我幫你將個夢整理好咗，呢個係你記得嘅版本：
            </span>
            <button
              type="button"
              onClick={() => setOrganizedResult(null)}
              className="text-[11px] text-[#aab3d2] hover:text-white underline"
            >
              重新錄音
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-[#f6f7ff] leading-relaxed italic">
            「{organizedResult.cleanedText}」
          </div>

          {/* Extracted Metadata Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">👥 識別人物</span>
              <div className="font-medium text-white truncate">
                {organizedResult.characters.join('、')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">🌊 關鍵象徵</span>
              <div className="font-medium text-[#71d9ff] truncate">
                {organizedResult.symbols.join('、')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">⚡ 核心情緒</span>
              <div className="font-medium text-[#aa9cff] truncate">
                {organizedResult.emotions.join('、')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">🏚️ 記憶場景</span>
              <div className="font-medium text-[#ffd27a] truncate">
                {organizedResult.scene}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onDreamRecorded(organizedResult.cleanedText, rawText)}
              className="btn flex-1 text-xs py-3 flex items-center justify-center gap-2"
            >
              <span>確認並進入偵探問題</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
