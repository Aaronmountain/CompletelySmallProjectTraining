// 資料(M)
let state = null;

// 畫面初始化 
function init()
{
    state = 
    {
        current:new Date()
    };
    render();
}
// 點擊按鈕代表，設定月份 state.current.getMonth() ，並重新渲染畫面
document.querySelector('.prevbtn').addEventListener('click',prevbtn)
document.querySelector('.nextbtn').addEventListener('click',nextbtn)
function prevbtn()
{
    state.current.setMonth(state.current.getMonth() - 1);
    render();
}
function nextbtn()
{
    state.current.setMonth(state.current.getMonth() + 1);
    render() ;
}

// 提取資料渲染畫面(V)
function render()
{
    // 處理標題，年和月 ， 0代表一月，以此類推
    let yearMonth = document.querySelector('.year-Month');
    yearMonth.textContent = state.current.getFullYear() + '/' + (state.current.getMonth() + 1);
    let list = document.getElementById('dateList'); 
    // 清空畫面
    list.innerHTML = '';

    // 取得現在的 年, 月, 第一天
    let firstDay = new Date(state.current.getFullYear(), state.current.getMonth(), 1);

    // 這個月第一天往前算到禮拜天後，getDate = 1 (代表今天是這個月的第一天)， 
    let date = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
    // getDay 會從禮拜天(索引0)，開始算到1號的時候是星期幾，假如1號是禮拜三，而getDay就是 3 ， 0 1 2 3
    date.setDate(date.getDate() - date.getDay());
    while(date < firstDay)
    {
        // 渲染出從上個月禮拜天到這個月1號的格子
        renderDate(date, list);

        // 渲染格子後，禮拜天 + 1 代表 禮拜一， 類推...
        date.setDate(date.getDate() + 1);
    }

    // 渲染出這個月的日期， 這個月第一天 等於 現在這個月 ，往後畫到最後一天， 下個月就停止  
    while(date.getMonth() === state.current.getMonth())
    {
        // 渲染出每一天的格子
        renderDate(date, list);

        // 渲染格子後，日期+1
        date.setDate(date.getDate() + 1);
    }

    // 渲染下個月後幾天的的格子，按照順序因為上面迴圈 ，現在 date 已經來到這個月最後一天，取 getDay 一直往後畫，畫到禮拜天等於 0 停下來
    while(date.getDay() > 0)
    {
        // 渲染出從上個月禮拜天到這個月1號的格子
        renderDate(date, list);

        // 渲染格子後，禮拜天 + 1 代表 禮拜一， 類推...
        date.setDate(date.getDate() + 1);

    }

    // 讓格子始終保持 6X7 的狀態
    if(list.querySelectorAll(".date").length !== 42)
    {
        for(let i = 0; i < 7; i++)    
        {
            if(date.getDay() === i )
            {
                // 渲染出從上個月禮拜天到這個月1號的格子
                renderDate(date, list);

                // 渲染格子後，禮拜天 + 1 代表 禮拜一， 類推...
                date.setDate(date.getDate() + 1);
            }
        }
    }
}

function renderDate(date, list)
{
    let cell = document.createElement('div');
    cell.classList.add('date');
    if(date.getMonth() !== state.current.getMonth()) cell.classList.add('fadout');
    cell.textContent = date.getDate();
    list.append(cell);
}

// 處理流程(C)
init();