import onViewEntry, { option } from "./lazyLoading.js";

let imgWatcher = new IntersectionObserver(onViewEntry, option);
let lazyImages = document.querySelectorAll('[data-src]');
lazyImages.forEach(image => imgWatcher.observe(image))

const navbar = document.getElementById("menu");
const menu = document.querySelector(".menu");
navbar.style.maxHeight = "0px";
window.addEventListener('click', menutoggle)

function menutoggle() {
  if (navbar.style.maxHeight == "0px") {
    navbar.style.maxHeight = "200px";
  } else {
    navbar.style.maxHeight = "0px";
  }
}

const carticon = document.querySelector('.cart')
const cartItemsNumber = carticon.nextElementSibling;
window.addEventListener('load', localItems)
function localItems() {
  let items = getlocalStorageItem();
  if (items.length > 0) {
    cartItemsNumber.textContent = items.length
    cartItemsNumber.style.visibility = 'visible'
  }
}
function getlocalStorageItem() {
  return localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];
}
