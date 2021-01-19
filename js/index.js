document.addEventListener( 'DOMContentLoaded', () => {
  'use strict';

  // id основные
  const $start = document.getElementById( 'start' );
  const $end = document.getElementById( 'end' );
  const $endIcon = document.getElementById( 'end__icon' );
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

  // слайдер
  const $appCarousel = document.querySelector( '.app__carousel' );
  const $slides = document.querySelectorAll( '.app__slide' );

  // модульное окно сложности в игре
  const $appLevelWrap = document.querySelector( '.app__level--wrap' );
  const $appLevelBtn = document.querySelector( '.app__level--btn' );
  const $levelImgOpen = document.querySelector( '.level__img--open' );
  const $levelImgClose = document.querySelector( '.level__img--close' );
  const $formFieldset = document.querySelector( '.form__fieldset' );

  // кнопки выход 
  const $appContent = document.querySelector( '.app__content' );
  
  // аудио
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

  // рандом изображения и цвета
  const imagesBox = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, ];

  const colorsBox = [ '#FF0000', '#0000FF', '#FF1493', '#008000', '#7FFF00', '#808000', '#00FFFF',
'#48D1CC', '#FF4500', '#2F4F4F', '#800080', '#A52A2A', '#4B0082', '#32CD32', '#191970', ];

  // запрет ввода в input
  const invalidChars = [ '-', '+', 'e', '.', ',' ];

  const setting = {
    start: false,
    score: 0, 
    min: 40,
    max: 100,
  };

  let curSlide = 0;
  let timer;
  const maxSlide = $slides.length;

  let minNum = +$gameTime.getAttribute('min');
  let maxNum = +$gameTime.getAttribute('max');

  // печетать текст
  const writeTextByJS = ( id, text, speed ) => {

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
    }, speed !== undefined ? speed : 70 );

    return false;
    
  };
    
  // загрузка страницы
  const loaderPageGame = () => {
    hide( $appEntrance );
    show( $appLoader );
    $clickAudio.play();
    $loaderAudio.play();

    setTimeout( () => {
      hide(  $appLoader );
      show(  $appGame );
      $loaderAudio.pause();
      $loaderAudio.currentTime = 0;
      $fonAudio.play();
    }, 2100);
  };

  // рандомный размер блока
  const getRandom = ( min, max ) => {
    return Math.floor( Math.random() * ( max - min ) + min );
  };

  // создание блока
  const renderBox = () => {
    
    $game.innerHTML = '';
    
    let box = document.createElement( 'div' ); // создаем div
    let boxSize = getRandom( setting.min, setting.max );
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
  };

  /* Уровень сложности */
  const gameLevel = event => {
    const target = event.target;
    if ( target === $formFieldset ) return;
    switch ( target.id ) {
      case 'classic':
        setting.min = 30; 
        setting.max = 90; 
        break; 
      case 'ease':
        setting.min = 60; 
        setting.max = 100;
        break; 
      case 'middle':
        setting.min = 40; 
        setting.max = 80;
        break;   
      case 'hard':
        setting.min = 20; 
        setting.max = 60;
        break;
      default:
        $clickAudio.play();
        break;
    }
  };
  
  // скрыть елемент
  const hide = ( $el ) => {
    $el.classList.add( 'hide' );
  };
  
  // показать елемент
  const show = ( $el ) => {
    $el.classList.remove( 'hide' );
  };
  
  // вывод результата
  const setGameScore = () => {
    $result.textContent = setting.score.toString();
  };

  // кнопки + и - disabled
  const btnDisabledPlus = () => {
    $btnPlus.disabled = ( +$gameTime.value >= maxNum ) ? true : null;
  };
  btnDisabledPlus();

  const btnDisabledMunus = () => {
    $btnMinus.disabled = ( +$gameTime.value <= minNum ) ? true : null;
  };
  btnDisabledMunus();

  // время для игры
  const setGameTime = () => {

    let time = +$gameTime.value;
    $time.textContent = time.toFixed(1);
  
    show( $timeHeader );
    hide( $resultHeader );
    
  };

  // добавление и убавление времени через кнопки
  const addGameTime = () => {
    if ( +$gameTime.value <= maxNum ) {
      $gameTime.stepUp(); 
      setGameTime();
      $clickAudio.play();
      $btnMinus.disabled = false;
    }
    btnDisabledPlus();
  };

  const removeGameTime = () => {
    if ( +$gameTime.value >= minNum ) { 
      $gameTime.stepDown(); 
      setGameTime();
      $clickAudio.play();
      $btnPlus.disabled = false;
    }
    btnDisabledMunus();
  };

  // открытие и закрытие модульного окна сложности в игре
  const openFormModal = () => {
    
    if ( !$appLevelWrap.classList.contains( 'animate__level--open' ) ) {
      $appLevelWrap.classList.add( 'animate__level--open');
      $appLevelWrap.classList.remove( 'animate__level--close');
      $appLevelBtn.classList.add( 'animate--level__btn--right' );
      $appLevelBtn.classList.remove( 'animate--level__btn--left' );
      $loaderAudio.play();
      hide( $levelImgOpen );
      show( $levelImgClose );
      setTimeout( () => {
        $loaderAudio.pause();
        $loaderAudio.currentTime = 0;
      }, 1000 );

    } else if ( !$appLevelWrap.classList.contains( 'animate__level--close' ) ) {
      $appLevelWrap.classList.add( 'animate__level--close');
      $appLevelWrap.classList.remove( 'animate__level--open');
      $appLevelBtn.classList.remove( 'animate--level__btn--right' );
      $appLevelBtn.classList.add( 'animate--level__btn--left' );
      $loaderAudio.play();
      hide( $levelImgClose );
      show( $levelImgOpen );
      setTimeout( () => {
        $loaderAudio.pause();
        $loaderAudio.currentTime = 0;
      }, 1000 );
    } 

  };

  // конец игры
  const endGame = () => {
    
    setting.start = false;
    setGameScore();
    $endAudio.play();
    $game.innerHTML = '';
    hide( $timeHeader );
    show( $resultHeader );
    show( $end );
    show( $endIcon );
    show( $appCarousel );
    $end.disabled = true;
    $endIcon.disabled = true;

    setTimeout( () => {
      $end.disabled = false;
      $endIcon.disabled = false;
    }, 2000);

  };

  // выход в меню
  const exitGame = () => {
    $clickAudio.play();
    $fonAudio.play();
    $gameTime.style.color = '#fff';
    $gameTime.disabled = false;
    $btnPlus.disabled = false;
    $btnMinus.disabled= false;
    show( $start );
    hide( $end );
    hide( $endIcon );
    show( $appLevelWrap );
    show( $appLevelBtn );
    btnDisabledPlus();
    btnDisabledMunus();
  };
  
  // старт игры
  const startGame = () => {
    
    setting.start = true;
    setting.score = 0;
    $gameTime.style.color = '#ccc';
    $gameTime.disabled = true;
    $btnPlus.disabled = true;
    $btnMinus.disabled = true;
    setGameTime();
    $fonAudio.pause();
    $fonAudio.currentTime = 0;
    $clickAudio.play();
    hide( $appCarousel );
    hide( $start );
    hide( $appLevelWrap );
    hide( $appLevelBtn );
    $appLevelWrap.classList.remove( 'animate__level--open');
    $appLevelWrap.classList.remove( 'animate__level--close');
    $appLevelBtn.classList.remove( 'animate--level__btn--right' );
    $appLevelBtn.classList.remove( 'animate--level__btn--left' );
    hide( $levelImgClose );
    show( $levelImgOpen );
    $loaderAudio.pause();
    $loaderAudio.currentTime = 0;
    
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
    
  };
  
  // отлавливаем клик по блоку
  const handleBoxClick = event => {
    
    const target = event.target;
    if ( !setting.start ) return;
 
    if ( target.dataset.box ) {
      
      $boxYesAudio.play();
      $boxYesAudio.currentTime = 0;
      setting.score++;
      renderBox();
    } else {
      $boxNoAudio.play();
    }
    
  };

  // слайдер
  const goToSlide = slide => {
    $slides.forEach(
      ( s, i ) => ( s.style.transform = `translateX( ${100 * ( i - slide )}% )` )
    );
  };

  // следующий слайд
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

  // предыдущий слайд
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

  // стилизация input
  $gameTime.addEventListener( 'input', function() {
    let maxChars = 2; 

    this.value = this.value.replace( /[e\+\-\.\,]/gi, '' );

    if ( this.value.length > maxChars ) {
      this.value = this.value.substring( 0, maxChars );
    }

  });

  $gameTime.addEventListener( 'change', function() {
    let value = this.value.replace( /\D/g, '' ) || 0;
    this.value = Math.min( maxNum, Math.max( minNum, value ) );
    btnDisabledMunus();
    btnDisabledPlus();
    setGameTime();
  });

  $gameTime.addEventListener( 'keydown', event => {
    if ( invalidChars.includes( event.key ) ) {
      event.preventDefault();
    }
  });

  // Запуск модельного окна
  $questionBtn.addEventListener( 'click', () => {
    hide( $entranceQuestion );
    show( $entranceDescription );
    writeTextByJS( 'entrance__text', strText );
    $clickAudio.play();
    $textAudio.play();
  });

  $appContent.addEventListener( 'click', event => {
    const target = event.target;
    if ( target.classList.contains( 'btn__end' ) || 
    target.classList.contains( 'btn__end--icon' ) ) {
      exitGame();
    }
  });
  
  $entranceBtn.addEventListener( 'click', loaderPageGame );
  $start.addEventListener( 'click', startGame );
  $game.addEventListener( 'click', handleBoxClick );
  $btnPlus.addEventListener( 'click', addGameTime ); 
  $btnMinus.addEventListener( 'click', removeGameTime );
  $appLevelBtn.addEventListener( 'click', openFormModal );
  $formFieldset.addEventListener( 'click', gameLevel );
});