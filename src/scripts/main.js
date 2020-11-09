import compiledTemplate from '../templates/card.hbs';
import FetchService from '../scripts/fetch-service';
import modalService from '../scripts/modal-service';
import notifyService from '../scripts/notify-service';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  gallery: document.querySelector('.gallery'),
};
const fetchService = new FetchService();

refs.searchForm.addEventListener('submit', onSubmit);
refs.gallery.addEventListener('click', modalService.showLargeImg);
//--
async function onSubmit(e) {
  e.preventDefault();
  fetchService.pageNumber = 1;
  fetchService.searchQuery = e.currentTarget.elements.query.value;
  refs.gallery.innerHTML = '';
  modalService.onLoadingMsg.show();
  try {
    const { hits, totalHits } = await fetchService.fetchData();
    renderElements(hits);

    if (totalHits == 0) {
      notifyService('error', 'Bad request');
      return;
    }
    if (totalHits <= fetchService.perPage) {
      notifyService('info', 'All content is loaded');
      return;
    }
    setObserveItem();
  } catch (error) {
    console.warn('fetch error: ', { error });
  }
}

async function onLoadMore() {
  modalService.onLoadingMsg.show();
  try {
    const { hits, totalHits } = await fetchService.nextDataPortion();
    renderElements(hits);
    if (fetchService.currentCount >= totalHits) {
      notifyService('info', 'All content is loaded');
      return;
    }
    setObserveItem();
  } catch (error) {
    console.warn('fetch error: ', { error });
  }
}

function renderElements(data) {
  const string = data.map(compiledTemplate).join('');
  refs.gallery.insertAdjacentHTML('beforeend', string);
  modalService.onLoadingMsg.close();
}

//----
const observerItem = new IntersectionObserver(
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

function setObserveItem() {
  const allGalleryItem = document.querySelectorAll('.gallery-item');
  const lastGalleryItem = allGalleryItem[allGalleryItem.length - 1];
  observerItem.observe(lastGalleryItem);
}
