import compiledTemplate from '../templates/card.hbs';
import FetchService from '../scripts/fetch-service';
const basicLightbox = require('basiclightbox');
const { info, error, defaults } = require('@pnotify/core');
defaults.delay = 2000;

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  ul: document.querySelector('.gallery'),
};
const fetchService = new FetchService();

const dataPerRequest = 12;

refs.searchForm.addEventListener('submit', onSubmit);
refs.ul.addEventListener('click', showLargeImg);
//--
function onSubmit(e) {
  e.preventDefault();
  fetchService.pageNumber = 1;
  fetchService.searchQuery = e.currentTarget.elements.query.value;
  (async () => {
    try {
      const data = await fetchService.fetchData();
      const string = data.hits.map(compiledTemplate).join('');
      refs.ul.innerHTML = string;
      onLoadImgs();
      if (data.totalHits == 0) {
        error({
          text: 'Bad request',
        });
        return;
      }
      if (data.totalHits <= dataPerRequest) {
        info({
          text: 'All content is loaded',
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  })();
}

async function onLoadMore() {
  try {
    const data = await fetchService.nextDataDozen();
    renderElements(data.hits);
    onLoadImgs();
    if (fetchService.currentCount >= data.totalHits) {
      info({
        text: 'All content is loaded',
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

function onLoadImgs() {
  let imgs = document.querySelectorAll('img');
  if (!imgs.length) return;
  let dist = imgs.length - dataPerRequest;
  let counter = 0;
  for (let i = dist >= 0 ? dist : 0; imgs.length > i; i += 1) {
    imgs[i].addEventListener('load', onStartInresect);
    imgs[i].addEventListener('error', onStartInresect);
  }
  function onStartInresect() {
    counter += 1;
    if (counter == dataPerRequest) {
      onIntersection();
    }
  }
}

function renderElements(data) {
  const string = data.map(compiledTemplate).join('');
  refs.ul.insertAdjacentHTML('beforeend', string);
}

function showLargeImg(e) {
  if (!e.target.hasAttribute('data-img')) return;
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.img}" width="800" height="600">
`);
  instance.show();
}
//----
function onIntersection() {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onLoadMore();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.75 },
  );
  const allLi = document.querySelectorAll('.gallery-item');
  const lastLi = allLi[allLi.length - 1];

  observer.observe(lastLi);
}
