document.addEventListener( 'DOMContentLoaded', () => {
  'use strict';

  const $start = document.getElementById( 'start' );
  const $end = document.getElementById( 'end' );
  const $game = document.getElementById( 'game' );
  const $time = document.getElementById( 'time' );
  const $gameTime = document.getElementById( 'game-time' );
  const $btnMinus = document.getElementById( 'btn__minus' );
  const $btnPlus = document.getElementById( 'btn__plus' );
  const $result = document.getElementById( 'result' );
  const $timeHeader = document.getElementById( 'time-header' );
  const $resultHeader = document.getElementById( 'result-header' );
  const $entranceDescription = document.getElementById( 'entrance__description' );
  const $entranceQuestion = document.getElementById( 'entrance__question' );
  const $questionBtn = document.getElementById( 'question__btn' );
  const $entranceBtn = document.getElementById( 'entrance__btn' );
  const $appEntrance = document.getElementById( 'app__entrance' );
  const $appLoader = document.getElementById( 'app__loader' );
  const $appGame = document.getElementById( 'app__game' );

  const $appCarousel = document.querySelector( '.app__carousel' );
  const $slides = document.querySelectorAll( '.app__slide' );
  // const btnPrev = document.querySelector( '.slider__btn--prev' );
  // const btnNext = document.querySelector( '.slider__btn--next' );
  
  const $printAudio = new Audio('./audio/print.mp3');
  const $boxYesAudio = new Audio('./audio/yes.mp3');
  const $boxNoAudio = new Audio('./audio/no.mp3');
  const $endAudio = new Audio('./audio/end.mp3');
  const $fonAudio = new Audio('./audio/fon.mp3');
  const $loaderAudio = new Audio('./audio/loader.mp3');
  const $clickAudio = new Audio('./audio/click.mp3');
  const $textAudio = new Audio('./audio/text.mp3');

  $fonAudio.loop = true;
  $fonAudio.volume = 0.3;
  $endAudio.volume = 0.4;
  $printAudio.volume = 0.5;
  $textAudio.volume = 0.7;
  $clickAudio.volume = 0.5;
  $loaderAudio.volume = 0.6;
  $boxYesAudio.volume = 0.4;
  $boxNoAudio.volume = 0.4;

  const strText =  [
    'Привет, игрок!\n',
    'Это игра “Кликсики!” Для\n',
    'продолжения нажми кнопку \n',
    '“Ок” и далее кнопку “Начать”.\n',
    'Время игры можно изменять.\n',
  ];

  const imagesBox = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, ];

  const colorsBox = [ '#FF0000', '#0000FF', '#FF1493', '#008000', '#7FFF00', '#808000', '#00FFFF',
'#48D1CC', '#FF4500', '#2F4F4F', '#800080', '#A52A2A', '#4B0082', '#32CD32', '#191970', ];

  const $minNum = 5;
  const $maxNum = 999;
  
  let score = 0;
  let isStarted = false;
  let total = $gameTime.value; 

  let curSlide = 0;
  let timer;
  const maxSlide = $slides.length;

  // печетать текст
  function writeTextByJS( id, text, speed ) {

    const elem = document.getElementById( id ),
      txt = text.join('').split('');

    const interval = setInterval( function () {

      if ( !txt[0] ) {
        $printAudio.pause();
        $entranceBtn.classList.add( 'animate__modal' );
        return clearInterval( interval );
      }
      $printAudio.play();
      elem.innerHTML += txt.shift();
    }, speed !== undefined ? speed : 60 );

    return false;
    
  }
    
  // загрузка страницы
  function loaderPageGame() {
    $appEntrance.classList.add('hide');
    $appLoader.classList.remove('hide');
    $clickAudio.play();
    $loaderAudio.play();
    setTimeout( () => {
      $appLoader.classList.add('hide');
      $appGame.classList.remove('hide');
      $loaderAudio.pause();
      $fonAudio.play();
    }, 2100);
  }

  // рандомный размер блока
  function getRandom( min, max ) {
    return Math.floor( Math.random() * ( max - min ) + min );
  }

  // создание блока
  function renderBox() {
    
    $game.innerHTML = '';
    
    let box = document.createElement( 'div' ); // создаем div
    let boxSize = getRandom( 40, 100 );
    let gameSize = $game.getBoundingClientRect();
    let maxTop = gameSize.height - boxSize;
    let maxLeft = gameSize.width - boxSize;
    let randomColorIndex = getRandom( 0, colorsBox.length );
    let randomImageIndex = getRandom( 0, imagesBox.length );
    
    box.setAttribute( 'data-box', true );
    box.style.width = box.style.height = boxSize + 'px';
    box.style.position = 'absolute';
    box.style.backgroundImage = `url(./images/smails/smiley-${imagesBox[randomImageIndex]}.png)`;
    box.style.backgroundRepeat = 'no-repeat';
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
    box.style.backgroundColor = colorsBox[randomColorIndex];
    box.style.border = '2px solid #fff';
    box.style.boxSizing = 'border-box';
    box.style.borderRadius = '50%';
    box.style.top = getRandom( 0, maxTop ) + 'px';
    box.style.left = getRandom( 0, maxLeft ) + 'px';
    box.style.cursor = 'pointer';
    
    $game.insertAdjacentElement( 'afterbegin', box ); // добавляем в dom наш блок    
  }
  
  // скрыть елемент
  function hide( $el ) {
    $el.classList.add( 'hide' );
  }
  
  // показать елемент
  function show( $el ) {
    $el.classList.remove( 'hide' );
  }
  
  // вывод результата
  function setGameScore() {
    
    $result.textContent = score.toString();
    
  }
  
  // время для игры
  function setGameTime() {
    
    let time = +$gameTime.value;
    $time.textContent = time.toFixed(1);
    
    show( $timeHeader );
    hide( $resultHeader );
    
  }
  
  // конец игры
  function endGame() {
    
    isStarted = false;
    $appCarousel.classList.remove( 'hide' );
    setGameScore();
    $endAudio.play();
    $game.innerHTML = '';
    hide( $timeHeader );
    show( $resultHeader );
    show( $end );
    
    setTimeout(() => {
      $fonAudio.play();
      $gameTime.style.color = '#fff';
      $gameTime.disabled = false;
      $btnPlus.disabled = false;
      $btnMinus.disabled= false;
      show( $start );
      hide( $end );
    }, 3000);
    
  }
  
  // старт игры
  function startGame() {
    
    isStarted = true;
    score = 0;
    $appCarousel.classList.add( 'hide' );
    $gameTime.style.color = '#ccc';
    $gameTime.disabled = true;
    $btnPlus.disabled = true;
    $btnMinus.disabled = true;
    setGameTime();
    $fonAudio.pause();
    $fonAudio.currentTime = 0;
    $clickAudio.play();
    
    hide( $start );
    
    const interval = setInterval( () => {
      
      let time = parseFloat( $time.textContent );
      
      if ( time <= 0 ) {
        // end game
        clearInterval( interval );
        endGame();
      } else {
        $time.textContent = ( time - 0.1 ).toFixed( 1 );
      }
      
    }, 100);
    
    renderBox();
    
  }
  
  // отлавливаем клик по блоку
  function handleBoxClick( event ) {
    
    const target = event.target;
    if ( !isStarted ) return;
 
    if ( target.dataset.box ) {
      
      $boxYesAudio.play();
      $boxYesAudio.currentTime = 0;
      score++;
      renderBox();
    } else {
      $boxNoAudio.play();
    }
    
  }

  // Slider
  const goToSlide = ( slide ) => {
    $slides.forEach(
      ( s, i ) => ( s.style.transform = `translateX( ${100 * ( i - slide )}% )` )
    );
  };

  // Next slide
  const autoSlaiderNext = () => {
    timer = setTimeout( () => {
      clearTimeout( timer );

      if ( curSlide === maxSlide - 1 ) {
        clearTimeout( timer );
        autoSlaiderPrev();
      } else {
        curSlide++;
      }

      autoSlaiderNext();
      goToSlide( curSlide );

    }, 4000 );
  };

  //Prev slide
  const autoSlaiderPrev = () => {
    timer = setTimeout( () => {
      clearTimeout( timer );

      if ( curSlide === 0 ) {
        clearTimeout( timer );
        autoSlaiderNext();
      } else {
        curSlide--;
      }

      autoSlaiderPrev();
      goToSlide( curSlide );
    }, 4000 );
  };

  autoSlaiderNext();
  autoSlaiderPrev();

  const init = () => {
    goToSlide( 0 );
  };

  init();

  // Event handlers
  // btnNext.addEventListener( 'click', nextSlide );
  // btnPrev.addEventListener( 'click', prevSlide );

  // document.addEventListener( 'keydown', function (e) {
  //   if ( e.key === 'ArrowLeft' ) prevSlide();
  //   e.key === 'ArrowRight' && nextSlide();
  // });
  
   // добавление время через кнопки
  $btnPlus.addEventListener( 'click', () => {
    if ( total < $maxNum ) { 
      $gameTime.stepUp(); 
      setGameTime();
      $clickAudio.play();
    }
    });
    
  $btnMinus.addEventListener( 'click', () => {
    if ( total > $minNum ) { 
      $gameTime.stepDown(); 
      setGameTime();
      $clickAudio.play();
    }
    });
    
  // стилизация input 
  $gameTime.addEventListener( 'input', function() { 
    let maxChars = 3; 
    let value= +this.value.replace(/\D/g,'')||0;
	  let min = +this.getAttribute('min');
	  let max = +this.getAttribute('max');

    if ( this.value.length > maxChars ) {
      this.value = this.value.substring( 0, maxChars );
    }

    this.value = Math.min(max, Math.max( min, value ) );
    
    this.value = this.value.replace( /[^\d]/g, ' ' );
  });

  $questionBtn.addEventListener( 'click', () => {
    $entranceQuestion.classList.add('hide');
    $entranceDescription.classList.remove('hide');
    writeTextByJS( 'entrance__text', strText );
    $clickAudio.play();
    $textAudio.play();
  });
  $entranceBtn.addEventListener( 'click', loaderPageGame );
  $start.addEventListener( 'click', startGame );
  $game.addEventListener( 'click', handleBoxClick );
  $gameTime.addEventListener( 'input', setGameTime );
  
});