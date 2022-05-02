import { products } from "./productsData.js";

// category data
const itemsRow = document.querySelector(".ItemRow");
const btncontainer = document.querySelector(".category");
const navbar = document.getElementById("menu");
const menu = document.querySelector(".menu");
navbar.style.maxHeight = "0px";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}

function ready() {
    /* ------ RWD --------- */
    menu.addEventListener('click', menutoggle)

    ItemsContent(products);
    categorybtncreat();

    localItems();
}

// RWD Menu Control
function menutoggle() {
    if (navbar.style.maxHeight == "0px") {
        navbar.style.maxHeight = "200px";
    } else {
        navbar.style.maxHeight = "0px";
    }
}

// add products
function ItemsContent(productItems) {
    let itemscategory = productItems.map(function (item) {
        return `<div class="col-4">
            <a href=${item.path}><img src=${item.img} alt=${item.title}></a>
            <h4>${item.title}</h4>
            <div class="rating">
                ${item.rating}
            </div>
            <p>$${item.price}</p>
        </div>`;

    })
    itemscategory = itemscategory.join("");
    itemsRow.innerHTML = itemscategory;
}

// categorybtn
function categorybtncreat() {
    const categories = products.reduce(function (value, Item) {
        if (!value.includes(Item.category)) {
            value.push(Item.category);
        }
        return value;
    }, ["all"])

    const categoriesBtn = categories.map(function (category) {
        return `<button class="categorybtn" data-category="${category}">${category}</button>`
    }).join("");
    btncontainer.innerHTML = categoriesBtn;

    const categorybtn = btncontainer.querySelectorAll(".categorybtn");
    categorybtn.forEach(function (btn) {
        btn.addEventListener("click", (e) => {
            let btn = e.currentTarget;
            let ItemCategory = btn.dataset.category;
            const productsCategory = products.filter(function (item) {
                if (item.category == ItemCategory) {
                    return item;
                }
            })

            if (ItemCategory == "all") {
                ItemsContent(products);
            } else {
                ItemsContent(productsCategory);
            }
        })
    })
}

// localStorage 
function getlocalStorageItem() {
    return localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];
}

// cart icon
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
