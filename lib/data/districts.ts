export interface DistrictData {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  region: string;
  dicAddress: string;
  dicContact: string;
  _count?: {
    schemes: number;
  };
}

export const MAHARASHTRA_DISTRICTS: DistrictData[] = [
  { slug: "pune", id: "dist-pune", nameEn: "Pune", nameHi: "पुणे", nameMr: "पुणे", region: "Paschim Maharashtra", dicAddress: "DIC Office, Agriculture College Campus, Shivajinagar, Pune", dicContact: "020-25537248", _count: { schemes: 6 } },
  { slug: "nashik", id: "dist-nashik", nameEn: "Nashik", nameHi: "नासिक", nameMr: "नाशिक", region: "Khandesh", dicAddress: "DIC Office, MIDC Ambad, Nashik", dicContact: "0253-2381204", _count: { schemes: 6 } },
  { slug: "aurangabad", id: "dist-aurangabad", nameEn: "Chhatrapati Sambhajinagar", nameHi: "छत्रपति संभाजीनगर", nameMr: "छत्रपती संभाजीनगर", region: "Marathwada", dicAddress: "DIC Office, Station Road, Chhatrapati Sambhajinagar", dicContact: "0240-2334812", _count: { schemes: 6 } },
  { slug: "ahmednagar", id: "dist-ahmednagar", nameEn: "Ahilyanagar", nameHi: "अहिल्यानगर", nameMr: "अहिल्यानगर", region: "Paschim Maharashtra", dicAddress: "DIC Office, Collectorate Annexe, Ahilyanagar", dicContact: "0241-2323891", _count: { schemes: 5 } },
  { slug: "kolhapur", id: "dist-kolhapur", nameEn: "Kolhapur", nameHi: "कोल्हापुर", nameMr: "कोल्हापूर", region: "Paschim Maharashtra", dicAddress: "DIC Office, Tarabai Park, Kolhapur", dicContact: "0231-2651478", _count: { schemes: 5 } },
  { slug: "nagpur", id: "dist-nagpur", nameEn: "Nagpur", nameHi: "नागपुर", nameMr: "नागपूर", region: "Vidarbha", dicAddress: "DIC Office, Civil Lines, Nagpur", dicContact: "0712-2560831", _count: { schemes: 5 } },
  { slug: "satara", id: "dist-satara", nameEn: "Satara", nameHi: "सतारा", nameMr: "सातारा", region: "Paschim Maharashtra", dicAddress: "DIC Office, Powai Naka, Satara", dicContact: "02162-234125", _count: { schemes: 5 } },
  { slug: "sangli", id: "dist-sangli", nameEn: "Sangli", nameHi: "सांगली", nameMr: "सांगली", region: "Paschim Maharashtra", dicAddress: "DIC Office, Rajwada Chowk, Sangli", dicContact: "0233-2321456", _count: { schemes: 5 } },
  { slug: "solapur", id: "dist-solapur", nameEn: "Solapur", nameHi: "सोलापुर", nameMr: "सोलापूर", region: "Paschim Maharashtra", dicAddress: "DIC Office, Sidheshwar Peth, Solapur", dicContact: "0217-2728901", _count: { schemes: 5 } },
  { slug: "nanded", id: "dist-nanded", nameEn: "Nanded", nameHi: "नांदेड़", nameMr: "नांदेड", region: "Marathwada", dicAddress: "DIC Office, VIP Road, Nanded", dicContact: "02462-251234", _count: { schemes: 5 } },
  { slug: "amravati", id: "dist-amravati", nameEn: "Amravati", nameHi: "अमरावती", nameMr: "अमरावती", region: "Vidarbha", dicAddress: "DIC Office, Camp Area, Amravati", dicContact: "0721-2662389", _count: { schemes: 5 } },
  { slug: "latur", id: "dist-latur", nameEn: "Latur", nameHi: "लातूर", nameMr: "लातूर", region: "Marathwada", dicAddress: "DIC Office, MIDC Area, Latur", dicContact: "02382-221456", _count: { schemes: 5 } },
  { slug: "jalgaon", id: "dist-jalgaon", nameEn: "Jalgaon", nameHi: "जलगांव", nameMr: "जळगाव", region: "Khandesh", dicAddress: "DIC Office, Old B.J. Market, Jalgaon", dicContact: "0257-2223456", _count: { schemes: 5 } },
  { slug: "thane", id: "dist-thane", nameEn: "Thane", nameHi: "ठाणे", nameMr: "ठाणे", region: "Konkan", dicAddress: "DIC Office, Wagle Estate, Thane", dicContact: "022-25821234", _count: { schemes: 5 } },
  { slug: "raigad", id: "dist-raigad", nameEn: "Raigad", nameHi: "रायगढ़", nameMr: "रायगड", region: "Konkan", dicAddress: "DIC Office, Alibag, Raigad", dicContact: "02141-222345", _count: { schemes: 5 } },
  { slug: "ratnagiri", id: "dist-ratnagiri", nameEn: "Ratnagiri", nameHi: "रत्नागिरी", nameMr: "रत्नागिरी", region: "Konkan", dicAddress: "DIC Office, Kuwarbav, Ratnagiri", dicContact: "02352-228901", _count: { schemes: 5 } },
  { slug: "sindhudurg", id: "dist-sindhudurg", nameEn: "Sindhudurg", nameHi: "सिंधुदुर्ग", nameMr: "सिंधुदुर्ग", region: "Konkan", dicAddress: "DIC Office, Oros, Sindhudurg", dicContact: "02362-228345", _count: { schemes: 5 } },
  { slug: "chandrapur", id: "dist-chandrapur", nameEn: "Chandrapur", nameHi: "चंद्रपुर", nameMr: "चंद्रपूर", region: "Vidarbha", dicAddress: "DIC Office, Collectorate, Chandrapur", dicContact: "07172-255678", _count: { schemes: 5 } },
  { slug: "yavatmal", id: "dist-yavatmal", nameEn: "Yavatmal", nameHi: "यवतमाल", nameMr: "यवतमाळ", region: "Vidarbha", dicAddress: "DIC Office, Main Road, Yavatmal", dicContact: "07232-244123", _count: { schemes: 5 } },
  { slug: "buldhana", id: "dist-buldhana", nameEn: "Buldhana", nameHi: "बुलढाणा", nameMr: "बुलढाणा", region: "Vidarbha", dicAddress: "DIC Office, Civil Lines, Buldhana", dicContact: "07262-242345", _count: { schemes: 5 } },
  { slug: "akola", id: "dist-akola", nameEn: "Akola", nameHi: "अकोला", nameMr: "अकोला", region: "Vidarbha", dicAddress: "DIC Office, Murtizapur Road, Akola", dicContact: "0724-2431234", _count: { schemes: 5 } },
  { slug: "washim", id: "dist-washim", nameEn: "Washim", nameHi: "वाशिम", nameMr: "वाशीम", region: "Vidarbha", dicAddress: "DIC Office, Collectorate, Washim", dicContact: "07252-232145", _count: { schemes: 5 } },
  { slug: "wardha", id: "dist-wardha", nameEn: "Wardha", nameHi: "वर्धा", nameMr: "वर्धा", region: "Vidarbha", dicAddress: "DIC Office, Sewagram Road, Wardha", dicContact: "07152-243567", _count: { schemes: 5 } },
  { slug: "bhandara", id: "dist-bhandara", nameEn: "Bhandara", nameHi: "भंडारा", nameMr: "भंडारा", region: "Vidarbha", dicAddress: "DIC Office, Main Highway, Bhandara", dicContact: "07184-252345", _count: { schemes: 5 } },
  { slug: "gondia", id: "dist-gondia", nameEn: "Gondia", nameHi: "गोंदिया", nameMr: "गोंदिया", region: "Vidarbha", dicAddress: "DIC Office, Kudwa Line, Gondia", dicContact: "07182-236789", _count: { schemes: 5 } },
  { slug: "gadchiroli", id: "dist-gadchiroli", nameEn: "Gadchiroli", nameHi: "गडचिरोली", nameMr: "गडचिरोली", region: "Vidarbha", dicAddress: "DIC Office, Complex Area, Gadchiroli", dicContact: "07132-222123", _count: { schemes: 5 } },
  { slug: "parbhani", id: "dist-parbhani", nameEn: "Parbhani", nameHi: "परभणी", nameMr: "परभणी", region: "Marathwada", dicAddress: "DIC Office, Basmat Road, Parbhani", dicContact: "02452-223456", _count: { schemes: 5 } },
  { slug: "hingoli", id: "dist-hingoli", nameEn: "Hingoli", nameHi: "हिंगोली", nameMr: "हिंगोली", region: "Marathwada", dicAddress: "DIC Office, Nanded Bypass, Hingoli", dicContact: "02456-221234", _count: { schemes: 5 } },
  { slug: "beed", id: "dist-beed", nameEn: "Beed", nameHi: "बीड", nameMr: "बीड", region: "Marathwada", dicAddress: "DIC Office, Nagar Road, Beed", dicContact: "02442-222345", _count: { schemes: 5 } },
  { slug: "osmanabad", id: "dist-osmanabad", nameEn: "Dharashiv", nameHi: "धाराशिव", nameMr: "धाराशिव", region: "Marathwada", dicAddress: "DIC Office, Solapur Road, Dharashiv", dicContact: "02472-223145", _count: { schemes: 5 } },
  { slug: "jalna", id: "dist-jalna", nameEn: "Jalna", nameHi: "जालना", nameMr: "जालना", region: "Marathwada", dicAddress: "DIC Office, Devalgaon Raja Road, Jalna", dicContact: "02482-224567", _count: { schemes: 5 } },
  { slug: "dhule", id: "dist-dhule", nameEn: "Dhule", nameHi: "धुले", nameMr: "धुळे", region: "Khandesh", dicAddress: "DIC Office, Sakri Road, Dhule", dicContact: "02562-232145", _count: { schemes: 5 } },
  { slug: "nandurbar", id: "dist-nandurbar", nameEn: "Nandurbar", nameHi: "नंदुरबार", nameMr: "नंदुरबार", region: "Khandesh", dicAddress: "DIC Office, Collectorate, Nandurbar", dicContact: "02564-222345", _count: { schemes: 5 } },
  { slug: "palghar", id: "dist-palghar", nameEn: "Palghar", nameHi: "पालघर", nameMr: "पालघर", region: "Konkan", dicAddress: "DIC Office, Boisar Road, Palghar", dicContact: "02525-252123", _count: { schemes: 5 } },
  { slug: "mumbai-suburban", id: "dist-mumbai-suburban", nameEn: "Mumbai Suburban", nameHi: "मुंबई उपनगर", nameMr: "मुंबई उपनगर", region: "Konkan", dicAddress: "DIC Office, Bandra East, Mumbai", dicContact: "022-26590123", _count: { schemes: 5 } },
  { slug: "mumbai-city", id: "dist-mumbai-city", nameEn: "Mumbai City", nameHi: "मुंबई शहर", nameMr: "मुंबई शहर", region: "Konkan", dicAddress: "DIC Office, World Trade Centre, Cuffe Parade, Mumbai", dicContact: "022-22189012", _count: { schemes: 5 } },
];
