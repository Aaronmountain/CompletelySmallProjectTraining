// 資料(M)
let state = null;

// 畫面初始化 
function init() {
    state =
    {
        current: new Date()
    };
    render();
}

document.querySelector('.prevbtn').addEventListener('click', prevbtn)
document.querySelector('.nextbtn').addEventListener('click', nextbtn)
function prevbtn() {
    state.current.setMonth(state.current.getMonth() - 1);
    render();
}
function nextbtn() {
    state.current.setMonth(state.current.getMonth() + 1);
    render();
}

// 提取資料渲染畫面(V)
function render() {
    let yearMonth = document.querySelector('.year-Month');
    yearMonth.textContent = state.current.getFullYear() + '/' + (state.current.getMonth() + 1);
    let list = document.getElementById('dateList');
    list.innerHTML = '';

    let firstDay = new Date(state.current.getFullYear(), state.current.getMonth(), 1);

    let date = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);

    date.setDate(date.getDate() - date.getDay());
    // prev month
    while (date < firstDay) {
        renderDate(date, list);
        date.setDate(date.getDate() + 1);
    }

    // this month
    while (date.getMonth() === state.current.getMonth()) {
        renderDate(date, list);
        date.setDate(date.getDate() + 1);
    }

    // next month
    while (date.getDay() > 0) {
        renderDate(date, list);
        date.setDate(date.getDate() + 1);
    }

    if (list.querySelectorAll(".date").length !== 42) {
        for (let i = 0; i < 7; i++) {
            if (date.getDay() === i) {
                renderDate(date, list);
                date.setDate(date.getDate() + 1);
            }
        }
    }
}

function renderDate(date, list) {
    let cell = document.createElement('div');
    cell.classList.add('date');
    if (date.getMonth() !== state.current.getMonth()) cell.classList.add('fadout');
    cell.textContent = date.getDate();
    list.append(cell);
}

// 處理流程(C)
init();