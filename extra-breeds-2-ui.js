(() => {
  const GALLERIES = {
    "belgian-malinois": {
      main:"Belgian Malinois.jpg",
      sides:["Belgian Malinois 01.jpg","02014. Hundeausstellung in Sanok.JPG","20150724 libramont258.JPG"]
    },
    "chesapeake-bay-retriever": {
      main:"Brown Chesapeake Bay Retriever.jpg",
      sides:["Brown Chesapeake Bay Retriever 2.jpg","Bas 20060903 021.JPG","Cheaspeake baj retriever 76.jpg"]
    },
    "flat-coated-retriever": {
      main:"Flatcoated Retriever.jpg",
      sides:["FLAT COATED RETRIEVER.jpg","Flat coated retriever.JPG","Flat Coated Retriever.jpg"]
    },
    "nova-scotia-duck-tolling-retriever": {
      main:"Volwassen teef met witte accentkleur.jpg",
      sides:["1 Dog Show.jpg","2 Tollers in the water.JPG","Wikipedia article reuse, Cheshire Game and Country Fair 2014.jpg"]
    },
    "giant-schnauzer": {
      main:"GiantSchnauzer.jpg",
      sides:["Bvdb-riesen schnauzer.jpg","Devil Denny Goldest Danubius.jpg","Stablemaster's NORTHERN HOPE(Poznan2006).jpg"]
    },
    "keeshond": {
      main:"Keeshond.jpg",
      sides:["Cooper -keeshond.JPG","2014 Westminster Kennel Club Dog Show (12451637615).jpg","Duffy Bishop 2010-08-15 - 12.jpg"]
    },
    "australian-kelpie": {
      main:"Australian Kelpie portrait.jpg",
      sides:["Auskel-choco.jpg","Australian Kelpie black.JPG","Australien Kelpie.jpg"]
    }
  };

  const VARIATIONS = {
    "belgian-malinois": {
      summary:"Typical standard coloring runs from fawn to mahogany with black-tipped hairs, a black mask and black ears.",
      colors:["Fawn","Fawn Sable","Mahogany","Red","Red Sable"],
      examples:[
        {label:"Fawn / Mahogany",photo:"Belgian Malinois.jpg",query:"adult Belgian Malinois fawn mahogany"},
        {label:"Fawn with black overlay",photo:"Belgian Malinois 01.jpg",query:"adult Belgian Malinois black overlay"}
      ]
    },
    "chesapeake-bay-retriever": {
      summary:"Breed-standard colors are shades of brown, sedge and deadgrass, chosen to blend naturally into working environments.",
      colors:["Brown","Sedge","Deadgrass"],
      examples:[
        {label:"Brown",photo:"Brown Chesapeake Bay Retriever.jpg",query:"adult brown Chesapeake Bay Retriever"},
        {label:"Deadgrass",photo:"Head of Deadgrass Chesapeake Bay Retriever.jpg",query:"adult deadgrass Chesapeake Bay Retriever"}
      ]
    },
    "flat-coated-retriever": {
      summary:"Breed-standard colors are solid black or solid liver.",
      colors:["Black","Liver"],
      examples:[
        {label:"Black",photo:"Flatcoated Retriever.jpg",query:"adult black Flat-Coated Retriever"},
        {label:"Liver",photo:"Flat coated retriever.JPG",query:"adult liver Flat-Coated Retriever"}
      ]
    },
    "nova-scotia-duck-tolling-retriever": {
      summary:"The coat is various shades of red or orange, often with white markings on the feet, chest, tail tip or blaze.",
      colors:["Red / Orange","Red / Orange with white markings"],
      examples:[
        {label:"Red with white markings",photo:"Volwassen teef met witte accentkleur.jpg",query:"adult Nova Scotia Duck Tolling Retriever red white"},
        {label:"Red / Orange",photo:"1 Dog Show.jpg",query:"adult Nova Scotia Duck Tolling Retriever red"}
      ]
    },
    "giant-schnauzer": {
      summary:"The principal breed-standard colors are solid black and pepper & salt.",
      colors:["Black","Pepper & Salt"],
      examples:[
        {label:"Black",photo:"GiantSchnauzer.jpg",query:"adult black Giant Schnauzer"},
        {label:"Pepper & Salt",photo:"Suursnautseripippurijasuola.jpg",query:"adult pepper salt Giant Schnauzer"}
      ]
    },
    "keeshond": {
      summary:"Keeshonden have a characteristic mixture of gray, black and cream with distinctive facial spectacles rather than separate color varieties.",
      colors:["Gray, Black & Cream"],
      examples:[{label:"Gray, Black & Cream",photo:"Keeshond.jpg",query:"adult Keeshond"}],
      noVariations:true
    },
    "australian-kelpie": {
      summary:"Recognized colors include black, chocolate, red, smoky blue, fawn, black & tan and red & tan.",
      colors:["Black","Chocolate","Red","Smoky Blue","Fawn","Black & Tan","Red & Tan"],
      examples:[
        {label:"Black",photo:"Australian Kelpie black.JPG",query:"adult black Australian Kelpie"},
        {label:"Chocolate",photo:"Australian Kelpie chocolate brown.jpg",query:"adult chocolate Australian Kelpie"},
        {label:"Red & Tan",photo:"Australien Kelpie.jpg",query:"adult red tan Australian Kelpie"}
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
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__extraBreeds2Locked) return;
    const original=loadBreedGallery;
    loadBreedGallery=async function(breed) {
      if (breed && GALLERIES[breed.id]) return renderExactGallery(breed);
      return original(breed);
    };
    loadBreedGallery.__extraBreeds2Locked=true;
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