const BREEDS = [
  {
    id: "labrador-retriever", name: "Labrador Retriever", size: "large", category: "Labrador Retriever", photo: "Labrador Retriever - Yellow.JPG", petfinder: "labrador-retriever",
    profile: {energy:4, experience:1, exercise:4, grooming:2, shedding:4, apartment:3, children:5, working:4},
    facts: {weight:"55–80 lb (25–36 kg)", height:"21.5–24.5 in (55–62 cm)", lifespan:"11–13 years", coat:"Short, dense double coat", purpose:"Retrieving game", exercise:"About 1.5–2 hours/day"},
    stats: {trainability:92, energy:84, exercise:86, stimulation:76, sociability:94, independence:34, shedding:82, grooming:35, barking:42},
    disadvantages:["Heavy seasonal shedding can put a surprising amount of hair around the home.","Young Labradors can be extremely energetic, mouthy and destructive when exercise and training are inconsistent.","They are highly food-motivated and can gain excess weight quickly if portions are not controlled."],
    products:{harness:"large adjustable harness, roughly 28–36 in (71–91 cm)ch chest", shampoo:"short double coat deshedding dog shampoo", grooming:"rubber curry brush and undercoat rake", bed:"large orthopedic dog bed or 42 in (107 cm)ch crate"}
  },
  {
    id: "golden-retriever", name: "Golden Retriever", size: "large", category: "Golden Retriever", photo: "Golden-retriever-dog.jpg", petfinder: "golden-retriever",
    profile: {energy:4, experience:1, exercise:4, grooming:3, shedding:5, apartment:3, children:5, working:4},
    facts: {weight:"55–75 lb (25–34 kg)", height:"21.5–24 in (55–61 cm)", lifespan:"10–12 years", coat:"Dense, feathered double coat", purpose:"Retrieving game", exercise:"About 1.5–2 hours/day"},
    stats: {trainability:93, energy:80, exercise:84, stimulation:74, sociability:96, independence:28, shedding:90, grooming:62, barking:38},
    disadvantages:["The feathered double coat sheds heavily and needs regular brushing to prevent mats.","Many Goldens stay exuberant well into adulthood and can be difficult without daily exercise and training.","Cancer is a major health concern in Golden Retrievers, including hemangiosarcoma and lymphoma; this is one of the most important long-term risks to understand before choosing the breed."],
    products:{harness:"large adjustable harness, roughly 27–36 in (69–91 cm)ch chest", shampoo:"golden retriever double coat deshedding shampoo", grooming:"undercoat rake and slicker brush", bed:"large washable orthopedic dog bed or 42 in (107 cm)ch crate"}
  },
  {
    id: "german-shepherd-dog", name: "German Shepherd", size: "large", category: "German Shepherd", photo: "German Shepherd Dog standing.jpg", petfinder: "german-shepherd-dog",
    profile: {energy:4, experience:2, exercise:4, grooming:3, shedding:5, apartment:2, children:4, working:5},
    facts: {weight:"50–90 lb (23–41 kg)", height:"22–26 in (56–66 cm)", lifespan:"9–13 years", coat:"Medium double coat", purpose:"Herding and utility work", exercise:"About 1.5–2+ hours/day"},
    stats: {trainability:96, energy:87, exercise:90, stimulation:91, sociability:62, independence:48, shedding:92, grooming:55, barking:68},
    disadvantages:["They need structured training and substantial mental work, not only walks.","Under-socialized dogs can become overly reactive or suspicious in busy environments.","Heavy shedding is normal year-round and especially intense during seasonal coat changes.","Hip, elbow and other inherited conditions are important considerations in the breed."],
    products:{harness:"large heavy-duty adjustable harness, roughly 27–38 in (69–97 cm)ch chest", shampoo:"german shepherd double coat deshedding shampoo", grooming:"undercoat rake and de-shedding brush", bed:"large orthopedic bed or 42–48 in (107–122 cm)ch crate"}
  },
  {
    id: "great-dane", name: "Great Dane", size: "large", category: "Great Dane", photo: "Great Dane black laying.jpg", petfinder: "great-dane",
    profile: {energy:2, experience:2, exercise:2, grooming:1, shedding:3, apartment:3, children:4, working:2},
    facts: {weight:"110–175 lb (50–79 kg)", height:"28–32+ in (71–81+ cm)", lifespan:"7–10 years", coat:"Short, smooth coat", purpose:"Historically boar hunting and estate work", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:72, energy:46, exercise:53, stimulation:48, sociability:78, independence:46, shedding:55, grooming:20, barking:42},
    disadvantages:["Everything costs more at giant size: food, medication, beds, crates and transport.","Their short lifespan is emotionally difficult and giant breeds can develop serious orthopedic problems.","Great Danes are at elevated risk of gastric dilatation-volvulus, commonly called bloat.","Even a calm adult can accidentally knock over children or furniture simply because of its size."],
    products:{harness:"XXL giant-breed harness, roughly 34–46 in (86–117 cm)ch chest", shampoo:"gentle short coat dog shampoo", grooming:"rubber grooming mitt", bed:"giant orthopedic dog bed or 54 in (137 cm)ch crate"}
  },
  {
    id: "bernese-mountain-dog", name: "Bernese Mountain Dog", size: "large", category: "Bernese Mountain Dog", photo: "Standing Bernese Mountain Dog Female (cropped).jpg", petfinder: "bernese-mountain-dog",
    profile: {energy:3, experience:1, exercise:3, grooming:4, shedding:5, apartment:2, children:5, working:3},
    facts: {weight:"70–115 lb (32–52 kg)", height:"23–27.5 in (58–70 cm)", lifespan:"7–10 years", coat:"Long, thick double coat", purpose:"Swiss farm and draft work", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:82, energy:62, exercise:68, stimulation:62, sociability:90, independence:35, shedding:94, grooming:78, barking:46},
    disadvantages:["The dense coat sheds heavily and is uncomfortable in hot climates.","They have a relatively short lifespan and significant inherited cancer and orthopedic risks.","Their size makes food, travel and medical care more expensive than for medium dogs.","Regular brushing is necessary to manage shedding and prevent tangles behind the ears and legs."],
    products:{harness:"XL large-breed harness, roughly 30–40 in (76–102 cm)ch chest", shampoo:"long double coat deshedding dog shampoo", grooming:"long-pin slicker brush and undercoat rake", bed:"XL orthopedic dog bed or 48 in (122 cm)ch crate"}
  },
  {
    id: "standard-poodle", name: "Standard Poodle", size: "large", category: "Poodles", photo: "Red Standard Poodle.jpg", petfinder: "poodle-standard",
    profile: {energy:4, experience:1, exercise:4, grooming:5, shedding:1, apartment:4, children:5, working:5},
    facts: {weight:"40–70 lb (18–32 kg)", height:"Usually 18–24 in (46–61 cm)", lifespan:"10–18 years", coat:"Dense, curly, continuously growing coat", purpose:"Water retrieving", exercise:"About 1–2 hours/day"},
    stats: {trainability:97, energy:80, exercise:80, stimulation:92, sociability:86, independence:38, shedding:12, grooming:98, barking:55},
    disadvantages:["The coat requires frequent brushing plus regular clipping, often by a professional groomer.","Skipping coat care can produce painful mats close to the skin surprisingly quickly.","Their intelligence means they can become restless or inventive when training and mental stimulation are neglected.","Ear and skin maintenance can require more attention than with many short-coated breeds."],
    products:{harness:"large adjustable harness, roughly 24–34 in (61–86 cm)ch chest", shampoo:"poodle shampoo for curly coats, detangling and moisturizing", grooming:"long-pin slicker brush, metal comb and detangling spray", bed:"large washable dog bed or 42 in (107 cm)ch crate"}
  },
  {
    id: "border-collie", name: "Border Collie", size: "medium", category: "Border Collie", photo: "Border Collie panting.jpg", petfinder: "border-collie",
    profile: {energy:5, experience:2, exercise:5, grooming:3, shedding:3, apartment:2, children:3, working:5},
    facts: {weight:"30–55 lb (14–25 kg)", height:"18–22 in (46–56 cm)", lifespan:"12–15 years", coat:"Smooth or rough double coat", purpose:"Sheep herding", exercise:"2+ hours/day plus mental work"},
    stats: {trainability:100, energy:98, exercise:100, stimulation:100, sociability:72, independence:42, shedding:62, grooming:52, barking:61},
    disadvantages:["A walk is usually not enough. Border Collies need demanding mental work and purposeful activity every day.","Bored dogs can develop obsessive behaviors such as shadow chasing, spinning or relentless ball fixation.","Herding instinct can appear as chasing and nipping at running children, bicycles or other animals.","They can be unusually sensitive to movement, sound and handler inconsistency."],
    products:{harness:"medium adjustable athletic harness, roughly 22–30 in (56–76 cm)ch chest", shampoo:"border collie double coat gentle deshedding shampoo", grooming:"slicker brush and undercoat rake", bed:"medium-large washable bed or 36 in (91 cm)ch crate"}
  },
  {
    id: "australian-shepherd", name: "Australian Shepherd", size: "medium", category: "Australian Shepherd", photo: "Australian Shepherd Blue Merle.jpg", petfinder: "australian-shepherd",
    profile: {energy:5, experience:2, exercise:5, grooming:3, shedding:4, apartment:2, children:4, working:5},
    facts: {weight:"40–65 lb (18–29 kg)", height:"18–23 in (46–58 cm)", lifespan:"12–15 years", coat:"Medium double coat", purpose:"Livestock herding", exercise:"About 2+ hours/day"},
    stats: {trainability:95, energy:96, exercise:96, stimulation:96, sociability:76, independence:40, shedding:76, grooming:60, barking:67},
    disadvantages:["They need a substantial daily outlet for both physical energy and problem-solving.","Herding behaviors can include circling, chasing and heel-nipping when not redirected.","The coat sheds significantly and needs regular brushing, especially during seasonal blowouts.","Without careful socialization, some individuals can be reserved or reactive around strangers."],
    products:{harness:"medium-large athletic harness, roughly 23–32 in (58–81 cm)ch chest", shampoo:"australian shepherd double coat deshedding shampoo", grooming:"slicker brush and undercoat rake", bed:"medium-large washable bed or 36–42 in (91–107 cm)ch crate"}
  },
  {
    id: "beagle", name: "Beagle", size: "medium", category: "Beagle", photo: "Bronco the Beagle.JPG", petfinder: "beagle",
    profile: {energy:4, experience:1, exercise:3, grooming:1, shedding:3, apartment:3, children:5, working:3},
    facts: {weight:"20–30 lb (9.1–14 kg)", height:"13–15 in (33–38 cm)", lifespan:"10–15 years", coat:"Short, dense coat", purpose:"Scent hound", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:58, energy:78, exercise:73, stimulation:75, sociability:91, independence:78, shedding:55, grooming:22, barking:88},
    disadvantages:["Scent can overpower recall, so off-leash reliability is often difficult around interesting smells.","Beagles can be very vocal, including baying rather than ordinary barking.","They are food-driven and skilled at finding unsecured food or garbage.","They are social dogs and some struggle with long periods alone."],
    products:{harness:"medium escape-resistant harness, roughly 18–28 in (46–71 cm)ch chest", shampoo:"beagle short coat gentle dog shampoo", grooming:"rubber curry brush", bed:"medium washable dog bed or 30–36 in (76–91 cm)ch crate"}
  },
  {
    id: "english-cocker-spaniel", name: "English Cocker Spaniel", size: "medium", category: "English Cocker Spaniel", photo: "Chandler the English Cocker Spaniel.jpg", petfinder: "cocker-spaniel",
    profile: {energy:4, experience:1, exercise:3, grooming:4, shedding:3, apartment:4, children:5, working:4},
    facts: {weight:"26–34 lb (12–15 kg)", height:"15–17 in (38–43 cm)", lifespan:"12–14 years", coat:"Silky medium coat with feathering", purpose:"Flushing and retrieving game", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:88, energy:80, exercise:78, stimulation:76, sociability:92, independence:31, shedding:58, grooming:78, barking:57},
    disadvantages:["Feathering around the ears, legs and belly tangles easily and needs consistent brushing.","Long, dropped ears can trap moisture and require regular checking and cleaning.","Working-bred lines can be much more intense than many people expect from the breed's appearance.","They tend to dislike being isolated for long periods and can become distressed or noisy."],
    products:{harness:"medium adjustable harness, roughly 18–27 in (46–69 cm)ch chest", shampoo:"spaniel silky coat conditioning dog shampoo", grooming:"slicker brush, metal comb and ear-care supplies", bed:"medium washable bed or 30–36 in (76–91 cm)ch crate"}
  },
  {
    id: "shiba-inu", name: "Shiba Inu", size: "medium", category: "Shiba Inu", photo: "Shiba Inu.jpg", petfinder: "shiba-inu",
    profile: {energy:3, experience:2, exercise:3, grooming:2, shedding:5, apartment:4, children:3, working:2},
    facts: {weight:"17–23 lb (7.7–10 kg)", height:"13.5–16.5 in (34–42 cm)", lifespan:"13–16 years", coat:"Dense double coat", purpose:"Small-game hunting", exercise:"About 1+ hour/day"},
    stats: {trainability:52, energy:68, exercise:68, stimulation:66, sociability:48, independence:92, shedding:92, grooming:38, barking:38},
    disadvantages:["They are unusually independent and may decide that your request is optional rather than urgent.","Reliable off-leash recall is difficult for many Shibas because of prey drive and independence.","Seasonal shedding can be extreme despite the otherwise low-maintenance coat.","Many dislike restraint, nail trimming or handling unless carefully conditioned from a young age."],
    products:{harness:"medium escape-resistant harness, roughly 18–26 in (46–66 cm)ch chest", shampoo:"shiba inu double coat deshedding shampoo", grooming:"undercoat rake and grooming mitt", bed:"medium bed or 30 in (76 cm)ch crate"}
  },
  {
    id: "siberian-husky", name: "Siberian Husky", size: "medium", category: "Siberian Husky", photo: "Siberian-husky-1291343 1920.jpg", petfinder: "siberian-husky",
    profile: {energy:5, experience:3, exercise:5, grooming:3, shedding:5, apartment:2, children:4, working:5},
    facts: {weight:"35–60 lb (16–27 kg)", height:"20–23.5 in (51–60 cm)", lifespan:"12–14 years", coat:"Dense double coat", purpose:"Sled pulling", exercise:"About 2+ hours/day"},
    stats: {trainability:62, energy:100, exercise:100, stimulation:88, sociability:88, independence:80, shedding:98, grooming:62, barking:48},
    disadvantages:["They need very high exercise volume and are poor matches for sedentary households.","Huskies are talented escape artists that can climb, dig or exploit weak fencing.","Prey drive can make life with small animals difficult and off-leash freedom risky.","The double coat sheds enormous amounts during seasonal coat blow and is poorly suited to hot climates."],
    products:{harness:"medium-large secure pulling-style harness, roughly 24–34 in (61–86 cm)ch chest", shampoo:"husky double coat deshedding shampoo", grooming:"undercoat rake and de-shedding tool", bed:"large cooling washable bed or 36–42 in (91–107 cm)ch crate"}
  },
  {
    id: "dachshund", name: "Dachshund", size: "small", category: "Dachshund", photo: "Dachshund smooth.JPG", petfinder: "dachshund",
    profile: {energy:3, experience:1, exercise:2, grooming:2, shedding:2, apartment:4, children:3, working:2},
    facts: {weight:"16–32 lb (7.3–15 kg) standard; smaller minis", height:"About 8–9 in (20–23 cm) standard", lifespan:"12–16 years", coat:"Smooth, longhaired or wirehaired", purpose:"Badger and burrow hunting", exercise:"About 1 hour/day"},
    stats: {trainability:58, energy:64, exercise:58, stimulation:64, sociability:67, independence:73, shedding:42, grooming:42, barking:82},
    disadvantages:["Their long spine and short legs create a serious risk of intervertebral disc disease.","Repeated jumping from furniture and excessive stair use can add unnecessary spinal stress.","They can be stubborn, vocal and surprisingly bold for their size.","Hunting instinct often shows up as digging, chasing and intense interest in small animals."],
    products:{harness:"small Y-front harness that avoids back pressure, roughly 16–24 in (41–61 cm)ch chest", shampoo:"dachshund coat-type appropriate gentle shampoo", grooming:"coat-specific brush for smooth, long or wire coat", bed:"supportive low-entry small dog bed and pet ramp"}
  },
  {
    id: "cavalier-king-charles-spaniel", name: "Cavalier King Charles Spaniel", size: "small", category: "Cavalier King Charles Spaniel", photo: "Olive - A Black and Tan Cavalier King Charles Spaniel.jpg", petfinder: "cavalier-king-charles-spaniel",
    profile: {energy:2, experience:1, exercise:2, grooming:3, shedding:3, apartment:5, children:5, working:1},
    facts: {weight:"13–18 lb (5.9–8.2 kg)", height:"12–13 in (30–33 cm)", lifespan:"12–15 years", coat:"Silky coat with feathering", purpose:"Companion dog", exercise:"About 45–60 minutes/day"},
    stats: {trainability:81, energy:48, exercise:50, stimulation:52, sociability:97, independence:20, shedding:58, grooming:58, barking:38},
    disadvantages:["The breed has significant inherited heart disease risk, particularly mitral valve disease.","Some Cavaliers develop syringomyelia, a painful neurological condition.","The feathered coat tangles behind the ears and legs without regular brushing.","They are highly people-oriented and may struggle when routinely left alone for long periods."],
    products:{harness:"small soft harness, roughly 15–22 in (38–56 cm)ch chest", shampoo:"cavalier spaniel silky coat conditioning shampoo", grooming:"soft slicker brush and metal comb", bed:"small cushioned washable bed or 24–30 in (61–76 cm)ch crate"}
  },
  {
    id: "miniature-schnauzer", name: "Miniature Schnauzer", size: "small", category: "Miniature Schnauzer", photo: "Miniature Schnauzer Body.JPG", petfinder: "schnauzer-miniature",
    profile: {energy:3, experience:1, exercise:3, grooming:4, shedding:1, apartment:4, children:4, working:3},
    facts: {weight:"11–20 lb (5–9.1 kg)", height:"12–14 in (30–36 cm)", lifespan:"12–15 years", coat:"Wiry double coat", purpose:"Farm ratting and companion work", exercise:"About 1 hour/day"},
    stats: {trainability:84, energy:72, exercise:68, stimulation:76, sociability:76, independence:52, shedding:14, grooming:84, barking:82},
    disadvantages:["The low-shedding coat is not low-maintenance: clipping or hand-stripping is needed regularly.","They are alert and can become persistent barkers if every sound is allowed to become an event.","The beard collects water and food and needs frequent cleaning.","Some individuals are prone to pancreatitis or urinary issues, making diet management important."],
    products:{harness:"small adjustable harness, roughly 15–22 in (38–56 cm)ch chest", shampoo:"miniature schnauzer wiry coat dog shampoo", grooming:"slicker brush, metal comb and clipper supplies", bed:"small-medium washable bed or 24–30 in (61–76 cm)ch crate"}
  },
  {
    id: "pomeranian", name: "Pomeranian", size: "small", category: "Pomeranian", photo: "White Pomeranian.jpg", petfinder: "pomeranian",
    profile: {energy:3, experience:1, exercise:1, grooming:4, shedding:4, apartment:5, children:2, working:1},
    facts: {weight:"3–7 lb (1.4–3.2 kg)", height:"About 6–7 in (15–18 cm)", lifespan:"12–16 years", coat:"Long, abundant double coat", purpose:"Companion dog", exercise:"About 30–60 minutes/day"},
    stats: {trainability:75, energy:62, exercise:40, stimulation:66, sociability:72, independence:48, shedding:72, grooming:86, barking:90},
    disadvantages:["The coat needs frequent brushing and tangles easily around the friction points behind the ears and legs.","They can be extremely vocal unless quiet behavior is deliberately taught.","Their tiny bones make rough play, high jumps and accidental drops more consequential.","Dental crowding is common in toy breeds, so dental care cannot be ignored."],
    products:{harness:"XXS or XS lightweight harness, roughly 10–16 in (25–41 cm)ch chest", shampoo:"pomeranian double coat conditioning and detangling shampoo", grooming:"small pin brush and fine metal comb", bed:"toy-size soft bed or 18–24 in (46–61 cm)ch crate"}
  },
  {
    id: "pembroke-welsh-corgi", name: "Pembroke Welsh Corgi", size: "small", category: "Pembroke Welsh Corgi", photo: "Welchcorgipembroke.JPG", petfinder: "pembroke-welsh-corgi",
    profile: {energy:4, experience:1, exercise:3, grooming:2, shedding:5, apartment:4, children:4, working:4},
    facts: {weight:"22–30 lb (10–14 kg)", height:"10–12 in (25–30 cm)", lifespan:"12–13 years", coat:"Short, dense double coat", purpose:"Cattle herding", exercise:"About 1–1.5 hours/day"},
    stats: {trainability:90, energy:80, exercise:74, stimulation:82, sociability:78, independence:42, shedding:94, grooming:40, barking:78},
    disadvantages:["The double coat sheds heavily despite its tidy appearance.","Herding instinct may appear as heel-nipping, chasing and controlling movement around the home.","Their long-backed shape means excess weight adds undesirable stress to the spine and joints.","They can become very vocal if alert barking is not managed early."],
    products:{harness:"small-medium Y-front harness, roughly 20–28 in (51–71 cm)ch chest", shampoo:"corgi double coat deshedding shampoo", grooming:"undercoat rake and grooming mitt", bed:"supportive low-entry medium bed or 30–36 in (76–91 cm)ch crate"}
  },
  {
    id: "newfoundland", name: "Newfoundland", size: "large", category: "Newfoundland (dog)", photo: "Newfoundland brown.jpg", petfinder: "newfoundland-dog",
    profile: {energy:2, experience:2, exercise:2, grooming:4, shedding:5, apartment:2, children:5, working:4},
    facts: {weight:"100–150 lb (45–68 kg)", height:"26–28 in (66–71 cm)", lifespan:"9–10 years", coat:"Heavy water-resistant double coat", purpose:"Water rescue and draft work", exercise:"About 1 hour/day, avoiding overexertion in heat"},
    stats: {trainability:82, energy:46, exercise:54, stimulation:62, sociability:92, independence:38, shedding:94, grooming:84, barking:34},
    disadvantages:["Their enormous size makes food, medication, boarding, travel and basic equipment substantially more expensive.","The heavy coat sheds and mats without regular brushing, and many Newfoundlands drool heavily.","They overheat more easily than lighter-coated breeds and need careful exercise management in warm climates.","Hip and elbow dysplasia and inherited heart disease are important breed health concerns."],
    products:{harness:"XXL heavy-duty harness, roughly 34–48 in (86–122 cm)ch chest", shampoo:"Newfoundland double coat conditioning and deshedding shampoo", grooming:"large undercoat rake, pin brush and metal comb", bed:"giant orthopedic dog bed or 48–54 in (122–137 cm)ch crate"}
  },
  {
    id: "doberman-pinscher", name: "Doberman Pinscher", size: "large", category: "Dobermann", photo: "Dobermann Black and Tan \"Vito\".jpg", petfinder: "doberman-pinscher",
    profile: {energy:4, experience:3, exercise:4, grooming:1, shedding:2, apartment:3, children:4, working:5},
    facts: {weight:"60–100 lb (27–45 kg)", height:"24–28 in (61–71 cm)", lifespan:"10–12 years", coat:"Short, smooth coat", purpose:"Personal protection and working companion", exercise:"About 1.5–2 hours/day"},
    stats: {trainability:94, energy:86, exercise:88, stimulation:91, sociability:68, independence:42, shedding:38, grooming:22, barking:62},
    disadvantages:["They need consistent training, exercise and early socialization; boredom can turn into destructive or difficult behavior.","Dilated cardiomyopathy is a major inherited health concern in the breed and can sometimes progress with few early signs.","Their short coat provides little insulation in cold weather.","They are powerful, fast dogs, so weak leash skills or inconsistent handling become significant problems."],
    products:{harness:"large athletic Y-front harness, roughly 27–36 in (69–91 cm)ch chest", shampoo:"Doberman short coat gentle dog shampoo", grooming:"rubber curry brush and grooming mitt", bed:"large orthopedic bed or 42 in (107 cm)ch crate"}
  },
  {
    id: "boxer", name: "Boxer", size: "large", category: "Boxer (dog)", photo: "Standing dog.jpg", petfinder: "boxer",
    profile: {energy:4, experience:2, exercise:4, grooming:1, shedding:2, apartment:3, children:4, working:4},
    facts: {weight:"50–80 lb (23–36 kg)", height:"21.5–25 in (55–64 cm)", lifespan:"10–12 years", coat:"Short, smooth coat", purpose:"Working, guarding and companion work", exercise:"About 1.5 hours/day"},
    stats: {trainability:80, energy:88, exercise:84, stimulation:78, sociability:86, independence:40, shedding:42, grooming:20, barking:48},
    disadvantages:["Young Boxers can be extremely bouncy and physical, which can overwhelm small children or fragile adults without training.","Their shortened muzzle reduces heat tolerance compared with longer-muzzled athletic breeds.","The breed has meaningful risks of heart disease and several cancers.","They often remain puppy-like for years and need more structured activity than their comic personality may suggest."],
    products:{harness:"large broad-chest Y-front harness, roughly 25–35 in (64–89 cm)ch chest", shampoo:"Boxer sensitive-skin short coat shampoo", grooming:"rubber grooming mitt", bed:"large supportive bed or 36–42 in (91–107 cm)ch crate"}
  },
  {
    id: "rottweiler", name: "Rottweiler", size: "large", category: "Rottweiler", photo: "Rottweiler-dog.jpg", petfinder: "rottweiler",
    profile: {energy:3, experience:3, exercise:3, grooming:1, shedding:3, apartment:2, children:4, working:5},
    facts: {weight:"80–135 lb (36–61 kg)", height:"22–27 in (56–69 cm)", lifespan:"9–10 years", coat:"Short double coat", purpose:"Cattle driving, carting and working", exercise:"About 1–1.5 hours/day plus training"},
    stats: {trainability:91, energy:70, exercise:72, stimulation:84, sociability:62, independence:48, shedding:60, grooming:26, barking:46},
    disadvantages:["They are exceptionally strong, so incomplete training and socialization can create problems that are physically difficult to manage.","Hip and elbow dysplasia, cruciate injuries and some cancers are important breed health concerns.","They often mature into serious, confident adults and are a poor choice for owners who want a very casual training approach.","Housing or insurance restrictions can apply to the breed in some places."],
    products:{harness:"XL heavy-duty harness, roughly 30–40 in (76–102 cm)ch chest", shampoo:"Rottweiler short double coat deshedding shampoo", grooming:"rubber curry brush and undercoat tool", bed:"XL orthopedic bed or 42–48 in (107–122 cm)ch crate"}
  },
  {
    id: "greyhound", name: "Greyhound", size: "large", category: "Greyhound", photo: "Greyhound...JPG", petfinder: "greyhound",
    profile: {energy:2, experience:1, exercise:2, grooming:1, shedding:2, apartment:4, children:4, working:2},
    facts: {weight:"60–70 lb (27–32 kg)", height:"27–30 in (69–76 cm)", lifespan:"10–13 years", coat:"Short, fine coat", purpose:"Coursing and racing", exercise:"Daily walks plus chances to run safely"},
    stats: {trainability:70, energy:44, exercise:58, stimulation:50, sociability:78, independence:64, shedding:34, grooming:18, barking:22},
    disadvantages:["Their prey drive can be strong, so small animals and off-leash areas require careful judgment.","The thin coat and low body fat make them unusually sensitive to cold weather and hard sleeping surfaces.","They can reach very high speed almost instantly, so secure fencing matters even though they are often calm indoors.","Dental disease can be a recurring issue in some Greyhounds and needs active prevention."],
    products:{harness:"large deep-chest escape-resistant sighthound harness, roughly 26–34 in (66–86 cm)ch chest", shampoo:"Greyhound gentle short coat shampoo", grooming:"soft rubber grooming mitt", bed:"large thick orthopedic bed or 42 in (107 cm)ch crate"}
  },
  {
    id: "australian-cattle-dog", name: "Australian Cattle Dog", size: "medium", category: "Australian Cattle Dog", photo: "Australian Cattle Dog - Female one year old.JPG", petfinder: "australian-cattle-dog-blue-heeler",
    profile: {energy:5, experience:3, exercise:5, grooming:2, shedding:4, apartment:2, children:3, working:5},
    facts: {weight:"35–50 lb (16–23 kg)", height:"17–20 in (43–51 cm)", lifespan:"12–16 years", coat:"Short dense double coat", purpose:"Driving cattle over long distances", exercise:"About 2+ hours/day with mental work"},
    stats: {trainability:93, energy:98, exercise:98, stimulation:96, sociability:58, independence:62, shedding:72, grooming:34, barking:58},
    disadvantages:["They are intensely energetic working dogs and can invent unwanted jobs if physical exercise is not paired with mental work.","Herding behavior can include chasing, body-blocking and heel-nipping children, runners or other pets.","They can be suspicious or sharp with unfamiliar people if socialization is neglected.","Deafness and progressive retinal atrophy are notable inherited health concerns."],
    products:{harness:"medium athletic harness, roughly 20–30 in (51–76 cm)ch chest", shampoo:"Australian Cattle Dog double coat deshedding shampoo", grooming:"undercoat rake and rubber curry brush", bed:"medium-large durable bed or 36 in (91 cm)ch crate"}
  },
  {
    id: "english-springer-spaniel", name: "English Springer Spaniel", size: "medium", category: "English Springer Spaniel", photo: "English-Springer-Spaniel.jpg", petfinder: "english-springer-spaniel",
    profile: {energy:4, experience:1, exercise:4, grooming:3, shedding:3, apartment:3, children:5, working:5},
    facts: {weight:"40–50 lb (18–23 kg)", height:"19–20 in (48–51 cm)", lifespan:"12–14 years", coat:"Medium double coat with feathering", purpose:"Flushing and retrieving game", exercise:"About 1.5–2 hours/day"},
    stats: {trainability:91, energy:86, exercise:86, stimulation:84, sociability:91, independence:30, shedding:62, grooming:66, barking:50},
    disadvantages:["They need substantial daily activity and often become restless when treated as low-key companion dogs.","Feathering around ears, legs and belly collects mud and tangles and requires regular brushing and trimming.","Long, dropped ears increase the need for ear monitoring and cleaning.","Some lines can be highly intense, so temperament and breeding line matter considerably."],
    products:{harness:"medium adjustable harness, roughly 21–30 in (53–76 cm)ch chest", shampoo:"Springer Spaniel feathered coat conditioning shampoo", grooming:"slicker brush, comb and ear-care supplies", bed:"medium-large washable bed or 36 in (91 cm)ch crate"}
  },
  {
    id: "brittany", name: "Brittany", size: "medium", category: "Brittany dog", photo: "Brittany Spaniel standing.jpg", petfinder: "brittany-spaniel",
    profile: {energy:5, experience:2, exercise:5, grooming:2, shedding:2, apartment:2, children:4, working:5},
    facts: {weight:"30–40 lb (14–18 kg)", height:"17.5–20.5 in (44–52 cm)", lifespan:"12–14 years", coat:"Dense flat or wavy coat", purpose:"Pointing and retrieving birds", exercise:"About 2+ hours/day"},
    stats: {trainability:91, energy:98, exercise:98, stimulation:90, sociability:88, independence:36, shedding:44, grooming:42, barking:48},
    disadvantages:["Their exercise needs are genuinely high; a quick walk is rarely enough for an adult Brittany.","They can range far and chase wildlife, so recall training and secure exercise areas matter.","Under-stimulated dogs may become frantic, destructive or difficult to settle indoors.","Their sensitive temperament often responds poorly to harsh or inconsistent training."],
    products:{harness:"medium lightweight athletic harness, roughly 19–28 in (48–71 cm)ch chest", shampoo:"Brittany medium coat gentle conditioning shampoo", grooming:"pin brush and metal comb", bed:"medium washable bed or 30–36 in (76–91 cm)ch crate"}
  },
  {
    id: "basenji", name: "Basenji", size: "medium", category: "Basenji", photo: "Basenji red & white 1.jpg", petfinder: "basenji",
    profile: {energy:4, experience:3, exercise:4, grooming:1, shedding:1, apartment:4, children:3, working:2},
    facts: {weight:"22–24 lb (10–11 kg)", height:"16–17 in (41–43 cm)", lifespan:"13–14 years", coat:"Very short fine coat", purpose:"Hunting by sight and scent", exercise:"About 1–1.5+ hours/day"},
    stats: {trainability:48, energy:82, exercise:82, stimulation:78, sociability:56, independence:95, shedding:18, grooming:14, barking:12},
    disadvantages:["They are extremely independent and can be much harder to motivate than breeds developed for close cooperation with people.","Strong prey drive and poor reliability around distractions make off-leash freedom risky for many individuals.","They may be quiet in the conventional barking sense but can yodel, scream and make other distinctive sounds.","Fanconi syndrome and progressive retinal atrophy are important inherited conditions for which responsible breeders screen."],
    products:{harness:"small-medium escape-resistant harness, roughly 18–26 in (46–66 cm)ch chest", shampoo:"Basenji gentle short coat shampoo", grooming:"soft grooming mitt", bed:"medium warm bed or 30 in (76 cm)ch crate"}
  },
  {
    id: "whippet", name: "Whippet", size: "medium", category: "Whippet", photo: "Whippet 2018 6.jpg", petfinder: "whippet",
    profile: {energy:3, experience:1, exercise:2, grooming:1, shedding:1, apartment:5, children:4, working:2},
    facts: {weight:"25–40 lb (11–18 kg)", height:"18–22 in (46–56 cm)", lifespan:"12–15 years", coat:"Short, fine coat", purpose:"Coursing and racing small game", exercise:"Daily walks plus safe sprinting opportunities"},
    stats: {trainability:72, energy:62, exercise:62, stimulation:56, sociability:82, independence:58, shedding:24, grooming:14, barking:20},
    disadvantages:["Prey drive can be strong and their acceleration is exceptional, so secure fencing and thoughtful recall management are important.","The thin coat and lean body make them sensitive to cold weather.","Their skin is relatively thin and can be injured more easily during rough play or high-speed collisions.","Many dislike being left alone for long periods and are happiest with substantial human companionship."],
    products:{harness:"medium deep-chest sighthound harness, roughly 20–28 in (51–71 cm)ch chest", shampoo:"Whippet gentle sensitive-skin short coat shampoo", grooming:"soft rubber grooming mitt", bed:"medium thick cushioned bed or 30–36 in (76–91 cm)ch crate"}
  },
  {
    id: "havanese", name: "Havanese", size: "small", category: "Havanese", photo: "A havanese dog.jpg", petfinder: "havanese",
    profile: {energy:2, experience:1, exercise:2, grooming:5, shedding:1, apartment:5, children:5, working:1},
    facts: {weight:"7–13 lb (3.2–5.9 kg)", height:"8.5–11.5 in (22–29 cm)", lifespan:"14–16 years", coat:"Long, soft, silky coat", purpose:"Companion dog", exercise:"About 45–60 minutes/day"},
    stats: {trainability:84, energy:48, exercise:48, stimulation:58, sociability:95, independence:20, shedding:14, grooming:94, barking:58},
    disadvantages:["The long coat mats quickly without very frequent brushing or a shorter maintenance trim.","They are strongly people-oriented and can struggle with long stretches of isolation.","Small size makes rough handling or accidental falls more consequential.","Dental care is important because crowding and periodontal disease are common concerns in small companion breeds."],
    products:{harness:"XS soft lightweight harness, roughly 12–18 in (30–46 cm)ch chest", shampoo:"Havanese silky coat detangling and conditioning shampoo", grooming:"small pin brush, slicker brush and metal comb", bed:"small cushioned bed or 24 in (61 cm)ch crate"}
  },
  {
    id: "bichon-frise", name: "Bichon Frise", size: "small", category: "Bichon Frisé", photo: "Bichon Frisé - studdogbichon.jpg", petfinder: "bichon-frise",
    profile: {energy:2, experience:1, exercise:2, grooming:5, shedding:1, apartment:5, children:5, working:1},
    facts: {weight:"12–18 lb (5.4–8.2 kg)", height:"9.5–11.5 in (24–29 cm)", lifespan:"14–15 years", coat:"Curly double coat", purpose:"Companion dog", exercise:"About 45–60 minutes/day"},
    stats: {trainability:80, energy:50, exercise:48, stimulation:56, sociability:94, independence:22, shedding:10, grooming:98, barking:54},
    disadvantages:["Low shedding does not mean low maintenance: the coat requires frequent brushing and regular professional clipping.","Tear staining and skin sensitivity can require ongoing care.","They can become very attached to people and may develop separation-related behavior if alone too often.","Dental disease and bladder stones are among the health issues owners should be prepared to monitor."],
    products:{harness:"small lightweight harness, roughly 14–20 in (36–51 cm)ch chest", shampoo:"Bichon Frise white curly coat moisturizing shampoo", grooming:"small slicker brush, metal comb and clipper supplies", bed:"small washable bed or 24–30 in (61–76 cm)ch crate"}
  },
  {
    id: "papillon", name: "Papillon", size: "small", category: "Papillon (dog)", photo: "\"PAPILLON\" TOY DOGS.jpg", petfinder: "papillon",
    profile: {energy:3, experience:1, exercise:2, grooming:2, shedding:2, apartment:5, children:3, working:4},
    facts: {weight:"5–10 lb (2.3–4.5 kg)", height:"8–11 in (20–28 cm)", lifespan:"14–16 years", coat:"Long, fine single coat", purpose:"Companion and small sporting dog", exercise:"About 45–60 minutes/day plus play or training"},
    stats: {trainability:94, energy:70, exercise:56, stimulation:82, sociability:86, independence:34, shedding:38, grooming:46, barking:72},
    disadvantages:["They are tiny but mentally and physically active, and can become noisy or restless if treated like decorative lap dogs.","Their small bones make rough play with much larger dogs or young children risky.","They are alert and can become frequent barkers without training.","Patellar luxation and dental disease are notable small-breed health concerns."],
    products:{harness:"XXS or XS lightweight harness, roughly 10–16 in (25–41 cm)ch chest", shampoo:"Papillon fine silky coat gentle conditioning shampoo", grooming:"small pin brush and fine metal comb", bed:"toy-size bed or 18–24 in (46–61 cm)ch crate"}
  },
  {
    id: "jack-russell-terrier", name: "Jack Russell Terrier", size: "small", category: "Jack Russell Terrier", photo: "Jack-Russell Terrier.jpg", petfinder: "jack-russell-terrier",
    profile: {energy:5, experience:3, exercise:4, grooming:1, shedding:2, apartment:3, children:3, working:5},
    facts: {weight:"13–17 lb (5.9–7.7 kg)", height:"10–12 in (25–30 cm)", lifespan:"13–16 years", coat:"Smooth, broken or rough", purpose:"Fox hunting and vermin control", exercise:"About 1.5+ hours/day with mental work"},
    stats: {trainability:86, energy:98, exercise:90, stimulation:94, sociability:70, independence:70, shedding:42, grooming:28, barking:84},
    disadvantages:["Their energy, prey drive and persistence are far greater than their small size suggests.","They can dig, chase, bark and escape when their hunting instincts are not given appropriate outlets.","Many are too intense for households wanting a quiet, easy lap dog.","They often require careful management around small pets because chasing behavior is deeply ingrained."],
    products:{harness:"small secure Y-front harness, roughly 15–22 in (38–56 cm)ch chest", shampoo:"Jack Russell Terrier short or broken coat gentle shampoo", grooming:"rubber curry brush or stripping tool for rough coats", bed:"small durable bed or 24–30 in (61–76 cm)ch crate"}
  },
  {
    id: "maltese", name: "Maltese", size: "small", category: "Maltese (dog)", photo: "Maltese Dog 1.jpg", petfinder: "maltese",
    profile: {energy:2, experience:1, exercise:1, grooming:5, shedding:1, apartment:5, children:3, working:1},
    facts: {weight:"Under 7 lb (under 3.2 kg)", height:"About 7–9 in (18–23 cm)", lifespan:"12–15 years", coat:"Long, straight silky coat", purpose:"Companion dog", exercise:"About 30–45 minutes/day"},
    stats: {trainability:76, energy:42, exercise:34, stimulation:50, sociability:86, independence:30, shedding:10, grooming:98, barking:70},
    disadvantages:["A full-length coat requires intensive brushing and regular bathing; even a short pet trim still needs scheduled grooming.","Their tiny size makes falls, rough handling and interactions with much larger dogs more dangerous.","Dental disease is a major maintenance issue in toy breeds and needs consistent prevention.","They can become vocal or separation-prone when highly dependent on constant companionship."],
    products:{harness:"XXS lightweight harness, roughly 9–14 in (23–36 cm)ch chest", shampoo:"Maltese white silky coat tear-stain friendly conditioning shampoo", grooming:"small pin brush, face comb and fine metal comb", bed:"toy-size soft bed or 18–24 in (46–61 cm)ch crate"}
  }
];
