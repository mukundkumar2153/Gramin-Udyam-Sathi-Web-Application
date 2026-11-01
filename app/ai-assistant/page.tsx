"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  Bot,
  Send,
  User,
  ExternalLink,
  ChevronRight,
  Info,
  Building2,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  matchedSchemes?: any[];
}

// Rich Text & Markdown Formatter Component for AI Responses
function FormattedText({ text, language }: { text: string; language: string }) {
  if (!text) return null;

  // Split into lines
  const lines = text.split("\n");

  const renderInline = (lineText: string) => {
    // Match markdown links [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(lineText)) !== null) {
      const matchStart = match.index;
      const matchEnd = linkRegex.lastIndex;

      if (matchStart > lastIdx) {
        parts.push(renderBoldItalic(lineText.substring(lastIdx, matchStart)));
      }

      const label = match[1];
      const url = match[2];

      const isInternal = url.startsWith("/");
      if (isInternal) {
        parts.push(
          <Link
            key={matchStart}
            href={url}
            className="inline-flex items-center gap-1 my-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <span>{label}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        );
      } else {
        parts.push(
          <a
            key={matchStart}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold underline hover:text-emerald-900"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }

      lastIdx = matchEnd;
    }

    if (lastIdx < lineText.length) {
      parts.push(renderBoldItalic(lineText.substring(lastIdx)));
    }

    return parts;
  };

  const renderBoldItalic = (segment: string) => {
    // Replace **bold**
    const boldParts = segment.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith("**") && bPart.endsWith("**")) {
        const inner = bPart.slice(2, -2);
        return (
          <strong key={bIdx} className="font-extrabold text-slate-900 dark:text-white">
            {inner}
          </strong>
        );
      }

      // Check for standalone URLs
      const urlRegex = /(https?:\/\/[^\s)]+)/g;
      const urlParts = bPart.split(urlRegex);
      return urlParts.map((uPart, uIdx) => {
        if (uPart.startsWith("http://") || uPart.startsWith("https://")) {
          return (
            <a
              key={uIdx}
              href={uPart}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-semibold underline hover:text-emerald-900 break-all"
            >
              <span>{uPart}</span>
              <ExternalLink className="w-3 h-3 inline ml-0.5" />
            </a>
          );
        }
        return uPart;
      });
    });
  };

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Note / Disclaimer line (*Note:...* or *टीप:...* or *टिप्पणी:...*)
        if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
          const cleanNote = trimmed.slice(1, -1);
          return (
            <div
              key={idx}
              className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-start gap-2"
            >
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{renderInline(cleanNote)}</span>
            </div>
          );
        }

        // Numbered list item like "1. **Title**"
        const isNumbered = /^\d+\.\s/.test(trimmed);
        if (isNumbered) {
          return (
            <div key={idx} className="font-bold text-slate-900 dark:text-white mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {renderInline(trimmed)}
            </div>
          );
        }

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="pl-4 relative flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <div className="flex-1">{renderInline(trimmed.substring(2))}</div>
            </div>
          );
        }

        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

export default function AIAssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        language === "hi"
          ? "नमस्ते! मैं आपका ग्रामीण उद्यम AI सहायक हूँ। आप मुझसे महाराष्ट्र की सरकारी योजनाओं, ऋण, सब्सिडी या डेयरी/खाद्य प्रसंस्करण व्यवसाय के बारे में कोई भी प्रश्न पूछ सकते हैं।"
          : language === "en"
          ? "Hello! I am your Gramin Udyam AI Assistant. Ask me any question regarding Maharashtra government schemes, business loans, subsidies, or rural enterprises."
          : "नमस्कार! मी आपला ग्रामीण उद्यम AI सहाय्यक आहे. मला महाराष्ट्रातील सरकारी योजना, कर्ज, अनुदान किंवा दुग्ध/अन्न प्रक्रिया व्यवसायाबद्दल कोणताही प्रश्न विचारा.",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedPrompts =
    language === "hi"
      ? [
          "मैं पुणे में डेयरी व्यवसाय शुरू करना चाहता हूँ, मुझे कौन सी योजना मिलेगी?",
          "फूड प्रोसेसिंग यूनिट के लिए लोन और सब्सिडी कैसे प्राप्त करें?",
          "महिला उद्यमियों के लिए कौन सी विशेष योजनाएं हैं?",
          "CMEGP योजना के लिए किन दस्तावेजों की आवश्यकता है?",
        ]
      : language === "en"
      ? [
          "I want to start a Dairy business in Pune, which scheme is suitable?",
          "How to get loan and subsidy for a Food Processing enterprise?",
          "What special government schemes exist for Women Entrepreneurs?",
          "What documents are needed for the CMEGP scheme?",
        ]
      : [
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
          text:
            language === "hi"
              ? "क्षमा करें! AI सेवा में कुछ समस्या आई। कृपया थोड़ी देर बाद पुनः प्रयास करें।"
              : language === "mr"
              ? "क्षमस्व! AI सेवेत काही अडचण आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
              : "Sorry! Something went wrong with the AI assistant. Please try again shortly.",
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold">
          <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            {language === "hi"
              ? "ग्रामीण उद्यम AI सहायक"
              : language === "mr"
              ? "ग्रामीण उद्यम AI सहाय्यक"
              : "Gramin Udyam AI Assistant"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t.aiAssistantTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t.aiAssistantSub}
        </p>
      </div>

      {/* SUGGESTED PROMPT CHIPS */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-800 shadow-2xs transition-all text-left"
          >
            💬 {p}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES WINDOW */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col h-[540px]">
        {/* Messages Content area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[92%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-700 text-white"
                    : "bg-emerald-600 text-white shadow-xs"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`p-4 sm:p-5 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-800 text-white rounded-tr-xs"
                    : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs rounded-tl-xs space-y-3"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-xs sm:text-sm font-medium">{msg.text}</p>
                ) : (
                  <>
                    <FormattedText text={msg.text} language={language} />

                    {/* Interactive matched scheme cards below reply */}
                    {Array.isArray(msg.matchedSchemes) && msg.matchedSchemes.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{language === 'hi' ? "संबंधित योजनाएं:" : language === 'mr' ? "संबंधित योजना:" : "Recommended Schemes:"}</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.matchedSchemes.map((s: any) => {
                            const name = language === 'hi' ? (s.nameHi || s.nameEn) : language === 'mr' ? (s.nameMr || s.nameEn) : s.nameEn;
                            return (
                              <Link
                                key={s.id}
                                href={`/schemes/${s.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-all shadow-2xs group"
                              >
                                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="max-w-[200px] truncate">{name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[88%] items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span className="font-semibold">
                {language === "hi"
                  ? "AI उत्तर तैयार कर रहा है..."
                  : language === "mr"
                  ? "AI उत्तर तयार करत आहे..."
                  : "AI Assistant is formulating response..."}
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === "hi"
                ? "अपनी भाषा में योजना का प्रश्न पूछें..."
                : language === "mr"
                ? "योजनेबद्दल कोणताही प्रश्न विचारा..."
                : "Ask any scheme related question..."
            }
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
