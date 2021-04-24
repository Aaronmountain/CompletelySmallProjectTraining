const title =document.querySelector('.title');
const addtext = (text) =>
{
    return [...text].map(word=>
    {
        return `<span>${word}</span>`
    }).join('');
}

title.innerHTML = addtext('我的JS小練習持之以恆');