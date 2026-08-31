(() => {
  const GALLERIES = {
    "norwegian-elkhound": {
      main:"Norwegian Elkhound 1.jpg",
      sides:["Norwegian Elkhound.jpg","Norwegian Elkhound 0006.jpg","Norwegian elkhound puppy.jpg"]
    },
    "finnish-spitz": {
      main:"Finnishspitz1.jpg",
      sides:["Finnish Spitz.jpg","FINNISH SPITZ.jpg","Turku2004 suomenpystykorva.jpg"]
    },
    "border-terrier": {
      main:"A Border terrier.jpg",
      sides:["Border terrier.jpg","Border Terrier Kamu.jpg","Border terrier photograph.jpg"]
    },
    "scottish-terrier": {
      main:"0Scottish Terrier.jpg",
      sides:["A Scottish Terrier.jpg","Scottish terrier .jpg","Black Scottish Terrier.jpg"]
    },
    "welsh-terrier": {
      main:"Welsh Terrier.JPG",
      sides:["A Welsh Terrier.jpg","Welsh Terrier portrait.jpg","Welsh Terrier Image.jpg"]
    }
  };

  const VARIATIONS = {
    "norwegian-elkhound": {
      summary:"The familiar Norwegian Elkhound is gray with black-tipped guard hairs, a darker muzzle and ears, and a lighter undercoat rather than multiple show color varieties.",
      colors:["Gray with black tips"],
      examples:[{label:"Gray",photo:"Norwegian Elkhound 1.jpg",query:"adult gray Norwegian Elkhound"}],
      noVariations:true
    },
    "finnish-spitz": {
      summary:"The breed is golden-red, ranging from pale honey to deep red, with lighter shading on the underparts and furnishings.",
      colors:["Golden Red"],
      examples:[{label:"Golden Red",photo:"Finnishspitz1.jpg",query:"adult Finnish Spitz golden red"}],
      noVariations:true
    },
    "border-terrier": {
      summary:"Breed-standard colors include red, grizzle & tan, blue & tan, and wheaten.",
      colors:["Red","Grizzle & Tan","Blue & Tan","Wheaten"],
      examples:[
        {label:"Red",query:"adult red Border Terrier"},
        {label:"Grizzle & Tan",photo:"A Border terrier.jpg",query:"adult grizzle tan Border Terrier"},
        {label:"Blue & Tan",query:"adult blue tan Border Terrier"},
        {label:"Wheaten",query:"adult wheaten Border Terrier"}
      ]
    },
    "scottish-terrier": {
      summary:"Breed-standard colors include black, wheaten and brindle of any color.",
      colors:["Black","Wheaten","Brindle"],
      examples:[
        {label:"Black",photo:"0Scottish Terrier.jpg",query:"adult black Scottish Terrier"},
        {label:"Wheaten",query:"adult wheaten Scottish Terrier"},
        {label:"Brindle",query:"adult brindle Scottish Terrier"}
      ]
    },
    "welsh-terrier": {
      summary:"The breed-standard jacket is black & tan or black grizzle & tan.",
      colors:["Black & Tan","Black Grizzle & Tan"],
      examples:[
        {label:"Black & Tan",photo:"Welsh Terrier.JPG",query:"adult black tan Welsh Terrier"},
        {label:"Black Grizzle & Tan",query:"adult grizzle tan Welsh Terrier"}
      ]
    }
  };

  function applyData() {
    if (typeof BREEDS !== "undefined") {
      for (const [id,spec] of Object.entries(GALLERIES)) {
        const breed = BREEDS.find(item => item.id === id);
        if (breed) breed.photo = spec.main;
      }
    }
    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id,spec] of Object.entries(GALLERIES)) CURATED_GALLERY[id] = spec.sides.slice();
    }
    if (typeof AKC_VARIATIONS !== "undefined") {
      for (const [id,spec] of Object.entries(VARIATIONS)) AKC_VARIATIONS[id] = spec;
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
    figure.append(media,caption);
    return figure;
  }

  function renderExactGallery(breed) {
    const spec=GALLERIES[breed?.id];
    const gallery=document.getElementById("gallery");
    if (!spec || !gallery) return;
    gallery.innerHTML="";
    gallery.appendChild(exactFigure(spec.main,breed.name,"photo photo-main"));
    for (const fileName of spec.sides) gallery.appendChild(exactFigure(fileName,`${breed.name} photo`));
    gallery.dataset.interactive="";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function installLoader() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__extraBreeds3Locked) return;
    const original=loadBreedGallery;
    loadBreedGallery=async function(breed) {
      if (breed && GALLERIES[breed.id]) return renderExactGallery(breed);
      return original(breed);
    };
    loadBreedGallery.__extraBreeds3Locked=true;
  }

  function currentBreed() {
    const match=location.hash.match(/^#breed\/(.+)$/);
    if (!match || typeof BREEDS === "undefined") return null;
    return BREEDS.find(item => item.id === match[1]) || null;
  }

  function afterRoute() {
    const breed=currentBreed();
    if (breed && GALLERIES[breed.id]) renderExactGallery(breed);
  }

  applyData();
  installLoader();
  const current=currentBreed();
  if (current && GALLERIES[current.id] && typeof route === "function") route();
  setTimeout(afterRoute,0);
  setTimeout(afterRoute,400);
  window.addEventListener("hashchange",()=>{setTimeout(afterRoute,0);setTimeout(afterRoute,400);});
})();