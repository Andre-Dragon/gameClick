document.addEventListener( 'DOMContentLoaded', () => {
  
  const $start = document.getElementById( 'start' );
  const $end = document.getElementById( 'end' );
  const $game = document.getElementById( 'game' );
  const $time = document.getElementById( 'time' );
  const $gameTime = document.getElementById( 'game-time' );
  const $result = document.getElementById( 'result' );
  const $timeHeader = document.getElementById( 'time-header' );
  const $resultHeader = document.getElementById( 'result-header' );
 
  const imagesBox = ['590-4', '622-3', '546-2', '623-5', '588-11', '590-12', '566-17', '620-18', '609-23', '553-25', '603-27', '601-29', '652-30', '592-31', '592-38', '622-37', '586-35', '623-36', '598-40', '643-32'];
  
  let score = 0;
  let isStarted = false;
  
  // рандомный размер блока
  function getRandom( min, max ) {
    return Math.floor( Math.random() * ( max - min ) + min );
  }

  // создание блока
  function renderBox() {
    
    $game.innerHTML = '';
    
    let box = document.createElement( 'div' ); // создаем div
    let boxSize = getRandom( 30, 100 );
    let gameSize = $game.getBoundingClientRect();
    let maxTop = gameSize.height - boxSize;
    let maxLeft = gameSize.width - boxSize;
    let randomColorIndex = getRandom( 0, imagesBox.length );
    
    box.setAttribute( 'data-box', true );
    box.style.width = box.style.height = boxSize + 'px';
    box.style.position = 'absolute';
    box.style.backgroundColor = '#fad64e';
    box.style.backgroundImage = `url(https://cdn.fishki.net/upload/post/2019/09/20/3091342/1568622${imagesBox[randomColorIndex]}.jpg)`;
    box.style.backgroundRepeat = 'no-repeat';
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
    box.style.border = '1px solid #fff';
    box.style.top = getRandom( 0, maxTop ) + 'px';
    box.style.left = getRandom( 0, maxLeft ) + 'px';
    box.style.borderRadius = '50px';
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
    setGameScore()  
    $game.innerHTML = '';
    hide( $timeHeader );
    show( $resultHeader );
    show( $end );
    
    setTimeout(() => {
        $gameTime.removeAttribute( 'disabled' );
        show( $start );
        hide( $end );
    }, 2000);
    
  }
  
  // старт игры
  function startGame() {
    
    isStarted = true;
    score = 0;
    $gameTime.setAttribute( 'disabled', true );
    setGameTime();
    
    hide( $start );
    
    const interval = setInterval( () => {
      
      let time = parseFloat( $time.textContent );
      
      if ( time <= 0 ) {
        // end game
        clearInterval( interval );
        endGame();
      } else {
        $time.textContent = ( time - .1 ).toFixed( 1 );
      }
      
    }, 100);
    
    renderBox();
    
  }
  
  // отлавливаем клик по блоку
  function handleBoxClick( event ) {
    
    const target = event.target;
    if ( !isStarted ) return;
 
    if ( target.dataset.box ) {
      score++;
      renderBox();
      
    }
  }
  
  $start.addEventListener( 'click', startGame );
  $game.addEventListener( 'click', handleBoxClick );
  $gameTime.addEventListener( 'input', setGameTime );
  
});