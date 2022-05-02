import { getInputDirection } from './SnakeDirection.js'

export const SnakeSpeed = 10;
const snakeBody = [{ x: 11, y: 11 }];
let newSegment = 0;

export function update() {
  addSegment();
  const direction = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  snakeBody[0].x += direction.x;
  snakeBody[0].y += direction.y;
}

export function draw(SnakeArea) {
  snakeBody.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add('snake');
    SnakeArea.appendChild(snakeElement);
  })
}

// SnakeFood.js Function，snakebodygrowth
export function extensionSnake(amount) {

  newSegment += amount;
}

export function eatFood(position, { ignoredHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (index === 0 && ignoredHead) return false;
    return equalPosition(position, segment)
  })
}

// snakebodygrowth
function addSegment() {
  for (let i = 0; i < newSegment; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
  }

  newSegment = 0;
}

export function eatSelf() {
  return eatFood(snakeBody[0], { ignoredHead: true })
}

function equalPosition(foodPosition, snakePosition) {
  return foodPosition.x === snakePosition.x && foodPosition.y === snakePosition.y;
}

export function getSnakeHead() {
  return snakeBody[0];
}

