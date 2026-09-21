import { CropData, Supplier, MandiItem, Scheme, LiveMandiPayload } from '../types';

export const translations = {
  EN: {
    cropSelect: "Select Crop",
    landSize: "Land Size",
    prescription: "Digital Prescription",
    timelyAdvice: "Timely Advice",
    urea: "Urea",
    dap: "DAP",
    mop: "MOP (Potash)",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    acres: "Acres",
    tagline: "Precision Advisor",
    location: "Indore, MP",
    voiceAdvisor: "Voice Advisor",
    voiceListening: "Listening for crop or acreage...",
    nearbySuppliers: "Nearby Suppliers",
    mandiPrices: "Mandi Prices",
    voiceSupport: "Voice Support",
    printSave: "Print / Save Receipt",
    issuedDate: "Issued Date",
    serialId: "Serial ID",
    commercialBags: "Commercial Fertilizer Bags",
    totalEstCost: "Est. Total Cost",
    fieldCoverage: "Field Coverage",
    gridScaleMap: "2D Field Scaling Parcel Map",
    gridLegend: "Active Farm Parcels (4 Cells = 1.0 Acre)",
    nutrientSectionTitle: "Nutrient Requirement Gauges",
    nutrientSectionSubtitle: "Dynamic macro-nutrient dosage scaled to your acreage",
    bag: "Bag",
    bags: "Bags",
    weightEquivalent: "50kg per bag",
    close: "Close",
    quickAdd: "Quick Presets",
    govtSub: "Govt. Agronomy Calibration System",
    scanNotice: "Scan at Krishi Seva Kendra for Instant Dispatch",
    suppliersModalTitle: "Certified Agro-Input Distributors (Indore)",
    mandiModalTitle: "Indore & Malwa Region Mandi Rates",
    eligibleGovtSchemes: "Eligible Government Schemes",
    schemesSubtitle: "Direct grants & subsidies dynamically calibrated to your farm profile",
    applyGovIn: "Apply on .gov.in",
    maxAcresLimit: "Max Limit",
    forAllCrops: "Universal Crop Grant",
    noSchemesFound: "No specific schemes found for this land size and crop combination.",
    loadingSchemes: "Querying data.gov.in API (DBT Portal)...",
    mandiTerminalTitle: "Live Market Terminal",
    mandiTerminalSubtitle: "Real-Time Agmarknet API Scraper & Regional Profit Matrix",
    mandiConnecting: "Establishing secure connection to Agmarknet...",
    mandiConnectingSub: "Establishing encrypted SSL handshake • APMC Malwa Cluster",
    chartTitle: "30-Day Volatility & Trend",
    chartSubtitle: "Spline ratio analysis calibrated to spot benchmark (₹/Quintal)",
    chartDate: "Date",
    chartPrice: "Spot Price",
    chartRatio: "Benchmark Ratio",
    tableTitle: "Real-Time Mandi Profit Matrix",
    tableSubtitle: "Calculated net revenue per quintal after transit & handling fees",
    colMandiName: "Mandi Name",
    colDistance: "Distance",
    colGross: "Gross Price",
    colTransport: "Transport Cost",
    colNet: "Net In-Hand",
    colStatus: "Status",
    statusOptimal: "OPTIMAL",
    statusWarning: "WARNING",
    refreshTerminal: "Re-scrape Live Feed",
    dragToClose: "Drag down or press X to close",
    donutChartTitle: "Net Realization Breakdown",
    donutChartSubtitle: "Gross value distribution per quintal of harvested crop",
    farmerInHand: "Farmer In-Hand",
    logisticsFreight: "Logistics & Freight",
    mandiCess: "Mandi Cess & Handling",
    moistureReserve: "Moisture Risk Reserve",
    netPerQtl: "Net Per Qtl",
    pieChartTitle: "Indore Mandi Today's Arrivals",
    pieChartSubtitle: "APMC quality grading & moisture segregation",
    gradeFAQ: "Grade FAQ (Standard)",
    gradeSuperBold: "Grade Super Bold",
    highMoisture: "High-Moisture Stock",
    arrivalQualityNotice: "Current price quotes apply strictly to FAQ and Super Bold grades.",
    tapSliceHint: "Tap a slice to inspect rupee deductions",
    arrivalQualityNoticeSub: "High-moisture stock (>12% moisture) attracts 5-8% dockage discount at APMC gate."
  },
  HI: {
    cropSelect: "फसल चुनें",
    landSize: "जमीन का आकार",
    prescription: "डिजिटल नुस्खा",
    timelyAdvice: "महत्वपूर्ण सुझाव",
    urea: "यूरिया",
    dap: "डीएपी",
    mop: "एमओपी (पोटाश)",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटाश (K)",
    acres: "एकड़",
    tagline: "सटीक कृषि सलाहकार",
    location: "इंदौर, म.प्र.",
    voiceAdvisor: "आवाज़ सहायक",
    voiceListening: "फसल या एकड़ बोलें...",
    nearbySuppliers: "नजदीकी खाद विक्रेता",
    mandiPrices: "मंडी भाव",
    voiceSupport: "वॉयस सहायता",
    printSave: "रसीद प्रिंट / सेव करें",
    issuedDate: "जारी दिनांक",
    serialId: "पर्ची क्रमांक",
    commercialBags: "व्यावसायिक उर्वरक बोरी की मात्रा",
    totalEstCost: "अनुमानित कुल लागत",
    fieldCoverage: "खेत का रकबा",
    gridScaleMap: "2D खेत भूखंड नक्शा",
    gridLegend: "सक्रिय खेत भूखंड (4 सेल = 1.0 एकड़)",
    nutrientSectionTitle: "पोषक तत्व आवश्यकता (N-P-K)",
    nutrientSectionSubtitle: "आपके रकबे के अनुसार शुद्ध पोषक तत्वों की मात्रा",
    bag: "बोरी",
    bags: "बोरी",
    weightEquivalent: "50 किग्रा प्रति बोरी",
    close: "बंद करें",
    quickAdd: "त्वरित आकार",
    govtSub: "प्रमाणित कृषि विज्ञान अनुशंसा",
    scanNotice: "कृषि सेवा केंद्र पर त्वरित वितरण हेतु स्कैन कराएं",
    suppliersModalTitle: "सत्यापित कृषि इनपुट विक्रेता (इंदौर)",
    mandiModalTitle: "इंदौर व मालवा संभाग दैनिक मंडी भाव",
    eligibleGovtSchemes: "पात्र सरकारी योजनाएं एवं अनुदान",
    schemesSubtitle: "आपके खेत के रकबे और फसल के अनुसार स्वतः सत्यापित योजनाएं",
    applyGovIn: ".gov.in पर आवेदन करें",
    maxAcresLimit: "अधिकतम सीमा",
    forAllCrops: "सार्वभौमिक कृषि अनुदान",
    noSchemesFound: "इस रकबे और फसल संयोजन के लिए कोई विशिष्ट योजना नहीं मिली।",
    loadingSchemes: "data.gov.in पोर्टल से योजनाएं लोड हो रही हैं...",
    mandiTerminalTitle: "लाइव मार्केट टर्मिनल",
    mandiTerminalSubtitle: "Agmarknet लाइव एपीआई स्क्रैपर एवं क्षेत्रीय लाभ मैट्रिक्स",
    mandiConnecting: "Agmarknet से सुरक्षित कनेक्शन स्थापित किया जा रहा है...",
    mandiConnectingSub: "एन्क्रिप्टेड एसएसएल हैंडशेक जारी • एपीएमसी मालवा संभाग",
    chartTitle: "30-दिवसीय मूल्य उतार-चढ़ाव एवं रुझान",
    chartSubtitle: "स्पॉट बेंचमार्क के आधार पर मूल्य एवं अनुपात विश्लेषण (₹/क्विंटल)",
    chartDate: "दिनांक",
    chartPrice: "मंडी भाव",
    chartRatio: "बेंचमार्क अनुपात",
    tableTitle: "वास्तविक समय मंडी लाभ मैट्रिक्स",
    tableSubtitle: "परिवहन और हैंडलिंग लागत काटकर शुद्ध प्राप्त राशि प्रति क्विंटल",
    colMandiName: "मंडी का नाम",
    colDistance: "दूरी",
    colGross: "सकल भाव",
    colTransport: "परिवहन खर्च",
    colNet: "शुद्ध प्राप्त राशि",
    colStatus: "स्थिति",
    statusOptimal: "इष्टतम",
    statusWarning: "सावधानी",
    refreshTerminal: "डेटा पुनः रीफ्रेश करें",
    dragToClose: "नीचे खींचें या X दबाकर बंद करें",
    donutChartTitle: "शुद्ध प्राप्ति विश्लेषण (रुपया वितरण)",
    donutChartSubtitle: "सकल फसल मूल्य का प्रति क्विंटल वितरण",
    farmerInHand: "किसान के हाथ में (शुद्ध)",
    logisticsFreight: "परिवहन एवं ढुलाई",
    mandiCess: "मंडी शुल्क एवं तुलाई",
    moistureReserve: "नमी जोखिम कटौती",
    netPerQtl: "शुद्ध प्रति क्विंटल",
    pieChartTitle: "इंदौर मंडी आज की आवक गुणवत्ता",
    pieChartSubtitle: "एपीएमसी गुणवत्ता ग्रेडिंग एवं नमी वर्गीकरण",
    gradeFAQ: "ग्रेड FAQ (मानक)",
    gradeSuperBold: "ग्रेड सुपर बोल्ड",
    highMoisture: "उच्च नमी स्टॉक (>12%)",
    arrivalQualityNotice: "वर्तमान मंडी भाव केवल FAQ और सुपर बोल्ड ग्रेड पर लागू हैं।",
    tapSliceHint: "सटीक रुपया कटौती देखने के लिए स्लाइस पर टैप करें",
    arrivalQualityNoticeSub: "12% से अधिक नमी वाले स्टॉक पर मंडी गेट पर 5-8% की कटौती लागू होती है।"
  },
  MR: {
    cropSelect: "पीक निवडा",
    landSize: "जमिनीचा आकार",
    prescription: "डिजिटल प्रिस्क्रिप्शन",
    timelyAdvice: "वेळेवर सल्ला",
    urea: "युरिया",
    dap: "डीएपी",
    mop: "एमओपी (पालाश)",
    nitrogen: "नत्र (N)",
    phosphorus: "स्फुरद (P)",
    potassium: "पालाश (K)",
    acres: "एकर",
    tagline: "अचूक कृषी सल्लागार",
    location: "इंदूर, म.प्र.",
    voiceAdvisor: "व्हॉइस सल्लागार",
    voiceListening: "पीक किंवा एकर बोला...",
    nearbySuppliers: "जवळचे खत विक्रेते",
    mandiPrices: "बाजारभाव (मंडी)",
    voiceSupport: "व्हॉइस सपोर्ट",
    printSave: "प्रिस्क्रिप्शन प्रिंट / सेव्ह करा",
    issuedDate: "दिनांक",
    serialId: "प्रिस्क्रिप्शन क्र.",
    commercialBags: "खतांच्या गोण्यांचे अचूक प्रमाण",
    totalEstCost: "अंदाजे एकूण खर्च",
    fieldCoverage: "शेतीचे क्षेत्र",
    gridScaleMap: "2D शेत भूखंड नकाशा",
    gridLegend: "सक्रिय शेत तुकडा (4 चौकोन = 1.0 एकर)",
    nutrientSectionTitle: "अन्नद्रव्य आवश्यकता (N-P-K)",
    nutrientSectionSubtitle: "क्षेत्रफळानुसार आवश्यक मुख्य अन्नद्रव्यांचे प्रमाण",
    bag: "गोणी",
    bags: "गोण्या",
    weightEquivalent: "५० किलो प्रति गोणी",
    close: "बंद करा",
    quickAdd: "झटपट आकार",
    govtSub: "प्रमाणित कृषी विज्ञान शिफारस",
    scanNotice: "कृषी सेवा केंद्रावर दाखवून त्वरित खत मिळवा",
    suppliersModalTitle: "प्रमाणित कृषी केंद्र वितरक (इंदूर)",
    mandiModalTitle: "आजचे बाजारभाव (मंडी दर)",
    eligibleGovtSchemes: "पात्र शासकीय योजना व अनुदान",
    schemesSubtitle: "तुमच्या जमिनीचे क्षेत्रफळ व निवडलेल्या पिकानुसार पात्र योजना",
    applyGovIn: ".gov.in वर अर्ज करा",
    maxAcresLimit: "कमाल मर्यादा",
    forAllCrops: "सर्व पिकांसाठी अनुदान",
    noSchemesFound: "या क्षेत्रफळ आणि पीक संयोजनासाठी कोणतीही विशिष्ट योजना आढळली नाही.",
    loadingSchemes: "data.gov.in पोर्टलवरून योजनांची माहिती आणत आहे...",
    mandiTerminalTitle: "थेट बाजार टर्मिनल",
    mandiTerminalSubtitle: "Agmarknet थेट एपीआय स्क्रॅपर आणि प्रादेशिक नफा मॅट्रिक्स",
    mandiConnecting: "Agmarknet शी सुरक्षित कनेक्शन जोडले जात आहे...",
    mandiConnectingSub: "एनक्रिप्टेड एसएसएल कनेक्शन • एपीएमसी माळवा विभाग",
    chartTitle: "३०-दिवसांची भाव अस्थिरता व कल",
    chartSubtitle: "बाजारभाव चढ-उतार आणि प्रमाण गुणोत्तर विश्लेषण (₹/क्विंटल)",
    chartDate: "दिनांक",
    chartPrice: "बाजारभाव",
    chartRatio: "प्रमाण गुणोत्तर",
    tableTitle: "थेट मंडी नफा विश्लेषण तक्ता",
    tableSubtitle: "वाहतूक आणि हाताळणी खर्च वजा करून निव्वळ रक्कम प्रति क्विंटल",
    colMandiName: "मंडीचे नाव",
    colDistance: "अंतर",
    colGross: "एकूण भाव",
    colTransport: "वाहतूक खर्च",
    colNet: "हातात मिळणारा निव्वळ भाव",
    colStatus: "स्थिती",
    statusOptimal: "सर्वोत्तम",
    statusWarning: "सावधान",
    refreshTerminal: "डेटा पुन्हा रीफ्रेश करा",
    dragToClose: "खाली ओढा किंवा X दाबून बंद करा",
    donutChartTitle: "निव्वळ प्राप्ती विभागणी (रुपया वाटप)",
    donutChartSubtitle: "एकूण पीक मूल्याचे प्रति क्विंटल वाटप",
    farmerInHand: "शेतकऱ्याच्या हातात (निव्वळ)",
    logisticsFreight: "वाहतूक आणि मालवाहतूक",
    mandiCess: "मंडी सेस आणि हाताळणी",
    moistureReserve: "ओलावा जोखीम कपात",
    netPerQtl: "निव्वळ प्रति क्विंटल",
    pieChartTitle: "इंदूर मंडी आजची आवक प्रतवारी",
    pieChartSubtitle: "एपीएमसी प्रतवारी व ओलावा वर्गीकरण",
    gradeFAQ: "ग्रेड FAQ (प्रमाणित)",
    gradeSuperBold: "ग्रेड सुपर बोल्ड",
    highMoisture: "जास्त ओलावा साठा (>१२%)",
    arrivalQualityNotice: "सध्याचे बाजारभाव केवळ FAQ आणि सुपर बोल्ड ग्रेडसाठी लागू आहेत.",
    tapSliceHint: "रुपया कपात पाहण्यासाठी स्लाइसवर टॅप करा",
    arrivalQualityNoticeSub: "१२% पेक्षा जास्त ओलावा असलेल्या मालावर मंडी गेटवर ५-८% दरकपात होते."
  }
};

export const schemesDB: Scheme[] = [
  {
    id: 1,
    nameEN: "PM-KISAN Samman Nidhi",
    nameHI: "पीएम-किसान सम्मान निधि",
    nameMR: "पीएम-किसान सन्मान निधी",
    maxAcres: 10,
    benefitEN: "₹6,000/year income support in 3 equal instalments.",
    benefitHI: "₹6,000/वर्ष प्रत्यक्ष आय सहायता (3 समान किश्तों में)।",
    benefitMR: "₹६,०००/वर्ष थेट उत्पन्न मदत (३ समान हप्त्यांमध्ये).",
    crop: "all",
    portalUrl: "https://pmkisan.gov.in",
    schemeCode: "DBT-PMK-2026"
  },
  {
    id: 2,
    nameEN: "Sub-Mission on Agricultural Mechanization",
    nameHI: "कृषि यंत्रीकरण उप-मिशन (SMAM)",
    nameMR: "कृषी यांत्रिकीकरण उप-अभियान",
    maxAcres: 5,
    benefitEN: "Up to 50% subsidy on equipment, sprayers & implements.",
    benefitHI: "कृषि उपकरणों, स्प्रेयर व ट्रैक्टर यंत्रों पर 50% तक अनुदान।",
    benefitMR: "शेती अवजारे, फवारणी यंत्रे आणि उपकरणांवर ५०% पर्यंत अनुदान.",
    crop: "all",
    portalUrl: "https://agrimachinery.nic.in",
    schemeCode: "SMAM-GOI-04"
  },
  {
    id: 3,
    nameEN: "National Food Security Mission (NFSM)",
    nameHI: "राष्ट्रीय खाद्य सुरक्षा मिशन (NFSM)",
    nameMR: "राष्ट्रीय अन्न सुरक्षा अभियान",
    maxAcres: 10,
    benefitEN: "Subsidized certified seeds, bio-fertilizers and micronutrients.",
    benefitHI: "रियायती दर पर प्रमाणित बीज, जैव उर्वरक व सूक्ष्म पोषक तत्व।",
    benefitMR: "अनुदानित दरात प्रमाणित बियाणे, जैविक खते व सूक्ष्म अन्नद्रव्ये.",
    crop: "wheat",
    portalUrl: "https://nfsm.gov.in",
    schemeCode: "NFSM-WHT-2026"
  },
  {
    id: 4,
    nameEN: "Seed Village Programme",
    nameHI: "बीज ग्राम योजना (Seed Village)",
    nameMR: "बीज ग्राम योजना",
    maxAcres: 5,
    benefitEN: "Financial assistance for certified legume and oilseed production.",
    benefitHI: "प्रमाणित दलहन एवं तिलहन बीज उत्पादन हेतु 50% वित्तीय सहायता।",
    benefitMR: "प्रमाणित कडधान्य व तेलबिया बियाणे उत्पादनासाठी ५०% आर्थिक मदत.",
    crop: "soybean",
    portalUrl: "https://seednet.gov.in",
    schemeCode: "SVP-SOY-99"
  },
  {
    id: 5,
    nameEN: "National Pulses Development Scheme",
    nameHI: "राष्ट्रीय दलहन विकास मिशन",
    nameMR: "राष्ट्रीय कडधान्य विकास योजना",
    maxAcres: 8,
    benefitEN: "Free Rhizobium bio-fertilizer kits & IPM pheromone traps for chickpea.",
    benefitHI: "चने की फसल हेतु निःशुल्क राइजोबियम कल्चर व कीट प्रबंधन किट।",
    benefitMR: "हरभरा पिकासाठी मोफत रायझोबियम जिवाणू किट व कामगंध सापळे.",
    crop: "gram",
    portalUrl: "https://agricoop.nic.in",
    schemeCode: "NPDS-GRM-12"
  },
  {
    id: 6,
    nameEN: "National Mission on Oilseeds & Oil Palm",
    nameHI: "राष्ट्रीय तिलहन मिशन (सरसों प्रोत्साहन)",
    nameMR: "राष्ट्रीय तेलबिया अभियान",
    maxAcres: 6,
    benefitEN: "Free high-yield mustard minikits with 100% subsidized gypsum/sulphur.",
    benefitHI: "उन्नत सरसों बीज मिनीकिट एवं 100% अनुदानित जिप्सम/सल्फर किट।",
    benefitMR: "उन्नत मोहरी बियाणे मिनीकिट आणि १००% अनुदानित गंधक किट.",
    crop: "mustard",
    portalUrl: "https://nmoop.gov.in",
    schemeCode: "NMOOP-MST-08"
  },
  {
    id: 7,
    nameEN: "Cotton Technology Mission & Drip Subsidy",
    nameHI: "कपास प्रौद्योगिकी मिशन एवं ड्रिप अनुदान",
    nameMR: "कापूस तंत्रज्ञान अभियान व ठिबक अनुदान",
    maxAcres: 10,
    benefitEN: "Up to 55% subsidy on micro-irrigation and integrated pest management.",
    benefitHI: "सूक्ष्म/ड्रिप सिंचाई पर 55% तक अनुदान एवं गुलाबी सुंडी नियंत्रण किट।",
    benefitMR: "ठिबक सिंचनावर ५५% पर्यंत अनुदान आणि बोंडअळी नियंत्रण किट.",
    crop: "cotton",
    portalUrl: "https://pmksy.gov.in",
    schemeCode: "CTM-CTN-77"
  }
];

// Asynchronous API simulation for data.gov.in endpoint with 800ms network latency
export const fetchGovernmentSchemes = (cropType: string, landSize: number): Promise<Scheme[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = schemesDB.filter((scheme) => {
        const isAcreageEligible = landSize <= scheme.maxAcres;
        const isCropEligible = scheme.crop === 'all' || scheme.crop === cropType;
        return isAcreageEligible && isCropEligible;
      });
      resolve(filtered);
    }, 800);
  });
};

export const CROPS: CropData[] = [
  {
    id: 'soybean',
    name: {
      EN: 'Soybean',
      HI: 'सोयाबीन',
      MR: 'सोयाबीन'
    },
    botanicalName: 'Glycine max',
    season: {
      EN: 'Kharif Crop',
      HI: 'खरीफ फसल',
      MR: 'खरीप पीक'
    },
    iconName: 'Sprout',
    emoji: '🌱',
    description: {
      EN: 'High-protein oilseed crop thriving in well-drained black soil.',
      HI: 'उच्च प्रोटीन तिलहन फसल, मध्यम से भारी काली मिट्टी के लिए उपयुक्त।',
      MR: 'उत्तम पाण्याचा निचरा होणाऱ्या काळ्या जमिनीत येणारे तेलबिया पीक.'
    },
    npkPerAcre: {
      n: 10,
      p: 46,
      k: 30
    },
    bagMultipliers: {
      urea: 0.2,
      dap: 0.5,
      mop: 0.3
    },
    advice: {
      EN: '⚠️ Apply DAP as basal dose at sowing. Top-dress remaining Urea within 25–30 days.',
      HI: '⚠️ बुवाई के समय डीएपी (DAP) को बेसल खुराक के रूप में डालें। बची हुई यूरिया 25-30 दिनों के भीतर डालें।',
      MR: '⚠️ पेरणीच्या वेळी डीएपी (DAP) बेसल डोस म्हणून द्या. उरलेले युरिया २५-३० दिवसांत द्या.'
    },
    mandiPrice: {
      modal: 4850,
      range: '₹4,600 - ₹5,100 / Qtl',
      trend: 'up'
    },
    soilSuitability: {
      EN: 'Deep Black Cotton Soils (pH 6.5 - 7.5)',
      HI: 'गहरी काली कपास मिट्टी (pH 6.5 - 7.5)',
      MR: 'काळी कसदार जमीन (pH 6.5 - 7.5)'
    }
  },
  {
    id: 'wheat',
    name: {
      EN: 'Wheat',
      HI: 'गेहूं',
      MR: 'गहू'
    },
    botanicalName: 'Triticum aestivum',
    season: {
      EN: 'Rabi Crop',
      HI: 'रबी फसल',
      MR: 'रब्बी पीक'
    },
    iconName: 'Wheat',
    emoji: '🌾',
    description: {
      EN: 'Staple cereal grain requiring split nitrogen applications during crown root initiation.',
      HI: 'प्रमुख खाद्यान्न फसल, ताज मूल अवस्था (CRI) में नाइट्रोजन विभाजन की आवश्यकता होती है।',
      MR: 'प्रमुख अन्नधान्य पीक, मुळांच्या वाढीच्या टप्प्यात योग्य नत्र मात्रा आवश्यक.'
    },
    npkPerAcre: {
      n: 50,
      p: 25,
      k: 20
    },
    bagMultipliers: {
      urea: 1.2,
      dap: 0.8,
      mop: 0.4
    },
    advice: {
      EN: '⚠️ Apply 1/2 Urea at sowing. Split the rest at first irrigation (20 days) and tillering.',
      HI: '⚠️ बुवाई पर 1/2 यूरिया डालें। शेष यूरिया पहली सिंचाई (20 दिन) और कल्ले फूटने पर दें।',
      MR: '⚠️ पेरणीवेळी १/२ युरिया द्या. उरलेला युरिया पहिल्या पाण्यावेळी (२० दिवस) आणि फुटवे फुटताना द्या.'
    },
    mandiPrice: {
      modal: 2680,
      range: '₹2,550 - ₹2,820 / Qtl',
      trend: 'up'
    },
    soilSuitability: {
      EN: 'Clay Loam to Silt Loam soils',
      HI: 'दोमट एवं चिकनी दोमट मिट्टी',
      MR: 'मध्यम ते भारी निचऱ्याची जमीन'
    }
  },
  {
    id: 'gram',
    name: {
      EN: 'Gram (Chickpea)',
      HI: 'चना',
      MR: 'हरभरा (चना)'
    },
    botanicalName: 'Cicer arietinum',
    season: {
      EN: 'Rabi Pulse',
      HI: 'रबी दलहन',
      MR: 'रब्बी कडधान्य'
    },
    iconName: 'Sparkles',
    emoji: '🫘',
    description: {
      EN: 'Nitrogen-fixing pulse crop, highly sensitive to waterlogging, needs balanced phosphorus.',
      HI: 'नाइट्रोजन स्थिरीकरण दलहनी फसल, जलभराव के प्रति संवेदनशील, फास्फोरस की संतुलित मात्रा जरूरी।',
      MR: 'हवेतील नत्र स्थिर करणारे कडधान्य पीक, पाण्याचा साचलेपणा टाळा आणि स्फुरद योग्य द्या.'
    },
    npkPerAcre: {
      n: 8,
      p: 40,
      k: 20
    },
    bagMultipliers: {
      urea: 0.15,
      dap: 0.45,
      mop: 0.25
    },
    advice: {
      EN: '⚠️ Minimal nitrogen needed. Ensure adequate soil moisture before applying DAP.',
      HI: '⚠️ कम से कम नाइट्रोजन की आवश्यकता। डीएपी डालने से पहले मिट्टी में पर्याप्त नमी सुनिश्चित करें।',
      MR: '⚠️ कमीतकमी नत्राची गरज. डीएपी देण्यापूर्वी जमिनीत पुरेसा ओलावा असल्याची खात्री करा.'
    },
    mandiPrice: {
      modal: 6150,
      range: '₹5,900 - ₹6,400 / Qtl',
      trend: 'stable'
    },
    soilSuitability: {
      EN: 'Medium to Heavy soils with good drainage',
      HI: 'अच्छे जल निकास वाली मध्यम से भारी मिट्टी',
      MR: 'मध्यम ते खोल उत्तम निचरा असलेली जमीन'
    }
  },
  {
    id: 'mustard',
    name: {
      EN: 'Mustard',
      HI: 'सरसों',
      MR: 'मोहरी (सरसो)'
    },
    botanicalName: 'Brassica juncea',
    season: {
      EN: 'Rabi Oilseed',
      HI: 'रबी तिलहन',
      MR: 'रब्बी तेलबिया'
    },
    iconName: 'Sun',
    emoji: '🌼',
    description: {
      EN: 'Cruciferous oilseed crop with critical sulphur and nitrogen requirements for oil synthesis.',
      HI: 'महत्वपूर्ण तिलहनी फसल, तेल की मात्रा और उपज बढ़ाने हेतु सल्फर और नाइट्रोजन आवश्यक।',
      MR: 'तेलाचे प्रमाण वाढवण्यासाठी गंधक (सल्फर) आणि नत्र आवश्यक असणारे पीक.'
    },
    npkPerAcre: {
      n: 35,
      p: 20,
      k: 15
    },
    bagMultipliers: {
      urea: 0.8,
      dap: 0.4,
      mop: 0.2
    },
    advice: {
      EN: '⚠️ Apply Sulphur with basal DAP. Split Nitrogen: half at sowing and half at 30 days.',
      HI: '⚠️ डीएपी के साथ सल्फर अवश्य डालें। आधी नाइट्रोजन बुवाई पर व आधी 30 दिन बाद दें।',
      MR: '⚠️ डीएपी सोबत गंधक द्या. अर्धे नत्र पेरणीवेळी व अर्धे ३० दिवसांनी द्या.'
    },
    mandiPrice: {
      modal: 5600,
      range: '₹5,350 - ₹5,850 / Qtl',
      trend: 'up'
    },
    soilSuitability: {
      EN: 'Light to medium sandy loam soils',
      HI: 'हल्की से मध्यम बलुई दोमट मिट्टी',
      MR: 'हलकी ते मध्यम रेतीयुक्त पोयट्याची जमीन'
    }
  },
  {
    id: 'cotton',
    name: {
      EN: 'Cotton',
      HI: 'कपास',
      MR: 'कापूस'
    },
    botanicalName: 'Gossypium hirsutum',
    season: {
      EN: 'Kharif Cash Crop',
      HI: 'खरीफ नकदी फसल',
      MR: 'खरीप नगदी पीक'
    },
    iconName: 'Cloud',
    emoji: '☁️',
    description: {
      EN: 'White gold commercial crop requiring phased nutrient supply through squaring and boll formation.',
      HI: 'सफेद सोना नकदी फसल, फूल-गोटी बनने की अवस्था में चरणबद्ध पोषण की मांग।',
      MR: 'पांढरे सोने मानले जाणारे नगदी पीक, पाते व बोंड धरण्याच्या काळात संतुलित खतांची गरज.'
    },
    npkPerAcre: {
      n: 45,
      p: 25,
      k: 25
    },
    bagMultipliers: {
      urea: 1.0,
      dap: 0.5,
      mop: 0.35
    },
    advice: {
      EN: '⚠️ Apply full P & K at planting. Split Nitrogen into 3 doses: sowing, squaring, and boll formation.',
      HI: '⚠️ बुवाई पर पूरा P और K दें। नाइट्रोजन को 3 भागों में बांटें: बुवाई, फूल, और गोटी बनने पर।',
      MR: '⚠️ पेरणीवेळी पूर्ण P व K द्या. नत्र ३ हप्त्यांत द्या: पेरणी, पाते लागताना व बोंड भरताना.'
    },
    mandiPrice: {
      modal: 7420,
      range: '₹7,100 - ₹7,800 / Qtl',
      trend: 'stable'
    },
    soilSuitability: {
      EN: 'Deep Black soils with high moisture retention',
      HI: 'उच्च नमी धारण क्षमता वाली गहरी काली मिट्टी',
      MR: 'ओलावा टिकवून ठेवणारी काळी कसदार जमीन'
    }
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Malwa Kisan Krishi Seva Kendra',
    type: 'Govt. Authorized IFFCO / KRIBHCO Dealer',
    distance: '1.4 km',
    rating: 4.8,
    phone: '+91 98260 44120',
    inStock: ['Urea (IFFCO)', 'DAP (KRIBHCO)', 'MOP (IPL)', 'Zinc Sulphate'],
    verified: true
  },
  {
    id: 'sup-2',
    name: 'Narmada Agro Inputs & Seeds',
    type: 'Certified Cooperative Society Depot',
    distance: '2.8 km',
    rating: 4.6,
    phone: '+91 94250 88319',
    inStock: ['Urea', 'DAP', 'Bio-fertilizers', 'Rhizobium Culture'],
    verified: true
  },
  {
    id: 'sup-3',
    name: 'Annapurna Fertilizer Corporation',
    type: 'Private Wholesale Distributor',
    distance: '4.1 km',
    rating: 4.7,
    phone: '+91 98931 77402',
    inStock: ['DAP', 'MOP', 'Single Super Phosphate (SSP)', 'Micro-nutrients'],
    verified: true
  },
  {
    id: 'sup-4',
    name: 'Indore Central Farmer Hub',
    type: 'IFFCO e-Bazar Primary Center',
    distance: '5.6 km',
    rating: 4.9,
    phone: '+91 97555 12098',
    inStock: ['Nano Urea Liquid', 'Nano DAP', 'Urea 50kg', 'MOP'],
    verified: true
  }
];

export const MOCK_MANDI_ITEMS: MandiItem[] = [
  {
    commodity: { EN: 'Soybean (Yellow)', HI: 'सोयाबीन (पीला)', MR: 'सोयाबीन (पिवळा)' },
    variety: 'JS-9560 / JS-2034',
    market: 'Indore Mandi (Laxmibai Nagar)',
    pricePerQuintal: 4890,
    priceChange: +65,
    arrivalTons: 1420
  },
  {
    commodity: { EN: 'Wheat (Sharbati/Lokwan)', HI: 'गेहूं (शरबती / लोकवन)', MR: 'गहू (शरबती / लोकवन)' },
    variety: 'Lokwan Grade-A',
    market: 'Indore Mandi',
    pricePerQuintal: 2740,
    priceChange: +30,
    arrivalTons: 2850
  },
  {
    commodity: { EN: 'Gram (Desi / Dollar)', HI: 'चना (देसी / डॉलर)', MR: 'हरभरा (देशी / डॉलर)' },
    variety: 'Dollar Chana',
    market: 'Ujjain Mandi',
    pricePerQuintal: 6220,
    priceChange: -40,
    arrivalTons: 980
  },
  {
    commodity: { EN: 'Mustard Seed', HI: 'सरसों दाना', MR: 'मोहरी बी' },
    variety: 'Pusa Bold / Black',
    market: 'Dewas Mandi',
    pricePerQuintal: 5640,
    priceChange: +90,
    arrivalTons: 420
  },
  {
    commodity: { EN: 'Cotton (Medium Staple)', HI: 'कपास (मध्यम रेशा)', MR: 'कापूस (मध्यम धागा)' },
    variety: 'Bt Cotton Shankar-6',
    market: 'Khargone Mandi',
    pricePerQuintal: 7480,
    priceChange: +120,
    arrivalTons: 1100
  }
];

export const FERTILIZER_PRICES = {
  urea: 268,
  dap: 1350,
  mop: 1650
};

// Asynchronous Live Scraper Simulation for Agmarknet Mandi Rates (1.0s timeout)
export const fetchLiveMandiData = (): Promise<LiveMandiPayload> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ticker: [
          { mandi: "Indore", price: 4820, trend: "+12" },
          { mandi: "Dewas", price: 4790, trend: "-5" },
          { mandi: "Sanwer", price: 4800, trend: "0" },
          { mandi: "Ujjain", price: 4810, trend: "+8" },
          { mandi: "Mhow", price: 4780, trend: "+15" },
          { mandi: "Dhar", price: 4750, trend: "-10" }
        ],
        chartData: [
          { date: "10th", price: 4500, ratio: "1.00" },
          { date: "12th", price: 4580, ratio: "1.02" },
          { date: "15th", price: 4650, ratio: "1.03" },
          { date: "17th", price: 4720, ratio: "1.05" },
          { date: "20th", price: 4820, ratio: "1.07" }
        ],
        tableData: [
          { id: 1, name: "Indore Chhavani", distance: 8, gross: 4820, transportCost: 12, net: 4808, status: "OPTIMAL", arrival: "1,450 Qtl" },
          { id: 2, name: "Sanwer APMC", distance: 22, gross: 4800, transportCost: 35, net: 4765, status: "OPTIMAL", arrival: "820 Qtl" },
          { id: 3, name: "Dewas Mandi", distance: 38, gross: 4790, transportCost: 60, net: 4730, status: "WARNING", arrival: "640 Qtl" },
          { id: 4, name: "Ujjain", distance: 58, gross: 4810, transportCost: 87, net: 4723, status: "WARNING", arrival: "1,120 Qtl" },
          { id: 5, name: "Dhar Mandi", distance: 64, gross: 4750, transportCost: 95, net: 4655, status: "WARNING", arrival: "430 Qtl" }
        ],
        scrapedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        source: "Agmarknet Open API (v2.6 Live)"
      });
    }, 1000);
  });
};
