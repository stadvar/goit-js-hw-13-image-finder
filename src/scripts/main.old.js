import compiledTemplate from '../templates/card.hbs';
import FetchService from '../scripts/fetch-service';
const basicLightbox = require('basiclightbox');

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  ul: document.querySelector('.gallery'),
};
const fetchService = new FetchService();

const dataPerRequest = 12;

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.ul.addEventListener('click', showLargeImg);
//--
function onSubmit(e) {
  e.preventDefault();
  fetchService.pageNumber = 1;
  fetchService.search = e.currentTarget.elements.query.value;
  fetchService
    .fetchData()
    .then(data => {
      const string = data.map(compiledTemplate).join('');
      refs.ul.innerHTML = string;
      refs.loadMoreBtn.disabled = false;
      onLoadImgs();
    })
    .catch(error => {
      console.log(error);
    });
}

function onLoadMore() {
  refs.loadMoreBtn.disabled = true;
  refs.loadMoreBtn.children[0].classList.remove('is-hidden');
  fetchService.incrementPage();
  fetchService
    .fetchData()
    .then(data => {
      renderElements(data);
      refs.loadMoreBtn.children[0].classList.add('is-hidden');
      refs.loadMoreBtn.disabled = false;
      //--
      onLoadImgs();
    })
    .catch(error => {
      console.log(error);
    });
}

function onLoadImgs() {
  let imgs = document.querySelectorAll('img');
  if (!imgs.length) return;
  let dist = imgs.length - dataPerRequest;
  let counter = 0;
  for (let i = dist >= 0 ? dist : 0; imgs.length > i; i += 1) {
    imgs[i].addEventListener('load', () => {
      counter += 1;
      if (counter == dataPerRequest) {
        scrollTo(getCoords(imgs[dist]).top);
      }
    });
  }
}

function scrollTo(pos) {
  window.scrollTo({
    top: pos,
    left: 0,
    behavior: 'smooth',
  });
}

function renderElements(data) {
  const string = data.map(compiledTemplate).join('');
  refs.ul.insertAdjacentHTML('beforeend', string);
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
  };
}

function showLargeImg(e) {
  if (!e.target.hasAttribute('data-img')) return;
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.img}" width="800" height="600">
`);
  instance.show();
}
