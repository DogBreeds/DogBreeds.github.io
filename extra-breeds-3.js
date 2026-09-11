(() => {
  if (typeof BREEDS === "undefined") return;

  const EXTRA_BREEDS_3 = [
    {
      id:"norwegian-elkhound", name:"Norwegian Elkhound", size:"medium", category:"Norwegian Elkhound", photo:"Norwegian Elkhound 1.jpg", petfinder:"norwegian-elkhound",
      profile:{energy:4,experience:2,exercise:4,grooming:3,shedding:5,apartment:2,children:4,working:4},
      facts:{weight:"48–55 lb (22–25 kg)",height:"19.5–20.5 in (50–52 cm)",lifespan:"12–15 years",coat:"Dense, weather-resistant gray double coat",purpose:"Tracking and holding large game such as moose",exercise:"About 1.5 hours/day plus scent work, hiking or training",weightMale:"About 55 lb (25 kg)",weightFemale:"About 48 lb (22 kg)",heightMale:"About 20.5 in (52 cm)",heightFemale:"About 19.5 in (50 cm)"},
      stats:{trainability:76,energy:84,exercise:82,stimulation:84,sociability:78,independence:82,shedding:96,grooming:62,barking:90},
      disadvantages:["Norwegian Elkhounds are independent hunting dogs and may not show the automatic handler focus of a retriever or herding breed.","They were bred to locate game and bark persistently, so vocal behavior can be substantial and requires realistic expectations.","The dense double coat sheds extremely heavily, particularly during seasonal coat blow.","Hip dysplasia and inherited eye disorders are among the health issues worth screening for in the breed."],
      products:{harness:"medium-large secure Y-front harness, roughly 22–32 in (56–81 cm) chest",shampoo:"double-coat deshedding shampoo",grooming:"undercoat rake, long-pin slicker and metal comb",bed:"medium-large supportive bed or 36–42 in (91–107 cm) crate"}
    },
    {
      id:"finnish-spitz", name:"Finnish Spitz", size:"medium", category:"Finnish Spitz", photo:"Finnishspitz1.jpg", petfinder:"finnish-spitz",
      profile:{energy:4,experience:2,exercise:4,grooming:3,shedding:5,apartment:2,children:4,working:4},
      facts:{weight:"20–33 lb (9–15 kg)",height:"15.5–20 in (39–51 cm)",lifespan:"13–15 years",coat:"Plush golden-red double coat",purpose:"Locating game birds and indicating them by barking",exercise:"About 1–1.5 hours/day plus active play and training",weightMale:"25–33 lb (11–15 kg)",weightFemale:"20–25 lb (9–11 kg)",heightMale:"17.5–20 in (44–51 cm)",heightFemale:"15.5–18 in (39–46 cm)"},
      stats:{trainability:72,energy:84,exercise:82,stimulation:86,sociability:78,independence:80,shedding:94,grooming:58,barking:100},
      disadvantages:["Finnish Spitz were deliberately bred to bark while hunting, so frequent vocalization is a core breed trait rather than a minor nuisance behavior.","Their hunting independence and prey drive can make off-leash reliability difficult around wildlife.","The double coat sheds heavily and needs regular brushing, particularly during seasonal coat changes.","Patellar luxation, hip problems, epilepsy and some eye disorders occur in the breed and should be discussed when evaluating health-tested lines."],
      products:{harness:"medium secure harness, roughly 19–28 in (48–71 cm) chest",shampoo:"gentle red double-coat shampoo",grooming:"slicker brush and undercoat rake",bed:"medium washable bed or 30–36 in (76–91 cm) crate"}
    },
    {
      id:"border-terrier", name:"Border Terrier", size:"small", category:"Border Terrier", photo:"A Border terrier.jpg", petfinder:"border-terrier",
      profile:{energy:4,experience:2,exercise:4,grooming:3,shedding:2,apartment:4,children:4,working:4},
      facts:{weight:"11.5–15.5 lb (5–7 kg)",height:"About 12–15 in (30–38 cm)",lifespan:"12–15 years",coat:"Harsh, wiry outer coat with dense undercoat",purpose:"Going to ground after fox alongside mounted hunts",exercise:"About 1 hour/day plus play, sniffing and training",weightMale:"13–15.5 lb (5.9–7 kg)",weightFemale:"11.5–14 lb (5.2–6.4 kg)",heightMale:"About 12–15 in (30–38 cm)",heightFemale:"About 12–15 in (30–38 cm)"},
      stats:{trainability:82,energy:84,exercise:80,stimulation:80,sociability:84,independence:70,shedding:38,grooming:62,barking:62},
      disadvantages:["Border Terriers are small but active working terriers, and many need substantially more exercise than a casual lap-dog routine provides.","Strong prey drive can make them unreliable around small animals and wildlife unless carefully managed.","A correct wiry coat is usually maintained by hand-stripping rather than simply shaving it short, which adds grooming work.","Hip problems, patellar luxation, heart disease and eye disorders are among the health issues screened for in the breed."],
      products:{harness:"small secure Y-front harness, roughly 15–22 in (38–56 cm) chest",shampoo:"wiry-coat terrier shampoo",grooming:"stripping knife, slicker brush and metal comb",bed:"small washable bed or 24–30 in (61–76 cm) crate"}
    },
    {
      id:"scottish-terrier", name:"Scottish Terrier", size:"small", category:"Scottish Terrier", photo:"0Scottish Terrier.jpg", petfinder:"scottish-terrier",
      profile:{energy:3,experience:2,exercise:3,grooming:4,shedding:2,apartment:4,children:3,working:3},
      facts:{weight:"18–22 lb (8–10 kg)",height:"About 10 in (25 cm)",lifespan:"12 years",coat:"Hard, wiry outer coat with soft dense undercoat",purpose:"Hunting rats, foxes and other vermin",exercise:"About 45–60 minutes/day plus sniffing and play",weightMale:"19–22 lb (8.6–10 kg)",weightFemale:"18–21 lb (8.2–9.5 kg)",heightMale:"About 10 in (25 cm)",heightFemale:"About 10 in (25 cm)"},
      stats:{trainability:68,energy:66,exercise:62,stimulation:72,sociability:58,independence:90,shedding:34,grooming:82,barking:68},
      disadvantages:["Scotties are famously independent and can be much less interested in repetitive obedience than breeds developed for close handler cooperation.","Terrier prey drive and digging instincts can be strong, so secure fencing and careful management around small animals matter.","Maintaining the characteristic coat and furnishings requires regular brushing plus clipping or hand-stripping.","Scottish Terriers have notable breed health risks including bladder cancer, von Willebrand disease and Scottie cramp."],
      products:{harness:"small sturdy harness, roughly 16–23 in (41–58 cm) chest",shampoo:"wiry-coat terrier shampoo",grooming:"slicker brush, metal comb and stripping or clipping tools",bed:"small supportive bed or 24–30 in (61–76 cm) crate"}
    },
    {
      id:"welsh-terrier", name:"Welsh Terrier", size:"small", category:"Welsh Terrier", photo:"Welsh Terrier.JPG", petfinder:"welsh-terrier",
      profile:{energy:4,experience:2,exercise:4,grooming:4,shedding:2,apartment:3,children:4,working:4},
      facts:{weight:"About 20 lb (9 kg)",height:"Up to 15.5 in (39 cm)",lifespan:"12–15 years",coat:"Dense, hard, wiry black-and-tan or grizzle-and-tan coat",purpose:"Hunting fox, badger and other quarry",exercise:"About 1–1.5 hours/day plus active play and training",weightMale:"About 20 lb (9 kg)",weightFemale:"About 20 lb (9 kg)",heightMale:"Up to 15.5 in (39 cm)",heightFemale:"Up to 15.5 in (39 cm)"},
      stats:{trainability:78,energy:86,exercise:84,stimulation:84,sociability:78,independence:76,shedding:32,grooming:82,barking:72},
      disadvantages:["Welsh Terriers are lively working terriers and can be too energetic or persistent for people expecting a quiet small companion.","Prey drive, digging and chasing can be strong, and reliable recall around wildlife may require extensive training and management.","The wiry coat needs frequent brushing plus clipping or hand-stripping to preserve its texture and outline.","Eye disease including glaucoma or lens problems, along with hip and thyroid issues, are among the health concerns to discuss with breeders and veterinarians."],
      products:{harness:"small-medium secure Y-front harness, roughly 17–25 in (43–64 cm) chest",shampoo:"wiry-coat terrier shampoo",grooming:"slicker brush, metal comb and stripping tools",bed:"small-medium washable bed or 30 in (76 cm) crate"}
    }
  ];

  for (const breed of EXTRA_BREEDS_3) {
    if (!BREEDS.some(existing => existing.id === breed.id)) BREEDS.push(breed);
  }
})();