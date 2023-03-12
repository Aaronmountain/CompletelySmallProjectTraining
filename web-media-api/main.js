import { constraints } from "./constraints.js";

(() => {
  let localStream;

  async function createStream() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia(constraints);

      setMediaStream("[data-vdo]", localStream);
    } catch (err) {
      console.log("line 9, create stream error: ", err);
    }
  }

  // 設定本地串流輸出狀態
  function setLocalStreamStatus() {
    localStream.getAudioTracks().forEach((item) => {
      // 聲音開關
      item.enabled = Math.random() > 0.5;
    });
    localStream.getVideoTracks().forEach((item) => {
      // 影像開關
      item.enabled = Math.random() > 0.5;
    });
  }

  function setMediaStream(selector, stream) {
    const element = document.querySelector(selector);

    if (element.srcObject) {
      element.srcObject = stream;
    } else {
      element.src = window.URL.createObjectURL(stream);
    }
  }

  function stopStream() {
    const video = document.querySelector("[data-vdo");
    localStream.getVideoTracks().forEach((item) => item.stop());
    video.src = video.srcObject = null;
  }

  document
    .querySelector("[data-capture]")
    .addEventListener("click", createStream);
  document.querySelector("[data-stop]").addEventListener("click", stopStream);
})();
