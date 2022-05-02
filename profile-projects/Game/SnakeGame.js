import { update as updateSnake, draw as drawSnake, SnakeSpeed, getSnakeHead, eatSelf } from './Snake.js';
import { update as updatefood, draw as drawfood } from './SnakeFood.js';
import { outSideGrid } from './grid.js';

let lastRenderTime = 0;
const SnakeArea = document.getElementById('SnakeArea');
let gameOver = false;

function render(currentTime) {
  if (gameOver) {
    if (confirm('你已經死亡，點擊ok重新開始')) {
      window.location = './index.html'
    }
    return;
  }

  window.requestAnimationFrame(render);

  const secondsSinceLastRenderTime = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRenderTime < 1 / SnakeSpeed) return;

  lastRenderTime = currentTime;

  update()
  draw()
}

window.requestAnimationFrame(render);

function update() {
  updateSnake();
  updatefood();
  checkDeath();
}

function draw() {
  SnakeArea.innerHTML = '';
  drawSnake(SnakeArea);
  drawfood(SnakeArea);
}

function checkDeath() {
  gameOver = outSideGrid(getSnakeHead()) || eatSelf();
}