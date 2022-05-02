if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}

// ----- RWDcontrols -----
const menu = document.getElementById("menu");
menu.style.maxHeight = "0px";

function menutoggle() {
    if (menu.style.maxHeight == "0px") {
        menu.style.maxHeight = "200px";
    } else {
        menu.style.maxHeight = "0px";
    }
}


// shopping form controls
function ready() {
    localItems()
    const Removeitemsbtn = document.getElementsByClassName("Remove-items-btn");
    for (let i = 0; i < Removeitemsbtn.length; i++) {
        let removebtn = Removeitemsbtn[i];
        removebtn.addEventListener("click", removeCartItems);
    }

    // input type="number" 中點擊的click event
    const quantityInput = document.getElementsByClassName("carts-input");
    for (let i = 0; i < quantityInput.length; i++) {
        let input = quantityInput[i];
        input.addEventListener("click", quantityChanged);
    }

    // Add to Cart 按鈕的 click event

    const addToCart = document.querySelectorAll(".Cart-item-btn");
    for (let i = 0; i < addToCart.length; i++) {
        let btn = addToCart[i];
        btn.addEventListener("click", addItemsClicked);
    };

    // 購物車中 Purchase按鈕的click event
    const Purchasebtn = document.querySelector(".purchase");
    Purchasebtn.addEventListener("click", ItemPurchase)

    let items = getlocalStorageItem();
    SingleProuctDetail(items);
}

// add storage to cart
function SingleProuctDetail(items) {
    let ItemDatas = [];
    ItemDatas = items.map(item => {
        return {
            id: item.id,
            value: item.value,
            src: item.src,
            quantity: item.quantity,
            price: item.price,
            size: item.size
        }
    })
    for (let i = 0; ItemDatas.length; i++) {
        addSingleProduct(ItemDatas[i].value, ItemDatas[i].src, ItemDatas[i].quantity, ItemDatas[i].price, ItemDatas[i].size)
    }
}

function addSingleProduct(value, src, quantity, price, size) {
    let CartRow = document.createElement("div");
    CartRow.classList.add("Cart-Row");
    let cartItemsContainer = document.getElementsByClassName("cart-container")[0];
    let CartRowContents =
        `<div>
        <img src="${src}">
        <p class="ItemTitle">${value}</p>
        <p class="ItemSize">Size: ${size}</p>
     </div>
     <input type="number" class="carts-input"  value="${quantity}">
     <div class="cart-price">${price}</div>
     <button class="Remove-items-btn">
         Remove
     </button>`;
    CartRow.innerHTML = CartRowContents;
    cartItemsContainer.append(CartRow);
    CartRow.getElementsByClassName("Remove-items-btn")[0].addEventListener("click", removeCartItems);
    CartRow.getElementsByClassName("carts-input")[0].addEventListener("click", quantityChanged);
    updateTotalprice()
}

function getlocalStorageItem() {
    return localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];
}

function removeFromLocalStorage(id) {
    let items = getlocalStorageItem();
    items = items.filter(function (item) {
        if (item.id !== id) return item
    })
    localStorage.setItem('product', JSON.stringify(items));
}


// Purchasebtn click event 
function ItemPurchase() {
    let itemcontainer = document.querySelector(".cart-container");
    itemcontainer.hasChildNodes() ? alert("訂單已成功送出，謝謝您的購買，歡迎再度光臨") : alert("您好，您的購物車中沒有選購商品~~");
    while (itemcontainer.hasChildNodes()) {
        itemcontainer.removeChild(itemcontainer.firstChild);
    }
    updateTotalprice();
}

function quantityChanged(e) {
    let input = e.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotalprice();
}

function removeCartItems(e) {
    let btn = e.target;
    btn.parentElement.remove();
    updateTotalprice()
}


// Add to Cart click event 
function addItemsClicked(e) {
    let btn = e.target;
    let itemcontainer = btn.parentElement.parentElement;
    let title = itemcontainer.getElementsByClassName("ItemTitle")[0].innerText;
    let price = itemcontainer.getElementsByClassName("cart-price")[0].innerText;
    let imgsrc = itemcontainer.getElementsByClassName("Items-Img")[0].src;
    let inputvalue = itemcontainer.getElementsByClassName("carts-input")[0].value;
    let form = document.getElementsByTagName("form");
    addItemsToCart(title, price, imgsrc, inputvalue);
    for (let i = 0; i < form.length; i++) {
        form[i].reset();
    }
    updateTotalprice()
}


function addItemsToCart(title, price, imgsrc, inputvalue) {
    let CartRow = document.createElement("div");
    CartRow.classList.add("Cart-Row");
    let cartItemsContainer = document.getElementsByClassName("cart-container")[0];
    let CartItemsName = cartItemsContainer.getElementsByClassName("ItemTitle");
    for (let i = 0; i < CartItemsName.length; i++) {
        if (CartItemsName[i].innerText == title) {
            alert("您已經放入購物車了ㄛ~~~");
            return;
        }
    };
    let CartRowContents =
        `<div>
        <img src="${imgsrc}">
        <p class="ItemTitle">${title}</p>
     </div>
     <input type="number" class="carts-input"  value="${inputvalue}">
     <div class="cart-price">${price}</div>
     <button class="Remove-items-btn">
         Remove
     </button>`;
    CartRow.innerHTML = CartRowContents;
    cartItemsContainer.append(CartRow);
    CartRow.getElementsByClassName("Remove-items-btn")[0].addEventListener("click", removeCartItems);
    CartRow.getElementsByClassName("carts-input")[0].addEventListener("click", quantityChanged);
}


function updateTotalprice() {
    let cartItemsContainer = document.getElementsByClassName("cart-container")[0];
    let cartRows = cartItemsContainer.getElementsByClassName("Cart-Row");
    let total = 0, tax = 0, unitPrice = 0;
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        let priceElement = cartRow.getElementsByClassName("cart-price")[0];
        let quantityElement = cartRow.getElementsByClassName("carts-input")[0];
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = quantityElement.value;
        total += price * quantity;
        tax += 35 * quantity;
    };
    unitPrice = total;
    total = Math.round(total * 100) / 100 + tax;
    document.querySelector(".total").innerText = "$" + unitPrice;
    document.querySelector(".tax").innerText = "$" + tax;
    document.querySelector(".finaltotal").innerText = "$" + total;
}

const carticon = document.querySelector('.cart')
const cartItemsNumber = carticon.nextElementSibling;
function localItems() {
    let items = getlocalStorageItem();
    if (items.length > 0) {
        cartItemsNumber.textContent = items.length
        cartItemsNumber.style.visibility = 'visible'
    }
}