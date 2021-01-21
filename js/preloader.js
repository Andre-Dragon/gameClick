document.body.onload = () => {
  'use strict';

  const $appPreloader = document.getElementById( 'app__preloader' );

  let images = document.images,
    imagesCount = images.length,
    loadedImg = 0;

    function imageLoaded() { 
      loadedImg++;

      if ( loadedImg >= imagesCount ) {
        setTimeout( () => {
          if ( !$appPreloader.classList.contains( 'done' ) ) {
            $appPreloader.classList.add( 'done' );
          }
        }, 1000 );
      }
      
    }

    for ( let i = 0; i < imagesCount; i++ ) {
      const imageCopy = new Image();
      imageCopy.src = images[i].src;
      imageCopy.onload = imageLoaded;
      imageCopy.onerror = imageLoaded;
    }

};