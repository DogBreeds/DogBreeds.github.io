const app = document.getElementById("app");
const AMAZON_TAG = "YOUR-TAG-20";
const AMAZON_DOMAIN = "www.amazon.com";

const SIZE_LABELS = { small: "Small", medium: "Medium", large: "Large" };
const STAT_LABELS = {
  trainability: "Trainability",
  energy: "Energy",
  exercise: "Exercise need",
  stimulation: "Mental stimulation",
  sociability: "Sociability",
  independence: "Independence",
  shedding: "Shedding",
  grooming: "Grooming need",
  barking: "Barking tendency"
};

const AKC_VARIATIONS = {
  "labrador-retriever": {
    "summary": "Breed-standard colors are black, yellow, and chocolate.",
    "colors": [
      "Black",
      "Yellow",
      "Chocolate"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black Labrador Retriever dog",
        "photo": "Female Black Labrador Retriever.jpg"
      },
      {
        "label": "Yellow",
        "query": "adult yellow Labrador Retriever dog",
        "photo": "Labrador Retriever - Yellow.JPG"
      },
      {
        "label": "Chocolate",
        "query": "adult chocolate Labrador Retriever dog",
        "photo": "Labrador Retriever Chocolate Brown Portrait - Sam.jpg"
      }
    ],
    "slug": "labrador-retriever"
  },
  "golden-retriever": {
    "summary": "Breed-standard color descriptions are light golden, golden, and dark golden.",
    "colors": [
      "Light Golden",
      "Golden",
      "Dark Golden"
    ],
    "examples": [
      {
        "label": "Light Golden",
        "query": "adult light golden Golden Retriever dog",
        "photo": "Golden Retriever adult.jpg"
      },
      {
        "label": "Golden",
        "query": "adult golden Golden Retriever dog",
        "photo": "Golden-retriever-dog.jpg"
      },
      {
        "label": "Dark Golden",
        "query": "adult dark golden Golden Retriever dog",
        "photo": "Golden Retriever dark Parker.jpg"
      }
    ],
    "slug": "golden-retriever"
  },
  "german-shepherd-dog": {
    "summary": "The breed standard permits most colors. These are common acceptable presentations; strong, rich color is preferred. Blue and liver are serious faults, and white is disqualifying.",
    "colors": [
      "Black & Tan",
      "Black & Cream",
      "Black & Red",
      "Black & Silver",
      "Sable",
      "Solid Black",
      "Bi-Color"
    ],
    "examples": [
      {
        "label": "Black & Tan",
        "query": "adult black tan German Shepherd dog"
      },
      {
        "label": "Sable",
        "query": "adult sable German Shepherd dog"
      },
      {
        "label": "Solid Black",
        "query": "adult black German Shepherd dog"
      },
      {
        "label": "Bi-Color",
        "query": "adult bicolor German Shepherd dog"
      }
    ],
    "slug": "german-shepherd-dog"
  },
  "great-dane": {
    "summary": "The breed standard recognizes seven color varieties.",
    "colors": [
      "Black",
      "Blue",
      "Brindle",
      "Fawn",
      "Harlequin",
      "Mantle",
      "Merle"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black Great Dane dog"
      },
      {
        "label": "Blue",
        "query": "adult blue Great Dane dog",
        "photo": "Blue Great Dane.jpg"
      },
      {
        "label": "Brindle",
        "query": "adult brindle Great Dane dog"
      },
      {
        "label": "Fawn",
        "query": "adult fawn Great Dane dog"
      },
      {
        "label": "Harlequin",
        "query": "adult harlequin Great Dane dog",
        "photo": "Great Dane harlequin.JPG"
      },
      {
        "label": "Mantle",
        "query": "adult mantle Great Dane dog"
      },
      {
        "label": "Merle",
        "query": "adult merle Great Dane dog"
      }
    ],
    "slug": "great-dane"
  },
  "bernese-mountain-dog": {
    "summary": "No major separate color varieties. The standard appearance is a jet-black ground color with rich rust markings and clear white markings.",
    "colors": [
      "Black, Rust & White"
    ],
    "examples": [],
    "noVariations": true,
    "slug": "bernese-mountain-dog"
  },
  "standard-poodle": {
    "summary": "The breed standard recognizes eleven solid colors for Poodles.",
    "colors": [
      "Apricot",
      "Black",
      "Blue",
      "Brown",
      "Cream",
      "Red",
      "Silver",
      "Silver Beige",
      "White",
      "Café au Lait",
      "Gray"
    ],
    "examples": [
      {
        "label": "Apricot",
        "query": "adult apricot Standard Poodle dog"
      },
      {
        "label": "Black",
        "query": "adult black Standard Poodle dog",
        "photo": "Standard black Poodle.jpg"
      },
      {
        "label": "Blue",
        "query": "adult blue Standard Poodle dog"
      },
      {
        "label": "Brown",
        "query": "adult brown Standard Poodle dog"
      },
      {
        "label": "Cream",
        "query": "adult cream Standard Poodle dog",
        "photo": "Standard Poodle cream standing.jpg"
      },
      {
        "label": "Red",
        "query": "adult red Standard Poodle dog"
      },
      {
        "label": "Silver",
        "query": "adult silver Standard Poodle dog"
      },
      {
        "label": "Silver Beige",
        "query": "adult silver beige Standard Poodle dog"
      },
      {
        "label": "White",
        "query": "adult white Standard Poodle dog",
        "photo": "Poodle Standard.jpg"
      },
      {
        "label": "Café au Lait",
        "query": "adult cafe au lait Standard Poodle dog"
      },
      {
        "label": "Gray",
        "query": "adult gray Standard Poodle dog"
      }
    ],
    "slug": "poodle-standard"
  },
  "border-collie": {
    "summary": "The breed standard permits all colors and combinations of colors and markings, with no color or pattern preferred. It also recognizes rough and smooth coats.",
    "colors": [
      "All colors and combinations permitted"
    ],
    "coatTypes": [
      "Rough coat",
      "Smooth coat"
    ],
    "examples": [
      {
        "label": "Black & White",
        "query": "adult black white Border Collie dog",
        "photo": "Black and white border collie.jpg"
      },
      {
        "label": "Red & White",
        "query": "adult red white Border Collie dog"
      },
      {
        "label": "Blue Merle",
        "query": "adult blue merle Border Collie dog",
        "photo": "Border collie blue merle.jpg"
      },
      {
        "label": "Tricolor",
        "query": "adult tricolor Border Collie dog"
      },
      {
        "label": "Rough Coat",
        "query": "adult rough coat Border Collie dog"
      },
      {
        "label": "Smooth Coat",
        "query": "adult smooth coat Border Collie dog"
      }
    ],
    "slug": "border-collie"
  },
  "australian-shepherd": {
    "summary": "Breed-standard base colors are black, blue merle, red, and red merle. They may appear with or without white markings and/or tan points.",
    "colors": [
      "Black",
      "Blue Merle",
      "Red",
      "Red Merle"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black Australian Shepherd dog"
      },
      {
        "label": "Blue Merle",
        "query": "adult blue merle Australian Shepherd dog",
        "photo": "Australian Shepherd Blue Merle.jpg"
      },
      {
        "label": "Red",
        "query": "adult red Australian Shepherd dog"
      },
      {
        "label": "Red Merle",
        "query": "adult red merle Australian Shepherd dog"
      }
    ],
    "slug": "australian-shepherd"
  },
  "beagle": {
    "summary": "The breed standard permits any true hound color. Merle and brindle are not accepted. These are representative examples rather than an exhaustive color list.",
    "colors": [
      "Any true hound color"
    ],
    "examples": [
      {
        "label": "Black, Tan & White",
        "query": "adult tricolor Beagle dog"
      },
      {
        "label": "Lemon & White",
        "query": "adult lemon white Beagle dog"
      },
      {
        "label": "Red & White",
        "query": "adult red white Beagle dog"
      },
      {
        "label": "Blue, Tan & White",
        "query": "adult blue tan white Beagle dog"
      }
    ],
    "slug": "beagle"
  },
  "english-cocker-spaniel": {
    "summary": "The breed standard includes solid colors, parti-colors, roans, and some tan-point combinations.",
    "colors": [
      "Black",
      "Liver",
      "Red / Golden",
      "Black & Tan",
      "Liver & Tan",
      "Black & White",
      "Liver & White",
      "Red & White",
      "Orange & White",
      "Blue Roan",
      "Liver Roan",
      "Orange Roan"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black English Cocker Spaniel dog"
      },
      {
        "label": "Golden / Red",
        "query": "adult golden English Cocker Spaniel dog"
      },
      {
        "label": "Blue Roan",
        "query": "adult blue roan English Cocker Spaniel dog"
      },
      {
        "label": "Orange Roan",
        "query": "adult orange roan English Cocker Spaniel dog"
      },
      {
        "label": "Liver Roan",
        "query": "adult liver roan English Cocker Spaniel dog"
      },
      {
        "label": "Parti-color",
        "query": "adult black white English Cocker Spaniel dog"
      }
    ],
    "slug": "english-cocker-spaniel"
  },
  "shiba-inu": {
    "summary": "Breed-standard colors are red, black and tan, and sesame. Cream occurs in the breed but is not a standard show color.",
    "colors": [
      "Red",
      "Black & Tan",
      "Sesame"
    ],
    "examples": [
      {
        "label": "Red",
        "query": "adult red Shiba Inu dog"
      },
      {
        "label": "Black & Tan",
        "query": "adult black tan Shiba Inu dog"
      },
      {
        "label": "Sesame",
        "query": "adult sesame Shiba Inu dog"
      }
    ],
    "slug": "shiba-inu"
  },
  "siberian-husky": {
    "summary": "The breed standard recognizes six base color families, with a wide range of white markings and shading.",
    "colors": [
      "Black",
      "Gray",
      "Agouti",
      "Sable",
      "Red",
      "White"
    ],
    "examples": [
      {
        "label": "Black & White",
        "query": "adult black white Siberian Husky dog"
      },
      {
        "label": "Gray & White",
        "query": "adult gray white Siberian Husky dog"
      },
      {
        "label": "Red & White",
        "query": "adult red white Siberian Husky dog"
      },
      {
        "label": "Agouti",
        "query": "adult agouti Siberian Husky dog"
      },
      {
        "label": "Sable",
        "query": "adult sable Siberian Husky dog"
      },
      {
        "label": "White",
        "query": "adult white Siberian Husky dog"
      }
    ],
    "slug": "siberian-husky"
  },
  "dachshund": {
    "summary": "The breed standard recognizes three coat varieties plus multiple colors and patterns.",
    "colors": [
      "Red",
      "Cream",
      "Black & Tan",
      "Black & Cream",
      "Chocolate & Tan",
      "Wild Boar",
      "Dapple",
      "Brindle",
      "Piebald",
      "Sable"
    ],
    "coatTypes": [
      "Smooth",
      "Longhaired",
      "Wirehaired"
    ],
    "examples": [
      {
        "label": "Smooth",
        "query": "adult smooth Dachshund dog",
        "photo": "Dachshund smooth.JPG"
      },
      {
        "label": "Longhaired",
        "query": "adult longhaired Dachshund dog"
      },
      {
        "label": "Wirehaired",
        "query": "adult wirehaired Dachshund dog"
      },
      {
        "label": "Red",
        "query": "adult red Dachshund dog"
      },
      {
        "label": "Black & Tan",
        "query": "adult black tan Dachshund dog"
      },
      {
        "label": "Dapple",
        "query": "adult dapple Dachshund dog"
      }
    ],
    "slug": "dachshund"
  },
  "cavalier-king-charles-spaniel": {
    "summary": "The breed standard recognizes four color varieties.",
    "colors": [
      "Blenheim",
      "Tricolor",
      "Ruby",
      "Black & Tan"
    ],
    "examples": [
      {
        "label": "Blenheim",
        "query": "adult Blenheim Cavalier King Charles Spaniel dog"
      },
      {
        "label": "Tricolor",
        "query": "adult tricolor Cavalier King Charles Spaniel dog"
      },
      {
        "label": "Ruby",
        "query": "adult ruby Cavalier King Charles Spaniel dog"
      },
      {
        "label": "Black & Tan",
        "query": "adult black tan Cavalier King Charles Spaniel dog"
      }
    ],
    "slug": "cavalier-king-charles-spaniel"
  },
  "miniature-schnauzer": {
    "summary": "The breed standard recognizes three colors for Miniature Schnauzers.",
    "colors": [
      "Salt & Pepper",
      "Black & Silver",
      "Solid Black"
    ],
    "examples": [
      {
        "label": "Salt & Pepper",
        "query": "adult salt pepper Miniature Schnauzer dog"
      },
      {
        "label": "Black & Silver",
        "query": "adult black silver Miniature Schnauzer dog",
        "photo": "Miniature schnauzer blackandsilver.jpg"
      },
      {
        "label": "Solid Black",
        "query": "adult black Miniature Schnauzer dog"
      }
    ],
    "slug": "miniature-schnauzer"
  },
  "pomeranian": {
    "summary": "The breed standard permits a very broad range of colors, patterns, and variations, judged on an equal basis. Representative examples are shown.",
    "colors": [
      "All colors, patterns, and variations permitted"
    ],
    "examples": [
      {
        "label": "Orange",
        "query": "adult orange Pomeranian dog"
      },
      {
        "label": "Cream",
        "query": "adult cream Pomeranian dog"
      },
      {
        "label": "Black",
        "query": "adult black Pomeranian dog"
      },
      {
        "label": "Wolf Sable",
        "query": "adult wolf sable Pomeranian dog"
      },
      {
        "label": "Chocolate",
        "query": "adult chocolate Pomeranian dog"
      },
      {
        "label": "Black & Tan",
        "query": "adult black tan Pomeranian dog"
      }
    ],
    "slug": "pomeranian"
  },
  "pembroke-welsh-corgi": {
    "summary": "Breed-standard colors are red, sable, fawn, and black and tan, with or without white markings.",
    "colors": [
      "Red",
      "Sable",
      "Fawn",
      "Black & Tan"
    ],
    "examples": [
      {
        "label": "Red & White",
        "query": "adult red white Pembroke Welsh Corgi dog"
      },
      {
        "label": "Sable",
        "query": "adult sable Pembroke Welsh Corgi dog"
      },
      {
        "label": "Fawn",
        "query": "adult fawn Pembroke Welsh Corgi dog"
      },
      {
        "label": "Black & Tan / Tricolor",
        "query": "adult tricolor Pembroke Welsh Corgi dog"
      }
    ],
    "slug": "pembroke-welsh-corgi"
  },
  "newfoundland": {
    "summary": "The breed standard recognizes four colors for Newfoundlands.",
    "colors": [
      "Black",
      "Brown",
      "Gray",
      "White & Black"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black Newfoundland dog"
      },
      {
        "label": "Brown",
        "query": "adult brown Newfoundland dog",
        "photo": "AdultBrownNewfoundlandDog.jpg"
      },
      {
        "label": "Gray",
        "query": "adult gray Newfoundland dog"
      },
      {
        "label": "White & Black",
        "query": "adult white black Landseer Newfoundland dog"
      }
    ],
    "slug": "newfoundland"
  },
  "doberman-pinscher": {
    "summary": "The breed standard recognizes four color varieties, each with rust markings.",
    "colors": [
      "Black & Rust",
      "Red & Rust",
      "Blue & Rust",
      "Fawn (Isabella) & Rust"
    ],
    "examples": [
      {
        "label": "Black & Rust",
        "query": "adult black rust Doberman Pinscher dog"
      },
      {
        "label": "Red & Rust",
        "query": "adult red rust Doberman Pinscher dog"
      },
      {
        "label": "Blue & Rust",
        "query": "adult blue rust Doberman Pinscher dog"
      },
      {
        "label": "Fawn & Rust",
        "query": "adult fawn Isabella rust Doberman Pinscher dog"
      }
    ],
    "slug": "doberman-pinscher"
  },
  "boxer": {
    "summary": "Breed-standard colors are fawn and brindle. White is a marking, not a separate color variety.",
    "colors": [
      "Fawn",
      "Brindle"
    ],
    "examples": [
      {
        "label": "Fawn",
        "query": "adult fawn Boxer dog",
        "photo": "(2)FawnBoxerBrewskii.jpg"
      },
      {
        "label": "Brindle",
        "query": "adult brindle Boxer dog",
        "photo": "1. Brindle boxer dog, female.jpg"
      }
    ],
    "slug": "boxer"
  },
  "rottweiler": {
    "summary": "No major separate color varieties. The standard calls for black with clearly defined rust-to-mahogany markings.",
    "colors": [
      "Black with rust / mahogany markings"
    ],
    "examples": [],
    "noVariations": true,
    "slug": "rottweiler"
  },
  "greyhound": {
    "summary": "The breed standard says color is immaterial, so Greyhounds can appear in essentially any color. Representative examples are shown.",
    "colors": [
      "Any color permitted"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black Greyhound dog"
      },
      {
        "label": "Brindle",
        "query": "adult brindle Greyhound dog"
      },
      {
        "label": "Fawn",
        "query": "adult fawn Greyhound dog"
      },
      {
        "label": "Blue",
        "query": "adult blue Greyhound dog"
      }
    ],
    "slug": "greyhound"
  },
  "australian-cattle-dog": {
    "summary": "The breed standard recognizes blue and red-speckled families with specific mottled or speckled presentations and permitted markings.",
    "colors": [
      "Blue",
      "Blue Mottled",
      "Blue Speckled",
      "Red Speckled"
    ],
    "examples": [
      {
        "label": "Blue",
        "query": "adult blue Australian Cattle Dog"
      },
      {
        "label": "Blue Mottled",
        "query": "adult blue mottled Australian Cattle Dog"
      },
      {
        "label": "Blue Speckled",
        "query": "adult blue speckled Australian Cattle Dog"
      },
      {
        "label": "Red Speckled",
        "query": "adult red speckled Australian Cattle Dog",
        "photo": "AustrCattleDogRed wb.jpg"
      }
    ],
    "slug": "australian-cattle-dog"
  },
  "english-springer-spaniel": {
    "summary": "The breed standard permits black or liver with white, the reverse combinations, blue or liver roan, and tricolor combinations with tan markings.",
    "colors": [
      "Black & White",
      "Liver & White",
      "Blue Roan",
      "Liver Roan",
      "Tricolor"
    ],
    "examples": [
      {
        "label": "Black & White",
        "query": "adult black white English Springer Spaniel dog"
      },
      {
        "label": "Liver & White",
        "query": "adult liver white English Springer Spaniel dog"
      },
      {
        "label": "Blue Roan",
        "query": "adult blue roan English Springer Spaniel dog"
      },
      {
        "label": "Liver Roan",
        "query": "adult liver roan English Springer Spaniel dog"
      },
      {
        "label": "Tricolor",
        "query": "adult tricolor English Springer Spaniel dog"
      }
    ],
    "slug": "english-springer-spaniel"
  },
  "brittany": {
    "summary": "Breed-standard colors are orange and white or liver and white, in clear or roan patterns. Tricolor is permitted; black is disqualifying.",
    "colors": [
      "Orange & White",
      "Liver & White",
      "Orange Roan",
      "Liver Roan",
      "Tricolor"
    ],
    "examples": [
      {
        "label": "Orange & White",
        "query": "adult orange white Brittany Spaniel dog"
      },
      {
        "label": "Liver & White",
        "query": "adult liver white Brittany Spaniel dog"
      },
      {
        "label": "Orange Roan",
        "query": "adult orange roan Brittany Spaniel dog"
      },
      {
        "label": "Liver Roan",
        "query": "adult liver roan Brittany Spaniel dog"
      },
      {
        "label": "Tricolor",
        "query": "adult tricolor Brittany Spaniel dog"
      }
    ],
    "slug": "brittany"
  },
  "basenji": {
    "summary": "The breed standard recognizes four color patterns, all with white feet, chest, and tail tip.",
    "colors": [
      "Chestnut Red & White",
      "Black & White",
      "Black, Tan & White",
      "Brindle & White"
    ],
    "examples": [
      {
        "label": "Chestnut Red & White",
        "query": "adult red white Basenji dog",
        "photo": "Basenji red & white 1.jpg"
      },
      {
        "label": "Black & White",
        "query": "adult black white Basenji dog",
        "photo": "Basenji-b&w.jpg"
      },
      {
        "label": "Black, Tan & White",
        "query": "adult tricolor Basenji dog"
      },
      {
        "label": "Brindle & White",
        "query": "adult brindle Basenji dog"
      }
    ],
    "slug": "basenji"
  },
  "whippet": {
    "summary": "The breed standard says color is immaterial. Representative examples are shown.",
    "colors": [
      "Any color permitted"
    ],
    "examples": [
      {
        "label": "Brindle",
        "query": "adult brindle Whippet dog"
      },
      {
        "label": "Fawn",
        "query": "adult fawn Whippet dog"
      },
      {
        "label": "Black",
        "query": "adult black Whippet dog"
      },
      {
        "label": "Blue",
        "query": "adult blue Whippet dog"
      }
    ],
    "slug": "whippet"
  },
  "havanese": {
    "summary": "The breed standard permits all colors and marking patterns. Representative examples are shown.",
    "colors": [
      "All colors and marking patterns permitted"
    ],
    "examples": [
      {
        "label": "Black",
        "query": "adult black Havanese dog"
      },
      {
        "label": "White",
        "query": "adult white Havanese dog"
      },
      {
        "label": "Chocolate",
        "query": "adult chocolate Havanese dog"
      },
      {
        "label": "Sable",
        "query": "adult sable Havanese dog"
      }
    ],
    "slug": "havanese"
  },
  "bichon-frise": {
    "summary": "No major separate color varieties. White is the standard color. Limited cream, buff, or apricot shading can occur, especially around the ears.",
    "colors": [
      "White"
    ],
    "examples": [],
    "noVariations": true,
    "slug": "bichon-frise"
  },
  "papillon": {
    "summary": "The breed standard uses a white base with patches of any color. Both erect-ear Papillons and drop-ear Phalènes are accepted.",
    "colors": [
      "White with patches of any color"
    ],
    "coatTypes": [
      "Papillon: erect ears",
      "Phalène: drop ears"
    ],
    "examples": [
      {
        "label": "Sable & White",
        "query": "adult sable white Papillon dog"
      },
      {
        "label": "Black & White",
        "query": "adult black white Papillon dog"
      },
      {
        "label": "Red & White",
        "query": "adult red white Papillon dog"
      },
      {
        "label": "Tricolor",
        "query": "adult tricolor Papillon dog"
      },
      {
        "label": "Phalène",
        "query": "adult Phalene dog"
      }
    ],
    "slug": "papillon"
  },
  "jack-russell-terrier": {
    "summary": "In the AKC standard this breed is called the Russell Terrier. White must predominate, with black and/or tan markings; coats may be smooth, broken, or rough.",
    "colors": [
      "White & Tan",
      "White & Black",
      "White, Black & Tan"
    ],
    "coatTypes": [
      "Smooth",
      "Broken",
      "Rough"
    ],
    "examples": [
      {
        "label": "White & Tan",
        "query": "adult white tan Russell Terrier dog"
      },
      {
        "label": "Tricolor",
        "query": "adult tricolor Russell Terrier dog"
      },
      {
        "label": "Smooth Coat",
        "query": "adult smooth coat Russell Terrier dog"
      },
      {
        "label": "Rough Coat",
        "query": "adult rough coat Russell Terrier dog"
      }
    ],
    "slug": "russell-terrier"
  },
  "maltese": {
    "summary": "No major separate color varieties. Pure white is the standard color; light tan or lemon on the ears is permissible but undesirable.",
    "colors": [
      "Pure White"
    ],
    "examples": [],
    "noVariations": true,
    "slug": "maltese"
  },

  "samoyed": {
    "summary": "Standard colors are pure white, cream, biscuit, and white with biscuit.",
    "colors": ["White", "Cream", "Biscuit", "White & Biscuit"],
    "examples": [
      {"label":"White", "query":"white adult Samoyed dog", "photo":"Samoyed dog two year old female dllu.jpg"},
      {"label":"Cream", "query":"cream adult Samoyed dog"},
      {"label":"Biscuit", "query":"biscuit adult Samoyed dog"},
      {"label":"White & Biscuit", "query":"white biscuit adult Samoyed dog"}
    ],
    "slug": "samoyed"
  },
  "dalmatian": {
    "summary": "Dalmatians are white with either black spots or liver spots. The two spot colors do not occur together in the standard coat.",
    "colors": ["Black spotted", "Liver spotted"],
    "examples": [
      {"label":"Black spotted", "query":"black spotted adult Dalmatian dog", "photo":"DalmatianBlackSpotted.jpg"},
      {"label":"Liver spotted", "query":"liver spotted adult Dalmatian dog", "photo":"Dalmatian liver stacked.jpg"}
    ],
    "slug": "dalmatian"
  }
,
  "irish-setter": {
    "summary": "Breed-standard coat colors are rich red shades, commonly described as mahogany, chestnut, or red.",
    "colors": ["Mahogany", "Chestnut", "Red"],
    "examples": [
      {"label":"Mahogany", "query":"adult mahogany Irish Setter dog", "photo":"Irish Setter in Tallinn 2.JPG"},
      {"label":"Chestnut", "query":"adult chestnut Irish Setter dog"},
      {"label":"Red", "query":"adult red Irish Setter dog"}
    ]
  },
  "weimaraner": {
    "summary": "The breed-standard coat is solid gray in shades from mouse-gray through silver-gray. Distinctly blue or black coats are disqualifying under the AKC standard.",
    "colors": ["Mouse Gray", "Gray", "Silver Gray"],
    "examples": [
      {"label":"Mouse Gray", "query":"adult mouse gray Weimaraner dog"},
      {"label":"Gray", "query":"adult gray Weimaraner dog", "photo":"Weimaraner Freika-2.jpg"},
      {"label":"Silver Gray", "query":"adult silver gray Weimaraner dog"}
    ]
  },
  "rhodesian-ridgeback": {
    "summary": "There are no separate standard color varieties. The coat ranges from light wheaten to red wheaten.",
    "colors": ["Light Wheaten to Red Wheaten"],
    "examples": [],
    "noVariations": true
  },
  "alaskan-malamute": {
    "summary": "The standard allows a broad range from light gray through black, sable and red, generally combined with white. The only permitted solid color is all white.",
    "colors": ["Gray & White", "Black & White", "Sable & White", "Red & White", "Agouti & White", "All White"],
    "examples": [
      {"label":"Gray & White", "query":"adult gray white Alaskan Malamute dog", "photo":"AlaskanMalamuteDog.jpg"},
      {"label":"Black & White", "query":"adult black white Alaskan Malamute dog"},
      {"label":"Sable & White", "query":"adult sable white Alaskan Malamute dog"},
      {"label":"Red & White", "query":"adult red white Alaskan Malamute dog", "photo":"Alaska Malamut Rot Braun.jpg"},
      {"label":"Agouti & White", "query":"adult agouti white Alaskan Malamute dog"},
      {"label":"All White", "query":"adult all white Alaskan Malamute dog"}
    ]
  },
  "vizsla": {
    "summary": "There are no separate standard color varieties. The breed-standard coat is shaded golden rust.",
    "colors": ["Shaded Golden Rust"],
    "examples": [],
    "noVariations": true
  },
  "portuguese-water-dog": {
    "summary": "Standard coats can be black, white, or brown, including black-and-white and brown-and-white combinations. Curly and wavy coats are both correct.",
    "colors": ["Black", "White", "Brown", "Black & White", "Brown & White"],
    "coatTypes": ["Curly", "Wavy"],
    "examples": [
      {"label":"Black", "query":"adult black Portuguese Water Dog"},
      {"label":"White", "query":"adult white Portuguese Water Dog"},
      {"label":"Brown", "query":"adult brown Portuguese Water Dog"},
      {"label":"Black & White", "query":"adult black white Portuguese Water Dog", "photo":"A Portuguese Water Dog.jpg"},
      {"label":"Brown & White", "query":"adult brown white Portuguese Water Dog"},
      {"label":"Curly Coat", "query":"adult curly Portuguese Water Dog"},
      {"label":"Wavy Coat", "query":"adult wavy Portuguese Water Dog"}
    ]
  },
  "shetland-sheepdog": {
    "summary": "Standard presentations are based on sable, black, and blue-merle coats with permitted white and/or tan markings.",
    "colors": ["Sable", "Tricolor", "Bi-Black", "Blue Merle", "Bi-Blue"],
    "examples": [
      {"label":"Sable", "query":"adult sable Shetland Sheepdog", "photo":"A Shetland Sheepdog.jpg"},
      {"label":"Tricolor", "query":"adult tricolor Shetland Sheepdog"},
      {"label":"Bi-Black", "query":"adult bi black Shetland Sheepdog"},
      {"label":"Blue Merle", "query":"adult blue merle Shetland Sheepdog"},
      {"label":"Bi-Blue", "query":"adult bi blue Shetland Sheepdog"}
    ]
  },
  "west-highland-white-terrier": {
    "summary": "There are no separate standard color varieties. The standard coat color is white.",
    "colors": ["White"],
    "examples": [],
    "noVariations": true
  },
  "yorkshire-terrier": {
    "summary": "There are no separate standard color varieties in the adult breed standard. The characteristic adult coat is dark steel blue with rich tan/gold in specified areas.",
    "colors": ["Dark Steel Blue & Tan/Gold"],
    "examples": [],
    "noVariations": true
  },
  "chihuahua": {
    "summary": "Any color is permitted, solid, marked, or splashed. Chihuahuas also have two recognized coat varieties: Smooth Coat and Long Coat.",
    "colors": ["Any solid, marked, or splashed color"],
    "coatTypes": ["Smooth Coat", "Long Coat"],
    "examples": [
      {"label":"Smooth Coat", "query":"adult smooth coat Chihuahua dog", "photo":"Standard razza chihuahua.jpg"},
      {"label":"Long Coat", "query":"adult long coat Chihuahua dog"},
      {"label":"Fawn", "query":"adult fawn Chihuahua dog"},
      {"label":"Black & Tan", "query":"adult black tan Chihuahua dog"}
    ]
  }


};

const CURATED_GALLERY = {
  "labrador-retriever": [
    "Female Black Labrador Retriever.jpg",
    "Labrador Retriever Chocolate Brown Portrait - Sam.jpg",
    "Labrador Retriever - Yellow.JPG"
  ],
  "golden-retriever": [
    "Golden Retriever adult.jpg",
    "GoldenRetrieverStanding.JPG",
    "Golden Retriever dark Parker.jpg"
  ],
  "german-shepherd-dog": [
    "20110425 German Shepherd Dog 8505.jpg",
    "Grauer Deutscher Schäferhund Standbild.jpg",
    "Adult male German shepherd dog standing at the beach (retouched).jpg"
  ],
  "great-dane": [
    "Great Dane harlequin.JPG",
    "Blue Great Dane.jpg",
    "Great dane blue (full).JPG"
  ],
  "bernese-mountain-dog": [
    "1-BerneseMountainDogInGrass.jpg",
    "Benský salašnický pes.JPG",
    "Bernaise Mountain Dog at the Byward Market (35463428200).jpg"
  ],
  "standard-poodle": [
    "Red Standard Poodle.jpg",
    "Standard black Poodle.jpg",
    "Poodle Standard.jpg"
  ],
  "border-collie": [
    "Black and white border collie.jpg",
    "BorderCol4.jpg",
    "Border Collie blue merle.jpg"
  ],
  "australian-shepherd": [
    "A typical example of an Australian Shepherd .jpg",
    "Aspen 2.jpg",
    "Australian Shepherd Red bi.jpg"
  ],
  "beagle": [
    "Beagle Upsy.jpg",
    "Bronco the Beagle.JPG",
    "2013 Westminster Kennel Club Dog Show (8467552472).jpg"
  ],
  "english-cocker-spaniel": [
    "\\\"Bill\\\" - Cocker spaniel anglais 1.jpg",
    "\\\"Bill\\\" - Cocker spaniel anglais 2.JPG",
    "\\\"Bill\\\" - Cocker spaniel anglais 3.jpg"
  ],
  "shiba-inu": [
    "1Shiba Inu Kazumi.jpg",
    "2008-01-13 a Shiba Inu in Tainan.jpg",
    "2011-04-02 a Shiba Inu in Japan.jpg"
  ],
  "siberian-husky": [
    "3217-siberian-husky-dog (20314366700).jpg",
    "3218-siberian-husky-dog (19881570453).jpg",
    "Black-Magic-Big-Boy.jpg"
  ],
  "dachshund": [
    "Dachshund in snow.jpg",
    "Long-haired dachshund standing.jpg",
    "Dachshund smooth.JPG"
  ],
  "cavalier-king-charles-spaniel": [
    "A Cavalier King Charles Spaniel.jpg",
    "Charybdis - Cavalier King Charles Spaniel.jpg",
    "52 Weeks for Dogs.jpg"
  ],
  "miniature-schnauzer": [
    "20080420 LunaHallett (cropped).jpg",
    "Miniature Schnauzer.jpg",
    "Miniature schnauzer blackandsilver.jpg"
  ],
  "pomeranian": [
    "01Particolor Pomeranian Dog Show.jpg",
    "2013 Westminster Kennel Club Dog Show- Pomeranian (8465558461).jpg",
    "2013 Westminster Kennel Club Dog Show- Pomeranian (8466654876).jpg"
  ],
  "pembroke-welsh-corgi": [
    "2 year old male corgi.jpg",
    "Arwen, Corgi.jpg",
    "Champion Dog Show Pembroke Welsh Corgi1.jpg"
  ],
  "newfoundland": [
    "AdultBrownNewfoundlandDog.jpg",
    "Newfoundland dog.jpg",
    "Newfoundland Dog - BAZYL - 001.jpg"
  ],
  "doberman-pinscher": [
    "01. Adult Dobermann.jpg",
    "03 Dobermann sitstay.jpg",
    "1. Dobermann in Tallinn 2.jpg"
  ],
  "boxer": [
    "Standing dog.jpg",
    "Male fawn Boxer undocked.jpg",
    "1. Brindle boxer dog, female.jpg"
  ],
  "rottweiler": [
    "\\\"Prince\\\" (6302921969).jpg",
    "\\\"Prince\\\" (7216225820).jpg",
    "New Pose - panoramio.jpg"
  ],
  "greyhound": [
    "131211-N-IK388-054 (11421093945).jpg",
    "1A1182101LIV003 (15387912246).jpg",
    "1986 greyhound Fearless Action.jpg"
  ],
  "australian-cattle-dog": [
    "\\\"Bender\\\" Australian Cattle Dog Creeping Legend.jpg",
    "ACD MK Mishak.JPG",
    "ACD Multi Ch. Silverbarn's Naava.jpg"
  ],
  "english-springer-spaniel": [
    "2 Year Old Black and White Springer Spaniel.jpg",
    "'Harvey' the Springer Spaniel is an Arms Explosive Search (AES) dog, currently serving in Afghanistan MOD 45148184.jpg",
    "2016 Sophienquelle 01.jpg"
  ],
  "brittany": [
    "American Brittany standing.jpg",
    "American Brittany.jpg",
    "2013 Westminster Kennel Club Dog Show- Brittany (8467940341).jpg"
  ],
  "basenji": [
    "A basenji.jpg",
    "2008-01-16 Jalo.jpg",
    "2008-05-01 a Basenji 01.jpg"
  ],
  "whippet": [
    "Whippet1.jpg",
    "Whippet fawn.jpg",
    "A whippet in the forests of Sweden.jpg"
  ],
  "havanese": [
    "A Havanese judging.jpg",
    "Bichon de la Habana.jpg",
    "Bichon Habanero.JPG"
  ],
  "bichon-frise": [
    "Bichon Frisé standing.jpg",
    "Bichon Frisé 0017.jpg",
    "Bichon Frisé.jpg"
  ],
  "papillon": [
    "1 Papillon.jpg",
    "A Papillon.jpg",
    "2014 Westminster Kennel Club Dog Show (12451796923).jpg"
  ],
  "jack-russell-terrier": [
    "'A Jack Russell Terrier in the snow'. Squaddie in a field near Belvoir Castle - Dec 2005.JPG",
    "08115455 JRT braun glatt.jpg",
    "A found Jack Russell Terrier.jpg"
  ],
  "maltese": [
    "Maltese dog.jpg",
    "Maltese Dogs.jpeg",
    "01 AKC Maltese Dog Show 2013.jpg"
  ],
  "samoyed": [
    "Samoyed MoMo.jpg",
    "Sitting Samoyed.jpg",
    "Samoyedmale.jpg"
  ],

  "dalmatian": [
    "Dalmatian liver stacked.jpg",
    "Dalmatiner 3.jpg",
    "Dallu2.jpg"
  ],
  "irish-setter": [],
  "weimaraner": [],
  "rhodesian-ridgeback": [],
  "alaskan-malamute": ["Alaskan malamute 2021.jpg", "AlaskanMalamute.jpg", "Alaskan malamut 465.jpg"],
  "vizsla": [],
  "portuguese-water-dog": ["A Portuguese Water Dog.jpg", "Portuguese Water Dog Image 001.jpg"],
  "shetland-sheepdog": ["Shetland sheepdog.jpg", "Shetland Sheepdog.jpg", "Shetland Sheepdog.JPG"],
  "west-highland-white-terrier": ["A Westie Adult.jpg", "WestHighlandWhiteTerrier.JPG", "West-highland-white-terrier-dog.jpg"],
  "yorkshire-terrier": ["Yorkshireterrierbowie.JPG"],
  "chihuahua": []
};

const primaryPhotoCache = new Map();

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function inverse5(n) { return (6 - clamp(Number(n) || 3, 1, 5)) / 5; }
function norm5(n) { return clamp(Number(n) || 3, 1, 5) / 5; }
function inverse100(n) { return (100 - clamp(Number(n) || 50, 0, 100)) / 100; }
function norm100(n) { return clamp(Number(n) || 50, 0, 100) / 100; }
function target5(n, target, spread = 2) { return clamp(1 - Math.abs((Number(n) || 3) - target) / spread, 0, 1); }
function avg(values) { return values.length ? values.reduce((a,b) => a + b, 0) / values.length : 0.5; }

function commonsImage(fileName, width = 1200) {
  if (!fileName) return "";
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}?width=${width}`;
}

function commonsPage(fileName) {
  if (!fileName) return "https://commons.wikimedia.org/";
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replaceAll(" ", "_"))}`;
}

function commonsCategoryPage(category) {
  return `https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(String(category).replaceAll(" ", "_"))}`;
}

function amazonSearch(query) {
  const url = new URL(`https://${AMAZON_DOMAIN}/s`);
  url.searchParams.set("k", query);
  if (AMAZON_TAG && AMAZON_TAG !== "YOUR-TAG-20") url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}


function breedCard(breed) {
  const initial = breed.photo
    ? `<img loading="lazy" src="${commonsImage(breed.photo, 900)}" alt="${esc(breed.name)}" data-card-img data-category="${esc(breed.category)}">`
    : `<div class="photo-placeholder" data-card-placeholder data-category="${esc(breed.category)}">Loading photo…</div>`;
  return `
    <button class="breed-card" type="button" data-breed="${esc(breed.id)}" aria-label="Open ${esc(breed.name)}">
      <div class="card-photo">${initial}</div>
      <div class="card-body">
        <div class="card-name">${esc(breed.name)}</div>
        <div class="card-size">${SIZE_LABELS[breed.size]} breed</div>
      </div>
    </button>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="home-hero">
      <div class="hero-copy">
        <h1>Find a dog that fits your life.</h1>
        <p class="lead">Dog Breed Finder is a practical guide for comparing breeds before you choose a dog. Browse directly if you already know what matters to you, use the filter for specific traits, or take the quiz if you are not sure how those traits translate into a breed.</p>
        <div class="actions hero-actions">
          <button class="primary" type="button" id="take-quiz">TAKE THE QUIZ</button>
          <button class="secondary" type="button" id="browse-all">BROWSE ALL BREEDS</button>
        </div>
      </div>
      <aside class="about-card" aria-label="How to use the site">
        <p class="section-label">Three ways to explore</p>
        <ol>
          <li><strong>Quiz</strong><span>Answer lifestyle questions and see every strong match.</span></li>
          <li><strong>Filter</strong><span>Choose exact traits when you already know what you want.</span></li>
          <li><strong>Browse</strong><span>Open Large, Medium or Small above and explore freely.</span></li>
        </ol>
      </aside>
    </section>

    <section class="quiz-stage" id="quiz-stage" hidden>
      <div class="quiz-intro">
        <p class="kicker">Breed quiz</p>
        <h2>Find breeds that fit your life.</h2>
        <p class="lead">Answer a few questions about your experience, home and everyday life. You will see the breeds that are the strongest overall matches.</p>
      </div>
      ${quizMarkup()}
    </section>

    <section class="results" id="home-results" aria-live="polite"></section>`;

  document.getElementById("take-quiz").addEventListener("click", () => {
    const stage = document.getElementById("quiz-stage");
    stage.hidden = false;
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("browse-all").addEventListener("click", () => {
    document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  setupQuiz();
  renderResults([...BREEDS].sort((a,b) => a.name.localeCompare(b.name)), "home-results", "All breeds");
}

function filterMarkup(id, preferredSize = "") {
  return `
    <details class="filter-shell" id="${id}">
      <summary>
        <span>FILTER BREEDS</span>
        <span class="filter-summary-note">optional, for direct filtering</span>
      </summary>
      <form class="filter-form" data-filter-form>
        <div class="filter-grid">
          ${filterGroup("size", "Size", [["small","Small"],["medium","Medium"],["large","Large"]], preferredSize ? [preferredSize] : [])}
          ${filterGroup("energy", "Energy", [["low","Lower"],["moderate","Moderate"],["high","High"]])}
          ${filterGroup("exercise", "Exercise need", [["light","Lighter"],["moderate","Moderate"],["high","High"]])}
          ${filterGroup("grooming", "Grooming", [["low","Lower"],["moderate","Moderate"],["high","High is fine"]])}
          ${filterGroup("shedding", "Shedding", [["low","Lower"],["moderate","Moderate"],["high","Heavy is fine"]])}
          ${filterGroup("experience", "Owner experience", [["beginner","Beginner-friendly"],["some","Some experience helpful"],["experienced","Experienced handling needed"]])}
          ${filterGroup("home", "Home fit", [["apartment","Apartment-friendly"],["space","Space preferred"]])}
          ${filterGroup("lifestyle", "Lifestyle", [["children","Good with children"],["working","Training / sport"],["companion","Mostly companion"]])}
        </div>
        <div class="actions filter-actions">
          <button class="primary" type="submit">APPLY FILTER</button>
          <button class="secondary" type="reset">CLEAR</button>
        </div>
      </form>
    </details>`;
}

function filterGroup(key, label, options, selected = []) {
  const hasSelection = selected.length > 0;
  return `
    <fieldset class="filter-group" data-filter-group="${key}">
      <legend>${esc(label)}</legend>
      <label class="check-option none-option"><input type="checkbox" name="${key}" value="none"${hasSelection ? "" : " checked"}> <span>None</span></label>
      ${options.map(([value,text]) => `<label class="check-option"><input type="checkbox" name="${key}" value="${value}"${selected.includes(value) ? " checked" : ""}> <span>${esc(text)}</span></label>`).join("")}
    </fieldset>`;
}

function setupFilter(detailsId, resultsId, preferredSize = "", separatorId = "") {
  const details = document.getElementById(detailsId);
  if (!details) return;
  const form = details.querySelector("[data-filter-form]");
  setupNoneCheckboxes(form, "[data-filter-group]");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = collectCheckboxGroups(form, "[data-filter-group]");
    const matches = BREEDS.filter(breed => matchesFilter(breed, values));
    renderResults(matches, resultsId, "Filtered breeds");
    const separator = separatorId ? document.getElementById(separatorId) : null;
    if (separator) separator.hidden = false;
    document.getElementById(resultsId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      form.querySelectorAll("[data-filter-group]").forEach(group => {
        const key = group.dataset.filterGroup;
        group.querySelectorAll("input").forEach(input => {
          input.checked = key === "size" && preferredSize ? input.value === preferredSize : input.value === "none";
        });
      });
      const target = document.getElementById(resultsId);
      if (target) target.innerHTML = "";
      const separator = separatorId ? document.getElementById(separatorId) : null;
      if (separator) separator.hidden = true;
    }, 0);
  });
}

function collectCheckboxGroups(form, selector) {
  const result = {};
  form.querySelectorAll(selector).forEach(group => {
    const key = group.dataset.filterGroup || group.dataset.quizGroup;
    result[key] = [...group.querySelectorAll("input:checked")].map(input => input.value).filter(v => v !== "none");
  });
  return result;
}

function setupNoneCheckboxes(scope, groupSelector) {
  scope.querySelectorAll(groupSelector).forEach(group => {
    const inputs = [...group.querySelectorAll('input[type="checkbox"]')];
    const none = inputs.find(input => input.value === "none");
    if (!none) return;
    inputs.forEach(input => {
      input.addEventListener("change", () => {
        if (input === none && none.checked) {
          inputs.filter(other => other !== none).forEach(other => { other.checked = false; });
        } else if (input !== none && input.checked) {
          none.checked = false;
        }
        if (!inputs.some(other => other.checked)) none.checked = true;
      });
    });
  });
}

function matchesAny(value, tests) { return tests.some(test => test(value)); }

function matchesFilter(breed, v) {
  const p = breed.profile;
  if (v.size?.length && !v.size.includes(breed.size)) return false;
  if (v.energy?.length && !matchesAny(p.energy, v.energy.map(x => x === "low" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 4 : n => n >= 4))) return false;
  if (v.exercise?.length && !matchesAny(p.exercise, v.exercise.map(x => x === "light" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 3 : n => n >= 4))) return false;
  if (v.grooming?.length && !matchesAny(p.grooming, v.grooming.map(x => x === "low" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 3 : n => n >= 4))) return false;
  if (v.shedding?.length && !matchesAny(p.shedding, v.shedding.map(x => x === "low" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 4 : n => n >= 4))) return false;
  if (v.experience?.length) {
    const ok = v.experience.some(x => x === "beginner" ? p.experience === 1 : x === "some" ? p.experience === 2 : p.experience >= 3);
    if (!ok) return false;
  }
  if (v.home?.length) {
    const ok = v.home.some(x => x === "apartment" ? p.apartment >= 4 : p.apartment <= 3);
    if (!ok) return false;
  }
  if (v.lifestyle?.length) {
    const ok = v.lifestyle.some(x => x === "children" ? p.children >= 4 : x === "working" ? p.working >= 4 : p.working <= 3);
    if (!ok) return false;
  }
  return true;
}

function quizMarkup() {
  const steps = [
    quizRadio("experience", "How experienced are you with dogs?", [
      ["beginner","I am a beginner or this would be my first dog"],
      ["some","I have lived with or trained dogs before"],
      ["experienced","I am experienced and comfortable handling more demanding breeds"]
    ]),
    quizMulti("size", "Which dog sizes would you consider?", [
      ["small","Small"],
      ["medium","Medium"],
      ["large","Large"]
    ]),
    quizRadio("weekday", "On a busy weekday, what is realistically sustainable?", [
      ["short","A few shorter walks and some play"],
      ["hour","About an hour plus a little training or play"],
      ["long","Around 1.5 hours of real activity"],
      ["very-long","2+ hours and I am happy to plan around the dog"]
    ]),
    quizMulti("weekend", "Which Saturday plans actually sound fun with your dog?", [
      ["hike","A long hike, run or outdoor adventure"],
      ["training","Training tricks, agility or dog sport"],
      ["family","A family outing with children"],
      ["social","A café, park or social day"],
      ["quiet","A quiet day at home with a couple of walks"]
    ]),
    quizMulti("household", "Which things describe your home?", [
      ["apartment","Apartment or shared walls"],
      ["children","Young children"],
      ["visitors","Frequent visitors or a busy social household"]
    ]),
    quizMulti("dealbreakers", "Which things would genuinely bother you?", [
      ["hair","Hair around the home"],
      ["grooming","Frequent professional grooming"],
      ["noise","A lot of barking or howling"],
      ["stimulation","Needing to invent mental work every day"],
      ["independent","A dog that is very independent or tests boundaries"]
    ]),
    quizMulti("personality", "Which personalities sound appealing?", [
      ["affectionate","Very affectionate and social"],
      ["eager","Eager to learn and work with me"],
      ["independent","Independent with its own opinions"],
      ["athletic","Athletic and always ready to go"],
      ["calm","Calm and easy to live around"]
    ]),
    quizRadio("training", "How much do you want training to be part of dog ownership?", [
      ["basics","Mostly the basics; I want a forgiving dog"],
      ["regular","Regular short training sessions are fine"],
      ["hobby","Training or dog sport sounds like a hobby I would enjoy"]
    ]),
    quizRadio("ownership", "How central do you want dog ownership to be in your life?", [
      ["fits-around","The dog should mostly fit around the rest of my life"],
      ["major","The dog can be a major daily activity"],
      ["hobby","Training, sport or dog activities can be one of my main hobbies"]
    ])
  ];

  return `
    <form class="quiz-form quiz-wizard" id="quiz-form">
      <div class="quiz-progress" aria-live="polite">
        <span id="quiz-progress-text">Question 1 of ${steps.length}</span>
        <div class="quiz-progress-track"><div class="quiz-progress-fill" id="quiz-progress-fill"></div></div>
      </div>
      <div class="quiz-steps">
        ${steps.map((step, index) => `<div class="quiz-step" data-quiz-step="${index}"${index === 0 ? "" : " hidden"}>${step}</div>`).join("")}
      </div>
      <p class="quiz-validation" id="quiz-validation" aria-live="polite"></p>
      <div class="actions quiz-nav">
        <button class="secondary" type="button" id="quiz-back" hidden>BACK</button>
        <button class="primary" type="button" id="quiz-next">NEXT</button>
        <button class="primary" type="submit" id="quiz-submit" hidden>SEE MY MATCHES</button>
        <button class="link-button quiz-reset" type="reset">START OVER</button>
      </div>
    </form>`;
}

function quizMulti(key, label, options) {
  return `
    <fieldset class="question quiz-question" data-quiz-group="${key}" data-required-group>
      <legend>${esc(label)}</legend>
      <p class="select-note">Select all that apply.</p>
      <div class="choice-list">
        ${options.map(([value,text]) => `<label class="check-option"><input type="checkbox" name="quiz-${key}" value="${value}"> <span>${esc(text)}</span></label>`).join("")}
        <label class="check-option none-option"><input type="checkbox" name="quiz-${key}" value="none"> <span>None</span></label>
      </div>
    </fieldset>`;
}

function quizRadio(key, label, options) {
  return `
    <fieldset class="question quiz-question" data-radio-group="${key}" data-required-group>
      <legend>${esc(label)}</legend>
      <div class="choice-list">
        ${options.map(([value,text]) => `<label class="check-option"><input type="radio" name="quiz-${key}" value="${value}"> <span>${esc(text)}</span></label>`).join("")}
      </div>
    </fieldset>`;
}

function setupQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;
  setupNoneCheckboxes(form, "[data-quiz-group]");

  const steps = [...form.querySelectorAll("[data-quiz-step]")];
  const back = document.getElementById("quiz-back");
  const next = document.getElementById("quiz-next");
  const submit = document.getElementById("quiz-submit");
  const validation = document.getElementById("quiz-validation");
  const progressText = document.getElementById("quiz-progress-text");
  const progressFill = document.getElementById("quiz-progress-fill");
  let current = 0;

  function currentQuestionAnswered() {
    return Boolean(steps[current]?.querySelector("input:checked"));
  }

  function showStep(index, scroll = false) {
    current = clamp(index, 0, steps.length - 1);
    steps.forEach((step, i) => { step.hidden = i !== current; });
    progressText.textContent = `Question ${current + 1} of ${steps.length}`;
    progressFill.style.width = `${((current + 1) / steps.length) * 100}%`;
    back.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    submit.hidden = current !== steps.length - 1;
    validation.textContent = "";
    if (scroll) document.getElementById("quiz-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  next.addEventListener("click", () => {
    if (!currentQuestionAnswered()) {
      validation.textContent = "Choose an answer before continuing.";
      return;
    }
    showStep(current + 1, true);
  });

  back.addEventListener("click", () => showStep(current - 1, true));

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!currentQuestionAnswered()) {
      validation.textContent = "Choose an answer before seeing your matches.";
      return;
    }
    validation.textContent = "";
    const answers = readQuizAnswers(form);
    const sizePool = answers.size?.length ? BREEDS.filter(breed => answers.size.includes(breed.size)) : BREEDS;
    const scored = sizePool.map(breed => ({ breed, score: scoreBreedForQuiz(breed, answers) }));
    const matches = scored.filter(item => item.score >= 0.68).map(item => item.breed).sort((a,b) => a.name.localeCompare(b.name));
    renderResults(matches, "home-results", "Quiz matches");
    document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      renderResults([...BREEDS].sort((a,b) => a.name.localeCompare(b.name)), "home-results", "All breeds");
      showStep(0, true);
    }, 0);
  });

  showStep(0);
}

function readQuizAnswers(form) {
  const answers = {};
  form.querySelectorAll("[data-quiz-group]").forEach(group => {
    answers[group.dataset.quizGroup] = [...group.querySelectorAll("input:checked")].map(i => i.value).filter(v => v !== "none");
  });
  form.querySelectorAll("[data-radio-group]").forEach(group => {
    answers[group.dataset.radioGroup] = group.querySelector("input:checked")?.value || "";
  });
  return answers;
}

function scoreBreedForQuiz(breed, a) {
  const p = breed.profile;
  const s = breed.stats;
  const parts = [];

  if (a.experience === "beginner") parts.push(p.experience === 1 ? 1 : p.experience === 2 ? 0.65 : 0.25);
  if (a.experience === "some") parts.push(p.experience === 1 ? 1 : p.experience === 2 ? 0.95 : 0.65);
  if (a.experience === "experienced") parts.push(1);

  const weekendScores = [];
  for (const choice of a.weekend || []) {
    if (choice === "hike") weekendScores.push(avg([target5(p.energy, 5, 3), target5(p.exercise, 5, 3)]));
    if (choice === "training") weekendScores.push(avg([norm5(p.working), norm100(s.trainability), norm100(s.stimulation)]));
    if (choice === "family") weekendScores.push(avg([norm5(p.children), norm100(s.sociability)]));
    if (choice === "social") weekendScores.push(avg([norm100(s.sociability), norm5(p.apartment)]));
    if (choice === "quiet") weekendScores.push(avg([inverse5(p.energy), inverse5(p.exercise)]));
  }
  if (weekendScores.length) parts.push(avg(weekendScores));

  const dealbreakerScores = [];
  for (const choice of a.dealbreakers || []) {
    if (choice === "hair") dealbreakerScores.push(inverse5(p.shedding));
    if (choice === "grooming") dealbreakerScores.push(inverse5(p.grooming));
    if (choice === "noise") dealbreakerScores.push(inverse100(s.barking));
    if (choice === "stimulation") dealbreakerScores.push(inverse100(s.stimulation));
    if (choice === "independent") dealbreakerScores.push(inverse100(s.independence));
  }
  if (dealbreakerScores.length) parts.push(avg(dealbreakerScores));

  const personalityScores = [];
  for (const choice of a.personality || []) {
    if (choice === "affectionate") personalityScores.push(norm100(s.sociability));
    if (choice === "eager") personalityScores.push(avg([norm100(s.trainability), 1 - norm100(s.independence) * 0.55]));
    if (choice === "independent") personalityScores.push(norm100(s.independence));
    if (choice === "athletic") personalityScores.push(avg([norm5(p.energy), norm5(p.exercise)]));
    if (choice === "calm") personalityScores.push(avg([inverse5(p.energy), inverse5(p.exercise), inverse100(s.barking)]));
  }
  if (personalityScores.length) parts.push(avg(personalityScores));

  if (a.training === "basics") parts.push(avg([norm100(s.trainability), inverse5(p.working), p.experience === 1 ? 1 : p.experience === 2 ? 0.65 : 0.35]));
  if (a.training === "regular") parts.push(avg([norm100(s.trainability), target5(p.working, 3, 3), target5(p.experience, 2, 2)]));
  if (a.training === "hobby") parts.push(avg([norm100(s.trainability), norm5(p.working), norm100(s.stimulation)]));

  const homeScores = [];
  for (const choice of a.household || []) {
    if (choice === "apartment") homeScores.push(avg([norm5(p.apartment), inverse100(s.barking)]));
    if (choice === "children") homeScores.push(norm5(p.children));
    if (choice === "visitors") homeScores.push(norm100(s.sociability));
  }
  if (homeScores.length) parts.push(avg(homeScores));

  if (a.weekday === "short") parts.push(avg([target5(p.exercise, 1, 3), target5(p.energy, 2, 3)]));
  if (a.weekday === "hour") parts.push(avg([target5(p.exercise, 2.5, 2.5), target5(p.energy, 3, 3)]));
  if (a.weekday === "long") parts.push(avg([target5(p.exercise, 4, 2.5), target5(p.energy, 4, 2.5)]));
  if (a.weekday === "very-long") parts.push(avg([norm5(p.exercise), norm5(p.energy)]));

  if (a.ownership === "fits-around") parts.push(avg([inverse5(p.exercise), inverse5(p.grooming), inverse100(s.stimulation), p.experience === 1 ? 1 : 0.65]));
  if (a.ownership === "major") parts.push(avg([target5(p.exercise, 4, 3), target5(p.energy, 4, 3), target5(p.working, 3.5, 3)]));
  if (a.ownership === "hobby") parts.push(avg([norm5(p.working), norm100(s.trainability), norm100(s.stimulation)]));

  return avg(parts);
}

function renderInlineAllBreeds() {
  renderResults([...BREEDS].sort((a,b) => a.name.localeCompare(b.name)), "home-results", "All breeds");
  document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResults(breeds, targetId, title) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const quizDisclaimer = title === "Quiz matches"
    ? `<div class="quiz-disclaimer"><strong>A useful starting point, not a perfect-match guarantee.</strong> The quiz can point you toward good candidates, but breed traits and individual dogs vary. Research each breed carefully and make sure you understand why it fits your home, time, experience and lifestyle before choosing a dog.</div>`
    : "";
  target.innerHTML = `
    <div class="results-header"><h2>${esc(title)}</h2><div class="count">${breeds.length} breed${breeds.length === 1 ? "" : "s"}</div></div>
    ${quizDisclaimer}
    ${breeds.length ? `<div class="breed-grid">${breeds.map(breedCard).join("")}</div>` : `<div class="empty">No breeds in the current database are strong matches for that combination. Change one or two choices and try again.</div>`}`;
  attachBreedLinks(target);
  activateDynamicCardPhotos(target);
}

function renderBrowse(size, category) {
  const filtered = BREEDS.filter(b => {
    if (b.size !== size) return false;
    if (category === "all") return true;
    if (category === "beginner") return b.profile.experience === 1;
    if (category === "family") return b.profile.children >= 4 && b.stats.sociability >= 75;
    if (category === "working") return b.profile.working >= 4;
    if (category === "low-grooming") return b.profile.grooming <= 2;
    if (category === "low-energy") return b.profile.energy <= 2;
    return true;
  });
  const labels = {all:"All", beginner:"Beginner-friendly", family:"Family-friendly", working:"Working & sport", "low-grooming":"Lower grooming", "low-energy":"Lower energy"};
  app.innerHTML = `
    <section class="browse-heading">
      <div>
        <h1>${SIZE_LABELS[size]} dogs</h1>
        <p class="lead">${esc(labels[category] || "All")} · ${filtered.length} breed${filtered.length === 1 ? "" : "s"} in the current database</p>
      </div>
      <p class="browse-note">Use the filter if you want to combine several traits without taking the quiz.</p>
    </section>
    ${filterMarkup("browse-filter", size)}
    <section class="results browse-results" id="browse-filter-results" aria-live="polite"></section>
    <div class="filtered-separator" id="browse-filter-separator" hidden><span>CONTINUE BROWSING</span></div>
    <section id="browse-results"><div class="breed-grid">${filtered.map(breedCard).join("")}</div></section>`;
  attachBreedLinks(app);
  activateDynamicCardPhotos(app);
  setupFilter("browse-filter", "browse-filter-results", size, "browse-filter-separator");
}

function attachBreedLinks(scope) {
  scope.querySelectorAll("[data-breed]").forEach(button => {
    button.addEventListener("click", () => { location.hash = `breed/${button.dataset.breed}`; });
  });
}

function commonsRequest(paramsObject) {
  const endpoint = "https://commons.wikimedia.org/w/api.php";
  const params = new URLSearchParams({ ...paramsObject, format: "json", origin: "*" });
  const fetchAttempt = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`${endpoint}?${params.toString()}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Commons request failed");
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  })();

  return fetchAttempt.catch(() => new Promise((resolve, reject) => {
    const callback = `__dogCommons${Date.now()}${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const jsonp = new URLSearchParams({ ...paramsObject, format: "json", callback });
    const cleanup = () => {
      delete window[callback];
      script.remove();
      clearTimeout(timer);
    };
    const timer = setTimeout(() => { cleanup(); reject(new Error("Commons JSONP timeout")); }, 12000);
    window[callback] = data => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error("Commons JSONP failed")); };
    script.src = `${endpoint}?${jsonp.toString()}`;
    document.head.appendChild(script);
  }));
}

function pageLooksLikePuppy(page) {
  const info = page?.imageinfo?.[0] || {};
  const meta = info.extmetadata || {};
  const text = `${page?.title || ""} ${plainText(meta.ImageDescription?.value || "")}`.toLowerCase();
  return /\b(puppy|puppies|pup|litter|weeks? old|months? old)\b/.test(text);
}

async function getCategoryPhotos(category, limit = 6) {
  const cacheKey = `${category}:${limit}`;
  if (primaryPhotoCache.has(cacheKey)) return primaryPhotoCache.get(cacheKey);
  const promise = (async () => {
    const params = new URLSearchParams({
      action: "query",
      generator: "categorymembers",
      gcmtitle: `Category:${category}`,
      gcmtype: "file",
      gcmlimit: String(Math.max(limit * 3, 12)),
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1200",
      format: "json",
      origin: "*"
    });
    const data = await commonsRequest(Object.fromEntries(params));
    return Object.values(data.query?.pages || {}).filter(page => {
      const info = page.imageinfo?.[0];
      return info?.thumburl && /\.(jpe?g|png|webp)$/i.test(info.url || "") && !pageLooksLikePuppy(page);
    }).slice(0, limit);
  })();
  primaryPhotoCache.set(cacheKey, promise);
  return promise;
}

async function activateDynamicCardPhotos(scope) {
  const placeholders = [...scope.querySelectorAll("[data-card-placeholder]")];
  await Promise.all(placeholders.map(async placeholder => {
    try {
      const pages = await getCategoryPhotos(placeholder.dataset.category, 1);
      const info = pages[0]?.imageinfo?.[0];
      if (!info?.thumburl) throw new Error("No image");
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = info.thumburl;
      img.alt = placeholder.closest("[data-breed]")?.getAttribute("aria-label")?.replace(/^Open /, "") || "Dog breed";
      placeholder.replaceWith(img);
    } catch {
      placeholder.textContent = "🐾";
      placeholder.setAttribute("aria-label", "Dog photo unavailable");
    }
  }));
  scope.querySelectorAll("[data-card-img]").forEach(img => {
    img.addEventListener("error", async () => {
      if (img.dataset.fallbackTried) return;
      img.dataset.fallbackTried = "1";
      try {
        const pages = await getCategoryPhotos(img.dataset.category, 1);
        const info = pages[0]?.imageinfo?.[0];
        if (info?.thumburl) img.src = info.thumburl;
      } catch {}
    }, { once: true });
  });
}


async function geocodeShelterLocation(locationText) {
  const query = String(locationText || "").trim();
  if (!query) return null;
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    addressdetails: "1"
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Location lookup failed");
  const matches = await response.json();
  const match = matches?.[0];
  if (!match) return null;
  const lat = Number(match.lat);
  const lon = Number(match.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    lat,
    lon,
    label: match.display_name || query,
    countryCode: String(match.address?.country_code || "").toLowerCase()
  };
}

async function findNearbyShelters(locationText) {
  const origin = await geocodeShelterLocation(locationText);
  if (!origin) return { origin: null, shelters: [] };
  const { lat, lon } = origin;

  const query = `[out:json][timeout:20];(nwr["amenity"="animal_shelter"](around:60000,${lat},${lon});nwr["animal_shelter"="dog"](around:60000,${lat},${lon});nwr["animal"="dog"]["name"](around:60000,${lat},${lon});nwr["amenity"="animal_boarding"]["rescue"="yes"](around:60000,${lat},${lon}););out center tags;`;
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Shelter lookup failed");
  const data = await response.json();
  const seen = new Set();
  const shelters = (data.elements || []).map(element => {
    const tags = element.tags || {};
    const itemLat = Number(element.lat ?? element.center?.lat);
    const itemLon = Number(element.lon ?? element.center?.lon);
    if (!Number.isFinite(itemLat) || !Number.isFinite(itemLon)) return null;
    const name = tags.name || "Animal shelter or rescue";
    const key = `${name.toLowerCase()}|${itemLat.toFixed(4)}|${itemLon.toFixed(4)}`;
    if (seen.has(key)) return null;
    seen.add(key);
    const website = tags.website || tags["contact:website"] || "";
    const phone = tags.phone || tags["contact:phone"] || "";
    const address = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"], tags["addr:state"], tags["addr:postcode"], tags["addr:country"]].filter(Boolean).join(" ");
    const distanceKm = haversineKm(lat, lon, itemLat, itemLon);
    return { name, lat: itemLat, lon: itemLon, website, phone, address, distanceKm };
  }).filter(Boolean).sort((a,b) => a.distanceKm - b.distanceKm).slice(0, 12);
  return { origin, shelters };
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371.0088 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function shelterCard(shelter, breed, index) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(shelter.lat)}&mlon=${encodeURIComponent(shelter.lon)}#map=15/${encodeURIComponent(shelter.lat)}/${encodeURIComponent(shelter.lon)}`;
  return `<article class="shelter-card">
    <div class="shelter-number">${index + 1}</div>
    <div>
      <h3>${esc(shelter.name)}</h3>
      <p>${shelter.address ? esc(shelter.address) + " · " : ""}${shelter.distanceKm.toFixed(1)} km · ${(shelter.distanceKm * 0.621371).toFixed(1)} mi away</p>
      <p class="shelter-fit">Dog shelter/rescue near you. Contact them to ask about ${esc(breed.name)}s or similar mixes.</p>
      <div class="shelter-links">
        ${shelter.website ? `<a href="${esc(shelter.website)}" target="_blank" rel="noopener">Shelter website →</a>` : ""}
        ${shelter.phone ? `<a href="tel:${esc(shelter.phone.replace(/[^+\\d]/g, ""))}">${esc(shelter.phone)}</a>` : ""}
        <a href="${esc(mapUrl)}" target="_blank" rel="noopener">Map →</a>
      </div>
    </div>
  </article>`;
}

function renderBreed(breed) {
  const variationSpec = AKC_VARIATIONS[breed.id] || { summary: "Breed appearance varies.", colors: [], examples: [], slug: breed.id };
  const facts = [
    { label: "Size", value: SIZE_LABELS[breed.size] },
    { label: "Typical weight", value: breed.facts.weight, male: breed.facts.weightMale, female: breed.facts.weightFemale },
    { label: "Typical height", value: breed.facts.height, male: breed.facts.heightMale, female: breed.facts.heightFemale },
    { label: "Lifespan", value: breed.facts.lifespan },
    { label: "Coat", value: breed.facts.coat },
    { label: "Originally bred for", value: breed.facts.purpose },
    { label: "Typical exercise", value: breed.facts.exercise },
    { label: "Owner experience", value: breed.profile.experience === 1 ? "Beginner-friendly" : breed.profile.experience === 2 ? "Some experience helpful" : "Experienced owner preferred" }
  ];

  const renderFactValue = fact => {
    if (fact.male && fact.female) {
      return `<span class="sex-values"><span><strong>Male:</strong> ${esc(fact.male)}</span><span><strong>Female:</strong> ${esc(fact.female)}</span></span>`;
    }
    return esc(fact.value || "—");
  };
  const products = [
    ["Harness", breed.products.harness, `${breed.name} ${breed.products.harness}`],
    ["Shampoo", breed.products.shampoo, breed.products.shampoo],
    ["Grooming", breed.products.grooming, `${breed.name} ${breed.products.grooming}`],
    ["Bed / crate", breed.products.bed, `${breed.name} ${breed.products.bed}`]
  ];
  const mainPhoto = breed.photo
    ? `<figure class="photo photo-main" data-gallery-photo tabindex="0"><div class="photo-media"><img src="${commonsImage(breed.photo, 1500)}" alt="${esc(breed.name)}"></div><figcaption class="photo-credit"><a href="${commonsPage(breed.photo)}" target="_blank" rel="noopener">Wikimedia Commons source</a></figcaption></figure>`
    : `<div class="gallery-loading" id="primary-photo-loading">Loading a freely licensed Wikimedia Commons photo…</div>`;

  app.innerHTML = `
    <article class="breed-page">
      <header class="breed-heading">
        <div><p class="kicker">${SIZE_LABELS[breed.size]} breed</p><h1>${esc(breed.name)}</h1></div>
        <button class="back" type="button" id="back-button">← BACK</button>
      </header>

      <section class="section">
        <p class="section-label">Pictures</p>
        <div class="gallery" id="gallery">
          ${mainPhoto}
          <div class="gallery-loading" id="gallery-loading">Loading more freely licensed photos from Wikimedia Commons…</div>
        </div>
        <div class="variation-block">
          <div class="variation-heading">
            <div>
              <h3>Breed-standard colors &amp; coat variations</h3>
              <p>${esc(variationSpec.summary)}</p>
            </div>
          </div>
          <div class="variation-standards">
            ${(variationSpec.colors || []).length ? `<div><span class="variation-meta-label">Standard colors / patterns</span><div class="variation-tags">${variationSpec.colors.map(item => `<span>${esc(item)}</span>`).join("")}</div></div>` : ""}
            ${(variationSpec.coatTypes || []).length ? `<div><span class="variation-meta-label">Other recognized variation</span><div class="variation-tags">${variationSpec.coatTypes.map(item => `<span>${esc(item)}</span>`).join("")}</div></div>` : ""}
          </div>
          <div class="variation-grid" id="variation-grid"><div class="gallery-loading">Loading variation examples…</div></div>
        </div>
      </section>

      <section class="section">
        <p class="section-label">Facts</p>
        <div class="facts-grid">${facts.map(fact => `<div class="fact"><span class="fact-name">${esc(fact.label)}</span><span class="fact-value">${renderFactValue(fact)}</span></div>`).join("")}</div>
      </section>

      <section class="section">
        <p class="section-label">Stats</p>
        <p class="stats-note">Relative breed tendency scores from 0–100. They are scales, not probabilities, and individual dogs vary.</p>
        <div class="stats">${Object.entries(breed.stats).map(([key,value]) => `<div class="stat"><div class="stat-name">${esc(STAT_LABELS[key])}</div><div class="stat-track"><div class="stat-fill" style="width:${Number(value)}%"></div></div><div class="stat-value">${Number(value)}%</div></div>`).join("")}</div>
      </section>

      <section class="section">
        <p class="section-label">Disadvantages</p>
        <h2>Things to know before getting one</h2>
        <ul class="disadvantages">${breed.disadvantages.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
      </section>

      <section class="section">
        <p class="section-label">Adoption</p>
        <h2>Adopt ${/^[aeiou]/i.test(breed.name) ? "an" : "a"} ${esc(breed.name)} at shelters near you</h2>
        <div class="shelter-box">
          <form class="shelter-form" id="shelter-form">
            <div class="field"><label for="location">Postal code, city, or address</label><input class="zip-input" id="location" name="location" autocomplete="postal-code" placeholder="e.g. 238255 Singapore or Montreal, QC" maxlength="120"></div>
            <button class="primary" type="submit">FIND NEARBY SHELTERS</button>
          </form>
          <p class="help">Works internationally using OpenStreetMap location and shelter data. Availability changes quickly, so contact each shelter to ask whether they currently have a ${esc(breed.name)} or similar mix.</p>
          <p class="message" id="shelter-message" aria-live="polite"></p>
          <div class="shelter-results" id="shelter-results"></div>
        </div>
      </section>

      <section class="section">
        <p class="section-label">Recommended products</p>
        <h2>Products that fit the breed</h2>
        <div class="product-grid">${products.map(([label,note,query]) => `<div class="product"><h3>${esc(label)}</h3><p>${esc(note)}</p><a href="${amazonSearch(query)}" target="_blank" rel="sponsored noopener">Search Amazon →</a></div>`).join("")}</div>
      </section>
    </article>`;

  document.getElementById("back-button").addEventListener("click", () => history.length > 1 ? history.back() : location.hash = `browse/${breed.size}/all`);
  document.getElementById("shelter-form").addEventListener("submit", async event => {
    event.preventDefault();
    const locationText = String(new FormData(event.currentTarget).get("location") || "").trim();
    const message = document.getElementById("shelter-message");
    const results = document.getElementById("shelter-results");
    results.innerHTML = "";
    if (locationText.length < 2) {
      message.className = "message error";
      message.textContent = "Enter a postal code, city, or address.";
      return;
    }
    message.className = "message";
    message.textContent = `Finding dog shelters and rescues near ${locationText}…`;
    try {
      const { origin, shelters } = await findNearbyShelters(locationText);
      if (!origin) {
        message.className = "message error";
        message.textContent = "I could not locate that place. Add a city or country and try again.";
        return;
      }
      if (!shelters.length) {
        message.textContent = `No mapped dog shelters were found within about 60 km of ${origin.label}. Try a nearby city or a broader location.`;
        return;
      }
      message.textContent = `${shelters.length} nearby shelter${shelters.length === 1 ? "" : "s"} or rescue${shelters.length === 1 ? "" : "s"} near ${origin.label}. Ask about ${breed.name}s and similar mixes.`;
      results.innerHTML = shelters.map((shelter, index) => shelterCard(shelter, breed, index)).join("");
    } catch (error) {
      message.className = "message error";
      message.textContent = "Shelter search is temporarily unavailable. Try again in a moment.";
    }
  });
  setupGalleryInteractions();
  loadCommonsGallery(breed);
  loadVariationGallery(breed);
}

function staticCommonsFigure(fileName, alt, className = "photo") {
  const figure = document.createElement("figure");
  figure.className = className;
  figure.dataset.staticFile = fileName.toLowerCase();
  figure.dataset.galleryPhoto = "1";
  figure.tabIndex = 0;
  figure.innerHTML = `<div class="photo-media"><img loading="lazy" src="${commonsImage(fileName, 1200)}" alt="${esc(alt)}"></div><figcaption class="photo-credit"><a href="${commonsPage(fileName)}" target="_blank" rel="noopener">Wikimedia Commons source</a></figcaption>`;
  return figure;
}

function waitForFigureImage(figure) {
  return new Promise(resolve => {
    const img = figure?.querySelector("img");
    if (!img) return resolve(false);
    if (img.complete) return resolve(img.naturalWidth > 0);
    img.addEventListener("load", () => resolve(true), { once: true });
    img.addEventListener("error", () => resolve(false), { once: true });
  });
}

function pageLooksLikeNonPhoto(page) {
  const info = page?.imageinfo?.[0] || {};
  const meta = info.extmetadata || {};
  const text = `${page?.title || ""} ${plainText(meta.ImageDescription?.value || "")}`.toLowerCase();
  return /\b(drawing|illustration|painting|sculpture|statue|logo|diagram|coat of arms|stamp|book page|engraving)\b/.test(text);
}

async function loadCommonsGallery(breed) {
  const gallery = document.getElementById("gallery");
  const loading = document.getElementById("gallery-loading");
  if (!gallery || !loading) return;

  const TARGET_TOTAL = 4;
  const used = new Set([String(breed.photo || "").toLowerCase()]);
  const loadedFigures = () => [...gallery.querySelectorAll("[data-gallery-photo]")];

  const addStatic = async fileName => {
    const key = String(fileName || "").toLowerCase();
    if (!key || used.has(key) || loadedFigures().length >= TARGET_TOTAL) return false;
    used.add(key);
    const fig = staticCommonsFigure(fileName, breed.name, "photo");
    gallery.insertBefore(fig, loading);
    const ok = await waitForFigureImage(fig);
    if (!ok) fig.remove();
    return ok;
  };

  const addPage = async page => {
    if (!page || loadedFigures().length >= TARGET_TOTAL) return false;
    const key = String(page.title || "").toLowerCase();
    if (!key || used.has(key)) return false;
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) return false;
    used.add(key);
    const fig = commonsFigure(page, breed.name, "photo");
    gallery.insertBefore(fig, loading);
    const ok = await waitForFigureImage(fig);
    if (!ok) fig.remove();
    return ok;
  };

  // If the curated main image fails, replace it with a searched adult photo.
  const main = gallery.querySelector(".photo-main");
  const mainImg = main?.querySelector("img");
  const repairMain = async () => {
    try {
      const pages = await searchCommonsPhotos(`${breed.name} adult dog standing`, 24);
      const first = pages.find(page => !pageLooksLikeNonPhoto(page) && !used.has(String(page.title || "").toLowerCase()));
      if (first && main?.isConnected) {
        used.add(String(first.title || "").toLowerCase());
        main.replaceWith(commonsFigure(first, breed.name, "photo photo-main"));
      }
      setupGalleryInteractions();
    } catch {}
  };
  if (mainImg) {
    if (mainImg.complete && !mainImg.naturalWidth) repairMain();
    else mainImg.addEventListener("error", repairMain, { once: true });
  }

  for (const fileName of (CURATED_GALLERY[breed.id] || [])) {
    if (loadedFigures().length >= TARGET_TOTAL) break;
    await addStatic(fileName);
  }

  const searchSets = [];
  try { searchSets.push(await searchCommonsPhotos(`${breed.name} adult dog standing`, 24)); } catch {}
  if (loadedFigures().length < TARGET_TOTAL) {
    try { searchSets.push(await searchCommonsPhotos(`${breed.name} adult dog portrait`, 24)); } catch {}
  }
  if (loadedFigures().length < TARGET_TOTAL) {
    try { searchSets.push(await searchCommonsPhotos(`${breed.name} dog`, 30)); } catch {}
  }
  if (loadedFigures().length < TARGET_TOTAL) {
    try { searchSets.push(await getCategoryPhotos(breed.category, 30)); } catch {}
  }

  for (const pages of searchSets) {
    for (const page of pages || []) {
      if (loadedFigures().length >= TARGET_TOTAL) break;
      if (pageLooksLikeNonPhoto(page)) continue;
      await addPage(page);
    }
    if (loadedFigures().length >= TARGET_TOTAL) break;
  }

  // One last low-pressure retry. This matters on GitHub Pages when Commons is slow.
  if (loadedFigures().length < TARGET_TOTAL) {
    try {
      const retryPages = await searchCommonsPhotos(`${breed.name} dog -puppy`, 50);
      for (const page of retryPages) {
        if (loadedFigures().length >= TARGET_TOTAL) break;
        await addPage(page);
      }
    } catch {}
  }

  loading.remove();
  setupGalleryInteractions();
}

function commonsFigure(page, alt, className = "photo") {
  const info = page.imageinfo?.[0] || {};
  const meta = info.extmetadata || {};
  const artist = plainText(meta.Artist?.value) || "Wikimedia Commons contributor";
  const license = plainText(meta.LicenseShortName?.value) || "free license";
  const source = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`;
  const figure = document.createElement("figure");
  figure.className = className;
  figure.dataset.galleryPhoto = "1";
  figure.tabIndex = 0;
  figure.innerHTML = `<div class="photo-media"><img loading="lazy" src="${esc(info.thumburl)}" alt="${esc(alt)}"></div><figcaption class="photo-credit">${esc(artist)} · ${esc(license)} · <a href="${esc(source)}" target="_blank" rel="noopener">source</a></figcaption>`;
  return figure;
}

async function searchCommonsPhotos(query, limit = 10) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(Math.max(limit * 2, 12)),
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1200",
    format: "json",
    origin: "*"
  });
  const data = await commonsRequest(Object.fromEntries(params));
  const seen = new Set();
  return Object.values(data.query?.pages || {}).filter(page => {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl || !/\.(jpe?g|png|webp)$/i.test(info.url || "") || pageLooksLikePuppy(page) || pageLooksLikeNonPhoto(page)) return false;
    const key = String(page.title || info.url).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

function variationKeywords(query, breedName) {
  const breedWords = new Set(String(breedName).toLowerCase().split(/\s+/));
  return String(query).toLowerCase().split(/\s+/).filter(word => word.length > 2 && !breedWords.has(word) && word !== "dog" && word !== "adult");
}

function chooseVariationPhoto(pages, query, breedName, usedTitles) {
  const keywords = variationKeywords(query, breedName);
  return (pages || [])
    .filter(page => !usedTitles.has(String(page.title).toLowerCase()))
    .map(page => {
      const title = String(page.title || "").toLowerCase();
      const description = plainText(page.imageinfo?.[0]?.extmetadata?.ImageDescription?.value || "").toLowerCase();
      const haystack = `${title} ${description}`;
      const score = keywords.reduce((total, word) => total + (haystack.includes(word) ? 3 : 0), 0) + (haystack.includes(breedName.toLowerCase()) ? 2 : 0);
      return { page, score };
    })
    .sort((a,b) => b.score - a.score)[0]?.page || null;
}

async function fillVariationMedia(media, example, breed, usedTitles) {
  const setStatic = async fileName => {
    if (!fileName) return false;
    return await new Promise(resolve => {
      const source = commonsPage(fileName);
      const img = document.createElement("img");
      img.loading = "eager";
      img.src = commonsImage(fileName, 1000);
      img.alt = `${example.label} ${breed.name}`;
      const link = document.createElement("a");
      link.href = source;
      link.target = "_blank";
      link.rel = "noopener";
      link.appendChild(img);
      media.replaceChildren(link);
      img.addEventListener("load", () => resolve(true), { once: true });
      img.addEventListener("error", () => { media.innerHTML = `<div class="photo-placeholder">Trying another photo…</div>`; resolve(false); }, { once: true });
    });
  };

  if (await setStatic(example.photo)) return true;

  const queries = [
    example.query,
    `${breed.name} ${example.label} adult dog`,
    `${example.label} ${breed.name} dog`,
    `${breed.name} ${example.label}`,
    `${example.label} ${breed.name}`
  ].filter(Boolean);
  for (const query of queries) {
    try {
      const pages = await searchCommonsPhotos(query, 20);
      const page = chooseVariationPhoto(pages, query, breed.name, usedTitles);
      const info = page?.imageinfo?.[0];
      if (!page || !info?.thumburl) continue;
      const titleKey = String(page.title).toLowerCase();
      if (usedTitles.has(titleKey)) continue;
      usedTitles.add(titleKey);
      const source = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`;
      const img = document.createElement("img");
      img.loading = "eager";
      img.src = info.thumburl;
      img.alt = `${example.label} ${breed.name}`;
      const link = document.createElement("a");
      link.href = source;
      link.target = "_blank";
      link.rel = "noopener";
      link.appendChild(img);
      media.replaceChildren(link);
      const ok = await new Promise(resolve => {
        img.addEventListener("load", () => resolve(true), { once: true });
        img.addEventListener("error", () => { media.innerHTML = `<div class="photo-placeholder">Trying another photo…</div>`; resolve(false); }, { once: true });
      });
      if (ok) return true;
    } catch {}
  }
  return false;
}

async function loadVariationGallery(breed) {
  const grid = document.getElementById("variation-grid");
  if (!grid) return;
  const spec = AKC_VARIATIONS[breed.id] || { examples: [], noVariations: true };
  const examples = spec.examples || [];
  grid.innerHTML = "";

  if (!examples.length) {
    const note = document.createElement("div");
    note.className = "variation-none";
    note.textContent = spec.noVariations ? "No additional standard color varieties for this breed." : "The breed standard does not divide this breed into separate color varieties.";
    grid.appendChild(note);
    return;
  }

  const usedTitles = new Set();
  const cards = examples.map(example => {
    const card = document.createElement("article");
    card.className = "variation-card";
    const media = document.createElement("div");
    media.className = "variation-image";
    media.innerHTML = `<div class="photo-placeholder">Loading example…</div>`;
    const label = document.createElement("h4");
    label.textContent = example.label;
    card.append(media, label);
    grid.appendChild(card);
    return { card, media, example };
  });

  for (let i = 0; i < cards.length; i += 2) {
    const batch = cards.slice(i, i + 2);
    await Promise.all(batch.map(async ({ card, media, example }) => {
      let ok = await fillVariationMedia(media, example, breed, usedTitles);
      if (!ok) {
        // A second pass is intentionally delayed so Commons is not hit by many simultaneous searches.
        await new Promise(resolve => setTimeout(resolve, 250));
        ok = await fillVariationMedia(media, { ...example, query: `${example.label} ${breed.name}` }, breed, usedTitles);
      }
      if (!ok) card.remove();
    }));
  }

  if (!grid.querySelector(".variation-card")) {
    const note = document.createElement("div");
    note.className = "variation-none";
    note.textContent = "Variation photos are temporarily unavailable. The standard colors are listed above.";
    grid.appendChild(note);
  }
}

function setupGalleryInteractions() {
  const gallery = document.getElementById("gallery");
  if (!gallery || gallery.dataset.interactive === "1") return;
  gallery.dataset.interactive = "1";

  const promote = figure => {
    if (!figure || figure.classList.contains("photo-main") || !figure.querySelector("img")) return;
    const main = gallery.querySelector(".photo-main");
    if (!main) return;
    const mainHTML = main.innerHTML;
    main.innerHTML = figure.innerHTML;
    figure.innerHTML = mainHTML;
  };

  gallery.addEventListener("click", event => {
    if (event.target.closest("a")) return;
    promote(event.target.closest("[data-gallery-photo]"));
  });
  gallery.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const figure = event.target.closest("[data-gallery-photo]");
    if (!figure || figure.classList.contains("photo-main")) return;
    event.preventDefault();
    promote(figure);
  });
}

function humanizeVariation(query, breedName) {
  const cleaned = String(query).replace(new RegExp(breedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "").replace(/\bdog\b/ig, "").trim();
  if (!cleaned) return breedName;
  return cleaned.replace(/\b\w/g, char => char.toUpperCase());
}

function plainText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return (doc.body.textContent || "").trim();
}

function renderCredits() {
  app.innerHTML = `<section class="hero"><p class="kicker">Sources</p><h1>Photo credits</h1><p class="lead">Breed photography comes from Wikimedia Commons. Static starter images link to their file pages, while additional gallery and variation images display their source links beside or through each image.</p></section><div class="credits-list">${BREEDS.map(b => `<div class="credit-row"><strong>${esc(b.name)}</strong><div class="credit-meta">${b.photo ? `<a href="${commonsPage(b.photo)}" target="_blank" rel="noopener">${esc(b.photo)}</a>` : `<a href="${commonsCategoryPage(b.category)}" target="_blank" rel="noopener">Commons category</a>`} · Wikimedia Commons</div></div>`).join("")}</div>`;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav-button").forEach(el => el.classList.remove("active"));
  if (route === "quiz") document.querySelector(".nav-quiz")?.classList.add("active");
  if (route.startsWith("browse/large")) document.querySelector(".nav-large")?.classList.add("active");
  if (route.startsWith("browse/medium")) document.querySelector(".nav-medium")?.classList.add("active");
  if (route.startsWith("browse/small")) document.querySelector(".nav-small")?.classList.add("active");
}

function route() {
  const raw = location.hash.replace(/^#/, "") || "quiz";
  setActiveNav(raw);
  closeDropdowns();
  const parts = raw.split("/");
  if (parts[0] === "quiz") renderHome();
  else if (parts[0] === "browse" && ["small","medium","large"].includes(parts[1])) renderBrowse(parts[1], parts[2] || "all");
  else if (parts[0] === "breed") {
    const breed = BREEDS.find(b => b.id === parts[1]);
    breed ? renderBreed(breed) : renderHome();
  } else if (parts[0] === "credits") renderCredits();
  else renderHome();
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function closeDropdowns() {
  document.querySelectorAll("[data-nav-group]").forEach(group => group.classList.remove("open"));
  document.querySelectorAll("[data-dropdown-trigger]").forEach(btn => btn.setAttribute("aria-expanded", "false"));
}

document.querySelector("[data-route='quiz']").addEventListener("click", () => { location.hash = "quiz"; });
document.querySelectorAll("[data-dropdown-trigger]").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const group = trigger.closest("[data-nav-group]");
    const willOpen = !group.classList.contains("open");
    closeDropdowns();
    if (willOpen) {
      group.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});
document.querySelectorAll("[data-nav-group]").forEach(group => {
  group.addEventListener("mouseleave", () => {
    group.classList.remove("open");
    group.querySelector("[data-dropdown-trigger]")?.setAttribute("aria-expanded", "false");
  });
});
document.querySelectorAll("[data-browse]").forEach(button => {
  button.addEventListener("click", () => {
    const [size, category] = button.dataset.browse.split(":");
    location.hash = `browse/${size}/${category}`;
  });
});
document.addEventListener("click", event => {
  if (!event.target.closest("[data-nav-group]")) closeDropdowns();
});
window.addEventListener("hashchange", route);
route();
