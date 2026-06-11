const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

// 1. Comprehensive Local Knowledge Base for Nepalese Government Documents
const palikaKnowledgeBase = [
  {
    category: "Birth Registration",
    keywords: ["birth", "janma", "darta", "barta", "बच्चा", "जन्म"],
    documents: [
      "Father and Mother's original Citizenship Certificates (Nagarikta).",
      "Hospital Birth Report (or Ward physical verification report if born at home).",
      "Parents' Marriage Certificate (Bibaha Darta).",
      "Informant's (सूचक) Citizenship copy (usually father or mother)."
    ]
  },
  {
    category: "Citizenship (Nagarikta)",
    keywords: ["citizenship", "nagarikta", "nagrika", "नागरिकता"],
    documents: [
      "Official Birth Certificate (Janma Darta).",
      "Original Citizenship Certificates of Father, Mother, or Husband (if applicable).",
      "Ward Recommendation Letter (Woda Sifaris) for Citizenship.",
      "3 passport-sized photos with a red background.",
      "Educational certificates (if date of birth needs verification)."
    ]
  },
  {
    category: "Migration Certificate",
    keywords: ["migration", "basai", "sarai", "बसाई", "सराइ"],
    documents: [
      "Original Migration Form filled out at the leaving Ward.",
      "Citizenship Certificates of all family members migrating.",
      "Land Ownership Certificate (Lalpurja) or House Tax receipt of the current/new property.",
      "Clearance of local municipal taxes and utility bills."
    ]
  },
  {
    category: "Marriage Registration",
    keywords: ["marriage", "bibaha", "bihe", "विवाह", "बिहे"],
    documents: [
      "Original Citizenship Certificates of both Bride and Groom.",
      "Passport-sized photos of both Bride and Groom (minimum 3 each).",
      "Ward recommendation or physical presence of witnesses with their citizenships.",
      "Age proof (both must be at least 20 years old according to Nepalese law)."
    ]
  },
  {
    category: "Death Registration",
    keywords: ["death", "mrityu", "mua", "मृत्य", "मृत्यु"],
    documents: [
      "Original Citizenship Certificate of the deceased person.",
      "Hospital Death Certificate or Ward physical verification report.",
      "Citizenship Certificate of the applicant/informant (close family member).",
      "Proof of relationship with the deceased."
    ]
  },
  {
    category: "Relationship Verification",
    keywords: ["relationship", "naata", "pramanit", "नाता", "प्रमाणित"],
    documents: [
      "Citizenship Certificates of all parties involved in the relationship.",
      "Birth certificates or marriage certificates linking the individuals.",
      "Passport-sized photos of all applicants.",
      "Ward Office field verification and witness signatures."
    ]
  },
  {
    category: "Passport (Raahadaani)",
    keywords: ["passport", "raahadani", "rahadani", "राहदानी", "पासपोर्ट"],
    documents: [
      "Original National Identity Card (Rastriya Parichayapatra) or its NIN number.",
      "Original Citizenship Certificate (Nagarikta).",
      "Previous passport (if applying for renewal or replacement).",
      "Online pre-enrollment application form receipt."
    ]
  },
  {
    category: "National ID",
    keywords: ["national id", "rastriya", "parichayapatra", "राष्ट्रिय", "परिचयपत्र"],
    documents: [
      "Original Citizenship Certificate.",
      "Marriage certificate (for married women if their citizenship surname hasn't changed).",
      "Migration certificate (if applying from a district other than the one listed on your citizenship)."
    ]
  },
  {
    category: "Business Registration",
    keywords: ["business", "industry", "gharelu", "pasa", "पसल", "घरेलु", "व्यवसाय"],
    documents: [
      "Citizenship Copy of the business owner(s).",
      "House Rent Agreement (Kapada/Ghar Bahal Samjhauta) along with landlord's Lalpurja copy.",
      "Ward recommendation letter (Woda Sifaris) for business operations.",
      "Passport-sized photos of the proprietor.",
      "Partnership deed (if the business has multiple partners)."
    ]
  },
  {
    category: "Property Ownership Transfer (Naamsari)",
    keywords: ["naamsari", "naam sari", "transfer", "ownership", "नामसारी", "जग्गा नामसारी", "अंशबन्डा"],
    documents: [
      "Death certificate of the original property owner (if applying for inheritance name transfer).",
      "Official Relationship Verification Certificate (Naata Pramanit) linking the deceased and the heir.",
      "Original Land Ownership Certificate (Lalpurja).",
      "Trace Map (Trace Naksa) and Blueprint from the Survey Office (Naapi Karyalaya).",
      "Citizenship Certificates of the applicant, all legal heirs, and physical witnesses.",
      "Property tax clearance receipt up to the current fiscal year from the Ward Office."
    ]
  },
  {
    category: "House Map Approval (Naksa Pass)",
    keywords: ["naksa", "pass", "naksapass", "map approval", "blueprint", "नक्सा", "नक्सा पास", "घरको नक्सा"],
    documents: [
      "Original Land Ownership Certificate (Lalpurja).",
      "Latest land revenue and property tax clearance receipts (Malpot/Ghar Jagga Kar).",
      "Citizenship Certificate copy of the landowner.",
      "Full set of architectural, structural, electrical, and plumbing drawings stamped and signed by an NEC-registered engineer.",
      "Cadastral map (Trace map) from the Survey Office.",
      "Electronic Building Permit System (EBPS) pre-enrollment form (mandatory in major cities like Kathmandu, Lalitpur, and Pokhara)."
    ]
  },
  {
    category: "Divorce Registration (Sambandha Bicched)",
    keywords: ["divorce", "sambandha", "bicched", "bichhed", "सम्बन्ध", "विच्छेद", "पारपाचुके"],
    documents: [
      "Original Court Verdict/Decree document (Adalatko Faisala).",
      "Original Citizenship Certificates of the applicant(s).",
      "Passport-sized photographs of the applicant.",
      "Official Vital Registration application form filled out at the local Ward Office."
    ]
  },
  {
    category: "Minor Identity Card (Nabaalig Parichayapatra)",
    keywords: ["minor", "nabaalig", "nabalik", "नाबालिक", "परिचयपत्र", "नाबालक"],
    documents: [
      "Official Birth Registration Certificate (Janma Darta).",
      "Original Citizenship Certificates of both Father and Mother.",
      "Parents' official Marriage Certificate (Bibaha Darta).",
      "Passport-sized photographs of the minor (with a clear background).",
      "Ward Office recommendation form signed by local authorities."
    ]
  },
  {
    category: "Unmarried / Single Status Certificate",
    keywords: ["unmarried", "single", "abibahit", "buda", "अविवाहित", "प्रमाणित", "एकल"],
    documents: [
      "Applicant's original Citizenship Certificate.",
      "Original Citizenship copies of parents or close family members.",
      "Passport-sized photographs of the applicant.",
      "Local field verification and witness signatures (Muchulka) at the Ward Office to certify single status."
    ]
  },
  {
    category: "Disability Identity Card (Apanga Parichayapatra)",
    keywords: ["disability", "apanga", "apangga", "अपाङ्गता", "अपाङ्ग", "कार्ड"],
    documents: [
      "Applicant's Citizenship Certificate (or Birth Certificate if the applicant is a minor).",
      "Official medical diagnostic report or certificate from an authorized medical board/hospital confirming the category and severity of disability.",
      "Passport-sized photographs clearly showcasing physical characteristics or identity.",
      "Application form certified by the Ward or Local Municipality social welfare branch."
    ]
  },
  {
    category: "Electricity / Water Meter Connection Sifaris",
    keywords: ["electricity", "water", "meter", "mitar", "jadan", "dhara", "batti", "विद्युत", "धारा", "मिटर", "जडान"],
    documents: [
      "Original Land Ownership Certificate (Lalpurja) where the connection is requested.",
      "Citizenship Certificate copy of the property owner.",
      "Latest municipal house and land property tax clearance receipt.",
      "Copy of the approved building map (Naksa Pass) certificate (frequently mandatory for permanent commercial/residential connections)."
    ]
  },
  {
    category: "Property / House Valuation (Mulyankan)",
    keywords: ["valuation", "mulyankan", "mulyankan", "मूल्यांकन", "घर जग्गा मूल्यांकन"],
    documents: [
      "Original Land Ownership Certificate (Lalpurja).",
      "Trace Map and Field Blueprint from the local Survey Office (Naapi).",
      "Current fiscal year property tax payment receipt from the Ward Office.",
      "Citizenship Certificate copy of the landowner.",
      "Official request letter indicating the purpose of evaluation (e.g., for banking loans, visa applications, or financial tracking)."
    ]
  }
];

// 2. Chat Router
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Convert input to lowercase to make search case-insensitive
    const lowerMessage = message.toLowerCase();
    let matchedCategory = null;

    // Scan through the knowledge base to find matching keywords
    for (const item of palikaKnowledgeBase) {
      const matchFound = item.keywords.some(keyword => lowerMessage.includes(keyword));
      if (matchFound) {
        matchedCategory = item;
        break; // Stop at the first match
      }
    }

    let response = "";

    if (matchedCategory) {
      // Format the response beautifully using Markdown
      response = `### Required Documents for ${matchedCategory.category}:\n\n` + 
                 matchedCategory.documents.map(doc => `• ${doc}`).join("\n") + 
                 `\n\n*Note: Please visit your local Ward Office (Woda Karyalaya) for specific verification or local updates.*`;
    } else {
      // Catch-all response detailing what the bot knows
      response = `Namaste! I am Smart Palika AI, your local government helper. I couldn't quite map your request.\n\nYou can ask me about the required documents for:\n• **Birth / Death / Marriage / Migration** Registration\n• **Citizenship** or **Passports**\n• **National ID**\n• **Business Registrations** & **Relationship Verifications**`;
    }

    res.json({
      query: message,
      response,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;