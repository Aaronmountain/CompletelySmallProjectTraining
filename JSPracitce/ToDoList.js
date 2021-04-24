const listform = document.querySelector('.todolist');
const alertMessage = listform.querySelector('.alertMessage');
const listTextInput =document.getElementById('todo');
const submitbtn = listform.querySelector('.submit-btn');

const listContainer = document.querySelector('.list-container');
const list = document.querySelector('.list');
const clearBtn = listContainer.querySelector('.Clear-btn');

/*----- Load my Items to the list ----- */
window.addEventListener('DOMContentLoaded',setMyItemsList);


/*----- AddItem ----- */
let editElement;
let editStatus = false;
let editID ='';

/*----- EventListener ----- */
// submit Form Listener
listform.addEventListener('submit',addItem)

// clearitems Listener
clearBtn.addEventListener('click',clearItems)


/*----- Add Listener Function -----*/
function addItem(e)
{
    e.preventDefault();
    const inputValue = listTextInput.value;
    const id = new Date().getTime().toString();
    // 若是 listTextInput.value 有值為 true
    // 1. 輸入框有值，但已經停止輸入 2. 輸入框有值，但仍在輸入(editing)
    if(inputValue && !editStatus)
    {
        // creatItem
        createListElement(id, inputValue)

        // show SussesAlert
        displayalert('Success Creat a List Item', 'alertSuccess');

        // show the listitems content
        listContainer.classList.add('show-Container');
        
        // add to LocalStorage
        addLocalStorage(id, inputValue);

        // set to Default
        setBackToDefault();
    }else if(inputValue && editStatus)
    {
        editElement.innerHTML = listTextInput.value;
        displayalert('The Item be edited', 'alertDanger');
        editLocalStorage(editID, inputValue);
        setBackToDefault();
    }else
    {
        displayalert('Please input your List', 'alertDanger')
    }
}

// display alertMessage
function displayalert(alertText, alertStatus)
{
    // Show alertMessage
    alertMessage.textContent = alertText;
    alertMessage.classList.add(alertStatus)

    // remove alertMessage
    setTimeout(()=>
    {
        alertMessage.textContent = '';
        alertMessage.classList.remove(alertStatus)
    },1500)
}

// Edit function
function editItem(e)
{
    const Element = e.currentTarget.parentElement.parentElement;
    // edit按鈕父元素的前一個兄弟節點，即上方所插入的模板字符串${inputValue}
    editElement = e.currentTarget.parentElement.previousElementSibling;
    listTextInput.value = editElement.innerHTML;
    editStatus = true;
    editID = Element.dataset.id;
    submitbtn.textContent = 'edit';
}
// Delete function
function deleteItem(e)
{
    const Element = e.currentTarget.parentElement.parentElement;
    const ElementId = Element.dataset.id;
    Element.remove();
    if(list.children.length === 0) listContainer.classList.remove('show-Container');
    displayalert('You`re delete the Item', 'alertDanger')
    setBackToDefault();

    // removeFromLocalStorage
    removeFromLocalStorage(ElementId);
}


/*-----  LocalStorage Function ----- */
// addLocalStorage
function addLocalStorage(id, inputValue)
{
    // 取得 inputvalue 及屬於自己的 id ， 賦值給itemData
    const itemData = { id, value: inputValue };
    // item = 假如 localStorage 有 list 這個 key的名稱 ，則將 list這個key名稱的value轉成陣列 ;  若沒有則是空陣列
    let items = getlocalStorageItem();
    // items 等於陣列 ， 陣列內新增 id and inputValue 
    items.push(itemData);
    // 將 items 轉為JSON字符串，傳到 localStorage 中， ket=list ，value=items
    localStorage.setItem('list', JSON.stringify(items));
}

// 取得 localStorage 中為 list 的 key 名稱並轉為陣列，若沒有則為空陣列
function getlocalStorageItem()
{
    return localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')) : [];
}

// setBackToDefault
function setBackToDefault()
{
    listTextInput.value ='';
    editStatus = false;
    editID = '';
    submitbtn.textContent = 'submit';
}

// removeFromLocalStorage
function removeFromLocalStorage(id)
{
    let items = getlocalStorageItem();
    // 將取回的　items 陣列進行篩選， 若按下delete按鈕時取得的 id  不一樣就回傳
    items = items.filter(function(item)
    {
        if(item.id !== id) return item
    })
    // id 一樣的則沒被回傳， 剩下 id 不一樣的轉換成JSON格式傳入 key:list value中
    localStorage.setItem('list', JSON.stringify(items));
}

// editLocalStorage
function editLocalStorage(editID, value)
{
    let items = getlocalStorageItem();
    items = items.filter(function(item)
    {
        if(item.id === editID) item.value = value;
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}

// localStorage.setItem ( 'key' , JSON.stringify(['value1', 'value2', ...等以此類推]))，可將資料放入localStorage
// localStorage.setItem('todolist',JSON.stringify(['item13', 'item24']));
// JSON.parse( localStorage.getItem('上方設定的key名稱') )，可以讀取到 localStorage API 裡的資料(陣列類型)
// const todolistdata = JSON.parse(localStorage.getItem('todolist'));
// localStorage.remove ，可以刪除 localStorage 內的資料
// localStorage.removeItem('todolist')


/*----- Clear Listener Function ----- */
function clearItems()
{
    const items = listContainer.querySelectorAll('.list-items');
    if(list.hasChildNodes()) 
    {
        items.forEach( (item) =>
        {
            list.removeChild(item);
        })
    }

    listContainer.classList.remove('show-Container');
    displayalert('Empty Items', 'alertDanger');
    localStorage.removeItem('list');
    setBackToDefault();
}


/*----- Loading prev List ----- */
function setMyItemsList()
{
    let items = getlocalStorageItem();
    if(items.length > 0)
    {
        items.forEach(function(item)
        {
            createListElement(item.id, item.value)
        })
        listContainer.classList.add('show-Container');
    }
    
}

// Loading and Creat prev ListElement append my listcontainer
function createListElement(id, inputValue)
{
    let item = document.createElement('div');
    item.classList.add('list-items');
    
    // 設立給 list專屬的id號碼，利用上方的 Date 物件
    item.setAttribute('data-id', id);
    item.innerHTML = `<p class="title">${inputValue}</p>
    <div class="item-btn-container">
        <button type="button" class="edit-btn">
            <i class="far fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="far fa-trash-alt"></i>
        </button>
    </div>`;
    // Set Edit Listener AND Set Delete Listener
    const editBtn = item.querySelector('.edit-btn');
    const deleteBtn = item.querySelector('.delete-btn');
    editBtn.addEventListener('click', editItem);
    deleteBtn.addEventListener('click', deleteItem);

    list.append(item);
}