import { eatFood, extensionSnake } from './Snake.js'
import { randomGridFoodPosition } from './grid.js'

let food = RandomFoodPosition();
const Extension_Rate = 1;

export function update() {
  if (eatFood(food)) {
    extensionSnake(Extension_Rate);
    food = RandomFoodPosition();
  }
}

export function draw(SnakeArea) {
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  SnakeArea.appendChild(foodElement);
}

function RandomFoodPosition() {
  let newFoodPosition;
  while (newFoodPosition == null || eatFood(newFoodPosition)) {
    newFoodPosition = randomGridFoodPosition();
  }
  return newFoodPosition;
}
