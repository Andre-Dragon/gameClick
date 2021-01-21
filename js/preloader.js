document.body.onload = () => {
  'use strict';

  const $appLoader = document.getElementById( 'app__loader' );

  let images = document.images,
    imagesCount = images.length,
    loadedImg = 0;

    function imageLoaded() { 
      loadedImg++;

      if ( loadedImg >= imagesCount ) {
        setTimeout( () => {
          if ( !$appLoader.classList.contains( 'done' ) ) {
            $appLoader.classList.add( 'done' );
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