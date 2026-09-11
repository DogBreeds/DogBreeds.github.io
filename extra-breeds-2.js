(() => {
  if (typeof BREEDS === "undefined") return;

  const EXTRA_BREEDS_2 = [
    {
      id:"belgian-malinois", name:"Belgian Malinois", size:"large", category:"Belgian Shepherd Malinois", photo:"Belgian Malinois.jpg", petfinder:"belgian-malinois",
      profile:{energy:5,experience:3,exercise:5,grooming:2,shedding:3,apartment:1,children:3,working:5},
      facts:{weight:"40–80 lb (18–36 kg)",height:"22–26 in (56–66 cm)",lifespan:"14–16 years",coat:"Short, weather-resistant double coat",purpose:"Herding, protection and demanding working roles",exercise:"2+ hours/day plus substantial training and mental work",weightMale:"60–80 lb (27–36 kg)",weightFemale:"40–60 lb (18–27 kg)",heightMale:"24–26 in (61–66 cm)",heightFemale:"22–24 in (56–61 cm)"},
      stats:{trainability:98,energy:100,exercise:100,stimulation:100,sociability:62,independence:58,shedding:62,grooming:32,barking:65},
      disadvantages:["Belgian Malinois are exceptionally intense working dogs; ordinary walks are rarely enough, and under-stimulation can turn into destructive or obsessive behavior.","Their speed, mouthiness and chase drive can overwhelm inexperienced handlers and require careful management around children, bikes, runners and other animals.","They usually need structured daily training, impulse-control work and a real outlet for problem solving rather than simply more physical exercise.","Hip and elbow dysplasia, eye disorders and epilepsy occur in the breed, so health-tested lines and appropriate screening matter."],
      products:{harness:"large athletic Y-front harness, roughly 24–34 in (61–86 cm) chest",shampoo:"gentle short double-coat shampoo",grooming:"rubber curry brush and undercoat rake",bed:"large durable bed or 36–42 in (91–107 cm) crate"}
    },
    {
      id:"chesapeake-bay-retriever", name:"Chesapeake Bay Retriever", size:"large", category:"Chesapeake Bay Retriever", photo:"Brown Chesapeake Bay Retriever.jpg", petfinder:"chesapeake-bay-retriever",
      profile:{energy:4,experience:3,exercise:4,grooming:2,shedding:4,apartment:2,children:4,working:5},
      facts:{weight:"55–80 lb (25–36 kg)",height:"21–26 in (53–66 cm)",lifespan:"10–13 years",coat:"Short, dense, oily and water-resistant double coat",purpose:"Cold-water waterfowl retrieving",exercise:"About 1.5–2 hours/day with retrieving, swimming or training",weightMale:"65–80 lb (29–36 kg)",weightFemale:"55–70 lb (25–32 kg)",heightMale:"23–26 in (58–66 cm)",heightFemale:"21–24 in (53–61 cm)"},
      stats:{trainability:84,energy:86,exercise:88,stimulation:86,sociability:66,independence:70,shedding:78,grooming:38,barking:50},
      disadvantages:["Chessies are often more independent and reserved than easier-going retrievers, so consistent training and early socialization matter.","They need substantial exercise and usually thrive when they have retrieving, swimming or other purposeful work rather than repetitive neighborhood walks alone.","The naturally oily waterproof coat has a distinctive feel and smell and should not be over-bathed or stripped of its protective oils.","Hip and elbow dysplasia, progressive retinal atrophy and bloat are important health concerns to discuss with breeders and veterinarians."],
      products:{harness:"large water-friendly Y-front harness, roughly 26–36 in (66–91 cm) chest",shampoo:"mild retriever shampoo that does not aggressively strip coat oils",grooming:"rubber curry brush and undercoat rake",bed:"large washable orthopedic bed or 42 in (107 cm) crate"}
    },
    {
      id:"flat-coated-retriever", name:"Flat-Coated Retriever", size:"large", category:"Flat-Coated Retriever", photo:"Flatcoated Retriever.jpg", petfinder:"flat-coated-retriever",
      profile:{energy:4,experience:2,exercise:4,grooming:3,shedding:4,apartment:2,children:5,working:4},
      facts:{weight:"60–70 lb (27–32 kg)",height:"22–24.5 in (56–62 cm)",lifespan:"8–10 years",coat:"Medium-length, flat, feathered coat",purpose:"Upland and water retrieving",exercise:"About 1.5–2 hours/day with play, retrieving and training",weightMale:"60–70 lb (27–32 kg)",weightFemale:"60–70 lb (27–32 kg)",heightMale:"23–24.5 in (58–62 cm)",heightFemale:"22–23.5 in (56–60 cm)"},
      stats:{trainability:92,energy:88,exercise:88,stimulation:84,sociability:94,independence:32,shedding:76,grooming:62,barking:45},
      disadvantages:["Flat-Coats often retain a puppy-like, exuberant temperament for years, so jumping, mouthiness and overexcitement need patient training.","They need substantial daily exercise and interaction and can become destructive or frantic when left under-exercised.","The feathered coat sheds and needs regular brushing, especially around ears, legs and tail where tangles develop.","Cancer is a major breed health concern, including histiocytic sarcoma and other malignancies, and contributes to the breed's relatively short average lifespan."],
      products:{harness:"large lightweight retriever harness, roughly 24–34 in (61–86 cm) chest",shampoo:"conditioning shampoo for feathered retriever coats",grooming:"pin brush, slicker brush and metal comb",bed:"large washable supportive bed or 42 in (107 cm) crate"}
    },
    {
      id:"nova-scotia-duck-tolling-retriever", name:"Nova Scotia Duck Tolling Retriever", size:"medium", category:"Nova Scotia Duck Tolling Retriever", photo:"Volwassen teef met witte accentkleur.jpg", petfinder:"nova-scotia-duck-tolling-retriever",
      profile:{energy:5,experience:2,exercise:5,grooming:3,shedding:4,apartment:2,children:4,working:5},
      facts:{weight:"35–50 lb (16–23 kg)",height:"17–21 in (43–53 cm)",lifespan:"12–14 years",coat:"Medium-length water-repellent double coat",purpose:"Tolling and retrieving waterfowl",exercise:"1.5–2+ hours/day with vigorous activity and training",weightMale:"44–51 lb (20–23 kg)",weightFemale:"37–44 lb (17–20 kg)",heightMale:"18–21 in (46–53 cm)",heightFemale:"17–20 in (43–51 cm)"},
      stats:{trainability:94,energy:98,exercise:98,stimulation:96,sociability:82,independence:48,shedding:78,grooming:58,barking:72},
      disadvantages:["Tollers are compact but extremely energetic working retrievers and often need more exercise and mental work than their size suggests.","Some produce the piercing high-pitched vocalization known as the 'Toller scream' when excited, which can be difficult in shared-wall housing.","The double coat sheds heavily at times and the feathering needs regular brushing to prevent tangles.","Autoimmune disease, Addison's disease and progressive retinal atrophy are among the health concerns seen in the breed."],
      products:{harness:"medium athletic Y-front harness, roughly 20–30 in (51–76 cm) chest",shampoo:"gentle water-dog double-coat shampoo",grooming:"pin brush, slicker brush and undercoat rake",bed:"medium-large washable bed or 36 in (91 cm) crate"}
    },
    {
      id:"giant-schnauzer", name:"Giant Schnauzer", size:"large", category:"Giant Schnauzer", photo:"GiantSchnauzer.jpg", petfinder:"giant-schnauzer",
      profile:{energy:5,experience:3,exercise:5,grooming:4,shedding:2,apartment:2,children:3,working:5},
      facts:{weight:"55–85 lb (25–39 kg)",height:"23.5–27.5 in (60–70 cm)",lifespan:"12–15 years",coat:"Dense, harsh, wiry double coat",purpose:"Farm work, driving cattle and guarding",exercise:"About 2 hours/day plus structured training and mental work",weightMale:"60–85 lb (27–39 kg)",weightFemale:"55–75 lb (25–34 kg)",heightMale:"25.5–27.5 in (65–70 cm)",heightFemale:"23.5–25.5 in (60–65 cm)"},
      stats:{trainability:94,energy:94,exercise:96,stimulation:96,sociability:58,independence:62,shedding:32,grooming:86,barking:62},
      disadvantages:["Giant Schnauzers are powerful, serious working dogs that require confident handling, early socialization and consistent boundaries.","They need substantial physical exercise and complex training; boredom can become destructive behavior or over-vigilance.","The wiry coat requires regular brushing plus clipping or hand-stripping, and beard care is a continual part of ownership.","Hip dysplasia, eye disease, thyroid disorders and bloat are important breed health concerns."],
      products:{harness:"XL sturdy Y-front harness, roughly 28–38 in (71–97 cm) chest",shampoo:"wiry-coat Schnauzer shampoo",grooming:"slicker brush, metal comb and stripping or clipping tools",bed:"XL supportive bed or 42–48 in (107–122 cm) crate"}
    },
    {
      id:"keeshond", name:"Keeshond", size:"medium", category:"Keeshond", photo:"Keeshond.jpg", petfinder:"keeshond",
      profile:{energy:3,experience:1,exercise:3,grooming:4,shedding:5,apartment:4,children:5,working:2},
      facts:{weight:"35–45 lb (16–20 kg)",height:"17–18 in (43–46 cm)",lifespan:"12–15 years",coat:"Very dense, plush double coat",purpose:"Barge watchdog and companion",exercise:"About 1 hour/day plus play and companionship",weightMale:"35–45 lb (16–20 kg)",weightFemale:"35–45 lb (16–20 kg)",heightMale:"18 in (46 cm)",heightFemale:"17 in (43 cm)"},
      stats:{trainability:86,energy:66,exercise:62,stimulation:70,sociability:96,independence:28,shedding:98,grooming:88,barking:82},
      disadvantages:["The huge double coat sheds heavily, especially during seasonal coat blow, and requires thorough brushing to reach the undercoat.","Keeshonden are highly social and can struggle with long periods alone; they generally want to be involved in household life.","Alert barking can become excessive without deliberate training, particularly in apartments or busy neighborhoods.","Hip dysplasia, patellar luxation, thyroid disease and some eye conditions occur in the breed."],
      products:{harness:"medium harness that avoids compressing the neck coat, roughly 20–30 in (51–76 cm) chest",shampoo:"conditioning double-coat shampoo",grooming:"long-pin slicker, undercoat rake and metal comb",bed:"medium-large cooling washable bed or 36 in (91 cm) crate"}
    },
    {
      id:"australian-kelpie", name:"Australian Kelpie", size:"medium", category:"Australian Kelpie", photo:"Australian Kelpie portrait.jpg", petfinder:"australian-kelpie",
      profile:{energy:5,experience:3,exercise:5,grooming:1,shedding:3,apartment:1,children:4,working:5},
      facts:{weight:"31–46 lb (14–21 kg)",height:"17–20 in (43–51 cm)",lifespan:"12–15 years",coat:"Short, dense, weather-resistant double coat",purpose:"High-endurance livestock herding",exercise:"2+ hours/day with running, training or real work",weightMale:"31–46 lb (14–21 kg)",weightFemale:"31–46 lb (14–21 kg)",heightMale:"18–20 in (46–51 cm)",heightFemale:"17–19 in (43–48 cm)"},
      stats:{trainability:98,energy:100,exercise:100,stimulation:100,sociability:72,independence:62,shedding:58,grooming:22,barking:58},
      disadvantages:["Australian Kelpies are purpose-bred endurance workers and can be extremely difficult to satisfy in a low-activity household.","Without enough structured work they may redirect herding behavior toward children, other pets, bicycles or anything else that moves.","They need frequent training and problem solving in addition to physical exercise; simply exhausting them physically can create an even fitter bored dog.","Hip dysplasia, progressive retinal atrophy and cerebellar abiotrophy occur in some lines and should be considered in health screening."],
      products:{harness:"medium lightweight athletic harness, roughly 20–29 in (51–74 cm) chest",shampoo:"gentle short double-coat shampoo",grooming:"rubber curry brush and small undercoat rake",bed:"medium durable washable bed or 36 in (91 cm) crate"}
    }
  ];

  for (const breed of EXTRA_BREEDS_2) {
    if (!BREEDS.some(existing => existing.id === breed.id)) BREEDS.push(breed);
  }
})();