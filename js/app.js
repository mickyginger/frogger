const width = 9
const grid = document.querySelector('.grid')
const cells = []
let currentIndex = 76
let frogsSaved = 0
let gameIsOver = false

const timers = []

function gameOver() {
  gameIsOver = true
  timers.forEach(id => clearInterval(id))
}

for(let i = 0; i<width*width; i++) {
  const cell = document.createElement('DIV')

  if(i === currentIndex) cell.classList.add('frog')
  if([1,3,5,7].includes(i)) cell.classList.add('lilypad')

  if(i >= 9 && i <= 35) cell.classList.add('water')
  if(i >= 45 && i <= 71) cell.classList.add('road')

  cells.push(cell)
  grid.appendChild(cell)
}

function stopTimer(id) {
  const timerIndex = timers.indexOf(id)
  timers.splice(timerIndex, 1)
  return clearInterval(id)
}

function startTimer(func, delay) {
  const id = setInterval(func, delay)
  timers.push(id)
  return id
}

function moveFrog(dir) {
  cells[currentIndex].classList.remove('frog')
  currentIndex += dir
  cells[currentIndex].classList.add('frog')
}

function spawnCar() {
  const startPoints = [53, 62, 71]
  const lane = Math.floor(Math.random() * startPoints.length)
  let carIndex = startPoints[lane]
  cells[carIndex].classList.add('car')
  const speed = 250 * (lane + 1)

  const carTimerId = startTimer(() => {
    cells[carIndex].classList.remove('car')
    if(carIndex % width === 0) return stopTimer(carTimerId)
    carIndex -= 1
    cells[carIndex].classList.add('car')
  }, speed)
}

startTimer(spawnCar, 1000)

function spawnLog() {
  const startPoints = [9, 18, 27]
  const lane = Math.floor(Math.random() * startPoints.length)
  let logIndices = [startPoints[lane]]
  const speed = 250 * lane + 500

  const logTimerId = startTimer(() => {
    logIndices.forEach(index => cells[index].classList.remove('log'))
    if(logIndices[0] % width === width - 1) logIndices.shift()

    if(logIndices.some(index => cells[index].classList.contains('frog'))) {
      moveFrog(1)
    }

    logIndices = logIndices.map(index => index + 1)

    if(logIndices.length < 2 && logIndices[0] % width < width - 1) {
      logIndices.push(logIndices[logIndices.length-1] - 1)
    }

    logIndices.forEach(index => cells[index].classList.add('log'))

    if(logIndices.length === 0) {
      logIndices = null
      stopTimer(logTimerId)
    }
  }, speed)
}

startTimer(spawnLog, 1000)

function checkCollision() {
  if(
    cells[currentIndex].classList.contains('car') ||
    (
      cells[currentIndex].classList.contains('water') &&
      !cells[currentIndex].classList.contains('log')
    )
  ) {
    return gameOver()
  }
}

startTimer(checkCollision, 250)

document.addEventListener('keydown', (e) => {
  if(gameIsOver) return false
  cells[currentIndex].classList.remove('frog')

  switch(e.keyCode) {
    case 37:
      if(currentIndex % width > 0) moveFrog(-1)
      break
    case 38:
      if(currentIndex - width >= 0) moveFrog(-width)
      break
    case 39:
      if(currentIndex % width < width - 1) moveFrog(1)
      break
    case 40:
      if(currentIndex + width < width*width) moveFrog(width)
      break
  }

  if(cells[currentIndex].classList.contains('lilypad')) {
    frogsSaved++

    if(frogsSaved === 4) return gameOver()

    currentIndex = 76
    cells[currentIndex].classList.add('frog')
  }
})

document.addEventListener('keydown', (e) => {
  if([37,38,39,40].includes(e.keyCode)) {
    e.preventDefault()
  }
})
