const basicLightbox = require('basiclightbox');

const onLoadingMsg = basicLightbox.create(`
        <p class='loading'>loading...</p>
`);

function showLargeImg(e) {
  if (!e.target.hasAttribute('data-img')) return;
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.img}" width="800" height="600">
`);
  instance.show();
}

export default { onLoadingMsg, showLargeImg };
