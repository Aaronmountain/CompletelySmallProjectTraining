// 直接設置屬性的值, or 更細節可以設定 { ideal, min, max, exact }
// example: width: 1024, or width:{ max: 1024, min:768 }
//
// const constraints = {
//   audio: true, // 簡單設定可以直接給 ture or false
//   video: {
//     width: { min: 1024, ideal: 1280, max: 1920 },
//     height: { min: 576, ideal: 720, max: 1080 },
//     frameRate: { ideal: 10, max: 15 }, // 每幀頻率
//     facingMode: front ? "user" : "environment", // 前鏡頭or外鏡頭
//     // deviceId: {
//     //   exact: myExactCameraOrBustDeviceId,
//     // },
//   },
// };
const constraints = { video: true };

export { constraints };
