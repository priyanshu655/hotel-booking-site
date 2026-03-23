// ══════════════════════════════════════════════════════════════════════════════
// Real places database with actual coordinates for 30+ popular destinations
// Each place has: name, lat, lng, category tags, icon, description, tip
// ══════════════════════════════════════════════════════════════════════════════

const PLACES_DB = {
  // ─── INDIA ──────────────────────────────────────────────────────────────────
  goa: {
    center: { lat: 15.4909, lng: 73.8278 },
    places: [
      { name: "Baga Beach", lat: 15.5551, lng: 73.7514, tags: ["beach","nightlife","adventure"], icon: "🏖️", desc: "One of Goa's most popular beaches with water sports, shacks, and vibrant nightlife along the shoreline.", tip: "Visit early morning for a peaceful walk, evenings for the party scene." },
      { name: "Basilica of Bom Jesus", lat: 15.5009, lng: 73.9116, tags: ["history","spiritual","art"], icon: "⛪", desc: "UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier, a masterpiece of Baroque architecture.", tip: "Free entry. Visit on a weekday morning to avoid tourist crowds." },
      { name: "Fort Aguada", lat: 15.4928, lng: 73.7739, tags: ["history","adventure","nature"], icon: "🏰", desc: "17th-century Portuguese fort offering panoramic views of the Arabian Sea and Sinquerim Beach below.", tip: "Go during sunset for stunning views. Carry water as there's no shade." },
      { name: "Anjuna Flea Market", lat: 15.5738, lng: 73.7412, tags: ["shopping","foodie","art"], icon: "🛍️", desc: "Iconic Wednesday flea market selling everything from handicrafts to spices, with live music and food stalls.", tip: "Bargain hard — start at 40% of the quoted price. Goes from 9 AM to sunset." },
      { name: "Dudhsagar Falls", lat: 15.3144, lng: 74.3143, tags: ["nature","adventure"], icon: "🌊", desc: "India's 5th tallest waterfall at 310m, surrounded by lush forest in the Bhagwan Mahavir Wildlife Sanctuary.", tip: "Visit during monsoon (Jun-Sep) for full flow. Book a jeep from Mollem." },
      { name: "Chapora Fort", lat: 15.6049, lng: 73.7347, tags: ["history","nature","adventure"], icon: "🏯", desc: "Made famous by the Bollywood film Dil Chahta Hai, this ruined fort offers breathtaking sunset views over Vagator.", tip: "Climb up 30 mins before sunset. No entry fee." },
      { name: "Thalassa Restaurant", lat: 15.5958, lng: 73.7366, tags: ["foodie","nightlife"], icon: "🍽️", desc: "Legendary Greek restaurant perched on Vagator cliff with stunning sea views. Famous for its moussaka and cocktails.", tip: "Book 2 days ahead for a sunset table. Try the grilled fish platter." },
      { name: "Se Cathedral", lat: 15.5042, lng: 73.9125, tags: ["history","spiritual","art"], icon: "⛪", desc: "The largest church in Asia, this 16th-century cathedral in Old Goa features stunning Portuguese-Gothic architecture.", tip: "Combine with Basilica of Bom Jesus — they're a 2-min walk apart." },
      { name: "Palolem Beach", lat: 15.0100, lng: 74.0232, tags: ["beach","nature","adventure"], icon: "🏖️", desc: "Crescent-shaped beach in South Goa known for its calm waters, kayaking, dolphin trips, and silent noise parties.", tip: "Stay at beach huts right on the sand. Book early in peak season." },
      { name: "Spice Plantation Sahakari", lat: 15.4654, lng: 74.0068, tags: ["nature","foodie"], icon: "🌿", desc: "Guided tour through fragrant spice gardens with traditional Goan lunch served on banana leaves.", tip: "The elephant bathing experience here is unique. Visit in morning." },
      { name: "Club Cubana", lat: 15.5617, lng: 73.7626, tags: ["nightlife"], icon: "🎉", desc: "Hilltop nightclub known as the 'nightclub in the sky' with pool, multiple dance floors, and panoramic views.", tip: "Ladies get free entry on Wednesdays. Opens at 9:30 PM." },
      { name: "Mapusa Friday Market", lat: 15.5922, lng: 73.8085, tags: ["shopping","foodie"], icon: "🛍️", desc: "Authentic local market where Goans shop for fresh produce, sausages, cashews, feni, and local spices.", tip: "Go by 8 AM for the freshest produce. Try the local pork sausages." },
      { name: "Calangute Beach", lat: 15.5434, lng: 73.7553, tags: ["beach","adventure","shopping"], icon: "🏖️", desc: "The 'Queen of Beaches' — Goa's longest and most famous beach strip with parasailing, jet skiing, and shopping.", tip: "Avoid peak afternoon, go for morning water sports." },
      { name: "Fontainhas Latin Quarter", lat: 15.4948, lng: 73.8122, tags: ["history","art","foodie"], icon: "🎨", desc: "Goa's old Portuguese quarter with colorful colonial houses, art galleries, bakeries, and cobbled streets.", tip: "Join a heritage walking tour. Visit Venite restaurant for authentic Goan food." },
      { name: "Divar Island", lat: 15.5146, lng: 73.8811, tags: ["nature","history","spiritual"], icon: "🏝️", desc: "Peaceful island accessible by free ferry, dotted with Portuguese churches, paddy fields, and old mansions.", tip: "Rent a scooter and explore for half a day. Almost no tourists." },
    ]
  },

  delhi: {
    center: { lat: 28.6139, lng: 77.2090 },
    places: [
      { name: "Red Fort", lat: 28.6562, lng: 77.2410, tags: ["history","art"], icon: "🏰", desc: "Mughal emperor Shah Jahan's magnificent red sandstone fort, a UNESCO World Heritage Site and symbol of India.", tip: "Visit the evening Sound & Light show. Closed on Mondays." },
      { name: "Qutub Minar", lat: 28.5245, lng: 77.1855, tags: ["history","art"], icon: "🗼", desc: "73-meter victory tower built in 1193, the tallest brick minaret in the world with intricate carvings.", tip: "Go early morning to avoid crowds. The iron pillar nearby is a metallurgical wonder." },
      { name: "Chandni Chowk", lat: 28.6506, lng: 77.2304, tags: ["shopping","foodie"], icon: "🛍️", desc: "Old Delhi's legendary 17th-century market street — a sensory explosion of food, spices, fabric, and jewelry.", tip: "Try paranthe from Paranthe Wali Gali. Best explored on a cycle rickshaw." },
      { name: "Humayun's Tomb", lat: 28.5933, lng: 77.2507, tags: ["history","art","nature"], icon: "🕌", desc: "Stunning Mughal garden tomb that inspired the Taj Mahal. Lush gardens perfect for photography.", tip: "Visit at golden hour for the best photos. Combined ticket with Isa Khan's tomb." },
      { name: "India Gate", lat: 28.6129, lng: 77.2295, tags: ["history"], icon: "🏛️", desc: "42-meter war memorial arch on Rajpath, honoring 70,000 Indian soldiers. Beautiful when lit up at night.", tip: "Visit after sunset when it's illuminated. Ice cream carts nearby." },
      { name: "Lotus Temple", lat: 28.5535, lng: 77.2588, tags: ["spiritual","art"], icon: "🪷", desc: "Flower-shaped Bahá'í House of Worship made of white marble. Open to all faiths for meditation.", tip: "No entry fee. Beautiful at dusk. Closed on Mondays." },
      { name: "Jama Masjid", lat: 28.6507, lng: 77.2334, tags: ["history","spiritual"], icon: "🕌", desc: "India's largest mosque built by Shah Jahan, with capacity for 25,000 worshippers. Climb the minaret for views.", tip: "Dress modestly. The minaret climb costs ₹300 but gives incredible Old Delhi views." },
      { name: "Hauz Khas Village", lat: 28.5493, lng: 77.2001, tags: ["nightlife","foodie","art","shopping"], icon: "🎨", desc: "Trendy neighborhood with boutique shops, art galleries, cafes, and nightlife around a medieval water tank.", tip: "Visit the deer park and lake ruins before hitting the cafes and bars." },
      { name: "Akshardham Temple", lat: 28.6127, lng: 77.2773, tags: ["spiritual","art"], icon: "🛕", desc: "Breathtaking modern Hindu temple complex with musical fountain show and boat ride through Indian history.", tip: "No phones/cameras allowed inside. The evening fountain show is a must." },
      { name: "Karim's Restaurant", lat: 28.6488, lng: 77.2336, tags: ["foodie"], icon: "🍖", desc: "Legendary Mughlai restaurant since 1913, tucked in the lanes behind Jama Masjid. Famous for mutton burra.", tip: "Order the Mutton Burra Kebab and Chicken Jahangiri. Cash only." },
      { name: "Dilli Haat", lat: 28.5730, lng: 77.2091, tags: ["shopping","foodie","art"], icon: "🛍️", desc: "Open-air craft bazaar with stalls from every Indian state. Street food court serves regional cuisines.", tip: "Entry ₹30. Bargain for crafts. Try momos from the Northeast stall." },
      { name: "Lodhi Garden", lat: 28.5930, lng: 77.2197, tags: ["nature","history"], icon: "🌿", desc: "Peaceful 90-acre park dotted with 15th-century Mughal tombs, popular with joggers and birdwatchers.", tip: "Early morning is magical. Free entry. Great for photography." },
    ]
  },

  mumbai: {
    center: { lat: 19.0760, lng: 72.8777 },
    places: [
      { name: "Gateway of India", lat: 19.0402, lng: 72.8347, tags: ["history","art"], icon: "🏛️", desc: "Iconic arch monument overlooking the Arabian Sea, built in 1924 to commemorate King George V's visit.", tip: "Visit at sunrise for the best photos. Take a ferry to Elephanta Caves from here." },
      { name: "Marine Drive", lat: 19.0748, lng: 72.8227, tags: ["nature","nightlife"], icon: "🌊", desc: "3.6km seafront promenade known as the 'Queen's Necklace' for its curved string of streetlights at night.", tip: "Walk from Nariman Point to Chowpatty at sunset. Best city views at night." },
      { name: "Elephanta Caves", lat: 18.9633, lng: 72.9315, tags: ["history","spiritual","art"], icon: "🏛️", desc: "UNESCO World Heritage rock-cut cave temples on an island, featuring massive Shiva sculptures from 5th century.", tip: "Take the 9 AM ferry from Gateway. Closed on Mondays. Carry water." },
      { name: "Crawford Market", lat: 18.9477, lng: 72.8344, tags: ["shopping","foodie"], icon: "🛍️", desc: "Heritage market since 1869 selling exotic fruits, spices, pets, and imported goods under Norman Gothic architecture.", tip: "Go before 11 AM. The wholesale fruit section is incredible for photography." },
      { name: "Chhatrapati Shivaji Terminus", lat: 18.9398, lng: 72.8355, tags: ["history","art"], icon: "🚂", desc: "UNESCO-listed Victorian Gothic railway station, an architectural marvel still functioning as Mumbai's busiest terminal.", tip: "Visit at night when it's beautifully lit. The heritage gallery inside is free." },
      { name: "Juhu Beach", lat: 19.0987, lng: 72.8265, tags: ["beach","foodie"], icon: "🏖️", desc: "Mumbai's most famous beach where Bollywood stars live nearby. Famous for pav bhaji and bhel puri stalls.", tip: "Go for evening street food — try pav bhaji at the stalls near the entrance." },
      { name: "Siddhivinayak Temple", lat: 19.0168, lng: 72.8301, tags: ["spiritual"], icon: "🛕", desc: "One of India's richest and most visited Hindu temples dedicated to Lord Ganesha, built in 1801.", tip: "Visit on Tuesday (auspicious day). Morning darshan is less crowded." },
      { name: "Leopold Cafe", lat: 19.0317, lng: 72.8318, tags: ["foodie","nightlife","history"], icon: "☕", desc: "Legendary cafe since 1871, featured in the novel Shantaram. Popular with travelers and locals for cold beers and kebabs.", tip: "Try the chicken tikka and chilled beer. Bullet holes from 26/11 are preserved." },
      { name: "Colaba Causeway", lat: 19.0325, lng: 72.8320, tags: ["shopping","art"], icon: "🛍️", desc: "Bustling street market selling antiques, jewelry, clothes, and handicrafts alongside colonial-era buildings.", tip: "Bargain hard — start at 30% of the asking price. Best in the evening." },
      { name: "Haji Ali Dargah", lat: 19.0365, lng: 72.8089, tags: ["spiritual","history"], icon: "🕌", desc: "Iconic mosque on a tiny islet connected to the mainland by a narrow causeway, accessible only at low tide.", tip: "Check tide timings before going. Beautiful at sunset. Free entry." },
      { name: "Bandra-Worli Sea Link", lat: 19.0395, lng: 72.8189, tags: ["adventure"], icon: "🌉", desc: "Stunning cable-stayed bridge spanning the Mahim Bay, an engineering marvel offering spectacular city views.", tip: "Drive across at night for the best views. No stopping allowed on the bridge." },
      { name: "Dharavi", lat: 19.0414, lng: 72.8527, tags: ["history","art","shopping"], icon: "🏘️", desc: "Asia's largest slum but also a thriving hub of cottage industries — leather, pottery, recycling — generating $1B annually.", tip: "Book an ethical walking tour with Reality Tours. Photography restricted." },
    ]
  },

  jaipur: {
    center: { lat: 26.9124, lng: 75.7873 },
    places: [
      { name: "Amber Fort", lat: 26.9855, lng: 75.8513, tags: ["history","art"], icon: "🏰", desc: "Magnificent hilltop fort blending Rajput and Mughal architecture, with the stunning Sheesh Mahal (Mirror Palace).", tip: "Go early morning. Skip the elephant ride (ethical concerns) — take a jeep instead." },
      { name: "Hawa Mahal", lat: 26.9239, lng: 75.8267, tags: ["history","art"], icon: "🏛️", desc: "Iconic 'Palace of Winds' with 953 small jharokha windows, built so royal women could observe street festivals.", tip: "Best photographed from the cafe across the street. Visit early morning." },
      { name: "City Palace", lat: 26.9258, lng: 75.8237, tags: ["history","art"], icon: "🏰", desc: "Sprawling palace complex blending Rajasthani and Mughal architecture, still home to the Jaipur royal family.", tip: "Buy the composite ticket for all sections. The textile gallery is exceptional." },
      { name: "Jantar Mantar", lat: 26.9249, lng: 75.8244, tags: ["history","art"], icon: "🔭", desc: "UNESCO World Heritage astronomical observation site with the world's largest stone sundial.", tip: "Hire a guide (₹200) — without one, the instruments make no sense." },
      { name: "Nahargarh Fort", lat: 26.9386, lng: 75.8154, tags: ["history","nature","adventure"], icon: "🏯", desc: "Hilltop fort offering the best panoramic views of Jaipur's pink cityscape, especially magical at sunset.", tip: "Drive up for sunset. The Padao Restaurant at the fort has great views and food." },
      { name: "Johari Bazaar", lat: 26.9192, lng: 75.8246, tags: ["shopping"], icon: "💎", desc: "Jaipur's famous jewelry market — the gemstone capital of India with kundan, meenakari, and precious stones.", tip: "Get a trusted local to help you buy. Prices start high — bargain firmly." },
      { name: "Albert Hall Museum", lat: 26.9119, lng: 75.8193, tags: ["history","art"], icon: "🏛️", desc: "Rajasthan's oldest museum in a stunning Indo-Saracenic building, with Egyptian mummy and rare artifacts.", tip: "Visit in evening when the building is lit up in golden lights." },
      { name: "Jal Mahal", lat: 26.9533, lng: 75.8463, tags: ["history","nature"], icon: "🏰", desc: "Ethereal 'Water Palace' floating in the middle of Man Sagar Lake, surrounded by the Aravalli hills.", tip: "Can only view from outside — no entry allowed. Best at sunset." },
      { name: "Chokhi Dhani", lat: 26.7846, lng: 75.8248, tags: ["foodie","art"], icon: "🍛", desc: "Rajasthani ethnic village resort with unlimited traditional thali, folk performances, puppet shows, and camel rides.", tip: "Go hungry — the thali has 25+ items. Book ahead on weekends." },
      { name: "Bapu Bazaar", lat: 26.9174, lng: 75.8219, tags: ["shopping","art"], icon: "🛍️", desc: "Vibrant market street famous for Jaipuri quilts, mojari shoes, block-printed fabrics, and lac bangles.", tip: "Best prices at smaller shops away from the main street. Go in the evening." },
    ]
  },

  jodhpur: {
    center: { lat: 26.2389, lng: 73.0243 },
    places: [
      { name: "Mehrangarh Fort", lat: 26.2979, lng: 73.0188, tags: ["history","art","adventure"], icon: "🏰", desc: "One of India's largest and most magnificent forts, rising 125m above the blue city with stunning palaces and panoramic views.", tip: "Take the audio guide — it's excellent. Visit the museum and hear the cannons at noon." },
      { name: "Blue City Old Town", lat: 26.2925, lng: 73.0205, tags: ["history","art","shopping"], icon: "🏘️", desc: "The iconic blue-painted Brahmin houses cascading below Mehrangarh Fort, best viewed from the fort ramparts.", tip: "Get lost in the winding lanes. Hire a local guide for the hidden gems." },
      { name: "Jaswant Thada", lat: 26.2996, lng: 73.0146, tags: ["history","spiritual"], icon: "🕌", desc: "Stunning white marble cenotaph memorial to Maharaja Jaswant Singh II, with intricate carvings and peaceful gardens.", tip: "Visit at sunset when the marble glows golden. Only 5 min walk from Mehrangarh." },
      { name: "Umaid Bhawan Palace", lat: 26.2640, lng: 73.0485, tags: ["history","art"], icon: "🏛️", desc: "One of the world's largest private residences, part royal residence, part luxury hotel, with stunning Art Deco interiors.", tip: "Visit the museum section (₹30). The gardens and classic car collection are impressive." },
      { name: "Clock Tower & Sardar Market", lat: 26.2920, lng: 73.0264, tags: ["shopping","foodie"], icon: "🛍️", desc: "Bustling market around the iconic Ghanta Ghar tower, famous for spices, textiles, handicrafts, and street food.", tip: "Try the famous makhania lassi at Shri Mishrilal Hotel. Bargain hard for better prices." },
      { name: "Toorji Ka Jhalra Stepwell", lat: 26.2937, lng: 73.0230, tags: ["history","art"], icon: "🏛️", desc: "Beautifully restored 18th-century stepwell with intricate carvings, now a popular Instagram spot with cafes nearby.", tip: "Visit early morning for the best photos. The Stepwell Cafe next door is excellent." },
      { name: "Rao Jodha Desert Rock Park", lat: 26.2998, lng: 73.0210, tags: ["nature","adventure"], icon: "🌿", desc: "Ecological restoration project at the base of Mehrangarh with 70+ desert plant species and rocky trails.", tip: "Go in early morning or evening. Great for birdwatching and nature walks." },
      { name: "Mandore Gardens", lat: 26.3395, lng: 73.0282, tags: ["history","nature"], icon: "🌿", desc: "Ancient capital of Marwar with royal cenotaphs, temples, and a Hall of Heroes carved into rock.", tip: "Visit in the morning when langurs are active. Local guides can share legends." },
      { name: "Kaylana Lake", lat: 26.2825, lng: 72.9687, tags: ["nature"], icon: "🌊", desc: "Scenic artificial lake perfect for sunset views, birdwatching, and peaceful boat rides.", tip: "Visit at sunset for stunning views. Migratory birds come October-March." },
      { name: "Balsamand Lake Palace", lat: 26.3058, lng: 72.9919, tags: ["nature","history"], icon: "🏰", desc: "12th-century artificial lake with a heritage palace hotel, surrounded by lush gardens and peacocks.", tip: "Non-guests can visit the gardens for a fee. Great for a quiet morning walk." },
      { name: "Girdikot & Nai Sarak", lat: 26.2910, lng: 73.0250, tags: ["shopping","art"], icon: "🛍️", desc: "Narrow lanes near Clock Tower famous for tie-dye fabrics, mojari shoes, antiques, and Jodhpuri suits.", tip: "Jodhpuri suits here are authentic and well-priced. Get custom tailoring in 24 hours." },
      { name: "Omelette Shop", lat: 26.2928, lng: 73.0262, tags: ["foodie"], icon: "🍳", desc: "Legendary street stall near Clock Tower serving fluffy omelets and bread since decades — a local institution.", tip: "Try the butter omelette with spicy chutney. Open only mornings." },
      { name: "Flying Fox Zipline", lat: 26.2979, lng: 73.0188, tags: ["adventure"], icon: "🦅", desc: "Six ziplines soaring over the Mehrangarh battlements with breathtaking views of the blue city below.", tip: "Book morning slots for cooler weather. Minimum age 10 years." },
      { name: "Bishnoi Village Safari", lat: 26.1500, lng: 72.9500, tags: ["nature","adventure"], icon: "🦌", desc: "Visit traditional Bishnoi villages to see blackbuck, chinkara, and witness eco-friendly lifestyle and crafts.", tip: "Book a half-day safari. Best October-March. You may spot nilgai and peacocks." },
      { name: "RAAS Jodhpur", lat: 26.2960, lng: 73.0190, tags: ["foodie","art"], icon: "🍽️", desc: "Award-winning boutique hotel with rooftop restaurant Darikhana offering stunning fort views and fusion cuisine.", tip: "Book a sunset dinner table facing the fort. The cocktails are excellent." },
    ]
  },

  paris: {
    center: { lat: 48.8566, lng: 2.3522 },
    places: [
      { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, tags: ["history","art"], icon: "🗼", desc: "The 330m iron lattice icon of Paris. Take the elevator or climb 674 stairs for breathtaking city panoramas.", tip: "Book tickets online 2 months ahead. Visit at night when it sparkles every hour." },
      { name: "Louvre Museum", lat: 48.8606, lng: 2.3376, tags: ["art","history"], icon: "🎨", desc: "World's largest art museum housing the Mona Lisa, Venus de Milo, and 380,000+ works spanning 9,000 years.", tip: "Enter via the Carrousel du Louvre entrance to skip the pyramid line. Closed Tuesdays." },
      { name: "Notre-Dame Cathedral", lat: 48.8530, lng: 2.3499, tags: ["history","spiritual","art"], icon: "⛪", desc: "Gothic masterpiece on Île de la Cité, undergoing restoration after the 2019 fire. An architectural marvel.", tip: "The square in front offers great views even during restoration." },
      { name: "Montmartre & Sacré-Cœur", lat: 48.8867, lng: 2.3431, tags: ["art","history","spiritual","foodie"], icon: "⛪", desc: "Bohemian hilltop village with the white-domed basilica, Place du Tertre artists, and stunning city views.", tip: "Walk up the back streets to avoid the tourist crowds. Visit at sunset." },
      { name: "Musée d'Orsay", lat: 48.8600, lng: 2.3266, tags: ["art"], icon: "🎨", desc: "Impressionist paradise in a former railway station — Monet, Van Gogh, Renoir, Degas all under one roof.", tip: "Visit Thursday evenings when it's open late and less crowded." },
      { name: "Champs-Élysées & Arc de Triomphe", lat: 48.8738, lng: 2.2950, tags: ["shopping","history"], icon: "🏛️", desc: "The world's most famous avenue leading to Napoleon's triumphal arch. Climb the 284 steps for 360° views.", tip: "Shop at the side streets — the main avenue is overpriced. Arc rooftop at sunset is incredible." },
      { name: "Le Marais", lat: 48.8565, lng: 2.3619, tags: ["foodie","shopping","art","nightlife"], icon: "🏘️", desc: "Trendy medieval quarter with Jewish bakeries, vintage shops, art galleries, and the best falafel in Paris.", tip: "Try L'As du Fallafel on Rue des Rosiers. Explore on Sunday when shops are open." },
      { name: "Luxembourg Gardens", lat: 48.8462, lng: 2.3372, tags: ["nature"], icon: "🌿", desc: "Paris's most beloved park — 23 hectares of manicured gardens, fountains, and the Medici Fountain.", tip: "Grab a crêpe from a nearby stand and sit by the central fountain." },
      { name: "Sainte-Chapelle", lat: 48.8554, lng: 2.3451, tags: ["history","art","spiritual"], icon: "⛪", desc: "Gothic chapel with the most stunning stained glass windows in the world — 1,113 panels telling Bible stories.", tip: "Go on a sunny day when light floods through the glass. Buy a combo ticket with Conciergerie." },
      { name: "Rue Cler Market Street", lat: 48.8570, lng: 2.3005, tags: ["foodie","shopping"], icon: "🧀", desc: "Charming pedestrian street near the Eiffel Tower with cheese shops, patisseries, wine stores, and flower stalls.", tip: "Visit Saturday morning for the full market experience. Try macarons at a local patisserie." },
      { name: "Seine River Cruise", lat: 48.8611, lng: 2.3069, tags: ["nature","history"], icon: "🚢", desc: "Glide past all major landmarks from the water — the most romantic way to see Paris, especially at night.", tip: "Bateaux Mouches depart from Pont de l'Alma. Evening cruise with dinner is worth it." },
      { name: "Père Lachaise Cemetery", lat: 48.8614, lng: 2.3933, tags: ["history","art"], icon: "🪦", desc: "The world's most visited cemetery — resting place of Jim Morrison, Oscar Wilde, Chopin, and Édith Piaf.", tip: "Get a map at the entrance. Jim Morrison's grave has a guard. Free entry." },
    ]
  },

  tokyo: {
    center: { lat: 35.6762, lng: 139.6503 },
    places: [
      { name: "Senso-ji Temple", lat: 35.7148, lng: 139.7967, tags: ["spiritual","history","shopping"], icon: "⛩️", desc: "Tokyo's oldest and most significant Buddhist temple in Asakusa, with the iconic Kaminarimon (Thunder Gate).", tip: "Visit at 6 AM for sunrise with no crowds. Nakamise-dori shops open at 10." },
      { name: "Shibuya Crossing", lat: 35.6595, lng: 139.7004, tags: ["nightlife","shopping"], icon: "🚶", desc: "The world's busiest pedestrian crossing — up to 3,000 people cross at once. The heartbeat of Tokyo.", tip: "Watch from Starbucks above or the Shibuya Sky observation deck for the best view." },
      { name: "Tsukiji Outer Market", lat: 35.6654, lng: 139.7707, tags: ["foodie"], icon: "🍣", desc: "The legendary market area still serving the freshest sushi, tamagoyaki, and street food in Tokyo.", tip: "Go by 7 AM. Try the tamagoyaki (egg omelet) and fresh tuna sashimi stands." },
      { name: "Meiji Shrine", lat: 35.6764, lng: 139.6993, tags: ["spiritual","nature"], icon: "⛩️", desc: "Serene Shinto shrine in a 170-acre forest in the middle of Tokyo, dedicated to Emperor Meiji.", tip: "Walk the forest path from Harajuku station. Weekend mornings may have traditional weddings." },
      { name: "Akihabara Electric Town", lat: 35.7023, lng: 139.7745, tags: ["shopping","art"], icon: "🎮", desc: "Neon-lit district of anime, manga, video games, and electronics. Maid cafes and retro gaming arcades everywhere.", tip: "Visit Super Potato for retro games. Don't miss the multi-floor arcades." },
      { name: "Shinjuku Golden Gai", lat: 35.6938, lng: 139.7036, tags: ["nightlife","foodie"], icon: "🍶", desc: "Six narrow alleys packed with 200+ tiny bars, each seating 6-10 people. Tokyo's most atmospheric drinking spot.", tip: "Most bars charge a ¥500-1000 cover. Look for English-friendly signs on doors." },
      { name: "teamLab Borderless", lat: 35.6269, lng: 139.7424, tags: ["art"], icon: "🎨", desc: "Mind-bending digital art museum where rooms of immersive projections react to your movement.", tip: "Book tickets online weeks ahead — always sells out. Wear white to reflect the art on yourself." },
      { name: "Harajuku & Takeshita Street", lat: 35.6702, lng: 139.7026, tags: ["shopping","foodie","art"], icon: "🛍️", desc: "Tokyo's youth fashion capital — rainbow cotton candy, crepe stands, and wild street fashion.", tip: "Visit on Sunday when cosplayers gather. Try a giant Harajuku crepe." },
      { name: "Tokyo Skytree", lat: 35.7101, lng: 139.8107, tags: ["adventure"], icon: "🗼", desc: "Japan's tallest structure at 634m with observation decks offering views to Mt. Fuji on clear days.", tip: "Go on a clear day around 2 PM. Book Fast Skytree Ticket to skip lines." },
      { name: "Ramen Street (Tokyo Station)", lat: 35.6812, lng: 139.7671, tags: ["foodie"], icon: "🍜", desc: "Underground dining alley in Tokyo Station featuring 8 top ramen shops from across Japan.", tip: "Try Rokurinsha for tsukemen (dipping noodles). Expect a 20-min wait at most shops." },
      { name: "Odaiba", lat: 35.6269, lng: 139.7753, tags: ["adventure","shopping","art"], icon: "🏝️", desc: "Futuristic entertainment island with a mini Statue of Liberty, giant Gundam, teamLab, and Rainbow Bridge views.", tip: "Take the Yurikamome monorail for scenic views. The onsen theme park is fun." },
      { name: "Ueno Park & Museums", lat: 35.7146, lng: 139.7744, tags: ["nature","art","history"], icon: "🌸", desc: "Vast park with Tokyo National Museum, zoo, and 1000+ cherry trees. Japan's best museum district.", tip: "Free entry to the park. Cherry blossom season (late March) is magical." },
    ]
  },

  london: {
    center: { lat: 51.5074, lng: -0.1278 },
    places: [
      { name: "Tower of London", lat: 51.5081, lng: -0.0759, tags: ["history"], icon: "🏰", desc: "1000-year-old castle housing the Crown Jewels, with Beefeater tours and tales of royal executions.", tip: "Book online and go at opening (9 AM) — head straight to Crown Jewels to avoid the queue." },
      { name: "British Museum", lat: 51.5194, lng: -0.1270, tags: ["history","art"], icon: "🏛️", desc: "Home to 8 million artifacts including the Rosetta Stone and Parthenon Marbles. Free entry.", tip: "Focus on 2-3 galleries per visit. The Egyptian rooms are the highlight." },
      { name: "Borough Market", lat: 51.5055, lng: -0.0910, tags: ["foodie","shopping"], icon: "🧀", desc: "London's oldest and most famous food market since 1756 — artisan cheese, fresh oysters, and street food.", tip: "Go Thursday-Saturday. Try Bread Ahead doughnuts and Kappacasein raclette." },
      { name: "Buckingham Palace", lat: 51.5014, lng: -0.1419, tags: ["history"], icon: "👑", desc: "The King's official residence. Watch the Changing of the Guard ceremony on the forecourt.", tip: "Changing of the Guard at 11 AM (Mon/Wed/Fri/Sun). Arrive by 10:15 for a good spot." },
      { name: "Westminster Abbey", lat: 51.4993, lng: -0.1273, tags: ["history","spiritual","art"], icon: "⛪", desc: "Gothic abbey where monarchs have been crowned since 1066. Burial site of Newton, Darwin, and Dickens.", tip: "Book online for timed entry. Don't miss the Poet's Corner." },
      { name: "Camden Market", lat: 51.5414, lng: -0.1446, tags: ["shopping","foodie","nightlife","art"], icon: "🛍️", desc: "Eclectic market with street food from 30+ cuisines, vintage fashion, and live music venues.", tip: "Visit on weekdays for fewer crowds. The stables area has the coolest shops." },
      { name: "Tate Modern", lat: 51.5076, lng: -0.0994, tags: ["art"], icon: "🎨", desc: "World-class modern art museum in a former power station on the Thames. Free permanent collection.", tip: "The viewing gallery on level 10 has free panoramic views of London." },
      { name: "Hyde Park", lat: 51.5073, lng: -0.1657, tags: ["nature"], icon: "🌿", desc: "350 acres of green space in central London with Serpentine Lake, Speaker's Corner, and Diana Memorial.", tip: "Rent a deck chair in summer. The Serpentine Gallery has free exhibitions." },
      { name: "The Shard", lat: 51.5045, lng: -0.0865, tags: ["adventure"], icon: "🏙️", desc: "Western Europe's tallest building at 310m with observation deck on floors 68-72.", tip: "Book sunset tickets. Or skip the fee — go to the Aqua Shard bar for free views with a drink." },
      { name: "Covent Garden", lat: 51.5117, lng: -0.1228, tags: ["shopping","art","foodie"], icon: "🎭", desc: "Lively piazza with street performers, the Royal Opera House, boutique shops, and great restaurants.", tip: "Free street performances all day. Try Dishoom for incredible Indian food nearby." },
      { name: "Sky Garden", lat: 51.5113, lng: -0.0836, tags: ["nature","foodie"], icon: "🌿", desc: "London's highest public garden at 155m with lush tropical plants and 360° city views. Free entry.", tip: "Must book free tickets online up to 3 weeks ahead. They go fast." },
      { name: "Brick Lane", lat: 51.5220, lng: -0.0718, tags: ["foodie","art","shopping","nightlife"], icon: "🍛", desc: "Vibrant East London street known for curry houses, street art, vintage markets, and bagel shops.", tip: "Try a salt beef bagel from Beigel Bake (24/7). Sunday Upmarket is the best." },
    ]
  },

  dubai: {
    center: { lat: 25.2048, lng: 55.2708 },
    places: [
      { name: "Burj Khalifa", lat: 25.1972, lng: 55.2744, tags: ["adventure","art"], icon: "🏙️", desc: "World's tallest building at 828m — the At The Top observation deck on floor 124 offers unreal views.", tip: "Book 'At The Top SKY' (level 148) for sunset. Much less crowded than level 124." },
      { name: "Dubai Mall", lat: 25.1985, lng: 55.2796, tags: ["shopping","foodie"], icon: "🛍️", desc: "World's largest mall with 1,200+ stores, an aquarium, ice rink, and the spectacular Dubai Fountain outside.", tip: "Watch the Dubai Fountain show every 30min from 6 PM. Free. Best from the waterfront." },
      { name: "Gold Souk", lat: 25.2867, lng: 55.2965, tags: ["shopping"], icon: "💎", desc: "Dazzling traditional market in Deira with 300+ jewelry shops selling gold at competitive prices.", tip: "Check the daily gold rate before buying. Bargaining is expected — ask for 20-30% off." },
      { name: "Palm Jumeirah", lat: 25.1124, lng: 55.1390, tags: ["beach","adventure"], icon: "🏝️", desc: "Iconic man-made palm-shaped island with luxury resorts, Aquaventure waterpark, and stunning beaches.", tip: "Take the monorail for aerial views. The free public beach at the tip has great skyline views." },
      { name: "Dubai Creek & Abra Ride", lat: 25.2620, lng: 55.2968, tags: ["history","adventure"], icon: "🚤", desc: "Traditional wooden abra boats crossing the creek between Deira and Bur Dubai — the original Dubai.", tip: "Only 1 AED per crossing. Best at sunset. Combine with Spice Souk visit." },
      { name: "Al Fahidi Historical Neighbourhood", lat: 25.2634, lng: 55.2988, tags: ["history","art"], icon: "🏘️", desc: "Restored heritage quarter with wind-tower houses, art galleries, and the Dubai Museum in Al Fahidi Fort.", tip: "Free to walk around. Visit the coffee museum and XVA Gallery." },
      { name: "Spice Souk", lat: 25.2677, lng: 55.2990, tags: ["shopping","foodie"], icon: "🌶️", desc: "Aromatic traditional market selling saffron, frankincense, dried fruits, and spices from around the world.", tip: "Prices are negotiable. Iranian saffron here is much cheaper than elsewhere." },
      { name: "Jumeirah Beach", lat: 25.2090, lng: 55.2380, tags: ["beach"], icon: "🏖️", desc: "Public beach with perfect views of Burj Al Arab, white sand, and JBR's restaurant-lined walk.", tip: "Go to JBR Beach for the best facilities. Free public access." },
      { name: "Dubai Frame", lat: 25.2350, lng: 55.3004, tags: ["adventure","history"], icon: "🖼️", desc: "150m-tall golden picture frame structure with glass floor walkway and views of old and new Dubai.", tip: "Book afternoon tickets for sunset views from the Sky Deck." },
      { name: "Desert Safari", lat: 25.0583, lng: 55.4083, tags: ["adventure","nature","foodie"], icon: "🐪", desc: "Dune bashing in 4x4s, camel riding, sandboarding, and BBQ dinner under the stars with belly dancing.", tip: "Book an evening safari with BBQ dinner. Morning safaris are less touristy." },
      { name: "Atlantis Aquaventure", lat: 25.1308, lng: 55.1170, tags: ["adventure","beach"], icon: "🎢", desc: "Massive waterpark at Atlantis The Palm with world-record slides and the Lost Chambers Aquarium.", tip: "Go on a weekday. The Leap of Faith slide drops you through a shark-filled lagoon." },
    ]
  },

  bangkok: {
    center: { lat: 13.7563, lng: 100.5018 },
    places: [
      { name: "Grand Palace", lat: 13.7500, lng: 100.4914, tags: ["history","art","spiritual"], icon: "👑", desc: "Dazzling royal complex housing Wat Phra Kaew (Temple of the Emerald Buddha) — Thailand's holiest site.", tip: "Dress code enforced — cover knees and shoulders. Go at 8:30 AM opening." },
      { name: "Wat Arun", lat: 13.7437, lng: 100.4888, tags: ["spiritual","history","art"], icon: "🛕", desc: "Temple of Dawn with its stunning Khmer-style spire decorated with porcelain and seashells on the Chao Phraya River.", tip: "Best viewed from across the river at sunset. Take a 4 THB ferry from Wat Pho pier." },
      { name: "Chatuchak Weekend Market", lat: 13.7999, lng: 100.5506, tags: ["shopping","foodie"], icon: "🛍️", desc: "The world's largest outdoor market with 15,000+ stalls across 35 acres. You can find literally anything here.", tip: "Go at 9 AM Saturday. Sections 2-4 for vintage clothing, 7-9 for art and decor." },
      { name: "Wat Pho", lat: 13.7465, lng: 100.4930, tags: ["spiritual","history","art"], icon: "🛕", desc: "Home to the famous 46m Reclining Buddha and Thailand's leading massage school since 1955.", tip: "Get a traditional Thai massage inside the temple grounds — 260 THB for 30 min." },
      { name: "Khao San Road", lat: 13.7589, lng: 100.4977, tags: ["nightlife","foodie","shopping"], icon: "🎉", desc: "The legendary backpacker street — pad thai carts, bucket cocktails, scorpion skewers, and neon madness.", tip: "Come after 9 PM for the real party. Try the pad thai from the famous cart at the start." },
      { name: "Yaowarat (Chinatown)", lat: 13.7407, lng: 100.5103, tags: ["foodie","history","shopping"], icon: "🥡", desc: "The best street food in Bangkok — oyster omelets, roasted duck, mango sticky rice on a neon-lit street.", tip: "Go at dusk when the street food stalls set up. T&K Seafood for crab omelets." },
      { name: "Jim Thompson House", lat: 13.7487, lng: 100.5277, tags: ["art","history"], icon: "🏠", desc: "Beautiful teak house museum of the American silk king who revived the Thai silk industry and mysteriously vanished.", tip: "Guided tours only, every 20 minutes. The silk shop has authentic Thai silk." },
      { name: "Asiatique The Riverfront", lat: 13.6960, lng: 100.5006, tags: ["shopping","nightlife","foodie"], icon: "🎡", desc: "Open-air night market in converted warehouses with a Ferris wheel, 1,500+ shops, and river views.", tip: "Take the free shuttle boat from Saphan Taksin BTS. The Muay Thai show is excellent." },
      { name: "Lumpini Park", lat: 13.7316, lng: 100.5417, tags: ["nature"], icon: "🌿", desc: "Bangkok's Central Park — 142 acres of lakes, paths, and giant monitor lizards roaming freely.", tip: "Early morning tai chi sessions are open to all. The lake pedal boats are fun." },
      { name: "Erawan Shrine", lat: 13.7440, lng: 100.5403, tags: ["spiritual"], icon: "🛕", desc: "Hindu shrine at a busy intersection where locals pray and commission traditional Thai dance performances.", tip: "Free to visit. Watch the traditional dance performances commissioned by devotees." },
      { name: "Talad Rot Fai (Train Night Market)", lat: 13.7590, lng: 100.5590, tags: ["nightlife","foodie","shopping"], icon: "🌙", desc: "Hipster night market in old train yard with vintage collectibles, craft cocktails, and live music bars.", tip: "Ratchada location is most accessible. Open Thu-Sun from 5 PM." },
    ]
  },

  newyork: {
    center: { lat: 40.7128, lng: -74.0060 },
    places: [
      { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445, tags: ["history"], icon: "🗽", desc: "The 93m copper icon gifted by France. Crown access offers breathtaking harbor views.", tip: "Book crown tickets 3 months ahead. Take the first ferry at 8:30 AM." },
      { name: "Central Park", lat: 40.7829, lng: -73.9654, tags: ["nature"], icon: "🌿", desc: "843 acres of green oasis — Bethesda Fountain, Bow Bridge, the Reservoir, and free Shakespeare in summer.", tip: "Rent a bike to cover more ground. Belvedere Castle has the best elevated views." },
      { name: "Times Square", lat: 40.7580, lng: -73.9855, tags: ["nightlife","shopping"], icon: "✨", desc: "The 'Crossroads of the World' — blinding neon, Broadway theaters, and 330,000+ visitors daily.", tip: "Visit at night for the full neon experience. Get half-price Broadway tickets at TKTS booth." },
      { name: "Metropolitan Museum of Art", lat: 40.7794, lng: -73.9632, tags: ["art","history"], icon: "🎨", desc: "One of the world's greatest museums with 2 million+ works spanning 5,000 years across 3 city blocks.", tip: "Suggested admission (pay what you wish for NYC residents). The rooftop garden has skyline views." },
      { name: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969, tags: ["history","adventure","nature"], icon: "🌉", desc: "Iconic 1883 suspension bridge — walk across for stunning Manhattan skyline views and Brooklyn pizza.", tip: "Walk from Brooklyn to Manhattan for the best views. Go at sunrise to avoid crowds." },
      { name: "Chelsea Market", lat: 40.7424, lng: -74.0061, tags: ["foodie","shopping"], icon: "🦞", desc: "Indoor food hall in a former Nabisco factory with lobster rolls, artisan shops, and the High Line entrance.", tip: "Try Los Tacos No. 1 and Lobster Place. Walk the High Line after." },
      { name: "The High Line", lat: 40.7480, lng: -74.0048, tags: ["nature","art"], icon: "🌸", desc: "Elevated linear park built on former railway tracks with gardens, art installations, and city views.", tip: "Enter at 14th Street. Walk north for the best views and the Whitney Museum." },
      { name: "Empire State Building", lat: 40.7484, lng: -73.9857, tags: ["history","adventure"], icon: "🏙️", desc: "Art Deco masterpiece with 86th floor observatory offering 360° views up to 80 miles on clear days.", tip: "Visit at 11 PM — no crowds and NYC is magical at night. Buy Express Pass to skip lines." },
      { name: "Grand Central Terminal", lat: 40.7527, lng: -73.9772, tags: ["history","art","foodie"], icon: "🚂", desc: "Beaux-Arts masterpiece with the celestial ceiling, Whispering Gallery, and a world-class food court.", tip: "Stand diagonally across the Whispering Gallery arches. The Oyster Bar is legendary." },
      { name: "SoHo", lat: 40.7233, lng: -74.0030, tags: ["shopping","art"], icon: "🛍️", desc: "Cast-iron architecture district with designer boutiques, street art, and some of NYC's best galleries.", tip: "Visit on a weekday for a calmer experience. Side streets have better unique shops." },
      { name: "Smorgasburg", lat: 40.7215, lng: -73.9612, tags: ["foodie"], icon: "🍔", desc: "Brooklyn's legendary open-air food market with 100+ vendors every Saturday at Williamsburg.", tip: "Go hungry. The ramen burger, doughnut ice cream sandwich, and Thai iced tea are iconic." },
    ]
  },

  bali: {
    center: { lat: -8.3405, lng: 115.0920 },
    places: [
      { name: "Tanah Lot Temple", lat: -8.6213, lng: 115.0868, tags: ["spiritual","nature","history"], icon: "⛩️", desc: "Iconic sea temple perched on a rock formation, one of Bali's most important Hindu shrines.", tip: "Visit 1 hour before sunset. Get there early to walk the rock pools at low tide." },
      { name: "Tegallalang Rice Terraces", lat: -8.4312, lng: 115.2790, tags: ["nature","adventure"], icon: "🌾", desc: "Stunning cascading rice paddies using the traditional Balinese subak irrigation system.", tip: "Go at 8 AM to avoid crowds. The swing over the terraces makes amazing photos." },
      { name: "Uluwatu Temple", lat: -8.8292, lng: 115.0849, tags: ["spiritual","nature","history"], icon: "⛩️", desc: "Clifftop temple 70m above the Indian Ocean with nightly Kecak fire dance performances at sunset.", tip: "Book Kecak dance tickets early. Watch your belongings — the monkeys are notorious thieves." },
      { name: "Ubud Monkey Forest", lat: -8.5187, lng: 115.2588, tags: ["nature","spiritual"], icon: "🐒", desc: "Sacred sanctuary with 700+ Balinese long-tailed macaques in a lush forest with ancient temples.", tip: "Hide food and shiny objects. Don't smile at the monkeys — they see teeth as aggression." },
      { name: "Seminyak Beach", lat: -8.6914, lng: 115.1561, tags: ["beach","nightlife","foodie"], icon: "🏖️", desc: "Bali's most fashionable beach with upscale beach clubs, cocktail bars, and legendary sunsets.", tip: "Ku De Ta and Potato Head Beach Club for the best sunset cocktails. Book ahead." },
      { name: "Tirta Empul Temple", lat: -8.4152, lng: 115.3156, tags: ["spiritual"], icon: "🛕", desc: "Sacred water temple where Balinese Hindus come for purification rituals in the holy spring pools.", tip: "You can participate in the purification. Wear a sarong (provided). Go early morning." },
      { name: "Mount Batur Sunrise Trek", lat: -8.2422, lng: 115.3753, tags: ["adventure","nature"], icon: "🌋", desc: "Pre-dawn hike to the summit of an active volcano for a spectacular sunrise above the clouds.", tip: "Start at 2 AM from the base. Hire a local guide (mandatory). Bring warm layers." },
      { name: "Ubud Art Market", lat: -8.5071, lng: 115.2626, tags: ["shopping","art"], icon: "🛍️", desc: "Daily market in the heart of Ubud selling handmade crafts, silk scarves, paintings, and wood carvings.", tip: "Come before 9 AM for 'morning price' (cheaper). Bargain to 30-40% of asking price." },
      { name: "Nusa Penida (Kelingking Beach)", lat: -8.7520, lng: 115.4460, tags: ["beach","adventure","nature"], icon: "🏝️", desc: "Instagram-famous T-Rex cliff viewpoint with turquoise waters. Dramatic landscapes on this wild island.", tip: "Book a fast boat from Sanur. The cliff descent is steep — wear hiking shoes." },
      { name: "Warung Babi Guling Ibu Oka", lat: -8.5060, lng: 115.2609, tags: ["foodie"], icon: "🍖", desc: "Anthony Bourdain's favorite — legendary suckling pig restaurant in Ubud. Crispy, spicy, unforgettable.", tip: "Go before 12 PM or they sell out. The Special plate has all the best parts." },
      { name: "Pura Besakih (Mother Temple)", lat: -8.3743, lng: 115.4527, tags: ["spiritual","history"], icon: "🛕", desc: "Bali's largest and holiest temple complex on the slopes of Mount Agung with 23 separate temples.", tip: "Hire an official guide at the entrance. Avoid unauthorized guides. Dress respectfully." },
    ]
  },

  rome: {
    center: { lat: 41.9028, lng: 12.4964 },
    places: [
      { name: "Colosseum", lat: 41.8902, lng: 12.4922, tags: ["history"], icon: "🏛️", desc: "Iconic 50,000-seat amphitheater where gladiators fought. The underground hypogeum is recently opened to visitors.", tip: "Book the underground & arena floor combo ticket. Go at 8:30 AM opening to avoid crowds." },
      { name: "Vatican Museums & Sistine Chapel", lat: 41.9065, lng: 12.4536, tags: ["art","history","spiritual"], icon: "🎨", desc: "54 galleries leading to Michelangelo's masterpiece ceiling. The Raphael Rooms are equally stunning.", tip: "Book first-entry tickets (7:30 AM) or Friday night openings. Walk backwards through the route to avoid crowds." },
      { name: "Pantheon", lat: 41.8986, lng: 12.4769, tags: ["history","art","spiritual"], icon: "🏛️", desc: "Best-preserved Roman building with the world's largest unreinforced concrete dome and its famous oculus.", tip: "Free entry but timed tickets required. Visit when it rains — water comes through the oculus." },
      { name: "Trastevere", lat: 41.8894, lng: 12.4694, tags: ["foodie","nightlife","art"], icon: "🍝", desc: "Rome's most charming neighborhood with cobblestone lanes, ivy-covered buildings, and the best trattorias.", tip: "Eat at Da Enzo al 29 (arrive at 7 PM opening). Explore the backstreets at night." },
      { name: "Trevi Fountain", lat: 41.9009, lng: 12.4833, tags: ["history","art"], icon: "⛲", desc: "Baroque masterpiece where tossing a coin guarantees your return to Rome. Stunning day and night.", tip: "Visit at 7 AM for photos without crowds. At night it's beautifully illuminated." },
      { name: "Roman Forum", lat: 41.8925, lng: 12.4853, tags: ["history"], icon: "🏛️", desc: "The political, religious, and commercial center of ancient Rome — Senate House, temples, and triumphal arches.", tip: "Included with Colosseum ticket. Enter from Via dei Fori Imperiali for the best overview." },
      { name: "St. Peter's Basilica", lat: 41.9022, lng: 12.4539, tags: ["spiritual","art","history"], icon: "⛪", desc: "The world's largest church with Michelangelo's Pietà, Bernini's baldachin, and the dome climb (551 steps).", tip: "Free entry. Climb the dome for the best view in Rome. Dress code: knees and shoulders covered." },
      { name: "Testaccio Market", lat: 41.8767, lng: 12.4741, tags: ["foodie"], icon: "🍝", desc: "Rome's best food market where locals shop. Supplì, porchetta sandwiches, and fresh pasta.", tip: "Try supplì (fried rice balls) at any stall. The trapizzino stand is legendary." },
      { name: "Piazza Navona", lat: 41.8992, lng: 12.4731, tags: ["art","history"], icon: "🎨", desc: "Magnificent Baroque square with Bernini's Fountain of the Four Rivers, street artists, and gelato shops.", tip: "Beautiful at night when the fountains are lit. Don't eat at the piazza restaurants — overpriced." },
      { name: "Villa Borghese Gardens", lat: 41.9137, lng: 12.4853, tags: ["nature","art"], icon: "🌿", desc: "Rome's Central Park with the Borghese Gallery (Bernini, Caravaggio), a lake, and panoramic views from Pincio.", tip: "Book Borghese Gallery 2 weeks ahead (timed entry). The Pincio terrace has the best sunset view." },
      { name: "Spanish Steps", lat: 41.9060, lng: 12.4828, tags: ["history","shopping"], icon: "🪜", desc: "135 travertine steps connecting Piazza di Spagna to Trinità dei Monti church. Rome's most famous staircase.", tip: "Sit on the steps for people-watching (eating on them is banned). Via Condotti below for luxury shopping." },
    ]
  },

  singapore: {
    center: { lat: 1.3521, lng: 103.8198 },
    places: [
      { name: "Marina Bay Sands SkyPark", lat: 1.2834, lng: 103.8607, tags: ["adventure","nightlife"], icon: "🏙️", desc: "Iconic hotel's rooftop observation deck with infinity pool and jaw-dropping views of the Singapore skyline.", tip: "SkyPark costs S$26. For free views, go to CÉ LA VI bar (no cover if you buy a drink)." },
      { name: "Gardens by the Bay", lat: 1.2816, lng: 103.8636, tags: ["nature","art"], icon: "🌺", desc: "Futuristic 101-hectare gardens with Supertrees, Cloud Forest dome, and the spectacular Garden Rhapsody light show.", tip: "Free for outdoor gardens. The evening Supertree light show at 7:45 PM & 8:45 PM is free." },
      { name: "Hawker Chan (Chinatown)", lat: 1.2811, lng: 103.8451, tags: ["foodie"], icon: "🍗", desc: "The world's cheapest Michelin-starred meal — soy sauce chicken rice for under S$4.", tip: "Expect a 30-min queue. The soya sauce chicken rice is the must-order." },
      { name: "Sentosa Island", lat: 1.2494, lng: 103.8303, tags: ["beach","adventure"], icon: "🏝️", desc: "Resort island with Universal Studios, S.E.A. Aquarium, beaches, and the Skyline Luge.", tip: "Take the free Sentosa Express monorail. Universal Studios is worth a full day." },
      { name: "Little India", lat: 1.3066, lng: 103.8518, tags: ["foodie","shopping","spiritual"], icon: "🛕", desc: "Vibrant district with temples, garland shops, curry houses, and Tekka Centre hawker center.", tip: "Visit Sri Veeramakaliamman Temple. Tekka Centre has the best fish head curry in Singapore." },
      { name: "Clarke Quay", lat: 1.2906, lng: 103.8465, tags: ["nightlife","foodie"], icon: "🎉", desc: "Colorful riverside quay lined with restaurants, bars, and nightclubs. Singapore's nightlife epicenter.", tip: "Drinks are expensive. Go for the 5-7 PM happy hours. The riverside walk is free." },
      { name: "Maxwell Food Centre", lat: 1.2804, lng: 103.8450, tags: ["foodie"], icon: "🍜", desc: "Heritage hawker center famous for Tian Tian chicken rice — considered Singapore's national dish.", tip: "Tian Tian opens at 10 AM. The Hainanese chicken rice and char kway teow are essential." },
      { name: "Chinatown Heritage Centre", lat: 1.2835, lng: 103.8434, tags: ["history","shopping"], icon: "🏮", desc: "Restored shophouses in Chinatown with the heritage museum, temples, and Pagoda Street market.", tip: "Walk through Pagoda, Trengganu, and Sago streets for the full experience." },
      { name: "National Gallery Singapore", lat: 1.2901, lng: 103.8515, tags: ["art","history"], icon: "🎨", desc: "Southeast Asia's largest visual arts institution in two heritage buildings with the world's largest Southeast Asian art collection.", tip: "Free for Singaporeans/PRs. The rooftop Smoke & Mirrors bar has great views." },
      { name: "Merlion Park", lat: 1.2868, lng: 103.8545, tags: ["history"], icon: "🦁", desc: "Singapore's national icon — the mythical Merlion statue spouting water into Marina Bay.", tip: "Best photos from across the bay at the Esplanade bridge. Great at night with the skyline." },
      { name: "Orchard Road", lat: 1.3048, lng: 103.8318, tags: ["shopping"], icon: "🛍️", desc: "Singapore's 2.2km shopping boulevard with luxury malls, department stores, and street-side dining.", tip: "ION Orchard and Paragon for luxury, Far East Plaza for budget shopping." },
    ]
  },

  istanbul: {
    center: { lat: 41.0082, lng: 28.9784 },
    places: [
      { name: "Hagia Sophia", lat: 41.0086, lng: 28.9802, tags: ["history","spiritual","art"], icon: "🕌", desc: "Architectural wonder that's been a church, mosque, museum, and mosque again over 1,500 years.", tip: "Free entry since it's a mosque. Visit early morning or during prayer times for fewer tourists." },
      { name: "Blue Mosque (Sultan Ahmed)", lat: 41.0054, lng: 28.9768, tags: ["spiritual","history","art"], icon: "🕌", desc: "Stunning mosque with 20,000+ handmade blue Iznik tiles and 6 minarets. Still an active place of worship.", tip: "Enter from the south side (tourist entrance). Closed during prayer times. Free entry." },
      { name: "Grand Bazaar", lat: 41.0107, lng: 28.9681, tags: ["shopping"], icon: "🛍️", desc: "One of the world's oldest covered markets with 4,000+ shops across 61 streets selling carpets, jewelry, and spices.", tip: "Bargain to 40-50% of the first price. The deeper inside you go, the better the prices." },
      { name: "Topkapi Palace", lat: 41.0115, lng: 28.9833, tags: ["history","art"], icon: "👑", desc: "Ottoman sultans' opulent residence for 400 years housing the Holy Relics, Harem, and imperial treasures.", tip: "Buy the Harem ticket separately — it's worth it. The terrace restaurant has Golden Horn views." },
      { name: "Spice Bazaar (Egyptian Bazaar)", lat: 41.0166, lng: 28.9709, tags: ["foodie","shopping"], icon: "🌶️", desc: "Fragrant 17th-century market selling Turkish delight, saffron, dried fruits, teas, and spices.", tip: "Buy from shops at the back for better prices. Try pomegranate tea samples." },
      { name: "Bosphorus Cruise", lat: 41.0245, lng: 28.9747, tags: ["nature","history","adventure"], icon: "🚢", desc: "Sail between Europe and Asia past Ottoman palaces, wooden mansions, and the Bosphorus Bridge.", tip: "Take the public ferry from Eminönü (much cheaper than private tours). The short cruise is 90 min." },
      { name: "Basilica Cistern", lat: 41.0084, lng: 28.9779, tags: ["history","art"], icon: "🏛️", desc: "Atmospheric underground water cistern from 532 AD with 336 marble columns and the mysterious Medusa heads.", tip: "Renovated with new lighting. Less crowded in the last hour before closing." },
      { name: "Galata Tower", lat: 41.0256, lng: 28.9744, tags: ["history","adventure"], icon: "🗼", desc: "Medieval stone tower in Beyoğlu with a panoramic observation deck offering 360° views of Istanbul.", tip: "Buy tickets online. Sunset from the top is spectacular. The neighborhood around it is charming." },
      { name: "Istiklal Avenue", lat: 41.0330, lng: 28.9770, tags: ["shopping","nightlife","foodie"], icon: "🛍️", desc: "Bustling pedestrian avenue with the nostalgic tram, shops, restaurants, and side streets full of meyhanes (taverns).", tip: "Take a side street to Nevizade for authentic Turkish meyhane dining with meze and raki." },
      { name: "Kadikoy Market (Asian Side)", lat: 41.0066, lng: 29.0186, tags: ["foodie","shopping"], icon: "🧀", desc: "Local market on the Asian side with the best produce, cheese, olives, and Turkish breakfast spots.", tip: "Take the ferry from Eminönü — it's a beautiful 20-min ride. Try çiğ köfte wraps." },
    ]
  },
};

// Normalize lookup: map common names/aliases to keys
const ALIASES = {
  "new york": "newyork", "new york city": "newyork", "nyc": "newyork", "manhattan": "newyork",
  "new delhi": "delhi", "old delhi": "delhi",
  "bombay": "mumbai",
  "bkk": "bangkok",
  "uae": "dubai",
  "pink city": "jaipur",
  "blue city": "jodhpur", "sun city": "jodhpur",
  "city of love": "paris",
  "eternal city": "rome", "roma": "rome",
  "denpasar": "bali", "ubud": "bali", "kuta": "bali",
  "sg": "singapore",
  "constantinople": "istanbul",
};

function lookupCity(destination) {
  const key = destination.toLowerCase().trim();
  if (PLACES_DB[key]) return key;
  if (ALIASES[key]) return ALIASES[key];
  // Fuzzy: check if destination contains a known city name
  for (const k of Object.keys(PLACES_DB)) {
    if (key.includes(k) || k.includes(key)) return k;
  }
  for (const [alias, city] of Object.entries(ALIASES)) {
    if (key.includes(alias) || alias.includes(key)) return city;
  }
  return null;
}

module.exports = { PLACES_DB, lookupCity };
