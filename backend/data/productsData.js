const productsData = [
  // 1. Smartphones
  {
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
    brand: 'Samsung',
    categorySlug: 'smartphones',
    price: 129999,
    originalPrice: 134999,
    discountPercentage: 4,
    stock: 15,
    ratingAverage: 4.8,
    ratingCount: 230,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Experience Galaxy AI on the Samsung Galaxy S24 Ultra. Powered by the Snapdragon 8 Gen 3 for Galaxy processor with a 200MP camera system, built-in S-Pen, and Titanium exterior.',
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'RAM': '12 GB LPDDR5X',
      'Internal Storage': '256 GB UFS 4.0',
      'Rear Camera': '200MP + 50MP + 12MP + 10MP Quad Camera',
      'Front Camera': '12MP',
      'Battery': '5000 mAh with 45W fast charging',
      'Operating System': 'Android 14, One UI 6.1',
      'Warranty': '1 Year Manufacturer Warranty'
    }
  },
  {
    name: 'Apple iPhone 15 Pro (Natural Titanium, 128GB)',
    brand: 'Apple',
    categorySlug: 'smartphones',
    price: 119900,
    originalPrice: 134900,
    discountPercentage: 11,
    stock: 12,
    ratingAverage: 4.9,
    ratingCount: 312,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'iPhone 15 Pro features a strong and light aerospace-grade titanium design with textured matte-glass back, Action button, A17 Pro chip, and USB-C support.',
    specifications: {
      'Display': '6.1-inch Super Retina XDR OLED, ProMotion 120Hz',
      'Processor': 'A17 Pro Bionic Chip 3nm',
      'Storage': '128 GB',
      'Main Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto (3x)',
      'Front Camera': '12MP TrueDepth',
      'Connectivity': '5G, Wi-Fi 6E, USB-C 3.0',
      'Battery Life': 'Up to 23 hours video playback',
      'Operating System': 'iOS 17',
      'Warranty': '1 Year Apple International Warranty'
    }
  },
  {
    name: 'OnePlus 12 5G (Flowy Emerald, 256GB)',
    brand: 'OnePlus',
    categorySlug: 'smartphones',
    price: 64999,
    originalPrice: 69999,
    discountPercentage: 7,
    stock: 18,
    ratingAverage: 4.7,
    ratingCount: 185,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=700&auto=format&fit=crop&q=80'
    ],
    description: '4th Gen Hasselblad Camera for Mobile with Sony LYT-808 sensor, 100W SUPERVOOC charging, and Snapdragon 8 Gen 3 flagship engine.',
    specifications: {
      'Display': '6.82-inch 2K 120Hz ProXDR AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12 GB',
      'Storage': '256 GB',
      'Camera': '50MP + 48MP + 64MP 3x Periscope Telephoto',
      'Battery': '5400 mAh with 100W wired & 50W wireless charging',
      'OS': 'OxygenOS 14 based on Android 14',
      'Warranty': '1 Year Brand Warranty'
    }
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro+ 5G (Fusion Purple, 256GB)',
    brand: 'Xiaomi',
    categorySlug: 'smartphones',
    price: 29999,
    originalPrice: 33999,
    discountPercentage: 12,
    stock: 25,
    ratingAverage: 4.5,
    ratingCount: 140,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Flagship 200MP OIS Camera with 3D Curved 120Hz AMOLED display and 120W HyperCharge that recharges to 100% in 19 minutes.',
    specifications: {
      'Display': '6.67-inch 1.5K 120Hz Curved AMOLED',
      'Processor': 'MediaTek Dimensity 7200-Ultra',
      'RAM': '8 GB',
      'Storage': '256 GB',
      'Camera': '200MP Main OIS + 8MP Ultra-wide + 2MP Macro',
      'Charging': '120W In-box Charger, 5000mAh Battery',
      'Water Resistance': 'IP68 Certified Dust & Water Resistant',
      'Warranty': '1 Year Manufacturer Warranty'
    }
  },

  // 2. Laptops and Computers
  {
    name: 'Apple MacBook Air 13-inch M3 Chip (Midnight, 256GB SSD)',
    brand: 'Apple',
    categorySlug: 'laptops-and-computers',
    price: 104900,
    originalPrice: 114900,
    discountPercentage: 9,
    stock: 14,
    ratingAverage: 4.9,
    ratingCount: 198,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Supercharged by M3, the impossibly thin MacBook Air sails through work and play with up to 18 hours of battery life and support for up to two external displays.',
    specifications: {
      'Processor': 'Apple M3 chip (8-core CPU, 8-core GPU)',
      'Memory': '8 GB Unified Memory',
      'Storage': '256 GB Ultra-Fast SSD',
      'Display': '13.6-inch Liquid Retina display with True Tone',
      'Keyboard': 'Backlit Magic Keyboard with Touch ID',
      'Weight': '1.24 kg',
      'Battery': 'Up to 18 hours battery life',
      'Warranty': '1 Year Apple Warranty'
    }
  },
  {
    name: 'Dell XPS 15 9530 Intel Core i7 13th Gen Laptop',
    brand: 'Dell',
    categorySlug: 'laptops-and-computers',
    price: 144990,
    originalPrice: 159990,
    discountPercentage: 9,
    stock: 8,
    ratingAverage: 4.7,
    ratingCount: 89,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Precision-crafted from CNC machined aluminum and carbon fiber palm rest with Intel Core i7-13700H and NVIDIA GeForce RTX 4050 graphics.',
    specifications: {
      'Processor': '13th Gen Intel Core i7-13700H (14 cores)',
      'RAM': '16 GB DDR5 4800MHz',
      'Storage': '1 TB M.2 PCIe NVMe SSD',
      'Graphics': 'NVIDIA GeForce RTX 4050 6GB GDDR6',
      'Display': '15.6-inch FHD+ InfinityEdge IPS 500 nits',
      'OS': 'Windows 11 Home + MS Office 2021',
      'Warranty': '1 Year Onsite Hardware Service'
    }
  },
  {
    name: 'HP Pavilion 15.6-inch Gaming Laptop (Ryzen 7 7735HS, RTX 3050)',
    brand: 'HP',
    categorySlug: 'laptops-and-computers',
    price: 62490,
    originalPrice: 74990,
    discountPercentage: 17,
    stock: 20,
    ratingAverage: 4.6,
    ratingCount: 165,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Conquer the battlefield with AMD Ryzen 7 processing, NVIDIA RTX 3050 4GB dedicated graphics, dual fans for cooling, and a 144Hz FHD anti-glare display.',
    specifications: {
      'Processor': 'AMD Ryzen 7 7735HS (8 Cores, 16 Threads)',
      'RAM': '16 GB DDR5 4800MHz (expandable to 32GB)',
      'Storage': '512 GB PCIe Gen4 NVMe TLC M.2 SSD',
      'Graphics': 'NVIDIA GeForce RTX 3050 (4 GB GDDR6)',
      'Display': '15.6-inch FHD 144Hz IPS Micro-edge',
      'Audio': 'B&O dual speakers, HP Audio Boost',
      'Warranty': '1 Year HP Onsite Warranty'
    }
  },
  {
    name: 'Lenovo IdeaPad Slim 3 Intel Core i3 12th Gen Thin Laptop',
    brand: 'Lenovo',
    categorySlug: 'laptops-and-computers',
    price: 38990,
    originalPrice: 49990,
    discountPercentage: 22,
    stock: 30,
    ratingAverage: 4.4,
    ratingCount: 220,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Sleek, lightweight, and engineered for student productivity and daily multitasking with Dolby Audio, privacy shutter webcam, and Rapid Charge.',
    specifications: {
      'Processor': 'Intel Core i3-1215U 12th Gen',
      'RAM': '8 GB Soldered DDR4-3200',
      'Storage': '512 GB SSD M.2 2242 PCIe 4.0x4 NVMe',
      'Display': '15.6-inch FHD (1920x1080) Anti-glare',
      'Weight': '1.63 kg',
      'Battery': 'Up to 7 hours with Rapid Charge (80% in 1 hour)',
      'Warranty': '1 Year Lenovo Onsite Warranty'
    }
  },

  // 3. Televisions and Smart TVs
  {
    name: 'Sony Bravia 55-inch 4K Ultra HD Smart LED Google TV',
    brand: 'Sony',
    categorySlug: 'televisions-and-smart-tvs',
    price: 64990,
    originalPrice: 89900,
    discountPercentage: 28,
    stock: 10,
    ratingAverage: 4.8,
    ratingCount: 245,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Immerse yourself in lifelike color and contrast with the 4K Processor X1, Motionflow XR 200, Dolby Audio, and Google TV with voice remote.',
    specifications: {
      'Screen Size': '55 inches (139 cm)',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Refresh Rate': '60 Hz with Motionflow XR',
      'Sound': '20 Watts Output with Dolby Audio & Open Baffle Speaker',
      'Smart TV Features': 'Google TV, Apple AirPlay, Chromecast built-in',
      'Connectivity': '3 HDMI ports, 2 USB ports, Bluetooth 5.0, Dual-band Wi-Fi',
      'Warranty': '1 Year Comprehensive + 1 Year Additional Panel Warranty'
    }
  },
  {
    name: 'Samsung 65-inch Crystal 4K Vivid Pro Ultra HD Smart TV',
    brand: 'Samsung',
    categorySlug: 'televisions-and-smart-tvs',
    price: 58990,
    originalPrice: 79990,
    discountPercentage: 26,
    stock: 12,
    ratingAverage: 4.7,
    ratingCount: 190,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'PurColor technology delivers billion shades of true color with Crystal Processor 4K, SolarCell Remote, Q-Symphony sound, and IoT hub integration.',
    specifications: {
      'Screen Size': '65 inches (163 cm)',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Processor': 'Crystal Processor 4K',
      'HDR': 'HDR 10+ Support',
      'Sound': '20W with Object Tracking Sound Lite & Q-Symphony',
      'OS': 'Tizen OS Smart TV',
      'Warranty': '1 Year Standard Warranty + 1 Year on Panel'
    }
  },
  {
    name: 'LG 48-inch 4K Smart OLED TV (Cinema HDR & Dolby Atmos)',
    brand: 'LG',
    categorySlug: 'televisions-and-smart-tvs',
    price: 84990,
    originalPrice: 109990,
    discountPercentage: 23,
    stock: 7,
    ratingAverage: 4.9,
    ratingCount: 110,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Self-lit OLED pixels generate infinite contrast and pure blacks. Features α7 AI Processor 4K Gen6, 0.1ms response time, NVIDIA G-Sync, and Dolby Vision.',
    specifications: {
      'Screen Size': '48 inches (121 cm)',
      'Display Tech': 'Self-Lit OLED 4K',
      'Refresh Rate': '120Hz Native, VRR, ALLM, FreeSync & G-Sync',
      'Audio': 'Dolby Atmos 20W with AI Sound Pro 5.1.2 Virtual Mix',
      'Smart OS': 'webOS 23 with Magic Remote',
      'Warranty': '3 Years Comprehensive Manufacturer Warranty'
    }
  },

  // 4. Refrigerators
  {
    name: 'LG 242L 3-Star Smart Inverter Double Door Refrigerator',
    brand: 'LG',
    categorySlug: 'refrigerators',
    price: 25990,
    originalPrice: 31990,
    discountPercentage: 19,
    stock: 14,
    ratingAverage: 4.6,
    ratingCount: 340,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Frost Free double door refrigerator with Smart Inverter Compressor, Door Cooling+, Multi Air Flow, and toughened glass shelves.',
    specifications: {
      'Capacity': '242 Liters (Suitable for families of 2 to 3 members)',
      'Energy Rating': '3 Star BEE Efficiency',
      'Compressor': 'Smart Inverter Compressor with 10 Years Warranty',
      'Cooling Technology': 'Door Cooling+ & Multi Air Flow',
      'Shelves': 'Trimless Toughened Glass',
      'Special Features': 'Moist Balance Crisper, Anti-bacterial gasket',
      'Warranty': '1 Year on Product, 10 Years on Compressor'
    }
  },
  {
    name: 'Samsung 653L Frost Free Side by Side Refrigerator (Wi-Fi Enabled)',
    brand: 'Samsung',
    categorySlug: 'refrigerators',
    price: 79990,
    originalPrice: 102990,
    discountPercentage: 22,
    stock: 6,
    ratingAverage: 4.8,
    ratingCount: 95,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Spacemax Technology offers more storage inside with same external dimensions. Digital Inverter, All-Around Cooling, and SmartThings Wi-Fi control.',
    specifications: {
      'Capacity': '653 Liters (Freezer 244L, Fresh Food 409L)',
      'Type': 'Side by Side Convertible 5-in-1',
      'Cooling': 'All-Around Cooling & Power Freeze',
      'Smart Features': 'Wi-Fi Embedded, AI Energy Mode, SmartThings App',
      'Compressor': 'Digital Inverter with 20 Years Warranty',
      'Warranty': '1 Year Comprehensive, 20 Years on Digital Inverter'
    }
  },
  {
    name: 'Whirlpool 192L 3-Star Single Door Direct Cool Refrigerator',
    brand: 'Whirlpool',
    categorySlug: 'refrigerators',
    price: 14990,
    originalPrice: 18400,
    discountPercentage: 19,
    stock: 22,
    ratingAverage: 4.4,
    ratingCount: 410,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Economical single door refrigerator with Insulated Capillary Technology, 9 hours of cooling retention during power cuts, and extra large vegetable drawer.',
    specifications: {
      'Capacity': '192 Liters',
      'Energy Rating': '3 Star',
      'Technology': 'Direct Cool with 9 Hours Cooling Retention',
      'Shelves': 'Spill-proof Toughened Glass',
      'Defrosting': 'Manual Defrost with quick ice maker',
      'Warranty': '1 Year on Product, 10 Years on Compressor'
    }
  },

  // 5. Washing Machines
  {
    name: 'IFB 8kg 5-Star AI Powered Front Load Washing Machine',
    brand: 'IFB',
    categorySlug: 'washing-machines',
    price: 34990,
    originalPrice: 42990,
    discountPercentage: 19,
    stock: 11,
    ratingAverage: 4.7,
    ratingCount: 280,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Neural Network-based AI algorithm detects fabric type and weight to optimize wash time, water level, and drum action. Features Steam Wash and 3D Warm Soak.',
    specifications: {
      'Capacity': '8 kg (Suitable for 4-5 members)',
      'Energy Rating': '5 Star 2024 BEE Standard',
      'RPM': '1400 RPM High Spin Speed for Faster Drying',
      'Wash Programs': '14 Programs including Steam Wash, Hygiene Plus, Express 15',
      'Heater': 'Built-in In-situ Stainless Steel Heater',
      'Special Features': 'Aqua Energie water softener, Cradle Wash for delicates',
      'Warranty': '4 Years Comprehensive + 10 Years Motor Warranty'
    }
  },
  {
    name: 'Bosch 7kg 5-Star Fully Automatic Front Load Washing Machine',
    brand: 'Bosch',
    categorySlug: 'washing-machines',
    price: 29490,
    originalPrice: 36990,
    discountPercentage: 20,
    stock: 13,
    ratingAverage: 4.6,
    ratingCount: 195,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'German engineered EcoSilence Drive motor for quiet operation, Anti-Vibration side panels, and AllergyPlus certified wash program.',
    specifications: {
      'Capacity': '7 kg',
      'Energy Rating': '5 Star',
      'Motor': 'EcoSilence Drive Friction-Free Inverter Motor',
      'Spin Speed': '1200 RPM',
      'Drum': 'VarioDrum Gentle Care Stainless Steel',
      'Warranty': '2 Years on Product, 12 Years on Motor'
    }
  },
  {
    name: 'Samsung 7kg Inverter Fully Automatic Top Load Washing Machine',
    brand: 'Samsung',
    categorySlug: 'washing-machines',
    price: 17490,
    originalPrice: 22500,
    discountPercentage: 22,
    stock: 20,
    ratingAverage: 4.5,
    ratingCount: 310,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Wobble Technology delivers gentle fabric care with dynamic multi-directional water flows. Features Diamond Drum and Magic Filter.',
    specifications: {
      'Capacity': '7 kg',
      'Energy Rating': '5 Star',
      'Pulsator': 'Wobble Technology',
      'Spin Speed': '680 RPM',
      'Water Levels': '5 Levels',
      'Warranty': '3 Years on Product, 20 Years on Digital Inverter Motor'
    }
  },

  // 6. Air Conditioners
  {
    name: 'Daikin 1.5 Ton 5-Star Inverter Split AC (Copper, Triple Display)',
    brand: 'Daikin',
    categorySlug: 'air-conditioners',
    price: 44990,
    originalPrice: 54900,
    discountPercentage: 18,
    stock: 15,
    ratingAverage: 4.8,
    ratingCount: 220,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1614633833026-07204ef2267b?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Daikin Patented Swing Inverter Compressor with PM 2.5 air purifying filter, 3D airflow, and Coanda airflow ceiling cooling technology.',
    specifications: {
      'Tonnage': '1.5 Ton (Ideal for rooms up to 150 sq ft)',
      'Energy Rating': '5 Star BEE Rating (ISEER: 5.2)',
      'Condenser': '100% Grooved Copper Tubes',
      'Refrigerant': 'R32 Eco-Friendly Gas with Zero Ozone Depletion',
      'Features': 'Coanda Airflow, Power Chill, PM2.5 Filter, Dew Clean Technology',
      'Warranty': '1 Year on Unit, 5 Years on PCB, 10 Years on Compressor'
    }
  },
  {
    name: 'Voltas 1.5 Ton 3-Star Adjustable Inverter Split AC',
    brand: 'Voltas',
    categorySlug: 'air-conditioners',
    price: 32990,
    originalPrice: 42990,
    discountPercentage: 23,
    stock: 18,
    ratingAverage: 4.4,
    ratingCount: 380,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1614633833026-07204ef2267b?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'India’s most reliable AC with 4-in-1 Adjustable Cooling modes allowing capacity adjustments between 0.75 Ton, 1.0 Ton, 1.25 Ton, and 1.5 Ton based on room occupancy.',
    specifications: {
      'Capacity': '1.5 Ton',
      'Energy Rating': '3 Star (ISEER: 3.81)',
      'Condenser Coil': '100% Copper with Anti-Corrosive Blue Fins',
      'Special Features': '4-in-1 Adjustable Mode, High Ambient Cooling up to 52°C',
      'Warranty': '1 Year Comprehensive, 10 Years on Inverter Compressor'
    }
  },
  {
    name: 'Panasonic 1 Ton 5-Star Wi-Fi Smart Inverter Split AC',
    brand: 'Panasonic',
    categorySlug: 'air-conditioners',
    price: 36490,
    originalPrice: 46000,
    discountPercentage: 21,
    stock: 12,
    ratingAverage: 4.6,
    ratingCount: 140,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1614633833026-07204ef2267b?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Miraie IoT-enabled smart air conditioner. Control with Alexa, Google Assistant, or smartphone app. Features 7-in-1 Convertible modes and PM 0.1 Air Purification.',
    specifications: {
      'Tonnage': '1 Ton (Suitable for bedrooms up to 120 sq ft)',
      'Energy Rating': '5 Star (ISEER: 5.10)',
      'Smart Connectivity': 'Wi-Fi, Alexa & Google Home Voice Control',
      'Air Quality': 'PM 0.1 Air Filtration System',
      'Warranty': '1 Year Comprehensive, 4 Years on PCB, 9 Years on Compressor'
    }
  },

  // 7. Kitchen Appliances
  {
    name: 'Philips Digital Air Fryer HD9252 with Rapid Air Technology',
    brand: 'Philips',
    categorySlug: 'kitchen-appliances',
    price: 8999,
    originalPrice: 12995,
    discountPercentage: 31,
    stock: 28,
    ratingAverage: 4.7,
    ratingCount: 490,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Fry with up to 90% less fat. Features 7 preset touch screen cooking options, keep warm function, and easy to clean dishwasher-safe basket.',
    specifications: {
      'Capacity': '4.1 Liters Basket (0.8 kg food)',
      'Power': '1400 Watts',
      'Presets': '7 Presets (Fries, Meat, Fish, Cake, Veggies, etc.)',
      'Technology': 'Rapid Air Technology with Starfish Design',
      'Auto-off': 'Yes, with ready signal',
      'Warranty': '2 Years Philips Worldwide Guarantee'
    }
  },
  {
    name: 'Preethi Zodiac 750W Mixer Grinder with 5 Jars & Food Processor',
    brand: 'Preethi',
    categorySlug: 'kitchen-appliances',
    price: 7499,
    originalPrice: 10490,
    discountPercentage: 29,
    stock: 22,
    ratingAverage: 4.6,
    ratingCount: 650,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Equipped with Vega W5 motor capable of grinding tough ingredients in minutes. Includes Master Chef+ Jar for kneading atta in 1 min and chopping in seconds.',
    specifications: {
      'Motor Power': '750 Watts Vega W5 Copper Motor',
      'Number of Jars': '5 Jars including 2.1L Master Chef Jar and 3-in-1 Insta Fresh Juicer Jar',
      'Blades': 'Machine ground stainless steel blades',
      'Safety': 'Overload protection circuit breaker',
      'Warranty': '2 Years on Product, 5 Years on Motor'
    }
  },
  {
    name: 'Morphy Richards 25L Convection Microwave Oven (Motorized Rotisserie)',
    brand: 'Morphy Richards',
    categorySlug: 'kitchen-appliances',
    price: 11990,
    originalPrice: 15995,
    discountPercentage: 25,
    stock: 14,
    ratingAverage: 4.5,
    ratingCount: 160,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Stainless steel cavity ensures uniform heat reflection for baking cakes, grilling tandoori kebabs, and reheating with 200 auto cook menus.',
    specifications: {
      'Capacity': '25 Liters',
      'Cooking Modes': 'Baking, Grilling, Reheating, Defrosting, Roasting',
      'Cavity': 'High Grade Stainless Steel Cavity',
      'Auto Menus': '200 Auto Cook Menus',
      'Accessories': 'Baking Plate, High/Low Grill Wire Rack, Rotisserie Rod',
      'Warranty': '2 Years Comprehensive Warranty'
    }
  },

  // 8. Headphones and Earbuds
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear Headphones',
    brand: 'Sony',
    categorySlug: 'headphones-and-earbuds',
    price: 26990,
    originalPrice: 34990,
    discountPercentage: 23,
    stock: 20,
    ratingAverage: 4.9,
    ratingCount: 520,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Industry-leading Active Noise Cancellation with two processors and 8 microphones. High-Resolution Audio with LDAC, Speak-to-Chat, and 30-hour battery.',
    specifications: {
      'Type': 'Over-Ear Circumaural Wireless',
      'Noise Cancelling': 'HD Noise Cancelling Processor QN1 & V1 Chip',
      'Driver': '30mm precision engineered carbon fiber composite',
      'Battery Life': '30 hours with ANC on (3-min charge gives 3 hours)',
      'Microphones': '4 beamforming microphones with AI noise reduction',
      'Bluetooth': 'Version 5.2, Multipoint Connection (2 devices)',
      'Warranty': '1 Year Sony India Warranty'
    }
  },
  {
    name: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    brand: 'Apple',
    categorySlug: 'headphones-and-earbuds',
    price: 20990,
    originalPrice: 24900,
    discountPercentage: 16,
    stock: 24,
    ratingAverage: 4.9,
    ratingCount: 680,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Up to 2x more Active Noise Cancellation with Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking, and USB-C case with speaker.',
    specifications: {
      'Chip': 'Apple H2 headphone chip, U1 chip in case',
      'Audio Features': 'Personalized Spatial Audio with dynamic head tracking',
      'Battery': 'Up to 6 hours listening time on single charge (30 hrs with case)',
      'Water Resistance': 'IP54 dust, sweat, and water resistant',
      'Charging': 'USB-C, MagSafe, Apple Watch charger, Qi certified',
      'Warranty': '1 Year Apple Warranty'
    }
  },
  {
    name: 'boAt Rockerz 550 Over-Ear Wireless Bluetooth Headphones',
    brand: 'boAt',
    categorySlug: 'headphones-and-earbuds',
    price: 1499,
    originalPrice: 3999,
    discountPercentage: 63,
    stock: 45,
    ratingAverage: 4.3,
    ratingCount: 920,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Immersive Signature Audio driven by powerful 50mm dynamic drivers. Ergonomic plush ear cushions and up to 20 hours of continuous wireless playback.',
    specifications: {
      'Driver Size': '50mm Dynamic Bass Drivers',
      'Playback Time': 'Up to 20 Hours Battery Backup',
      'Connectivity': 'Bluetooth v5.0 and 3.5mm AUX Cable',
      'Physical Isolation': 'Over-ear passive noise cancelling cushions',
      'Warranty': '1 Year Replacement Warranty'
    }
  },

  // 9. Speakers and Soundbars
  {
    name: 'JBL Bar 500 Pro Dolby Atmos Soundbar with 10" Wireless Subwoofer',
    brand: 'JBL',
    categorySlug: 'speakers-and-soundbars',
    price: 39999,
    originalPrice: 49999,
    discountPercentage: 20,
    stock: 8,
    ratingAverage: 4.8,
    ratingCount: 130,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=700&auto=format&fit=crop&q=80'
    ],
    description: '590 Watts of thunderous sound with MultiBeam technology and Dolby Atmos 3D surround sound. Stream music via AirPlay, Alexa Multi-Room Music, and Chromecast built-in.',
    specifications: {
      'Total Output Power': '590 Watts (Soundbar 290W + Subwoofer 300W)',
      'Subwoofer': '10-inch Down-firing Wireless Subwoofer',
      'Surround Sound': 'Dolby Atmos & MultiBeam Technology',
      'HDMI': 'HDMI eARC with 4K Dolby Vision pass-through',
      'Wi-Fi': 'Dual band Wi-Fi with AirPlay 2 and Spotify Connect',
      'Warranty': '1 Year Official Brand Warranty'
    }
  },
  {
    name: 'Marshall Kilburn II Portable Bluetooth Speaker (Black and Brass)',
    brand: 'Marshall',
    categorySlug: 'speakers-and-soundbars',
    price: 24999,
    originalPrice: 29999,
    discountPercentage: 17,
    stock: 12,
    ratingAverage: 4.9,
    ratingCount: 165,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'This stout-hearted hero offers 20+ hours of portable playtime on a single charge. Multi-directional Blumlein Stereo Sound immerses you in music indoors or out.',
    specifications: {
      'Battery Life': '20+ Hours Playtime (20 min charge gives 3 hours)',
      'Sound Output': '36 Watts Class D Multi-directional stereo',
      'Water Resistance': 'IPX2 Water-resistant design',
      'Controls': 'Analog control knobs for bass, treble, and volume',
      'Weight': '2.5 kg with guitar-inspired carry strap',
      'Warranty': '1 Year Marshall India Warranty'
    }
  },
  {
    name: 'boAt Aavante Bar 1160 60W 2.0 Channel Bluetooth Soundbar',
    brand: 'boAt',
    categorySlug: 'speakers-and-soundbars',
    price: 3499,
    originalPrice: 9990,
    discountPercentage: 65,
    stock: 35,
    ratingAverage: 4.4,
    ratingCount: 840,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Upgrade your TV sound with 60W RMS signature sound, 2.25" quad drivers, multiple EQ modes for movies, music, and news, plus optical, USB, and Bluetooth modes.',
    specifications: {
      'Output': '60 Watts RMS 2.0 Channel',
      'Drivers': '4 x 2.25 inch Dynamic Drivers',
      'EQ Modes': 'Movie, Music, News, 3D',
      'Connectivity': 'Bluetooth v5.0, AUX, USB, Optical',
      'Mounting': 'Wall-mountable with sleek metal grill',
      'Warranty': '1 Year boAt Warranty'
    }
  },

  // 10. Cameras and Accessories
  {
    name: 'Sony Alpha ILCE-7M4 Full-Frame Hybrid Mirrorless Camera Body',
    brand: 'Sony',
    categorySlug: 'cameras-and-accessories',
    price: 199990,
    originalPrice: 222990,
    discountPercentage: 10,
    stock: 5,
    ratingAverage: 4.9,
    ratingCount: 75,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&auto=format&fit=crop&q=80'
    ],
    description: '33MP full-frame Exmor R back-illuminated CMOS sensor with BIONZ XR processing. Records 4K 60p 10-bit 4:2:2 video with Real-time Eye AF for humans, animals, and birds.',
    specifications: {
      'Sensor': '33.0 Megapixel Full-Frame Exmor R CMOS',
      'Processor': 'BIONZ XR image processor',
      'Video': '4K 60p recording, 10-bit 4:2:2, S-Cinetone profile',
      'Autofocus': '759 phase-detection points with AI subject recognition',
      'Stabilization': '5-axis in-body optical image stabilization (5.5 stops)',
      'Screen': '3.0-inch vari-angle touch LCD',
      'Warranty': '2 Years + 1 Year Additional on Registration'
    }
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm IS STM Lens',
    brand: 'Canon',
    categorySlug: 'cameras-and-accessories',
    price: 59990,
    originalPrice: 75995,
    discountPercentage: 21,
    stock: 10,
    ratingAverage: 4.7,
    ratingCount: 95,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Lightweight creator-friendly mirrorless camera with 24.2MP APS-C sensor, 6K oversampled 4K 30p uncropped video, Dual Pixel CMOS AF II, and Close-up Demo mode.',
    specifications: {
      'Sensor': '24.2 MP APS-C CMOS Sensor',
      'Processor': 'DIGIC X Engine',
      'Continuous Shooting': 'Up to 15 fps electronic shutter',
      'Video': '4K 30p uncropped (6K oversampled), Full HD 120p slow motion',
      'Lens Included': 'RF-S 18-45mm f/4.5-6.3 IS STM',
      'Weight': 'Only 375 grams (body with battery & card)',
      'Warranty': '2 Years Canon India Warranty'
    }
  },
  {
    name: 'DJI Osmo Mobile 6 Smartphone Gimbal 3-Axis Handheld Stabilizer',
    brand: 'DJI',
    categorySlug: 'cameras-and-accessories',
    price: 11990,
    originalPrice: 14990,
    discountPercentage: 20,
    stock: 16,
    ratingAverage: 4.7,
    ratingCount: 180,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Foldable 3-axis smartphone gimbal with built-in extension rod, quick launch magnetic phone clamp, ActiveTrack 5.0, and status panel display.',
    specifications: {
      'Stabilization': '3-Axis Motorized Gimbal',
      'Extension Rod': 'Built-in 215mm telescopic selfie rod',
      'Tracking': 'ActiveTrack 5.0 with face and subject lock',
      'Battery': 'Up to 6.4 hours operating time',
      'Phone Clamp': 'Quick-release magnetic clamp (no balancing needed)',
      'Warranty': '1 Year Manufacturer Warranty'
    }
  },

  // 11. Smartwatches and Wearables
  {
    name: 'Apple Watch Series 9 GPS 45mm (Midnight Aluminum Case)',
    brand: 'Apple',
    categorySlug: 'smartwatches-and-wearables',
    price: 41900,
    originalPrice: 44900,
    discountPercentage: 7,
    stock: 14,
    ratingAverage: 4.9,
    ratingCount: 310,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Powered by S9 SiP chip with Double Tap gesture control, brighter Always-On Retina display (2000 nits), Precision Finding for iPhone, and ECG app.',
    specifications: {
      'Display': 'Always-On OLED Retina Display up to 2000 nits',
      'Processor': 'S9 SiP 64-bit dual-core with 4-core Neural Engine',
      'Health Sensors': 'Blood Oxygen, ECG, Temperature sensing, Heart Rate',
      'Safety': 'Crash Detection, Fall Detection, Emergency SOS',
      'Water Resistance': '50 meters swimproof',
      'Battery': 'Up to 18 hours (36 hours in Low Power Mode)',
      'Warranty': '1 Year Apple Warranty'
    }
  },
  {
    name: 'Samsung Galaxy Watch 6 Bluetooth 44mm (Graphite)',
    brand: 'Samsung',
    categorySlug: 'smartwatches-and-wearables',
    price: 21999,
    originalPrice: 33999,
    discountPercentage: 35,
    stock: 16,
    ratingAverage: 4.7,
    ratingCount: 215,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700&auto=format&fit=crop&q=80'
    ],
    description: '20% larger display with 30% slimmer bezel. BioActive Sensor for body composition (BIA) analysis, blood pressure, ECG, and advanced sleep coaching.',
    specifications: {
      'Display': '1.5-inch Super AMOLED with Sapphire Crystal glass',
      'Sensors': 'BioActive Sensor (Optical Heart + Electrical Heart + Bioelectrical Impedance)',
      'OS': 'Wear OS Powered by Samsung (One UI 5 Watch)',
      'Durability': '5ATM + IP68 / MIL-STD-810H military certified',
      'Battery': '425 mAh with Fast Wireless Charging',
      'Warranty': '1 Year Brand Warranty'
    }
  },
  {
    name: 'Noise ColorFit Pro 5 AMOLED Display Bluetooth Calling Smartwatch',
    brand: 'Noise',
    categorySlug: 'smartwatches-and-wearables',
    price: 2999,
    originalPrice: 7999,
    discountPercentage: 63,
    stock: 50,
    ratingAverage: 4.4,
    ratingCount: 780,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80'
    ],
    description: '1.85-inch AMOLED display with functional crown, Tru Sync Bluetooth Calling, SOS calling, 100+ sports modes, and up to 7-day battery life.',
    specifications: {
      'Display': '1.85-inch AMOLED 600 nits Always-On',
      'Calling': 'Single-chip Bluetooth v5.3 Calling with dial pad & contacts',
      'Health Suite': 'Noise Health Suite with SpO2, Heart Rate, Stress monitor',
      'Battery': 'Up to 7 days normal usage (2 days with heavy calling)',
      'Water Rating': 'IP68 Water and Dust Resistant',
      'Warranty': '1 Year Replacement Warranty'
    }
  },

  // 12. Gaming Accessories
  {
    name: 'Logitech G502 HERO High Performance RGB Gaming Mouse',
    brand: 'Logitech',
    categorySlug: 'gaming-accessories',
    price: 3995,
    originalPrice: 5495,
    discountPercentage: 27,
    stock: 25,
    ratingAverage: 4.8,
    ratingCount: 890,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'The world’s most popular gaming mouse. HERO 25K gaming sensor provides sub-micron tracking, 11 programmable buttons, and 5 adjustable 3.6g weights.',
    specifications: {
      'Sensor': 'HERO 25K Sensor (100 to 25,600 DPI zero smoothing)',
      'Buttons': '11 Programmable Buttons with hyper-fast scroll wheel',
      'Weight': 'Adjustable with 5 removable 3.6g weights',
      'Lighting': 'LIGHTSYNC RGB customizable with 16.8 million colors',
      'Durability': 'Mechanical switch button tensioning',
      'Warranty': '2 Years Limited Hardware Warranty'
    }
  },
  {
    name: 'Razer BlackWidow V4 Mechanical RGB Gaming Keyboard (Green Switches)',
    brand: 'Razer',
    categorySlug: 'gaming-accessories',
    price: 13990,
    originalPrice: 17999,
    discountPercentage: 22,
    stock: 12,
    ratingAverage: 4.8,
    ratingCount: 170,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Full-size mechanical gaming keyboard with clicky tactile Green switches, multi-function roller, 6 dedicated macro keys, plush magnetic wrist rest, and 8000Hz polling rate.',
    specifications: {
      'Switch Type': 'Razer Green Clicky Mechanical Switches',
      'Keycaps': 'Doubleshot ABS Keycaps',
      'Lighting': 'Per-key Chroma RGB with 2-side underglow',
      'Polling Rate': 'Razer HyperPolling up to 8000 Hz',
      'Wrist Rest': 'Magnetic plush leatherette wrist rest with underglow',
      'Warranty': '2 Years Manufacturer Warranty'
    }
  }
];

module.exports = productsData;
