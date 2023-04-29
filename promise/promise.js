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
const pf2 = () =>
  new Promise((_res, rej) => {
    setTimeout(() => {
      rej({ status: "failure", message: "pf2" });
    }, 1000);
  });

// async function
// 該用法可清楚區分成功、失敗
const as1 = async () => {
  try {
    await sleep(1000);
    // 成功處理
    if (Math.random() > 0.5) {
      return { status: "success", message: "as1" };
    }

    // 錯誤處理的交給 catch(以下兩種方法都會進到 catch)
    // 1. throw 錯誤內容
    throw { status: "failure", message: "af1" }; // 直接拋出例外
    // 2. await reject(錯誤內容)
    // await Promise.reject({ status: "failure", message: "af1" });
  } catch (error) {
    // 1. 錯誤處理，回完 reject
    return Promise.reject(error);
    // 2. 若直接 return error, 會return Promise.resolve(error)
    // return error;
  }
};

// await 不一定要非同步，也可以 await 任何同步的值包含 function
const as2 = async () => {
  // 相當於 return Promise.resolve("123")
  return await 123;
  // 相當於 return Promise.resolve(() => { })
  // return await (() => {});
};

// 遇到 reject 一定要 .catch or await，不然會 panic
const testReject = async () => {
  try {
    // if (Math.random() > 0.5) return Promise.resolve("success");

    return await Promise.reject("test");
    // 以下兩種做法，都會造成 panic
    // return Promise.reject("test");
    // Promise.reject("test");
  } catch (error) {
    console.log("error: ", error);
  }
};

const waitAll = async () => {
  try {
    const arr = await Promise.all([as6()]);
    console.log(arr);
  } catch (err) {
    console.log("waitAll error", err);
  }
};
// waitAll();

/** 總結 **/
/**
 *  async function return 的值永遠會被包進 resolve 內
 *  若要在 async function 內回傳 reject,  可直接回傳 Promise.reject()
 * 1. 使用 tryCatch, 只要發生 await reject or throw 都會自動進到 catch 處理
 * 2. 除了 await 非同步外，也可以 await 同步處理, 見範例 as2
 * 3. 標準用法, 見範例 as1
 */

/**
 * Promise.all
 * 1. 遇到 reject, 直接把 reject value 放入 catch error 中, Promise.all 後續的邏輯不會被執行
 *
 * 2. 遇到 nested promise 只會回傳回傳第一層 resolve 的結果
 * example: 以 resolve 回例, 會接收到[data1,data2,data3, async Function]
 */

// 遇到 reject 一定要 .catch, 不然會 panic
