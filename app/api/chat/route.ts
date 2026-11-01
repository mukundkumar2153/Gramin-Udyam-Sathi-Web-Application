import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATIC_SCHEMES } from "@/lib/data/schemes";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.AI_API_KEY ||
  "";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

export async function POST(request: Request) {
  try {
    const { message, language = "mr" } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    // Load available schemes for context
    let schemes = STATIC_SCHEMES;
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        const dbSchemes = await prisma.scheme.findMany({
          where: { status: "ACTIVE" },
          include: { category: true },
        });
        if (dbSchemes && dbSchemes.length > 0) {
          schemes = dbSchemes;
        }
      } catch (e) {
        // use static schemes
      }
    }

    // Context summary of verified schemes
    const schemeContext = schemes
      .map(
        (s) =>
          `* ${s.nameEn} (${s.nameMr} / ${s.nameHi}):
  - Description: ${s.descriptionEn}
  - Key Benefit: ${Array.isArray(s.benefitsJson) && s.benefitsJson[0] ? (s.benefitsJson[0][language] || s.benefitsJson[0].en) : s.descriptionEn}
  - Target: ${s.targetUsersEn}
  - Scope: ${s.applicableScope}
  - Scheme Page: /schemes/${s.id}
  - Official Website: ${s.officialUrl}`
      )
      .join("\n\n");

    const languageInstruction =
      language === "hi"
        ? "हिंदी (Hindi) भाषा में उत्तर दें। भाषा सरल, विनम्र और स्पष्ट होनी चाहिए।"
        : language === "en"
        ? "Respond in simple, clear, and professional English."
        : "मराठी (Marathi) भाषेत उत्तर द्या. भाषा सोपी, आदरयुक्त आणि स्पष्ट असावी.";

    const systemPrompt = `You are "Gramin Udyam AI Sahayak" (ग्रामीण उद्यम साथी AI), an expert assistant helping rural entrepreneurs and small business owners in Maharashtra.

Verified Government Schemes Database:
${schemeContext}

User Query: "${message}"

Guidelines:
1. ${languageInstruction}
2. Directly answer the user's question. Recommend the best matching scheme(s) from the database above.
3. Clearly mention the main benefits, subsidy/loan amounts, and key eligibility.
4. Include clickable links for the scheme page in markdown format like [View Scheme Details](/schemes/scheme-id) and official website link.
5. Keep paragraphs neat with bullet points. Do NOT truncate sentences or use incomplete words.`;

    let reply = "";

    // Call Google Gemini API (exact curl format provided)
    if (GEMINI_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const geminiRes = await fetch(GEMINI_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
          }),
        });

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            reply = generatedText;
          }
        }
      } catch (apiErr) {
        // Fallback to local verified schemes
      }
    }

    // Match relevant schemes for interactive cards below message
    const lower = message.toLowerCase();
    const matchedSchemes = schemes.filter((s) => {
      const text = `${s.nameEn} ${s.nameHi} ${s.nameMr} ${s.descriptionEn} ${s.descriptionMr} ${s.targetUsersEn}`.toLowerCase();
      if (lower.includes("dairy") || lower.includes("दुग्ध") || lower.includes("दूध") || lower.includes("गाय") || lower.includes("गोठा")) {
        return text.includes("dairy") || text.includes("पशुपालन") || text.includes("गोठा") || s.categoryId?.includes("dairy");
      }
      if (lower.includes("food") || lower.includes("अन्न") || lower.includes("खाद्य") || lower.includes("प्रक्रिया")) {
        return text.includes("food") || text.includes("प्रक्रिया") || text.includes("pmfme");
      }
      if (lower.includes("loan") || lower.includes("कर्ज") || lower.includes("ऋण") || lower.includes("mudra") || lower.includes("cmegp")) {
        return text.includes("loan") || text.includes("कर्ज") || text.includes("cmegp") || text.includes("mudra");
      }
      if (lower.includes("women") || lower.includes("महिला") || lower.includes("स्त्री")) {
        return text.includes("women") || text.includes("महिला") || text.includes("stand up");
      }
      return text.split(" ").some((word) => word.length > 3 && lower.includes(word));
    });

    const relevantList = matchedSchemes.length > 0 ? matchedSchemes.slice(0, 3) : schemes.slice(0, 2);

    // Fallback if Gemini did not respond
    if (!reply) {
      if (language === "hi") {
        reply = `नमस्कार! आपके प्रश्न के आधार पर, महाराष्ट्र सरकार और केंद्र सरकार की ये योजनाएं आपके व्यवसाय के लिए सबसे उपयुक्त हैं:\n\n`;
        relevantList.forEach((s, idx) => {
          const benefit = Array.isArray(s.benefitsJson) && s.benefitsJson[0] ? (s.benefitsJson[0].hi || s.benefitsJson[0].en) : s.descriptionHi;
          reply += `${idx + 1}. **${s.nameHi || s.nameEn}**\n   - **मुख्य लाभ:** ${benefit}\n   - **अधिकृत पोर्टल:** ${s.officialUrl}\n   - [योजना का पूरा विवरण देखें](/schemes/${s.id})\n\n`;
        });
        reply += `\n*टिप्पणी: अंतिम पात्रता की पुष्टि के लिए कृपया संबंधित आधिकारिक सरकारी पोर्टल पर जाएं।*`;
      } else if (language === "en") {
        reply = `Hello! Based on your business query, here are the most relevant verified government schemes:\n\n`;
        relevantList.forEach((s, idx) => {
          const benefit = Array.isArray(s.benefitsJson) && s.benefitsJson[0] ? (s.benefitsJson[0].en || s.benefitsJson[0].mr) : s.descriptionEn;
          reply += `${idx + 1}. **${s.nameEn}**\n   - **Key Benefit:** ${benefit}\n   - **Official Website:** ${s.officialUrl}\n   - [View Scheme Details](/schemes/${s.id})\n\n`;
        });
        reply += `\n*Note: Please verify final eligibility on the official government website.*`;
      } else {
        reply = `नमस्कार! तुमच्या प्रश्नानुसार, आमच्या पडताळलेल्या डेटाबेसवरून खालील सरकारी योजना तुमच्या व्यवसायासाठी सर्वोत्तम ठरू शकतात:\n\n`;
        relevantList.forEach((s, idx) => {
          const benefit = Array.isArray(s.benefitsJson) && s.benefitsJson[0] ? (s.benefitsJson[0].mr || s.benefitsJson[0].en) : s.descriptionMr;
          reply += `${idx + 1}. **${s.nameMr || s.nameEn}**\n   - **मुख्य फायदा:** ${benefit}\n   - **अधिकृत वेबसाईट:** ${s.officialUrl}\n   - [सविस्तर माहिती पहा](/schemes/${s.id})\n\n`;
        });
        reply += `\n*टीप: अंतिम पात्रतेसाठी कृपया अधिकृत सरकारी वेबसाईटला भेट द्या.*`;
      }
    }

    return NextResponse.json({
      success: true,
      reply,
      matchedSchemes: relevantList.map((s) => ({
        id: s.id,
        nameEn: s.nameEn,
        nameHi: s.nameHi,
        nameMr: s.nameMr,
        officialUrl: s.officialUrl,
      })),
    });
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ success: false, error: "AI Assistant service error" }, { status: 500 });
  }
}
