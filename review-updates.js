(() => {
  const EXACT_GALLERIES = {
    "whippet": {
      main: "Whippet1.jpg",
      sides: [
        "Resting whippet.jpg",
        "Szombierki whippet 18.09.2011 6pl.jpg",
        "Whippet stacked.jpg"
      ]
    },
    "akita": {
      main: "Akita Dog.jpg",
      sides: ["Akita Inu.jpg", "Akita Inu dog.jpg", "Akita inu blanc.jpg"]
    },
    "great-pyrenees": {
      main: "Great Pyrenees.jpg",
      sides: ["Great Pyrenees Mountain Dog.jpg", "Pyrenean Mountain Dog.jpg", "Great Pyrenees dog and goats.jpg"]
    },
    "collie": {
      main: "Adult Rough Collie.JPG",
      sides: ["2014 Westminster Kennel Club Dog Show (12452128984).jpg", "1Dog-rough-collie-portrait.jpg", "Collie.jpg"]
    },
    "german-shorthaired-pointer": {
      main: "German short-haired pointer.JPG",
      sides: ["(2)Wystawa psów Rybnik wyżeł niemiecki 04.10.2010 pl.jpg", "1 Dog Show.jpg", "(2)BIR Grupp 7- KORTHÅRIG VORSTEH, J Björnkärrets Hertzogin Aida (24208119306).jpg"]
    },
    "english-setter": {
      main: "A English Setter.jpg",
      sides: ["English setter.jpg", "Engelse setter.JPG", "English setter in the field.jpg"]
    },
    "old-english-sheepdog": {
      main: "Old-English-Sheepdog.jpg",
      sides: ["2013 Royal Melbourne Show (9972660214).jpg", "Old English Sheepdog.jpg", "1182780560 f.jpg"]
    },
    "american-cocker-spaniel": {
      main: "An American Cocker Spaniel.jpg",
      sides: ["American Cocker Spaniel.jpg", "Cocker spaniel dog.jpg", "05052893 best in show.jpg"]
    },
    "cairn-terrier": {
      main: "Cairn terrier.jpg",
      sides: ["2Cairn Terrier in grass.jpg", "Cairn side view.jpg", "Cairn Terrier - 001.jpg"]
    },
    "italian-greyhound": {
      main: "ItalianGreyhound.jpg",
      sides: ["Italian Greyhound (1).jpg", "000 Charcik Włoski - niebieski.jpg", "00 Charcik Włoski w kokardzie.jpg"]
    },
    "miniature-pinscher": {
      main: "Miniature Pinscher.jpg",
      sides: ["Adult Male Miniature Pinscher.jpg", "Black and rust purebred female miniature pinscher.jpg", "Miniature Pinscher Female Dog.png"]
    }
  };

  const VARIATIONS = {
    "akita": {
      summary:"Breed-standard colors may be any color including white, brindle and pinto, with clear, well-balanced markings.",
      colors:["Red / Fawn","Brindle","White","Pinto"],
      examples:[
        {label:"Red / Fawn",photo:"Japanese Akita.jpg",query:"adult red Akita dog"},
        {label:"Brindle",photo:"Akita brindle.jpg",query:"adult brindle Akita dog"},
        {label:"White",photo:"Akita inu blanc.jpg",query:"adult white Akita dog"},
        {label:"Pinto",query:"adult pinto Akita dog"}
      ]
    },
    "great-pyrenees": {
      summary:"The standard is white, or white with gray, badger, reddish-brown or tan markings.",
      colors:["White","White with gray / badger / tan markings"],
      examples:[
        {label:"White",photo:"Great Pyrenees Mountain Dog.jpg",query:"adult white Great Pyrenees dog"},
        {label:"White with markings",photo:"Pyrenean Mountain Dog.jpg",query:"adult Great Pyrenees dog markings"}
      ]
    },
    "collie": {
      summary:"Breed-standard colors are Sable & White, Tri-Color, Blue Merle, and White. Collies also come in Rough and Smooth coat varieties.",
      colors:["Sable & White","Tri-Color","Blue Merle","White"],
      coatTypes:["Rough Coat","Smooth Coat"],
      examples:[
        {label:"Sable & White",photo:"Adult Rough Collie.JPG",query:"adult sable white Collie"},
        {label:"Tri-Color",query:"adult tricolor Collie dog"},
        {label:"Blue Merle",query:"adult blue merle Collie dog"},
        {label:"White",query:"adult white Collie dog"},
        {label:"Smooth Coat",query:"adult Smooth Collie dog"}
      ]
    },
    "german-shorthaired-pointer": {
      summary:"Standard colors include liver, black, and combinations of either with white, ticking or roan.",
      colors:["Liver","Liver & White","Liver Roan / Ticked","Black","Black & White / Roan"],
      examples:[
        {label:"Liver",query:"adult solid liver German Shorthaired Pointer"},
        {label:"Liver & White",photo:"German short-haired pointer.JPG",query:"adult liver white German Shorthaired Pointer"},
        {label:"Liver Roan",query:"adult liver roan German Shorthaired Pointer"},
        {label:"Black & White",query:"adult black white German Shorthaired Pointer"}
      ]
    },
    "english-setter": {
      summary:"The classic speckled patterns are called belton. Standard presentations include blue, orange, lemon and liver belton, plus tricolor.",
      colors:["Blue Belton","Orange Belton","Lemon Belton","Liver Belton","Tricolor"],
      examples:[
        {label:"Blue Belton",photo:"A English Setter.jpg",query:"adult blue belton English Setter"},
        {label:"Orange Belton",query:"adult orange belton English Setter"},
        {label:"Liver Belton",query:"adult liver belton English Setter"},
        {label:"Tricolor",query:"adult tricolor English Setter"}
      ]
    },
    "old-english-sheepdog": {
      summary:"The body coat is shades of gray, grizzle or blue, with or without white markings.",
      colors:["Gray & White","Grizzle & White","Blue & White"],
      examples:[
        {label:"Gray & White",photo:"Old-English-Sheepdog.jpg",query:"adult gray white Old English Sheepdog"},
        {label:"Blue & White",query:"adult blue white Old English Sheepdog"},
        {label:"Grizzle & White",query:"adult grizzle white Old English Sheepdog"}
      ]
    },
    "american-cocker-spaniel": {
      summary:"The standard groups colors as Black, ASCOB (any solid color other than black), and Parti-Color; tan points may occur in permitted patterns.",
      colors:["Black","ASCOB","Parti-Color","Black & Tan"],
      examples:[
        {label:"Black",query:"adult black American Cocker Spaniel"},
        {label:"ASCOB / Buff",photo:"An American Cocker Spaniel.jpg",query:"adult buff American Cocker Spaniel"},
        {label:"Parti-Color",query:"adult parti color American Cocker Spaniel"},
        {label:"Black & Tan",query:"adult black tan American Cocker Spaniel"}
      ]
    },
    "cairn-terrier": {
      summary:"Any color except white is permitted; brindle and dark points are common in the breed.",
      colors:["Wheaten","Red","Brindle","Gray / Silver","Near Black"],
      examples:[
        {label:"Wheaten",photo:"Cairn terrier.jpg",query:"adult wheaten Cairn Terrier"},
        {label:"Red",query:"adult red Cairn Terrier"},
        {label:"Brindle",query:"adult brindle Cairn Terrier"},
        {label:"Gray",query:"adult gray Cairn Terrier"}
      ]
    },
    "italian-greyhound": {
      summary:"A broad range of solid colors and white markings occur; brindle and classic black-and-tan patterning are not standard.",
      colors:["Gray / Blue","Fawn","Red","Black","Cream / White-marked"],
      examples:[
        {label:"Gray / Blue",photo:"000 Charcik Włoski - niebieski.jpg",query:"adult blue Italian Greyhound"},
        {label:"Fawn",query:"adult fawn Italian Greyhound"},
        {label:"Black",query:"adult black Italian Greyhound"},
        {label:"White-marked",photo:"Italian Greyhound (1).jpg",query:"adult white marked Italian Greyhound"}
      ]
    },
    "miniature-pinscher": {
      summary:"Breed-standard colors are solid clear red, stag red, black & rust, and chocolate & rust.",
      colors:["Clear Red","Stag Red","Black & Rust","Chocolate & Rust"],
      examples:[
        {label:"Clear Red",photo:"Miniature Pinscher Female Dog.png",query:"adult red Miniature Pinscher"},
        {label:"Stag Red",query:"adult stag red Miniature Pinscher"},
        {label:"Black & Rust",photo:"Black and rust purebred female miniature pinscher.jpg",query:"adult black rust Miniature Pinscher"},
        {label:"Chocolate & Rust",query:"adult chocolate rust Miniature Pinscher"}
      ]
    }
  };

  function applyData() {
    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id,spec] of Object.entries(EXACT_GALLERIES)) CURATED_GALLERY[id] = spec.sides.slice();
      if (CURATED_GALLERY["standard-poodle"]) {
        CURATED_GALLERY["standard-poodle"][0] = "Black Poodle (51050630428).jpg";
      }
    }

    if (typeof AKC_VARIATIONS !== "undefined") {
      for (const [id,spec] of Object.entries(VARIATIONS)) AKC_VARIATIONS[id] = spec;
      const poodle = AKC_VARIATIONS["standard-poodle"];
      const black = poodle?.examples?.find(item => item.label === "Black");
      if (black) black.photo = "Black Poodle (51050630428).jpg";
    }
  }

  function exactFigure(fileName, alt, className="photo") {
    const figure=document.createElement("figure");
    figure.className=className;
    figure.dataset.galleryPhoto="";
    figure.tabIndex=0;
    const media=document.createElement("div"); media.className="photo-media";
    const img=document.createElement("img"); img.src=commonsImage(fileName,1200); img.alt=alt; media.appendChild(img);
    const caption=document.createElement("figcaption"); caption.className="photo-credit";
    const link=document.createElement("a"); link.href=commonsPage(fileName); link.target="_blank"; link.rel="noopener"; link.textContent="Wikimedia Commons source"; caption.appendChild(link);
    figure.append(media,caption); return figure;
  }

  function renderExactGallery(breed) {
    const spec=EXACT_GALLERIES[breed?.id];
    const gallery=document.getElementById("gallery");
    if (!spec || !gallery) return;
    gallery.innerHTML="";
    gallery.appendChild(exactFigure(spec.main,breed.name,"photo photo-main"));
    for (const fileName of spec.sides) gallery.appendChild(exactFigure(fileName,`${breed.name} photo`));
    gallery.dataset.interactive="";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function installExactLoader() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__reviewLocked) return;
    const original=loadBreedGallery;
    const replacement=async function(breed){
      if (!breed || !EXACT_GALLERIES[breed.id]) return original(breed);
      renderExactGallery(breed);
    };
    replacement.__reviewLocked=true;
    loadBreedGallery=replacement;
  }

  function currentBreed(){
    const match=location.hash.match(/^#breed\/(.+)$/);
    if (!match || typeof BREEDS === "undefined") return null;
    return BREEDS.find(item=>item.id===match[1]) || null;
  }

  function afterRoute(){
    const breed=currentBreed();
    if (breed && EXACT_GALLERIES[breed.id]) renderExactGallery(breed);
  }

  applyData();
  installExactLoader();
  if (typeof route === "function") route();
  setTimeout(afterRoute,0);
  setTimeout(afterRoute,500);
  window.addEventListener("hashchange",()=>{setTimeout(afterRoute,0);setTimeout(afterRoute,500);});
})();
