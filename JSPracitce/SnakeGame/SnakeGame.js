import {
  update as updateSnake,
  draw as drawSnake,
  SnakeSpeed,
  getSnakeHead,
  eatSelf,
} from './Snake.js';
import { update as updatefood, draw as drawfood } from './SnakeFood.js';
import { outSideGrid } from './grid.js';

let lastRenderTime = 0;
const SnakeArea = document.getElementById('SnakeArea');
let gameOver = false;

function render(currentTime) {
  // 確認勝負
  if (gameOver) {
    if (confirm('你已經死亡，點擊ok重新開始')) {
      window.location = './SnakeGame.html';
    }
    return; // 確保跳出函數 render
  }

  // 通知瀏覽器我們想要產生動畫，告訴瀏覽器在下次渲染畫面前呼叫 callback 更新動畫。callback的參數為當前時間在下次渲染前調用。 window.requestAnimationFrame(callback)
  window.requestAnimationFrame(render);

  const secondsSinceLastRenderTime = (currentTime - lastRenderTime) / 1000;
  // 如果最後一次渲染的時間小於 某個時間點， 就 return 掉，不必執行此函數
  if (secondsSinceLastRenderTime < 1 / SnakeSpeed) return;

  lastRenderTime = currentTime;

  update();
  draw();
}

window.requestAnimationFrame(render);

function update() {
  updateSnake();
  updatefood();
  checkDeath();
}

function draw() {
  // 每次渲染時，先清空之前蛇的身體，才會有前進的軌跡
  SnakeArea.innerHTML = '';
  drawSnake(SnakeArea);
  drawfood(SnakeArea);
}

function checkDeath() {
  gameOver = outSideGrid(getSnakeHead()) || eatSelf();
}
