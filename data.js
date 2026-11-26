// Guides for common government tasks. Add a new task by adding one more object here.
// Each step: icon + short text in every language. Keep sentences short: they are read aloud.
window.TASKS = [
  {
    id: "aadhaar", icon: "🪪",
    name: { hi: "आधार कार्ड", en: "Aadhaar Card" },
    link: "https://uidai.gov.in",
    words: ["aadhaar", "aadhar", "adhar", "uidai", "आधार", "आधार कार्ड", "aadhaar card"],
    steps: [
      { icon: "📍", hi: "अपने पास का आधार केंद्र खोजें। uidai.gov.in पर देखें, या किसी से पूछ लें।", en: "Find your nearest Aadhaar centre. Look on uidai.gov.in or ask someone nearby." },
      { icon: "📄", hi: "साथ ले जाएँ: पहचान का एक सबूत और पते का एक सबूत, जैसे वोटर कार्ड या बिजली का बिल।", en: "Carry one ID proof and one address proof, like a voter card or electricity bill." },
      { icon: "🖐️", hi: "केंद्र पर आपकी फोटो, उँगलियों के निशान और आँखों का स्कैन लिया जाएगा। नया आधार बनवाना मुफ़्त है।", en: "At the centre they take your photo, fingerprints and eye scan. A new Aadhaar is free." },
      { icon: "🧾", hi: "आपको एक पर्ची मिलेगी। उसे संभालकर रखें। उस पर आपका नामांकन नंबर होता है।", en: "You will get a slip. Keep it safe. It has your enrolment number." },
      { icon: "📬", hi: "करीब 90 दिन में आधार कार्ड डाक से घर आ जाएगा। उसी नंबर से ऑनलाइन स्थिति भी देख सकते हैं।", en: "Your Aadhaar will reach your home by post in about 90 days. You can also check status online with that number." }
    ]
  },
  {
    id: "pan", icon: "💳",
    name: { hi: "पैन कार्ड", en: "PAN Card" },
    link: "https://www.incometax.gov.in",
    words: ["pan", "pan card", "पैन", "पैन कार्ड", "pen card", "पेन कार्ड"],
    steps: [
      { icon: "🌐", hi: "incometax.gov.in खोलें और 'Instant e-PAN' चुनें।", en: "Open incometax.gov.in and choose 'Instant e-PAN'." },
      { icon: "📱", hi: "अपना आधार नंबर डालें। आधार से जुड़े मोबाइल पर एक OTP आएगा।", en: "Enter your Aadhaar number. An OTP comes to the mobile linked with Aadhaar." },
      { icon: "✍️", hi: "OTP डालें और अपनी जानकारी ध्यान से जाँचें।", en: "Enter the OTP and check your details carefully." },
      { icon: "✅", hi: "जमा करें। ई-पैन थोड़े समय में मिल जाता है, और यह मुफ़्त है।", en: "Submit. Your e-PAN arrives shortly, and it is free." },
      { icon: "💡", hi: "अगर यह न हो पाए, तो पास की जन सेवा केंद्र या पैन सेवा दुकान पर मदद लें।", en: "If this does not work, ask for help at a nearby CSC or PAN service shop." }
    ]
  },
  {
    id: "ration", icon: "🍚",
    name: { hi: "राशन कार्ड", en: "Ration Card" },
    link: "https://nfsa.gov.in",
    words: ["ration", "ration card", "राशन", "राशन कार्ड", "rashan"],
    steps: [
      { icon: "📄", hi: "तैयार रखें: परिवार के सब सदस्यों का आधार, पते का सबूत, फोटो और आमदनी का सबूत।", en: "Keep ready: Aadhaar of all family members, address proof, photos and income proof." },
      { icon: "🏢", hi: "अपने राज्य के खाद्य विभाग की वेबसाइट पर जाएँ, या पास के जन सेवा केंद्र जाएँ।", en: "Go to your state food department website, or visit a nearby Jan Seva Kendra (CSC)." },
      { icon: "✍️", hi: "राशन कार्ड का फॉर्म भरें और कागज़ साथ में लगाएँ।", en: "Fill the ration card form and attach your papers." },
      { icon: "🧾", hi: "फॉर्म जमा करें और रसीद ले लें। रसीद पर आवेदन नंबर होता है।", en: "Submit the form and take the receipt. It has your application number." },
      { icon: "🏠", hi: "अधिकारी घर आकर जाँच कर सकते हैं। मंज़ूरी मिलने पर आपको कार्ड मिल जाएगा।", en: "An officer may visit to verify. After approval, you will get your card." }
    ]
  },
  {
    id: "voter", icon: "🗳️",
    name: { hi: "वोटर कार्ड", en: "Voter ID" },
    link: "https://voters.eci.gov.in",
    words: ["voter", "voter id", "voter card", "वोटर", "वोटर कार्ड", "मतदाता", "election card", "votar"],
    steps: [
      { icon: "🎂", hi: "वोटर कार्ड के लिए आपकी उम्र 18 साल या उससे ज़्यादा होनी चाहिए।", en: "You must be 18 years or older to get a voter card." },
      { icon: "🌐", hi: "voters.eci.gov.in खोलें, या फोन में 'Voter Helpline' ऐप इस्तेमाल करें।", en: "Open voters.eci.gov.in, or use the 'Voter Helpline' app on your phone." },
      { icon: "✍️", hi: "'नया मतदाता' चुनें और फॉर्म 6 भरें।", en: "Choose 'New voter' and fill Form 6." },
      { icon: "📎", hi: "अपनी फोटो, उम्र का सबूत और पते का सबूत अपलोड करें।", en: "Upload your photo, age proof and address proof." },
      { icon: "🧾", hi: "जमा करें और संदर्भ नंबर लिख लें। इससे आप स्थिति देख सकेंगे।", en: "Submit and note down the reference number. You can use it to check status." },
      { icon: "📬", hi: "जाँच के बाद वोटर कार्ड डाक से आपके घर आएगा।", en: "After verification, your voter card will come to your home by post." }
    ]
  },
  {
    id: "licence", icon: "🚗",
    name: { hi: "ड्राइविंग लाइसेंस", en: "Driving Licence" },
    link: "https://parivahan.gov.in",
    words: ["driving", "licence", "license", "driving licence", "driving license", "dl", "ड्राइविंग", "लाइसेंस", "लाइसेन्स", "गाड़ी चलाने"],
    steps: [
      { icon: "🌐", hi: "parivahan.gov.in खोलें और अपना राज्य चुनें।", en: "Open parivahan.gov.in and choose your state." },
      { icon: "✍️", hi: "पहले 'लर्नर लाइसेंस' के लिए आवेदन करें और ज़रूरी कागज़ अपलोड करें।", en: "First apply for a 'Learner Licence' and upload the required papers." },
      { icon: "📅", hi: "टेस्ट का समय चुनें और लर्नर लाइसेंस की परीक्षा दें।", en: "Choose a test slot and take the learner licence test." },
      { icon: "⏳", hi: "लर्नर लाइसेंस मिलने के 30 दिन बाद पक्के लाइसेंस के लिए आवेदन करें।", en: "Apply for the permanent licence 30 days after getting the learner licence." },
      { icon: "🚦", hi: "RTO दफ़्तर में ड्राइविंग टेस्ट दें। पास होने पर लाइसेंस डाक से आएगा।", en: "Give the driving test at the RTO office. If you pass, the licence comes by post." }
    ]
  },
  {
    id: "ayushman", icon: "🏥",
    name: { hi: "आयुष्मान कार्ड", en: "Ayushman Card" },
    link: "https://pmjay.gov.in",
    words: ["ayushman", "ayushman card", "ayushman bharat", "pmjay", "आयुष्मान", "आयुष्मान कार्ड", "इलाज", "health card", "ayusman"],
    steps: [
      { icon: "🔎", hi: "पहले देखें कि आपका परिवार पात्र है या नहीं। mera.pmjay.gov.in खोलें, या 14555 पर फोन करें।", en: "First check if your family is eligible. Open mera.pmjay.gov.in or call 14555." },
      { icon: "📄", hi: "साथ ले जाएँ: आधार कार्ड और राशन कार्ड।", en: "Carry your Aadhaar card and ration card." },
      { icon: "🏥", hi: "पास के आयुष्मान अस्पताल या जन सेवा केंद्र जाएँ और 'आयुष्मान मित्र' से मिलें।", en: "Visit a nearby Ayushman hospital or CSC and meet the 'Ayushman Mitra'." },
      { icon: "🖐️", hi: "आपकी पहचान की जाँच होगी, फिर आपका कार्ड बन जाएगा।", en: "Your identity will be checked, then your card will be made." },
      { icon: "💚", hi: "इस कार्ड से परिवार को हर साल 5 लाख रुपये तक का मुफ़्त इलाज मिलता है।", en: "This card gives your family free treatment up to 5 lakh rupees every year." }
    ]
  },
  {
    id: "passport", icon: "🛂",
    name: { hi: "पासपोर्ट", en: "Passport" },
    link: "https://www.passportindia.gov.in",
    words: ["passport", "पासपोर्ट", "pasport"],
    steps: [
      { icon: "🌐", hi: "passportindia.gov.in खोलें और अपना खाता बनाएँ।", en: "Open passportindia.gov.in and create your account." },
      { icon: "✍️", hi: "ऑनलाइन फॉर्म भरें और जमा करें।", en: "Fill the online form and submit it." },
      { icon: "💰", hi: "फीस भरें और पासपोर्ट सेवा केंद्र में मिलने का समय चुनें।", en: "Pay the fee and choose an appointment at the Passport Seva Kendra." },
      { icon: "📄", hi: "तय दिन पर असली कागज़ लेकर जाएँ: आधार, जन्म का सबूत और पते का सबूत।", en: "On the day, take original papers: Aadhaar, birth proof and address proof." },
      { icon: "👮", hi: "पुलिस जाँच होगी। इसके बाद पासपोर्ट डाक से घर आएगा।", en: "Police verification will happen. Then the passport comes to your home by post." }
    ]
  },
  {
    id: "birth", icon: "👶",
    name: { hi: "जन्म प्रमाणपत्र", en: "Birth Certificate" },
    link: "https://crsorgi.gov.in",
    words: ["birth", "birth certificate", "जन्म", "जन्म प्रमाणपत्र", "जन्म प्रमाण पत्र", "janm", "बच्चे का"],
    steps: [
      { icon: "⏰", hi: "बच्चे के जन्म के 21 दिन के अंदर पंजीकरण करवाएँ।", en: "Register the birth within 21 days of the baby being born." },
      { icon: "📄", hi: "अस्पताल से जन्म की पर्ची लें। साथ में माता-पिता का आधार रखें।", en: "Take the birth slip from the hospital. Keep the parents' Aadhaar with you." },
      { icon: "🏢", hi: "नगर निगम, नगर पालिका या ग्राम पंचायत के दफ़्तर जाएँ।", en: "Go to the municipal office or the Gram Panchayat office." },
      { icon: "✍️", hi: "फॉर्म भरें और कागज़ों के साथ जमा करें।", en: "Fill the form and submit it with your papers." },
      { icon: "🎉", hi: "जाँच के बाद आपको जन्म प्रमाणपत्र मिल जाएगा।", en: "After checking, you will receive the birth certificate." }
    ]
  }
];
