// Shared by the website and by build-audio.js (node): turns text into what should be SPOKEN,
// and gives each spoken line a stable file name so the site can find its recorded audio.
(function (root) {
  "use strict";

  // English words, web addresses and long numbers sound wrong in a Hindi voice, so they are written as they should sound.
  const HI_WORDS = {
    uidai: "यू आई डी ए आई", gov: "गव", in: "इन", incometax: "इनकम टैक्स", voters: "वोटर्स", eci: "ई सी आई",
    parivahan: "परिवहन", mera: "मेरा", pmjay: "पी एम जे ए वाई", passportindia: "पासपोर्ट इंडिया", nfsa: "एन एफ एस ए",
    crsorgi: "सी आर एस ओ आर जी आई", otp: "ओ टी पी", pan: "पैन", rto: "आर टी ओ", csc: "सी एस सी",
    instant: "इंस्टेंट", voter: "वोटर", helpline: "हेल्पलाइन", e: "ई", chrome: "क्रोम", edge: "एज", microsoft: "माइक्रोसॉफ्ट", windows: "विंडोज़"
  };
  const EN_WORDS = {
    uidai: "U I D A I", eci: "E C I", pmjay: "P M J A Y", nfsa: "N F S A", crsorgi: "C R S O R G I",
    otp: "O T P", rto: "R T O", csc: "C S C", incometax: "income tax", aadhaar: "Aadhar"
  };
  const DIGITS = {
    hi: ["शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ"],
    en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  };

  function pronounce(text, lang) {
    const words = lang === "hi" ? HI_WORDS : EN_WORDS;
    const dot = lang === "hi" ? " डॉट " : " dot ";
    return text
      .replace(/['"‘’“”]/g, "")
      .replace(/\b\d{4,}\b/g, (m) => " " + [...m].map((d) => DIGITS[lang][+d]).join(" ") + " ")
      .replace(/[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g, (d) => d.split(".").map((p) => words[p.toLowerCase()] || p).join(dot))
      .replace(/[A-Za-z]+/g, (w) => words[w.toLowerCase()] || w)
      .replace(/\s+/g, " ")
      .trim();
  }

  // 32-bit FNV-1a over the UTF-8 bytes: the same result in the browser and in node.
  function hash(text) {
    const bytes = new TextEncoder().encode(text);
    let h = 0x811c9dc5;
    for (const b of bytes) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, "0");
  }

  const audioPath = (lang, text) => `audio/${lang}/${hash(text)}.mp3`;

  root.Speech = { pronounce, hash, audioPath };
})(typeof window !== "undefined" ? window : globalThis);
