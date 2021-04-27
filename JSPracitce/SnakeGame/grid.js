const Grid_Size = 21;

export function randomGridFoodPosition()  
{
  return{
    // 21格 * random，最大最大就 20.99999，取floor則為20。 用 +1 確保最大為21
    x: Math.floor(Math.random() * Grid_Size) + 1 ,
    y: Math.floor(Math.random() * Grid_Size) + 1 
  }
}

export function outSideGrid(position)
{
  return position.x < 1  ||  position.x > Grid_Size ||
  position.y < 1  ||  position.y > Grid_Size
}