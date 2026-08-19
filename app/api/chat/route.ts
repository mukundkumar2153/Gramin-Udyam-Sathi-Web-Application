import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { message, language = "mr" } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // Query active schemes from Neon DB
    const schemes = await prisma.scheme.findMany({
      where: { status: "ACTIVE" },
      include: { category: true },
    });

    // Simple RAG relevance search across name & descriptions
    const matchedSchemes = schemes.filter((s) => {
      const text = `${s.nameEn} ${s.nameHi} ${s.nameMr} ${s.descriptionEn} ${s.descriptionMr} ${s.targetUsersEn}`.toLowerCase();
      if (lower.includes("dairy") || lower.includes("दुग्ध") || lower.includes("दूध") || lower.includes("गाय") || lower.includes("गोठा")) {
        return text.includes("dairy") || text.includes("पशुपालन") || text.includes("गोठा") || s.categoryId;
      }
      if (lower.includes("food") || lower.includes("अन्न") || lower.includes("खाद्य") || lower.includes("प्रक्रिया")) {
        return text.includes("food") || text.includes("प्रक्रिया") || text.includes("pmfme");
      }
      if (lower.includes("loan") || lower.includes("कर्ज") || lower.includes("ऋण") || lower.includes("mudra")) {
        return text.includes("loan") || text.includes("कर्ज") || text.includes("cmegp") || text.includes("mudra");
      }
      if (lower.includes("women") || lower.includes("महिला") || lower.includes("स्त्री")) {
        return text.includes("women") || text.includes("महिला") || text.includes("stand up");
      }
      return text.split(" ").some((word) => word.length > 3 && lower.includes(word));
    });

    const relevantList = matchedSchemes.length > 0 ? matchedSchemes.slice(0, 3) : schemes.slice(0, 2);

    let reply = "";

    if (language === "hi") {
      reply = `नमस्कार! आपके प्रश्न के आधार पर, महाराष्ट्र सरकार और केंद्र सरकार की ये योजनाएं आपके लिए सबसे उपयुक्त हो सकती हैं:\n\n`;
      relevantList.forEach((s, idx) => {
        reply += `${idx + 1}. **${s.nameHi}**\n   - **लाभ:** ${s.descriptionHi.slice(0, 140)}...\n   - **अधिकृत पोर्टल:** ${s.officialUrl}\n   - [योजना का विवरण देखें](/schemes/${s.id})\n\n`;
      });
      reply += `\n*टिप्पणी: अंतिम पात्रता की पुष्टि के लिए कृपया संबंधित आधिकारिक सरकारी पोर्टल (Official Website) पर जाएं।*`;
    } else if (language === "en") {
      reply = `Hello! Based on your business query, here are the most relevant verified government schemes from our database:\n\n`;
      relevantList.forEach((s, idx) => {
        reply += `${idx + 1}. **${s.nameEn}**\n   - **Key Benefit:** ${s.descriptionEn.slice(0, 140)}...\n   - **Official Website:** ${s.officialUrl}\n   - [View Scheme Details](/schemes/${s.id})\n\n`;
      });
      reply += `\n*Note: Please verify final eligibility on the official government website.*`;
    } else {
      // Default Marathi
      reply = `नमस्कार! तुमच्या प्रश्नानुसार, आमच्या पडताळलेल्या डेटाबेसवरून खालील सरकारी योजना तुमच्या व्यवसायासाठी सर्वोत्तम ठरू शकतात:\n\n`;
      relevantList.forEach((s, idx) => {
        reply += `${idx + 1}. **${s.nameMr}**\n   - **मुख्य फायदा:** ${s.descriptionMr.slice(0, 140)}...\n   - **अधिकृत वेबसाईट:** ${s.officialUrl}\n   - [सविस्तर माहिती पहा](/schemes/${s.id})\n\n`;
      });
      reply += `\n*टीप: अंतिम पात्रतेसाठी कृपया अधिकृत सरकारी वेबसाईटला (Official Portal) भेट द्या.*`;
    }

    return NextResponse.json({
      success: true,
      reply,
      matchedSchemes: relevantList.map((s) => ({
        id: s.id,
        nameEn: s.nameEn,
        nameMr: s.nameMr,
        officialUrl: s.officialUrl,
      })),
    });
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ success: false, error: "AI Assistant service error" }, { status: 500 });
  }
}
