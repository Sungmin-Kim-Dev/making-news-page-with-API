const API_KEY = `8ca041837c814015be2990bcade21399`;

const searchBox = document.querySelector('.fa-magnifying-glass');
const searchInput = document.getElementById('search-input');

let newsList = [];
const menus = document.querySelectorAll(`.menus button`);

menus.forEach((menu) => menu.addEventListener('click', (event) => getNewsByCategory(event)));

const sideMenu = document.querySelectorAll(`.side-menu-list button`);

sideMenu.forEach((menu) => menu.addEventListener('click', (event) => getNewsByCategory(event)));

searchBox.addEventListener('click', searchBoxToggle);

function searchBoxToggle() {
  document.getElementById('input-area').classList.toggle('d-none');
  searchInput.focus();
}


// Enter 키로 입력
searchInput.addEventListener('keydown', function (event) {
  // .keycode is deprecated.
  if (event.key === 'Enter') {
    searchKeyword(event);
  }
});

function openSide() {
  document.getElementById('side-menu').style.width = '250px';
}
function closeSide() {
  document.getElementById('side-menu').style.width = '0px';
}

const getLatestNews = async () => {
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  console.log('url:', url);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log('newsList:', newsList);
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category);
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log('Data:', data);
  render();
};

const searchKeyword = async (event) => {
  if (searchInput.value == false) {
    return;
  }
  let keyword = searchInput.value;
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log('Data:', data);
  render();

  searchInput.value = '';
};

const render = () => {
  moment.locale();
  let newsHTML = newsList.map((news) => {
    // 삭제된 기사 표시하지 않기
    if (news.title == '[Removed]') {
      return '';
    } else {
      return `
    <section class="article row row-gap-2 p-3">
      <div class="img-area text-center col-lg-4">
        <img class="news-img" src="${news.urlToImage ? news.urlToImage : 'no_image.jpg'}" onerror="this.onerror=null; this.src='no_image.jpg';">
      </div>
      <div class="text-area col-lg-8">
        <h2 class="article-title">${news.title}</h2>
        <p class="main-text">${
          news.description == null || news.description == ''
            ? '내용 없음'
            : news.description.length > 150
            ? news.description.substring(0, 150) + '...'
            : news.description
        }</p>
        <div class="description">${news.source.name || 'no source'} | 
        ${moment(news.publishedAt).locale('ko').fromNow()}</div>
      </div>
    </section>
    `;
    }
  });
  // console.log(newsHTML);
  document.getElementById('main').innerHTML = newsHTML.join('');
};

getLatestNews();
