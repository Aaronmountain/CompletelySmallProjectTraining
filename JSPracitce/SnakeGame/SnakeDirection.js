let direction = { x: 0, y: 0 }
let lastDirection = { x: 0, y: 0 }

window.addEventListener('keydown', e =>
{
  switch (e.key)
  {
    case 'ArrowUp':
      // 已經在 Y 軸上移動了，就不能在改變 Y 軸，只能轉向 X 軸
      if(lastDirection.y !== 0) break
      direction = { x: 0, y: -1 };
      break

    case 'ArrowDown':
      if(lastDirection.y !== 0) break
      direction = { x: 0, y: 1 };
      break
    
    case 'ArrowRight':
      if(lastDirection.x !== 0) break
      direction = { x: 1, y: 0 };
      break

    case 'ArrowLeft':
      if(lastDirection.x !== 0) break
      direction = { x: -1, y: 0 };
      break
  }
})

export function getInputDirection()
{
  // lstDirection 物件內的數值只有上方的四種可能，用來判斷行進方向
  lastDirection = direction;
  return direction
}