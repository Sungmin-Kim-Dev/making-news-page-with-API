const API_KEY = `8ca041837c814015be2990bcade21399`;

const searchBtn = document.querySelector('.fa-magnifying-glass');

let newsList = [];

searchBtn.addEventListener('click', searchInput);

function searchInput() {
  document.getElementById('input-area').classList.toggle('d-none');
}
function openSide() {
  document.getElementById('side-menu').style.width = '250px';
}
function closeSide() {
  document.getElementById('side-menu').style.width = '0px';
}

const getLatestNews = async () => {
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  const url = new URL(`https://frabjous-medovik-94ad71.netlify.app/top-headlines`);
  console.log('url:', url);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  // console.log('newsList:', newsList);
};

const render = () => {
  let newsHTML = newsList.map(
    (news) => `
    <section class="article row row-gap-2 p-3">
      <div class="img-area col-lg-4">
        <img class="news-img" src="${news.urlToImage}">
      </div>
      <div class="text-area col-lg-8">
        <h2 class="article-title">${news.title}</h2>
        <p class="main-text">${news.description}</p>
        <div class="description">${news.source.name}  ${news.publishedAt}</div>
      </div>
    </section>
    `
  );
  // console.log(newsHTML);
  document.getElementById('main').innerHTML = newsHTML.join('');
};

getLatestNews();
