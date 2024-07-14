const API_KEY = `8ca041837c814015be2990bcade21399`;
const myURL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const noonaURL = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`;

// API 교체를 쉽게 하기 위하여 지정
// let runningURL = myURL;
let runningURL = myURL;

let url = new URL(runningURL);

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

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set('page', page); // &page=1
    url.searchParams.set('pageSize', pageSize); // &pageSize=10
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error('No matches for your search.');
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      console.log(newsList);
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log('error', error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(runningURL);
  await getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  if (runningURL === myURL) {
    url = new URL(runningURL + `&category=${category}`);
  } else {
    url = new URL(runningURL + `?category=${category}`);
  }
  page = 1;
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
  page = 1;
  await getNews();
  searchInput.value = '';
};

const render = () => {
  let newsHTML = newsList.map((news) => {
    // 삭제된 기사 표시하지 않기
    if (news.title === '[Removed]') {
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
          ${moment(news.publishedAt).fromNow()}</div>
        </div>
      </section>
      `;
    }
  });
  document.getElementById('main').innerHTML = newsHTML.join('');
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger text-center h3" role="alert">
        ${errorMessage}
      </div>`;
  document.getElementById('main').innerHTML = errorHTML;
};

const paginationRender = () => {
  // totalResults
  // page
  // pageSize
  // groupSize
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  // firstPage
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  let firstPage = lastPage - (groupSize - 1);
  if (firstPage <= 0) {
    firstPage = 1;
  }

  // 표시 여부에 관계없이 페이지네이션 위치를 고정하기 위해
  // display: none 대신 visibility: hidden 사용
  let paginationHTML = `
  <li class="page-item page-prev ${page === 1 ? 'invisible' : ''}" onclick='moveToPage(1)'>
    <a class="page-link" href="#">&lt&lt</a>
  </li>
  <li class="page-item page-prev ${page === 1 ? 'invisible' : ''}" onclick='moveToPage(${page - 1})'>
    <a class="page-link" href="#">&lt</a>
  </li>
  `;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
    <li class="page-item ${i === page ? 'active' : ''}" onclick='moveToPage(${i})'>
      <a class="page-link" href="#">${i}</a>
    </li>
    `;
  }
  paginationHTML += `
  <li class="page-item page-next ${page === totalPages ? 'invisible' : ''}" onclick='moveToPage(${page + 1})'>
    <a class="page-link" href="#">&gt</a>
  </li>
  <li class="page-item page-next ${page === totalPages ? 'invisible' : ''}" onclick='moveToPage(${totalPages})'>
    <a class="page-link" href="#">&gt&gt</a>
  </li>
  `;

  document.querySelector('.pagination').innerHTML = paginationHTML;
};

const moveToPage = (pageNumber) => {
  console.log('move to page', pageNumber);
  page = pageNumber;
  getNews();
};

getLatestNews();
