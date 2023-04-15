const sleep = (time = 1000) => new Promise((res) => setTimeout(res, time));
// promise
const ps1 = () =>
  new Promise((res) => {
    setTimeout(() => {
      res({ status: "success", message: "ps1" });
    }, 1000);
  });
const ps2 = () =>
  new Promise((res) => {
    setTimeout(() => {
      res({ status: "success", message: "ps2" });
    }, 2000);
  });
const pf1 = () =>
  new Promise((_res, rej) => {
    setTimeout(() => {
      rej({ status: "failure", message: "pf1" });
    }, 3000);
  });
// async function 
const as1 = async () => {
  try {
    await sleep(1000)

    return { status: "success", message: "as1" }
  } catch (error) {
    // 雖說 catch 到了，但這裡return的值，其實是會 resolve(error), 若要 reject error 請見範例 as4
    return error
  }
}
const as2 = async () => {
  await sleep(2000)

  if (Math.random() > 0.5) return { status: "success", message: "as2" }

  // reject error
  // 1. async function 接收到例外會 reject(error) ,程式不會 crash
  // 2. 回傳 Promise.reject
  // 因此 tryCatch 非必要，但使用 tryCatch 可能更容易區分出成功、失敗的處理
  const error = { status: "failure", message: "as2" }
  if (Math.random() < 0.25) throw error
  return Promise.reject(error)
}
const as3 = async () => {
  try {
    await sleep(3000);
    const isSuccess = Math.random() > 0.5;

    // 成功處理
    if (isSuccess) {
      return { status: "success", message: "as3" }
    }

    // 錯誤處理的交給 catch
    throw { status: "failure", message: "as3" }
  } catch (error) {
    // 錯誤處理，回完 reject 而盡量不直接 throw error
    return Promise.reject(error)
  }
}
const as4 = async () => {
  // 相當於 return Promise.resolve("123")
  return await new Promise((res, _rej) => setTimeout(() => {
    res("123")
  }, 1000));
}
const af5 = async () => {
  // 相當於 return Promise.reject("123")
  return await new Promise((_res, rej) => setTimeout(() => {
    rej("123")
  }, 1000));
}
const as6 = async () => {
  // 不一定要 await 非同步，也可以 await 任何同步的值包含 function
  // 相當於 return Promise.resolve("123")
  return await 123
  // 相當於 return Promise.resolve(() => { })
  return await (() => { })
}

// 在沒有 promise.all ...etc 等，其他普通處理下的情境
// TODO: 如果 await reject 會怎樣，若沒 try catch 怎樣
const wait = async () => {
  const arr = await af5();
};

const waitAll = async () => {
  try {
    const arr = await Promise.all([as6()]);
    console.log(arr);
  } catch (err) {
    console.log('waitAll error', err);
  }
};
waitAll();

/** 總結 **/
/**
 *  async function 總是回傳將 return 的值包進 resolve 內
 *  若要在 async function 內回傳 reject, 
 * 1. 回傳 Promise.reject() or throw 一個例外會自動被 async function 包進 reject
 * 2. async + tryCatch 可以更容易的區分出成功、失敗的處理，但不一定要 tryCatch, 見範例 as2
 * 3. 除了 await 非同步外，也可以 await 同步處理, 見範例 as6
 * 4. 標準用法, 見範例 as3
*/

/**
 * Promise.all
 * 1. 遇到 reject, 直接把 reject value 放入 catch error 中, Promise.all 後續的邏輯不會被執行
 * 
 * 2. 遇到 nested promise 只會回傳回傳第一層 resolve 的結果
 * example: 以 resolve 回例, 會接收到[data1,data2,data3, async Function]
*/

