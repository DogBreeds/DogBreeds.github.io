const BREEDS = [
  {
    id: "labrador-retriever", name: "Labrador Retriever", size: "large", category: "Labrador Retriever", photo: "Labrador Retriever - Yellow.JPG", petfinder: "labrador-retriever",
    profile: {energy:4, experience:1, exercise:4, grooming:2, shedding:4, apartment:3, children:5, working:4},
    facts: {weight:"55–80 lb", height:"21.5–24.5 in", lifespan:"11–13 years", coat:"Short, dense double coat", purpose:"Retrieving game", exercise:"About 1.5–2 hours/day"},
    stats: {trainability:92, energy:84, exercise:86, stimulation:76, sociability:94, independence:34, shedding:82, grooming:35, barking:42},
    disadvantages:["Heavy seasonal shedding can put a surprising amount of hair around the home.","Young Labradors can be extremely energetic, mouthy and destructive when exercise and training are inconsistent.","They are highly food-motivated and can gain excess weight quickly if portions are not controlled."],
    products:{harness:"large adjustable harness, roughly 28–36 inch chest", shampoo:"short double coat deshedding dog shampoo", grooming:"rubber curry brush and undercoat rake", bed:"large orthopedic dog bed or 42 inch crate"}
  },
  {
    id: "golden-retriever", name: "Golden Retriever", size: "large", category: "Golden Retriever", photo: "Golden-retriever-dog.jpg", petfinder: "golden-retriever",
    profile: {energy:4, experience:1, exercise:4, grooming:3, shedding:5, apartment:3, children:5, working:4},
    facts: {weight:"55–75 lb", height:"21.5–24 in", lifespan:"10–12 years", coat:"Dense, feathered double coat", purpose:"Retrieving game", exercise:"About 1.5–2 hours/day"},
    stats: {trainability:93, energy:80, exercise:84, stimulation:74, sociability:96, independence:28, shedding:90, grooming:62, barking:38},
    disadvantages:["The feathered double coat sheds heavily and needs regular brushing to prevent mats.","Many Goldens stay exuberant well into adulthood and can be difficult without daily exercise and training.","The breed has meaningful inherited health risks, so long-term medical costs can be higher than expected."],
    products:{harness:"large adjustable harness, roughly 27–36 inch chest", shampoo:"golden retriever double coat deshedding shampoo", grooming:"undercoat rake and slicker brush", bed:"large washable orthopedic dog bed or 42 inch crate"}
  },
  {
    id: "german-shepherd-dog", name: "German Shepherd Dog", size: "large", category: "German Shepherd", photo: "20110425 German Shepherd Dog 8505.jpg", petfinder: "german-shepherd-dog",
    profile: {energy:4, experience:2, exercise:4, grooming:3, shedding:5, apartment:2, children:4, working:5},
    facts: {weight:"50–90 lb", height:"22–26 in", lifespan:"9–13 years", coat:"Medium double coat", purpose:"Herding and utility work", exercise:"About 1.5–2+ hours/day"},
    stats: {trainability:96, energy:87, exercise:90, stimulation:91, sociability:62, independence:48, shedding:92, grooming:55, barking:68},
    disadvantages:["They need structured training and substantial mental work, not only walks.","Under-socialized dogs can become overly reactive or suspicious in busy environments.","Heavy shedding is normal year-round and especially intense during seasonal coat changes.","Hip, elbow and other inherited conditions are important considerations in the breed."],
    products:{harness:"large heavy-duty adjustable harness, roughly 27–38 inch chest", shampoo:"german shepherd double coat deshedding shampoo", grooming:"undercoat rake and de-shedding brush", bed:"large orthopedic bed or 42–48 inch crate"}
  },
  {
    id: "great-dane", name: "Great Dane", size: "large", category: "Great Dane", photo: "Great Dane black laying.jpg", petfinder: "great-dane",
    profile: {energy:2, experience:2, exercise:2, grooming:1, shedding:3, apartment:3, children:4, working:2},
    facts: {weight:"110–175 lb", height:"28–32+ in", lifespan:"7–10 years", coat:"Short, smooth coat", purpose:"Historically boar hunting and estate work", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:72, energy:46, exercise:53, stimulation:48, sociability:78, independence:46, shedding:55, grooming:20, barking:42},
    disadvantages:["Everything costs more at giant size: food, medication, beds, crates and transport.","Their short lifespan is emotionally difficult and giant breeds can develop serious orthopedic problems.","Great Danes are at elevated risk of gastric dilatation-volvulus, commonly called bloat.","Even a calm adult can accidentally knock over children or furniture simply because of its size."],
    products:{harness:"XXL giant-breed harness, roughly 34–46 inch chest", shampoo:"gentle short coat dog shampoo", grooming:"rubber grooming mitt", bed:"giant orthopedic dog bed or 54 inch crate"}
  },
  {
    id: "bernese-mountain-dog", name: "Bernese Mountain Dog", size: "large", category: "Bernese Mountain Dog", photo: "Standing Bernese Mountain Dog Female (cropped).jpg", petfinder: "bernese-mountain-dog",
    profile: {energy:3, experience:1, exercise:3, grooming:4, shedding:5, apartment:2, children:5, working:3},
    facts: {weight:"70–115 lb", height:"23–27.5 in", lifespan:"7–10 years", coat:"Long, thick double coat", purpose:"Swiss farm and draft work", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:82, energy:62, exercise:68, stimulation:62, sociability:90, independence:35, shedding:94, grooming:78, barking:46},
    disadvantages:["The dense coat sheds heavily and is uncomfortable in hot climates.","They have a relatively short lifespan and significant inherited cancer and orthopedic risks.","Their size makes food, travel and medical care more expensive than for medium dogs.","Regular brushing is necessary to manage shedding and prevent tangles behind the ears and legs."],
    products:{harness:"XL large-breed harness, roughly 30–40 inch chest", shampoo:"long double coat deshedding dog shampoo", grooming:"long-pin slicker brush and undercoat rake", bed:"XL orthopedic dog bed or 48 inch crate"}
  },
  {
    id: "standard-poodle", name: "Standard Poodle", size: "large", category: "Poodles", photo: "Red Standard Poodle.jpg", petfinder: "poodle-standard",
    profile: {energy:4, experience:1, exercise:4, grooming:5, shedding:1, apartment:4, children:5, working:5},
    facts: {weight:"40–70 lb", height:"Usually 18–24 in", lifespan:"10–18 years", coat:"Dense, curly, continuously growing coat", purpose:"Water retrieving", exercise:"About 1–2 hours/day"},
    stats: {trainability:97, energy:80, exercise:80, stimulation:92, sociability:86, independence:38, shedding:12, grooming:98, barking:55},
    disadvantages:["The coat requires frequent brushing plus regular clipping, often by a professional groomer.","Skipping coat care can produce painful mats close to the skin surprisingly quickly.","Their intelligence means they can become restless or inventive when training and mental stimulation are neglected.","Ear and skin maintenance can require more attention than with many short-coated breeds."],
    products:{harness:"large adjustable harness, roughly 24–34 inch chest", shampoo:"poodle shampoo for curly coats, detangling and moisturizing", grooming:"long-pin slicker brush, metal comb and detangling spray", bed:"large washable dog bed or 42 inch crate"}
  },
  {
    id: "border-collie", name: "Border Collie", size: "medium", category: "Border Collie", photo: "Border Collie panting.jpg", petfinder: "border-collie",
    profile: {energy:5, experience:2, exercise:5, grooming:3, shedding:3, apartment:2, children:3, working:5},
    facts: {weight:"30–55 lb", height:"18–22 in", lifespan:"12–15 years", coat:"Smooth or rough double coat", purpose:"Sheep herding", exercise:"2+ hours/day plus mental work"},
    stats: {trainability:100, energy:98, exercise:100, stimulation:100, sociability:72, independence:42, shedding:62, grooming:52, barking:61},
    disadvantages:["A walk is usually not enough. Border Collies need demanding mental work and purposeful activity every day.","Bored dogs can develop obsessive behaviors such as shadow chasing, spinning or relentless ball fixation.","Herding instinct can appear as chasing and nipping at running children, bicycles or other animals.","They can be unusually sensitive to movement, sound and handler inconsistency."],
    products:{harness:"medium adjustable athletic harness, roughly 22–30 inch chest", shampoo:"border collie double coat gentle deshedding shampoo", grooming:"slicker brush and undercoat rake", bed:"medium-large washable bed or 36 inch crate"}
  },
  {
    id: "australian-shepherd", name: "Australian Shepherd", size: "medium", category: "Australian Shepherd", photo: "Australian Shepherd Blue Merle.jpg", petfinder: "australian-shepherd",
    profile: {energy:5, experience:2, exercise:5, grooming:3, shedding:4, apartment:2, children:4, working:5},
    facts: {weight:"40–65 lb", height:"18–23 in", lifespan:"12–15 years", coat:"Medium double coat", purpose:"Livestock herding", exercise:"About 2+ hours/day"},
    stats: {trainability:95, energy:96, exercise:96, stimulation:96, sociability:76, independence:40, shedding:76, grooming:60, barking:67},
    disadvantages:["They need a substantial daily outlet for both physical energy and problem-solving.","Herding behaviors can include circling, chasing and heel-nipping when not redirected.","The coat sheds significantly and needs regular brushing, especially during seasonal blowouts.","Without careful socialization, some individuals can be reserved or reactive around strangers."],
    products:{harness:"medium-large athletic harness, roughly 23–32 inch chest", shampoo:"australian shepherd double coat deshedding shampoo", grooming:"slicker brush and undercoat rake", bed:"medium-large washable bed or 36–42 inch crate"}
  },
  {
    id: "beagle", name: "Beagle", size: "medium", category: "Beagle", photo: "Bronco the Beagle.JPG", petfinder: "beagle",
    profile: {energy:4, experience:1, exercise:3, grooming:1, shedding:3, apartment:3, children:5, working:3},
    facts: {weight:"20–30 lb", height:"13–15 in", lifespan:"10–15 years", coat:"Short, dense coat", purpose:"Scent hound", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:58, energy:78, exercise:73, stimulation:75, sociability:91, independence:78, shedding:55, grooming:22, barking:88},
    disadvantages:["Scent can overpower recall, so off-leash reliability is often difficult around interesting smells.","Beagles can be very vocal, including baying rather than ordinary barking.","They are food-driven and skilled at finding unsecured food or garbage.","They are social dogs and some struggle with long periods alone."],
    products:{harness:"medium escape-resistant harness, roughly 18–28 inch chest", shampoo:"beagle short coat gentle dog shampoo", grooming:"rubber curry brush", bed:"medium washable dog bed or 30–36 inch crate"}
  },
  {
    id: "english-cocker-spaniel", name: "English Cocker Spaniel", size: "medium", category: "English Cocker Spaniel", photo: "Chandler the English Cocker Spaniel.jpg", petfinder: "cocker-spaniel",
    profile: {energy:4, experience:1, exercise:3, grooming:4, shedding:3, apartment:4, children:5, working:4},
    facts: {weight:"26–34 lb", height:"15–17 in", lifespan:"12–14 years", coat:"Silky medium coat with feathering", purpose:"Flushing and retrieving game", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:88, energy:80, exercise:78, stimulation:76, sociability:92, independence:31, shedding:58, grooming:78, barking:57},
    disadvantages:["Feathering around the ears, legs and belly tangles easily and needs consistent brushing.","Long, dropped ears can trap moisture and require regular checking and cleaning.","Working-bred lines can be much more intense than many people expect from the breed's appearance.","They tend to dislike being isolated for long periods and can become distressed or noisy."],
    products:{harness:"medium adjustable harness, roughly 18–27 inch chest", shampoo:"spaniel silky coat conditioning dog shampoo", grooming:"slicker brush, metal comb and ear-care supplies", bed:"medium washable bed or 30–36 inch crate"}
  },
  {
    id: "shiba-inu", name: "Shiba Inu", size: "medium", category: "Shiba Inu", photo: "Shiba Inu.jpg", petfinder: "shiba-inu",
    profile: {energy:3, experience:2, exercise:3, grooming:2, shedding:5, apartment:4, children:3, working:2},
    facts: {weight:"17–23 lb", height:"13.5–16.5 in", lifespan:"13–16 years", coat:"Dense double coat", purpose:"Small-game hunting", exercise:"About 1+ hour/day"},
    stats: {trainability:52, energy:68, exercise:68, stimulation:66, sociability:48, independence:92, shedding:92, grooming:38, barking:38},
    disadvantages:["They are unusually independent and may decide that your request is optional rather than urgent.","Reliable off-leash recall is difficult for many Shibas because of prey drive and independence.","Seasonal shedding can be extreme despite the otherwise low-maintenance coat.","Many dislike restraint, nail trimming or handling unless carefully conditioned from a young age."],
    products:{harness:"medium escape-resistant harness, roughly 18–26 inch chest", shampoo:"shiba inu double coat deshedding shampoo", grooming:"undercoat rake and grooming mitt", bed:"medium bed or 30 inch crate"}
  },
  {
    id: "siberian-husky", name: "Siberian Husky", size: "medium", category: "Siberian Husky", photo: "Siberian-husky-1291343 1920.jpg", petfinder: "siberian-husky",
    profile: {energy:5, experience:3, exercise:5, grooming:3, shedding:5, apartment:2, children:4, working:5},
    facts: {weight:"35–60 lb", height:"20–23.5 in", lifespan:"12–14 years", coat:"Dense double coat", purpose:"Sled pulling", exercise:"About 2+ hours/day"},
    stats: {trainability:62, energy:100, exercise:100, stimulation:88, sociability:88, independence:80, shedding:98, grooming:62, barking:48},
    disadvantages:["They need very high exercise volume and are poor matches for sedentary households.","Huskies are talented escape artists that can climb, dig or exploit weak fencing.","Prey drive can make life with small animals difficult and off-leash freedom risky.","The double coat sheds enormous amounts during seasonal coat blow and is poorly suited to hot climates."],
    products:{harness:"medium-large secure pulling-style harness, roughly 24–34 inch chest", shampoo:"husky double coat deshedding shampoo", grooming:"undercoat rake and de-shedding tool", bed:"large cooling washable bed or 36–42 inch crate"}
  },
  {
    id: "french-bulldog", name: "French Bulldog", size: "small", category: "French Bulldog", photo: "A French Bulldog.jpg", petfinder: "french-bulldog",
    profile: {energy:2, experience:1, exercise:1, grooming:1, shedding:2, apartment:5, children:4, working:1},
    facts: {weight:"16–28 lb", height:"About 11–13 in", lifespan:"10–12 years", coat:"Short, smooth coat", purpose:"Companion dog", exercise:"Short daily walks; heat-limited"},
    stats: {trainability:66, energy:42, exercise:34, stimulation:48, sociability:84, independence:42, shedding:44, grooming:24, barking:43},
    disadvantages:["Flat-faced anatomy can make breathing and heat regulation difficult, especially during exercise or hot weather.","Skin folds and ears need regular attention to prevent irritation and infection.","Spinal, airway and other health problems can make veterinary costs substantial.","They are not suitable for strenuous endurance exercise, particularly in warm climates."],
    products:{harness:"small broad-chest no-pull harness, roughly 18–26 inch chest", shampoo:"french bulldog sensitive skin and wrinkle-friendly dog shampoo", grooming:"soft grooming mitt and wrinkle wipes", bed:"small-medium cooling bed or 30 inch crate"}
  },
  {
    id: "dachshund", name: "Dachshund", size: "small", category: "Dachshund", photo: "Wire-haired Dachshund R 01.JPG", petfinder: "dachshund",
    profile: {energy:3, experience:1, exercise:2, grooming:2, shedding:2, apartment:4, children:3, working:2},
    facts: {weight:"16–32 lb standard; smaller minis", height:"About 8–9 in standard", lifespan:"12–16 years", coat:"Smooth, longhaired or wirehaired", purpose:"Badger and burrow hunting", exercise:"About 1 hour/day"},
    stats: {trainability:58, energy:64, exercise:58, stimulation:64, sociability:67, independence:73, shedding:42, grooming:42, barking:82},
    disadvantages:["Their long spine and short legs create a serious risk of intervertebral disc disease.","Repeated jumping from furniture and excessive stair use can add unnecessary spinal stress.","They can be stubborn, vocal and surprisingly bold for their size.","Hunting instinct often shows up as digging, chasing and intense interest in small animals."],
    products:{harness:"small Y-front harness that avoids back pressure, roughly 16–24 inch chest", shampoo:"dachshund coat-type appropriate gentle shampoo", grooming:"coat-specific brush for smooth, long or wire coat", bed:"supportive low-entry small dog bed and pet ramp"}
  },
  {
    id: "cavalier-king-charles-spaniel", name: "Cavalier King Charles Spaniel", size: "small", category: "Cavalier King Charles Spaniel", photo: "Olive - A Black and Tan Cavalier King Charles Spaniel.jpg", petfinder: "cavalier-king-charles-spaniel",
    profile: {energy:2, experience:1, exercise:2, grooming:3, shedding:3, apartment:5, children:5, working:1},
    facts: {weight:"13–18 lb", height:"12–13 in", lifespan:"12–15 years", coat:"Silky coat with feathering", purpose:"Companion dog", exercise:"About 45–60 minutes/day"},
    stats: {trainability:81, energy:48, exercise:50, stimulation:52, sociability:97, independence:20, shedding:58, grooming:58, barking:38},
    disadvantages:["The breed has significant inherited heart disease risk, particularly mitral valve disease.","Some Cavaliers develop syringomyelia, a painful neurological condition.","The feathered coat tangles behind the ears and legs without regular brushing.","They are highly people-oriented and may struggle when routinely left alone for long periods."],
    products:{harness:"small soft harness, roughly 15–22 inch chest", shampoo:"cavalier spaniel silky coat conditioning shampoo", grooming:"soft slicker brush and metal comb", bed:"small cushioned washable bed or 24–30 inch crate"}
  },
  {
    id: "miniature-schnauzer", name: "Miniature Schnauzer", size: "small", category: "Miniature Schnauzer", photo: "AKC Miniature Schnauzer Dog Show 2013.jpg", petfinder: "schnauzer-miniature",
    profile: {energy:3, experience:1, exercise:3, grooming:4, shedding:1, apartment:4, children:4, working:3},
    facts: {weight:"11–20 lb", height:"12–14 in", lifespan:"12–15 years", coat:"Wiry double coat", purpose:"Farm ratting and companion work", exercise:"About 1 hour/day"},
    stats: {trainability:84, energy:72, exercise:68, stimulation:76, sociability:76, independence:52, shedding:14, grooming:84, barking:82},
    disadvantages:["The low-shedding coat is not low-maintenance: clipping or hand-stripping is needed regularly.","They are alert and can become persistent barkers if every sound is allowed to become an event.","The beard collects water and food and needs frequent cleaning.","Some individuals are prone to pancreatitis or urinary issues, making diet management important."],
    products:{harness:"small adjustable harness, roughly 15–22 inch chest", shampoo:"miniature schnauzer wiry coat dog shampoo", grooming:"slicker brush, metal comb and clipper supplies", bed:"small-medium washable bed or 24–30 inch crate"}
  },
  {
    id: "pomeranian", name: "Pomeranian", size: "small", category: "Pomeranian", photo: "White Pomeranian.jpg", petfinder: "pomeranian",
    profile: {energy:3, experience:1, exercise:1, grooming:4, shedding:4, apartment:5, children:2, working:1},
    facts: {weight:"3–7 lb", height:"About 6–7 in", lifespan:"12–16 years", coat:"Long, abundant double coat", purpose:"Companion dog", exercise:"About 30–60 minutes/day"},
    stats: {trainability:75, energy:62, exercise:40, stimulation:66, sociability:72, independence:48, shedding:72, grooming:86, barking:90},
    disadvantages:["The coat needs frequent brushing and tangles easily around the friction points behind the ears and legs.","They can be extremely vocal unless quiet behavior is deliberately taught.","Their tiny bones make rough play, high jumps and accidental drops more consequential.","Dental crowding is common in toy breeds, so dental care cannot be ignored."],
    products:{harness:"XXS or XS lightweight harness, roughly 10–16 inch chest", shampoo:"pomeranian double coat conditioning and detangling shampoo", grooming:"small pin brush and fine metal comb", bed:"toy-size soft bed or 18–24 inch crate"}
  },
  {
    id: "pembroke-welsh-corgi", name: "Pembroke Welsh Corgi", size: "small", category: "Pembroke Welsh Corgi", photo: "Welchcorgipembroke.JPG", petfinder: "pembroke-welsh-corgi",
    profile: {energy:4, experience:1, exercise:3, grooming:2, shedding:5, apartment:4, children:4, working:4},
    facts: {weight:"22–30 lb", height:"10–12 in", lifespan:"12–13 years", coat:"Short, dense double coat", purpose:"Cattle herding", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:90, energy:80, exercise:74, stimulation:82, sociability:78, independence:42, shedding:94, grooming:40, barking:78},
    disadvantages:["The double coat sheds heavily despite its tidy appearance.","Herding instinct may appear as heel-nipping, chasing and controlling movement around the home.","Their long-backed shape means excess weight adds undesirable stress to the spine and joints.","They can become very vocal if alert barking is not managed early."],
    products:{harness:"small-medium Y-front harness, roughly 20–28 inch chest", shampoo:"corgi double coat deshedding shampoo", grooming:"undercoat rake and grooming mitt", bed:"supportive low-entry medium bed or 30–36 inch crate"}
  }
];
