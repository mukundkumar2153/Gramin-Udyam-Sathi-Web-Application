export interface MatchCriterion {
  labelEn: string;
  labelHi: string;
  labelMr: string;
  score: number;
  maxScore: number;
  matched: boolean;
  explanationEn: string;
  explanationHi: string;
  explanationMr: string;
}

export interface RecommendationResult {
  schemeId: string;
  matchScore: number; // 0 to 100 percentage
  criteria: MatchCriterion[];
  relevantReasonEn: string;
  relevantReasonHi: string;
  relevantReasonMr: string;
}

export interface UserProfileQuery {
  district?: string;
  businessType?: string; // Agriculture, Dairy, Food Processing, Manufacturing, Retail, Services
  businessStage?: string; // Idea, New, Existing, Expansion
  investmentRange?: string;
  entrepreneurType?: string; // General, Women, Youth, SHG/FPO, SC/ST
  requirements?: string[]; // Loan, Subsidy, Training, Equipment, Skill Development, Market Access
}

export function calculateSchemeMatch(scheme: any, userProfile: UserProfileQuery): RecommendationResult {
  let totalScore = 0;
  const criteria: MatchCriterion[] = [];

  // 1. Business Category Match (+30 Points)
  const categoryMatch = userProfile.businessType && (
    scheme.category?.nameEn.toLowerCase().includes(userProfile.businessType.toLowerCase()) ||
    scheme.category?.slug === userProfile.businessType.toLowerCase() ||
    scheme.descriptionEn.toLowerCase().includes(userProfile.businessType.toLowerCase())
  );

  const catScore = categoryMatch ? 30 : (userProfile.businessType ? 10 : 15);
  totalScore += catScore;
  criteria.push({
    labelEn: "Business Sector Match",
    labelHi: "व्यवसाय क्षेत्र मेल",
    labelMr: "व्यवसाय क्षेत्र जुळणी",
    score: catScore,
    maxScore: 30,
    matched: !!categoryMatch,
    explanationEn: categoryMatch
      ? `Matches your selected sector (${userProfile.businessType})`
      : `Broad sector eligibility (${userProfile.businessType || 'General'})`,
    explanationHi: categoryMatch
      ? `आपके चुने गए क्षेत्र (${userProfile.businessType}) से मेल खाता है`
      : `व्यापक क्षेत्र पात्रता (${userProfile.businessType || 'सामान्य'})`,
    explanationMr: categoryMatch
      ? `तुमच्या निवडलेल्या क्षेत्राशी (${userProfile.businessType}) जुळते`
      : `व्यापक क्षेत्र पात्रता (${userProfile.businessType || 'सर्वसाधारण'})`,
  });

  // 2. Requirement Match (+25 Points)
  let reqScore = 10;
  let reqMatch = false;
  if (userProfile.requirements && userProfile.requirements.length > 0) {
    const schemeText = `${scheme.nameEn} ${scheme.descriptionEn} ${JSON.stringify(scheme.benefitsJson)}`.toLowerCase();
    const matchedReqs = userProfile.requirements.filter(req => 
      schemeText.includes(req.toLowerCase()) ||
      (req.toLowerCase().includes('loan') && schemeText.includes('credit')) ||
      (req.toLowerCase().includes('subsidy') && (schemeText.includes('grant') || schemeText.includes('subsidy') || schemeText.includes('financial')))
    );

    if (matchedReqs.length > 0) {
      reqScore = 25;
      reqMatch = true;
    } else {
      reqScore = 12;
    }
  } else {
    reqScore = 15;
  }
  totalScore += reqScore;
  criteria.push({
    labelEn: "Requirement Match (Loan/Subsidy/Training)",
    labelHi: "आवश्यकता मेल (ऋण/सब्सिडी/प्रशिक्षण)",
    labelMr: "गरज जुळणी (कर्ज/अनुदान/प्रशिक्षण)",
    score: reqScore,
    maxScore: 25,
    matched: reqMatch,
    explanationEn: reqMatch
      ? `Provides exact support requested (${userProfile.requirements?.join(", ")})`
      : `Offers general business support benefits`,
    explanationHi: reqMatch
      ? `आपकी मांगी गई सहायता (${userProfile.requirements?.join(", ")}) प्रदान करता है`
      : `सामान्य व्यवसाय लाभ प्रदान करता है`,
    explanationMr: reqMatch
      ? `तुम्ही मागितलेली मदत (${userProfile.requirements?.join(", ")}) पुरवतो`
      : `सामान्य व्यवसाय मदत देतो`,
  });

  // 3. Location Match (+15 Points)
  let locScore = 15;
  let locMatch = true;
  if (userProfile.district) {
    const isDistrictSpecific = scheme.districts && scheme.districts.length > 0;
    if (isDistrictSpecific) {
      const hasDistrict = scheme.districts.some((d: any) => 
        d.district?.nameEn.toLowerCase() === userProfile.district?.toLowerCase() ||
        d.district?.slug === userProfile.district?.toLowerCase()
      );
      locScore = hasDistrict ? 15 : 5;
      locMatch = hasDistrict;
    } else {
      locScore = 15; // State-wide scheme
    }
  }
  totalScore += locScore;
  criteria.push({
    labelEn: "Location & Scope Match",
    labelHi: "स्थान और दायरा मेल",
    labelMr: "स्थान आणि कार्यक्षेत्र जुळणी",
    score: locScore,
    maxScore: 15,
    matched: locMatch,
    explanationEn: locMatch
      ? `Applicable in your district (${userProfile.district || 'All Maharashtra'})`
      : `Statewide or region-wide applicability`,
    explanationHi: locMatch
      ? `आपके जिले (${userProfile.district || 'संपूर्ण महाराष्ट्र'}) में लागू है`
      : `राज्यव्यापी या क्षेत्रीय प्रयोज्यता`,
    explanationMr: locMatch
      ? `तुमच्या जिल्ह्यात (${userProfile.district || 'संपूर्ण महाराष्ट्र'}) लागू आहे`
      : `राज्यस्तरीय योजना`,
  });

  // 4. Entrepreneur Profile Match (+15 Points)
  let profileScore = 10;
  let profileMatch = false;
  if (userProfile.entrepreneurType) {
    const targetText = `${scheme.targetUsersEn} ${scheme.descriptionEn} ${JSON.stringify(scheme.eligibilityJson)}`.toLowerCase();
    if (userProfile.entrepreneurType === 'Women' && (targetText.includes('women') || targetText.includes('mahila') || targetText.includes('female'))) {
      profileScore = 15;
      profileMatch = true;
    } else if (userProfile.entrepreneurType === 'SHG/FPO' && (targetText.includes('shg') || targetText.includes('fpo') || targetText.includes('cooperative') || targetText.includes('group'))) {
      profileScore = 15;
      profileMatch = true;
    } else if (userProfile.entrepreneurType === 'Youth' && (targetText.includes('youth') || targetText.includes('unemployed') || targetText.includes('young'))) {
      profileScore = 15;
      profileMatch = true;
    } else {
      profileScore = 12;
    }
  } else {
    profileScore = 12;
  }
  totalScore += profileScore;
  criteria.push({
    labelEn: "Entrepreneur Profile & Reservation Match",
    labelHi: "उद्यमी प्रोफ़ाइल और श्रेणी मेल",
    labelMr: "उद्योजक प्रोफाइल आणि प्रवर्ग जुळणी",
    score: profileScore,
    maxScore: 15,
    matched: profileMatch,
    explanationEn: profileMatch
      ? `Includes special benefits for ${userProfile.entrepreneurType} category`
      : `General eligibility for all entrepreneur categories`,
    explanationHi: profileMatch
      ? `${userProfile.entrepreneurType} श्रेणी के लिए विशेष लाभ शामिल हैं`
      : `सभी उद्यमी श्रेणियों के लिए सामान्य पात्रता`,
    explanationMr: profileMatch
      ? `${userProfile.entrepreneurType} प्रवर्गासाठी विशेष सवलती / लाभ उपलब्ध`
      : `सर्व उद्योजक प्रवर्गांसाठी सर्वसाधारण पात्रता`,
  });

  // 5. Business Stage Match (+10 Points)
  let stageScore = 10;
  totalScore += stageScore;
  criteria.push({
    labelEn: "Business Growth Stage Match",
    labelHi: "व्यवसाय चरण मेल",
    labelMr: "व्यवसाय टप्पा जुळणी",
    score: 10,
    maxScore: 10,
    matched: true,
    explanationEn: `Supports ${userProfile.businessStage || 'New/Existing'} business setups`,
    explanationHi: `${userProfile.businessStage || 'नए/मौजूदा'} व्यवसाय सेटअप का समर्थन करता है`,
    explanationMr: `${userProfile.businessStage || 'नवीन/विद्यमान'} व्यवसायासाठी उपयुक्त`,
  });

  // 6. Basic Eligibility Match (+5 Points)
  totalScore += 5;
  criteria.push({
    labelEn: "Basic Eligibility Verification",
    labelHi: "मूलभूत पात्रता सत्यापन",
    labelMr: "मूलभूत पात्रता पडताळणी",
    score: 5,
    maxScore: 5,
    matched: true,
    explanationEn: "Meets primary Maharashtra resident eligibility criteria",
    explanationHi: "महाराष्ट्र निवासी की प्राथमिक पात्रता पूरी करता है",
    explanationMr: "महाराष्ट्र रहिवासी प्राथमिक पात्रता पूर्ण करते",
  });

  const matchPercentage = Math.min(100, Math.max(0, totalScore));

  return {
    schemeId: scheme.id,
    matchScore: matchPercentage,
    criteria,
    relevantReasonEn: `Matches ${catScore + reqScore}/55 points on Sector and Requirement criteria.`,
    relevantReasonHi: `क्षेत्र और आवश्यकता मानदंडों पर ${catScore + reqScore}/55 अंक प्राप्त करता है।`,
    relevantReasonMr: `क्षेत्र आणि आवश्यकतेच्या निकषांवर ${catScore + reqScore}/55 गुण जुळतात.`,
  };
}
