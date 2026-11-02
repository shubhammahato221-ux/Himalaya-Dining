/**
 * HIMALAYAN HEARTH — CORE DATA STORE & PERSISTENCE
 * Handles Menu Catalog, Cart Engine, Coupon Validation,
 * Order Management, Nepal Locations & NPR Currency Utilities.
 */

// NPR Currency Formatter
export function formatNPR(amount) {
  const num = Number(amount) || 0;
  return 'Rs. ' + num.toLocaleString('en-IN');
}

// Default Authentic Himalayan Menu Catalog
const DEFAULT_MENU = [
  {
    id: 'kothey-truffle-momo',
    name: 'Kothey Truffle Momos',
    nepaliName: 'कोथे ट्राफल म:म:',
    category: 'himalayan',
    categoryName: 'Himalayan Signatures',
    price: 1450,
    rating: 4.9,
    reviews: 142,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_PJrjdSzj0t9wzszD1N9iySxCa1fFRSIbdLVt2q7aM019YJn0LFh2vWdqU4XjJV22o-d6R8q8pLHHVacuwI9DH6OarVdipxWMF75fDaNAPPlyz9KugyRMo3-nkbXYp93YfdEfyRRUyuNbyeEXKZkCh7gly9lZYCIN_tjF2CASIOe1bKTrzWt158wTkOFW1kAeoI870tsSVnv3XEJIXLZsN9PU4moqOY6RV8LZnHDTfH54hWKIRX45',
    description: 'Hand-pleated pan-crisped dumplings stuffed with wild Himalayan morels, timur peppercorn saffron glaze, and roasted heirloom tomato chutney.',
    isVeg: false,
    spiceLevel: 'Mild Zing',
    isPopular: true,
    isChefSpecial: true,
    available: true,
    prepTime: '20-25 mins',
    portions: [
      { name: 'Regular (8 Pcs)', priceMod: 0 },
      { name: 'Celebration Platter (14 Pcs)', priceMod: 850 }
    ],
    addons: [
      { name: 'Roasted Timur Tomato Chutney', price: 80 },
      { name: 'Clarified Yak Ghee Drizzle', price: 120 },
      { name: 'Extra Himalayan Morel Glaze', price: 200 }
    ]
  },
  {
    id: 'slow-braised-khasi',
    name: 'Slow-Braised Khasi Handi',
    nepaliName: 'हाँडी खसीको मासु',
    category: 'himalayan',
    categoryName: 'Himalayan Signatures',
    price: 2100,
    rating: 5.0,
    reviews: 189,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4OFDCwG2M0n1yJCO6Omd9qPzuqJXoB0icwc0ViRvExfxprshBvZFyHXrnGqzcJgg9XeTiGFI2yi-rtUvLA4X_tAdj3DlSDhgo8UxTn3pYhLRvSCOpeLNCz1owELY0rMNftnkolUsNmGV-DsRB2zOFo2IiZAW24gpn0H0_65-1etNwBUy7dFQkPTjzDxljDRSeL9KBDHBVIG_VJfHzXxOUf4Osy2r8DjHht0HKwcCav80cHuVW-Smp',
    description: 'Tender mountain goat braised for 12 hours with black cardamom, alpine jimbu herb, and roasted cumin in an heirloom hand-hammered Newari brass pot.',
    isVeg: false,
    spiceLevel: 'High Hearth Heat',
    isPopular: true,
    isChefSpecial: true,
    available: true,
    prepTime: '30-35 mins',
    portions: [
      { name: 'Standard Handi (Serves 1-2)', priceMod: 0 },
      { name: 'Royal Feast Pot (Serves 3-4)', priceMod: 1800 }
    ],
    addons: [
      { name: 'Steamed Jumla Marsi Rice', price: 220 },
      { name: 'Buckwheat Flatbread (Roti x 2)', price: 150 },
      { name: 'Fresh Radish Gundruk Achar', price: 90 }
    ]
  },
  {
    id: 'smoked-mustang-trout',
    name: 'Smoked Mustang Glacial Trout',
    nepaliName: 'मुस्ताङी धुँवादार असला माछा',
    category: 'woodfired',
    categoryName: 'Wood-Fired',
    price: 2400,
    rating: 4.8,
    reviews: 96,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVm4WfZIp-eKpalO5EyPZwkNYbQqy4O5CO3SjRDVPlvvjo2kkeZk5WCcPTAnDjpVEWxKsCqcTu-xZb3fZn4h1PesitljlzrlFDrjCBGwxnbN_RHtmlDBMxCIq2CunZl1AfMRfDRrLL0-CB8g2F2vvUbMopHoSDvOdJQjHzRz6Jq7UbNHLqCV_U_8ucsk-ykFUxtKNm4Xq3rJoge8t9W9X0JXtXvjsyn9TugNCqVDe1hmARtBEp90px',
    description: 'Fresh glacial river trout crusted in timur berries and salt flakes, wood-charred over sal timber and accompanied by wild mustard greens reduction.',
    isVeg: false,
    spiceLevel: 'Wood Smoke & Peppery',
    isPopular: false,
    isChefSpecial: true,
    available: true,
    prepTime: '25-30 mins',
    portions: [
      { name: 'Whole Grilled Trout (approx. 500g)', priceMod: 0 }
    ],
    addons: [
      { name: 'Charred Lemon & Timur Butter', price: 90 },
      { name: 'Mustang Mountain Potato Wedges', price: 180 }
    ]
  },
  {
    id: 'royal-thakali-thali',
    name: 'Royal Thakali Heritage Thali',
    nepaliName: 'शाही थकाली थाली सेट',
    category: 'thakali',
    categoryName: 'Thakali & Khana Sets',
    price: 1850,
    rating: 4.9,
    reviews: 310,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7HhmrfTARfe6fSA3cVtxUXd2W9UfnQuMNRXS_oxuzBwdUG8S2G4p1BlXzoWyszWui-vaR48v8Ybun-4-lHW34YOVStMXmbW31Mx8aEyllUR9e0oa2c5mwHxAdc29ZvQ0oXuoXuyHygDqZGvg1-jFfG34LW_22sjSzd6N4zzN0RemlhlsS9_szEBDahP7iyGDxOj0Ut2ovVYL448f_mgVeb9yn-opeOmn7y3T_x4gDC16ag0WIcjbg',
    description: 'Organic black lentil daal, sun-dried fermented gundruk saag, ghee-toasted buckwheat flatbread, seasonal spicy mountain radish relish, Jumla rice, and fresh curd.',
    isVeg: true,
    spiceLevel: 'Medium Balanced',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '20 mins',
    portions: [
      { name: 'Pure Vegetarian Thakali Set', priceMod: 0 },
      { name: 'With Free-Range Village Chicken (+Rs. 450)', priceMod: 450 },
      { name: 'With Mustang Mountain Mutton (+Rs. 650)', priceMod: 650 }
    ],
    addons: [
      { name: 'Extra Fragrant Basmati Rice', price: 100 },
      { name: 'Pure Cow Ghee Pot', price: 110 },
      { name: 'Crispy Fried Bitter Gourd (Karela)', price: 90 }
    ]
  },
  {
    id: 'timur-butter-chicken',
    name: 'Timur Butter Chicken Curry',
    nepaliName: 'टिमुर बटर चिकेन',
    category: 'woodfired',
    categoryName: 'Wood-Fired',
    price: 1750,
    rating: 4.8,
    reviews: 204,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlvoyfoZLgRjEVLmkl5IdKNpoucU2pS6-B2MOSKF6uXJxjq6HsIOWNcCDTU0FCzEiHAzmTtRj-T_jK4LE7ftIRA72jyLOoylVngMkLMIy5Psa75hUQH7wF_NWQbhnILV2bEuWpjO-SKaGqFpyANlCqhDh8IEtmMGnCEGitzNb9TVjZcQECU39_fcbfwZeTrl3xlYkkUvijdb3xJcNk3q52doQ7MNJQJolQRUSBEJBb6hLIISnSBKwM',
    description: 'Clay tandoor charred chicken thigh enveloped in velvety fenugreek, cultured yak butter cream, and subtle tingling wild Himalayan timur pepper.',
    isVeg: false,
    spiceLevel: 'Silky Spiced',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '20-25 mins',
    portions: [
      { name: 'Full Portion', priceMod: 0 }
    ],
    addons: [
      { name: 'Garlic Butter Naan (2 pcs)', price: 160 },
      { name: 'Jeera Saffron Rice', price: 180 }
    ]
  },
  {
    id: 'saffron-kheer-tart',
    name: 'Saffron Mountain Kheer & Tart',
    nepaliName: 'केशरी खीर तथा सिबकथोर्न टार्ट',
    category: 'dessert',
    categoryName: 'Desserts',
    price: 950,
    rating: 4.9,
    reviews: 84,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmQHg21qgiMT2AyLi9QXu5WVzyEuDmMPxTmOAPMaTsVqJG1Jzordak4wu9Www8xLrs-LDKs1LLc5z0dQeyuoztK-_MRM7RV5Fmr03L41OtJERRc7ZTz3IvEkLXldF7_KqQA-VMuSvBD7n1bROxaK8X_O0-4CgaRkk9UcyacDPyeMduacwv6Cnhr-F655QqnCpWawvPvIPmAtdm-CMqmvRQ-NA9XEALdyg9ALyJ94z1ohzsRONIIEcZ',
    description: 'Slow-simmered aromatic mountain rice pudding, 24K edible gold leaf, paired with a tart wild sea buckthorn berry reduction and crushed pistachios.',
    isVeg: true,
    spiceLevel: 'Sweet & Aromatic',
    isPopular: false,
    isChefSpecial: true,
    available: true,
    prepTime: '15 mins',
    portions: [
      { name: 'Individual Dessert Cup', priceMod: 0 }
    ],
    addons: [
      { name: 'Extra Wild Sea Buckthorn Drizzle', price: 120 }
    ]
  },
  {
    id: 'steamed-buff-momo',
    name: 'Himalayan Steamed Buff Momo',
    nepaliName: 'हिमालयन बफ म:म:',
    category: 'momo',
    categoryName: 'Momo & Dumplings',
    price: 650,
    rating: 4.9,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80',
    description: 'Succulent minced buffalo seasoned with roasted coriander, mountain ginger, and scallions, served in a bamboo steamer with spicy roasted tomato & sesame achar.',
    isVeg: false,
    spiceLevel: 'Medium Spiced',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '15-20 mins',
    portions: [
      { name: 'Plate of 10 Pcs', priceMod: 0 },
      { name: 'Feast Platter (20 Pcs)', priceMod: 550 }
    ],
    addons: [
      { name: 'Extra Nutty Sesame Jhol Broth', price: 90 },
      { name: 'Dalle Khursani Chilli Paste', price: 60 }
    ]
  },
  {
    id: 'jhol-chicken-momo',
    name: 'Kathmandu Jhol Chicken Momo',
    nepaliName: 'काठमाडौं झोल चिकेन म:म:',
    category: 'momo',
    categoryName: 'Momo & Dumplings',
    price: 750,
    rating: 4.8,
    reviews: 265,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    description: 'Steamed tender chicken dumplings submerged in a piping-hot, tangy, nutty roasted soybean and sesame jhol broth infused with fresh coriander.',
    isVeg: false,
    spiceLevel: 'Tangy & Zesty',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '20 mins',
    portions: [
      { name: 'Deep Bowl (10 Pcs with Broth)', priceMod: 0 }
    ],
    addons: [
      { name: 'Extra Spiced Broth (1 Bowl)', price: 120 }
    ]
  },
  {
    id: 'chilli-c-momo',
    name: 'Fiery Wok Chilli Momo (C-Momo)',
    nepaliName: 'पिरो चिल्ली म:म: (सी-मम)',
    category: 'momo',
    categoryName: 'Momo & Dumplings',
    price: 820,
    rating: 4.7,
    reviews: 190,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy pan-fried dumplings wok-tossed with sweet bell peppers, red onions, garlic, and fierce Akabare Dalle Khursani chili sauce.',
    isVeg: false,
    spiceLevel: 'Fiery Hot 🔥',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '20 mins',
    portions: [
      { name: 'Chicken C-Momo (10 Pcs)', priceMod: 0 },
      { name: 'Buff C-Momo (10 Pcs)', priceMod: 0 },
      { name: 'Paneer & Veg C-Momo (10 Pcs)', priceMod: -40 }
    ],
    addons: [
      { name: 'Cooling Mint Raita', price: 80 }
    ]
  },
  {
    id: 'jimbu-chicken-sekuwa',
    name: 'Jimbu Charred Chicken Sekuwa',
    nepaliName: 'जिम्बु चिकेन सेकुवा',
    category: 'woodfired',
    categoryName: 'Wood-Fired',
    price: 1250,
    rating: 4.8,
    reviews: 154,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    description: 'Boneless chicken thighs marinated overnight with wild Jimbu herb, mustard oil, garlic, and crushed coriander, grilled over glowing sal wood embers.',
    isVeg: false,
    spiceLevel: 'Medium Smoky',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '25 mins',
    portions: [
      { name: 'Full Skewer Platter (Serves 1-2)', priceMod: 0 }
    ],
    addons: [
      { name: 'Crispy Beaten Rice (Chiura)', price: 70 },
      { name: 'Radish & Mustard Relish', price: 60 }
    ]
  },
  {
    id: 'kathmandu-buff-chowmein',
    name: 'Kathmandu Street Buff Chowmein',
    nepaliName: 'काठमाडौं बफ चाउमिन',
    category: 'noodles',
    categoryName: 'Chowmein & Noodles',
    price: 620,
    rating: 4.8,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-pulled egg noodles stir-fried in a roaring cast-iron wok with shredded spiced buffalo meat, mountain cabbage, carrots, dark soy, and toasted cumin.',
    isVeg: false,
    spiceLevel: 'Medium Savory',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '15 mins',
    portions: [
      { name: 'Standard Plate', priceMod: 0 },
      { name: 'Double Feast Portion', priceMod: 400 }
    ],
    addons: [
      { name: 'Sunny Side Mountain Egg', price: 60 },
      { name: 'Homemade Sweet-Chilli Dip', price: 50 }
    ]
  },
  {
    id: 'sherpa-chicken-thukpa',
    name: 'Sherpa Village Chicken Thukpa',
    nepaliName: 'शेर्पा कुखुराको थुक्पा',
    category: 'noodles',
    categoryName: 'Chowmein & Noodles',
    price: 680,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    description: 'Thick artisanal noodles in a slow-simmered, golden ginger-chicken bone broth topped with shredded greens, wild mountain spices, and fresh scallions.',
    isVeg: false,
    spiceLevel: 'Warm & Comforting',
    isPopular: false,
    isChefSpecial: false,
    available: true,
    prepTime: '20 mins',
    portions: [
      { name: 'Large Steaming Bowl', priceMod: 0 }
    ],
    addons: [
      { name: 'Extra Boiled Egg', price: 50 },
      { name: 'Fried Garlic Chili Crunch', price: 60 }
    ]
  },
  {
    id: 'mutton-dum-biryani',
    name: 'Himalayan Khasi Dum Biryani',
    nepaliName: 'हिमालयन खसीको दम बिर्यानी',
    category: 'rice',
    categoryName: 'Biryani & Grains',
    price: 1650,
    rating: 4.9,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    description: 'Aged long-grain basmati rice sealed with dough and slow-steamed with tender marinated mutton pieces, saffron, mint, and whole Himalayan spices.',
    isVeg: false,
    spiceLevel: 'Royal Aromatic',
    isPopular: true,
    isChefSpecial: true,
    available: true,
    prepTime: '25-30 mins',
    portions: [
      { name: 'Handi for One', priceMod: 0 },
      { name: 'Handi for Two (With extra meat)', priceMod: 1100 }
    ],
    addons: [
      { name: 'Cucumber Mint Boondi Raita', price: 90 },
      { name: 'Spicy Mirchi Salan Gravy', price: 110 }
    ]
  },
  {
    id: 'traditional-buff-choila',
    name: 'Traditional Newari Buff Choila',
    nepaliName: 'नेवारी बफ छोइला',
    category: 'snacks',
    categoryName: 'Khaja & Snacks',
    price: 980,
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Wood-fired smoked buffalo meat tossed with stone-pressed mustard oil, fenugreek seeds, charred garlic, and ginger. Served with beaten rice (baji).',
    isVeg: false,
    spiceLevel: 'Spicy & Pungent',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '15 mins',
    portions: [
      { name: 'Standard Khaja Plate', priceMod: 0 }
    ],
    addons: [
      { name: 'Extra Crispy Beaten Rice (Baji)', price: 70 },
      { name: 'Bhatmas Sadeko (Spiced Soybeans)', price: 120 }
    ]
  },
  {
    id: 'gundruk-bhatmas-sadeko',
    name: 'Gundruk Bhatmas Sadeko',
    nepaliName: 'गुन्द्रुक भटमास साधेको',
    category: 'snacks',
    categoryName: 'Khaja & Snacks',
    price: 450,
    rating: 4.7,
    reviews: 130,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    description: 'Fermented sun-dried mustard greens and crunchy roasted black soybeans tossed in raw mustard oil, fresh lemon juice, timur, and chopped green chilies.',
    isVeg: true,
    spiceLevel: 'Tangy & Spicy',
    isPopular: false,
    isChefSpecial: false,
    available: true,
    prepTime: '10 mins',
    portions: [
      { name: 'Bowl (Serves 1-2)', priceMod: 0 }
    ],
    addons: []
  },
  {
    id: 'steamed-chaku-yomari',
    name: 'Handcrafted Chaku Yomari (2 Pcs)',
    nepaliName: 'नेवारी चाकु योमरी',
    category: 'dessert',
    categoryName: 'Desserts',
    price: 550,
    rating: 4.8,
    reviews: 165,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Artisanal pointed Newari rice-flour dumplings filled with molten dark molasses (chaku), toasted sesame seeds, and crushed coconut flakes.',
    isVeg: true,
    spiceLevel: 'Sweet & Luscious',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '20 mins',
    portions: [
      { name: '2 Pieces (Classic Chaku)', priceMod: 0 },
      { name: '4 Pieces (Chaku & Khuwa Mix)', priceMod: 450 }
    ],
    addons: []
  },
  {
    id: 'mustang-warm-apple-cider',
    name: 'Mustang Spiced Warm Apple Cider',
    nepaliName: 'मुस्ताङी तातो स्याउको रस',
    category: 'beverage',
    categoryName: 'Beverages & Spirits',
    price: 480,
    rating: 4.9,
    reviews: 90,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    description: 'Freshly pressed organic apples from Marpha orchards in Mustang, simmered with cinnamon quills, timur peppercorns, cloves, and wild mountain honey.',
    isVeg: true,
    spiceLevel: 'Aromatic & Soothing',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '10 mins',
    portions: [
      { name: 'Mug (300ml)', priceMod: 0 }
    ],
    addons: []
  },
  {
    id: 'ilam-orthodox-tea',
    name: 'Ilam Autumn Flush Organic Tea',
    nepaliName: 'इलाम अर्गानिक चिया',
    category: 'beverage',
    categoryName: 'Beverages & Spirits',
    price: 380,
    rating: 4.8,
    reviews: 75,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Delicate single-estate whole-leaf orthodox black tea from the high misty plantations of Ilam, Eastern Nepal. Notes of muscatel grape and mountain flowers.',
    isVeg: true,
    spiceLevel: 'Floral & Crisp',
    isPopular: false,
    isChefSpecial: false,
    available: true,
    prepTime: '8 mins',
    portions: [
      { name: 'Teapot (Serves 2)', priceMod: 0 }
    ],
    addons: []
  },
  {
    id: 'himalayan-masala-chiya',
    name: 'Clay-Cup Himalayan Masala Chiya',
    nepaliName: 'माटोको कपमा मसला चिया',
    category: 'beverage',
    categoryName: 'Beverages & Spirits',
    price: 280,
    rating: 4.9,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80',
    description: 'Slow-simmered rich CTC tea brewed with fresh mountain milk, crushed cardamom pods, spicy ginger, cloves, and wild lemongrass. Served in traditional clay matka.',
    isVeg: true,
    spiceLevel: 'Sweet & Warm Spice',
    isPopular: true,
    isChefSpecial: false,
    available: true,
    prepTime: '10 mins',
    portions: [
      { name: 'Traditional Clay Matka', priceMod: 0 }
    ],
    addons: []
  }
];

// Active Coupons System
const DEFAULT_COUPONS = [
  {
    code: 'HEARTH10',
    type: 'percent',
    value: 10,
    minOrder: 1000,
    description: '10% off on all orders above Rs. 1,000'
  },
  {
    code: 'NAMASTE100',
    type: 'fixed',
    value: 100,
    minOrder: 600,
    description: 'Flat Rs. 100 off on orders above Rs. 600'
  },
  {
    code: 'HIMALAYA20',
    type: 'percent',
    value: 20,
    minOrder: 2500,
    description: '20% off on royal feast orders above Rs. 2,500'
  }
];

// Pre-seeded Initial Orders for Demo Realism
const DEFAULT_ORDERS = [
  {
    id: 'HH-KT-9042',
    date: '2026-11-01T15:20:00Z',
    customer: {
      name: 'Maya Shrestha',
      phone: '+977 9801234567',
      email: 'maya.shrestha@example.com',
      address: 'House 14, Gairidhara Marg, Near Sunrise Bank',
      area: 'Durbar Marg / Lazimpat',
      city: 'Kathmandu',
      district: 'Kathmandu',
      province: 'Bagmati Province',
      instructions: 'Please call before ringing gate bell'
    },
    items: [
      {
        id: 'kothey-truffle-momo',
        name: 'Kothey Truffle Momos',
        price: 1450,
        quantity: 2,
        portion: 'Regular (8 Pcs)',
        addons: ['Roasted Timur Tomato Chutney (+Rs. 80)'],
        total: 3060,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_PJrjdSzj0t9wzszD1N9iySxCa1fFRSIbdLVt2q7aM019YJn0LFh2vWdqU4XjJV22o-d6R8q8pLHHVacuwI9DH6OarVdipxWMF75fDaNAPPlyz9KugyRMo3-nkbXYp93YfdEfyRRUyuNbyeEXKZkCh7gly9lZYCIN_tjF2CASIOe1bKTrzWt158wTkOFW1kAeoI870tsSVnv3XEJIXLZsN9PU4moqOY6RV8LZnHDTfH54hWKIRX45'
      },
      {
        id: 'mustang-warm-apple-cider',
        name: 'Mustang Spiced Warm Apple Cider',
        price: 480,
        quantity: 2,
        portion: 'Mug (300ml)',
        addons: [],
        total: 960,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 4020,
    discount: 402,
    couponCode: 'HEARTH10',
    deliveryFee: 0, // Free above 2000
    vatTax: 470, // 13% VAT
    total: 4088,
    paymentMethod: 'eSewa',
    paymentStatus: 'Paid',
    orderType: 'delivery',
    status: 'preparing', // placed, confirmed, preparing, out_for_delivery, delivered
    estimatedMinutes: 25
  },
  {
    id: 'HH-KT-8914',
    date: '2026-11-01T13:45:00Z',
    customer: {
      name: 'Rohan Pradhan',
      phone: '+977 9841889922',
      email: 'rohan.pradhan@gmail.com',
      address: 'Patan Dhoka, Heritage Lane #4',
      area: 'Patan / Jhamsikhel',
      city: 'Lalitpur',
      district: 'Lalitpur',
      province: 'Bagmati Province',
      instructions: 'Deliver to 2nd floor'
    },
    items: [
      {
        id: 'royal-thakali-thali',
        name: 'Royal Thakali Heritage Thali',
        price: 1850,
        quantity: 1,
        portion: 'With Mustang Mountain Mutton (+Rs. 650)',
        addons: ['Pure Cow Ghee Pot (+Rs. 110)'],
        total: 2610,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7HhmrfTARfe6fSA3cVtxUXd2W9UfnQuMNRXS_oxuzBwdUG8S2G4p1BlXzoWyszWui-vaR48v8Ybun-4-lHW34YOVStMXmbW31Mx8aEyllUR9e0oa2c5mwHxAdc29ZvQ0oXuoXuyHygDqZGvg1-jFfG34LW_22sjSzd6N4zzN0RemlhlsS9_szEBDahP7iyGDxOj0Ut2ovVYL448f_mgVeb9yn-opeOmn7y3T_x4gDC16ag0WIcjbg'
      }
    ],
    subtotal: 2610,
    discount: 0,
    couponCode: null,
    deliveryFee: 0,
    vatTax: 339,
    total: 2949,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderType: 'delivery',
    status: 'out_for_delivery',
    estimatedMinutes: 10
  }
];

// Helper to safely parse local storage
function safeGet(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    console.error('Storage Read Error for', key, e);
    return defaultVal;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage Write Error for', key, e);
  }
}

// 1. Menu APIs
export function getMenuItems() {
  const menu = safeGet('hearth_menu_items', null);
  if (!menu) {
    safeSet('hearth_menu_items', DEFAULT_MENU);
    return DEFAULT_MENU;
  }
  return menu;
}

export function getMenuItemById(id) {
  const menu = getMenuItems();
  return menu.find(item => item.id === id) || null;
}

export function updateMenuItem(id, updates) {
  const menu = getMenuItems();
  const idx = menu.findIndex(item => item.id === id);
  if (idx !== -1) {
    menu[idx] = { ...menu[idx], ...updates };
    safeSet('hearth_menu_items', menu);
    return menu[idx];
  }
  return null;
}

export function addMenuItem(newItem) {
  const menu = getMenuItems();
  const item = {
    ...newItem,
    id: newItem.id || 'dish-' + Date.now(),
    available: true,
    rating: 5.0,
    reviews: 1
  };
  menu.unshift(item);
  safeSet('hearth_menu_items', menu);
  return item;
}

export function toggleMenuItemAvailability(id) {
  const menu = getMenuItems();
  const item = menu.find(i => i.id === id);
  if (item) {
    item.available = !item.available;
    safeSet('hearth_menu_items', menu);
    return item.available;
  }
  return false;
}

// 2. Shopping Cart APIs
export function getCart() {
  return safeGet('hearth_cart_items', []);
}

export function saveCart(cart) {
  safeSet('hearth_cart_items', cart);
  window.dispatchEvent(new CustomEvent('hearth_cart_updated', { detail: { count: getCartCount() } }));
}

export function addToCart(foodItem, quantity = 1, options = {}) {
  const cart = getCart();
  const portion = options.portion || (foodItem.portions && foodItem.portions[0] ? foodItem.portions[0].name : 'Regular');
  const portionPriceMod = options.portionPriceMod || 0;
  const addons = options.addons || [];
  const instructions = options.instructions || '';
  
  const unitPrice = (foodItem.price + portionPriceMod + addons.reduce((sum, a) => sum + (a.price || 0), 0));
  
  // Check if identical item with identical options already in cart
  const existingIdx = cart.findIndex(c => 
    c.id === foodItem.id && 
    c.portion === portion && 
    JSON.stringify(c.addons.map(a => a.name).sort()) === JSON.stringify(addons.map(a => a.name).sort())
  );

  if (existingIdx !== -1) {
    cart[existingIdx].quantity += quantity;
    cart[existingIdx].total = cart[existingIdx].quantity * cart[existingIdx].unitPrice;
  } else {
    cart.push({
      cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      id: foodItem.id,
      name: foodItem.name,
      image: foodItem.image,
      unitPrice: unitPrice,
      quantity: quantity,
      portion: portion,
      addons: addons,
      instructions: instructions,
      total: unitPrice * quantity
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartQuantity(index, newQty) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = newQty;
      cart[index].total = cart[index].quantity * cart[index].unitPrice;
    }
    saveCart(cart);
  }
  return cart;
}

export function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
  }
  return cart;
}

export function clearCart() {
  saveCart([]);
  safeSet('hearth_applied_coupon', null);
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// 3. Coupons & Calculations
export function getCoupons() {
  return safeGet('hearth_coupons', DEFAULT_COUPONS);
}

export function addCoupon(coupon) {
  const coupons = getCoupons();
  coupons.push(coupon);
  safeSet('hearth_coupons', coupons);
  return coupons;
}

export function getAppliedCoupon() {
  return safeGet('hearth_applied_coupon', null);
}

export function applyCoupon(code) {
  if (!code) return { success: false, message: 'Please enter a coupon code.' };
  const trimmed = code.trim().toUpperCase();
  const coupons = getCoupons();
  const found = coupons.find(c => c.code === trimmed);

  if (!found) {
    return { success: false, message: `Invalid coupon "${trimmed}". Try HEARTH10 or NAMASTE100.` };
  }

  const { subtotal } = calculateCartTotals(null);
  if (subtotal < found.minOrder) {
    return { 
      success: false, 
      message: `Coupon "${trimmed}" requires a minimum order of ${formatNPR(found.minOrder)}.` 
    };
  }

  safeSet('hearth_applied_coupon', found);
  return { success: true, coupon: found, message: `Coupon ${found.code} applied successfully!` };
}

export function removeCoupon() {
  safeSet('hearth_applied_coupon', null);
}

export function calculateCartTotals(couponOverride = undefined) {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
  
  const coupon = couponOverride !== undefined ? couponOverride : getAppliedCoupon();
  let discount = 0;

  if (coupon && subtotal >= (coupon.minOrder || 0)) {
    if (coupon.type === 'percent') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Delivery Policy for Kathmandu Valley:
  // Free delivery above Rs. 2,000; otherwise Rs. 100 standard
  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 2000 ? 0 : 100);

  // Nepal Standard 13% VAT
  const vatTax = subtotal === 0 ? 0 : Math.round(discountedSubtotal * 0.13);

  const grandTotal = discountedSubtotal + deliveryFee + vatTax;

  return {
    itemCount: cart.reduce((sum, i) => sum + i.quantity, 0),
    subtotal,
    discount,
    appliedCoupon: coupon,
    deliveryFee,
    vatTax,
    grandTotal
  };
}

// 4. Orders Management
export function getOrders() {
  const orders = safeGet('hearth_orders_list', null);
  if (!orders) {
    safeSet('hearth_orders_list', DEFAULT_ORDERS);
    return DEFAULT_ORDERS;
  }
  return orders;
}

export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(o => o.id === orderId) || null;
}

export function createOrder(orderPayload) {
  const orders = getOrders();
  const uniqueId = 'HH-KT-' + Math.floor(1000 + Math.random() * 9000);
  
  const newOrder = {
    ...orderPayload,
    id: uniqueId,
    date: new Date().toISOString(),
    status: 'placed', // 'placed' -> 'confirmed' -> 'preparing' -> 'out_for_delivery' -> 'delivered'
    estimatedMinutes: orderPayload.orderType === 'pickup' ? 20 : 40
  };

  orders.unshift(newOrder);
  safeSet('hearth_orders_list', orders);
  
  // Set as last placed order for quick tracking lookup
  safeSet('hearth_latest_order_id', uniqueId);
  
  // Clear cart after order creation
  clearCart();
  
  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (newStatus === 'delivered') {
      order.deliveredAt = new Date().toISOString();
      if (order.paymentMethod === 'Cash on Delivery') {
        order.paymentStatus = 'Paid on Delivery';
      }
    }
    safeSet('hearth_orders_list', orders);
    return order;
  }
  return null;
}

export function getLatestOrderId() {
  return safeGet('hearth_latest_order_id', null);
}

// 5. User Authentication / Session
export function getCurrentUser() {
  return safeGet('hearth_current_user', {
    id: 'user_maya',
    name: 'Maya Shrestha',
    email: 'maya.shrestha@example.com',
    phone: '+977 9801234567',
    role: 'customer',
    address: 'Durbar Marg Heritage Quarter, Kathmandu',
    preferredArea: 'Durbar Marg / Lazimpat'
  });
}

export function setCurrentUser(user) {
  safeSet('hearth_current_user', user);
}

export function logoutUser() {
  safeSet('hearth_current_user', null);
}

// 6. Admin Authentication & Analytics
export function isAdminLoggedIn() {
  return safeGet('hearth_admin_auth', false);
}

export function setAdminLoggedIn(status) {
  safeSet('hearth_admin_auth', !!status);
}

export function getAdminAnalytics() {
  const orders = getOrders();
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
  const inKitchen = orders.filter(o => o.status === 'preparing' || o.status === 'out_for_delivery').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  return {
    totalOrders,
    pendingOrders,
    inKitchen,
    completedOrders,
    totalRevenue
  };
}
