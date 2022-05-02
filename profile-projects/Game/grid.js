const Grid_Size = 21;

export function randomGridFoodPosition() {
  return {
    x: Math.floor(Math.random() * Grid_Size) + 1,
    y: Math.floor(Math.random() * Grid_Size) + 1
  }
}

export function outSideGrid(position) {
  return position.x < 1 || position.x > Grid_Size ||
    position.y < 1 || position.y > Grid_Size
}