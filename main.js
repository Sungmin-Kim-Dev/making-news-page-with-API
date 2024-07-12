const API_KEY = `8ca041837c814015be2990bcade21399`;

const searchBox = document.querySelector('.fa-magnifying-glass');
const searchInput = document.getElementById('search-input');

let newsList = [];
const menus = document.querySelectorAll(`.menus button`);

menus.forEach((menu) => menu.addEventListener('click', (event) => getNewsByCategory(event)));

console.log(menus);

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

const myURL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const noonaURL = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`;

let runningURL = myURL;

let url = new URL(runningURL);

const getNews = async () => {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const getLatestNews = async () => {
  url = new URL(runningURL);
  await getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent;
  if (runningURL === myURL) {
    url = new URL(runningURL + `&category=${category.toLowerCase()}`);
  } else {
    url = new URL(runningURL + `?category=${category.toLowerCase()}`);
  }
  await getNews();
};

const searchKeyword = async (event) => {
  if (searchInput.value == false) {
    return;
  }
  let keyword = searchInput.value;
  if (runningURL === myURL) {
    url = new URL(runningURL + `&q=${keyword}`);
  } else {
    url = new URL(runningURL + `?q=${keyword}`);
  }
  await getNews();
  searchInput.value = '';
};

const render = () => {
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
