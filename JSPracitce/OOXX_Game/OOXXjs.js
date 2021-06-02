const x_Class = 'x';
const circle_Class = 'circle';
const winning_Cobination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElements = document.getElementById('winning-Message');
const restartButton = document.getElementById('restartbutton');
const winningMessageTextElements = document.querySelector('[data-winning-message-text]');
let circleTurns;

startGame();

//每次點擊 id名稱為restartButton時，就呼叫 startGame函式
restartButton.addEventListener('click', startGame);

function startGame() {
  //遊戲從圈圈開始
  circleTurns = true;
  cellElements.forEach((cell) => {
    /*1. 因為重新開始，除了第35行的remove the show css，同時也要把格子內上一場的圈圈叉叉清除。
        2. 為cellElements中每一個cell移除css中的 x_Class and circle_Class 和 click事件(不再觸發handlClick函式) */
    cell.classList.remove(x_Class);
    cell.classList.remove(circle_Class);
    cell.removeEventListener('click', handlClick);
    /*為cellElements中每一個cell添加click事件，點擊cell後，觸發名為的handClick函式，且一旦觸發過一次之後就不再觸發*/
    cell.addEventListener('click', handlClick, { once: true });
  });

  //遊戲一開始就要有 圈 or 叉 的hover圖案
  setBoardHoverClass();

  //因為要開始遊戲，無論是剛開始還是restart，都要移除掉 勝利及restart按鈕的視窗，so remove the show css
  winningMessageElements.classList.remove('show');
}

function handlClick(e) {
  const cell = e.target; //e.target代表我們點擊時觸發click事件當下的那個元素，賦值給cell
  const currentClass = circleTurns ? circle_Class : x_Class;
  // placeMark
  placeMark(cell, currentClass);
  // Check For win
  // Check For Draw

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    // Swicth Turns
    swapTurns();
    //確保我們每次swapTurns()之前，先顯示出setBoardHoverClass()
    setBoardHoverClass();
  }
}
// endGame ， 有勝負則 `${circleTurns ? "O's" : "X's"} Wins!`會印出誰贏，且添加css show會跳出勝利及restart按鈕的視窗
function endGame(draw) {
  if (draw) {
    winningMessageTextElements.innerText = 'Draw!';
  } else {
    winningMessageTextElements.innerText = `${circleTurns ? "O's" : "X's"} Wins!`;
  }
  winningMessageElements.classList.add('show');
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(x_Class) || cell.classList.contains(circle_Class);
  });
}

//標記，Cell是我們所點擊的格子後添加CSS(上方const的變數 currentClass)
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

// 利用 ! 運算式將右邊circleTurns的值，從原本的true轉換成false又轉換成true....以此類推後，賦值給左邊的circleTurns，用來改變上方const中的變數 currentClass的值，接者改變上方placeMark函式所該添加的CSS
function swapTurns() {
  circleTurns = !circleTurns;
}

//顯示玩家Hover cell時所應該顯示的圖案(CSS中設定的淺色圈叉)
function setBoardHoverClass() {
  //每次swapTruns()，都要先移除board CSS中的 x_Class 或 circle_Class
  board.classList.remove(x_Class);
  board.classList.remove(circle_Class);
  /* 上方設定過了 circleTurns ? circle_Class : x_Class */
  if (circleTurns) {
    board.classList.add(circle_Class);
  } else {
    board.classList.add(x_Class);
  }
}

function checkWin(currentClass) {
  //.some代表 只要符合陣列中任何一個選項就會 return true
  return winning_Cobination.some((Cobination) => {
    return Cobination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

// .every要陣列裡所有東西都符合條件才會回傳 true，只要有一個不是就會回傳 false。

//.some會將陣列中的「每一個」元素帶入指定的函式內做判斷，任何一個元素符合判斷條件，就會回傳 true，如果全都不符合，就會回傳 false。
