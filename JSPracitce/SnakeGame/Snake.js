import { getInputDirection } from './SnakeDirection.js'

export const SnakeSpeed = 10;
const snakeBody = [ { x: 11, y: 11 } ];
let newSegment = 0;

export function update()
{
  addSegment();
  const direction = getInputDirection();
  for(let i = snakeBody.length - 2; i >= 0; i--)
  {
    /* 一開始 i = 0 時代表最後一個(物件內容即蛇的位置座標)，並解構賦值給陣列[1]，陣列中的物件為位置，而要將整個物件傳給陣列[1]的話，就利用 ... 來賦值
    此時陣列[1]變最後一個，其的位置為原本為陣列[0]的位置，類推。 每次後一個就會取代前一個的位置 */
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
    // 從最一開始的位置，根據 keydown 事件，direction 的值會改變
    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;
}

export function draw(SnakeArea)
{
  snakeBody.forEach( segment =>
  {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add('snake');
    SnakeArea.appendChild(snakeElement);
  })
}

// SnakeFood.js Function
export function extensionSnake(amount)
{
  // eatFood 回傳ture 則，newSegment += amount ，再執行 addSegment 函數並將 newSegment 歸零 
  newSegment += amount;
}

export function eatFood(position, { ignoredHead= false } = {})
{
  return snakeBody.some( (segment, index) =>
  {
    if(index === 0 && ignoredHead) return false;
    return equalPosition(position, segment)
  })
}

function addSegment()
{
  // extensionSnake(SnakeFood.js裡的參數) 會在 eatFood 回傳 true 時進行 newSegment+1
  // 此時 newSegment = 1 ，執行迴圈， 執行完歸零
  for(let i = 0; i < newSegment; i++)
  {
    // 利用 ... 取得蛇身體最後一格，由於 push 是從後方放進陣列中，此時 push 上去的會變成蛇身體的最後一個
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
  }

  newSegment = 0;
}

// 確認勝負，碰到自己的身體，gameover
export function eatSelf()
{
  return eatFood(snakeBody[0], { ignoredHead: true })
}

function equalPosition(foodPosition, snakePosition)
{
  return foodPosition.x === snakePosition.x && foodPosition.y === snakePosition.y;
}

// snakeBody[0] 蛇的頭部位置
export function getSnakeHead()
{
  return snakeBody[0];
}

