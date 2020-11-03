export default class FetchService {
  constructor() {
    this.search = '';
    this.pageNumber = 1;
  }
  async run() {
    try {
      const query = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.search}&page=${this.pageNumber}&per_page=12&key=18927781-76591304de9a35a1d49e108a5`;
      const response = await fetch(query);

      const json = await response.json();
      const articles = json.hits;
      return articles;
    } catch (error) {
      //   console.log(error);
      throw error;
    }
  }
  incrementPage() {
    this.pageNumber += 1;
  }
}
