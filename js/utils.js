function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    displayText.style.display = 'flex'
    if (player.health === enemy.health) {
      displayText.innerHTML = `
        <h2>TIE</h2>
        `
    }
    
    if (player.health > enemy.health) {
      displayText.innerHTML = `
        <h2>Player 1 WINS!</h2>
        `
   }
  
   if (enemy.health > player.health) {
      displayText.innerHTML = `
        <h2>Player 2 WINS!</h2>
        `
   }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if(timer === 0) {
    determineWinner({player, enemy})
  }
}