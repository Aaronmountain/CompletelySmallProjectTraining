const apisrc = "https://api.unsplash.com/photos/?client_id=mWhpC1jD6hjOr21SlfpX8e2IDOxHk5uwE3PcunygDFM&per_page=30";
const SliderContainer = document.querySelector('.SliderContainer');
const Sliderimg = SliderContainer.querySelector('.Sliderimg'); 
const PrevtBtn = SliderContainer.querySelector('.fa-chevron-left');
const NextBtn = SliderContainer.querySelector('.fa-chevron-right');

window.addEventListener("DOMContentLoaded", () =>
{
  fetch(apisrc)
    .then( res =>
    {
      // 取得資料轉成json
      let data = res.json();
      return data;
    })
    .then( data =>
    {
      /*----- 創建標籤圖片，設立自動輪轉功能並綁定滑鼠事件 */
      // 創建標籤，利用資料改變圖片網址，依序放入HTML中
      data.forEach( item => {
        let imgbox= document.createElement('div')
        imgbox.classList.add('Slide')
        let img = document.createElement('img');           
        imgbox.append(img)
        img.src = item.urls.small;
        Sliderimg.append(imgbox);
      });
      
      // 取得上方塞入的圖片標籤及圖片，因為 CSS 設定為絕對定位，為每個圖片綁定各自的left距離
      let img = Sliderimg.querySelectorAll('.Sliderimg img');
      img.forEach((img,index) => 
      {
        img.style.left = `${index * 100}%`;

        img.addEventListener('mouseleave', () =>
        {
          // 滑鼠移開時，用 Slideauto 承接 setInterval ，這樣在下次滑鼠移入才能清除
          // 不要再用 let 宣告第二次的 Slideauto 來承接 setInterval ，第二次需告的跟舊的 Slideauto 不一樣
          carousel = setInterval(Slide,2000)
        })
      });
      // 利用捕捉的方式在父層設立 clearInterval(carousel)， 只清除 Interval ， carouselCounter 的值維持不變
      SliderContainer.addEventListener('mouseenter', () =>
      {
        clearInterval(carousel);
      },true)
      

      // 幻燈片自動輪轉
      let carouselCounter = 0;
      let carousel = setInterval(Slide,2000)
      function Slide()
      {
        if(carouselCounter === img.length) carouselCounter = 0;
        img.forEach((img) => 
        {
          img.style.transform = `translateX(-${carouselCounter * 100}%)`;
        });
        carouselCounter++;
      }

      /*----- Btn點擊事件 ------ */
      // carouselCounter 計數器，點擊按鈕更動計數器的數字，並呼叫 btnControl 函式
      PrevtBtn.addEventListener('click', () => 
      {
        carouselCounter++;
        btnControl();
      });
      NextBtn.addEventListener('click', () => 
      {
        carouselCounter--;
        btnControl();
      });

      // 利用計數器判斷現在處於第幾張圖片，利用 translateX 改變其位置，
      function btnControl()
      {
        // 最後一個回到第一個
        if(carouselCounter === img.length) carouselCounter = 0;
        // 第一個往左回最後一個
        if(carouselCounter < 0) carouselCounter = img.length - 1;
        
        img.forEach((img) => 
        {
          img.style.transform = `translateX(-${carouselCounter * 100}%)`;
        });
      }
    })
})