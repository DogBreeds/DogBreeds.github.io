(() => {
  if (typeof BREEDS === "undefined") return;
  if (!BREEDS.some(breed => breed.id === "rough-collie")) {
    BREEDS.push({
      id:"rough-collie", name:"Rough Collie", size:"large", category:"Rough Collie", photo:"Adult Rough Collie.JPG", petfinder:"collie",
      profile:{energy:3,experience:1,exercise:3,grooming:4,shedding:4,apartment:3,children:5,working:4},
      facts:{weight:"50–75 lb (23–34 kg)",height:"22–26 in (56–66 cm)",lifespan:"12–14 years",coat:"Long, dense double coat",purpose:"Sheep herding",exercise:"About 1–1.5 hours/day",weightMale:"60–75 lb (27–34 kg)",weightFemale:"50–65 lb (23–29 kg)",heightMale:"24–26 in (61–66 cm)",heightFemale:"22–24 in (56–61 cm)"},
      stats:{trainability:90,energy:68,exercise:70,stimulation:80,sociability:88,independence:38,shedding:82,grooming:86,barking:72},
      disadvantages:[
        "The long coat needs thorough brushing, especially behind the ears and around the feathering where mats form easily.",
        "Many Rough Collies are sensitive to noise, harsh handling and chaotic environments.",
        "They can become persistent alert barkers if barking is unintentionally reinforced.",
        "Some hereditary eye disorders and drug-sensitivity genes occur in the breed and matter when choosing lines and medications."
      ],
      products:{harness:"large lightweight Y-front harness, roughly 24–34 in (61–86 cm) chest",shampoo:"Rough Collie long-coat conditioning shampoo",grooming:"long-pin slicker, pin brush and metal comb",bed:"large washable bed or 36–42 in (91–107 cm) crate"}
    });
  }

  if (typeof CURATED_GALLERY !== "undefined") {
    CURATED_GALLERY["rough-collie"] = [
      "2014 Westminster Kennel Club Dog Show (12452128984).jpg",
      "1Dog-rough-collie-portrait.jpg",
      "Collie.jpg"
    ];
  }

  if (typeof AKC_VARIATIONS !== "undefined") {
    AKC_VARIATIONS["rough-collie"] = {
      summary:"Breed-standard colors are Sable & White, Tri-Color, Blue Merle, and White.",
      colors:["Sable & White","Tri-Color","Blue Merle","White"],
      examples:[
        {label:"Sable & White",photo:"Adult Rough Collie.JPG",query:"adult sable white Rough Collie"},
        {label:"Tri-Color",query:"adult tricolor Rough Collie"},
        {label:"Blue Merle",query:"adult blue merle Rough Collie"},
        {label:"White",query:"adult white Rough Collie"}
      ]
    };
  }

  if (typeof route === "function") route();
})();
