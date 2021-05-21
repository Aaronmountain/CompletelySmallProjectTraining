const musicWrap = document.querySelector('.musicWrap');

const volumeLow = musicWrap.querySelector('.volume-low');
const volumeUp = musicWrap.querySelector('.volume-high');
const volumeRange = musicWrap.querySelector('.volumewrap input');

const title = musicWrap.querySelector('.title h1');
const singer = musicWrap.querySelector('.title p');

const randomBtn = musicWrap.querySelector('.randombtn');
const speaker = musicWrap.querySelector('.speaker');

const durTime = musicWrap.querySelector('.durtime'); // currenttext
const endTime = musicWrap.querySelector('.endtime'); // duratimetext

const timeRange = document.querySelector('.range'); //seekslider
let seeking = false;
let seekto;

const repeatBtn = musicWrap.querySelector('.repeatbtn');
const preBtn = musicWrap.querySelector('.prebtn');
const playBtn = musicWrap.querySelector('.playbtn');
const nextBtn = musicWrap.querySelector('.nextbtn');

// 音樂路徑 direction + play_List[play_List_index] + mp3
// = ./Music/音樂名稱.mp3
let direction = './Music/';
let play_List = [];
let mp3 = '.mp3';
let play_List_index = 0;

// 音樂資訊 title and singer
let titleArr = [];
let singerArr = [];

audio = new Audio()
audio.src = direction + play_List[play_List_index] + mp3
audio.loop = false;

// 初始化 title and singer
title.innerHTML = titleArr[play_List_index]
singer.innerHTML = singerArr[play_List_index]

repeatBtn.addEventListener('click', repeatSong)
preBtn.addEventListener('click', preSong)
playBtn.addEventListener('click', playPause)
nextBtn.addEventListener('click', nextSong)

randomBtn.addEventListener('click', randomSong)
speaker.addEventListener('click', ismute)

timeRange.addEventListener('mousemove', function (e) { seek() })
timeRange.addEventListener('mousedown', function (e) { seeking = true; seek() })
timeRange.addEventListener('mouseup', function () { seeking = false; })

volumeRange.addEventListener('mousemove', setVolume)
audio.addEventListener('timeupdate', () => { seektimeupdate() })
audio.addEventListener('ended', () => { switchSong() })

function fetchMusicDetail() {
  // Music title
  title.innerHTML = titleArr[play_List_index]
  singer.innerHTML = singerArr[play_List_index]

  // Audio
  audio.src = direction + play_List[play_List_index] + mp3
  audio.play()
}

function repeatSong() {
  if (audio.loop) {
    audio.loop = false
    repeatBtn.src = './Images/rep.png'
  } else {
    audio.loop = true
    repeatBtn.src = './Images/rep1.png'
  }
}
function preSong() {
  play_List_index--;
  if (play_List_index < 0) {
    play_List_index = play_List.length - 1
  }
  fetchMusicDetail()
}
function playPause() {
  if (audio.paused) {
    audio.play()
    playBtn.src = 'Images/pause-red.png'
  } else {
    audio.pause()
    playBtn.src = 'Images/play-red.png'
  }
}
function nextSong() {
  play_List_index++;
  if (play_List_index > play_List.length - 1) {
    play_List_index = 0
  }
  fetchMusicDetail()
}

function randomSong() {
  let randomIndex = getRandomNumber(0, play_List.length - 1);
  play_List_index = randomIndex;
  fetchMusicDetail();
}
function getRandomNumber(min, max) {
  let step1 = max - min + 1;
  let step2 = Math.random() * step1;
  let randomNumber = Math.floor(step2);
  return randomNumber;
}

function ismute() {
  if (audio.muted) {
    audio.muted = false
    speaker.src = './Images/speaker.png'
  } else {
    audio.muted = true
    speaker.src = './Images/mute.png'
  }
}

function seek() {
  if (audio.duration == 0) {
    null
  } else {
    if (seeking) {
      seekto = audio.duration * (timeRange.value / 100);
      audio.currentTime = seekto
    }
  }
}

function setVolume() {
  // 音量要使用百分比設置
  audio.volume = volumeRange.value / 100;
}

function seektimeupdate() {
  if (audio.duration) {
    let nt = audio.currentTime * (100 / audio.duration);
    timeRange.value = nt
    let curmins = Math.floor(audio.currentTime / 60) // 當前時間 / 60 等於當前分鐘
    // 主要是，超過一分鐘後，就要減掉 curmins * 60，不然 audio.currentTime 會有三位數，EX. 會從99秒後變100s
    let cursecs = Math.floor(audio.currentTime - curmins * 60)
    let durmins = Math.floor(audio.duration / 60)
    let dursecs = Math.floor(audio.duration - durmins * 60)

    if (curmins < 10) { curmins = '0' + curmins }
    if (durmins < 10) { durmins = '0' + durmins }
    if (cursecs < 10) { cursecs = '0' + cursecs }
    if (dursecs < 10) { dursecs = '0' + dursecs }

    endTime.innerHTML = durmins + ':' + dursecs
    durTime.innerHTML = curmins + ':' + cursecs
  } else {
    durTime.innerHTML = '00' + ':' + '00'
    endTime.innerHTML = '00' + ':' + '00'
  }
}
function switchSong() {
  if (play_List_index === (play_List.length - 1)) {
    play_List_index = 0
  } else {
    play_List_index++
  }
  fetchMusicDetail()
}