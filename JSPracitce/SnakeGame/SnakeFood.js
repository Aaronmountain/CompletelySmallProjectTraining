import { eatFood, extensionSnake } from './Snake.js'
import { randomGridFoodPosition } from './grid.js'

let food = RandomFoodPosition();
const Extension_Rate = 1;

export function update()
{
  if(eatFood(food))
  {
    // 吃到食物長身體，更換食物的位置
    extensionSnake(Extension_Rate);
    food = RandomFoodPosition();
  }
}

export function draw(SnakeArea)
{
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  SnakeArea.appendChild(foodElement);
}

function RandomFoodPosition()
{
  let newFoodPosition;
  // eatFood(參數) 函數 ，會將食物的位置和蛇身體的位置比對，位置一樣就會回傳ture
  while(newFoodPosition == null || eatFood(newFoodPosition))
  {
    newFoodPosition = randomGridFoodPosition();
  }
  return newFoodPosition;
}
