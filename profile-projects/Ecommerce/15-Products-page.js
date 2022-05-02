import onViewEntry, { option } from "./lazyLoading.js";

const addBtn = document.getElementById('btn');
const quantityInput = document.getElementsByClassName("carts-input");

const navbar = document.getElementById("menu");
const menu = document.querySelector(".menu");
navbar.style.maxHeight = "0px";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}

function ready() {
    let imgWatcher = new IntersectionObserver(onViewEntry, option);
    let lazyImages = document.querySelectorAll('[data-src]');
    lazyImages.forEach(image => imgWatcher.observe(image))

    localItems()

    // ----- RWDcontrols -----
    menu.addEventListener('click', menutoggle)

    smallProductImg()

    // input event
    for (let i = 0; i < quantityInput.length; i++) {
        let input = quantityInput[i];
        input.addEventListener("change", quantityChanged);
    }

    addBtn.addEventListener('click', addItem);
}

// RWD
function menutoggle() {
    if (navbar.style.maxHeight == "0px") {
        navbar.style.maxHeight = "200px";
    } else {
        navbar.style.maxHeight = "0px";
    }

}

function smallProductImg() {
    let productsImg = document.getElementById("products_img");
    let smallImg = document.querySelectorAll(".smallImg");
    smallImg.forEach(img => {
        img.addEventListener('click', (e) => {
            let img = e.currentTarget;
            productsImg.src = img.src
        })
    });
}

// Input change event 
function quantityChanged(e) {
    let input = e.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
}

const Item = document.querySelector('.ItemTitle');
const ItemImg = document.getElementById('products_img');

function addItem(e) {
    if (checkStorage()) return alert('您以選購此商品了');

    const id = new Date().getTime().toString();
    Item.setAttribute('id', id);
    let ItemImgSrc = ItemImg.src;
    let quantityValue = quantityInput[0].value;
    let price = document.querySelector('.cart-price').innerText.replace("$", "");
    let sizeValue = ['', 'XXL', 'XL', 'L', 'M', 'S', 25, 24.5, 24, 23.5, 23];
    let size = sizeValue.find((size, index) => {
        let sizeNumber = document.getElementById('SizeOption').value;
        if (index == sizeNumber) return size
    })

    if (size === undefined) return alert('請選擇尺寸，謝謝您')

    let form = document.getElementsByTagName("form");
    for (let i = 0; i < form.length; i++) {
        form[i].reset();
    }
    addLocalStorage(id, Item.textContent, ItemImgSrc, quantityValue, price, size)

    localItems();

    displayText()
}

function addLocalStorage(id, ItemTitle, ImgSrc, quantity, price, size) {
    const itemData = { id, title: ItemTitle, src: ImgSrc, quantity: quantity, price: price, size: size };
    let items = getlocalStorageItem();
    items.push(itemData);
    localStorage.setItem('product', JSON.stringify(items));
}

function getlocalStorageItem() {
    return localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];
}

function checkStorage() {
    let items = getlocalStorageItem();
    return items.some(item => {
        return item.title === Item.textContent
    })
}

function localItems() {
    let carticon = document.querySelector('.cart')
    let cartItemsNumber = carticon.nextElementSibling;
    let items = getlocalStorageItem();
    if (items.length > 0) {
        cartItemsNumber.textContent = items.length;
        cartItemsNumber.style.visibility = 'visible';
    }
    if (items.length === 0) {
        cartItemsNumber.textContent = '';
        cartItemsNumber.style.visibility = 'hidden';
    }
}

function displayText() {
    let ok = document.querySelector('.ok')
    ok.style.display = 'block';
    setTimeout(() => {
        ok.style.display = 'none';
    }, 2000)
}