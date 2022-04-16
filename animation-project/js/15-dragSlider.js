/* Variable */
// CategoryTitle
const h3 = document.querySelectorAll('.category h3');
// DragSlider
const sliderWrap = document.querySelector('.sliderWrap');
const sliderImgs = Array.from(sliderWrap.querySelectorAll('img'));
let isDraging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0;

// init
window.addEventListener('DOMContentLoaded', init());
sliderWrap.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

function init() {
  // Header CategoryTitle
  h3.forEach((Title) => {
    Title.addEventListener('mouseenter', subInfoShow);
    Title.addEventListener('mouseleave', subInfoHidden);
  });

  // DragSlider
  sliderImgs.forEach((img, index) => {
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    // Touch Events (mobile)
    img.addEventListener('touchstart', dragStart(index));
    img.addEventListener('touchsend', dragEnd);
    img.addEventListener('touchmove', dragMove);

    // Mouse Events (tablet)
    img.addEventListener('mousedown', dragStart(index));
    img.addEventListener('mouseup', dragEnd);
    img.addEventListener('mouseleave', dragEnd);
    img.addEventListener('mousemove', dragMove);
  });
}

function subInfoShow() {
  const subinfo = this.nextElementSibling;
  this.style.color = '#000';
  subinfo.style.visibility = 'visible';
  subinfo.addEventListener('mouseenter', () => {
    subinfo.style.visibility = 'visible';
  });
}
function subInfoHidden() {
  const subinfo = this.nextElementSibling;
  this.style.color = 'var(--category-text-color)';
  subinfo.style.visibility = 'hidden';
  subinfo.addEventListener('mouseleave', () => {
    subinfo.style.visibility = 'hidden';
  });
}

function dragStart(index) {
  return function (e) {
    currentIndex = index;
    startPos = getPositionX(e);
    isDraging = true;

    animationID = requestAnimationFrame(animation);

    sliderWrap.classList.add('grabbing');
  };
}

function dragEnd() {
  isDraging = false;
  cancelAnimationFrame(animationID);
  const moveDirection = currentTranslate - prevTranslate;

  if (moveDirection < -100 && currentIndex < sliderImgs.length - 1) currentIndex += 1;

  if (moveDirection > 100 && currentIndex > 0) currentIndex -= 1;

  setImgPositionbyIndex();
  sliderWrap.classList.remove('grabbing');
}

function dragMove(e) {
  if (isDraging) {
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function getPositionX(e) {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function animation() {
  setSliderWrapPosition();
  if (isDraging) requestAnimationFrame(animation);
}

function setImgPositionbyIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderWrapPosition();
}

function setSliderWrapPosition() {
  sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
}
