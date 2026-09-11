(() => {
  const mainPhotos = {
    "standard-poodle": "Tapsi Miniature Poodle Galloping Extension Harangi Coorg Apr24 A7C 10647.jpg",
    "portuguese-water-dog": "Obama family dog in the Rose Garden (cropped).jpg"
  };

  if (typeof BREEDS !== "undefined") {
    for (const breed of BREEDS) {
      if (mainPhotos[breed.id]) breed.photo = mainPhotos[breed.id];
    }
  }

  if (typeof route === "function") route();
})();
