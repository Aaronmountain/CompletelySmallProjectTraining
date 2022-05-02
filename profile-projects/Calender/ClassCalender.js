class Calender {
    constructor(dateContainer) {
        this.dateContainer = dateContainer;
        this.state =
        {
            current: new Date()
        };
        this.render();
    }

    render() {
        let yearMonth = document.createElement('h3');
        yearMonth.classList.add('year-Month');
        yearMonth.textContent = this.state.current.getFullYear() + '/' + (this.state.current.getMonth() + 1);
        let list = document.createElement('div');
        list.classList.add('dateList');

        list.innerHTML = '';

        let firstDay = new Date(this.state.current.getFullYear(), this.state.current.getMonth(), 1);

        let date = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);

        date.setDate(date.getDate() - date.getDay());

        // prev month
        while (date < firstDay) {
            this.renderDate(date, list);
            date.setDate(date.getDate() + 1);
        }

        // this month
        while (date.getMonth() === this.state.current.getMonth()) {
            this.renderDate(date, list);
            date.setDate(date.getDate() + 1);
        }

        //next month
        while (date.getDay() > 0) {
            this.renderDate(date, list);
            date.setDate(date.getDate() + 1);
        }

        if (list.querySelectorAll(".date").length !== 42) {
            for (let i = 0; i < 7; i++) {
                if (date.getDay() === i) {
                    this.renderDate(date, list);
                    date.setDate(date.getDate() + 1);
                }
            }
        }

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