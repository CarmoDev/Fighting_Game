const canvas = document.querySelector('canvas');
const displayText = document.querySelector('#displayText')

const ctx = canvas.getContext('2d');

const width = canvas.width = 1024;
const height = canvas.height = 576;

ctx.fillRect(0, 0, width, height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './assets/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './assets/shop.png',
  scale: 2.75,
  framesMax: 6 
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './assets/samuraiMack/idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './assets/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './assets/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './assets/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './assets/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './assets/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './assets/samuraiMack/TakeHitWhite.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './assets/samuraiMack/Death.png',
      framesMax: 6,
    }
  },
  attackBox: {
    offset: {
      x: 70,
      y: 50,
    },
    width: 150,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: './assets/kenji/idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './assets/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './assets/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './assets/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './assets/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './assets/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './assets/kenji/TakeHit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './assets/kenji/Death.png',
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -150,
      y: 50,
    },
    width: 150,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  ctx.fillRect(0, 0, width, height)
  background.update()
  shop.update()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player Movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // Jumping
  if(player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if(player.velocity.y > 0) {
    player.switchSprite('fall')
  }
  
  // Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // Jumping
  if(enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if(enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // Check collision && enemy gets hit
  if(
   rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
   })
    && player.isAttacking
    && player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false
      document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }
  
  // Check collision && player gets hit
  if(
   rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
   })
    && enemy.isAttacking
    && enemy.framesCurrent === 2
    ) {
      player.takeHit()
      document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  // ifenemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // End game based on health
  if(enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if(!player.dead)
  switch(event.key) {
    case 'd': 
      keys.d.pressed = true;
      player.lastKey = 'd'
      break
    case 'a': 
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w': 
      player.velocity.y = -20
      break
    case ' ':
      player.attack()
      break
  }

  // Enemy
  if(!enemy.dead)
  switch(event.key) {
    case 'ArrowRight': 
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft': 
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp': 
      enemy.velocity.y = -20
      break
    case 'ArrowDown':
      enemy.attack()
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'd': 
      keys.d.pressed = false
      break
    case 'a': 
      keys.a.pressed = false;
      break
  }
  
  
// Enemy  
  switch(event.key) {
    case 'ArrowLeft': 
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowRight': 
      keys.ArrowRight.pressed = false;
      break
  }
})