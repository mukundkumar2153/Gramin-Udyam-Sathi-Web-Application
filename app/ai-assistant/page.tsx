"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Bot, Send, Mic, Sparkles, User, RefreshCw, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  matchedSchemes?: any[];
}

export default function AIAssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: language === 'hi'
        ? "नमस्ते! मैं आपका ग्रामीण उद्यम AI सहायक हूँ। आप मुझसे महाराष्ट्र की सरकारी योजनाओं, ऋण, सब्सिडी या डेयरी/खाद्य प्रसंस्करण व्यवसाय के बारे में कोई भी प्रश्न पूछ सकते हैं।"
        : language === 'en'
        ? "Hello! I am your Gramin Udyam AI Sahayak. Ask me any question regarding Maharashtra government schemes, business loans, subsidies, or farming enterprises."
        : "नमस्कार! मी आपला ग्रामीण उद्यम AI सहाय्यक आहे. मला महाराष्ट्रातील सरकारी योजना, कर्ज, अनुदान किंवा दुग्ध/अन्न प्रक्रिया व्यवसायाबद्दल कोणताही प्रश्न विचारा.",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "मी पुण्यात दुग्धव्यवसाय (Dairy) सुरू करू इच्छितो, मला कोणती योजना मिळेल?",
    "Food processing unit sathi loan & subsidy कशी मिळेल?",
    "महिला उद्योजकांसाठी (Women Entrepreneur) कोणत्या विशेष योजना आहेत?",
    "CMEGP योजनेसाठी कोणती कागदपत्रे लागतात?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || loading) return;

    const userMsgId = Date.now().toString();
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, role: "user", text },
    ];
    setMessages(newMessages);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: data.reply,
            matchedSchemes: data.matchedSchemes,
          },
        ]);
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "क्षमस्व! AI सेवेत काही अडचण आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
          <Bot className="w-4 h-4 text-emerald-600" />
          <span>ग्रामिन उद्यम AI सहाय्यक (Verified Database Context)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          {t.aiAssistantTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          तुमच्या नैसर्गिक भाषेत (मराठी, हिंदी किंवा Hinglish) प्रश्न विचारा. AI थेट पडताळलेल्या डेटाबेसवरून उत्तरे देईल.
        </p>
      </div>

      {/* SUGGESTED PROMPT CHIPS */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-full text-xs font-semibold text-slate-700 hover:text-emerald-800 shadow-2xs transition-all text-left"
          >
            💬 {p}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES WINDOW */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Content area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-emerald-600 text-white shadow-xs"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white rounded-tr-xs"
                    : "bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-tl-xs"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 p-3 bg-white border border-slate-200 rounded-2xl w-fit">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI डेटाबेस शोधत आहे...</span>
            </div>
          )}
        </div>

        {/* INPUT FORM BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          {/* Voice Input Icon (UI placeholder for future voice-to-text integration) */}
          <button
            type="button"
            onClick={() => alert("Voice assistant module ready for speech-to-text API integration.")}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
            title="Voice Input"
          >
            <Mic className="w-5 h-5 text-emerald-700" />
          </button>

          <input
            type="text"
            placeholder="तुमचा प्रश्न येथे टाइप करा (e.g. Dairy business loan guide)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <span>पाठवा</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
