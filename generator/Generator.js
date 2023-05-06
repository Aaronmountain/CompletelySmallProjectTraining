'use strict';
// "協程"（coroutine），意思是多個協程互相協作，完成異步的任務。
/**
 * 範例：
 * 
 * 第一步，協程A開始執行。
 * 
 * 第二步，協程A執行一半而已，被暫停，
 * 執行權轉移到協程B，協程B開始執行。
 * 
 * 第三步，（過一段時間後）協程B將執行權交還給協程A
 * 
 * 第四步，協程A恢復任務執行。
 * 
 * 因此協程A就是異步任务，因为它被中斷分成兩段（或多段）执行。
*/

// asyncJob 可以被稱作是一个協程，
// 執行到 yield 命令時，執行權會交給其他協程，yield 命令是異步兩個階段的分界線
// 其他協程交還執行權後，再接著往後執行
function asyncJob() {
  // ...其他程式邏輯
  const f = yield readFile(fileA);
  // ...其他程式邏輯
}

function readFile(fileA) {
  console.log(`🚀 ~ readFile ~ fileA:`, fileA);
}

/**
 * Generator 函式是協程在 ES6 的實作，最大特點是可以交出函式執行權(暫停執行)
 * 
 * 整个 Generator 函式，是一个封装的異步任务(或者说是異步任务的容器)。
 * 異步操作(需要暫停的地方)，用 yield 去中斷 Generator 函式內部的執行。
 * 
 * 呼叫 Generator 函式後，函式不會立即被執行，
 * 會返回一個指向內部狀態的指針物件，
 * 
 * yield 命令是暫停執行的標記，
 * next 方法是恢復執行的標記，
 * throw 方法是發生錯誤的標記，
 * return 方法是結束該Generator的標記
*/
function* gen(x) {
  const y = yield x + 2;
  return y;
}

// value 是 yield 命令後面表達式的值，表示當前階段的值;
// done 是一個 boolean，表示當前 Generator 函式是否執行完畢，判斷後續是否還有下一個階段
const g = gen(1);
g.next() // 返回 { value: 3, done: false }
g.next() // 返回 { value: undefined, done: true }

/** 
 * Generator 函式可以暫停執行和恢復執行，讓它能封裝異步任務
 * 它還有兩個特性，函式內外進行數據交換、錯誤處理機制
*/

// 函式內外進行數據交換
// next 方法可以帶一個參數，作爲上一個在 generator 中 yield 語句的返回值
const g2 = gen(1);
g2.next() // { value: 3, done: false }, 返回 yield 後面的值，即 x+2=3
g2.next(2) // { value: 2, done: true }, 帶入參數會被作為上一個階段 yield 命令的返回值。gen 這個 Generator 函式內部的 y 變數 = 2

// 錯誤處理
function* genWithError(x) {
  try {
    return yield x + 2;
  } catch (e) {
    console.log(e);
  }
}

const gError = genWithError(1);
gError.next();
gError.throw('出事了');
