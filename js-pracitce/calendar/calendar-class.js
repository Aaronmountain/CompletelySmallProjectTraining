// 利用 class 類別物件創造專屬的物件，含有建構式、屬性、方法，用 this 封裝在類別物件中
class Calender {
  // 創造實體物件時會執行 constructor 函式
  // constructor 中的參數為創造實體物件時給的參數
  constructor(dateContainer) {
    // 利用 this 封裝，this 會指向 Calender 類。this 也會指向此類所建立實體物件
    this.dateContainer = dateContainer;
    this.state = {
      current: new Date(),
    };
    this.render();
  }

  render() {
    // 處理標題，年和月 ， 0代表一月，以此類推
    let yearMonth = document.createElement('h3');
    yearMonth.classList.add('year-Month');
    yearMonth.textContent =
      this.state.current.getFullYear() + '/' + (this.state.current.getMonth() + 1);
    let list = document.createElement('div');
    list.classList.add('dateList');
    // 清空畫面
    list.innerHTML = '';

    // 取得現在的 年, 月, 第一天
    let firstDay = new Date(this.state.current.getFullYear(), this.state.current.getMonth(), 1);

    // 這個月第一天往前算到禮拜天後，getDate = 1 (代表今天是這個月的第一天)，
    let date = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
    // getDay 會從禮拜天(索引0)，開始算到1號的時候是星期幾，假如1號是禮拜三，而getDay就是 3 ， 0 1 2 3
    date.setDate(date.getDate() - date.getDay());
    while (date < firstDay) {
      // 渲染出從上個月禮拜天到這個月1號的格子
      this.renderDate(date, list);

      // 渲染格子後，禮拜天 + 1 代表 禮拜一， 類推...
      date.setDate(date.getDate() + 1);
    }

    // 渲染出這個月的日期， 這個月第一天 等於 現在這個月 ，往後畫到最後一天， 下個月就停止
    while (date.getMonth() === this.state.current.getMonth()) {
      // 渲染出每一天的格子
      this.renderDate(date, list);

      // 渲染格子後，日期+1
      date.setDate(date.getDate() + 1);
    }

    // 渲染下個月後幾天的的格子，按照順序因為上面迴圈 ，現在 date 已經來到這個月最後一天，取 getDay 一直往後畫，畫到禮拜天等於 0 停下來
    while (date.getDay() > 0) {
      // 渲染出從上個月禮拜天到這個月1號的格子
      this.renderDate(date, list);

      // 渲染格子後，禮拜天 + 1 代表 禮拜一， 類推...
      date.setDate(date.getDate() + 1);
    }

    // 讓格子始終保持 6X7 的狀態
    if (list.querySelectorAll('.date').length !== 42) {
      for (let i = 0; i < 7; i++) {
        if (date.getDay() === i) {
          // 渲染出從上個月禮拜天到這個月1號的格子
          this.renderDate(date, list);

          // 渲染格子後，禮拜天 + 1 代表 禮拜一， 類推...
          date.setDate(date.getDate() + 1);
        }
      }
    }

    // 將 做好的東西 放進 HTML 中的 container 中
    this.dateContainer.innerHTML = '';
    this.dateContainer.append(yearMonth);
    this.dateContainer.append(list);
  }

  renderDate(date, list) {
    let cell = document.createElement('div');
    cell.classList.add('date');
    if (date.getMonth() !== this.state.current.getMonth()) cell.classList.add('fadout');
    cell.textContent = date.getDate();
    list.append(cell);
  }

  prevbtn() {
    this.state.current.setMonth(this.state.current.getMonth() - 1);
    this.render();
  }
  nextbtn() {
    this.state.current.setMonth(this.state.current.getMonth() + 1);
    this.render();
  }
}
let cal1 = new Calender(document.getElementById('Calender'));
