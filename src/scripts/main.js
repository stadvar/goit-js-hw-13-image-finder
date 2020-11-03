import compiledTemplate from '../templates/card.hbs';
import FetchService from '../scripts/fetch-service';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  ul: document.querySelector('.gallery'),
};
const fetchService = new FetchService();

refs.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  fetchService.pageNumber = 1;
  fetchService.search = e.currentTarget.elements.query.value;
  fetchService
    .run()
    .then(data => {
      const string = data.map(compiledTemplate).join('');
      refs.ul.innerHTML = string;
      refs.loadMoreBtn.disabled = false;
      onLoadImgs();
    })
    .catch(error => {
      console.log(error);
    });
});
//--
refs.loadMoreBtn.addEventListener('click', () => {
  refs.loadMoreBtn.disabled = true;
  refs.loadMoreBtn.children[0].classList.remove('is-hidden');
  fetchService.incrementPage();
  fetchService
    .run()
    .then(data => {
      const string = data.map(compiledTemplate).join('');
      refs.ul.insertAdjacentHTML('beforeend', string);
      refs.loadMoreBtn.children[0].classList.add('is-hidden');
      refs.loadMoreBtn.disabled = false;
      //--
      onLoadImgs();
    })
    .catch(error => {
      console.log(error);
    });
});
//--
function onLoadImgs() {
  let imgs = document.querySelectorAll('img');
  if (!imgs.length) return;
  let dist = imgs.length - 12;
  let counter = 0;
  for (let i = dist; imgs.length > i; i += 1) {
    imgs[i].addEventListener('load', () => {
      counter += 1;
      if (counter == 12) {
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

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
  };
}
