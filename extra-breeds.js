(() => {
  const EXTRA_BREEDS = [
    {
      id:"akita", name:"Akita", size:"large", category:"Akita Inu", photo:"Akita Dog.jpg", petfinder:"akita",
      profile:{energy:3,experience:3,exercise:3,grooming:3,shedding:5,apartment:2,children:3,working:4},
      facts:{weight:"70–130 lb (32–59 kg)",height:"24–28 in (61–71 cm)",lifespan:"10–14 years",coat:"Thick double coat",purpose:"Hunting, guarding and companionship",exercise:"About 1–1.5 hours/day",weightMale:"100–130 lb (45–59 kg)",weightFemale:"70–100 lb (32–45 kg)",heightMale:"26–28 in (66–71 cm)",heightFemale:"24–26 in (61–66 cm)"},
      stats:{trainability:68,energy:68,exercise:70,stimulation:72,sociability:42,independence:88,shedding:96,grooming:58,barking:35},
      disadvantages:["Akitas are independent and usually need more experienced, consistent handling than an easygoing companion breed.","They can be selective with unfamiliar dogs, so early socialization and careful introductions matter.","The dense double coat sheds extremely heavily during seasonal coat blow.","Hip dysplasia, autoimmune disease and some eye disorders are important breed health considerations."],
      products:{harness:"XL sturdy Y-front harness, roughly 28–38 in (71–97 cm) chest",shampoo:"Akita double-coat deshedding shampoo",grooming:"undercoat rake and slicker brush",bed:"XL supportive bed or 42–48 in (107–122 cm) crate"}
    },
    {
      id:"great-pyrenees", name:"Great Pyrenees", size:"large", category:"Pyrenean Mountain Dog", photo:"Great Pyrenees.jpg", petfinder:"great-pyrenees",
      profile:{energy:2,experience:2,exercise:2,grooming:4,shedding:5,apartment:1,children:5,working:4},
      facts:{weight:"85–160+ lb (39–73+ kg)",height:"25–32 in (64–81 cm)",lifespan:"10–12 years",coat:"Long, weather-resistant double coat",purpose:"Livestock guarding",exercise:"About 1–1.5 hours/day",weightMale:"100 lb+ (45 kg+)",weightFemale:"85 lb+ (39 kg+)",heightMale:"27–32 in (69–81 cm)",heightFemale:"25–29 in (64–74 cm)"},
      stats:{trainability:58,energy:48,exercise:55,stimulation:58,sociability:70,independence:92,shedding:94,grooming:76,barking:92},
      disadvantages:["They were bred to make independent decisions, so obedience can feel optional to them even when they understand the cue.","Nighttime alert barking can be substantial because livestock guardians are naturally vigilant.","The large body and heavy coat make hot climates, transport and medical care more demanding.","They shed heavily and need regular coat maintenance, especially around the rear, ears and feathering."],
      products:{harness:"XXL giant-breed harness, roughly 34–46 in (86–117 cm) chest",shampoo:"long double-coat deshedding shampoo",grooming:"long-pin slicker and undercoat rake",bed:"giant orthopedic bed or 48–54 in (122–137 cm) crate"}
    },
    {
      id:"collie", name:"Collie", size:"large", category:"Rough Collie", photo:"Adult Rough Collie.JPG", petfinder:"collie",
      profile:{energy:3,experience:1,exercise:3,grooming:4,shedding:4,apartment:3,children:5,working:4},
      facts:{weight:"50–75 lb (23–34 kg)",height:"22–26 in (56–66 cm)",lifespan:"12–14 years",coat:"Rough or smooth double coat",purpose:"Sheep herding",exercise:"About 1–1.5 hours/day",weightMale:"60–75 lb (27–34 kg)",weightFemale:"50–65 lb (23–29 kg)",heightMale:"24–26 in (61–66 cm)",heightFemale:"22–24 in (56–61 cm)"},
      stats:{trainability:90,energy:68,exercise:70,stimulation:80,sociability:88,independence:38,shedding:82,grooming:80,barking:72},
      disadvantages:["Rough-coated Collies need thorough brushing, particularly behind the ears and around feathering where mats form easily.","Many are sensitive to noise, harsh handling and chaotic environments.","They can become persistent alert barkers if barking is unintentionally reinforced.","Some hereditary eye disorders and drug-sensitivity genes occur in the breed and matter when choosing lines and medications."],
      products:{harness:"large lightweight Y-front harness, roughly 24–34 in (61–86 cm) chest",shampoo:"Collie long-coat conditioning shampoo",grooming:"long-pin slicker, pin brush and metal comb",bed:"large washable bed or 36–42 in (91–107 cm) crate"}
    },
    {
      id:"german-shorthaired-pointer", name:"German Shorthaired Pointer", size:"large", category:"German Shorthaired Pointer", photo:"German short-haired pointer.JPG", petfinder:"german-shorthaired-pointer",
      profile:{energy:5,experience:2,exercise:5,grooming:1,shedding:3,apartment:1,children:4,working:5},
      facts:{weight:"45–70 lb (20–32 kg)",height:"21–25 in (53–64 cm)",lifespan:"10–12 years",coat:"Short, dense coat",purpose:"Versatile pointing and retrieving",exercise:"2+ hours/day",weightMale:"55–70 lb (25–32 kg)",weightFemale:"45–60 lb (20–27 kg)",heightMale:"23–25 in (58–64 cm)",heightFemale:"21–23 in (53–58 cm)"},
      stats:{trainability:92,energy:100,exercise:100,stimulation:92,sociability:84,independence:45,shedding:55,grooming:18,barking:48},
      disadvantages:["Their exercise requirement is extremely high and usually exceeds what casual daily walks provide.","Strong prey drive can make off-leash reliability around wildlife difficult without substantial training.","Young GSPs can be intensely physical, mouthy and destructive when under-exercised.","Bloat, hip problems and several inherited conditions should be considered when evaluating breeding lines."],
      products:{harness:"large athletic harness, roughly 24–34 in (61–86 cm) chest",shampoo:"gentle short-coat dog shampoo",grooming:"rubber curry brush",bed:"large supportive bed or 36–42 in (91–107 cm) crate"}
    },
    {
      id:"english-setter", name:"English Setter", size:"large", category:"English Setter", photo:"A English Setter.jpg", petfinder:"english-setter",
      profile:{energy:4,experience:1,exercise:4,grooming:3,shedding:3,apartment:2,children:5,working:4},
      facts:{weight:"45–80 lb (20–36 kg)",height:"23–27 in (58–69 cm)",lifespan:"11–15 years",coat:"Medium-long feathered coat",purpose:"Bird setting and hunting",exercise:"About 1.5–2 hours/day",weightMale:"65–80 lb (29–36 kg)",weightFemale:"45–55 lb (20–25 kg)",heightMale:"25–27 in (64–69 cm)",heightFemale:"23–25 in (58–64 cm)"},
      stats:{trainability:82,energy:82,exercise:88,stimulation:78,sociability:93,independence:48,shedding:58,grooming:66,barking:48},
      disadvantages:["Field-bred English Setters can have much higher exercise and ranging drive than their elegant appearance suggests.","The feathered coat tangles and collects debris, especially around ears, legs and tail.","Their hunting instincts can make recall challenging around birds and wildlife.","Some lines are affected by hip dysplasia, deafness and thyroid disease."],
      products:{harness:"large lightweight sporting harness, roughly 23–33 in (58–84 cm) chest",shampoo:"setter feathered-coat conditioning shampoo",grooming:"pin brush, slicker and metal comb",bed:"large washable bed or 36–42 in (91–107 cm) crate"}
    },
    {
      id:"old-english-sheepdog", name:"Old English Sheepdog", size:"large", category:"Old English Sheepdog", photo:"Old-English-Sheepdog.jpg", petfinder:"old-english-sheepdog",
      profile:{energy:3,experience:2,exercise:3,grooming:5,shedding:3,apartment:2,children:4,working:4},
      facts:{weight:"60–100 lb (27–45 kg)",height:"21–22+ in (53–56+ cm)",lifespan:"10–12 years",coat:"Long, profuse double coat",purpose:"Droving and herding",exercise:"About 1–1.5 hours/day",heightMale:"22 in+ (56 cm+)",heightFemale:"21 in+ (53 cm+)"},
      stats:{trainability:78,energy:68,exercise:72,stimulation:72,sociability:88,independence:44,shedding:60,grooming:100,barking:62},
      disadvantages:["The coat is an enormous maintenance commitment if kept long and can mat deeply near the skin.","Professional grooming costs can be high, and home coat care requires time and technique.","Their size, coat and enthusiasm can make hot weather and small spaces uncomfortable.","Hip dysplasia, eye disease and some thyroid or hearing problems occur in the breed."],
      products:{harness:"XL harness, roughly 28–38 in (71–97 cm) chest",shampoo:"long-coat moisturizing and detangling shampoo",grooming:"long-pin slicker, rake and full-length metal comb",bed:"XL cooling washable bed or 42–48 in (107–122 cm) crate"}
    },
    {
      id:"american-cocker-spaniel", name:"American Cocker Spaniel", size:"small", category:"American Cocker Spaniel", photo:"An American Cocker Spaniel.jpg", petfinder:"cocker-spaniel",
      profile:{energy:3,experience:1,exercise:3,grooming:5,shedding:3,apartment:5,children:4,working:2},
      facts:{weight:"20–30 lb (9–14 kg)",height:"13.5–15.5 in (34–39 cm)",lifespan:"10–14 years",coat:"Long, silky coat with heavy feathering",purpose:"Flushing and companion work",exercise:"About 1 hour/day",heightMale:"14.5–15.5 in (37–39 cm)",heightFemale:"13.5–14.5 in (34–37 cm)"},
      stats:{trainability:82,energy:66,exercise:64,stimulation:70,sociability:88,independence:30,shedding:54,grooming:96,barking:58},
      disadvantages:["The show-style coat requires extensive brushing and regular professional grooming unless kept in a shorter clip.","Long ears reduce airflow and can make ear infections a recurring management issue.","Eye disorders and several inherited health conditions are important in some lines.","Poorly bred or under-socialized Cockers can be much more anxious or reactive than the breed's cheerful reputation suggests."],
      products:{harness:"small-medium soft harness, roughly 17–24 in (43–61 cm) chest",shampoo:"Cocker Spaniel silky-coat conditioning shampoo",grooming:"slicker brush, metal comb and ear-care supplies",bed:"medium washable bed or 30 in (76 cm) crate"}
    },
    {
      id:"cairn-terrier", name:"Cairn Terrier", size:"small", category:"Cairn Terrier", photo:"Cairn terrier.jpg", petfinder:"cairn-terrier",
      profile:{energy:4,experience:1,exercise:3,grooming:3,shedding:2,apartment:4,children:4,working:3},
      facts:{weight:"13–14 lb (5.9–6.4 kg)",height:"9.5–10 in (24–25 cm)",lifespan:"13–15 years",coat:"Harsh, weather-resistant double coat",purpose:"Vermin hunting",exercise:"About 1 hour/day",weightMale:"About 14 lb (6.4 kg)",weightFemale:"About 13 lb (5.9 kg)",heightMale:"About 10 in (25 cm)",heightFemale:"About 9.5 in (24 cm)"},
      stats:{trainability:74,energy:78,exercise:68,stimulation:80,sociability:74,independence:68,shedding:35,grooming:60,barking:78},
      disadvantages:["Terrier prey drive can make chasing rodents and small animals difficult to suppress completely.","They are bold and independent enough to ignore recall when something more interesting appears.","The traditional harsh coat needs regular brushing and periodic hand-stripping or clipping.","Digging and alert barking are natural behaviors that need management rather than wishful thinking."],
      products:{harness:"small secure harness, roughly 14–20 in (36–51 cm) chest",shampoo:"Cairn Terrier harsh-coat gentle shampoo",grooming:"terrier rake, slicker and stripping tool",bed:"small washable bed or 24 in (61 cm) crate"}
    },
    {
      id:"italian-greyhound", name:"Italian Greyhound", size:"small", category:"Italian Greyhound", photo:"ItalianGreyhound.jpg", petfinder:"italian-greyhound",
      profile:{energy:3,experience:1,exercise:2,grooming:1,shedding:1,apartment:5,children:2,working:1},
      facts:{weight:"7–14 lb (3.2–6.4 kg)",height:"13–15 in (33–38 cm)",lifespan:"14–15 years",coat:"Very short, fine coat",purpose:"Companion and small sighthound",exercise:"About 45–60 minutes/day"},
      stats:{trainability:68,energy:62,exercise:52,stimulation:58,sociability:82,independence:48,shedding:18,grooming:12,barking:44},
      disadvantages:["Their fine bones are genuinely fragile, especially during puppyhood, and leg fractures are a known risk.","They get cold easily and often need clothing in cool weather.","House-training can take more patience than with many breeds, particularly in bad weather.","Sighthound prey drive means sudden chasing can occur even in otherwise calm dogs."],
      products:{harness:"XS escape-resistant sighthound harness, roughly 13–18 in (33–46 cm) chest",shampoo:"very gentle sensitive-skin short-coat shampoo",grooming:"soft grooming mitt",bed:"small warm cave-style bed or 24 in (61 cm) crate"}
    },
    {
      id:"miniature-pinscher", name:"Miniature Pinscher", size:"small", category:"Miniature Pinscher", photo:"Miniature Pinscher.jpg", petfinder:"miniature-pinscher",
      profile:{energy:4,experience:1,exercise:3,grooming:1,shedding:2,apartment:5,children:3,working:2},
      facts:{weight:"8–10 lb (3.6–4.5 kg)",height:"10–12.5 in (25–32 cm)",lifespan:"12–16 years",coat:"Short, smooth coat",purpose:"Companion and vermin control",exercise:"About 1 hour/day"},
      stats:{trainability:72,energy:82,exercise:64,stimulation:76,sociability:62,independence:70,shedding:28,grooming:12,barking:84},
      disadvantages:["They are much more assertive and energetic than their tiny size suggests.","Escape attempts, door-dashing and chasing can become problems without secure management and recall work.","They can be highly vocal and suspicious of unfamiliar activity if not socialized broadly.","Their small size makes rough handling, large-dog collisions and falls more consequential."],
      products:{harness:"XS lightweight secure harness, roughly 12–18 in (30–46 cm) chest",shampoo:"gentle short-coat dog shampoo",grooming:"soft rubber grooming mitt",bed:"toy-size warm bed or 18–24 in (46–61 cm) crate"}
    }
  ];

  for (const breed of EXTRA_BREEDS) {
    if (!BREEDS.some(existing => existing.id === breed.id)) BREEDS.push(breed);
  }
})();
