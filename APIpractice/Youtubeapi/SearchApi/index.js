const form = document.querySelector('form');
form.addEventListener('submit', formSearch)

function formSearch(e) {
  e.preventDefault();
  const API_KEY = 'AIzaSyD4slm4yGKn4zJbc0r-zEAAGSAazSKveOQ';

  const search = document.getElementById('search').value;

  videoSearch(API_KEY, search, 30)

}

function videoSearch(key, search, maxResults) {
  let videosContainer = document.getElementById('videos');
  videosContainer.innerHTML = '';

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${key}&type=video&maxResults=${maxResults}&q=${search}`;
  // 建立空字串，用於在 forEach 中累加
  let video = '';

  fetch(url)
    .then(res => res.json())
    .then(data => {
      data.items.forEach(item => {
        video += `
        <iframe class='my-2' width='320' height='180' src='http://www.youtube.com/embed/${item.id.videoId}' frameborder='0' allowfullscreen>
        </iframe>
        `
      })
      // 累加完的 video 插入 HTML中
      videosContainer.innerHTML = video;
      document.getElementById('search').value = '';
    })
}
