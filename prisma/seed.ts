import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Neon PostgreSQL Database for Gramin Udyam Sathi...");

  // 1. Seed Default Admin User
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@graminudyam.in" },
    update: {},
    create: {
      name: "Gramin Udyam Admin",
      email: "admin@graminudyam.in",
      password: adminPasswordHash,
      role: "ADMIN",
      language: "mr",
    },
  });
  console.log("Admin user created/verified:", admin.email);

  // 2. Seed Categories
  const categoriesData = [
    {
      slug: "agriculture",
      nameEn: "Agriculture & Agribusiness",
      nameHi: "कृषि एवं कृषि व्यवसाय",
      nameMr: "शेती आणि कृषी व्यवसाय",
      description: "Support for farming, crop processing, organic farming, and farm equipment.",
      icon: "Sprout",
    },
    {
      slug: "dairy",
      nameEn: "Dairy & Animal Husbandry",
      nameHi: "डेयरी एवं पशुपालन",
      nameMr: "दुग्धव्यवसाय आणि पशुपालन",
      description: "Cowshed construction, milk chilling units, goat farming, and poultry.",
      icon: "Milk",
    },
    {
      slug: "food-processing",
      nameEn: "Food Processing Enterprises",
      nameHi: "खाद्य प्रसंस्करण उद्योग",
      nameMr: "अन्न प्रक्रिया उद्योग",
      description: "Fruit processing, flour mills, spice grinding, packaging, and jaggery units.",
      icon: "Utensils",
    },
    {
      slug: "handicrafts",
      nameEn: "Handicrafts & Artisans",
      nameHi: "हस्तशिल्प एवं कारीगर",
      nameMr: "हस्तकला आणि कारागीर",
      description: "Textiles, pottery, bamboo craft, leather goods, and rural artisans.",
      icon: "Palette",
    },
    {
      slug: "manufacturing",
      nameEn: "Small Scale Manufacturing",
      nameHi: "लघु उद्योग निर्माण",
      nameMr: "लघु उद्योग उत्पादने",
      description: "Fabrication, paper products, eco-friendly cutlery, bricks, and repair shops.",
      icon: "Factory",
    },
    {
      slug: "retail-services",
      nameEn: "Retail & Village Services",
      nameHi: "खुदरा एवं ग्रामीण सेवाएं",
      nameMr: "किरकोळ विक्री आणि ग्रामीण सेवा",
      description: "Grocery, cyber cafes, solar installation services, transport, and local shops.",
      icon: "ShoppingBag",
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log("Categories seeded:", Object.keys(categoryMap).length);

  // 3. Seed 36 Maharashtra Districts
  const districtsData = [
    { slug: "pune", nameEn: "Pune", nameHi: "पुणे", nameMr: "पुणे", region: "Paschim Maharashtra", dicAddress: "DIC Office, Agriculture College Campus, Shivajinagar, Pune", dicContact: "020-25537248" },
    { slug: "nashik", nameEn: "Nashik", nameHi: "नासिक", nameMr: "नाशिक", region: "Khandesh", dicAddress: "DIC Office, MIDC Ambad, Nashik", dicContact: "0253-2381204" },
    { slug: "aurangabad", nameEn: "Chhatrapati Sambhajinagar", nameHi: "छत्रपति संभाजीनगर", nameMr: "छत्रपती संभाजीनगर", region: "Marathwada", dicAddress: "DIC Office, Station Road, Chhatrapati Sambhajinagar", dicContact: "0240-2334812" },
    { slug: "ahmednagar", nameEn: "Ahilyanagar", nameHi: "अहिल्यानगर", nameMr: "अहिल्यानगर", region: "Paschim Maharashtra", dicAddress: "DIC Office, Collectorate Annexe, Ahilyanagar", dicContact: "0241-2323891" },
    { slug: "kolhapur", nameEn: "Kolhapur", nameHi: "कोल्हापुर", nameMr: "कोल्हापूर", region: "Paschim Maharashtra", dicAddress: "DIC Office, Tarabai Park, Kolhapur", dicContact: "0231-2651478" },
    { slug: "nagpur", nameEn: "Nagpur", nameHi: "नागपुर", nameMr: "नागपूर", region: "Vidarbha", dicAddress: "DIC Office, Civil Lines, Nagpur", dicContact: "0712-2560831" },
    { slug: "satara", nameEn: "Satara", nameHi: "सतारा", nameMr: "सातारा", region: "Paschim Maharashtra", dicAddress: "DIC Office, Powai Naka, Satara", dicContact: "02162-234125" },
    { slug: "sangli", nameEn: "Sangli", nameHi: "सांगली", nameMr: "सांगली", region: "Paschim Maharashtra", dicAddress: "DIC Office, Rajwada Chowk, Sangli", dicContact: "0233-2321456" },
    { slug: "solapur", nameEn: "Solapur", nameHi: "सोलापुर", nameMr: "सोलापूर", region: "Paschim Maharashtra", dicAddress: "DIC Office, Sidheshwar Peth, Solapur", dicContact: "0217-2728901" },
    { slug: "nanded", nameEn: "Nanded", nameHi: "नांदेड़", nameMr: "नांदेड", region: "Marathwada", dicAddress: "DIC Office, VIP Road, Nanded", dicContact: "02462-251234" },
    { slug: "amravati", nameEn: "Amravati", nameHi: "अमरावती", nameMr: "अमरावती", region: "Vidarbha", dicAddress: "DIC Office, Camp Area, Amravati", dicContact: "0721-2662389" },
    { slug: "latur", nameEn: "Latur", nameHi: "लातूर", nameMr: "लातूर", region: "Marathwada", dicAddress: "DIC Office, MIDC Area, Latur", dicContact: "02382-221456" },
    { slug: "jalgaon", nameEn: "Jalgaon", nameHi: "जलगांव", nameMr: "जळगाव", region: "Khandesh", dicAddress: "DIC Office, Old B.J. Market, Jalgaon", dicContact: "0257-2223456" },
    { slug: "thane", nameEn: "Thane", nameHi: "ठाणे", nameMr: "ठाणे", region: "Konkan", dicAddress: "DIC Office, Wagle Estate, Thane", dicContact: "022-25821234" },
    { slug: "raigad", nameEn: "Raigad", nameHi: "रायगढ़", nameMr: "रायगड", region: "Konkan", dicAddress: "DIC Office, Alibag, Raigad", dicContact: "02141-222345" },
    { slug: "ratnagiri", nameEn: "Ratnagiri", nameHi: "रत्नागिरी", nameMr: "रत्नागिरी", region: "Konkan", dicAddress: "DIC Office, Kuwarbav, Ratnagiri", dicContact: "02352-228901" },
    { slug: "sindhudurg", nameEn: "Sindhudurg", nameHi: "सिंधुदुर्ग", nameMr: "सिंधुदुर्ग", region: "Konkan", dicAddress: "DIC Office, Oros, Sindhudurg", dicContact: "02362-228345" },
    { slug: "chandrapur", nameEn: "Chandrapur", nameHi: "चंद्रपुर", nameMr: "चंद्रपूर", region: "Vidarbha", dicAddress: "DIC Office, Collectorate, Chandrapur", dicContact: "07172-255678" },
    { slug: "yavatmal", nameEn: "Yavatmal", nameHi: "यवतमाल", nameMr: "यवतमाळ", region: "Vidarbha", dicAddress: "DIC Office, Main Road, Yavatmal", dicContact: "07232-244123" },
    { slug: "buldhana", nameEn: "Buldhana", nameHi: "बुलढाणा", nameMr: "बुलढाणा", region: "Vidarbha", dicAddress: "DIC Office, Civil Lines, Buldhana", dicContact: "07262-242345" },
    { slug: "akola", nameEn: "Akola", nameHi: "अकोला", nameMr: "अकोला", region: "Vidarbha", dicAddress: "DIC Office, Murtizapur Road, Akola", dicContact: "0724-2431234" },
    { slug: "washim", nameEn: "Washim", nameHi: "वाशिम", nameMr: "वाशीम", region: "Vidarbha", dicAddress: "DIC Office, Collectorate, Washim", dicContact: "07252-232145" },
    { slug: "wardha", nameEn: "Wardha", nameHi: "वर्धा", nameMr: "वर्धा", region: "Vidarbha", dicAddress: "DIC Office, Sewagram Road, Wardha", dicContact: "07152-243567" },
    { slug: "bhandara", nameEn: "Bhandara", nameHi: "भंडारा", nameMr: "भंडारा", region: "Vidarbha", dicAddress: "DIC Office, Main Highway, Bhandara", dicContact: "07184-252345" },
    { slug: "gondia", nameEn: "Gondia", nameHi: "गोंदिया", nameMr: "गोंदिया", region: "Vidarbha", dicAddress: "DIC Office, Kudwa Line, Gondia", dicContact: "07182-236789" },
    { slug: "gadchiroli", nameEn: "Gadchiroli", nameHi: "गडचिरोली", nameMr: "गडचिरोली", region: "Vidarbha", dicAddress: "DIC Office, Complex Area, Gadchiroli", dicContact: "07132-222123" },
    { slug: "parbhani", nameEn: "Parbhani", nameHi: "परभणी", nameMr: "परभणी", region: "Marathwada", dicAddress: "DIC Office, Basmat Road, Parbhani", dicContact: "02452-223456" },
    { slug: "hingoli", nameEn: "Hingoli", nameHi: "हिंगोली", nameMr: "हिंगोली", region: "Marathwada", dicAddress: "DIC Office, Nanded Bypass, Hingoli", dicContact: "02456-221234" },
    { slug: "beed", nameEn: "Beed", nameHi: "बीड", nameMr: "बीड", region: "Marathwada", dicAddress: "DIC Office, Nagar Road, Beed", dicContact: "02442-222345" },
    { slug: "osmanabad", nameEn: "Dharashiv", nameHi: "धाराशिव", nameMr: "धाराशिव", region: "Marathwada", dicAddress: "DIC Office, Solapur Road, Dharashiv", dicContact: "02472-223145" },
    { slug: "jalna", nameEn: "Jalna", nameHi: "जालना", nameMr: "जालना", region: "Marathwada", dicAddress: "DIC Office, Devalgaon Raja Road, Jalna", dicContact: "02482-224567" },
    { slug: "dhule", nameEn: "Dhule", nameHi: "धुले", nameMr: "धुळे", region: "Khandesh", dicAddress: "DIC Office, Sakri Road, Dhule", dicContact: "02562-232145" },
    { slug: "nandurbar", nameEn: "Nandurbar", nameHi: "नंदुरबार", nameMr: "नंदुरबार", region: "Khandesh", dicAddress: "DIC Office, Collectorate, Nandurbar", dicContact: "02564-222345" },
    { slug: "palghar", nameEn: "Palghar", nameHi: "पालघर", nameMr: "पालघर", region: "Konkan", dicAddress: "DIC Office, Boisar Road, Palghar", dicContact: "02525-252123" },
    { slug: "mumbai-suburban", nameEn: "Mumbai Suburban", nameHi: "मुंबई उपनगर", nameMr: "मुंबई उपनगर", region: "Konkan", dicAddress: "DIC Office, Bandra East, Mumbai", dicContact: "022-26590123" },
    { slug: "mumbai-city", nameEn: "Mumbai City", nameHi: "मुंबई शहर", nameMr: "मुंबई शहर", region: "Konkan", dicAddress: "DIC Office, World Trade Centre, Cuffe Parade, Mumbai", dicContact: "022-22189012" },
  ];

  const districtMap: Record<string, string> = {};
  for (const dist of districtsData) {
    const createdDist = await prisma.district.upsert({
      where: { slug: dist.slug },
      update: dist,
      create: dist,
    });
    districtMap[dist.slug] = createdDist.id;
  }
  console.log("36 Maharashtra Districts seeded.");

  // 4. Seed Verified Maharashtra Government Schemes
  const schemesData = [
    {
      nameEn: "Chief Minister Employment Generation Programme (CMEGP)",
      nameHi: "मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP)",
      nameMr: "मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP)",
      descriptionEn: "Financial support & capital subsidy for setting up new manufacturing or service micro-enterprises in Maharashtra's rural & urban areas.",
      descriptionHi: "महाराष्ट्र के ग्रामीण और शहरी क्षेत्रों में नए विनिर्माण या सेवा सूक्ष्म उद्यम स्थापित करने के लिए वित्तीय सहायता और पूंजी सब्सिडी।",
      descriptionMr: "महाराष्ट्रातील ग्रामीण व शहरी भागात नवीन उत्पादन किंवा सेवा लघुउद्योग सुरू करण्यासाठी आर्थिक मदत व भांडवली अनुदान योजना.",
      categoryId: categoryMap["manufacturing"],
      targetUsersEn: "Rural & Urban Youth, SC/ST, Women, General Entrepreneurs (Age 18-45)",
      targetUsersHi: "ग्रामीण व शहरी युवा, एससी/एसटी, महिला, सामान्य उद्यमी (आयु 18-45 वर्ष)",
      targetUsersMr: "ग्रामीण व शहरी तरुण, महिला उद्योजक, मागासवर्गीय व सर्वसाधारण (वय १८ ते ४५ वर्षे)",
      benefitsJson: [
        { en: "Up to Rs 50 Lakhs loan for Manufacturing units", hi: "विनिर्माण इकाइयों के लिए ₹50 लाख तक का ऋण", mr: "उत्पादन व्यवसायासाठी ₹५० लाखांपर्यंत कर्ज" },
        { en: "Up to Rs 10 Lakhs loan for Service & Business units", hi: "सेवा और व्यवसाय इकाइयों के लिए ₹10 लाख तक का ऋण", mr: "सेवा क्षेत्रातील व्यवसायासाठी ₹१० लाखांपर्यंत कर्ज" },
        { en: "15% to 35% Capital Subsidy based on category & rural location", hi: "श्रेणी और ग्रामीण स्थान के आधार पर 15% से 35% तक सब्सिडी", mr: "ग्रामीण भागातील उद्योजकांसाठी १५% ते ३५% पर्यंत भांडवली अनुदान (Subsidy)" },
      ],
      eligibilityJson: {
        minAge: 18,
        maxAge: 45,
        qualification: "Pass 7th std for projects above Rs 10 Lakhs",
        residence: "Maharashtra Resident (minimum 10 years)",
        incomeLimit: "No upper income ceiling",
      },
      documentsJson: [
        { name: "Aadhaar Card", required: true },
        { name: "PAN Card", required: true },
        { name: "Domicile Certificate of Maharashtra", required: true },
        { name: "Project Report (Detailed Business Plan)", required: true },
        { name: "Educational Qualification Certificate (7th/10th Pass)", required: true },
        { name: "Caste Certificate (if applicable for higher subsidy)", required: false },
        { name: "Passport size photograph & Bank Passbook copy", required: true },
      ],
      applicationProcessJson: [
        { step: 1, textEn: "Register on the official Directorate of Industries CMEGP online portal", textMr: "उद्योग संचालनालयाच्या अधिकृत CMEGP ऑनलाईन पोर्टलवर नोंदणी करा" },
        { step: 2, textEn: "Fill in personal details, select DIC/KVIB agency, and upload project report & documents", textMr: "वैयक्तिक माहिती भरा, जिल्हा उद्योग केंद्र (DIC) किंवा KVIB एजन्सी निवडा व प्रकल्प अहवाल अपलोड करा" },
        { step: 3, textEn: "District Level Task Force Committee (DLTFC) interview & verification", textMr: "जिल्हास्तरीय टास्क फोर्स समितीमार्फत मुलाखत आणि कागदपत्र पडताळणी" },
        { step: 4, textEn: "Bank sanction & disbursement of loan along with subsidy margin money", textMr: "बँक कर्ज मंजुरी आणि अनुदानाची रक्कम (Margin Money) खात्यात जमा" },
      ],
      officialUrl: "https://cmegp.mahait.org/",
      sourceName: "Directorate of Industries, Govt of Maharashtra",
      applicableScope: "Maharashtra State",
    },
    {
      nameEn: "Balasaheb Thackeray SMART Project for Agribusiness & FPOs",
      nameHi: "बालासाहेब ठाकरे स्मार्ट प्रकल्प (कृषि व्यवसाय एवं एफपीओ)",
      nameMr: "मा. बाळासाहेब ठाकरे स्मार्ट कृषी व्यवसाय व ग्रामीण परिवर्तन प्रकल्प",
      descriptionEn: "60% financial grant to Farmer Producer Organizations (FPOs), SHGs, and Rural Agribusinesses for food processing, cold storage, and market linkages.",
      descriptionHi: "खाद्य प्रसंस्करण, कोल्ड स्टोरेज और बाजार संपर्कों के लिए एफपीओ और महिला बचत समूहों को 60% वित्तीय सहायता।",
      descriptionMr: "शेतकरी उत्पादक कंपन्या (FPO), महिला बचत गट आणि कृषी उद्योजकांना अन्न प्रक्रिया, शीतगृह व बाजारपेठ जोडणीसाठी ६०% पर्यंत शासकीय अनुदान.",
      categoryId: categoryMap["agriculture"],
      targetUsersEn: "Farmer Producer Companies (FPOs), Farmer Collectives, SHG Federations",
      targetUsersHi: "किसान उत्पादक कंपनियां (FPO), महिला स्वयं सहायता समूह संघ",
      targetUsersMr: "शेतकरी उत्पादक कंपन्या (FPO), महिला बचत गट महासंघ, कृषी उद्योजक",
      benefitsJson: [
        { en: "Up to 60% Matching Grant for project cost up to Rs 1 Crore", hi: "₹1 करोड़ तक की परियोजना लागत के लिए 60% तक मैचिंग अनुदान", mr: "प्रकल्प खर्चाच्या ६०% पर्यंत थेट शासकीय अनुदान" },
        { en: "Cold storage, sorting, grading, and direct market access support", hi: "कोल्ड स्टोरेज, ग्रेडिंग और डायरेक्ट मार्केट लिंकेज सपोर्ट", mr: "शीतगृह, प्रतवारी केंद्र, पॅकहाऊस आणि थेट बाजारपेठ सुविधा" },
      ],
      eligibilityJson: {
        applicantType: "Registered FPO or SHG Federation with minimum 50 farmer members",
        state: "Maharashtra",
        auditedAccounts: "Audit completed for at least 1 financial year",
      },
      documentsJson: [
        { name: "FPO Registration Certificate (ROC Certificate)", required: true },
        { name: "List of Farmer Members with Aadhaar & Land Extracts (7/12)", required: true },
        { name: "Audited Financial Balance Sheet (Last 1-2 years)", required: true },
        { name: "Detailed Project Report (DPR) for Processing / Packhouse", required: true },
        { name: "Bank Account Details & Board Resolution", required: true },
      ],
      applicationProcessJson: [
        { step: 1, textEn: "Apply online through Maharashtra SMART portal during call for proposals", textMr: "स्मार्ट प्रकल्पाच्या अधिकृत पोर्टलवर ऑनलाईन अर्ज सादर करा" },
        { step: 2, textEn: "District Agriculture Officer (DAO) & Technical Committee inspection", textMr: "जिल्हा अधीक्षक कृषी अधिकारी आणि तांत्रिक समितीमार्फत तपासणी" },
        { step: 3, textEn: "Project Approval Committee sanction & fund release in phases", textMr: "प्रकल्प मंजुरी समितीची मान्यता आणि टप्प्याटप्प्याने अनुदान वितरण" },
      ],
      officialUrl: "https://www.smart-mh.org/",
      sourceName: "Department of Agriculture, Govt of Maharashtra",
      applicableScope: "Maharashtra State",
    },
    {
      nameEn: "Pradhan Mantri Formalisation of Micro Food Processing Enterprises (PMFME)",
      nameHi: "प्रधानमंत्री सूक्ष्म खाद्य उद्योग उन्नयन योजना (PMFME)",
      nameMr: "प्रधानमंत्री सूक्ष्म अन्न प्रक्रिया उद्योग योजना (PMFME)",
      descriptionEn: "35% credit-linked capital subsidy up to Rs 10 Lakhs for individual micro food processing units (flour mills, spice processing, jaggery, bakery, fruit pulp).",
      descriptionHi: "व्यक्तिगत सूक्ष्म खाद्य प्रसंस्करण इकाइयों के लिए 35% क्रेडिट-लिंक्ड सब्सिडी (अधिकतम ₹10 लाख)।",
      descriptionMr: "वैयक्तिक सूक्ष्म अन्न प्रक्रिया उद्योगांसाठी (उदा. गिरणी, मसाले, गूळ, बेकरी, फळ प्रक्रिया) ३५% क्रेडिट लिंक्ड भांडवली अनुदान (कमाल १० लाख रुपये).",
      categoryId: categoryMap["food-processing"],
      targetUsersEn: "Individual Micro Entrepreneurs, SHG Members, Rural Women Food Processors",
      targetUsersHi: "व्यक्तिगत सूक्ष्म उद्यमी, महिला स्वयं सहायता समूह, खाद्य प्रसंस्करणकर्ता",
      targetUsersMr: "वैयक्तिक अन्न प्रक्रिया उद्योजक, महिला बचत गट सदस्य, ग्रामीण महिला",
      benefitsJson: [
        { en: "35% subsidy on project cost up to maximum Rs 10 Lakhs", hi: "परियोजना लागत का 35% सब्सिडी (अधिकतम ₹10 लाख)", mr: "प्रकल्प खर्चावर ३५% अनुदान (जास्तीत जास्त ₹१० लाख)" },
        { en: "Skill training, FSSAI licensing support, and branding assistance", hi: "कौशल प्रशिक्षण, FSSAI लाइसेंसिंग और ब्रांडिंग सहायता", mr: "प्रशिक्षण, FSSAI परवाना सहाय्य आणि ब्रँडिंग मदत" },
      ],
      eligibilityJson: {
        minAge: 18,
        ownership: "Proprietorship, Partnership, or SHG member",
        sector: "Micro Food Processing Unit",
      },
      documentsJson: [
        { name: "Aadhaar & PAN Card", required: true },
        { name: "Bank Passbook & 6 months statement", required: true },
        { name: "Udyam Registration Certificate", required: true },
        { name: "Food Processing Machinery Quotation", required: true },
        { name: "FSSAI License / Registration Copy", required: false },
      ],
      applicationProcessJson: [
        { step: 1, textEn: "Register on Ministry of Food Processing Industries (MoFPI) PMFME portal", textMr: "PMFME च्या अधिकृत राष्ट्रीय पोर्टलवर ऑनलाईन अर्ज करा" },
        { step: 2, textEn: "District Resource Person (DRP) assists in preparing DPR and Bank Application", textMr: "जिल्हा रिसोर्स पर्सन (DRP) द्वारे प्रकल्प अहवाल व बँक अर्जात मोफत मदत" },
        { step: 3, textEn: "Bank sanction & subsidy credit directly to applicant account", textMr: "बँक कर्ज मंजुरी आणि अनुदानाची रक्कम खात्यात वर्ग" },
      ],
      officialUrl: "https://pmfme.mofpi.gov.in/",
      sourceName: "Ministry of Food Processing Industries & Govt of Maharashtra",
      applicableScope: "All India / Maharashtra",
    },
    {
      nameEn: "Pradhan Mantri Mudra Yojana (PMMY - Shishu / Kishor / Tarun)",
      nameHi: "प्रधानमंत्री मुद्रा योजना (PMMY)",
      nameMr: "प्रधानमंत्री मुद्रा योजना (PMMY - शिशु, किशोर, तरुण)",
      descriptionEn: "Collateral-free business loans up to Rs 10 Lakhs for micro-enterprises in retail, repair shops, village services, and small manufacturing.",
      descriptionHi: "खुदरा, मरम्मत की दुकानों और छोटे विनिर्माण के लिए ₹10 लाख तक का बिना गारंटी का व्यापार ऋण।",
      descriptionMr: "किरकोळ विक्री, दुरुस्ती दुकाने, ग्रामीण सेवा आणि लघुउद्योगांसाठी १० लाख रुपयांपर्यंतचे विनातारण (Collateral-Free) बँक कर्ज.",
      categoryId: categoryMap["retail-services"],
      targetUsersEn: "Small Retailers, Shopkeepers, Repair Technicians, Micro Manufacturers",
      targetUsersHi: "छोटे दुकानदार, मरम्मत तकनीशियन, खुदरा व्यापारी",
      targetUsersMr: "छोटे व्यावसायिक, दुकानदार, टपरीधारक, तंत्रज्ञ आणि सेवा पुरवठादार",
      benefitsJson: [
        { en: "Shishu Category: Loan up to Rs 50,000 for starting small shops", hi: "शिशु वर्ग: छोटे व्यवसायों के लिए ₹50,000 तक का ऋण", mr: "शिशू कर्ज: ₹५०,००० पर्यंत (लहान दुकानांसाठी)" },
        { en: "Kishor Category: Loan from Rs 50,001 to Rs 5 Lakhs", hi: "किशोर वर्ग: ₹50,001 से ₹5 लाख तक का ऋण", mr: "किशोर कर्ज: ₹५०,००१ ते ₹५ लाखांपर्यंत" },
        { en: "Tarun Category: Loan from Rs 5 Lakhs to Rs 10 Lakhs", hi: "तरुण वर्ग: ₹5 लाख से ₹10 लाख तक का ऋण", mr: "तरुण कर्ज: ₹५ लाख ते ₹१० लाखांपर्यंत" },
        { en: "Zero collateral requirement & affordable bank interest rates", hi: "शून्य गारंटी की आवश्यकता और सस्ती ब्याज दरें", mr: "कोणतेही तारण न देता (Collateral-Free) सहज कर्ज" },
      ],
      eligibilityJson: {
        minAge: 18,
        creditScore: "Clean CIBIL track record (No default)",
        sector: "Non-farm micro enterprise in manufacturing, trading, or service",
      },
      documentsJson: [
        { name: "Mudra Loan Application Form", required: true },
        { name: "Aadhaar Card & Voter ID", required: true },
        { name: "PAN Card", required: true },
        { name: "Business Address Proof (Shop License / Gram Panchayat NOC)", required: true },
        { name: "Quotation of Machinery / Items to be purchased", required: true },
      ],
      applicationProcessJson: [
        { step: 1, textEn: "Approach any Public Sector Bank, Gramin Bank (MGB), or apply via JanSamarth portal", textMr: "कोणत्याही राष्ट्रीयीकृत किंवा महाराष्ट्र ग्रामीण बँकेत / जनसमर्थ पोर्टलवर अर्ज करा" },
        { step: 2, textEn: "Submit Mudra application form along with business plan & ID proofs", textMr: "व्यवसाय आराखडा आणि ओळखपत्रांसह मुद्रा अर्ज जमा करा" },
        { step: 3, textEn: "Bank manager verification and loan approval within 7-14 working days", textMr: "बँक व्यवस्थापकाद्वारे पडताळणी आणि ७ ते १४ दिवसांत कर्ज वितरण" },
      ],
      officialUrl: "https://www.mudra.org.in/",
      sourceName: "Ministry of Finance, Govt of India",
      applicableScope: "All India / Maharashtra",
    },
    {
      nameEn: "Sharad Pawar Gramsamruddhi Yojana (Cowshed & Poultry Support)",
      nameHi: "शरद पवार ग्रामसमृद्धि योजना (गोशाला एवं मुर्गी पालन)",
      nameMr: "शरद पवार ग्रामसमृद्धी योजना (पक्का गोठा व शेळी/कुक्कुटपालन शेड)",
      descriptionEn: "Financial grant under MGNREGA for constructing permanent cowsheds, goat sheds, and poultry sheds for rural farmers and dairy entrepreneurs in Maharashtra.",
      descriptionHi: "महाराष्ट्र में किसानों के लिए पक्के मवेशी शेड, बकरी शेड और मुर्गी पालन शेड के निर्माण के लिए मनरेगा के तहत वित्तीय सहायता।",
      descriptionMr: "महाराष्ट्रातील शेतकरी व दुग्ध व्यावसायिकांना पक्का गोठा, शेळीपालन शेड व कुक्कुटपालन शेड बांधण्यासाठी रोहयो (MGNREGA) अंतर्गत थेट अनुदान.",
      categoryId: categoryMap["dairy"],
      targetUsersEn: "Small Farmers, Dairy Cattle Owners, Goat Rearers, Rural Households",
      targetUsersHi: "छोटे किसान, डेयरी मवेशी मालिक, बकरी पालक",
      targetUsersMr: "लहान शेतकरी, दुग्ध व्यावसायिक, शेळीपालक व ग्रामीण कुटुंबे",
      benefitsJson: [
        { en: "Up to Rs 77,000 grant for constructing concrete cowshed for 2-6 cattle", hi: "2-6 मवेशियों के पक्के शेड के लिए ₹77,000 तक अनुदान", mr: "२ ते ६ गुरांसाठी पक्का गोठा बांधण्यास ₹७७,००० अनुदान" },
        { en: "Up to Rs 49,000 grant for Goat shed construction", hi: "बकरी शेड निर्माण के लिए ₹49,000 तक अनुदान", mr: "शेळीपालन शेडसाठी ₹४९,००० अनुदान" },
        { en: "Up to Rs 49,000 grant for Poultry shed construction", hi: "मुर्गी पालन शेड निर्माण के लिए ₹49,000 तक अनुदान", mr: "कुक्कुटपालन शेडसाठी ₹४९,००० अनुदान" },
      ],
      eligibilityJson: {
        residence: "Maharashtra Rural Resident",
        landRecord: "Must hold agricultural land or valid house site in Gram Panchayat",
        jobCard: "MGNREGA Job Card holder",
      },
      documentsJson: [
        { name: "Gram Sabha Resolution Copy", required: true },
        { name: "Job Card Copy", required: true },
        { name: "Land Extract 7/12 & 8A", required: true },
        { name: "Aadhaar Card & Bank Account Passbook", required: true },
      ],
      applicationProcessJson: [
        { step: 1, textEn: "Submit written application to Gram Sevak / Gram Panchayat office", textMr: "ग्रामसेवक / ग्रामपंचायत कार्यालयात लेखी अर्ज सादर करा" },
        { step: 2, textEn: "Inclusion of proposal in Gram Sabha annual MGNREGA shelf of works", textMr: "ग्रामसभेच्या वार्षिक रोहयो कामाच्या आराखड्यात मंजुरी" },
        { step: 3, textEn: "Technical sanction by Panchayat Samiti Engineer & geotagged construction", textMr: "पंचायत समिती अभियंत्याकडून तांत्रिक मान्यता आणि जिओटॅगिंगनंतर अनुदान जमा" },
      ],
      officialUrl: "https://egovernance.mahaonline.gov.in/",
      sourceName: "Rural Development Dept, Govt of Maharashtra",
      applicableScope: "Maharashtra State",
    },
    {
      nameEn: "Stand Up India Scheme for Women & SC/ST Entrepreneurs",
      nameHi: "स्टैंड अप इंडिया योजना (महिला एवं एससी/एसटी)",
      nameMr: "स्टँड अप इंडिया योजना (महिला व मागासवर्गीय उद्योजकांसाठी)",
      descriptionEn: "Bank loans between Rs 10 Lakhs and Rs 1 Crore for setting up greenfield manufacturing, trading, or service enterprises by Scheduled Caste (SC), Scheduled Tribe (ST), or Women entrepreneurs.",
      descriptionHi: "अनुसूचित जाति (SC), अनुसूचित जनजाति (ST) या महिला उद्यमियों द्वारा नए उद्यम स्थापित करने के लिए ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण।",
      descriptionMr: "महिला व अनुसुचित जाती/जमाती (SC/ST) उद्योजकांना नवीन उत्पादन किंवा सेवा उद्योग सुरू करण्यासाठी १० लाख ते १ कोटी रुपयांपर्यंतचे बँक कर्ज.",
      categoryId: categoryMap["handicrafts"],
      targetUsersEn: "Women Entrepreneurs (All categories), SC/ST Entrepreneurs (Age 18+)",
      targetUsersHi: "महिला उद्यमी (सभी वर्ग), एससी/एसटी उद्यमी (आयु 18+)",
      targetUsersMr: "महिला उद्योजक (सर्व प्रवर्ग), अनुसूचित जाती व जमाती उद्योजक",
      benefitsJson: [
        { en: "Bank loan from Rs 10 Lakhs up to Rs 1 Crore", hi: "₹10 लाख से ₹1 करोड़ तक का बैंक ऋण", mr: "१० लाख ते १ कोटी रुपयांपर्यंतचे बँक कर्ज" },
        { en: "Includes composite loan (Term loan & Working capital)", hi: "मिश्रित ऋण शामिल (टर्म लोन और कार्यशील पूंजी)", mr: "टर्म लोन आणि खेळते भांडवल (Working Capital) एकत्र उपलब्ध" },
        { en: "Handholding support from SIDBI & Credit Guarantee Fund protection", hi: "सिडबी द्वारा हैंडहोल्डिंग सहायता और क्रेडिट गारंटी सुरक्षा", mr: "सिडबी (SIDBI) द्वारे मोफत तांत्रिक व प्रशासकीय मार्गदर्शन" },
      ],
      eligibilityJson: {
        minAge: 18,
        category: "SC/ST and/or Woman Entrepreneur",
        natureOfEnterprise: "Greenfield (First time business venture)",
      },
      documentsJson: [
        { name: "Aadhaar & PAN Card", required: true },
        { name: "Caste Certificate (For SC/ST applicants)", required: false },
        { name: "Detailed Business Project Report", required: true },
        { name: "Proof of Business Premises / Lease Agreement", required: true },
        { name: "Bank Statement of last 6 months", required: true },
      ],
      applicationProcessJson: [
        { step: 1, textEn: "Register online on Stand Up India portal (www.standupmitra.in)", textMr: "Stand Up Mitra ऑनलाईन पोर्टलवर नोंदणी करा" },
        { step: 2, textEn: "Select target scheduled commercial bank branch in your district", textMr: "तुमच्या जिल्ह्यातील जवळची बँक शाखा निवडा" },
        { step: 3, textEn: "Bank appraisal, sanction, and subsidy margin support", textMr: "बँकेकडून अर्जाची छाननी, कर्ज मंजुरी व निधी वितरण" },
      ],
      officialUrl: "https://www.standupmitra.in/",
      sourceName: "SIDBI & Ministry of Finance, Govt of India",
      applicableScope: "All India / Maharashtra",
    },
  ];

  for (const s of schemesData) {
    const existing = await prisma.scheme.findFirst({
      where: { nameEn: s.nameEn },
    });

    if (!existing) {
      const createdScheme = await prisma.scheme.create({
        data: s,
      });

      // Link to Pune & Nashik as demo district connections
      await prisma.schemeDistrict.createMany({
        data: [
          { schemeId: createdScheme.id, districtId: districtMap["pune"] },
          { schemeId: createdScheme.id, districtId: districtMap["nashik"] },
          { schemeId: createdScheme.id, districtId: districtMap["aurangabad"] },
          { schemeId: createdScheme.id, districtId: districtMap["ahmednagar"] },
        ],
        skipDuplicates: true,
      });
    }
  }

  console.log("Verified Maharashtra Government Schemes seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
