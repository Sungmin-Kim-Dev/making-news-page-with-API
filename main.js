const API_KEY = `8ca041837c814015be2990bcade21399`;
let news = [];

const getLatestNews = async () => {
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  const url = new URL(`https://frabjous-medovik-94ad71.netlify.app/top-headlines`);
  console.log('url:', url);
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log('news:', news);
};
getLatestNews();

for (let i = 0; i < 5; i++) {
  console.log('after:', i);
}
